"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Home,
  Utensils,
  Building2,
  Building,
  Wrench,
  Sparkles,
  Lock,
  Scale,
  Leaf,
  Trash2,
  Wind,
  GraduationCap,
  ShoppingCart,
  Headphones,
  Car,
} from "lucide-react";

const useCases = [
  {
    industry: "Roofing",
    Icon: Home,
    challenge: "Homeowners call after storm damage but can't reach anyone.",
    solution: "AI qualifies leads and books free estimates around your crew's schedule.",
  },
  {
    industry: "Restaurants",
    Icon: Utensils,
    challenge: "No-shows and last-minute cancellations waste prep time and covers.",
    solution: "AI manages reservations, sends reminders, and handles the waitlist automatically.",
  },
  {
    industry: "Real Estate",
    Icon: Building2,
    challenge: "Buyer and seller leads go cold waiting for a follow-up call.",
    solution: "AI books showings and consultations instantly, 24/7.",
  },
  {
    industry: "Property Management",
    Icon: Building,
    challenge: "Showing requests and maintenance calls pile up over the weekend.",
    solution: "AI books property tours and logs maintenance requests without staff.",
  },
  {
    industry: "Plumbing",
    Icon: Wrench,
    challenge: "Emergency calls go unanswered after business hours.",
    solution: "AI books service calls immediately and triages by urgency.",
  },
  {
    industry: "Med Spa",
    Icon: Sparkles,
    challenge: "Front desk gets buried in calls for Botox, fillers, and laser consults.",
    solution: "AI books all services with intake info collected before the appointment.",
  },
  {
    industry: "Lock Smith",
    Icon: Lock,
    challenge: "Customers in lockouts need immediate help but can't get through.",
    solution: "AI triages urgency and dispatches the nearest available tech instantly.",
  },
  {
    industry: "Law Firm",
    Icon: Scale,
    challenge: "Prospects drop off waiting for a callback to schedule.",
    solution: "Consultations booked instantly; intake info collected before the call.",
  },
  {
    industry: "Landscaping",
    Icon: Leaf,
    challenge: "Spring rush means phones ring nonstop for quotes and scheduling.",
    solution: "AI books site visits and collects property details before the crew arrives.",
  },
  {
    industry: "Junk Removal",
    Icon: Trash2,
    challenge: "Customers want same-day service but no one picks up to confirm.",
    solution: "AI books pickups, confirms load size, and sends scheduling confirmations.",
  },
  {
    industry: "HVAC",
    Icon: Wind,
    challenge: "AC breakdowns in summer flood the line and overwhelm dispatch.",
    solution: "AI books service windows and collects system details before the visit.",
  },
  {
    industry: "HR & Training",
    Icon: GraduationCap,
    challenge: "Coordinating interview slots across candidates and managers is chaotic.",
    solution: "AI books interviews, syncs calendars, and sends reminders automatically.",
  },
  {
    industry: "Ecommerce",
    Icon: ShoppingCart,
    challenge: "Customers abandon without a quick way to get product or delivery answers.",
    solution: "AI handles questions instantly and books live demos or consultations.",
  },
  {
    industry: "Dental Clinics",
    Icon: Calendar,
    challenge: "Patients call after hours and get voicemail — bookings lost.",
    solution: "AI books cleanings & consultations 24/7, directly on the calendar.",
  },
  {
    industry: "Customer Service",
    Icon: Headphones,
    challenge: "Support tickets pile up while customers wait hours for a response.",
    solution: "AI resolves common requests instantly and books follow-up calls when needed.",
  },
  {
    industry: "Auto Repair",
    Icon: Car,
    challenge: "Non-English speakers struggle to book by phone.",
    solution: "AI books in 29+ languages, directly on the service calendar.",
  },
];

const PAGE_SIZE = 2;
const TOTAL_PAGES = Math.ceil(useCases.length / PAGE_SIZE);
const AUTO_INTERVAL = 8000;

export default function UseCaseCarousel() {
  const [page, setPage] = useState(0);

  const next = useCallback(() => setPage((p) => (p + 1) % TOTAL_PAGES), []);
  const prev = useCallback(() => setPage((p) => (p - 1 + TOTAL_PAGES) % TOTAL_PAGES), []);

  useEffect(() => {
    const id = setInterval(next, AUTO_INTERVAL);
    return () => clearInterval(id);
  }, [next]);

  const visible = useCases.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-black/[.08] bg-white/90 shadow-[0_2px_20px_rgba(0,0,0,.06)] backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-black/[.06] px-5 py-2.5">
        <p className="text-[11px] font-medium uppercase tracking-widest text-zinc-400 sm:text-xs">
          Use Cases
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={prev}
            aria-label="Previous use cases"
            className="flex h-7 w-7 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={next}
            aria-label="Next use cases"
            className="flex h-7 w-7 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="divide-y divide-black/[.06] min-h-[220px] md:min-h-[240px]">
        {visible.map((uc) => (
          <div
            key={uc.industry}
            className="flex items-start gap-3.5 px-5 py-3.5 transition-opacity duration-300"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
              <uc.Icon className="h-4 w-4 text-indigo-500" strokeWidth={1.5} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-zinc-900">{uc.industry}</p>
              <div className="mt-1.5 space-y-1">
                <p className="text-[11px] leading-snug text-zinc-400">
                  <span className="font-semibold uppercase tracking-wide text-zinc-400">Challenge</span>{" "}
                  {uc.challenge}
                </p>
                <p className="text-[11px] leading-snug text-zinc-600">
                  <span className="font-semibold uppercase tracking-wide text-indigo-500">Solution</span>{" "}
                  {uc.solution}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-1.5 border-t border-black/[.06] py-2.5">
        {Array.from({ length: TOTAL_PAGES }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            aria-label={`Page ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === page ? "w-4 bg-indigo-500" : "w-1.5 bg-zinc-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
