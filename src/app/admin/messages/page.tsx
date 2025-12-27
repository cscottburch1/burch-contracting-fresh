'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Icon from '@/components/ui/Icon';

interface Message {
  id: number;
  customer_id: number;
  customer_name: string;
  customer_email: string;
  sender_type: 'customer' | 'admin';
  sender_name: string;
  subject: string | null;
  message: string;
  is_read: boolean;
  parent_message_id: number | null;
  created_at: string;
  unread_count: number;
}

interface CustomerConversation {
  customer_id: number;
  customer_name: string;
  customer_email: string;
  unread_count: number;
  last_message: string;
  last_message_time: string;
}

export default function AdminMessagesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
  const [customerMessages, setCustomerMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/admin/messages');
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      } else if (res.status === 401) {
        router.push('/admin');
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerMessages = async (customerId: number) => {
    try {
      const res = await fetch(`/api/admin/messages/customer/${customerId}`);
      if (res.ok) {
        const data = await res.json();
        setCustomerMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Failed to fetch customer messages:', error);
    }
  };

  const sendReply = async (customerId: number, parentId: number | null = null) => {
    if (!replyText.trim()) return;

    setSending(true);
    try {
      const res = await fetch('/api/admin/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: customerId,
          message: replyText,
          parent_message_id: parentId,
        }),
      });

      if (res.ok) {
        setReplyText('');
        setReplyingTo(null);
        await fetchCustomerMessages(customerId);
        await fetchMessages(); // Refresh sidebar counts
      }
    } catch (error) {
      console.error('Failed to send reply:', error);
    } finally {
      setSending(false);
    }
  };

  const markAsRead = async (messageId: number) => {
    try {
      await fetch(`/api/admin/messages/${messageId}/read`, {
        method: 'POST',
      });
      setCustomerMessages(customerMessages.map(m => 
        m.id === messageId ? { ...m, is_read: true } : m
      ));
      await fetchMessages(); // Refresh unread counts
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const selectCustomer = (customerId: number) => {
    setSelectedCustomer(customerId);
    fetchCustomerMessages(customerId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  // Group messages by customer
  const conversations: CustomerConversation[] = [];
  const customerMap = new Map<number, CustomerConversation>();
  
  messages.forEach(msg => {
    if (!customerMap.has(msg.customer_id)) {
      customerMap.set(msg.customer_id, {
        customer_id: msg.customer_id,
        customer_name: msg.customer_name,
        customer_email: msg.customer_email,
        unread_count: msg.unread_count,
        last_message: msg.message,
        last_message_time: msg.created_at,
      });
    }
  });
  conversations.push(...Array.from(customerMap.values()));

  // Thread messages
  const threads = customerMessages.filter(m => !m.parent_message_id);
  const getReplies = (parentId: number) => 
    customerMessages.filter(m => m.parent_message_id === parentId);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar - Customer List */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">Customer Messages</h1>
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="text-gray-600 hover:text-gray-800"
              >
                <Icon name="X" size={24} />
              </button>
            </div>
            <Link
              href="/admin/customers"
              className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-2"
            >
              <Icon name="Users" size={16} />
              View All Customers
            </Link>
          </div>

          <div className="divide-y divide-gray-200">
            {conversations.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Icon name="MessageCircle" size={48} className="mx-auto mb-2 text-gray-400" />
                <p className="text-sm">No messages yet</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.customer_id}
                  onClick={() => selectCustomer(conv.customer_id)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition ${
                    selectedCustomer === conv.customer_id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-gray-900">{conv.customer_name}</h3>
                    {conv.unread_count > 0 && (
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        {conv.unread_count}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate mb-1">{conv.last_message}</p>
                  <p className="text-xs text-gray-500">{formatDate(conv.last_message_time)}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {!selectedCustomer ? (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <Icon name="MessageCircle" size={64} className="mx-auto text-gray-400 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Select a Customer</h2>
                <p className="text-gray-600">Choose a conversation from the sidebar to view messages</p>
              </div>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                {threads.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No messages in this conversation</p>
                  </div>
                ) : (
                  threads.map((thread) => {
                    const replies = getReplies(thread.id);
                    const isCustomerMessage = thread.sender_type === 'customer';
                    
                    return (
                      <div key={thread.id} className="space-y-3">
                        {/* Thread Message */}
                        <div className={`flex ${isCustomerMessage ? 'justify-start' : 'justify-end'}`}>
                          <div className={`max-w-2xl ${isCustomerMessage ? 'bg-white' : 'bg-blue-600 text-white'} rounded-lg shadow-md p-4`}>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold text-sm">
                                {isCustomerMessage ? '👤 ' : ''}
                                {thread.sender_name}
                              </span>
                              <span className={`text-xs ${isCustomerMessage ? 'text-gray-500' : 'text-blue-100'}`}>
                                {formatDate(thread.created_at)}
                              </span>
                              {!thread.is_read && isCustomerMessage && (
                                <button
                                  onClick={() => markAsRead(thread.id)}
                                  className="ml-2 text-blue-600 text-xs hover:underline"
                                >
                                  Mark read
                                </button>
                              )}
                            </div>
                            {thread.subject && (
                              <h4 className="font-bold mb-1">{thread.subject}</h4>
                            )}
                            <p className="whitespace-pre-wrap">{thread.message}</p>
                          </div>
                        </div>

                        {/* Replies */}
                        {replies.map((reply) => {
                          const isCustomerReply = reply.sender_type === 'customer';
                          return (
                            <div key={reply.id} className={`flex ${isCustomerReply ? 'justify-start' : 'justify-end'} ml-8`}>
                              <div className={`max-w-xl ${isCustomerReply ? 'bg-gray-100' : 'bg-blue-500 text-white'} rounded-lg shadow p-3`}>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-sm">
                                    {isCustomerReply ? '👤 ' : ''}
                                    {reply.sender_name}
                                  </span>
                                  <span className={`text-xs ${isCustomerReply ? 'text-gray-500' : 'text-blue-100'}`}>
                                    {formatDate(reply.created_at)}
                                  </span>
                                  {!reply.is_read && isCustomerReply && (
                                    <button
                                      onClick={() => markAsRead(reply.id)}
                                      className="ml-2 text-blue-600 text-xs hover:underline"
                                    >
                                      Mark read
                                    </button>
                                  )}
                                </div>
                                <p className="whitespace-pre-wrap text-sm">{reply.message}</p>
                              </div>
                            </div>
                          );
                        })}

                        {/* Reply Button */}
                        {replyingTo !== thread.id && (
                          <div className="flex justify-end">
                            <button
                              onClick={() => setReplyingTo(thread.id)}
                              className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1"
                            >
                              <Icon name="MessageCircle" size={16} />
                              Reply
                            </button>
                          </div>
                        )}

                        {/* Reply Form */}
                        {replyingTo === thread.id && (
                          <div className="ml-8 bg-white rounded-lg shadow-md p-4">
                            <textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Type your reply..."
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none mb-3"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => sendReply(selectedCustomer, thread.id)}
                                disabled={sending || !replyText.trim()}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                              >
                                {sending ? 'Sending...' : 'Send Reply'}
                              </button>
                              <button
                                onClick={() => {
                                  setReplyingTo(null);
                                  setReplyText('');
                                }}
                                className="text-gray-600 hover:text-gray-800 px-4 py-2"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* New Message Input */}
              <div className="border-t border-gray-200 p-4 bg-white">
                <div className="flex gap-3">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type a new message..."
                    rows={2}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
                  />
                  <button
                    onClick={() => sendReply(selectedCustomer, null)}
                    disabled={sending || !replyText.trim()}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
                  >
                    <Icon name="Send" size={20} />
                    Send
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
