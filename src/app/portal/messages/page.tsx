'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/Icon';

interface Message {
  id: number;
  customer_id: number;
  sender_type: 'customer' | 'admin';
  sender_name: string;
  subject: string | null;
  message: string;
  is_read: boolean;
  parent_message_id: number | null;
  created_at: string;
}

export default function MessagesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState({ subject: '', message: '' });
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/portal/messages');
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      } else if (res.status === 401) {
        router.push('/portal');
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendNewMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.message.trim()) return;

    setSending(true);
    try {
      const res = await fetch('/api/portal/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMessage),
      });

      if (res.ok) {
        setNewMessage({ subject: '', message: '' });
        await fetchMessages();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const sendReply = async (parentId: number) => {
    if (!replyText.trim()) return;

    setSending(true);
    try {
      const res = await fetch('/api/portal/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: replyText,
          parent_message_id: parentId,
        }),
      });

      if (res.ok) {
        setReplyText('');
        setReplyingTo(null);
        await fetchMessages();
      }
    } catch (error) {
      console.error('Failed to send reply:', error);
    } finally {
      setSending(false);
    }
  };

  const markAsRead = async (messageId: number) => {
    try {
      await fetch(`/api/portal/messages/${messageId}/read`, {
        method: 'POST',
      });
      setMessages(messages.map(m => 
        m.id === messageId ? { ...m, is_read: true } : m
      ));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  // Group messages into threads
  const threads = messages.filter(m => !m.parent_message_id);
  const getReplies = (parentId: number) => 
    messages.filter(m => m.parent_message_id === parentId);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
              <p className="text-gray-600">Communicate directly with our team</p>
            </div>
            <button
              onClick={() => router.push('/portal/dashboard')}
              className="text-gray-600 hover:text-gray-800 font-semibold flex items-center gap-2"
            >
              <Icon name="ArrowLeft" size={20} />
              Back to Portal
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* New Message Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Icon name="Plus" size={24} />
                New Message
              </h2>
              <form onSubmit={sendNewMessage} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject (optional)
                  </label>
                  <input
                    type="text"
                    value={newMessage.subject}
                    onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                    placeholder="e.g., Question about my project"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    value={newMessage.message}
                    onChange={(e) => setNewMessage({ ...newMessage, message: e.target.value })}
                    placeholder="Type your message here..."
                    rows={6}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending || !newMessage.message.trim()}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {sending ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Icon name="Send" size={20} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Message Threads */}
          <div className="lg:col-span-2 space-y-4">
            {threads.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <Icon name="MessageCircle" size={64} className="mx-auto text-gray-400 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No Messages Yet</h2>
                <p className="text-gray-600">
                  Start a conversation by sending a message to our team.
                </p>
              </div>
            ) : (
              threads.map((thread) => {
                const replies = getReplies(thread.id);
                const unreadReplies = replies.filter(r => r.sender_type === 'admin' && !r.is_read);
                
                return (
                  <div key={thread.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Thread Header */}
                    <div className={`p-6 ${!thread.is_read && thread.sender_type === 'admin' ? 'bg-blue-50' : ''}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          {thread.subject && (
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{thread.subject}</h3>
                          )}
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span className={`font-semibold ${thread.sender_type === 'admin' ? 'text-blue-600' : 'text-gray-900'}`}>
                              {thread.sender_type === 'admin' ? '👤 ' : ''}
                              {thread.sender_name}
                            </span>
                            <span>•</span>
                            <span>{formatDate(thread.created_at)}</span>
                          </div>
                        </div>
                        {!thread.is_read && thread.sender_type === 'admin' && (
                          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">{thread.message}</p>
                      {!thread.is_read && thread.sender_type === 'admin' && (
                        <button
                          onClick={() => markAsRead(thread.id)}
                          className="mt-3 text-blue-600 text-sm hover:underline"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>

                    {/* Replies */}
                    {replies.length > 0 && (
                      <div className="border-t border-gray-200 bg-gray-50">
                        {replies.map((reply) => (
                          <div key={reply.id} className={`p-6 border-l-4 ${reply.sender_type === 'admin' ? 'border-blue-600 bg-blue-50' : 'border-green-600'}`}>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3 text-sm">
                                <span className={`font-semibold ${reply.sender_type === 'admin' ? 'text-blue-600' : 'text-green-600'}`}>
                                  {reply.sender_type === 'admin' ? '👤 ' : '✓ '}
                                  {reply.sender_name}
                                </span>
                                <span className="text-gray-600">•</span>
                                <span className="text-gray-600">{formatDate(reply.created_at)}</span>
                              </div>
                              {!reply.is_read && reply.sender_type === 'admin' && (
                                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                                  New
                                </span>
                              )}
                            </div>
                            <p className="text-gray-700 whitespace-pre-wrap">{reply.message}</p>
                            {!reply.is_read && reply.sender_type === 'admin' && (
                              <button
                                onClick={() => markAsRead(reply.id)}
                                className="mt-2 text-blue-600 text-sm hover:underline"
                              >
                                Mark as read
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply Form */}
                    <div className="p-6 border-t border-gray-200 bg-gray-50">
                      {replyingTo === thread.id ? (
                        <div className="space-y-3">
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Type your reply..."
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => sendReply(thread.id)}
                              disabled={sending || !replyText.trim()}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
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
                      ) : (
                        <button
                          onClick={() => setReplyingTo(thread.id)}
                          className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
                        >
                          <Icon name="MessageCircle" size={18} />
                          Reply to this thread
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
