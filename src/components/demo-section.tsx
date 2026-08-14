"use client";

import { useState } from "react";
import { CheckCircle, Phone, MessageSquare } from "lucide-react";
import DemoChatbot from "@/components/demo-chatbot";
import VoiceCallDemo from "@/components/voice-demo/VoiceCallDemo";

const VOICE_COPY = {
  heading: "Try It Right Now",
  body: "It's 2:15pm. A potential client calls your med spa. They have questions. They want to book. See Apivo in action.",
  bullets: [
    "Real-time calendar availability check",
    "Service and pricing questions answered instantly",
    "Appointment placed directly on calendar",
    "Phone number automatically captured",
  ],
};

const CHAT_COPY = {
  heading: "Try It Right Now",
  body: "It's 10:47pm. A potential client found your med spa. They have questions. They want to book. There's no one there to answer. Here's what happens when Apivo is on your website.",
  bullets: [
    "Real-time calendar availability check",
    "Service and pricing questions answered instantly",
    "Appointment placed directly on calendar",
    "Contact saved to Square",
  ],
};

export default function DemoSection() {
  const [mode, setMode] = useState<"voice" | "chat">("voice");
  const copy = mode === "voice" ? VOICE_COPY : CHAT_COPY;

  return (
    <section id="demo" className="bg-[#fafafa] py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">

        {/* Heading */}
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-indigo-500 sm:text-sm">
            Our Product
          </p>
          <h2 className="mt-2 text-2xl font-bold text-zinc-900 sm:text-3xl md:text-4xl">
            Experience It Yourself
          </h2>
        </div>

        {/* Toggle */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center rounded-full border border-black/[.08] bg-[#f4f4f5] p-1">
            <button
              onClick={() => setMode("voice")}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all ${
                mode === "voice"
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              <Phone className="h-3.5 w-3.5" />
              Voice Call
            </button>
            <button
              onClick={() => setMode("chat")}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all ${
                mode === "chat"
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Chat Widget
            </button>
          </div>
        </div>

        {/* Two-column layout — always shown */}
        <div className="mt-10 grid gap-10 sm:mt-12 md:grid-cols-2 md:items-start">

          {/* Left — description, changes per mode */}
          <div>
            <h3
              className="text-lg font-semibold text-zinc-900 sm:text-xl transition-opacity duration-300"
              key={mode + "-heading"}
            >
              {copy.heading}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 sm:text-base">
              {copy.body}
            </p>
            <ul className="mt-4 space-y-2 sm:mt-6">
              {copy.bullets.map((b, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-zinc-600">
                  <CheckCircle className="h-4 w-4 shrink-0 text-indigo-500" />
                  {b}
                </li>
              ))}
            </ul>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { stat: "< 90s", label: "Average booking time" },
                { stat: "24/7",  label: "Always available" },
                { stat: "29+",   label: "Languages supported" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-black/[.08] bg-white p-3 text-center shadow-[0_2px_12px_rgba(0,0,0,.05)]"
                >
                  <p className="text-xl font-extrabold tracking-tight text-zinc-900 sm:text-2xl">
                    {item.stat}
                  </p>
                  <p className="mt-1 text-[10px] leading-tight text-zinc-400 sm:text-[11px]">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — swaps between voice iPhone and chat widget */}
          <div className="flex justify-center md:justify-end">
            {mode === "voice" ? <VoiceCallDemo /> : (
              <div className="w-full max-w-sm">
                <DemoChatbot />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
