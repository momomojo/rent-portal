import React, { useState } from 'react';
import { useAuthState } from '@shared/hooks/useAuthState';

interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface Conversation {
  id: string;
  participant: {
    id: string;
    name: string;
    avatar: string;
  };
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

const Messages: React.FC = () => {
  const { user } = useAuthState();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  // Mock data - replace with actual API calls
  const conversations: Conversation[] = [];
  const messages: Message[] = [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // TODO: Implement send message logic
    setNewMessage('');
  };

  const renderConversationList = () => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg font-medium text-gray-900">Messages</h2>
      </div>
      {conversations.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No conversations yet</div>
      ) : (
        <div className="divide-y divide-gray-200">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation.id)}
              className={`w-full p-4 hover:bg-gray-50 flex items-start space-x-3 ${
                selectedConversation === conversation.id ? 'bg-blue-50' : ''
              }`}
            >
              <img
                src={conversation.participant.avatar}
                alt=""
                className="h-10 w-10 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    {conversation.participant.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {conversation.lastMessageTime}
                  </p>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {conversation.lastMessage}
                </p>
              </div>
              {conversation.unreadCount > 0 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {conversation.unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const renderMessageThread = () => {
    if (!selectedConversation) {
      return (
        <div className="h-full flex items-center justify-center bg-gray-50 text-gray-500">
          Select a conversation to start messaging
        </div>
      );
    }

    return (
      <div className="h-full flex flex-col bg-white rounded-lg shadow">
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-4">
              No messages in this conversation
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender.id === user?.id ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs sm:max-w-md px-4 py-2 rounded-lg ${
                      message.sender.id === user?.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender.id === user?.id
                          ? 'text-blue-200'
                          : 'text-gray-500'
                      }`}
                    >
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="p-4 border-t">
          <form onSubmit={handleSendMessage} className="flex space-x-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Messages</h1>
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">{renderConversationList()}</div>
          <div className="lg:col-span-2">{renderMessageThread()}</div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
