import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile, Paperclip, Image as ImageIcon, X } from 'lucide-react';

const COMMON_EMOJIS = ['😊', '😂', '🔥', '❤️', '👍', '🎉', '🚀', '✨', '👋', '💯', '🙌', '😎'];

export const MessageInput = ({ onSendMessage, onTyping, disabled = false }) => {
  const [content, setContent] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const typingTimerRef = useRef(null);
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    setContent(e.target.value);

    // Debounce typing signal
    if (onTyping) {
      if (!typingTimerRef.current) {
        onTyping(true);
      }
      clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => {
        typingTimerRef.current = null;
      }, 2000);
    }
  };

  const handleSend = (e) => {
    e?.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || disabled) return;

    onSendMessage(trimmed);
    setContent('');
    setShowEmojis(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const addEmoji = (emoji) => {
    setContent((prev) => prev + emoji);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="relative p-3 md:p-4 bg-white/80 dark:bg-dark-900/90 border-t border-slate-200/80 dark:border-white/5 backdrop-blur-md">
      {/* Emoji Picker Popup */}
      {showEmojis && (
        <div className="absolute bottom-full mb-2 left-4 p-3 bg-white dark:bg-dark-800 rounded-2xl shadow-xl border border-slate-200 dark:border-white/10 z-20 animate-slide-up">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/5 mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Quick Emojis</span>
            <button
              onClick={() => setShowEmojis(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-6 gap-2">
            {COMMON_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => addEmoji(emoji)}
                className="w-8 h-8 flex items-center justify-center text-lg hover:bg-slate-100 dark:hover:bg-dark-700 rounded-lg transition-transform active:scale-125"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSend} className="flex items-center gap-2 max-w-7xl mx-auto">
        {/* Action icons */}
        <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
          <button
            type="button"
            onClick={() => setShowEmojis(!showEmojis)}
            className={`p-2 rounded-xl transition-colors ${
              showEmojis
                ? 'text-brand-600 bg-brand-50 dark:bg-brand-950/40 dark:text-brand-400'
                : 'hover:bg-slate-100 dark:hover:bg-dark-800 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
            title="Add emoji"
          >
            <Smile className="w-5 h-5" />
          </button>
          <button
            type="button"
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-dark-800 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            title="Attach file"
          >
            <Paperclip className="w-5 h-5" />
          </button>
        </div>

        {/* Input box */}
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={content}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={disabled ? 'Connecting to chat server...' : 'Type your message... (Press Enter to send)'}
            className="w-full py-2.5 px-4 rounded-xl text-sm bg-slate-100 dark:bg-dark-800/80 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 border border-transparent focus:border-brand-500/50 dark:focus:border-brand-500/50 focus:bg-white dark:focus:bg-dark-800 focus:outline-none transition-all shadow-inner"
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!content.trim() || disabled}
          className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
            content.trim() && !disabled
              ? 'bg-brand-600 text-white hover:bg-brand-500 active:scale-95 shadow-md shadow-brand-500/25'
              : 'bg-slate-200 dark:bg-dark-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
          }`}
          title="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
