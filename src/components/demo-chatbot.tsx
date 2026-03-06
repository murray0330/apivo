'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { RefreshCw, Calendar, Mail, Users, XCircle, Sparkles } from 'lucide-react';

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

type MsgKind = 'bot' | 'user' | 'typing' | 'spinner' | 'booked' | 'rescheduled' | 'cancelled';

interface ChatMsg {
  id: number;
  kind: MsgKind;
  text?: string;
  spinnerLabel?: string;
}

/* ── demo flow ───────────────────────────────────────────── */
const demoFlow: DemoStep[] = [
  // ── START ────────────────────────────────────────────────────
  {
    id: 'start',
    bot: "Hi! Welcome to ABC Med Spa. To get started, are you a new or returning client?",
    options: [
      { label: 'New client', next: 'new_patient' },
      { label: "I've visited before", next: 'existing_patient' },
      { label: 'I have a question', next: 'question' },
    ],
  },

  // ── NEW PATIENT ──────────────────────────────────────────────
  {
    id: 'new_patient',
    user: 'New client',
    bot: "Great! We'd love to have you. What service are you interested in today?",
    options: [
      { label: 'Injectables', next: 'svc_injectables' },
      { label: 'Skin Rejuvenation', next: 'svc_skin' },
      { label: 'Body & Hair', next: 'svc_body_hair' },
      { label: 'Other service', next: 'other_treatment' },
    ],
  },

  // ── NEW PATIENT: SERVICE CATEGORIES ─────────────────────────
  {
    id: 'svc_injectables',
    user: 'Injectables',
    bot: 'Which injectable service are you interested in?',
    options: [
      { label: 'Botox / Neurotoxins', next: 'svc_botox' },
      { label: 'Dermal Fillers', next: 'svc_fillers' },
    ],
  },
  {
    id: 'svc_skin',
    user: 'Skin Rejuvenation',
    bot: 'Which skin treatment are you looking for?',
    options: [
      { label: 'Chemical Peels', next: 'svc_peels' },
      { label: 'HydraFacial', next: 'svc_hydra' },
      { label: 'Microneedling', next: 'svc_micro' },
      { label: 'IPL Photofacials', next: 'svc_ipl' },
      { label: 'Laser Skin Resurfacing', next: 'svc_laser' },
    ],
  },
  {
    id: 'svc_body_hair',
    user: 'Body & Hair',
    bot: 'Which service interests you?',
    options: [
      { label: 'Laser Hair Removal', next: 'svc_hair_removal' },
      { label: 'Body Contouring (CoolSculpting/Emsculpt)', next: 'svc_body_contour' },
    ],
  },

  // ── NEW PATIENT: SPECIFIC SERVICES ──────────────────────────
  {
    id: 'svc_botox',
    user: 'Botox / Neurotoxins',
    bot: 'Great choice! What day and time works best for you?',
    options: [
      { label: 'Tomorrow at 2 PM', next: 'check_availability' },
      { label: 'Thursday at 10 AM', next: 'check_availability_alt' },
    ],
  },
  {
    id: 'svc_fillers',
    user: 'Dermal Fillers',
    bot: 'Wonderful! What day and time works best for you?',
    options: [
      { label: 'Tomorrow at 2 PM', next: 'check_availability' },
      { label: 'Thursday at 10 AM', next: 'check_availability_alt' },
    ],
  },
  {
    id: 'svc_peels',
    user: 'Chemical Peels',
    bot: 'Perfect. What day and time works best for you?',
    options: [
      { label: 'Tomorrow at 2 PM', next: 'check_availability' },
      { label: 'Thursday at 10 AM', next: 'check_availability_alt' },
    ],
  },
  {
    id: 'svc_hydra',
    user: 'HydraFacial',
    bot: 'Great choice! What day and time works best for you?',
    options: [
      { label: 'Tomorrow at 2 PM', next: 'check_availability' },
      { label: 'Thursday at 10 AM', next: 'check_availability_alt' },
    ],
  },
  {
    id: 'svc_micro',
    user: 'Microneedling',
    bot: 'Perfect. What day and time works best for you?',
    options: [
      { label: 'Tomorrow at 2 PM', next: 'check_availability' },
      { label: 'Thursday at 10 AM', next: 'check_availability_alt' },
    ],
  },
  {
    id: 'svc_ipl',
    user: 'IPL Photofacials',
    bot: 'Great choice! What day and time works best for you?',
    options: [
      { label: 'Tomorrow at 2 PM', next: 'check_availability' },
      { label: 'Thursday at 10 AM', next: 'check_availability_alt' },
    ],
  },
  {
    id: 'svc_laser',
    user: 'Laser Skin Resurfacing',
    bot: 'Perfect. What day and time works best for you?',
    options: [
      { label: 'Tomorrow at 2 PM', next: 'check_availability' },
      { label: 'Thursday at 10 AM', next: 'check_availability_alt' },
    ],
  },
  {
    id: 'svc_hair_removal',
    user: 'Laser Hair Removal',
    bot: 'Great choice! What day and time works best for you?',
    options: [
      { label: 'Tomorrow at 2 PM', next: 'check_availability' },
      { label: 'Thursday at 10 AM', next: 'check_availability_alt' },
    ],
  },
  {
    id: 'svc_body_contour',
    user: 'Body Contouring (CoolSculpting/Emsculpt)',
    bot: 'Wonderful! What day and time works best for you?',
    options: [
      { label: 'Tomorrow at 2 PM', next: 'check_availability' },
      { label: 'Thursday at 10 AM', next: 'check_availability_alt' },
    ],
  },
  {
    id: 'other_treatment',
    user: 'Other service',
    bot: "Can you provide some details for our team? Also, have you had this type of service before?",
    options: [
      { label: "First time — I'll explain in person", next: 'other_treatment_consult' },
      { label: "Yes, I've had it before", next: 'other_treatment_consult' },
    ],
  },
  {
    id: 'other_treatment_consult',
    user: "First time — I'll explain in person",
    bot: "Okay. The next step is a complimentary consultation with our lead aesthetician. What day and time works best?",
    options: [
      { label: 'Tomorrow at 2 PM', next: 'check_availability' },
      { label: 'Thursday at 10 AM', next: 'check_availability_alt' },
    ],
  },

  // ── AVAILABILITY ─────────────────────────────────────────────
  {
    id: 'check_availability',
    user: 'Tomorrow at 2:00 PM',
    action: 'calendar_check',
    bot: 'Good news, that time is available. Shall I book that?',
    options: [
      { label: 'Yes, book it!', next: 'get_name' },
      { label: 'Pick a different time', next: 'pick_time_retry' },
    ],
  },
  {
    id: 'check_availability_alt',
    user: 'Thursday at 10:00 AM',
    action: 'calendar_check',
    bot: 'That time is unavailable. However, I have 10:30 AM or 1:00 PM available. Would either work?',
    options: [
      { label: '10:30 AM works', next: 'get_name' },
      { label: '1:00 PM works', next: 'get_name' },
    ],
  },
  {
    id: 'pick_time_retry',
    user: 'Pick a different time',
    bot: 'No problem. What other time works for you?',
    options: [
      { label: 'Thursday at 10 AM', next: 'check_availability_alt' },
      { label: 'Friday at 3 PM', next: 'check_availability' },
    ],
  },

  // ── CONTACT INFO (NEW PATIENT) ───────────────────────────────
  {
    id: 'get_name',
    user: 'Yes, book it!',
    bot: 'Perfect. What is your full name?',
    options: [{ label: 'Jane Smith', next: 'get_insurance' }],
  },
  {
    id: 'get_insurance',
    user: 'Jane Smith',
    bot: "Got it, Jane! Do you have any skin concerns or allergies we should note before your appointment?",
    options: [
      { label: "Yes, I'll share in person", next: 'get_phone' },
      { label: 'No concerns', next: 'get_phone' },
    ],
  },
  {
    id: 'get_phone',
    user: 'No concerns',
    bot: 'Great. What is the best phone number to reach you?',
    options: [{ label: '(555) 123-4567', next: 'get_email' }],
  },
  {
    id: 'get_email',
    user: '(555) 123-4567',
    bot: 'And your email address for the confirmation?',
    options: [{ label: 'jane@email.com', next: 'booked' }],
  },
  {
    id: 'booked',
    user: 'jane@email.com',
    action: 'booking',
    options: [],
  },

  // ── EXISTING PATIENT ─────────────────────────────────────────
  {
    id: 'existing_patient',
    user: "I've visited before",
    bot: "Welcome back! Please share the phone number or email associated with your profile so I can look you up.",
    options: [{ label: 'john@email.com', next: 'lookup_client' }],
  },
  {
    id: 'lookup_client',
    user: 'john@email.com',
    action: 'calendar_lookup',
    bot: "Thanks, John! I have your profile open. Are you looking to book a new appointment, reschedule, or cancel?",
    options: [
      { label: 'Book a new appointment', next: 'existing_book' },
      { label: 'Reschedule', next: 'reschedule' },
      { label: 'Cancel', next: 'cancel' },
    ],
  },
  {
    id: 'existing_book',
    user: 'Book a new appointment',
    bot: "Great! What service are you looking for?",
    options: [
      { label: 'Injectables', next: 'ex_svc_injectables' },
      { label: 'Skin Rejuvenation', next: 'ex_svc_skin' },
      { label: 'Body & Hair', next: 'ex_svc_body_hair' },
      { label: 'Something else', next: 'existing_other' },
    ],
  },

  // ── EXISTING PATIENT: SERVICE CATEGORIES ────────────────────
  {
    id: 'ex_svc_injectables',
    user: 'Injectables',
    bot: 'Which injectable service are you interested in?',
    options: [
      { label: 'Botox / Neurotoxins', next: 'ex_svc_botox' },
      { label: 'Dermal Fillers', next: 'ex_svc_fillers' },
    ],
  },
  {
    id: 'ex_svc_skin',
    user: 'Skin Rejuvenation',
    bot: 'Which skin treatment are you looking for?',
    options: [
      { label: 'Chemical Peels', next: 'ex_svc_peels' },
      { label: 'HydraFacial', next: 'ex_svc_hydra' },
      { label: 'Microneedling', next: 'ex_svc_micro' },
      { label: 'IPL Photofacials', next: 'ex_svc_ipl' },
      { label: 'Laser Skin Resurfacing', next: 'ex_svc_laser' },
    ],
  },
  {
    id: 'ex_svc_body_hair',
    user: 'Body & Hair',
    bot: 'Which service interests you?',
    options: [
      { label: 'Laser Hair Removal', next: 'ex_svc_hair_removal' },
      { label: 'Body Contouring (CoolSculpting/Emsculpt)', next: 'ex_svc_body_contour' },
    ],
  },

  // ── EXISTING PATIENT: SPECIFIC SERVICES ─────────────────────
  {
    id: 'ex_svc_botox',
    user: 'Botox / Neurotoxins',
    bot: 'Great choice! What day and time works best?',
    options: [
      { label: 'Tomorrow at 2 PM', next: 'existing_check_availability' },
      { label: 'Thursday at 10 AM', next: 'existing_check_alt' },
    ],
  },
  {
    id: 'ex_svc_fillers',
    user: 'Dermal Fillers',
    bot: 'Wonderful! What day and time works best?',
    options: [
      { label: 'Tomorrow at 2 PM', next: 'existing_check_availability' },
      { label: 'Thursday at 10 AM', next: 'existing_check_alt' },
    ],
  },
  {
    id: 'ex_svc_peels',
    user: 'Chemical Peels',
    bot: 'Perfect. What day and time works best?',
    options: [
      { label: 'Tomorrow at 2 PM', next: 'existing_check_availability' },
      { label: 'Thursday at 10 AM', next: 'existing_check_alt' },
    ],
  },
  {
    id: 'ex_svc_hydra',
    user: 'HydraFacial',
    bot: 'Great choice! What day and time works best?',
    options: [
      { label: 'Tomorrow at 2 PM', next: 'existing_check_availability' },
      { label: 'Thursday at 10 AM', next: 'existing_check_alt' },
    ],
  },
  {
    id: 'ex_svc_micro',
    user: 'Microneedling',
    bot: 'Perfect. What day and time works best?',
    options: [
      { label: 'Tomorrow at 2 PM', next: 'existing_check_availability' },
      { label: 'Thursday at 10 AM', next: 'existing_check_alt' },
    ],
  },
  {
    id: 'ex_svc_ipl',
    user: 'IPL Photofacials',
    bot: 'Great choice! What day and time works best?',
    options: [
      { label: 'Tomorrow at 2 PM', next: 'existing_check_availability' },
      { label: 'Thursday at 10 AM', next: 'existing_check_alt' },
    ],
  },
  {
    id: 'ex_svc_laser',
    user: 'Laser Skin Resurfacing',
    bot: 'Perfect. What day and time works best?',
    options: [
      { label: 'Tomorrow at 2 PM', next: 'existing_check_availability' },
      { label: 'Thursday at 10 AM', next: 'existing_check_alt' },
    ],
  },
  {
    id: 'ex_svc_hair_removal',
    user: 'Laser Hair Removal',
    bot: 'Great choice! What day and time works best?',
    options: [
      { label: 'Tomorrow at 2 PM', next: 'existing_check_availability' },
      { label: 'Thursday at 10 AM', next: 'existing_check_alt' },
    ],
  },
  {
    id: 'ex_svc_body_contour',
    user: 'Body Contouring (CoolSculpting/Emsculpt)',
    bot: 'Wonderful! What day and time works best?',
    options: [
      { label: 'Tomorrow at 2 PM', next: 'existing_check_availability' },
      { label: 'Thursday at 10 AM', next: 'existing_check_alt' },
    ],
  },
  {
    id: 'existing_other',
    user: 'Something else',
    bot: "Can you provide some details for our team?",
    options: [{ label: "I'll explain in person", next: 'existing_consult' }],
  },
  {
    id: 'existing_consult',
    user: "I'll explain in person",
    bot: "Okay. The next step is a complimentary consultation with our lead aesthetician. What day and time works best?",
    options: [
      { label: 'Tomorrow at 2 PM', next: 'existing_check_availability' },
      { label: 'Thursday at 10 AM', next: 'existing_check_alt' },
    ],
  },
  {
    id: 'existing_check_availability',
    user: 'Tomorrow at 2:00 PM',
    action: 'calendar_check',
    bot: "Good news, that time is available. Shall I book it?",
    options: [{ label: 'Yes, book it!', next: 'existing_booked' }],
  },
  {
    id: 'existing_check_alt',
    user: 'Thursday at 10:00 AM',
    action: 'calendar_check',
    bot: "That time is unavailable. However, I have 10:30 AM or 1:00 PM available. Would either work?",
    options: [
      { label: '10:30 AM works', next: 'existing_booked' },
      { label: '1:00 PM works', next: 'existing_booked' },
    ],
  },
  {
    id: 'existing_booked',
    user: 'Yes, book it!',
    action: 'booking',
    options: [],
  },

  // ── RESCHEDULE ───────────────────────────────────────────────
  {
    id: 'reschedule',
    user: 'Reschedule',
    bot: 'No problem. What new day and time would you prefer?',
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

  // ── CANCEL ───────────────────────────────────────────────────
  {
    id: 'cancel',
    user: 'Cancel',
    bot: "I understand. Just to confirm, are you sure you want to cancel your appointment?",
    options: [
      { label: 'Yes, cancel it', next: 'cancelled' },
      { label: 'No, keep it', next: 'keep_appointment' },
    ],
  },
  {
    id: 'cancelled',
    user: 'Yes, cancel it',
    action: 'cancel_action',
    options: [],
  },
  {
    id: 'keep_appointment',
    user: 'No, keep it',
    bot: "Okay, I've left your appointment as is. Can I help with anything else?",
    options: [{ label: "No, that's all. Thanks!", next: 'goodbye' }],
  },

  // ── QUESTIONS ────────────────────────────────────────────────
  {
    id: 'question',
    user: 'I have a question',
    bot: 'Of course! What would you like to know?',
    options: [
      { label: 'What are your hours?', next: 'hours_answer' },
      { label: 'What services do you offer?', next: 'insurance_answer' },
      { label: 'Where are you located?', next: 'location_answer' },
    ],
  },
  {
    id: 'hours_answer',
    user: 'What are your hours?',
    action: 'rag_search',
    bot: "We're open Monday through Saturday, 9:00 AM to 7:00 PM. Does that help? Shall we get back to scheduling?",
    options: [
      { label: 'Yes, book an appointment', next: 'new_patient' },
      { label: "No, that's all. Thanks!", next: 'goodbye' },
    ],
  },
  {
    id: 'insurance_answer',
    user: 'What services do you offer?',
    action: 'rag_search',
    bot: "We offer Botox, fillers, laser treatments, facials, skin rejuvenation, and more. We also offer packages and memberships. Does that help? Shall we get back to scheduling?",
    options: [
      { label: 'Yes, book an appointment', next: 'new_patient' },
      { label: "No, that's all. Thanks!", next: 'goodbye' },
    ],
  },
  {
    id: 'location_answer',
    user: 'Where are you located?',
    action: 'rag_search',
    bot: "We're located in Virginia Beach with convenient parking available. Does that help? Shall we get back to scheduling?",
    options: [
      { label: 'Yes, book an appointment', next: 'new_patient' },
      { label: "No, that's all. Thanks!", next: 'goodbye' },
    ],
  },

  // ── GOODBYE ──────────────────────────────────────────────────
  {
    id: 'goodbye',
    user: "No, that's all. Thanks!",
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
  calendar_lookup: 'Looking up your file...',
  cancel_action: 'Cancelling appointment...',
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
            { Icon: Calendar, text: 'Acuity Scheduling updated' },
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

/* ── Cancel Confirmation card ────────────────────────────── */
function CancelConfirmation() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-3.5 sm:p-4">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-500/20">
        <XCircle className="h-4 w-4 text-red-400" strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-zinc-900">Appointment Cancelled</p>
        <p className="mt-0.5 text-xs text-zinc-500">Your appointment has been cancelled. Have a good day.</p>
        <ul className="mt-2 space-y-1.5">
          {[
            { Icon: Calendar, text: 'Calendar updated' },
            { Icon: Mail, text: 'Cancellation email sent' },
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

    // ── booking final ────────────────────────────────────
    if (step.action === 'booking') {
      const spId2 = nextId();
      setMessages((p) => [...p, { id: spId2, kind: 'spinner', spinnerLabel: 'Booking your appointment...' }]);
      await delay(1600);
      setMessages((p) => p.filter((m) => m.id !== spId2));
      const typId = nextId();
      setMessages((p) => [...p, { id: typId, kind: 'typing' }]);
      await delay(1000);
      setMessages((p) => p.filter((m) => m.id !== typId));
      setMessages((p) => [...p, { id: nextId(), kind: 'bot', text: "You're all set! Your appointment has been booked and a confirmation email is on its way. We look forward to seeing you!" }]);
      await delay(700);
      setMessages((p) => [...p, { id: nextId(), kind: 'booked' }]);
      await delay(600);
      setOptions([]);
      runningRef.current = false;
      return;
    }

    // ── reschedule final ─────────────────────────────────
    if (step.action === 'reschedule_action') {
      const typId = nextId();
      setMessages((p) => [...p, { id: typId, kind: 'typing' }]);
      await delay(1100);
      setMessages((p) => p.filter((m) => m.id !== typId));
      setMessages((p) => [...p, { id: nextId(), kind: 'bot', text: "You're all set! Your appointment has been rescheduled and a confirmation email is on its way. We look forward to seeing you!" }]);
      await delay(700);
      setMessages((p) => [...p, { id: nextId(), kind: 'rescheduled' }]);
      await delay(600);
      setOptions([]);
      runningRef.current = false;
      return;
    }

    // ── cancel final ─────────────────────────────────────
    if (step.action === 'cancel_action') {
      const typId = nextId();
      setMessages((p) => [...p, { id: typId, kind: 'typing' }]);
      await delay(1100);
      setMessages((p) => p.filter((m) => m.id !== typId));
      setMessages((p) => [...p, { id: nextId(), kind: 'bot', text: "Done! Your appointment has been cancelled. We hope to see you again soon — feel free to reach out anytime." }]);
      await delay(700);
      setMessages((p) => [...p, { id: nextId(), kind: 'cancelled' }]);
      await delay(600);
      setOptions([]);
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
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-50">
          <Sparkles className="h-3.5 w-3.5 text-indigo-500" strokeWidth={1.75} />
        </div>
        <span className="text-sm font-medium text-zinc-700">ABC Med Spa</span>
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
                <div className="max-w-[80%] rounded-2xl rounded-bl-sm bg-white px-4 py-2.5 text-[0.88rem] leading-relaxed text-zinc-800 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-black/[.06]">
                  {msg.text}
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
                  <BookingConfirmation />
                </div>
              </div>
            );
          }
          if (msg.kind === 'rescheduled') {
            return (
              <div key={msg.id} className="flex justify-start">
                <div className="w-full max-w-[85%]">
                  <RescheduleConfirmation />
                </div>
              </div>
            );
          }
          if (msg.kind === 'cancelled') {
            return (
              <div key={msg.id} className="flex justify-start">
                <div className="w-full max-w-[85%]">
                  <CancelConfirmation />
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
