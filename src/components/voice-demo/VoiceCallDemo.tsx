"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MicOff, Mic, Volume2, PhoneOff, Grid3X3 } from "lucide-react";

// ─── Keyframe injection ───────────────────────────────────────────────────────

const STYLES = `
@keyframes vcBar {
  from { height: 6%; opacity: 0.3; }
  to   { height: var(--vc-bh, 65%); opacity: 0.85; }
}
.vc-bar-active {
  animation: vcBar var(--vc-dur, 0.6s) ease-in-out var(--vc-delay, 0s) infinite alternate;
}
@keyframes vcSlideUp {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
.vc-badge-in { animation: vcSlideUp 0.35s ease forwards; }
`;

// ─── Types ────────────────────────────────────────────────────────────────────

type CalendarAction = "book" | "move" | "cancel";

interface Choice { label: string; next: string; }
interface ConvNode {
  audioSrc: string;
  chloeText: string;
  choices: Choice[] | null;
  calendarAction?: CalendarAction;
}

// ─── Conversation Script ──────────────────────────────────────────────────────

const NODES: Record<string, ConvNode> = {
  opening: {
    audioSrc: "/audio/opening.mp3",
    chloeText: "Great to hear from you again, Jane! Are you calling to book something new, move an existing appointment, or cancel one?",
    choices: [
      { label: "Book something new", next: "a-1" },
      { label: "Move my appointment", next: "b-1" },
      { label: "Cancel my appointment", next: "c-1" },
    ],
  },
  "a-1": {
    audioSrc: "/audio/path-a-1.mp3",
    chloeText: "Are you thinking about something specific — like injectables, a facial, laser treatment — or not sure yet?",
    choices: [
      { label: "Injectables", next: "a-stub" },
      { label: "A facial", next: "a-2" },
      { label: "Laser treatment", next: "a-stub" },
      { label: "Not sure", next: "a-stub" },
    ],
  },
  "a-stub": {
    audioSrc: "/audio/path-a-stub.mp3",
    chloeText: "Great choice — I'll have one of our team members follow up with you shortly to find the perfect option.",
    choices: null,
  },
  "a-2": {
    audioSrc: "/audio/path-a-2.mp3",
    chloeText: "We have a few options — HydraFacial, Chemical Peel, or Microneedling. Which were you thinking?",
    choices: [
      { label: "HydraFacial", next: "a-3" },
      { label: "Chemical Peel", next: "a-3" },
      { label: "Microneedling", next: "a-3" },
    ],
  },
  "a-3": {
    audioSrc: "/audio/path-a-3.mp3",
    chloeText: "Got it — what day and time works for you?",
    choices: [
      { label: "Friday at 2pm", next: "a-4" },
      { label: "Monday at 10am", next: "a-4" },
      { label: "I'll pick another day", next: "a-4" },
    ],
  },
  "a-4": {
    audioSrc: "/audio/path-a-4.mp3",
    chloeText: "That time's open. Any preference on which of our team members you'd like?",
    choices: [
      { label: "No preference", next: "a-5" },
      { label: "Yes, let me choose", next: "a-5" },
    ],
  },
  "a-5": {
    audioSrc: "/audio/path-a-5.mp3",
    chloeText: "Want me to book it?",
    choices: [
      { label: "Yes, book it", next: "a-6" },
      { label: "Not yet", next: "a-notyet" },
    ],
  },
  "a-6": {
    audioSrc: "/audio/path-a-6.mp3",
    chloeText: "Done! You're booked for Friday at 2:00 PM.",
    choices: null,
    calendarAction: "book",
  },
  "a-notyet": {
    audioSrc: "/audio/path-a-notyet.mp3",
    chloeText: "No problem — just give us a call anytime you're ready. We're here 24/7!",
    choices: null,
  },
  "b-1": {
    audioSrc: "/audio/path-b-1.mp3",
    chloeText: "Of course — what new day and time works better?",
    choices: [
      { label: "Tuesday at 11am", next: "b-2" },
      { label: "Thursday at 3pm", next: "b-2" },
      { label: "I'll pick another day", next: "b-2" },
    ],
  },
  "b-2": {
    audioSrc: "/audio/path-b-2.mp3",
    chloeText: "Same provider as before, or would you like to change?",
    choices: [
      { label: "Same provider", next: "b-3" },
      { label: "I'd like to change", next: "b-3" },
    ],
  },
  "b-3": {
    audioSrc: "/audio/path-b-3.mp3",
    chloeText: "That time works — want me to lock it in?",
    choices: [
      { label: "Yes, lock it in", next: "b-4" },
      { label: "Not yet", next: "b-notyet" },
    ],
  },
  "b-4": {
    audioSrc: "/audio/path-b-4.mp3",
    chloeText: "Done, you're all moved to Tuesday at 11:00 AM.",
    choices: null,
    calendarAction: "move",
  },
  "b-notyet": {
    audioSrc: "/audio/path-b-notyet.mp3",
    chloeText: "No worries — your current appointment is still on the books. Call us anytime!",
    choices: null,
  },
  "c-1": {
    audioSrc: "/audio/path-c-1.mp3",
    chloeText: "I can take care of that — just to confirm, you want to cancel your upcoming appointment?",
    choices: [
      { label: "Yes, cancel it", next: "c-2" },
      { label: "No, keep it", next: "c-keep" },
    ],
  },
  "c-2": {
    audioSrc: "/audio/path-c-2.mp3",
    chloeText: "Cancelled. We hope to see you again soon.",
    choices: null,
    calendarAction: "cancel",
  },
  "c-keep": {
    audioSrc: "/audio/path-c-keep.mp3",
    chloeText: "No problem at all — we'll keep your appointment as is. See you then!",
    choices: null,
  },
};

// ─── Timer ────────────────────────────────────────────────────────────────────

function useCallTimer() {
  const [s, setS] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setS((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

// ─── Waveform ─────────────────────────────────────────────────────────────────

const BH = [22, 42, 60, 28, 70, 44, 18, 75, 36, 62, 24, 68, 46, 30, 64, 50, 20, 72, 38, 55, 27, 65, 40, 33, 58];

function Waveform({ active }: { active: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "3px", height: "30px" }} aria-hidden>
      {BH.map((h, i) => (
        <span
          key={i}
          className={active ? "vc-bar-active" : ""}
          style={{
            flex: 1,
            borderRadius: "2px",
            background: "rgba(255,255,255,0.55)",
            minHeight: "2px",
            height: active ? undefined : `${Math.max(h * 0.28, 6)}%`,
            ["--vc-bh" as string]: `${h}%`,
            ["--vc-dur" as string]: `${0.46 + ((i * 31) % 36) / 100}s`,
            ["--vc-delay" as string]: `${((i * 67) % 680) / 1000}s`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Square notification banner ───────────────────────────────────────────────

function SquareBanner({ action }: { action: CalendarAction | null }) {
  if (!action) return null;
  const map: Record<CalendarAction, { text: string; bg: string }> = {
    book:   { text: "✓ Booked to your Square calendar", bg: "rgba(34,197,94,0.18)" },
    move:   { text: "✓ Appointment moved in Square",    bg: "rgba(234,179,8,0.18)"  },
    cancel: { text: "✓ Cancelled in Square",            bg: "rgba(239,68,68,0.18)"  },
  };
  const { text, bg } = map[action];
  return (
    <div
      className="vc-badge-in mx-4 mb-3 rounded-xl px-3 py-2 text-center text-[10px] font-medium text-white"
      style={{ background: bg, border: "1px solid rgba(255,255,255,0.12)" }}
    >
      {text}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function VoiceCallDemo() {
  const [nodeId, setNodeId]         = useState("opening");
  const [lastChoice, setLastChoice] = useState<string | null>(null);
  const [waveActive, setWaveActive] = useState(false);
  const [visible, setVisible]       = useState(true);
  const [calAction, setCalAction]   = useState<CalendarAction | null>(null);
  const [muted, setMuted]           = useState(false);
  const [loud, setLoud]             = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timer = useCallTimer();
  const node = NODES[nodeId];

  const stopAudio = useCallback(() => {
    audioRef.current?.pause();
    audioRef.current = null;
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
  }, []);

  const playAudio = useCallback((src: string) => {
    stopAudio();
    setWaveActive(true);
    const audio = new Audio(src);
    audioRef.current = audio;
    const done = () => setWaveActive(false);
    audio.onended = done;
    audio.onerror = () => { timerRef.current = setTimeout(done, 3200); };
    audio.play().catch(() => { timerRef.current = setTimeout(done, 3200); });
  }, [stopAudio]);

  useEffect(() => {
    playAudio(node.audioSrc);
    return stopAudio;
  }, [nodeId]); // eslint-disable-line react-hooks/exhaustive-deps

  const go = (fn: () => void) => {
    setVisible(false);
    setTimeout(() => { fn(); setVisible(true); }, 260);
  };

  const handleChoice = (c: Choice) => {
    go(() => {
      const next = NODES[c.next];
      setLastChoice(c.label);
      setNodeId(c.next);
      if (next?.calendarAction) setCalAction(next.calendarAction);
    });
  };

  const handleReset = () => {
    go(() => {
      setNodeId("opening");
      setLastChoice(null);
      setCalAction(null);
    });
  };

  return (
    <>
      {/* Inject keyframe styles once */}
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div className="mx-auto w-full max-w-[290px]">
        {/* ── iPhone frame ─────────────────────────────────────── */}
        <div
          className="relative overflow-hidden rounded-[44px] border border-white/10"
          style={{
            background: "linear-gradient(160deg, #2a2a2e 0%, #1c1c1e 60%)",
            boxShadow: "0 28px 64px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.06)",
          }}
        >
          {/* Notch */}
          <div className="flex justify-center pt-3">
            <div className="h-6 w-[110px] rounded-b-2xl bg-black" />
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between px-7 pt-1.5 pb-0.5 text-[10px] text-white/40">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor">
                <rect x="0" y="4" width="2" height="6" rx="1" opacity=".4"/>
                <rect x="3" y="2.5" width="2" height="7.5" rx="1" opacity=".6"/>
                <rect x="6" y="1" width="2" height="9" rx="1" opacity=".8"/>
                <rect x="9" y="0" width="2" height="10" rx="1"/>
              </svg>
              <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor">
                <rect x="0" y="0" width="11" height="10" rx="1.5" opacity=".35"/>
                <rect x="0.5" y="0.5" width="9" height="9" rx="1" fill="currentColor" opacity=".85"/>
                <rect x="11.5" y="3" width="2" height="4" rx="1" opacity=".5"/>
              </svg>
            </div>
          </div>

          {/* Caller info */}
          <div className="px-6 pt-3 pb-4 text-center">
            <div
              className="mx-auto mb-3 flex h-[52px] w-[52px] items-center justify-center rounded-full text-lg font-bold text-white"
              style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)", boxShadow: "0 4px 16px rgba(99,102,241,0.4)" }}
            >
              C
            </div>
            <p className="text-[17px] font-semibold text-white">ABC Med Spa</p>
            <p className="mt-0.5 text-[11px] text-white/50">Chloe · AI Booking Assistant</p>
            <p className="mt-2 text-sm font-light tabular-nums text-white/70">{timer}</p>
          </div>

          {/* Waveform */}
          <div
            className="mx-5 mb-4 rounded-2xl px-4 py-3"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <Waveform active={waveActive} />
            <p className="mt-1.5 text-center text-[9px] text-white/30">
              {waveActive ? "Chloe is speaking…" : "Tap a response"}
            </p>
          </div>

          {/* Square notification */}
          <SquareBanner action={calAction} />

          {/* Conversation — cross-fade */}
          <div
            className="mx-4 mb-4"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(5px)",
              transition: "opacity 0.26s ease, transform 0.26s ease",
            }}
          >
            {/* Chloe bubble */}
            <div
              className="mb-3 rounded-2xl px-4 py-3"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <p className="mb-1 text-[9px] uppercase tracking-wider text-white/30">Chloe</p>
              <p className="text-[12px] font-light leading-relaxed text-white/90">{node.chloeText}</p>
            </div>

            {/* Visitor last response */}
            {lastChoice && (
              <div className="mb-3 flex justify-end">
                <div
                  className="max-w-[82%] rounded-2xl px-4 py-2.5"
                  style={{ background: "#6366f1", boxShadow: "0 2px 12px rgba(99,102,241,0.35)" }}
                >
                  <p className="text-[12px] text-white">{lastChoice}</p>
                </div>
              </div>
            )}

            {/* Choice buttons */}
            {node.choices ? (
              <div className="flex flex-col gap-1.5">
                {node.choices.map((c) => (
                  <button
                    key={c.label}
                    onClick={() => handleChoice(c)}
                    className="w-full rounded-full px-4 py-2 text-left text-[11px] font-light text-white/85 transition-all active:scale-[0.98]"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.14)",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.14)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center">
                <button
                  onClick={handleReset}
                  className="text-[10px] text-white/25 transition-colors hover:text-white/50"
                >
                  ↺ Start over
                </button>
              </div>
            )}
          </div>

          {/* ── Call controls ─────────────────────────────────── */}
          <div className="px-8 pb-9 pt-1">
            {/* Three icon buttons */}
            <div className="mb-6 flex justify-around">
              <button
                onClick={() => setMuted((m) => !m)}
                className="flex flex-col items-center gap-1.5"
              >
                <div
                  className="flex h-[52px] w-[52px] items-center justify-center rounded-full transition-colors"
                  style={{ background: muted ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.14)" }}
                >
                  {muted
                    ? <MicOff className="h-5 w-5 text-[#1c1c1e]" strokeWidth={1.75} />
                    : <Mic className="h-5 w-5 text-white" strokeWidth={1.75} />
                  }
                </div>
                <span className="text-[10px] text-white/40">mute</span>
              </button>

              <button className="flex flex-col items-center gap-1.5">
                <div
                  className="flex h-[52px] w-[52px] items-center justify-center rounded-full"
                  style={{ background: "rgba(255,255,255,0.14)" }}
                >
                  <Grid3X3 className="h-5 w-5 text-white" strokeWidth={1.75} />
                </div>
                <span className="text-[10px] text-white/40">keypad</span>
              </button>

              <button
                onClick={() => setLoud((l) => !l)}
                className="flex flex-col items-center gap-1.5"
              >
                <div
                  className="flex h-[52px] w-[52px] items-center justify-center rounded-full transition-colors"
                  style={{ background: loud ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.14)" }}
                >
                  <Volume2
                    className="h-5 w-5"
                    strokeWidth={1.75}
                    style={{ color: loud ? "#1c1c1e" : "white" }}
                  />
                </div>
                <span className="text-[10px] text-white/40">speaker</span>
              </button>
            </div>

            {/* End call */}
            <div className="flex justify-center">
              <button
                onClick={handleReset}
                className="flex h-[64px] w-[64px] items-center justify-center rounded-full transition-transform active:scale-95"
                style={{ background: "#ff3b30", boxShadow: "0 4px 20px rgba(255,59,48,0.45)" }}
                title="End call (restarts demo)"
              >
                <PhoneOff className="h-6 w-6 text-white" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
