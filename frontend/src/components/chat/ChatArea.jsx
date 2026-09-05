import React, { useEffect, useRef, useState } from 'react';
import { ChatHeader } from './ChatHeader';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { MessageInput } from './MessageInput';
import { MessageSquare, Sparkles, Lock } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

export const ChatArea = ({
  activeChat,
  currentUser,
  socket,
  onBackClick,
}) => {
  const [messages, setMessages] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const messagesEndRef = useRef(null);

  const isPublic = activeChat?.isPublic;
  const isTyping = !isPublic && activeChat ? socket.typingUsers[activeChat.username] : false;
  const isOnline = isPublic ? true : socket.onlineUsers.has(activeChat?.username);

  // 1. Fetch historical messages on active chat switch
  useEffect(() => {
    if (!activeChat || !currentUser) return;

    const fetchHistory = async () => {
      setLoadingHistory(true);
      try {
        let endpoint = '';
        if (isPublic) {
          endpoint = '/api/messages/public?page=0&size=50';
        } else {
          endpoint = `/api/messages/${currentUser.username}/${activeChat.username}?page=0&size=50`;
        }

        const res = await axiosClient.get(endpoint);
        const historyList = res.data?.content || res.data || [];
        setMessages(historyList);
      } catch (err) {
        console.error('Failed to load message history:', err);
        setMessages([]);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchHistory();
  }, [activeChat?.id, activeChat?.username, isPublic, currentUser?.username]);

  // 2. Append real-time incoming messages
  useEffect(() => {
    if (isPublic) {
      if (socket.publicMessages.length > 0) {
        const latest = socket.publicMessages[socket.publicMessages.length - 1];
        setMessages((prev) => {
          if (prev.some((m) => m.id && m.id === latest.id)) return prev;
          return [...prev, latest];
        });
      }
    } else if (activeChat) {
      if (socket.privateMessages.length > 0) {
        const latest = socket.privateMessages[socket.privateMessages.length - 1];
        // Only append if message belongs to this conversation
        const isRelated =
          (latest.sender === activeChat.username && latest.recipient === currentUser.username) ||
          (latest.sender === currentUser.username && latest.recipient === activeChat.username);

        if (isRelated) {
          setMessages((prev) => {
            if (prev.some((m) => m.id && m.id === latest.id)) return prev;
            return [...prev, latest];
          });
        }
      }
    }
  }, [socket.publicMessages, socket.privateMessages, isPublic, activeChat?.username, currentUser?.username]);

  // 3. Auto-scroll to bottom on new messages or typing
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (text) => {
    if (isPublic) {
      socket.sendPublicMessage(text);
    } else if (activeChat) {
      socket.sendPrivateMessage(activeChat.username, text);
    }
  };

  const handleTyping = () => {
    if (!isPublic && activeChat) {
      socket.sendTyping(activeChat.username);
    }
  };

  if (!activeChat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/50 dark:bg-dark-950/40">
        <div className="w-16 h-16 rounded-3xl bg-brand-50 dark:bg-brand-950/40 text-brand-600 flex items-center justify-center mb-4 ring-8 ring-brand-500/10 shadow-lg shadow-brand-500/10">
          <MessageSquare className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
          Select a conversation
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
          Pick a contact from the sidebar or join the General Lounge to start chatting in real-time.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-100/40 dark:bg-[#0b0f19]">
      <ChatHeader
        activeChat={activeChat}
        isOnline={isOnline}
        onBackClick={onBackClick}
      />

      {/* Scrollable Message Feed */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-2">
        {/* End-to-end security banner */}
        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/60 dark:bg-dark-800/60 text-[11px] text-slate-500 dark:text-slate-400 border border-slate-300/40 dark:border-white/5">
            <Lock className="w-3 h-3 text-emerald-500" />
            <span>Messages are secured with JWT and real-time STOMP broker</span>
          </div>
        </div>

        {loadingHistory ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500">
            <Sparkles className="w-8 h-8 mb-2 text-brand-500/70" />
            <p className="text-sm font-medium">No messages yet.</p>
            <p className="text-xs">Say hello to kickstart the conversation!</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.sender === currentUser?.username;
            return (
              <MessageBubble
                key={msg.id || `${msg.sender}-${msg.timestamp}-${idx}`}
                message={msg}
                isMe={isMe}
                showAvatar={!isMe && isPublic}
              />
            );
          })
        )}

        {/* Real-time typing bubble */}
        {isTyping && (
          <div className="py-1">
            <TypingIndicator username={activeChat?.username} />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message input bar */}
      <MessageInput
        onSendMessage={handleSendMessage}
        onTyping={handleTyping}
        disabled={!socket.connected}
      />
    </div>
  );
};
