"use client";

import { useState } from "react";

const APIVO_COST = 297;

export default function RevenueCalculator() {
  const [missedPerWeek, setMissedPerWeek] = useState(5);
  const [avgValue, setAvgValue] = useState(150);

  const monthlyMissed = missedPerWeek * 4 * avgValue;
  const roi = monthlyMissed - APIVO_COST;

  const missedPct = ((missedPerWeek - 1) / (50 - 1)) * 100;
  const valuePct = ((avgValue - 50) / (500 - 50)) * 100;

  const openChat = () => {
    const launcher = document.querySelector<HTMLButtonElement>("#lc-launcher");
    if (launcher) launcher.click();
  };

  return (
    <div className="mx-auto max-w-3xl">
      {/* Section heading */}
      <div className="mb-10 text-center sm:mb-14">
        <p className="text-xs font-medium uppercase tracking-widest text-indigo-500 sm:text-sm">
          Revenue Impact
        </p>
        <h2 className="mt-2 text-2xl font-bold text-zinc-900 sm:text-3xl md:text-4xl">
          See What You&apos;re Losing Every Month
        </h2>
      </div>

      {/* Sliders */}
      <div className="space-y-8 rounded-2xl border border-black/[.08] bg-white p-6 shadow-[0_2px_24px_rgba(0,0,0,.06)] sm:p-8">
        {/* Slider 1 */}
        <div>
          <div className="flex items-baseline justify-between">
            <label className="text-sm font-medium text-zinc-700">
              How many appointment calls do you miss per week?
            </label>
            <span className="ml-4 shrink-0 text-2xl font-extrabold tracking-tight text-zinc-900">
              {missedPerWeek}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={50}
            step={1}
            value={missedPerWeek}
            onChange={(e) => setMissedPerWeek(Number(e.target.value))}
            className="calc-slider mt-3 w-full"
            style={{ "--slider-pct": `${missedPct}%` } as React.CSSProperties}
          />
          <div className="mt-1 flex justify-between text-[11px] text-zinc-400">
            <span>1</span><span>50</span>
          </div>
        </div>

        {/* Slider 2 */}
        <div>
          <div className="flex items-baseline justify-between">
            <label className="text-sm font-medium text-zinc-700">
              Average appointment value
            </label>
            <span className="ml-4 shrink-0 text-2xl font-extrabold tracking-tight text-zinc-900">
              ${avgValue}
            </span>
          </div>
          <input
            type="range"
            min={50}
            max={500}
            step={25}
            value={avgValue}
            onChange={(e) => setAvgValue(Number(e.target.value))}
            className="calc-slider mt-3 w-full"
            style={{ "--slider-pct": `${valuePct}%` } as React.CSSProperties}
          />
          <div className="mt-1 flex justify-between text-[11px] text-zinc-400">
            <span>$50</span><span>$500</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-black/[.06]" />

        {/* Results */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          {/* Monthly missed */}
          <div className="text-center">
            <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
              Monthly missed revenue
            </p>
            <p className="mt-1 text-3xl font-extrabold tracking-tight text-red-500 sm:text-4xl">
              ${monthlyMissed.toLocaleString()}
            </p>
          </div>

          {/* vs */}
          <div className="flex flex-col items-center gap-1">
            <div className="h-12 w-px bg-black/[.08]" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-300">vs</span>
            <div className="h-12 w-px bg-black/[.08]" />
          </div>

          {/* ROI */}
          <div className="text-center">
            <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
              ${APIVO_COST}/mo Apivo cost
            </p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Your monthly ROI
            </p>
            <p className={`mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl ${roi >= 0 ? "text-green-500" : "text-zinc-400"}`}>
              {roi >= 0 ? "+" : ""}${roi.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Tagline + CTA */}
        <div className="text-center">
          <p className="text-sm text-zinc-500">
            Most dental practices recover their investment in the first week.
          </p>
          <button
            type="button"
            onClick={openChat}
            className="mt-4 rounded-full bg-indigo-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-colors hover:bg-indigo-400"
          >
            Book Your Free Demo
          </button>
        </div>
      </div>
    </div>
  );
}
