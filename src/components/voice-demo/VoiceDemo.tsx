"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./VoiceDemo.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

type CalendarAction = "book" | "move" | "cancel";
type CalendarState = "initial" | "booked" | "moved" | "cancelled";
type ApptStatus = "normal" | "new" | "moved" | "cancelled";

interface Choice {
  label: string;
  next: string;
}

interface ConversationNode {
  id: string;
  audioSrc: string;
  chloeText: string;
  choices: Choice[] | null;
  calendarAction?: CalendarAction;
}

// ─── Conversation Script ──────────────────────────────────────────────────────

const NODES: Record<string, ConversationNode> = {
  opening: {
    id: "opening",
    audioSrc: "/audio/opening.mp3",
    chloeText:
      "Great to hear from you again, Jane! Are you calling to book something new, move an existing appointment, or cancel one?",
    choices: [
      { label: "Book something new", next: "a-1" },
      { label: "Move my appointment", next: "b-1" },
      { label: "Cancel my appointment", next: "c-1" },
    ],
  },

  // ── Path A: Book ────────────────────────────────────────────────────────────
  "a-1": {
    id: "a-1",
    audioSrc: "/audio/path-a-1.mp3",
    chloeText:
      "Are you thinking about something specific — like injectables, a facial, laser treatment — or not sure yet?",
    choices: [
      { label: "Injectables", next: "a-stub" },
      { label: "A facial", next: "a-2" },
      { label: "Laser treatment", next: "a-stub" },
      { label: "Not sure", next: "a-stub" },
    ],
  },
  "a-stub": {
    id: "a-stub",
    audioSrc: "/audio/path-a-stub.mp3",
    chloeText:
      "Great choice — I'll have one of our team members follow up with you shortly to find the perfect option.",
    choices: null,
  },
  "a-2": {
    id: "a-2",
    audioSrc: "/audio/path-a-2.mp3",
    chloeText:
      "We have a few options — HydraFacial, Chemical Peel, or Microneedling. Which were you thinking?",
    choices: [
      { label: "HydraFacial", next: "a-3" },
      { label: "Chemical Peel", next: "a-3" },
      { label: "Microneedling", next: "a-3" },
    ],
  },
  "a-3": {
    id: "a-3",
    audioSrc: "/audio/path-a-3.mp3",
    chloeText: "Got it — what day and time works for you?",
    choices: [
      { label: "Friday at 2pm", next: "a-4" },
      { label: "Monday at 10am", next: "a-4" },
      { label: "I'll pick another day", next: "a-4" },
    ],
  },
  "a-4": {
    id: "a-4",
    audioSrc: "/audio/path-a-4.mp3",
    chloeText:
      "That time's open. Any preference on which of our team members you'd like?",
    choices: [
      { label: "No preference", next: "a-5" },
      { label: "Yes, let me choose", next: "a-5" },
    ],
  },
  "a-5": {
    id: "a-5",
    audioSrc: "/audio/path-a-5.mp3",
    chloeText: "Want me to book it?",
    choices: [
      { label: "Yes, book it", next: "a-6" },
      { label: "Not yet", next: "a-notyet" },
    ],
  },
  "a-6": {
    id: "a-6",
    audioSrc: "/audio/path-a-6.mp3",
    chloeText: "Done! You're booked for Friday at 2:00 PM.",
    choices: null,
    calendarAction: "book",
  },
  "a-notyet": {
    id: "a-notyet",
    audioSrc: "/audio/path-a-notyet.mp3",
    chloeText:
      "No problem — just give us a call anytime you're ready. We're here 24/7!",
    choices: null,
  },

  // ── Path B: Move ─────────────────────────────────────────────────────────────
  "b-1": {
    id: "b-1",
    audioSrc: "/audio/path-b-1.mp3",
    chloeText: "Of course — what new day and time works better?",
    choices: [
      { label: "Tuesday at 11am", next: "b-2" },
      { label: "Thursday at 3pm", next: "b-2" },
      { label: "I'll pick another day", next: "b-2" },
    ],
  },
  "b-2": {
    id: "b-2",
    audioSrc: "/audio/path-b-2.mp3",
    chloeText: "Same provider as before, or would you like to change?",
    choices: [
      { label: "Same provider", next: "b-3" },
      { label: "I'd like to change", next: "b-3" },
    ],
  },
  "b-3": {
    id: "b-3",
    audioSrc: "/audio/path-b-3.mp3",
    chloeText: "That time works — want me to lock it in?",
    choices: [
      { label: "Yes, lock it in", next: "b-4" },
      { label: "Not yet", next: "b-notyet" },
    ],
  },
  "b-4": {
    id: "b-4",
    audioSrc: "/audio/path-b-4.mp3",
    chloeText: "Done, you're all moved to Tuesday at 11:00 AM.",
    choices: null,
    calendarAction: "move",
  },
  "b-notyet": {
    id: "b-notyet",
    audioSrc: "/audio/path-b-notyet.mp3",
    chloeText:
      "No worries — your current appointment is still on the books. Call us anytime!",
    choices: null,
  },

  // ── Path C: Cancel ───────────────────────────────────────────────────────────
  "c-1": {
    id: "c-1",
    audioSrc: "/audio/path-c-1.mp3",
    chloeText:
      "I can take care of that — just to confirm, you want to cancel your upcoming appointment?",
    choices: [
      { label: "Yes, cancel it", next: "c-2" },
      { label: "No, keep it", next: "c-keep" },
    ],
  },
  "c-2": {
    id: "c-2",
    audioSrc: "/audio/path-c-2.mp3",
    chloeText: "Cancelled. We hope to see you again soon.",
    choices: null,
    calendarAction: "cancel",
  },
  "c-keep": {
    id: "c-keep",
    audioSrc: "/audio/path-c-keep.mp3",
    chloeText:
      "No problem at all — we'll keep your appointment as is. See you then!",
    choices: null,
  },
};

// ─── Waveform ─────────────────────────────────────────────────────────────────

const BAR_HEIGHTS = [
  22, 40, 58, 28, 68, 44, 18, 75, 36, 60, 25, 70, 46, 30, 62,
  52, 20, 72, 38, 54, 27, 64, 42, 33, 58, 46, 22, 78, 36, 50,
];

function Waveform({ active }: { active: boolean }) {
  return (
    <div className={styles.waveformBlock}>
      <div className={styles.waveformBars} aria-hidden>
        {BAR_HEIGHTS.map((h, i) => (
          <span
            key={i}
            className={`${styles.bar} ${active ? styles.barActive : ""}`}
            style={
              {
                "--bar-h": `${h}%`,
                "--delay": `${((i * 67) % 680) / 1000}s`,
                "--dur": `${0.48 + ((i * 31) % 34) / 100}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
      <p className={styles.waveStatus}>
        <span
          className={`${styles.statusDot} ${active ? styles.statusDotActive : ""}`}
        />
        {active ? "Chloe is speaking…" : "Tap a response below"}
      </p>
    </div>
  );
}

// ─── Mini Calendar ────────────────────────────────────────────────────────────

// Days: 0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri
// Times index: 0=9:00, 1=10:00, 2=11:00, 3=12:00, 4=1:00, 5=2:00, 6=3:00, 7=4:00
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const TIMES = ["9:00", "10:00", "11:00", "12:00", "1:00", "2:00", "3:00", "4:00"];

interface Appt {
  day: number;
  time: number;
  label: string;
  id: string;
}

const BASE_APPTS: Appt[] = [
  { day: 0, time: 0, label: "Botox – Maria", id: "maria" },
  { day: 2, time: 5, label: "HydraFacial – Jane", id: "jane" }, // Wed 2:00 PM
  { day: 3, time: 2, label: "Peel – Sarah", id: "sarah" },      // Thu 11:00 AM
];

function MiniCalendar({ state }: { state: CalendarState }) {
  const slots: Record<string, { label: string; status: ApptStatus }> = {};

  for (const a of BASE_APPTS) {
    const key = `${a.day}-${a.time}`;
    if (a.id === "jane" && state === "cancelled") {
      slots[key] = { label: a.label, status: "cancelled" };
    } else if (a.id === "jane" && state === "moved") {
      // old slot intentionally omitted — Jane is now on Tuesday
    } else {
      slots[key] = { label: a.label, status: "normal" };
    }
  }

  if (state === "booked") {
    slots["4-5"] = { label: "HydraFacial – Jane", status: "new" };  // Fri 2:00 PM
  }
  if (state === "moved") {
    slots["1-2"] = { label: "HydraFacial – Jane", status: "moved" }; // Tue 11:00 AM
  }

  const badgeLabel =
    state === "booked" ? "Booked ✓" :
    state === "moved"  ? "Moved ✓" :
    state === "cancelled" ? "Cancelled" : null;

  const badgeClass =
    state === "booked" ? styles.badgeGreen :
    state === "moved"  ? styles.badgeAmber :
    state === "cancelled" ? styles.badgeRed : "";

  return (
    <div className={styles.calendar}>
      <div className={styles.calHeader}>
        <span className={styles.calTitle}>ABC Med Spa · This Week</span>
        {badgeLabel && (
          <span className={`${styles.calBadge} ${badgeClass}`}>{badgeLabel}</span>
        )}
      </div>

      {/* Day header row */}
      <div className={styles.calDayRow}>
        <div className={styles.calCorner} />
        {DAYS.map((d) => (
          <div key={d} className={styles.calDayHead}>{d}</div>
        ))}
      </div>

      {/* Time rows */}
      {TIMES.map((t, ti) => (
        <div key={ti} className={styles.calTimeRow}>
          <div className={styles.calTime}>{t}</div>
          {DAYS.map((_, di) => {
            const slot = slots[`${di}-${ti}`];
            return (
              <div key={di} className={styles.calCell}>
                {slot && (
                  <div
                    className={`${styles.appt} ${
                      slot.status === "new"       ? styles.apptNew :
                      slot.status === "moved"     ? styles.apptMoved :
                      slot.status === "cancelled" ? styles.apptCancelled :
                      styles.apptNormal
                    }`}
                  >
                    {slot.label}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ─── Root Component ───────────────────────────────────────────────────────────

export default function VoiceDemo() {
  const [nodeId, setNodeId]     = useState("opening");
  const [lastChoice, setLastChoice] = useState<string | null>(null);
  const [active, setActive]     = useState(false);
  const [visible, setVisible]   = useState(true);
  const [calState, setCalState] = useState<CalendarState>("initial");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const node = NODES[nodeId];

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const playAudio = useCallback(
    (src: string) => {
      stopAudio();
      setActive(true);

      const audio = new Audio(src);
      audioRef.current = audio;

      const done = () => setActive(false);
      audio.onended = done;
      audio.onerror = () => {
        // No file yet — animate waveform for a natural placeholder duration
        timerRef.current = setTimeout(done, 3200);
      };
      audio.play().catch(() => {
        timerRef.current = setTimeout(done, 3200);
      });
    },
    [stopAudio]
  );

  useEffect(() => {
    playAudio(node.audioSrc);
    return stopAudio;
  }, [nodeId]); // eslint-disable-line react-hooks/exhaustive-deps

  const transition = (fn: () => void) => {
    setVisible(false);
    setTimeout(() => {
      fn();
      setVisible(true);
    }, 280);
  };

  const handleChoice = (choice: Choice) => {
    transition(() => {
      const next = NODES[choice.next];
      setLastChoice(choice.label);
      setNodeId(choice.next);
      if (next?.calendarAction === "book")   setCalState("booked");
      if (next?.calendarAction === "move")   setCalState("moved");
      if (next?.calendarAction === "cancel") setCalState("cancelled");
    });
  };

  const handleReset = () => {
    transition(() => {
      setNodeId("opening");
      setLastChoice(null);
      setCalState("initial");
    });
  };

  return (
    <div className={styles.root}>
      {/* ── Conversation pane ─────────────────────────────── */}
      <div className={styles.convo}>
        {/* Phone chrome */}
        <div className={styles.phoneBar}>
          <div className={styles.avatar}>C</div>
          <div className={styles.phoneInfo}>
            <span className={styles.callerName}>Chloe · ABC Med Spa</span>
            <span className={styles.callerRole}>AI Booking Assistant</span>
          </div>
          <span className={styles.liveBadge}>● Live</span>
        </div>

        {/* Exchange — one screen at a time, cross-fades */}
        <div
          className={styles.exchange}
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.28s ease, transform 0.28s ease",
          }}
        >
          <Waveform active={active} />

          <div className={styles.chloeBubble}>
            <span className={styles.bubbleTag}>Chloe</span>
            <p>{node.chloeText}</p>
          </div>

          {lastChoice && (
            <div className={styles.visitorBubble}>
              <p>{lastChoice}</p>
              <span className={styles.bubbleTagRight}>Jane</span>
            </div>
          )}
        </div>

        {/* Choices / end */}
        <div className={styles.choices}>
          {node.choices ? (
            <div className={styles.choiceGrid}>
              {node.choices.map((c) => (
                <button
                  key={c.label}
                  className={styles.choiceBtn}
                  onClick={() => handleChoice(c)}
                >
                  {c.label}
                </button>
              ))}
            </div>
          ) : (
            <button className={styles.resetBtn} onClick={handleReset}>
              ↺ Start over
            </button>
          )}
        </div>
      </div>

      {/* ── Calendar ──────────────────────────────────────── */}
      <MiniCalendar state={calState} />
    </div>
  );
}
