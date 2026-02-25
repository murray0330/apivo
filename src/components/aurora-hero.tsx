"use client";

import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/aurora-background";

export default function AuroraHero() {
  return (
    <AuroraBackground
      className="!h-auto !min-h-0 !items-end !justify-start bg-zinc-50 sm:!min-h-svh"
      showRadialGradient={true}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-start gap-4 px-4 pb-16 pt-28 sm:gap-6 sm:px-6 sm:pb-24 sm:pt-36 md:gap-8 md:px-10 md:pt-44 lg:px-16"
      >
        {/* Badge */}
        <span className="inline-flex items-center rounded-full border border-indigo-500/20 bg-white/60 px-4 py-1.5 text-xs font-semibold tracking-tight text-indigo-500 backdrop-blur-sm sm:text-sm">
          24/7 Booking Agent
        </span>

        {/* Headline */}
        <h1 className="text-left text-[clamp(2rem,8vw,4.5rem)] font-extralight leading-[1.08] tracking-tight text-zinc-900">
          AI-Powered<br />
          <span className="whitespace-nowrap">Appointment Booking</span>
        </h1>

        {/* Subheading */}
        <p className="max-w-[90vw] text-left text-sm font-light leading-relaxed tracking-tight text-zinc-600 sm:max-w-xl sm:text-base md:text-lg">
          Customers chat on your website. Your calendar fills itself. No phone
          tag. No double bookings. No missed revenue.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-row flex-wrap items-center gap-3 pt-2">
          <a
            href="#contact"
            className="rounded-2xl border border-indigo-500/20 bg-indigo-500 px-5 py-3 text-center text-sm font-light tracking-tight text-white shadow-lg shadow-indigo-500/25 transition-colors duration-300 hover:bg-indigo-400"
          >
            Get Started
          </a>
          <a
            href="#pricing"
            className="rounded-2xl border border-zinc-200 px-5 py-3 text-center text-sm font-light tracking-tight text-zinc-700 transition-colors duration-300 hover:bg-white/80"
          >
            View Pricing
          </a>
        </div>

        {/* Micro Details */}
        <ul className="mt-4 flex flex-wrap gap-4 text-xs font-light tracking-tight text-zinc-500 sm:mt-8 sm:gap-6 sm:text-sm">
          {["Automated Calendar", "HIPAA Compliant", "29+ Languages"].map(
            (detail) => (
              <li key={detail} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-zinc-400/50" />
                {detail}
              </li>
            )
          )}
        </ul>
      </motion.div>
    </AuroraBackground>
  );
}
