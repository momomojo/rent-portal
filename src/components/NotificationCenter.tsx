import { useState } from 'react';
import { format } from 'date-fns';
import { Bell, X, Check, ExternalLink } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import { Notification } from '../types/notification';

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, handleNotificationAction } = useNotifications();

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'payment_due':
      case 'payment_received':
      case 'payment_late':
        return '💰';
      case 'maintenance_update':
        return '🔧';
      case 'document_shared':
        return '📄';
      case 'lease_expiring':
        return '📅';
      case 'message_received':
        return '💬';
      case 'application_status':
        return '📝';
      default:
        return '🔔';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-gray-500"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
              <div className="flex space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-indigo-600 hover:text-indigo-900"
                  >
                    Mark all as read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 ${notification.read ? 'bg-white' : 'bg-indigo-50'}`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-500">{notification.message}</p>
                        {notification.actions && notification.actions.length > 0 && (
                          <div className="mt-2 flex space-x-2">
                            {notification.actions.map((action, index) => (
                              <button
                                key={index}
                                onClick={() => handleNotificationAction(notification, action)}
                                className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium text-indigo-600 hover:bg-indigo-50"
                              >
                                {action.label}
                                <ExternalLink className="ml-1.5 h-4 w-4" />
                              </button>
                            ))}
                          </div>
                        )}
                        <p className="mt-1 text-xs text-gray-400">
                          {format(notification.createdAt, 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="flex-shrink-0 text-indigo-600 hover:text-indigo-900"
                        >
                          <Check className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}