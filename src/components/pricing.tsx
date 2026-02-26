"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";

const MONTHLY_PRICE = 297;
const YEARLY_DISCOUNT = 0.35;
const YEARLY_MONTHLY_PRICE = Math.round(MONTHLY_PRICE * (1 - YEARLY_DISCOUNT));
const YEARLY_TOTAL = YEARLY_MONTHLY_PRICE * 12;

const features = [
  "AI Chat Widget for your website",
  "24/7 appointment booking, rescheduling & canceling",
  "Google Calendar integration",
  "Automated email confirmations",
  "Dental knowledge base (answers patient FAQs)",
  "29+ language support",
  "CRM integration",
  "White-glove setup & onboarding",
  "Ongoing support",
];

export default function Pricing() {
  const [yearly, setYearly] = useState(false);

  const price = yearly ? YEARLY_MONTHLY_PRICE : MONTHLY_PRICE;

  return (
    <section id="pricing" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
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
        <div className="mb-8 flex justify-center">
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

        {/* Card — horizontal split */}
        <div className="overflow-hidden rounded-2xl border border-black/[.08] shadow-[0_4px_32px_rgba(0,0,0,.08)] sm:flex">

          {/* Left — indigo panel */}
          <div className="flex flex-col justify-between bg-indigo-600 p-8 sm:w-72 sm:shrink-0 sm:p-10">
            <div>
              {yearly && (
                <p className="text-sm font-medium text-white/50 line-through">
                  ${MONTHLY_PRICE}/mo
                </p>
              )}
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold text-white">${price}</span>
                <span className="text-sm text-indigo-200">/month</span>
              </div>
              {yearly ? (
                <p className="mt-1.5 text-xs text-indigo-200">
                  Billed ${YEARLY_TOTAL.toLocaleString()}/yr &mdash; save ${((MONTHLY_PRICE - YEARLY_MONTHLY_PRICE) * 12).toLocaleString()}
                </p>
              ) : (
                <p className="mt-3 text-sm text-indigo-100/80">
                  Locked in forever. Price never increases for early adopters.
                </p>
              )}
            </div>

            <div className="mt-10">
              <a
                href="#contact"
                className="block rounded-full bg-white py-3 text-center text-sm font-semibold text-indigo-600 transition-colors hover:bg-indigo-50"
              >
                Lock In ${price}/Month
              </a>
              <p className="mt-3 text-center text-xs text-indigo-200">
                No contracts. Cancel anytime.
              </p>
            </div>
          </div>

          {/* Right — features list */}
          <div className="flex-1 bg-zinc-50 p-8 sm:p-10">
            <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Everything included
            </p>
            <ul className="flex flex-col gap-3">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-700">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
