'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MessageSquare,
  Send,
  Paperclip,
  Image as ImageIcon,
  FileText,
  Download,
  Check,
  CheckCheck,
  Sparkles,
  ShieldCheck,
  X,
  Maximize2,
  Phone,
  RefreshCw,
} from 'lucide-react';

export default function ClientLiveChat({ currentUser }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const pollTimerRef = useRef(null);

  const scrollToBottom = useCallback((smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
    }
  }, []);

  // Fetch messages from API
  const fetchMessages = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      const res = await fetch('/api/chat');
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error('Client chat fetch error:', err);
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchMessages(false);
    setTimeout(() => scrollToBottom(false), 200);
  }, [fetchMessages, scrollToBottom]);

  // Real-time zero-refresh polling: polls every 1.5 seconds while chat component is mounted
  useEffect(() => {
    if (pollTimerRef.current) clearInterval(pollTimerRef.current);

    pollTimerRef.current = setInterval(() => {
      fetchMessages(true);
    }, 1500);

    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, [fetchMessages]);

  // Auto scroll when message count changes
  useEffect(() => {
    scrollToBottom(true);
  }, [messages.length, scrollToBottom]);

  // Handle file attachment
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

  // Send message
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if ((!inputMessage.trim() && pendingFiles.length === 0) || sending) {
      return;
    }

    const messageText = inputMessage.trim();
    const attachmentsToSend = [...pendingFiles];

    // Optimistic UI update
    const tempId = `temp_${Date.now()}`;
    const optimisticMessage = {
      _id: tempId,
      senderRole: 'client',
      senderName: currentUser?.name || 'Client',
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
          message: messageText,
          attachments: attachmentsToSend,
        }),
      });

      const data = await res.json();
      if (data.success && data.chatMessage) {
        setMessages((prev) => prev.map((m) => (m._id === tempId ? data.chatMessage : m)));
      }
    } catch (err) {
      console.error('Client send message error:', err);
    } finally {
      setSending(false);
      setTimeout(() => scrollToBottom(true), 100);
    }
  };

  return (
    <div className="flex flex-col h-[75vh] sm:h-[80vh] w-full rounded-3xl bg-zinc-950 border border-zinc-800 overflow-hidden shadow-2xl animate-fadeIn">
      {/* 1. CHAT HEADER */}
      <div className="p-4 sm:p-5 border-b border-zinc-850 bg-zinc-900/70 flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center font-bold text-white text-xs">
                DB
              </div>
            </div>
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-zinc-950 absolute -bottom-0.5 -right-0.5 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                <span>DataBaj Super Admin & Support</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </h3>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-0.5">
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                অনলাইন সাপোর্ট
              </span>
              <span>•</span>
              <span className="text-zinc-500 font-mono">WhatsApp-style Real-time</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => fetchMessages(false)}
          className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors cursor-pointer"
          title="রিফ্রেশ করুন"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* 2. MESSAGES CONTAINER */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-zinc-950/50">
        {messages.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
              <MessageSquare className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="text-xs font-medium">
              DataBaj এজেন্সির সুপার এডমিন টিমের সাথে লাইভ চ্যাটে যুক্ত হন।
            </span>
            <span className="text-[11px] text-zinc-600 max-w-sm">
              আপনার যেকোনো জিজ্ঞাসা, ক্যাম্পেইন আপডেট বা ফাইল/স্ক্রিনশট নিচের মেসেজ বক্স দিয়ে শেয়ার করতে পারেন।
            </span>
          </div>
        ) : (
          messages.map((msg) => {
            const isClient = msg.senderRole === 'client';

            return (
              <div
                key={msg._id || msg.createdAt}
                className={`flex flex-col ${isClient ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-3.5 text-xs shadow-md ${
                    isClient
                      ? 'bg-emerald-600 text-white rounded-br-xs'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-bl-xs'
                  }`}
                >
                  {/* Sender Header */}
                  <div
                    className={`text-[10px] font-bold mb-1 ${
                      isClient ? 'text-emerald-100' : 'text-emerald-400 flex items-center gap-1'
                    }`}
                  >
                    {isClient ? '👤 আপনি (You)' : '🛡️ DataBaj Super Admin'}
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
                                alt={att.fileName || 'Attachment'}
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
                              isClient
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

                  {/* Timestamp & Read Status */}
                  <div
                    className={`flex items-center justify-end gap-1.5 mt-1.5 text-[10px] ${
                      isClient ? 'text-emerald-100/80' : 'text-zinc-500'
                    }`}
                  >
                    <span className="font-mono">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {isClient && (
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

      {/* 3. PENDING ATTACHMENTS TRAY */}
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

      {/* 4. CHAT INPUT BAR */}
      <div className="p-3 sm:p-4 border-t border-zinc-850 bg-zinc-900/80">
        <form onSubmit={handleSendMessage} className="flex items-end gap-2.5">
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
              placeholder="সুপার এডমিনকে মেসেজ লিখুন... (Enter দিলে সেন্ড হবে)"
              className="w-full bg-transparent text-xs text-white placeholder-zinc-500 resize-none focus:outline-none max-h-32"
            />
          </div>

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

      {/* Lightbox Modal */}
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
    </div>
  );
}
