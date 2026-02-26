"use client";

import { useState } from "react";

interface SliderConfig {
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  prefix?: string;
}

const sliders: SliderConfig[] = [
  {
    label: "Missed appointments / week",
    min: 1,
    max: 50,
    step: 1,
    defaultValue: 5,
  },
  {
    label: "Avg appointment value",
    min: 25,
    max: 1000,
    step: 25,
    defaultValue: 150,
    prefix: "$",
  },
];

export default function RevenueCalculator() {
  const [values, setValues] = useState<number[]>(
    sliders.map((s) => s.defaultValue)
  );

  const update = (index: number, val: number) =>
    setValues((prev) => prev.map((v, i) => (i === index ? val : v)));

  const handleInputChange = (index: number, raw: string, config: SliderConfig) => {
    const stripped = raw.replace(/[^0-9]/g, "");
    if (stripped === "") {
      update(index, config.min);
      return;
    }
    const num = Math.min(Math.max(parseInt(stripped, 10), config.min), config.max);
    update(index, num);
  };

  const APIVO_COST = 297;
  const [missed, avgValue] = values;
  const total = missed * 4 * avgValue;
  const roi = total - APIVO_COST;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-10 text-center sm:mb-14">
        <p className="text-xs font-medium uppercase tracking-widest text-indigo-500 sm:text-sm">
          Revenue Impact
        </p>
        <h2 className="mt-2 text-2xl font-bold text-zinc-900 sm:text-3xl md:text-4xl">
          See What You&apos;re Losing Every Month
        </h2>
      </div>

      <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-3 sm:gap-5">
        {/* 2 slider columns */}
        {sliders.map((s, i) => {
          const pct = ((values[i] - s.min) / (s.max - s.min)) * 100;

          return (
            <div key={s.label} className="text-center">
              <div className="flex items-baseline justify-center">
                {s.prefix && (
                  <span className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                    {s.prefix}
                  </span>
                )}
                <input
                  type="text"
                  inputMode="numeric"
                  value={values[i]}
                  onChange={(e) => handleInputChange(i, e.target.value, s)}
                  className="w-20 bg-transparent text-center text-2xl font-bold tracking-tight text-zinc-900 outline-none sm:text-3xl"
                />
              </div>
              <p className="mt-0.5 text-[11px] text-zinc-400">{s.label}</p>
              <input
                type="range"
                min={s.min}
                max={s.max}
                step={s.step}
                value={values[i]}
                onChange={(e) => update(i, Number(e.target.value))}
                className="calc-slider mt-2 w-full"
                style={
                  {
                    "--slider-pct": `${pct}%`,
                  } as React.CSSProperties
                }
              />
            </div>
          );
        })}

        {/* Result column */}
        <div className="rounded-xl border border-indigo-500/20 bg-indigo-50/50 px-4 py-4 text-center">
          <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 sm:text-[11px]">
            Monthly missed revenue
          </p>
          <p className="mt-1 text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl">
            ${total.toLocaleString()}
            <span className="text-sm font-normal text-zinc-400">/mo</span>
          </p>
        </div>
      </div>

      {/* ROI row */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
        {/* Apivo cost */}
        <div className="rounded-xl border border-black/[.08] bg-white px-5 py-4 text-center shadow-[0_2px_12px_rgba(0,0,0,.04)]">
          <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 sm:text-[11px]">
            Compared to Apivo
          </p>
          <p className="mt-1 text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl">
            $297
            <span className="text-sm font-normal text-zinc-400">/mo</span>
          </p>
        </div>

        {/* ROI */}
        <div className="rounded-xl border border-green-500/20 bg-green-50/50 px-5 py-4 text-center">
          <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 sm:text-[11px]">
            Your monthly ROI
          </p>
          <p className={`mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl ${roi >= 0 ? "text-green-600" : "text-red-500"}`}>
            {roi >= 0 ? "+" : "−"}${Math.abs(roi).toLocaleString()}
            <span className="text-sm font-normal text-zinc-400">/mo</span>
          </p>
        </div>
      </div>
    </div>
  );
}
