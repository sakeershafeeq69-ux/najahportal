import React, { useState, useRef, useEffect, useMemo } from 'react';
import { usePortal } from '../../context/PortalContext';
import { ChatMessage, Role } from '../../types';
import {
  MessageSquare,
  Send,
  Users,
  User,
  ShieldCheck,
  Trash2,
  Smile,
  Paperclip,
  CheckCheck,
  Search,
  Sparkles,
  Radio,
  Image as ImageIcon,
  MoreVertical,
  X,
  AlertCircle
} from 'lucide-react';

export const ClassChatHub: React.FC = () => {
  const {
    currentUser,
    adminUser,
    students,
    messages,
    sendMessage,
    deleteMessage,
    addMessageReaction,
    clearChat,
  } = usePortal();

  const isAdmin = currentUser?.role === 'admin';
  const [selectedChannel, setSelectedChannel] = useState<'all' | string>('all');
  const [inputText, setInputText] = useState('');
  const [searchPeer, setSearchPeer] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of conversation
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedChannel]);

  // Available conversation targets
  // 1. 'all' = Class Broadcast channel
  // 2. Specific user id for direct 1-on-1
  const conversationPeers = useMemo(() => {
    if (isAdmin) {
      // Admin can message any student
      return students.map((s) => ({
        id: s.id,
        name: s.name,
        rollNo: s.rollNo,
        role: 'student' as Role,
        avatar: s.avatar,
        status: 'Online',
        department: s.department,
      }));
    } else {
      // Student can message Admin, or fellow students
      const adminPeer = {
        id: 'admin-root',
        name: 'Class Administrator (Admin Desk)',
        rollNo: 'STAFF',
        role: 'admin' as Role,
        avatar: adminUser.avatar,
        status: 'Online',
        department: 'Faculty Administration',
      };
      const peerStudents = students
        .filter((s) => s.id !== currentUser?.id)
        .map((s) => ({
          id: s.id,
          name: s.name,
          rollNo: s.rollNo,
          role: 'student' as Role,
          avatar: s.avatar,
          status: 'Online',
          department: s.department,
        }));
      return [adminPeer, ...peerStudents];
    }
  }, [isAdmin, students, adminUser, currentUser]);

  const filteredPeers = useMemo(() => {
    if (!searchPeer.trim()) return conversationPeers;
    const q = searchPeer.toLowerCase();
    return conversationPeers.filter(
      (p) => p.name.toLowerCase().includes(q) || p.rollNo?.toLowerCase().includes(q)
    );
  }, [conversationPeers, searchPeer]);

  // Current active chat metadata
  const activePeer = useMemo(() => {
    if (selectedChannel === 'all') return null;
    return conversationPeers.find((p) => p.id === selectedChannel) || null;
  }, [selectedChannel, conversationPeers]);

  // Filter messages for current active thread
  const activeMessages = useMemo(() => {
    if (selectedChannel === 'all') {
      return messages.filter((m) => m.receiverId === 'all');
    }
    // Direct 1-on-1 thread between currentUser and activePeer
    const currentId = currentUser?.id;
    return messages.filter(
      (m) =>
        (m.senderId === currentId && m.receiverId === selectedChannel) ||
        (m.senderId === selectedChannel && m.receiverId === currentId)
    );
  }, [messages, selectedChannel, currentUser]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !attachmentPreview) return;

    sendMessage({
      receiverId: selectedChannel,
      receiverName: selectedChannel === 'all' ? 'All Class Members' : activePeer?.name,
      message: inputText.trim(),
      attachmentUrl: attachmentPreview || undefined,
    });

    setInputText('');
    setAttachmentPreview(null);
  };

  const handleAttachmentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAttachmentPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const quickEmojis = ['👍', '❤️', '🔥', '👏', '🎉', '💡'];

  return (
    <div className="space-y-6">
      
      {/* 1. Header Banner with Explicit Unlimited Messaging Notice */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#086a7e] dark:text-teal-400 mb-1">
            <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
            <span>Real-Time Class Communication Network</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Class Messaging & Direct Chat
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Admin broadcast to all students, private 1-on-1 advisor chats, and peer-to-peer student discussion.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Real-Time Active</span>
        </div>
      </div>

      {/* 2. Main Chat Workspace Layout */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs grid grid-cols-1 md:grid-cols-12 min-h-[620px] overflow-hidden">
        
        {/* Left Column: Channels & Peer Selector (4 cols) */}
        <div className="md:col-span-4 border-r border-slate-100 dark:border-slate-800 flex flex-col justify-between">
          <div>
            {/* Class-wide broadcast button */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedChannel('all')}
                className={`w-full p-3 rounded-2xl text-left transition-all flex items-center justify-between gap-3 ${
                  selectedChannel === 'all'
                    ? 'bg-[#086a7e] text-white shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    selectedChannel === 'all' ? 'bg-white/20 text-white' : 'bg-teal-50 dark:bg-teal-950/60 text-[#086a7e] dark:text-teal-300'
                  }`}>
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold tracking-tight">📢 Class Broadcast</div>
                    <div className={`text-[11px] truncate ${selectedChannel === 'all' ? 'text-teal-100' : 'text-slate-400'}`}>
                      {isAdmin ? 'Admin broadcast to all students' : 'Whole class group board'}
                    </div>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  selectedChannel === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}>
                  {messages.filter((m) => m.receiverId === 'all').length}
                </span>
              </button>
            </div>

            {/* Direct Message Header & Search */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Direct Messages (1-on-1)
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  {conversationPeers.length} Available
                </span>
              </div>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search student or admin..."
                  value={searchPeer}
                  onChange={(e) => setSearchPeer(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-black dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-1 focus:ring-[#086a7e]"
                />
              </div>
            </div>

            {/* Peers List */}
            <div className="p-2 space-y-1 max-h-[380px] overflow-y-auto">
              {filteredPeers.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  {isAdmin
                    ? 'No students enrolled yet. Add students in Manage Students to start 1-on-1 chats.'
                    : 'No other classmates found.'}
                </div>
              ) : (
                filteredPeers.map((peer) => {
                  const isSelected = selectedChannel === peer.id;
                  const threadCount = messages.filter(
                    (m) =>
                      (m.senderId === currentUser?.id && m.receiverId === peer.id) ||
                      (m.senderId === peer.id && m.receiverId === currentUser?.id)
                  ).length;

                  return (
                    <button
                      key={peer.id}
                      type="button"
                      onClick={() => setSelectedChannel(peer.id)}
                      className={`w-full p-2.5 rounded-2xl text-left transition-all flex items-center justify-between gap-2.5 ${
                        isSelected
                          ? 'bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-slate-900 dark:text-white'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative shrink-0">
                          <img
                            src={peer.avatar}
                            alt={peer.name}
                            className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                          />
                          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold truncate flex items-center gap-1.5">
                            <span>{peer.name}</span>
                            {peer.role === 'admin' && (
                              <ShieldCheck className="w-3.5 h-3.5 text-[#086a7e] shrink-0" />
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {peer.rollNo ? `Roll: ${peer.rollNo}` : peer.department}
                          </div>
                        </div>
                      </div>

                      {threadCount > 0 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 shrink-0">
                          {threadCount}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* User Status Footer */}
          <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center gap-2.5">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-8 h-8 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {currentUser?.name}
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                <span>Active & Ready to Chat</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Conversation Stream & Input (8 cols) */}
        <div className="md:col-span-8 flex flex-col justify-between h-[620px]">
          
          {/* Thread Header */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/40 dark:bg-slate-800/20">
            <div className="flex items-center gap-3">
              {selectedChannel === 'all' ? (
                <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-[#086a7e] dark:text-teal-300 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
              ) : (
                <img
                  src={activePeer?.avatar}
                  alt={activePeer?.name}
                  className="w-10 h-10 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                />
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {selectedChannel === 'all' ? '📢 Class Broadcast Channel' : activePeer?.name}
                  </h3>
                  {selectedChannel !== 'all' && activePeer?.role === 'admin' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-[#086a7e] dark:text-teal-300">
                      Class Admin
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  {selectedChannel === 'all'
                    ? 'All students and admins see and reply to messages here'
                    : `Private direct conversation with ${activePeer?.name}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (confirm('Clear message history for this conversation?')) {
                    clearChat(selectedChannel);
                  }
                }}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors"
                title="Clear conversation history"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {activeMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
                <div className="w-14 h-14 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-600">
                  <MessageSquare className="w-7 h-7" />
                </div>
                <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  No messages yet in this conversation
                </div>
                <p className="text-xs max-w-sm">
                  {selectedChannel === 'all'
                    ? 'Be the first to post a class announcement or question to the group.'
                    : `Say hello to ${activePeer?.name || 'this contact'} to start chatting.`}
                </p>
              </div>
            ) : (
              activeMessages.map((msg) => {
                const isMe = msg.senderId === currentUser?.id;
                const canDelete = isMe || isAdmin;

                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 group ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <img
                      src={msg.senderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                      alt={msg.senderName}
                      className="w-8 h-8 rounded-xl object-cover shrink-0 mt-1 border border-slate-200 dark:border-slate-700"
                    />

                    <div className={`max-w-[75%] space-y-1 ${isMe ? 'items-end text-right' : 'items-start text-left'}`}>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 px-1">
                        <span className="font-bold text-slate-700 dark:text-slate-300">{msg.senderName}</span>
                        {msg.senderRole === 'admin' && (
                          <span className="px-1.5 py-0.2 bg-teal-50 dark:bg-teal-950/60 text-[#086a7e] dark:text-teal-300 font-bold rounded-sm text-[9px]">
                            ADMIN
                          </span>
                        )}
                        <span>{msg.timestamp}</span>
                      </div>

                      {/* Message Bubble */}
                      <div
                        className={`p-3.5 rounded-2xl text-xs relative leading-relaxed ${
                          isMe
                            ? 'bg-[#086a7e] text-white rounded-tr-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-xs'
                        }`}
                      >
                        {msg.attachmentUrl && (
                          <div className="mb-2 rounded-xl overflow-hidden max-h-48">
                            <img
                              src={msg.attachmentUrl}
                              alt="Attachment"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <p className="whitespace-pre-wrap select-text">{msg.message}</p>

                        {/* Reactions bar if present */}
                        {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2 pt-1 border-t border-white/20 dark:border-slate-700">
                            {Object.entries(msg.reactions).map(([emoji, userIds]) => (
                              <button
                                key={emoji}
                                type="button"
                                onClick={() => addMessageReaction(msg.id, emoji)}
                                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
                                  userIds.includes(currentUser?.id || '')
                                    ? 'bg-white/30 text-white dark:bg-slate-700'
                                    : 'bg-black/10 text-white dark:bg-slate-900'
                                }`}
                              >
                                <span>{emoji}</span>
                                <span>{userIds.length}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Quick Reactions & Actions on Hover */}
                      <div className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity px-1 ${
                        isMe ? 'justify-end' : 'justify-start'
                      }`}>
                        {quickEmojis.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => addMessageReaction(msg.id, emoji)}
                            className="p-1 text-xs hover:scale-125 transition-transform"
                            title={`React with ${emoji}`}
                          >
                            {emoji}
                          </button>
                        ))}

                        {canDelete && (
                          <button
                            type="button"
                            onClick={() => deleteMessage(msg.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors ml-1"
                            title="Delete this message"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Attachment Preview if selected */}
          {attachmentPreview && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={attachmentPreview}
                  alt="Attachment preview"
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Ready to send attachment
                </span>
              </div>
              <button
                type="button"
                onClick={() => setAttachmentPreview(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Chat Composer Form */}
          <form
            onSubmit={handleSend}
            className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAttachmentUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 rounded-xl text-slate-400 hover:text-[#086a7e] dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Attach image"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              placeholder={
                selectedChannel === 'all'
                  ? 'Broadcast message to the entire class...'
                  : `Message ${activePeer?.name || 'student'}...`
              }
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-black dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-[#086a7e]"
            />

            <button
              type="submit"
              disabled={!inputText.trim() && !attachmentPreview}
              className="px-4 py-2.5 text-xs font-bold text-white bg-[#086a7e] hover:bg-[#065464] disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
};
