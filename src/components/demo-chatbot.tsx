'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { RefreshCw, Calendar, Mail, Users } from 'lucide-react';

/* ── types ────────────────────────────────────────────────── */
interface DemoOption {
  label: string;
  next: string;
}

interface DemoStep {
  id: string;
  user?: string;
  bot?: string;
  action?: string;
  options: DemoOption[];
}

type MsgKind = 'bot' | 'user' | 'typing' | 'spinner' | 'booked' | 'rescheduled';

interface ChatMsg {
  id: number;
  kind: MsgKind;
  text?: string;
  spinnerLabel?: string;
}

/* ── demo flow data (ported 1-to-1 from original script.js) ─ */
const demoFlow: DemoStep[] = [
  {
    id: 'start',
    bot: "Hi there! Welcome to ABC Dental Clinic. I'm your AI scheduling assistant. How can I help you today?",
    options: [
      { label: 'Book an appointment', next: 'treatment' },
      { label: 'Ask a question', next: 'question' },
      { label: 'Reschedule', next: 'reschedule' },
    ],
  },
  {
    id: 'treatment',
    user: "I'd like to book an appointment",
    bot: "I'd be happy to help! What type of treatment are you interested in?",
    options: [
      { label: 'Cleaning', next: 'cleaning_history' },
      { label: 'Checkup', next: 'cleaning_history' },
      { label: 'Other treatment', next: 'other_treatment' },
    ],
  },
  {
    id: 'cleaning_history',
    user: 'I need a dental cleaning',
    bot: 'Great choice! When was your last dental cleaning?',
    options: [
      { label: 'About 6 months ago', next: 'pick_time' },
      { label: 'Over a year ago', next: 'pick_time' },
      { label: "I'm not sure", next: 'pick_time' },
    ],
  },
  {
    id: 'consultation',
    user: "I'd like a consultation",
    bot: 'Excellent. A consultation is a great way to get started. What day and time works best for you?',
    options: [
      { label: 'Tomorrow at 2 PM', next: 'check_availability' },
      { label: 'Thursday at 10 AM', next: 'check_availability_alt' },
    ],
  },
  {
    id: 'other_treatment',
    user: 'I need another treatment',
    bot: "Got it — can you provide a few details for the doctor? Also, have you had this type of treatment before?",
    options: [
      { label: "First time, I'll explain in person", next: 'other_treatment_consult' },
      { label: "Yes, I've had it before", next: 'other_treatment_consult' },
    ],
  },
  {
    id: 'other_treatment_consult',
    user: "First time, I'll explain in person",
    bot: "Okay! The next step is a complimentary consultation with Dr. Murray Vega. What day and time works best?",
    options: [
      { label: 'Tomorrow at 2 PM', next: 'check_availability' },
      { label: 'Thursday at 10 AM', next: 'check_availability_alt' },
    ],
  },
  {
    id: 'pick_time',
    bot: "Thank you for that. Let's find a time — what day and time works best for you?",
    options: [
      { label: 'Tomorrow at 2 PM', next: 'check_availability' },
      { label: 'Thursday at 10 AM', next: 'check_availability_alt' },
      { label: 'Next Monday afternoon', next: 'check_availability' },
    ],
  },
  {
    id: 'check_availability',
    user: 'Tomorrow at 2:00 PM',
    action: 'calendar_check',
    bot: 'Great news! 2:00 PM tomorrow is available. Can I get your name and email to confirm?',
    options: [{ label: 'John Smith / john@email.com', next: 'confirm_booking' }],
  },
  {
    id: 'check_availability_alt',
    user: 'Thursday at 10:00 AM',
    action: 'calendar_check',
    bot: '10:00 AM Thursday is already booked. I have 10:30 AM and 1:00 PM available. Which works?',
    options: [
      { label: '10:30 AM works', next: 'confirm_booking_alt' },
      { label: '1:00 PM works', next: 'confirm_booking_alt' },
    ],
  },
  {
    id: 'confirm_booking',
    user: 'John Smith, john@email.com',
    bot: 'To confirm: 30-minute appointment tomorrow at 2:00 PM with Dr. Murray Vega. Shall I book it?',
    options: [{ label: 'Yes, book it!', next: 'booked' }],
  },
  {
    id: 'confirm_booking_alt',
    user: 'That works for me',
    bot: 'Can I get your name and email to finalize?',
    options: [{ label: 'John Smith / john@email.com', next: 'confirm_booking_final' }],
  },
  {
    id: 'confirm_booking_final',
    user: 'John Smith, john@email.com',
    bot: "Let me book that for you...",
    action: 'booking',
    options: [],
  },
  {
    id: 'booked',
    user: 'Yes, book it!',
    action: 'booking',
    options: [],
  },
  {
    id: 'question',
    user: 'I have a question',
    bot: 'Of course! What would you like to know?',
    options: [
      { label: 'What are your hours?', next: 'hours_answer' },
      { label: 'Do you accept insurance?', next: 'insurance_answer' },
      { label: 'Where are you located?', next: 'location_answer' },
    ],
  },
  {
    id: 'hours_answer',
    user: 'What are your hours?',
    action: 'rag_search',
    bot: "We're open Monday through Friday, 8:00 AM to 6:00 PM. Closed weekends. Would you like to book?",
    options: [
      { label: 'Yes, book an appointment', next: 'treatment' },
      { label: 'No thanks!', next: 'goodbye' },
    ],
  },
  {
    id: 'insurance_answer',
    user: 'Do you accept insurance?',
    action: 'rag_search',
    bot: 'Yes! We accept Delta Dental, Cigna, Aetna, MetLife, and more. We also offer payment plans. Want to schedule?',
    options: [
      { label: 'Yes, book an appointment', next: 'treatment' },
      { label: "That's all, thanks!", next: 'goodbye' },
    ],
  },
  {
    id: 'location_answer',
    user: 'Where are you located?',
    action: 'rag_search',
    bot: "We're in the heart of Las Vegas with convenient parking. Want to schedule a visit?",
    options: [
      { label: 'Yes, book an appointment', next: 'treatment' },
      { label: 'Thanks!', next: 'goodbye' },
    ],
  },
  {
    id: 'reschedule',
    user: 'I need to reschedule',
    action: 'calendar_lookup',
    bot: 'I found your upcoming appointment on Wednesday at 3:00 PM. What new time works?',
    options: [
      { label: 'Friday at 11 AM', next: 'reschedule_confirm' },
      { label: 'Next Tuesday at 2 PM', next: 'reschedule_confirm' },
    ],
  },
  {
    id: 'reschedule_confirm',
    user: 'Friday at 11:00 AM',
    action: 'calendar_check',
    bot: 'Friday at 11:00 AM is available! Shall I move your appointment?',
    options: [{ label: 'Yes, reschedule it', next: 'rescheduled' }],
  },
  {
    id: 'rescheduled',
    user: 'Yes, reschedule it',
    action: 'reschedule_action',
    options: [],
  },
  {
    id: 'goodbye',
    user: "That's all, thanks!",
    bot: "You're welcome! Have a wonderful day.",
    options: [{ label: 'Start over', next: 'restart' }],
  },
];

function getStep(id: string) {
  return demoFlow.find((s) => s.id === id);
}

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/* ── spinner label map ───────────────────────────────────── */
const spinnerLabels: Record<string, string> = {
  calendar_check: 'Checking calendar availability...',
  rag_search: 'Searching knowledge base...',
  calendar_lookup: 'Looking up your appointment...',
};

/* ── Booking Confirmation card ───────────────────────────── */
function BookingConfirmation() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-green-500/20 bg-green-500/5 p-3.5 sm:p-4">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-500/20">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-zinc-900">Appointment Booked!</p>
        <p className="mt-0.5 text-xs text-zinc-500">Added to calendar. Confirmation email sent.</p>
        <ul className="mt-2 space-y-1.5">
          {[
            { Icon: Calendar, text: 'Google Calendar updated' },
            { Icon: Mail, text: 'Confirmation email sent' },
            { Icon: Users, text: 'Contact saved to CRM' },
          ].map(({ Icon, text }) => (
            <li key={text} className="flex items-center gap-1.5 text-[11px] text-zinc-400 sm:text-xs">
              <Icon className="h-3 w-3 shrink-0" />
              {text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ── Reschedule Confirmation card ────────────────────────── */
function RescheduleConfirmation() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-green-500/20 bg-green-500/5 p-3.5 sm:p-4">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-500/20">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-zinc-900">Rescheduled!</p>
        <p className="mt-0.5 text-xs text-zinc-500">Your appointment has been moved.</p>
        <ul className="mt-2 space-y-1.5">
          {[
            { Icon: RefreshCw, text: 'Calendar updated' },
            { Icon: Mail, text: 'Rescheduling email sent' },
          ].map(({ Icon, text }) => (
            <li key={text} className="flex items-center gap-1.5 text-[11px] text-zinc-400 sm:text-xs">
              <Icon className="h-3 w-3 shrink-0" />
              {text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ── Spinner card ────────────────────────────────────────── */
function SpinnerCard({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-black/[.08] bg-[#fafafa] px-3.5 py-3 text-xs text-zinc-500">
      <svg className="h-3.5 w-3.5 animate-spin text-indigo-400" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
      {label}
    </div>
  );
}

/* ── Typing dots ─────────────────────────────────────────── */
function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-white px-4 py-3 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-black/[.06]">
      {[0, 150, 300].map((d) => (
        <span
          key={d}
          className="h-[7px] w-[7px] animate-bounce rounded-full bg-zinc-300"
          style={{ animationDelay: `${d}ms` }}
        />
      ))}
    </div>
  );
}

/* ── Main component ──────────────────────────────────────── */
export default function DemoChatbot() {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [options, setOptions] = useState<DemoOption[]>([]);
  const msgId = useRef(0);
  const bodyRef = useRef<HTMLDivElement>(null);
  const runningRef = useRef(false);

  const nextId = () => ++msgId.current;

  const scrollBottom = useCallback(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, []);

  useEffect(() => { scrollBottom(); }, [messages, options, scrollBottom]);

  const startDemo = useCallback(async () => {
    if (runningRef.current) return;
    runningRef.current = true;
    setMessages([]);
    setOptions([]);
    await delay(400);

    const step = getStep('start')!;
    const typId = nextId();
    setMessages([{ id: typId, kind: 'typing' }]);
    await delay(1000);
    setMessages([{ id: nextId(), kind: 'bot', text: step.bot }]);
    setOptions(step.options);
    runningRef.current = false;
  }, []);

  useEffect(() => { startDemo(); }, [startDemo]);

  const handleOption = useCallback(async (opt: DemoOption) => {
    if (runningRef.current) return;
    if (opt.next === 'restart') { startDemo(); return; }
    const step = getStep(opt.next);
    if (!step) return;

    runningRef.current = true;
    setOptions([]);

    if (step.user) {
      setMessages((p) => [...p, { id: nextId(), kind: 'user', text: step.user }]);
      await delay(400);
    }

    // ── spinner actions ──────────────────────────────────
    if (step.action && spinnerLabels[step.action]) {
      const spId = nextId();
      setMessages((p) => [...p, { id: spId, kind: 'spinner', spinnerLabel: spinnerLabels[step.action!] }]);
      await delay(step.action === 'calendar_check' ? 1600 : 1400);
      setMessages((p) => p.filter((m) => m.id !== spId));
    }

    // ── booking / reschedule finals ──────────────────────
    if (step.action === 'booking') {
      const typId = nextId();
      setMessages((p) => [...p, { id: typId, kind: 'typing' }]);
      await delay(1100);
      setMessages((p) => p.filter((m) => m.id !== typId));
      setMessages((p) => [...p, { id: nextId(), kind: 'booked' }]);
      await delay(600);
      setOptions([{ label: 'Try again', next: 'restart' }]);
      runningRef.current = false;
      return;
    }

    if (step.action === 'reschedule_action') {
      const typId = nextId();
      setMessages((p) => [...p, { id: typId, kind: 'typing' }]);
      await delay(1100);
      setMessages((p) => p.filter((m) => m.id !== typId));
      setMessages((p) => [...p, { id: nextId(), kind: 'rescheduled' }]);
      await delay(600);
      setOptions([{ label: 'Try again', next: 'restart' }]);
      runningRef.current = false;
      return;
    }

    // ── normal bot reply ─────────────────────────────────
    if (step.bot) {
      const typId = nextId();
      setMessages((p) => [...p, { id: typId, kind: 'typing' }]);
      await delay(800 + Math.random() * 400);
      setMessages((p) => p.filter((m) => m.id !== typId));
      setMessages((p) => [...p, { id: nextId(), kind: 'bot', text: step.bot }]);
    }

    await delay(250);
    setOptions(step.options);
    runningRef.current = false;
  }, [startDemo]);

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-black/[.08] bg-white shadow-[0_2px_20px_rgba(0,0,0,0.06)]" style={{ height: 'min(520px, calc(100vh - 200px))' }}>
      {/* Header */}
      <div className="flex shrink-0 items-center gap-2 border-b border-black/[.08] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
        <span className="text-sm font-medium text-zinc-700">Appointly AI</span>
        <span className="ml-auto rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-medium text-green-500">
          Online
        </span>
      </div>

      {/* Messages */}
      <div
        ref={bodyRef}
        className="flex flex-1 flex-col gap-2.5 overflow-y-auto bg-[#fafafa] p-4"
      >
        {messages.map((msg) => {
          if (msg.kind === 'user') {
            return (
              <div key={msg.id} className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-indigo-500 px-4 py-2.5 text-[0.88rem] leading-relaxed text-white">
                  {msg.text}
                </div>
              </div>
            );
          }
          if (msg.kind === 'bot') {
            return (
              <div key={msg.id} className="flex justify-start">
                <div className="msg-label-wrap">
                  <p className="mb-1 text-[10px] font-medium uppercase tracking-widest text-zinc-400">Appointly AI</p>
                  <div className="max-w-[80%] rounded-2xl rounded-bl-sm bg-white px-4 py-2.5 text-[0.88rem] leading-relaxed text-zinc-800 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-black/[.06]">
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          }
          if (msg.kind === 'typing') {
            return (
              <div key={msg.id} className="flex justify-start">
                <TypingDots />
              </div>
            );
          }
          if (msg.kind === 'spinner') {
            return (
              <div key={msg.id} className="flex justify-start">
                <SpinnerCard label={msg.spinnerLabel!} />
              </div>
            );
          }
          if (msg.kind === 'booked') {
            return (
              <div key={msg.id} className="flex justify-start">
                <div className="w-full max-w-[85%]">
                  <p className="mb-1 text-[10px] font-medium uppercase tracking-widest text-zinc-400">Appointly AI</p>
                  <BookingConfirmation />
                </div>
              </div>
            );
          }
          if (msg.kind === 'rescheduled') {
            return (
              <div key={msg.id} className="flex justify-start">
                <div className="w-full max-w-[85%]">
                  <p className="mb-1 text-[10px] font-medium uppercase tracking-widest text-zinc-400">Appointly AI</p>
                  <RescheduleConfirmation />
                </div>
              </div>
            );
          }
          return null;
        })}

        {/* Quick-reply options */}
        {options.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {options.map((opt) => (
              <button
                key={opt.label}
                onClick={() => handleOption(opt)}
                className="rounded-full border border-black/[.08] bg-white px-3.5 py-2 text-[0.84rem] font-medium text-zinc-700 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-600"
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer restart */}
      <div className="shrink-0 border-t border-black/[.08] bg-white px-4 py-3">
        <button
          onClick={startDemo}
          className="flex items-center gap-1.5 text-xs text-zinc-400 transition-colors hover:text-zinc-600"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Restart Demo
        </button>
      </div>
    </div>
  );
}
