import AuroraHero from "@/components/aurora-hero";
import DemoSection from "@/components/demo-section";
import ChatCtaButton from "@/components/chat-cta-button";
import RevenueCalculator from "@/components/revenue-calculator";
import PricingSection from "@/components/pricing";
import Navbar from "@/components/navbar";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { FaqAccordion } from "@/components/ui/accordion";
import {
  Calendar,
  MessageSquare,
  RefreshCw,
  Globe,
  CheckCircle,
  BarChart2,
} from "lucide-react";


/* ================================================================
   Social Proof
   ================================================================ */
function SocialProof() {
  const features = [
    "Books into Square 24/7",
    "Auto-updates Square CRM",
    "Recognizes returning clients",
    "Smart booking notes",
    "Trained on your treatments",
    "Live ROI dashboard",
  ];
  return (
    <section className="border-y border-black/[.05] bg-[#fafafa] py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="mb-4 text-center text-xs font-medium uppercase tracking-widest text-zinc-400 sm:mb-6 sm:text-sm">
          Native integration with Square Appointments
        </p>
        <div className="relative mx-auto max-w-4xl overflow-hidden">
          <div className="industry-track flex w-max gap-4 sm:gap-6">
            {[...features, ...features].map((feature, i) => (
              <span
                key={i}
                className="shrink-0 rounded-full border border-black/[.08] bg-white px-3 py-1.5 text-[11px] font-light text-zinc-500 sm:px-4 sm:py-2 sm:text-xs"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   Value Proposition
   ================================================================ */
function ValueProp() {
  const benefits = [
    {
      stat: "Books",
      label: "Your Calls Booked",
      desc: "Every call is booked directly into Square, 24/7 — with notes on exactly what the client asked about, every time.",
    },
    {
      stat: "Syncs",
      label: "Never Talking to a Stranger",
      desc: "Every client is automatically logged and updated in Square — and recognized the moment they call again, so they never have to start from scratch.",
    },
    {
      stat: "Knows",
      label: "Never Guesses",
      desc: "Apivo only answers from what it actually knows about your treatments, pricing, and policies. It never guesses.",
    },
    {
      stat: "Delivers",
      label: "See It Pay for Itself",
      desc: "Every call answered, every booking captured, every dollar of after-hours revenue — visible in real time.",
    },
  ];

  return (
    <section id="about" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Intro */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-indigo-500 sm:text-sm">
            What Apivo Does
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl md:text-4xl">
            Your Always Available Booking Assistant
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-zinc-500 sm:text-base">
            Apivo is a booking assistant built specifically for med spas on Square. Trained on your treatments, pricing, and policies, it answers your phone, books appointments directly into your Square calendar, and captures revenue around the clock.
          </p>
        </div>

        {/* Benefit cards */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {benefits.map((b) => (
            <div
              key={b.label}
              className="overflow-hidden rounded-2xl border border-black/[.08] shadow-[0_2px_20px_rgba(0,0,0,.06)]"
            >
              <div className="bg-indigo-500 h-2" />
              <div className="bg-white p-5 sm:p-6">
                <p className="text-xl font-extrabold tracking-tight text-indigo-500 sm:text-2xl">{b.stat}</p>
                <p className="mt-1 text-sm font-semibold text-zinc-800">{b.label}</p>
                <p className="mt-2 text-xs leading-relaxed text-zinc-500 sm:text-[13px]">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

/* ================================================================
   How It Works
   ================================================================ */
function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Tell Us About Your Business",
      desc: "We build your knowledge base — trained on your treatments, pricing, and policies. No work required on your end.",
    },
    {
      num: "02",
      title: "We Sync With Square",
      desc: "We sync directly with your Square calendar — your AI sees live availability and books appointments without conflicts.",
    },
    {
      num: "03",
      title: "Go Live",
      desc: "Your existing number, no new number to give out. Apivo picks up every call — answering questions, booking appointments, and handling reschedules and cancellations 24/7.",
    },
  ];
  return (
    <section id="how-it-works" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHead tag="How It Works" title="Three Steps. Fully Automated." />
        <div className="mt-10 grid gap-8 sm:mt-16 md:grid-cols-3 md:gap-6">
          {steps.map((s) => (
            <div key={s.num} className="relative">
              <span className="text-5xl font-extrabold text-indigo-400/40 sm:text-6xl">{s.num}</span>
              <h3 className="mt-2 text-base font-semibold text-zinc-900 sm:text-lg">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   Features
   ================================================================ */
function Features() {
  const feats = [
    {
      icon: MessageSquare,
      title: "Knows Your Business",
      desc: "Trained on your services, pricing, treatments, and FAQs — answers client questions like a team member before booking the appointment. It never guesses. It only knows your business.",
      highlight: true,
    },
    {
      icon: Globe,
      title: "29+ Languages",
      desc: "Detects your client's language automatically and responds fluently — Spanish, Korean, Arabic, and 26 more. No setup required. No other booking tool offers this.",
    },
    {
      icon: RefreshCw,
      title: "Full Lifecycle",
      desc: "Book, reschedule, and cancel. Your Square calendar updates in real time, every time.",
    },
    {
      icon: Calendar,
      title: "Real-Time Availability",
      desc: "Every slot offered is checked against your live Square calendar the moment a client asks. No back and forth, no booking errors, no awkward follow-up calls.",
    },
    {
      icon: BarChart2,
      title: "Your Dashboard",
      desc: "Every booking, reschedule, and cancellation logged in real time. See appointments, time saved, and revenue attributed to Apivo — all in one place.",
    },
    {
      icon: CheckCircle,
      title: "HIPAA-Friendly",
      desc: "Apivo collects only what a standard booking form does — name, contact, service, and time. No clinical data, no PHI. Your client records never leave Square.",
    },
  ];
  return (
    <section id="features" className="bg-[#fafafa] py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHead
          tag="Features"
          title="Med Spa Booking Automation — On Autopilot"
        />
        <div className="mt-10 grid gap-4 sm:mt-16 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {feats.map((f) => (
            <article
              key={f.title}
              className={`group relative rounded-2xl border p-5 transition-colors sm:p-6 ${
                f.highlight
                  ? "border-indigo-500/20 bg-indigo-50/50 shadow-[0_2px_20px_rgba(0,0,0,.06)]"
                  : "border-black/[.08] bg-white shadow-[0_2px_20px_rgba(0,0,0,.06)] hover:border-black/[.15]"
              }`}
            >
              {f.highlight && (
                <span className="absolute right-4 top-4 rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-indigo-600">
                  Core Differentiator
                </span>
              )}
              <f.icon className="h-8 w-8 text-indigo-500 sm:h-10 sm:w-10" strokeWidth={1.5} />
              <h3 className="mt-3 text-sm font-semibold text-zinc-900 sm:text-base">{f.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-500 sm:text-sm">{f.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================
   Not Calendly
   ================================================================ */
function NotCalendly() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-indigo-500 sm:text-sm">The Difference</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl md:text-4xl">
            Apivo is a team member.<br className="hidden sm:block" /> Not a booking form.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-zinc-500 sm:text-base">
            Other tools hand your clients a calendar grid. Apivo has a conversation, answers their questions, and books the appointment — 24/7.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-6">
          {/* Other tools */}
          <div className="rounded-2xl border border-black/[.08] bg-zinc-50 p-6 sm:p-8">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">Other booking tools</p>
            <h3 className="mt-3 text-lg font-semibold text-zinc-500 sm:text-xl">Shows a grid of times.</h3>
            <ul className="mt-5 space-y-3">
              {[
                "Misses calls when no one's available",
                "Shows a grid of times",
                "Selects a slot with no context",
                "Cannot answer service or pricing questions",
                "No special requests handled",
                "English only",
                "Feels like filling out a form",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-zinc-400">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-zinc-300 text-[10px] text-zinc-400">✕</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Apivo */}
          <div className="rounded-2xl border border-indigo-500/20 bg-indigo-50/50 p-6 shadow-[0_2px_20px_rgba(99,102,241,.10)] sm:p-8">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-indigo-500">Apivo</p>
            <h3 className="mt-3 text-lg font-semibold text-zinc-900 sm:text-xl">Actually converses.</h3>
            <ul className="mt-5 space-y-3">
              {[
                "Never misses a call, 24/7",
                "Has a real conversation",
                "Trained on your treatments, pricing, and policies",
                "Answers any client question accurately",
                "Handles special requests naturally",
                "29+ languages, automatically",
                "Feels like a team member",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-zinc-700">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-[10px] text-indigo-600">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>


      </div>
    </section>
  );
}

/* ================================================================
   Calculator
   ================================================================ */
function Calculator() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <RevenueCalculator />
      </div>
    </section>
  );
}


/* ================================================================
   FAQ
   ================================================================ */
function FAQ() {
  const items = [
    {
      q: "We already have someone answering our phones — why do we need this?",
      a: "That's exactly who Apivo works best alongside, not against. It picks up what your team can't get to — during treatments, when the line's busy, or after hours — so your front desk doesn't have to choose between the client in the chair and the one on the phone.\n\nAnd unlike a generic assistant that guesses, Apivo is trained specifically on your treatments, pricing, and policies — it only answers from what it actually knows about your business, and it completes the booking on the spot rather than just taking a message. If a client ever wants to talk to a real person, Apivo transfers them live, on the spot — no hold, no waiting for a callback.",
    },
    {
      q: "How is this different from Square's built-in booking?",
      a: "Square's booking page does one thing — it shows your availability and collects a name. It has no knowledge of your business. It can't tell a visitor which treatment is right for them, explain what a service involves, answer a question about pricing, or handle a special request. It just shows a grid of times.\n\nApivo has a conversation. It's trained on your treatments, pricing, and policies — so it answers real questions before booking the appointment. That's what turns a conversation into a booking.",
    },
    {
      q: "How does Apivo know about my services and pricing?",
      a: "Before going live, we build a custom knowledge base for your business — covering your full treatment menu, pricing, service details, pre and post care instructions, policies, and the FAQs your front desk handles every day.\n\nApivo is trained on this and only answers based on it. It will never pull generic information from the internet or guess at an answer. If it doesn't know something, it says so and offers to have a staff member follow up. This is what makes Apivo an expert — not just a booking link.",
    },
    {
      q: "What if my treatments or pricing change?",
      a: "Just email us. We update your knowledge base within 24 hours of any request. New treatment, price change, seasonal promotion, updated policy — send it over and it's live the same day.\n\nThat's included in your monthly plan. No extra fees, no tickets, no waiting.",
    },
    {
      q: "Is Apivo HIPAA compliant?",
      a: "Apivo is designed to be HIPAA-friendly. We only collect basic booking information — name, contact details, service, and appointment time. We never collect, store, or transmit protected health information. No medical history, no diagnoses, no treatment records.\n\nBecause Apivo doesn't handle PHI, a Business Associate Agreement is not required for our current scope of services. Your client records never leave Square.",
    },
    {
      q: "What if Apivo can't answer a question?",
      a: "Apivo is configured to acknowledge what it doesn't know and offer to have a staff member follow up. It will never guess or fabricate an answer. Accuracy is the priority — always.\n\nIf a question falls outside the knowledge base, Apivo says so clearly and keeps the client engaged rather than losing them.",
    },
    {
      q: "Is there a contract?",
      a: "The monthly plan is month-to-month — cancel anytime, no commitment required.\n\nThe annual plan is a one-year commitment billed upfront at a 35% discount. Your rate is locked forever from day one — it will never increase as long as your subscription stays active.",
    },
    {
      q: "Is my client data secure?",
      a: "Yes. Apivo collects only what a standard booking form does — name, contact, service, and appointment time. No clinical data, no PHI. Every client's data is isolated and stored securely — no business can see another's information.\n\nYour client records never leave Square.",
    },
  ];
  return (
    <section id="faq" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHead tag="FAQ" title="Questions & Answers" />
        <div className="mt-10 rounded-2xl border border-zinc-100 bg-white px-4 shadow-[0_4px_32px_rgba(0,0,0,.07)] sm:mt-16 sm:px-8">
          <FaqAccordion items={items} />
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   Contact / CTA
   ================================================================ */
function Contact() {
  return (
    <AuroraBackground
      className="h-auto min-h-0 py-16 sm:py-24 bg-zinc-50"
      showRadialGradient={true}
    >
      <section id="contact" className="relative z-10 w-full scroll-mt-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 text-center">
          <div>
              <p className="text-xs font-medium uppercase tracking-widest text-indigo-500 sm:text-sm">
                Get Started
              </p>
              <h2 className="mt-2 text-2xl font-bold leading-tight text-zinc-900 sm:text-3xl md:text-4xl">
                Stop Losing Bookings to Missed Calls
              </h2>
              <ul className="mt-4 sm:mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2">
                {[
                  "Free for 14 days — no credit card required",
                  "Live on your phone in 48 hours",
                  "Cancel anytime, no questions asked",
                ].map((c, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-zinc-600">
                    <CheckCircle className="h-4 w-4 shrink-0 text-indigo-500" />
                    {c}
                  </li>
                ))}
              </ul>
              <ChatCtaButton />
            </div>
        </div>
      </section>
    </AuroraBackground>
  );
}

/* ================================================================
   Footer
   ================================================================ */
function Footer() {
  return (
    <footer className="border-t border-black/[.08] bg-[#fafafa] py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="sm:col-span-2 md:col-span-1">
            <img src="/apivo-logo_black.png" alt="Apivo" className="h-8 w-auto sm:h-10" />
            <p className="mt-2 text-xs leading-relaxed text-zinc-400 sm:text-sm">
              AI Booking Assistant for Med Spas
            </p>
            <div className="mt-4 flex items-center gap-4">
              <a
                href="https://instagram.com/apivo.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 transition-colors hover:text-zinc-900"
                aria-label="Instagram"
              >
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="mailto:hello@apivo.ai"
                className="text-zinc-400 transition-colors hover:text-zinc-900"
                aria-label="Email"
              >
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"/>
                  <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z"/>
                </svg>
              </a>
            </div>
          </div>
          {[
            {
              title: "Product",
              links: [
                { text: "How It Works", href: "#how-it-works" },
                { text: "Features", href: "#features" },
                { text: "Demo", href: "#demo" },
                { text: "Pricing", href: "#pricing" },
              ],
            },
            {
              title: "Company",
              links: [
                { text: "Contact", href: "mailto:hello@apivo.ai" },
                { text: "FAQ", href: "#faq" },
              ],
            },
            {
              title: "Legal",
              links: [
                { text: "Privacy Policy", href: "/privacy" },
                { text: "Terms of Service", href: "/terms" },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.text}>
                    <a href={l.href} className="text-xs text-zinc-500 transition-colors hover:text-zinc-900 sm:text-sm">
                      {l.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 border-t border-black/[.08] pt-6 text-center text-[11px] text-zinc-400 sm:text-xs">
          &copy; 2026 Apivo. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

/* ================================================================
   Shared Section Header
   ================================================================ */
function SectionHead({
  tag,
  title,
  subtitle,
}: {
  tag: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="text-center">
      <p className="text-xs font-medium uppercase tracking-widest text-indigo-500 sm:text-sm">{tag}</p>
      <h2 className="mt-2 text-2xl font-bold text-zinc-900 sm:text-3xl md:text-4xl">{title}</h2>
      {subtitle && <p className="mt-2 text-sm text-zinc-500">{subtitle}</p>}
    </div>
  );
}

/* ================================================================
   Page
   ================================================================ */
export default function HomePage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white">
      <Navbar />
      <div id="hero">
        <AuroraHero />
      </div>
      <SocialProof />
      <ValueProp />
      <DemoSection />
      <HowItWorks />
      <Features />
      <NotCalendly />
      <PricingSection />
      <Calculator />
      <Contact />
      <FAQ />
      <Footer />
    </div>
  );
}
