'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

interface Message {
  role: 'bot' | 'user';
  content: string;
}

function getSuggestedReplies(botText: string): string[] | null {
  const t = botText.toLowerCase();

  // Phase 1 — existing patient found: book / reschedule / cancel
  if ((t.includes('book') || t.includes('schedule')) && t.includes('reschedule') && t.includes('cancel')) {
    return ['Book Appointment', 'Reschedule', 'Cancel'];
  }
  // Phase 2/3A — treatment type selection
  if (t.includes('treatment') && (t.includes('interested') || t.includes('looking for'))) {
    return ['Cleaning', 'Checkup', 'Other treatment'];
  }
  // Phase 3A — existing patient treatment selection: cleaning / checkup / something else
  if (t.includes('cleaning') && t.includes('checkup') && t.includes('something else')) {
    return ['Cleaning', 'Checkup', 'Something else'];
  }
  // Phase 2/3A — last dental cleaning
  if (t.includes('last') && (t.includes('cleaning') || t.includes('dental'))) {
    return ['Less than 6 months', '6-12 months ago', 'Over a year ago', 'Not sure'];
  }
  // Booking availability confirmed
  if (
    t.includes('shall i book') ||
    t.includes('want me to book') ||
    t.includes('shall i go ahead') ||
    (t.includes('available') && (t.includes('shall i book') || t.includes('book it')))
  ) {
    return ['Yes, book it!', 'Pick a different time'];
  }
  if (t.includes('available') && (t.includes('book') || t.includes('shall'))) {
    return ['Yes, book it!', 'Pick a different time'];
  }
  // Reschedule availability confirmed
  if (t.includes('shall i move') || (t.includes('available') && t.includes('move'))) {
    return ['Yes, reschedule it', 'Pick a different time'];
  }
  // Phase 3C — cancel confirmation
  if (t.includes('sure you want to cancel')) {
    return ['Yes, cancel it', 'No, keep it'];
  }
  // Post-knowledge-base answer
  if (t.includes('does that help') || t.includes('get back to scheduling')) {
    return ["Yes, let's schedule!", 'I have another question'];
  }
  // Wrap-up
  if (t.includes('anything else') || t.includes('help you with')) {
    return ["No, that's all. Thanks!", 'I have a question'];
  }
  return null;
}

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatIdRef = useRef<string | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const initializedRef = useRef(false);

  const scrollToBottom = useCallback(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, quickReplies, scrollToBottom]);

  const toggle = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next && !initializedRef.current) {
        initializedRef.current = true;
        setMessages([
          {
            role: 'bot',
            content:
              'Hi! Welcome to ABC Dental Clinic. To get started, are you a new or existing patient?',
          },
        ]);
        setQuickReplies(['New Patient', 'Existing Patient']);
      }
      if (next) {
        setTimeout(() => inputRef.current?.focus(), 320);
      }
      return next;
    });
  }, []);

  const send = useCallback(
    async (text?: string) => {
      const msg = (text ?? inputValue).trim();
      if (!msg || isBusy) return;
      setInputValue('');
      setQuickReplies([]);
      setMessages((prev) => [...prev, { role: 'user', content: msg }]);
      setIsBusy(true);
      setIsTyping(true);

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            widgetId: 'abc-dental',
            userMessage: msg,
            previousChatId: chatIdRef.current,
          }),
        });
        const data = await res.json();
        setIsTyping(false);

        if (!res.ok) {
          setMessages((prev) => [
            ...prev,
            { role: 'bot', content: 'Sorry, something went wrong. Please try again.' },
          ]);
        } else {
          if (data.chatId) chatIdRef.current = data.chatId;
          setMessages((prev) => [...prev, { role: 'bot', content: data.reply }]);
          const suggestions = getSuggestedReplies(data.reply);
          if (suggestions) setQuickReplies(suggestions);
        }
      } catch {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            role: 'bot',
            content: "I'm having trouble connecting right now. Please try again.",
          },
        ]);
      } finally {
        setIsBusy(false);
        inputRef.current?.focus();
      }
    },
    [inputValue, isBusy]
  );

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  return (
    <>
      {/* Launcher */}
      <button
        id="lc-launcher"
        onClick={toggle}
        aria-label="Chat with ABC Dental Clinic AI"
        aria-expanded={isOpen}
        className="fixed bottom-5 right-5 z-[10001] flex h-14 w-14 items-center justify-center rounded-full border-none bg-indigo-500 shadow-[0_4px_24px_rgba(99,102,241,0.35),0_2px_8px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-110 hover:shadow-[0_6px_32px_rgba(99,102,241,0.55)] active:scale-95 sm:bottom-7 sm:right-7 sm:h-16 sm:w-16"
      >
        {!isOpen && (
          <span className="absolute inset-0 animate-ping rounded-full bg-indigo-500 opacity-30" />
        )}
        {isOpen ? (
          <X className="h-5 w-5 text-white" />
        ) : (
          <MessageSquare className="h-6 w-6 text-white sm:h-7 sm:w-7" />
        )}
      </button>

      {/* Chat panel */}
      <div
        aria-hidden={!isOpen}
        role="dialog"
        aria-label="ABC Dental Clinic AI Chat"
        className={`fixed z-[10000] flex flex-col overflow-hidden rounded-2xl border border-black/[.08] bg-white shadow-[0_12px_48px_rgba(0,0,0,0.12),0_4px_16px_rgba(0,0,0,0.08)] transition-all duration-300 ${
          isOpen
            ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none translate-y-4 scale-[0.97] opacity-0'
        } bottom-[88px] left-3 right-3 h-[min(560px,calc(100vh-140px))] sm:bottom-[104px] sm:left-auto sm:right-7 sm:w-[380px]`}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center gap-3 bg-gradient-to-br from-indigo-500 to-indigo-700 px-4 py-3.5 sm:px-[18px] sm:py-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/20">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="block text-[0.93rem] font-semibold leading-tight text-white">
              ABC Dental Clinic
            </span>
            <span className="flex items-center gap-1.5 text-[0.73rem] text-white/85">
              <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-green-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
              Online
            </span>
          </div>
          <button
            onClick={toggle}
            aria-label="Close chat"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>

        {/* Messages */}
        <div
          ref={bodyRef}
          className="flex flex-1 flex-col gap-2.5 overflow-y-auto bg-[#fafafa] p-4 scrollbar-thin"
          aria-live="polite"
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex animate-[lcMsgIn_0.35s_ease-out] ${
                msg.role === 'bot' ? 'justify-start' : 'justify-end'
              }`}
            >
              <div
                className={`max-w-[82%] break-words rounded-2xl px-4 py-3 text-[0.88rem] leading-relaxed ${
                  msg.role === 'bot'
                    ? 'rounded-bl-sm bg-white text-zinc-800 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-black/[.06]'
                    : 'rounded-br-sm bg-indigo-500 text-white'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start animate-[lcMsgIn_0.35s_ease-out]">
              <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-white px-4 py-3 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-black/[.06]">
                <span className="h-[7px] w-[7px] animate-bounce rounded-full bg-zinc-300 [animation-delay:0ms]" />
                <span className="h-[7px] w-[7px] animate-bounce rounded-full bg-zinc-300 [animation-delay:150ms]" />
                <span className="h-[7px] w-[7px] animate-bounce rounded-full bg-zinc-300 [animation-delay:300ms]" />
              </div>
            </div>
          )}

          {quickReplies.length > 0 && (
            <div className="flex flex-wrap gap-2 py-1 animate-[lcMsgIn_0.35s_ease-out]">
              {quickReplies.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setQuickReplies([]);
                    send(opt);
                  }}
                  className="rounded-full border border-black/[.08] bg-white px-4 py-2 text-[0.84rem] font-medium text-zinc-700 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-600"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center gap-2 border-t border-black/[.08] bg-white px-3 py-3 sm:px-3.5">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Type a message..."
            maxLength={500}
            aria-label="Chat message"
            className="flex-1 rounded-full border border-black/[.08] bg-[#fafafa] px-4 py-2.5 text-base text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)] focus:outline-none"
          />
          <button
            onClick={() => send()}
            disabled={isBusy}
            aria-label="Send message"
            className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-indigo-500 text-white transition-all hover:bg-indigo-600 active:scale-90 disabled:cursor-not-allowed disabled:opacity-45"
          >
            <Send className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>
    </>
  );
}
