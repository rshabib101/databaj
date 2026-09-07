'use client';

import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  MessageSquare,
  Search,
  Send,
  Paperclip,
  Image as ImageIcon,
  FileText,
  Download,
  ArrowLeft,
  Check,
  CheckCheck,
  Sparkles,
  Users,
  Bell,
  Eye,
  X,
  RefreshCw,
  Phone,
  Mail,
  Building,
  ShieldCheck,
  Maximize2,
  File,
} from 'lucide-react';
import ClientNoticeModal from '@/components/admin/ClientNoticeModal';

function AdminChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialClientId = searchParams.get('clientId');

  const [conversations, setConversations] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [selectedClientId, setSelectedClientId] = useState(initialClientId || null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingFiles, setPendingFiles] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [noticeModalClient, setNoticeModalClient] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const pollTimerRef = useRef(null);

  const scrollToBottom = useCallback((smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
    }
  }, []);

  // Fetch conversations list
  const fetchConversations = useCallback(async (isSilent = true) => {
    try {
      if (!isSilent) setLoadingConversations(true);
      const res = await fetch('/api/chat?action=conversations');
      const data = await res.json();
      if (data.success) {
        setConversations(data.conversations || []);
      }
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    } finally {
      if (!isSilent) setLoadingConversations(false);
    }
  }, []);

  // Fetch messages for selected client silently without wiping UI
  const fetchMessages = useCallback(async (clientId) => {
    if (!clientId) return;
    try {
      const res = await fetch(`/api/chat?conversationId=${clientId}`);
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages || []);
        if (data.client) {
          setSelectedClient(data.client);
        }
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  }, []);

  // Initialize conversations once on mount
  useEffect(() => {
    fetchConversations(false);
  }, []);

  // Handle URL param or default selection
  useEffect(() => {
    if (initialClientId) {
      setSelectedClientId(initialClientId);
    } else if (conversations.length > 0 && !selectedClientId) {
      setSelectedClientId(conversations[0].client._id);
    }
  }, [initialClientId, conversations.length]);

  // Load messages when selectedClientId changes
  useEffect(() => {
    if (!selectedClientId) return;
    fetchMessages(selectedClientId);
    const conv = conversations.find((c) => c.client._id === selectedClientId);
    if (conv) {
      setSelectedClient(conv.client);
    }
    setTimeout(() => scrollToBottom(false), 150);
  }, [selectedClientId]);

  // Real-time Polling: updates silently every 1.8 seconds in background without any UI reset or reload
  useEffect(() => {
    if (pollTimerRef.current) clearInterval(pollTimerRef.current);

    pollTimerRef.current = setInterval(() => {
      if (selectedClientId) {
        fetchMessages(selectedClientId);
      }
      fetchConversations(true);
    }, 1800);

    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, [selectedClientId, fetchMessages, fetchConversations]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom(true);
  }, [messages.length, scrollToBottom]);

  // File selection and upload
  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingFiles(true);
    const uploadedAttachments = [...pendingFiles];

    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/chat/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.success && data.file) {
          uploadedAttachments.push(data.file);
        } else {
          alert(`ফাইল আপলোড ব্যর্থ: ${data.message || file.name}`);
        }
      } catch (err) {
        console.error('File upload error:', err);
      }
    }

    setPendingFiles(uploadedAttachments);
    setUploadingFiles(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePendingFile = (index) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Send message handler
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if ((!inputMessage.trim() && pendingFiles.length === 0) || sending || !selectedClientId) {
      return;
    }

    const messageText = inputMessage.trim();
    const attachmentsToSend = [...pendingFiles];

    // Optimistic UI update
    const tempId = `temp_${Date.now()}`;
    const optimisticMessage = {
      _id: tempId,
      conversationId: selectedClientId,
      senderRole: 'super_admin',
      senderName: 'DataBaj Super Admin',
      message: messageText,
      attachments: attachmentsToSend,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setInputMessage('');
    setPendingFiles([]);
    setSending(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedClientId,
          message: messageText,
          attachments: attachmentsToSend,
        }),
      });

      const data = await res.json();
      if (data.success && data.chatMessage) {
        setMessages((prev) => prev.map((m) => (m._id === tempId ? data.chatMessage : m)));
        fetchConversations(true);
      }
    } catch (err) {
      console.error('Send message error:', err);
    } finally {
      setSending(false);
      setTimeout(() => scrollToBottom(true), 100);
    }
  };

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.client.companyName?.toLowerCase().includes(q) ||
      c.client.name?.toLowerCase().includes(q) ||
      c.client.email?.toLowerCase().includes(q)
    );
  });

  const totalUnreadCount = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  return (
    <div className="flex h-screen w-full bg-black text-zinc-100 overflow-hidden font-sans">
      {/* 1. LEFT SIDEBAR: Conversations List */}
      <div className="w-full sm:w-80 md:w-96 border-r border-zinc-850 flex flex-col bg-zinc-950 shrink-0">
        {/* Top Header */}
        <div className="p-4 border-b border-zinc-850 bg-zinc-900/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin?tab=clients"
              className="p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800 transition-colors"
              title="এডমিন প্যানেলে ফিরে যান"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>লাইভ চ্যাট হাব</span>
                </h2>
                {totalUnreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500 text-black animate-pulse">
                    {totalUnreadCount} নতুন
                  </span>
                )}
              </div>
              <span className="text-[11px] text-zinc-500 font-mono">WhatsApp-style Real-time</span>
            </div>
          </div>

          <button
            onClick={() => {
              fetchConversations(false);
              if (selectedClientId) fetchMessages(selectedClientId, false);
            }}
            className="p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
            title="রিফ্রেশ করুন"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-zinc-850 bg-zinc-950">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="কোম্পানি বা ক্লায়েন্ট খুঁজুন..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto divide-y divide-zinc-900/60">
          {loadingConversations ? (
            <div className="p-8 text-center text-zinc-500 space-y-2">
              <Sparkles className="w-5 h-5 animate-spin mx-auto text-emerald-400" />
              <span className="text-xs">ক্লায়েন্ট তালিকা লোড হচ্ছে...</span>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 text-xs">
              কোনো ক্লায়েন্ট কনভার্সেশন পাওয়া যায়নি।
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isSelected = selectedClientId === conv.client._id;
              const hasUnread = conv.unreadCount > 0;

              return (
                <button
                  key={conv.client._id}
                  onClick={() => {
                    if (selectedClientId === conv.client._id) return;
                    setSelectedClientId(conv.client._id);
                    setSelectedClient(conv.client);
                    fetchMessages(conv.client._id);
                    if (typeof window !== 'undefined') {
                      window.history.replaceState(null, '', `/admin/chat?clientId=${conv.client._id}`);
                    }
                  }}
                  className={`w-full p-3.5 flex items-start gap-3 text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500/10 border-l-4 border-l-emerald-500'
                      : 'hover:bg-zinc-900/40'
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className="w-11 h-11 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-white text-xs shadow-md">
                      {conv.client.companyName?.slice(0, 2).toUpperCase() || 'CL'}
                    </div>
                    {conv.client.status === 'active' && (
                      <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-zinc-950 absolute -bottom-0.5 -right-0.5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h4 className="text-xs font-bold text-white truncate">
                        {conv.client.companyName}
                      </h4>
                      {conv.lastMessage && (
                        <span className="text-[10px] text-zinc-500 font-mono shrink-0">
                          {new Date(conv.lastMessage.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-zinc-400 truncate mb-1">
                      {conv.client.name}
                    </p>

                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[11px] text-zinc-500 truncate flex-1">
                        {conv.lastMessage?.attachments?.length > 0
                          ? '📎 [সংযুক্ত ফাইল / ছবি]'
                          : conv.lastMessage?.message || 'নতুন চ্যাট শুরু করুন...'}
                      </p>

                      {hasUnread && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500 text-black shrink-0 shadow-sm shadow-emerald-500/20">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* 2. RIGHT AREA: Active Chat Thread */}
      <div className="flex-1 flex flex-col bg-zinc-950/80 relative">
        {selectedClient ? (
          <>
            {/* Conversation Header */}
            <div className="p-3.5 sm:p-4 border-b border-zinc-850 bg-zinc-900/60 flex items-center justify-between backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-white text-xs shadow-md">
                  {selectedClient.companyName?.slice(0, 2).toUpperCase() || 'CL'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{selectedClient.companyName}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
                      {selectedClient.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-zinc-400 mt-0.5">
                    <span className="flex items-center gap-1 font-mono text-zinc-400">
                      <Mail className="w-3 h-3 text-zinc-500" />
                      {selectedClient.email}
                    </span>
                    {selectedClient.phone && (
                      <span className="flex items-center gap-1 font-mono text-zinc-400 hidden md:flex">
                        <Phone className="w-3 h-3 text-zinc-500" />
                        {selectedClient.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons in Header */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setNoticeModalClient(selectedClient)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
                  title="এই ক্লায়েন্টের জন্য নোটিশ পাঠান বা এডিট করুন"
                >
                  <Bell className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">নোটিশ (Notice)</span>
                </button>

                <Link
                  href={`/admin?tab=clients`}
                  className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-zinc-300 border border-zinc-800 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  title="ক্লায়েন্ট লিস্টে ফিরে যান"
                >
                  <Users className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="hidden sm:inline">ক্লায়েন্ট লিস্ট</span>
                </Link>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-zinc-950/40">
              {messages.length === 0 ? (
                <div className="p-12 text-center text-zinc-500 flex flex-col items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
                    <MessageSquare className="w-6 h-6 text-emerald-400" />
                  </div>
                  <span className="text-xs font-medium">
                    {selectedClient?.companyName || 'ক্লায়েন্ট'}-এর সাথে এখনও কোনো বার্তা বিনিময় হয়নি।
                  </span>
                  <span className="text-[11px] text-zinc-600">
                    নিচে লিখে প্রথম মেসেজ বা ফাইল সেন্ড করুন।
                  </span>
                </div>
              ) : (
                messages.map((msg) => {
                  const isAdmin = msg.senderRole === 'super_admin';

                  return (
                    <div
                      key={msg._id || msg.createdAt}
                      className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-3.5 text-xs shadow-md ${
                          isAdmin
                            ? 'bg-emerald-600 text-white rounded-br-xs'
                            : 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-bl-xs'
                        }`}
                      >
                        {/* Sender Label */}
                        <div
                          className={`text-[10px] font-bold mb-1 ${
                            isAdmin ? 'text-emerald-100' : 'text-zinc-400'
                          }`}
                        >
                          {isAdmin ? '🛡️ DataBaj Super Admin' : `👤 ${msg.senderName || selectedClient.name}`}
                        </div>

                        {/* Text Message */}
                        {msg.message && (
                          <p className="leading-relaxed whitespace-pre-wrap break-words text-xs">
                            {msg.message}
                          </p>
                        )}

                        {/* Attachments */}
                        {msg.attachments?.length > 0 && (
                          <div className="mt-2.5 space-y-2">
                            {msg.attachments.map((att, idx) => {
                              const isImg =
                                att.fileType?.startsWith('image/') ||
                                /\.(png|jpe?g|webp|gif)$/i.test(att.url);

                              if (isImg) {
                                return (
                                  <div
                                    key={idx}
                                    onClick={() => setLightboxImage(att.url)}
                                    className="relative rounded-xl overflow-hidden border border-black/20 group cursor-pointer max-w-sm"
                                  >
                                    <img
                                      src={att.url}
                                      alt={att.fileName || 'Image'}
                                      className="max-h-60 w-auto object-cover rounded-xl transition-transform group-hover:scale-102"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                      <Maximize2 className="w-5 h-5" />
                                    </div>
                                  </div>
                                );
                              }

                              return (
                                <a
                                  key={idx}
                                  href={att.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  download={att.fileName}
                                  className={`p-2.5 rounded-xl border flex items-center gap-3 transition-colors ${
                                    isAdmin
                                      ? 'bg-emerald-700/50 border-emerald-500/50 text-white hover:bg-emerald-700'
                                      : 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-750'
                                  }`}
                                >
                                  <FileText className="w-5 h-5 shrink-0 text-amber-400" />
                                  <div className="flex-1 min-w-0 text-left">
                                    <span className="block font-semibold truncate text-[11px]">
                                      {att.fileName}
                                    </span>
                                    {att.fileSize > 0 && (
                                      <span className="block text-[9px] opacity-75 font-mono">
                                        {(att.fileSize / 1024).toFixed(1)} KB
                                      </span>
                                    )}
                                  </div>
                                  <Download className="w-4 h-4 shrink-0 opacity-80" />
                                </a>
                              );
                            })}
                          </div>
                        )}

                        {/* Timestamp and Read Status */}
                        <div
                          className={`flex items-center justify-end gap-1.5 mt-1.5 text-[10px] ${
                            isAdmin ? 'text-emerald-100/80' : 'text-zinc-500'
                          }`}
                        >
                          <span className="font-mono">
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          {isAdmin && (
                            <span>
                              {msg.isRead ? (
                                <CheckCheck className="w-3.5 h-3.5 text-sky-300" title="দেখা হয়েছে" />
                              ) : (
                                <Check className="w-3.5 h-3.5 text-emerald-200" title="প্রেরিত" />
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Pending Uploads Tray */}
            {pendingFiles.length > 0 && (
              <div className="p-3 bg-zinc-900 border-t border-zinc-800 flex items-center gap-2 overflow-x-auto">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider shrink-0">
                  সংযুক্ত ফাইল:
                </span>
                {pendingFiles.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 shrink-0"
                  >
                    <Paperclip className="w-3 h-3 text-emerald-400" />
                    <span className="truncate max-w-[150px]">{f.fileName}</span>
                    <button
                      type="button"
                      onClick={() => removePendingFile(i)}
                      className="text-zinc-500 hover:text-rose-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Input & Action Bar */}
            <div className="p-3 sm:p-4 border-t border-zinc-850 bg-zinc-900/80">
              <form onSubmit={handleSendMessage} className="flex items-end gap-2.5">
                {/* File Attachment Button */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  multiple
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx,.zip,.txt,.xlsx"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingFiles}
                  className="p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                  title="ছবি বা ফাইল সংযুক্ত করুন"
                >
                  {uploadingFiles ? (
                    <Sparkles className="w-4 h-4 animate-spin text-emerald-400" />
                  ) : (
                    <Paperclip className="w-4 h-4" />
                  )}
                </button>

                {/* Message Textarea */}
                <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-2.5 focus-within:border-emerald-500 transition-colors">
                  <textarea
                    rows={1}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="মেসেজ লিখুন... (Enter দিলে সেন্ড হবে, Shift+Enter দিলে নতুন লাইন)"
                    className="w-full bg-transparent text-xs text-white placeholder-zinc-500 resize-none focus:outline-none max-h-32"
                  />
                </div>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={(!inputMessage.trim() && pendingFiles.length === 0) || sending}
                  className="p-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold transition-all shadow-lg shadow-emerald-500/20 cursor-pointer shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <Sparkles className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-zinc-500">
            <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mb-4 shadow-xl">
              <MessageSquare className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">কোনো ক্লায়েন্ট নির্বাচন করা হয়নি</h3>
            <p className="text-xs text-zinc-400 max-w-sm">
              বাম পাশের তালিকা থেকে যেকোনো ক্লায়েন্টের চ্যাটে ক্লিক করুন অথবা ক্লায়েন্ট লিস্ট থেকে সরাসরি চ্যাট ওপেন করুন।
            </p>
          </div>
        )}
      </div>

      {/* Lightbox Modal for Full Image View */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={lightboxImage}
              alt="Preview"
              className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl border border-zinc-800"
            />
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-3 -right-3 p-2 rounded-full bg-zinc-900 text-white border border-zinc-700 hover:bg-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Notice Modal */}
      {noticeModalClient && (
        <ClientNoticeModal
          isOpen={!!noticeModalClient}
          client={noticeModalClient}
          onClose={() => setNoticeModalClient(null)}
          onNoticeUpdated={() => {
            // Optional callback
          }}
        />
      )}
    </div>
  );
}

export default function AdminChatPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white p-8">Loading Live Chat...</div>}>
      <AdminChatContent />
    </Suspense>
  );
}
