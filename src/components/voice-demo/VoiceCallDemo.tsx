"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Phone, PhoneOff } from "lucide-react";

// ─── Keyframe injection ───────────────────────────────────────────────────────

const STYLES = `
@keyframes vcBar {
  from { height: 15%; opacity: 0.35; }
  to   { height: var(--vc-bh, 85%); opacity: 0.9; }
}
.vc-bar { animation: vcBar var(--vc-dur, 0.55s) ease-in-out var(--vc-delay, 0s) infinite alternate; }
@keyframes vcRing {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50%       { transform: scale(1.18); opacity: 0.15; }
}
.vc-ring { animation: vcRing 1.6s ease-in-out infinite; }
`;

// ─── Types ────────────────────────────────────────────────────────────────────

type CalendarAction = "book" | "move" | "cancel";
type MsgKind = "chloe" | "user" | "typing" | "square";
type Phase = "idle" | "active";

interface Msg {
  id: number;
  kind: MsgKind;
  text?: string;
  squareAction?: CalendarAction;
}

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
    audioSrc: "/audio/1.wav",
    chloeText: "Thank you for calling ABC MedSpa. This is Chloe. How can I help you today?",
    choices: [
      { label: "New appointment.", next: "service" },
    ],
  },
  service: {
    audioSrc: "/audio/2.wav",
    chloeText: "What service would you like to schedule?",
    choices: [
      { label: "HydraFacial.", next: "first-time" },
    ],
  },
  "first-time": {
    audioSrc: "/audio/3.wav",
    chloeText: "We absolutely do HydraFacials. Have you had one before, or would this be your first time?",
    choices: [
      { label: "First time.", next: "scheduling" },
    ],
  },
  scheduling: {
    audioSrc: "/audio/4.wav",
    chloeText: "Got it. Since facials don't require a consultation first, we can get you scheduled right away. What day and time works best for you?",
    choices: [
      { label: "Monday at 1 PM.", next: "availability" },
    ],
  },
  availability: {
    audioSrc: "/audio/5.wav",
    chloeText: "Good news — 1:00 PM is available. Want me to go ahead and lock that in?",
    choices: [
      { label: "Yes.", next: "name-request" },
    ],
  },
  "name-request": {
    audioSrc: "/audio/6.wav",
    chloeText: "Perfect. Can I get your full name for the reservation?",
    choices: [
      { label: "Jane Smith.", next: "confirmation" },
    ],
  },
  confirmation: {
    audioSrc: "/audio/7.wav",
    chloeText: "You're all set, Jane. You should receive a confirmation text shortly. We're looking forward to seeing you — if anything comes up before then, just reach out. Have a great day!",
    choices: null,
    calendarAction: "book",
  },
};

// ─── Timer (only ticks while active) ─────────────────────────────────────────

function useCallTimer(active: boolean, frozen: boolean) {
  const [s, setS] = useState(0);
  useEffect(() => {
    if (!active) { setS(0); return; }
    if (frozen) return;
    const id = setInterval(() => setS((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, [active, frozen]);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

// ─── Voice typing indicator (waveform in a bubble) ────────────────────────────

const WAVE_BH = [45, 80, 60, 90, 50, 75, 40, 85, 55];

function VoiceTyping() {
  return (
    <div
      className="flex items-center gap-[3px] rounded-2xl rounded-bl-sm px-3 py-2.5"
      style={{
        background: "rgba(255,255,255,0.1)",
        border: "1px solid rgba(255,255,255,0.07)",
        width: "fit-content",
      }}
    >
      {WAVE_BH.map((h, i) => (
        <span
          key={i}
          className="vc-bar"
          style={{
            display: "inline-block",
            width: "3px",
            height: "14px",
            borderRadius: "2px",
            background: "rgba(255,255,255,0.55)",
            ["--vc-bh" as string]: `${h}%`,
            ["--vc-dur" as string]: `${0.45 + i * 0.06}s`,
            ["--vc-delay" as string]: `${i * 0.07}s`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Square inline banner ─────────────────────────────────────────────────────

function SquareMsg({ action }: { action: CalendarAction }) {
  const map: Record<CalendarAction, { text: string; color: string }> = {
    book:   { text: "✓ Booked to your Square calendar", color: "rgba(34,197,94,0.2)"  },
    move:   { text: "✓ Appointment moved in Square",    color: "rgba(234,179,8,0.2)"   },
    cancel: { text: "✓ Cancelled in Square",            color: "rgba(239,68,68,0.2)"   },
  };
  const { text, color } = map[action];
  return (
    <div
      className="rounded-xl px-3 py-1.5 text-center text-[11px] font-medium text-white/80"
      style={{ background: color, border: "1px solid rgba(255,255,255,0.1)" }}
    >
      {text}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
let msgCounter = 0;

export default function VoiceCallDemo() {
  const [phase, setPhase]           = useState<Phase>("idle");
  const [messages, setMessages]     = useState<Msg[]>([]);
  const [choices, setChoices]       = useState<Choice[]>([]);
  const [running, setRunning]       = useState(false);
  const [timerFrozen, setTimerFrozen] = useState(false);
  const bodyRef                     = useRef<HTMLDivElement>(null);
  const audioRef                    = useRef<HTMLAudioElement | null>(null);
  const timerRef                    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timer                       = useCallTimer(phase === "active", timerFrozen);

  const scrollBottom = useCallback(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, []);

  useEffect(() => { scrollBottom(); }, [messages, choices, scrollBottom]);

  const stopAudio = useCallback(() => {
    audioRef.current?.pause();
    audioRef.current = null;
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
  }, []);

  const playAudio = useCallback((src: string): Promise<void> => {
    stopAudio();
    return new Promise((resolve) => {
      const audio = new Audio(src);
      audioRef.current = audio;
      const done = () => { stopAudio(); resolve(); };
      audio.onended = done;
      audio.onerror = () => { timerRef.current = setTimeout(done, 2400); };
      audio.play().catch(() => { timerRef.current = setTimeout(done, 2400); });
    });
  }, [stopAudio]);

  const addMsg = (msg: Omit<Msg, "id">): number => {
    const id = ++msgCounter;
    setMessages((prev) => [...prev, { ...msg, id }]);
    return id;
  };

  const removeMsg = (id: number) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const updateMsg = (id: number, text: string) => {
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, text } : m));
  };

  const getAudioDuration = (src: string): Promise<number> =>
    new Promise((resolve) => {
      const a = new Audio(src);
      a.onloadedmetadata = () => resolve(a.duration * 1000);
      a.onerror = () => resolve(2400);
      setTimeout(() => resolve(2400), 2000);
    });

  const streamWords = async (id: number, text: string, durationMs: number) => {
    const words = text.split(" ");
    const msPerWord = Math.max(80, durationMs / words.length);
    let built = "";
    for (const word of words) {
      built += (built ? " " : "") + word;
      updateMsg(id, built);
      await delay(msPerWord);
    }
  };

  // Answer the incoming call — transition to active and start conversation
  const answerCall = useCallback(async () => {
    if (running) return;
    setPhase("active");
    setRunning(true);
    stopAudio();
    msgCounter = 0;
    setMessages([]);
    setChoices([]);

    await delay(300);
    const duration = await getAudioDuration(NODES.opening.audioSrc);
    const msgId = addMsg({ kind: "chloe", text: "" });
    await Promise.all([
      playAudio(NODES.opening.audioSrc),
      streamWords(msgId, NODES.opening.chloeText, duration),
    ]);
    await delay(200);
    setChoices(NODES.opening.choices ?? []);
    setRunning(false);
  }, [running, playAudio, stopAudio]);

  // Hang up / restart — go back to idle pre-screen
  const hangUp = useCallback(() => {
    stopAudio();
    setPhase("idle");
    setMessages([]);
    setChoices([]);
    setRunning(false);
    setTimerFrozen(false);
    msgCounter = 0;
  }, [stopAudio]);

  const handleChoice = useCallback(async (choice: Choice) => {
    if (running) return;
    setRunning(true);
    setChoices([]);

    addMsg({ kind: "user", text: choice.label });
    await delay(300);

    const next = NODES[choice.next];
    const duration = await getAudioDuration(next.audioSrc);
    const msgId = addMsg({ kind: "chloe", text: "" });
    await Promise.all([
      playAudio(next.audioSrc),
      streamWords(msgId, next.chloeText, duration),
    ]);

    if (next.calendarAction) {
      setTimerFrozen(true);
      await delay(300);
      addMsg({ kind: "square", squareAction: next.calendarAction });
    }

    await delay(200);
    setChoices(next.choices ?? []);
    setRunning(false);
  }, [running, playAudio]);

  return (
    <div className="flex flex-col items-center">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* iPhone wrapper — 290px phone chrome */}
      <div style={{ width: "290px" }}>

        {/* Phone body */}
        <div
          className="relative"
          style={{
            background: "#1c1c1e",
            borderRadius: "44px",
            padding: "8px",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.10), 0 0 0 2px rgba(255,255,255,0.03), 0 28px 72px rgba(0,0,0,0.55)",
          }}
        >
          {/* Side buttons */}
          <div style={{ position: "absolute", left: "-3px", top: "48px",  width: "3px", height: "20px", background: "#3a3a3c", borderRadius: "2px 0 0 2px" }} />
          <div style={{ position: "absolute", left: "-3px", top: "78px",  width: "3px", height: "30px", background: "#3a3a3c", borderRadius: "2px 0 0 2px" }} />
          <div style={{ position: "absolute", left: "-3px", top: "118px", width: "3px", height: "30px", background: "#3a3a3c", borderRadius: "2px 0 0 2px" }} />
          <div style={{ position: "absolute", right: "-3px", top: "94px", width: "3px", height: "60px", background: "#3a3a3c", borderRadius: "0 2px 2px 0" }} />

          {/* Screen */}
          <div
            className="flex flex-col overflow-hidden"
            style={{
              background: "linear-gradient(160deg, #2e2e32 0%, #1c1c1e 60%)",
              borderRadius: "36px",
              height: "600px",
            }}
          >
            {/* Dynamic Island */}
            <div className="flex shrink-0 justify-center" style={{ paddingTop: "10px", paddingBottom: "5px" }}>
              <div style={{ width: "94px", height: "26px", background: "#000", borderRadius: "16px" }} />
            </div>

            {/* Status bar */}
            <div className="flex shrink-0 items-center justify-between" style={{ padding: "0 20px 5px" }}>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.85)", letterSpacing: "0.01em" }}>
                2:15
              </span>
              <div className="flex items-center gap-1.5">
                <svg width="14" height="10" viewBox="0 0 14 10" fill="rgba(255,255,255,0.75)">
                  <rect x="0"   y="5.5" width="2.5" height="4.5" rx="0.5"/>
                  <rect x="3.8" y="3.5" width="2.5" height="6.5" rx="0.5"/>
                  <rect x="7.6" y="1.5" width="2.5" height="8.5" rx="0.5"/>
                  <rect x="11.4" y="0"  width="2.5" height="10"  rx="0.5"/>
                </svg>
                <svg width="13" height="10" viewBox="0 0 13 10" fill="none">
                  <path d="M0.5 3.5C3 1.3 10 1.3 12.5 3.5" stroke="rgba(255,255,255,0.75)" strokeWidth="1.3" strokeLinecap="round"/>
                  <path d="M2.5 6C4.2 4.6 8.8 4.6 10.5 6" stroke="rgba(255,255,255,0.75)" strokeWidth="1.3" strokeLinecap="round"/>
                  <path d="M4.7 8.3C5.4 7.7 7.6 7.7 8.3 8.3" stroke="rgba(255,255,255,0.75)" strokeWidth="1.3" strokeLinecap="round"/>
                  <circle cx="6.5" cy="9.7" r="0.7" fill="rgba(255,255,255,0.75)"/>
                </svg>
                <svg width="22" height="10" viewBox="0 0 22 10" fill="none">
                  <rect x="0.5" y="0.5" width="18" height="9" rx="2"   stroke="rgba(255,255,255,0.5)" strokeWidth="1"/>
                  <rect x="19"  y="3.5" width="2"  height="3" rx="1"   fill="rgba(255,255,255,0.5)"/>
                  <rect x="1.5" y="1.5" width="14" height="7" rx="1.5" fill="rgba(255,255,255,0.75)"/>
                </svg>
              </div>
            </div>

            {/* ── IDLE: outgoing call dialer ────────────────────── */}
            {phase === "idle" ? (
              <div className="flex flex-1 flex-col" style={{ paddingBottom: "60px" }}>
                {/* Spacer above centers name between top and keypad */}
                <div className="flex-1" />
                <div className="flex items-center justify-center">
                  <p className="text-lg font-semibold text-white">ABC Med Spa</p>
                </div>
                <div className="flex-1" />

                {/* Keypad */}
                <div className="grid grid-cols-3 gap-y-5 px-5">
                  {["1","2","3","4","5","6","7","8","9","*","0","#"].map((d) => (
                    <div key={d} className="flex justify-center">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-full"
                        style={{ background: "rgba(255,255,255,0.13)" }}
                      >
                        <span className="text-2xl font-light leading-none text-white">{d}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Call button — mt-5 matches gap-y-5 row spacing */}
                <div className="mt-5 flex flex-col items-center gap-1.5">
                  <button
                    onClick={answerCall}
                    className="flex h-14 w-14 items-center justify-center rounded-full transition-transform active:scale-95"
                    style={{ background: "#22c55e", boxShadow: "0 4px 20px rgba(34,197,94,0.5)" }}
                  >
                    <Phone style={{ width: "26px", height: "26px", color: "#fff" }} strokeWidth={2} />
                  </button>
                  <p className="text-[11px] text-white/30">Tap to call</p>
                </div>
              </div>
            ) : (
              /* ── ACTIVE: live call ───────────────────────────── */
              <>
                <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", flexShrink: 0 }} />

                {/* Call header */}
                <div className="flex shrink-0 items-center gap-2 px-3 py-2">
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                    style={{
                      background: "linear-gradient(135deg, #6366f1, #818cf8)",
                      boxShadow: "0 2px 6px rgba(99,102,241,0.45)",
                    }}
                  >
                    <img src="/apivo-favicon_white.png" alt="Apivo" style={{ height: "12px", width: "12px", objectFit: "contain" }} />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col leading-none">
                    <span className="truncate text-xs font-semibold text-white">ABC Med Spa</span>
                    <span className="mt-0.5 flex items-center gap-1 text-[10px] font-medium" style={{ color: "#22c55e" }}>
                      <span style={{ display: "inline-block", width: "5px", height: "5px", borderRadius: "50%", background: "#22c55e" }} />
                      Live call · {timer}
                    </span>
                  </div>
                  <button
                    onClick={hangUp}
                    title="End call"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-transform active:scale-95"
                    style={{ background: "#ff3b30", boxShadow: "0 2px 8px rgba(255,59,48,0.4)" }}
                  >
                    <PhoneOff style={{ width: "12px", height: "12px", color: "#fff" }} strokeWidth={2.5} />
                  </button>
                </div>

                {/* Messages */}
                <div
                  ref={bodyRef}
                  className="flex flex-1 flex-col gap-2 overflow-y-auto p-3"
                  style={{ background: "rgba(0,0,0,0.12)" }}
                >
                  {messages.map((msg) => {
                    if (msg.kind === "chloe") return (
                      <div key={msg.id} className="flex justify-start">
                        <div
                          className="max-w-[85%] rounded-2xl rounded-bl-sm px-3 py-2 text-xs leading-relaxed"
                          style={{
                            background: "rgba(255,255,255,0.1)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            color: "rgba(255,255,255,0.92)",
                          }}
                        >
                          {msg.text}
                        </div>
                      </div>
                    );
                    if (msg.kind === "user") return (
                      <div key={msg.id} className="flex justify-end">
                        <div
                          className="max-w-[85%] rounded-2xl rounded-br-sm px-3 py-2 text-xs leading-relaxed text-white"
                          style={{ background: "#6366f1", boxShadow: "0 2px 8px rgba(99,102,241,0.3)" }}
                        >
                          {msg.text}
                        </div>
                      </div>
                    );
                    if (msg.kind === "typing") return (
                      <div key={msg.id} className="flex justify-start">
                        <VoiceTyping />
                      </div>
                    );
                    if (msg.kind === "square") return (
                      <div key={msg.id} className="flex justify-center">
                        <SquareMsg action={msg.squareAction!} />
                      </div>
                    );
                    return null;
                  })}

                  {choices.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {choices.map((c) => (
                        <button
                          key={c.label}
                          onClick={() => handleChoice(c)}
                          className="rounded-full px-3 py-1.5 text-[0.72rem] font-medium transition-all"
                          style={{
                            border: "1px solid rgba(255,255,255,0.18)",
                            background: "rgba(255,255,255,0.07)",
                            color: "rgba(255,255,255,0.85)",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(99,102,241,0.35)";
                            e.currentTarget.style.borderColor = "rgba(99,102,241,0.6)";
                            e.currentTarget.style.color = "#fff";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
                            e.currentTarget.style.color = "rgba(255,255,255,0.85)";
                          }}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Always rendered to keep section height stable; hidden when idle */}
      <div className="mt-3" style={{ visibility: phase === "active" ? "visible" : "hidden" }}>
        <button
          onClick={hangUp}
          className="flex items-center gap-1.5 text-xs text-zinc-400 transition-colors hover:text-zinc-600"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
          </svg>
          Restart Demo
        </button>
      </div>
    </div>
  );
}
