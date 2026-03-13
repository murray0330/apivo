import DemoChatbot from "@/components/demo-chatbot";
import AuroraHero from "@/components/aurora-hero";
import ChatCtaButton from "@/components/chat-cta-button";
import RevenueCalculator from "@/components/revenue-calculator";
import PricingSection from "@/components/pricing";
import Navbar from "@/components/navbar";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { FaqAccordion } from "@/components/ui/accordion";
import {
  Calendar,
  MessageSquare,
  Mail,
  Users,
  RefreshCw,
  Globe,
  Star,
  DollarSign,
  CheckCircle,
  Clock,
} from "lucide-react";


/* ================================================================
   Social Proof
   ================================================================ */
function SocialProof() {
  const cities = [
    "Chesapeake",
    "Hampton",
    "Newport News",
    "Norfolk",
    "Virginia Beach",
    "Williamsburg",
  ];
  return (
    <section className="border-y border-black/[.05] bg-[#fafafa] py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="mb-4 text-center text-xs font-medium uppercase tracking-widest text-zinc-400 sm:mb-6 sm:text-sm">
          Serving Med Spas Across Virginia
        </p>
        <div className="relative mx-auto max-w-2xl overflow-hidden">
          <div className="industry-track flex w-max gap-4 sm:gap-6">
            {[...cities, ...cities].map((city, i) => (
              <span
                key={i}
                className="shrink-0 rounded-full border border-black/[.08] bg-white px-3 py-1.5 text-[11px] font-light text-zinc-500 sm:px-4 sm:py-2 sm:text-xs"
              >
                {city}
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
      stat: "$3,000+",
      label: "Saved per Month",
      desc: "Replace repetitive front-desk labor with AI. Keep your team focused on high-value work.",
      icon: DollarSign,
    },
    {
      stat: "30%",
      label: "More Appointments",
      desc: "Never miss an after-hours booking. Your AI captures and books inquiries around the clock.",
      icon: Calendar,
    },
    {
      stat: "3+ hrs",
      label: "Back Every Day",
      desc: "Stop answering the same questions every day. Your AI handles every service, pricing, and FAQ inquiry automatically — giving your team hours back.",
      icon: Clock,
    },
    {
      stat: "24/7",
      label: "Always Available",
      desc: "Whether it's 2pm or 2am, your AI is on — answering questions, booking appointments, never putting a client on hold.",
      icon: Globe,
    },
  ];

  return (
    <section id="about" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Intro */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-indigo-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-indigo-600 sm:text-xs">
            What Apivo Does
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl md:text-4xl">
            Your Front Desk Automated.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-zinc-500 sm:text-base">
            Apivo is an AI booking assistant built specifically for Acuity-powered med spas.
            It lives on your website, trained on your services, pricing, and FAQs — answers real questions,
            books appointments in real time, and speaks your clients&apos; language, in 29+ languages automatically.
          </p>
        </div>

        {/* Benefit cards */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {benefits.map((b) => (
            <div
              key={b.label}
              className="rounded-2xl border border-black/[.08] bg-white p-5 shadow-[0_2px_20px_rgba(0,0,0,.06)] sm:p-6"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
                <b.icon className="h-5 w-5 text-indigo-500" strokeWidth={1.5} />
              </div>
              <p className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
                {b.stat}
              </p>
              <p className="mt-0.5 text-sm font-semibold text-zinc-700">{b.label}</p>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400 sm:text-[13px]">{b.desc}</p>
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
      desc: "Share your services, hours, booking rules, and FAQs. We configure your AI to sound like a member of your team.",
    },
    {
      num: "02",
      title: "We Sync With Acuity",
      desc: "We sync directly with your Acuity Scheduling calendar. Your chatbot sees live availability and books appointments without conflicts.",
    },
    {
      num: "03",
      title: "Embed & Go Live",
      desc: "One snippet on your website. Your AI is live in 48 hours — answering questions, booking appointments, and handling reschedules and cancellations 24/7.",
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
      desc: "Trained on your services, pricing, treatments, and FAQs — answers client questions like a team member before booking the appointment. It never guesses. It only knows your practice.",
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
      desc: "Book, reschedule, and cancel — all through the chat. Your Acuity calendar updates in real time, every time.",
    },
    {
      icon: Calendar,
      title: "Real-Time Availability",
      desc: "Every slot offered is checked against your live Acuity calendar the moment a client asks. No back and forth, no booking errors, no awkward follow-up calls.",
    },
    {
      icon: DollarSign,
      title: "Your Dashboard",
      desc: "Every booking, reschedule, and cancellation logged in real time. See appointments, time saved, and revenue attributed to your AI — all in one place.",
    },
    {
      icon: CheckCircle,
      title: "HIPAA-Friendly",
      desc: "Apivo collects only what a standard booking form does — name, contact, service, and time. No clinical data, no PHI. Your client records never leave Acuity.",
    },
  ];
  return (
    <section id="features" className="bg-[#fafafa] py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHead
          tag="Features"
          title="Everything Your Front Desk Does — On Autopilot"
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
   Demo
   ================================================================ */
function Demo() {
  return (
    <section id="demo" className="bg-[#fafafa] py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHead tag="Our Product" title="Experience It Yourself" />
        <div className="mt-10 grid gap-8 sm:mt-16 md:grid-cols-2 md:items-start">
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 sm:text-xl">Try It Right Now</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 sm:text-base">
              Step into your client&apos;s shoes. This is the same AI your website visitors will experience — trained on your services, knowing your availability, booking appointments in real time without your staff involved.
            </p>
            <ul className="mt-4 space-y-2 sm:mt-6">
              {[
                "Real-time calendar availability check",
                "Service and pricing questions answered instantly",
                "Appointment placed directly on calendar",
                "Contact saved to Acuity",
              ].map((c, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-zinc-600">
                  <CheckCircle className="h-4 w-4 shrink-0 text-indigo-500" />
                  {c}
                </li>
              ))}
            </ul>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { stat: "< 90s", label: "Average booking time" },
                { stat: "24/7", label: "Always available" },
                { stat: "29+", label: "Languages Supported" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-black/[.08] bg-white p-3 text-center shadow-[0_2px_12px_rgba(0,0,0,.05)]"
                >
                  <p className="text-xl font-extrabold tracking-tight text-zinc-900 sm:text-2xl">{item.stat}</p>
                  <p className="mt-1 text-[10px] leading-tight text-zinc-400 sm:text-[11px]">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mx-auto w-full max-w-sm">
            <DemoChatbot />
          </div>
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
            Other tools hand your clients a calendar grid. Apivo has a conversation.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-6">
          {/* Other tools */}
          <div className="rounded-2xl border border-black/[.08] bg-zinc-50 p-6 sm:p-8">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">Other booking tools</p>
            <h3 className="mt-3 text-lg font-semibold text-zinc-500 sm:text-xl">Shows a grid of times.</h3>
            <ul className="mt-5 space-y-3">
              {[
                "Shows a grid of times",
                "Selects a slot with no context",
                "Cannot answer service or pricing questions",
                "No special requests handled",
                "Misses inquiries after hours",
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
                "Has a real conversation",
                "Trained on your services, pricing, and FAQs",
                "Answers any client question accurately",
                "Handles special requests naturally",
                "Books after hours, 24/7",
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
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
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
      q: "How is this different from Calendly or other booking tools?",
      a: "Calendly shows a grid of times. Apivo actually converses — it answers service and pricing questions, handles special requests, and manages the full booking lifecycle in natural language. It sounds like a member of your team, not a form.",
    },
    {
      q: "Do you work with Acuity Scheduling?",
      a: "Yes — Apivo is built specifically for Acuity. We connect directly to your Acuity account so your chatbot reads live availability and books appointments right into it. No double bookings, no manual entry.",
    },
    {
      q: "How long does setup take?",
      a: "Most med spas are live within 48 hours. We handle everything — calendar integration, knowledge base setup, and widget installation.",
    },
    {
      q: "Can it handle rescheduling and cancellations?",
      a: "Yes. Clients can book, reschedule, or cancel entirely through the chat. Your calendar updates in real time.",
    },
    {
      q: "What if a client asks something the AI doesn't know?",
      a: "It lets the client know a team member will follow up shortly. You stay in control of edge cases.",
    },
    {
      q: "Is there a contract?",
      a: "None. Month-to-month only. Cancel anytime with no penalty.",
    },
  ];
  return (
    <section id="faq" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
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
                Ready to Automate
                <br />
                Your Bookings?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600 sm:text-base">
                No forms. No phone tag. Just chat with our AI to get started — the same
                experience your customers will have.
              </p>
              <ul className="mt-4 sm:mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2">
                {[
                  "Free consultation",
                  "No contracts",
                  "Live in days, not weeks",
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
              AI Booking Assistant for Your Website
            </p>
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
                { text: "Contact", href: "#contact" },
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
      <Demo />
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
