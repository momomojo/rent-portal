import { useState, useEffect, useRef } from 'react';
import { Send, Search, History, Users, Paperclip, Image, File } from 'lucide-react';
import { useAuthState } from '../hooks/useAuthState';
import { db, storage } from '../lib/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  addDoc,
  onSnapshot,
  getDocs,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  timestamp: any;
  category: 'maintenance' | 'payment' | 'general';
  attachments?: {
    type: 'image' | 'document';
    url: string;
    name: string;
  }[];
  read: boolean;
}

interface User {
  uid: string;
  name: string;
  email: string;
  role: string;
  assignedLandlord?: string;
}

export default function Messages() {
  const { user } = useAuthState();
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'messages' | 'contacts' | 'history'>('messages');
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<Message['category']>('general');
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;

    // Fetch user role and contacts
    const fetchUserData = async () => {
      const userDoc = await getDocs(query(collection(db, 'users'), where('uid', '==', user.uid)));
      if (!userDoc.empty) {
        const userData = userDoc.docs[0].data();
        let contactsQuery;

        if (userData.role === 'admin') {
          contactsQuery = query(collection(db, 'users'));
        } else if (userData.role === 'landlord') {
          contactsQuery = query(collection(db, 'users'), where('assignedLandlord', '==', user.uid));
        } else {
          contactsQuery = query(
            collection(db, 'users'),
            where('role', 'in', ['admin', 'landlord'])
          );
        }

        const snapshot = await getDocs(contactsQuery);
        setUsers(snapshot.docs.map(doc => ({ ...doc.data() } as User)));
      }
    };

    // Subscribe to messages
    const messagesQuery = query(
      collection(db, 'messages'),
      where('participants', 'array-contains', user.uid),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messageData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];
      setMessages(messageData);
      setLoading(false);
    });

    fetchUserData();
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedUser || !newMessage.trim()) return;

    try {
      // Upload attachments if any
      const uploadedAttachments = await Promise.all(
        attachments.map(async (file) => {
          const fileRef = ref(storage, `messages/${uuidv4()}_${file.name}`);
          await uploadBytes(fileRef, file);
          const url = await getDownloadURL(fileRef);
          return {
            type: file.type.startsWith('image/') ? 'image' : 'document',
            url,
            name: file.name,
          };
        })
      );

      const messageRef = collection(db, 'messages');
      await addDoc(messageRef, {
        content: newMessage,
        senderId: user.uid,
        senderName: user.displayName || user.email,
        receiverId: selectedUser.uid,
        receiverName: selectedUser.name,
        timestamp: new Date(),
        participants: [user.uid, selectedUser.uid],
        category,
        attachments: uploadedAttachments,
        read: false,
      });

      setNewMessage('');
      setAttachments([]);
      setCategory('general');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMessages = selectedUser
    ? messages.filter(m => 
        (m.senderId === selectedUser.uid || m.receiverId === selectedUser.uid)
      )
    : messages;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden min-h-[600px]">
        <div className="grid grid-cols-12 h-full">
          {/* Sidebar */}
          <div className="col-span-4 border-r border-gray-200">
            {/* ... (previous sidebar code remains the same) ... */}
          </div>

          {/* Chat Area */}
          <div className="col-span-8 flex flex-col">
            {selectedUser ? (
              <>
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
                          <span className="text-white font-medium">
                            {selectedUser.name[0].toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div>
                        <h2 className="text-lg font-medium text-gray-900">
                          {selectedUser.name}
                        </h2>
                        <p className="text-sm text-gray-500">
                          {selectedUser.role}
                        </p>
                      </div>
                    </div>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as Message['category'])}
                      className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="general">General</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="payment">Payment</option>
                    </select>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.senderId === user?.uid
                          ? 'justify-end'
                          : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.senderId === user?.uid
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="text-xs mb-1">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            message.category === 'maintenance'
                              ? 'bg-yellow-100 text-yellow-800'
                              : message.category === 'payment'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {message.category}
                          </span>
                        </div>
                        <p>{message.content}</p>
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {message.attachments.map((attachment, index) => (
                              <div key={index} className="flex items-center">
                                {attachment.type === 'image' ? (
                                  <img
                                    src={attachment.url}
                                    alt={attachment.name}
                                    className="max-w-xs rounded"
                                  />
                                ) : (
                                  <a
                                    href={attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-2 text-sm underline"
                                  >
                                    <File className="h-4 w-4" />
                                    <span>{attachment.name}</span>
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        <p
                          className={`text-xs mt-1 ${
                            message.senderId === user?.uid
                              ? 'text-indigo-200'
                              : 'text-gray-500'
                          }`}
                        >
                          {message.timestamp?.toDate().toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t border-gray-200">
                  {attachments.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-2">
                      {attachments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1"
                        >
                          {file.type.startsWith('image/') ? (
                            <Image className="h-4 w-4" />
                          ) : (
                            <File className="h-4 w-4" />
                          )}
                          <span className="text-sm truncate max-w-xs">
                            {file.name}
                          </span>
                          <button
                            onClick={() => removeAttachment(index)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <form onSubmit={handleSendMessage} className="flex space-x-4">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      multiple
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Paperclip className="h-4 w-4" />
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No conversation selected
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Choose a contact to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}