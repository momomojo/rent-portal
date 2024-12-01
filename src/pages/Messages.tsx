import { useState, useEffect } from 'react';
import { Send, Search, History, Users } from 'lucide-react';
import { useAuthState } from '../hooks/useAuthState';
import { db } from '../lib/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  addDoc,
  onSnapshot,
  getDocs,
} from 'firebase/firestore';

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  timestamp: any;
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
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    if (!user) return;

    // Fetch user role
    const fetchUserRole = async () => {
      const userDoc = await getDocs(query(collection(db, 'users'), where('uid', '==', user.uid)));
      if (!userDoc.empty) {
        setUserRole(userDoc.docs[0].data().role);
      }
    };
    fetchUserRole();

    // Fetch available contacts based on role
    const fetchContacts = async () => {
      let contactsQuery;
      if (userRole === 'admin') {
        contactsQuery = query(collection(db, 'users'));
      } else if (userRole === 'landlord') {
        contactsQuery = query(collection(db, 'users'), where('assignedLandlord', '==', user.uid));
      } else {
        contactsQuery = query(
          collection(db, 'users'),
          where('role', 'in', ['admin', 'landlord'])
        );
      }

      const snapshot = await getDocs(contactsQuery);
      setUsers(snapshot.docs.map(doc => ({ ...doc.data() } as User)));
    };
    fetchContacts();

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

    return () => unsubscribe();
  }, [user, userRole]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedUser || !newMessage.trim()) return;

    try {
      const messageRef = collection(db, 'messages');
      await addDoc(messageRef, {
        content: newMessage,
        senderId: user.uid,
        senderName: user.displayName || user.email,
        receiverId: selectedUser.uid,
        receiverName: selectedUser.name,
        timestamp: new Date(),
        participants: [user.uid, selectedUser.uid]
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMessages = selectedUser
    ? messages.filter(m => 
        m.senderId === selectedUser.uid || m.receiverId === selectedUser.uid
      )
    : messages;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden min-h-[600px]">
        <div className="grid grid-cols-12 h-full">
          {/* Sidebar */}
          <div className="col-span-4 border-r border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab('messages')}
                  className={`flex-1 py-2 px-4 rounded-md ${
                    activeTab === 'messages'
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Messages
                </button>
                <button
                  onClick={() => setActiveTab('contacts')}
                  className={`flex-1 py-2 px-4 rounded-md ${
                    activeTab === 'contacts'
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Contacts
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`flex-1 py-2 px-4 rounded-md ${
                    activeTab === 'history'
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  History
                </button>
              </div>
              <div className="mt-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="overflow-y-auto h-[calc(100vh-280px)]">
              {activeTab === 'contacts' && (
                <div className="divide-y divide-gray-200">
                  {filteredUsers.map((contact) => (
                    <button
                      key={contact.uid}
                      onClick={() => setSelectedUser(contact)}
                      className={`w-full p-4 text-left hover:bg-gray-50 flex items-center space-x-3 ${
                        selectedUser?.uid === contact.uid ? 'bg-gray-50' : ''
                      }`}
                    >
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
                          <span className="text-white font-medium">
                            {contact.name[0].toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {contact.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {contact.role}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {activeTab === 'messages' && (
                <div className="divide-y divide-gray-200">
                  {filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      className="p-4 hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
                              <span className="text-white font-medium">
                                {message.senderName[0].toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {message.senderName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {message.content}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {message.timestamp?.toDate().toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'history' && (
                <div className="divide-y divide-gray-200">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className="p-4 hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {message.senderName} → {message.receiverName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {message.content}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500">
                          {message.timestamp?.toDate().toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="col-span-8 flex flex-col">
            {selectedUser ? (
              <>
                <div className="p-4 border-b border-gray-200">
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
                        <p>{message.content}</p>
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
                </div>

                <div className="p-4 border-t border-gray-200">
                  <form onSubmit={handleSendMessage} className="flex space-x-4">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
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