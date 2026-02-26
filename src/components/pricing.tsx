"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";

const MONTHLY_PRICE = 297;
const YEARLY_DISCOUNT = 0.35;
const YEARLY_MONTHLY_PRICE = Math.round(MONTHLY_PRICE * (1 - YEARLY_DISCOUNT));
const YEARLY_TOTAL = YEARLY_MONTHLY_PRICE * 12;

const features = [
  "1 AI chatbot",
  "Google Calendar sync",
  "Email confirmations",
  "Business Q&A (up to 50 FAQs)",
  "Unlimited conversations",
  "Reschedule & cancel via chatbot",
  "Multi-language support (29+)",
  "Post-call analytics & reports",
];

export default function Pricing() {
  const [yearly, setYearly] = useState(false);

  const price = yearly ? YEARLY_MONTHLY_PRICE : MONTHLY_PRICE;

  return (
    <section id="pricing" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 text-center sm:mb-14">
          <p className="text-xs font-medium uppercase tracking-widest text-indigo-500 sm:text-sm">
            Pricing
          </p>
          <h2 className="mt-2 text-2xl font-bold text-zinc-900 sm:text-3xl md:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-3 text-sm text-zinc-500 sm:text-base">
            No hidden fees. No per-conversation charges.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center">
          <div className="inline-flex items-center rounded-full border border-black/[.08] bg-[#f4f4f5] p-1">
            <button
              onClick={() => setYearly(false)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                !yearly
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all ${
                yearly
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              Yearly
              <span className="rounded-full bg-indigo-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                Save 35%
              </span>
            </button>
          </div>
        </div>

        {/* Card */}
        <div className="mx-auto mt-10 max-w-md sm:mt-12">
          <div className="relative rounded-2xl border border-indigo-500/30 bg-indigo-50/50 p-6 shadow-[0_2px_20px_rgba(0,0,0,.06)] sm:p-8">
            <h3 className="text-lg font-semibold text-zinc-900 sm:text-xl">Apivo</h3>
            <p className="mt-1 text-sm text-zinc-500">Everything you need to automate bookings</p>

            <div className="mt-5 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-zinc-900 sm:text-5xl">
                ${price}
              </span>
              <span className="text-sm text-zinc-400">/mo</span>
              {yearly && (
                <span className="ml-2 text-xs text-zinc-400">
                  billed ${YEARLY_TOTAL.toLocaleString()}/yr
                </span>
              )}
            </div>

            {yearly && (
              <p className="mt-1 text-xs font-medium text-indigo-500">
                You save ${((MONTHLY_PRICE - YEARLY_MONTHLY_PRICE) * 12).toLocaleString()} per year
              </p>
            )}

            <ul className="mt-6 space-y-3">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-zinc-600">
                  <CheckCircle className="h-4 w-4 shrink-0 text-indigo-500" />
                  {f}
                </li>
              ))}
            </ul>

            <a
              href="#contact"
              className="mt-7 block w-full rounded-full bg-indigo-500 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-indigo-400"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
