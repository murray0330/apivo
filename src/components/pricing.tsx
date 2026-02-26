"use client";

import { CheckCircle } from "lucide-react";

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

        {/* Card — horizontal split */}
        <div className="overflow-hidden rounded-2xl border border-black/[.08] shadow-[0_4px_32px_rgba(0,0,0,.08)] sm:flex">

          {/* Left — indigo panel */}
          <div className="flex flex-col justify-between bg-indigo-600 p-8 sm:w-72 sm:shrink-0 sm:p-10">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold text-white">$297</span>
                <span className="text-sm text-indigo-200">/month</span>
              </div>
              <p className="mt-3 text-sm text-indigo-100/80">
                Locked in forever. Price never increases for early adopters.
              </p>
            </div>

            <div className="mt-10">
              <a
                href="#contact"
                className="block rounded-full bg-white py-3 text-center text-sm font-semibold text-indigo-600 transition-colors hover:bg-indigo-50"
              >
                Lock In $297/Month
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
