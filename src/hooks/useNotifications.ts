import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, updateDoc, doc, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthState } from './useAuthState';
import type { Notification, NotificationAction } from '../types/notification';
import { toast } from 'sonner';

export function useNotifications() {
  const { user } = useAuthState();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Subscribe to notifications
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      where('expiresAt', '>', Date.now()),
      orderBy('expiresAt', 'desc'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notificationData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[];
      
      setNotifications(notificationData);
      setUnreadCount(notificationData.filter(n => !n.read).length);
      setLoading(false);

      // Show toast for new notifications
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const notification = change.doc.data() as Notification;
          if (!notification.read) {
            toast(notification.title, {
              description: notification.message,
              action: notification.actions?.[0] ? {
                label: notification.actions[0].label,
                onClick: () => handleNotificationAction(notification, notification.actions![0])
              } : undefined
            });
          }
        }
      });
    });

    // Request push notification permission
    requestNotificationPermission();

    return () => unsubscribe();
  }, [user]);

  const requestNotificationPermission = async () => {
    try {
      const permission = await window.Notification.requestPermission();
      if (permission === 'granted') {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY
        });

        // Store subscription in Firestore
        if (user) {
          await updateDoc(doc(db, 'users', user.uid), {
            pushSubscription: JSON.stringify(subscription)
          });
        }
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), {
        read: true,
        updatedAt: Date.now()
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      const batch = writeBatch(db);
      notifications
        .filter(n => !n.read)
        .forEach(notification => {
          const ref = doc(db, 'notifications', notification.id);
          batch.update(ref, { 
            read: true,
            updatedAt: Date.now()
          });
        });
      await batch.commit();
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to mark notifications as read');
    }
  };

  const handleNotificationAction = async (
    notification: Notification,
    action: NotificationAction
  ) => {
    try {
      // Mark notification as read
      await markAsRead(notification.id);

      // Handle action
      if (action.link) {
        window.location.href = action.link;
      }

      // Additional action handling based on action.action type
      switch (action.action) {
        case 'approve_maintenance':
          // Handle maintenance approval
          break;
        case 'view_payment':
          // Handle payment view
          break;
        // Add more action handlers as needed
      }
    } catch (error) {
      console.error('Error handling notification action:', error);
      toast.error('Failed to process notification action');
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    handleNotificationAction
  };
}