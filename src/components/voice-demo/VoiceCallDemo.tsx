"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { PhoneOff } from "lucide-react";

// ─── Keyframe injection ───────────────────────────────────────────────────────

const STYLES = `
@keyframes vcBar {
  from { height: 6%; opacity: 0.3; }
  to   { height: var(--vc-bh, 65%); opacity: 0.85; }
}
.vc-bar-active {
  animation: vcBar var(--vc-dur, 0.6s) ease-in-out var(--vc-delay, 0s) infinite alternate;
}
@keyframes vcBadge {
  from { opacity: 0; transform: translateY(5px); }
  to   { opacity: 1; transform: translateY(0); }
}
.vc-badge-in { animation: vcBadge 0.35s ease forwards; }
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
    <div style={{ display: "flex", alignItems: "center", gap: "3px", height: "28px" }} aria-hidden>
      {BH.map((h, i) => (
        <span
          key={i}
          className={active ? "vc-bar-active" : ""}
          style={{
            flex: 1,
            borderRadius: "2px",
            background: "rgba(255,255,255,0.5)",
            minHeight: "2px",
            height: active ? undefined : `${Math.max(h * 0.26, 5)}%`,
            ["--vc-bh" as string]: `${h}%`,
            ["--vc-dur" as string]: `${0.46 + ((i * 31) % 36) / 100}s`,
            ["--vc-delay" as string]: `${((i * 67) % 680) / 1000}s`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Square notification ──────────────────────────────────────────────────────

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
      style={{ background: bg, border: "1px solid rgba(255,255,255,0.1)" }}
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
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div className="flex flex-col items-center">
        {/* ── iPhone frame — fixed 330 × 560 ────────────────── */}
        <div
          style={{
            width: "330px",
            height: "560px",
            background: "linear-gradient(160deg, #2a2a2e 0%, #1c1c1e 60%)",
            borderRadius: "44px",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 28px 64px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.05)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Notch */}
          <div style={{ display: "flex", justifyContent: "center", paddingTop: "10px" }}>
            <div style={{ height: "24px", width: "110px", background: "#000", borderRadius: "0 0 18px 18px" }} />
          </div>

          {/* Status bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 28px 0", color: "rgba(255,255,255,0.4)", fontSize: "10px" }}>
            <span>9:41</span>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor">
                <rect x="0" y="4" width="2" height="6" rx="1" opacity=".4"/>
                <rect x="3" y="2.5" width="2" height="7.5" rx="1" opacity=".6"/>
                <rect x="6" y="1" width="2" height="9" rx="1" opacity=".8"/>
                <rect x="9" y="0" width="2" height="10" rx="1"/>
              </svg>
              <svg width="16" height="10" viewBox="0 0 16 10" fill="currentColor">
                <rect x="0" y="0" width="13" height="10" rx="2" opacity=".35"/>
                <rect x="0.5" y="0.5" width="11" height="9" rx="1.5" opacity=".9"/>
                <rect x="13.5" y="3" width="2" height="4" rx="1" opacity=".5"/>
              </svg>
            </div>
          </div>

          {/* Caller info */}
          <div style={{ textAlign: "center", padding: "12px 24px 10px" }}>
            <div style={{
              margin: "0 auto 10px",
              width: "52px", height: "52px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1, #818cf8)",
              boxShadow: "0 4px 16px rgba(99,102,241,0.4)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <img src="/apivo-logo.png" alt="Apivo" style={{ height: "22px", width: "auto", objectFit: "contain" }} />
            </div>
            <p style={{ color: "#fff", fontSize: "17px", fontWeight: 600, margin: 0 }}>ABC Med Spa</p>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "11px", marginTop: "2px" }}>Chloe · AI Booking Assistant</p>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "13px", fontWeight: 300, marginTop: "6px", fontVariantNumeric: "tabular-nums" }}>{timer}</p>
          </div>

          {/* Waveform */}
          <div style={{ margin: "0 20px 12px", background: "rgba(255,255,255,0.06)", borderRadius: "14px", padding: "10px 16px 8px" }}>
            <Waveform active={waveActive} />
            <p style={{ margin: "6px 0 0", textAlign: "center", fontSize: "9px", color: "rgba(255,255,255,0.28)" }}>
              {waveActive ? "Chloe is speaking…" : "Tap a response"}
            </p>
          </div>

          {/* Square badge */}
          <SquareBanner action={calAction} />

          {/* Conversation — cross-fades, flex-1 so it fills remaining height */}
          <div
            style={{
              flex: 1,
              padding: "0 16px",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(5px)",
              transition: "opacity 0.26s ease, transform 0.26s ease",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
            {/* Chloe bubble — top-left corner flat */}
            <div style={{
              background: "rgba(255,255,255,0.09)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "0 16px 16px 16px",
              padding: "10px 14px",
              marginBottom: "10px",
            }}>
              <p style={{ margin: "0 0 4px", fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(255,255,255,0.28)" }}>Chloe</p>
              <p style={{ margin: 0, fontSize: "12px", fontWeight: 300, lineHeight: 1.55, color: "rgba(255,255,255,0.9)" }}>{node.chloeText}</p>
            </div>

            {/* Visitor last choice — top-right corner flat */}
            {lastChoice && (
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
                <div style={{
                  background: "#6366f1",
                  borderRadius: "16px 0 16px 16px",
                  padding: "9px 14px",
                  maxWidth: "82%",
                  boxShadow: "0 2px 12px rgba(99,102,241,0.35)",
                }}>
                  <p style={{ margin: 0, fontSize: "12px", color: "#fff" }}>{lastChoice}</p>
                </div>
              </div>
            )}

            {/* Choice buttons */}
            {node.choices && (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", paddingBottom: "12px" }}>
                {node.choices.map((c) => (
                  <button
                    key={c.label}
                    onClick={() => handleChoice(c)}
                    style={{
                      width: "100%",
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.13)",
                      borderRadius: "999px",
                      padding: "8px 16px",
                      textAlign: "left",
                      fontSize: "11px",
                      fontWeight: 300,
                      color: "rgba(255,255,255,0.85)",
                      cursor: "pointer",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* End call */}
          <div style={{ display: "flex", justifyContent: "center", paddingBottom: "28px", paddingTop: "4px" }}>
            <button
              onClick={handleReset}
              title="End call"
              style={{
                width: "60px", height: "60px",
                borderRadius: "50%",
                background: "#ff3b30",
                boxShadow: "0 4px 20px rgba(255,59,48,0.45)",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "none", cursor: "pointer",
                transition: "transform 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <PhoneOff style={{ width: "22px", height: "22px", color: "#fff" }} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* ── Restart demo — below the phone ───────────────── */}
        <div style={{ height: "28px", display: "flex", alignItems: "center", marginTop: "10px" }}>
          <button
            onClick={handleReset}
            style={{
              background: "none", border: "none",
              fontSize: "12px", color: "#a1a1aa",
              cursor: "pointer", transition: "color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#6366f1")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#a1a1aa")}
          >
            ↺ Restart demo
          </button>
        </div>
      </div>
    </>
  );
}
