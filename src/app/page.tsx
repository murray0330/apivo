import LiveChatWidget from "@/components/live-chat-widget";
import DemoChatbot from "@/components/demo-chatbot";
import AuroraHero from "@/components/aurora-hero";
import ChatCtaButton from "@/components/chat-cta-button";
import UseCaseCarousel from "@/components/use-case-carousel";
import RevenueCalculator from "@/components/revenue-calculator";
import { AuroraBackground } from "@/components/ui/aurora-background";
import {
  Calendar,
  MessageSquare,
  Mail,
  Users,
  RefreshCw,
  Globe,
  Star,
  DollarSign,
  Home,
  CheckCircle,
  ChevronDown,
  Clock,
} from "lucide-react";

/* ================================================================
   Navbar
   ================================================================ */
function Navbar() {
  const links = [
    { href: "#hero", label: "Home", icon: Home },
    { href: "#features", label: "Features", icon: Star },
    { href: "#demo", label: "Demo", icon: MessageSquare },
    { href: "#pricing", label: "Pricing", icon: DollarSign },
    { href: "#contact", label: "Contact", icon: Mail },
  ];
  return (
    <nav className="fixed top-4 left-1/2 z-50 -translate-x-1/2" aria-label="Main navigation">
      <div className="flex items-center gap-1 rounded-full border border-black/[.08] bg-white/75 px-2 py-1.5 shadow-[0_2px_20px_rgba(0,0,0,.06)] backdrop-blur-xl sm:gap-2 sm:px-3">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-medium text-zinc-500 transition-colors hover:bg-black/[.06] hover:text-zinc-900 sm:px-3 sm:py-2 sm:text-xs"
          >
            <l.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">{l.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}

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
          Trusted by dental practices across Virginia
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
      desc: "Never miss an after-hours lead. Your AI captures and books inquiries around the clock.",
      icon: Calendar,
    },
    {
      stat: "3+ hrs",
      label: "Back Every Day",
      desc: "No more answering booking calls or chasing confirmations — it's all handled automatically.",
      icon: Clock,
    },
    {
      stat: "24/7",
      label: "Always Available",
      desc: "Your AI never sleeps, never takes a break, and never puts a customer on hold.",
      icon: Globe,
    },
  ];

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Intro */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-indigo-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-indigo-600 sm:text-xs">
            What Appointly AI Does
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl md:text-4xl">
            Your Business, Running 24/7 —<br className="hidden sm:block" /> Without Adding Headcount
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-zinc-500 sm:text-base">
            Appointly AI is an intelligent chatbot that lives on your website. It answers customer
            questions, checks your real-time calendar, books appointments directly, and sends
            confirmation emails — all without a human ever touching it.
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
   Problem / Solution
   ================================================================ */
function Versus() {
  const rows = [
    { feature: "Booking", old: "Collects info & emails it to you", us: "Books directly on your calendar" },
    { feature: "Speed", old: "Customer waits for a callback", us: "Instant confirmation for the customer" },
    { feature: "Conflicts", old: "Scheduling conflicts & double-bookings", us: "Real-time availability — zero conflicts" },
    { feature: "Integrations", old: "No calendar or CRM sync", us: "Google Calendar + CRM sync built in" },
    { feature: "Follow-up", old: "Manual follow-up required", us: "Automated confirmations & reminders" },
  ];

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Heading */}
        <div className="mb-10 text-center sm:mb-14">
          <span className="mb-3 inline-block rounded-full bg-indigo-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-indigo-600 sm:text-xs">
            Why switch
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl lg:text-4xl">
            Not all chatbots are created equal
          </h2>
        </div>

        {/* Comparison table */}
        <div className="overflow-hidden rounded-2xl border border-black/[.08] shadow-[0_2px_24px_rgba(0,0,0,.06)]">
          {/* Column headers */}
          <div className="grid grid-cols-[1fr_1fr] border-b border-black/[.06] bg-[#fafafa] sm:grid-cols-[1fr_1fr]">
            <div className="flex items-center gap-2 border-r border-black/[.06] px-4 py-3.5 sm:px-6 sm:py-4">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500/10 text-xs text-red-500 sm:h-6 sm:w-6">
                ✕
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 sm:text-sm">
                Other Chatbots
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-3.5 sm:px-6 sm:py-4">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/10 text-xs text-green-600 sm:h-6 sm:w-6">
                ✓
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 sm:text-sm">
                Appointly AI
              </span>
            </div>
          </div>

          {/* Rows */}
          {rows.map((r, i) => (
            <div
              key={i}
              className={`grid grid-cols-[1fr_1fr] sm:grid-cols-[1fr_1fr] ${i < rows.length - 1 ? "border-b border-black/[.06]" : ""}`}
            >
              {/* Old way */}
              <div className="border-r border-black/[.06] px-4 py-4 sm:px-6 sm:py-5">
                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-zinc-400 sm:text-[11px]">
                  {r.feature}
                </span>
                <span className="text-sm leading-snug text-zinc-500 sm:text-[15px]">
                  {r.old}
                </span>
              </div>
              {/* Appointly */}
              <div className="bg-indigo-500/[.02] px-4 py-4 sm:px-6 sm:py-5">
                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-zinc-400 sm:text-[11px]">
                  {r.feature}
                </span>
                <span className="text-sm font-medium leading-snug text-zinc-800 sm:text-[15px]">
                  {r.us}
                </span>
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
      desc: "Share your services, hours, booking rules, and FAQs. We configure your AI to sound like a member of your team.",
    },
    {
      num: "02",
      title: "We Connect Your Calendar & CRM",
      desc: "Google Calendar, HubSpot, Airtable, and more. Your chatbot sees real availability and books without conflicts.",
    },
    {
      num: "03",
      title: "Embed & Go Live",
      desc: "One snippet on your website. Your AI is live, booking appointments 24/7, sending confirmations automatically.",
    },
  ];
  return (
    <section id="how-it-works" className="bg-[#fafafa] py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHead tag="How It Works" title="Three Steps. Fully Automated." />
        <div className="mt-10 grid gap-8 sm:mt-16 md:grid-cols-3 md:gap-6">
          {steps.map((s) => (
            <div key={s.num} className="relative">
              <span className="text-5xl font-extrabold text-black/[.05] sm:text-6xl">{s.num}</span>
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
      icon: Calendar,
      title: "Zero Double Bookings",
      desc: "Real-time calendar check before offering any slot. Configurable buffer times. Booked slots are never shown.",
      highlight: true,
    },
    {
      icon: MessageSquare,
      title: "Smart Business Q&A",
      desc: "AI-powered knowledge retrieval answers any customer question from your uploaded docs.",
    },
    {
      icon: Mail,
      title: "Automatic Emails",
      desc: "Booking, rescheduling, or cancellation — confirmation emails fire instantly.",
    },
    {
      icon: Users,
      title: "CRM Integration",
      desc: "Contacts auto-created in HubSpot, Airtable, or Google Sheets. Deals sync instantly.",
    },
    {
      icon: RefreshCw,
      title: "Full Lifecycle",
      desc: "Book, reschedule, cancel — all through the chatbot. Calendar updates in real time.",
    },
    {
      icon: Globe,
      title: "29+ Languages",
      desc: "Auto-detects the customer's language and responds natively. Global-ready.",
    },
  ];
  return (
    <section id="features" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHead
          tag="Features"
          title="Everything Your Front Desk Does — On Autopilot"
        />
        <div className="mt-10 grid gap-4 sm:mt-16 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {feats.map((f) => (
            <article
              key={f.title}
              className={`group rounded-2xl border p-5 transition-colors sm:p-6 ${
                f.highlight
                  ? "border-indigo-500/20 bg-indigo-50/50 shadow-[0_2px_20px_rgba(0,0,0,.06)]"
                  : "border-black/[.08] bg-white shadow-[0_2px_20px_rgba(0,0,0,.06)] hover:border-black/[.15]"
              }`}
            >
              <f.icon className="h-8 w-8 text-indigo-500 sm:h-10 sm:w-10" strokeWidth={1.5} />
              {f.highlight && (
                <span className="mt-3 inline-block rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-indigo-600">
                  Core Differentiator
                </span>
              )}
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
              Step into your patient&apos;s shoes and witness the future of your front desk. Use the demo chat to experience how Apivo grants you the freedom to focus on care while your calendar fills itself—accurately, instantly, and without the phone tag.
            </p>
            <ul className="mt-4 space-y-2 sm:mt-6">
              {[
                "Real-time calendar availability check",
                "Appointment placed directly on calendar",
                "Confirmation email sent automatically",
                "Contact saved to CRM",
              ].map((c, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-zinc-600">
                  <CheckCircle className="h-4 w-4 shrink-0 text-green-500" />
                  {c}
                </li>
              ))}
            </ul>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { stat: "< 90s", label: "Average booking time" },
                { stat: "24/7", label: "Always available" },
                { stat: "0", label: "Missed after-hours appointments" },
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
          <DemoChatbot />
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
   Integrations
   ================================================================ */
function Integrations() {
  const items = [
    { icon: Calendar, name: "Google Calendar" },
    { icon: Users, name: "HubSpot" },
    { icon: Globe, name: "Google Sheets" },
    { icon: Star, name: "Airtable" },
    { icon: Mail, name: "Gmail" },
    { icon: RefreshCw, name: "n8n Workflows" },
  ];
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHead tag="Integrations" title="Works With Your Stack" />
        <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-16 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {items.map((it) => (
            <div
              key={it.name}
              className="flex flex-col items-center gap-2.5 rounded-xl border border-black/[.08] bg-white p-4 shadow-[0_2px_20px_rgba(0,0,0,.06)] transition-colors hover:border-black/[.15] sm:p-5"
            >
              <it.icon className="h-7 w-7 text-zinc-400 sm:h-8 sm:w-8" strokeWidth={1.5} />
              <span className="text-[11px] font-medium text-zinc-600 sm:text-xs">{it.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   Pricing
   ================================================================ */
function Pricing() {
  const plans = [
    {
      name: "Starter",
      desc: "Solo practitioners & small businesses",
      price: "$297",
      per: "/mo",
      features: [
        "1 AI chatbot",
        "Google Calendar sync",
        "Email confirmations",
        "Business Q&A (50 FAQs)",
        "Unlimited conversations",
      ],
      popular: false,
    },
    {
      name: "Professional",
      desc: "Growing businesses with CRM needs",
      price: "$497",
      per: "/mo",
      features: [
        "Everything in Starter",
        "CRM integration (HubSpot, Airtable)",
        "Reschedule & cancel via chatbot",
        "Multi-language (29+)",
        "Post-call analytics & reports",
        "Priority support",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      desc: "Multi-location & agencies",
      price: "Custom",
      per: "",
      features: [
        "Everything in Professional",
        "Multiple chatbots & locations",
        "Custom CRM & API integrations",
        "White-label option",
        "Dedicated account manager",
        "Custom workflow development",
      ],
      popular: false,
    },
  ];
  return (
    <section id="pricing" className="bg-[#fafafa] py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHead
          tag="Pricing"
          title="Simple, Transparent Pricing"
          subtitle="No hidden fees. No per-conversation charges."
        />
        <div className="mt-10 grid gap-5 sm:mt-16 md:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-2xl border p-5 shadow-[0_2px_20px_rgba(0,0,0,.06)] sm:p-7 ${
                p.popular
                  ? "border-indigo-500/30 bg-indigo-50/50"
                  : "border-black/[.08] bg-white"
              }`}
            >
              {p.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                  Most Popular
                </span>
              )}
              <h3 className="text-base font-semibold text-zinc-900 sm:text-lg">{p.name}</h3>
              <p className="mt-1 text-xs text-zinc-500 sm:text-sm">{p.desc}</p>
              <div className="mt-4 flex items-baseline gap-0.5">
                <span className="text-3xl font-bold text-zinc-900 sm:text-4xl">{p.price}</span>
                {p.per && <span className="text-sm text-zinc-400">{p.per}</span>}
              </div>
              <ul className="mt-5 space-y-2">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-zinc-600 sm:text-sm">
                    <CheckCircle className="h-3.5 w-3.5 shrink-0 text-indigo-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className={`mt-6 block w-full rounded-full py-2.5 text-center text-sm font-medium transition-colors sm:py-3 ${
                  p.popular
                    ? "bg-indigo-500 text-white hover:bg-indigo-400"
                    : "border border-black/[.08] bg-[#f4f4f5] text-zinc-900 hover:bg-[#e4e4e7]"
                }`}
              >
                {p.name === "Enterprise" ? "Contact Sales" : "Get Started"}
              </a>
            </div>
          ))}
        </div>
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
      q: "How is this different from other chatbot services?",
      a: "Most chatbots just collect information and email it to you. Appointly AI connects to your live calendar, checks real-time availability, and places the actual appointment on your schedule — no human intervention needed.",
    },
    {
      q: "Which calendars and CRMs do you integrate with?",
      a: "Google Calendar for scheduling, plus HubSpot, Airtable, and Google Sheets for CRM. Custom integrations are available on the Enterprise plan.",
    },
    {
      q: "Can the chatbot handle rescheduling and cancellations?",
      a: "Yes. Customers can book, reschedule, or cancel entirely through the chatbot. Calendar updates in real-time and confirmation emails are sent automatically.",
    },
    {
      q: "How does it prevent double bookings?",
      a: "The chatbot queries your Google Calendar for all existing events before presenting available times. It calculates open slots based on your business hours, meeting duration, and configurable buffer times.",
    },
    {
      q: "Can the chatbot answer questions about my business?",
      a: "We load your business information, FAQs, services, and policies into a knowledge base. The chatbot uses AI-powered retrieval (RAG) to deliver accurate answers.",
    },
    {
      q: "How long does setup take?",
      a: "Most chatbots are live within a few business days. We handle configuration, calendar integration, CRM setup, and knowledge base loading.",
    },
  ];
  return (
    <section id="faq" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHead tag="FAQ" title="Questions & Answers" />
        <div className="mt-10 space-y-3 sm:mt-16">
          {items.map((faq, i) => (
            <details
              key={i}
              className="group rounded-xl border border-black/[.08] bg-white shadow-[0_2px_20px_rgba(0,0,0,.06)] transition-colors open:border-black/[.15]"
            >
              <summary className="flex items-center justify-between px-4 py-3.5 text-sm font-medium text-zinc-900 sm:px-5 sm:py-4 sm:text-base">
                {faq.q}
                <ChevronDown className="h-4 w-4 shrink-0 text-zinc-400 transition-transform group-open:rotate-180" />
              </summary>
              <p className="px-4 pb-4 text-xs leading-relaxed text-zinc-500 sm:px-5 sm:pb-5 sm:text-sm">
                {faq.a}
              </p>
            </details>
          ))}
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
      <section id="contact" className="relative z-10 w-full">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
            {/* Left — CTA */}
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
              <ul className="mt-4 space-y-2 sm:mt-6">
                {[
                  "Free consultation & demo",
                  "No contracts — cancel anytime",
                  "Live in days, not weeks",
                ].map((c, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-zinc-600">
                    <CheckCircle className="h-4 w-4 shrink-0 text-green-500" />
                    {c}
                  </li>
                ))}
              </ul>
              <ChatCtaButton />
            </div>

            {/* Right — Use Cases Carousel */}
            <UseCaseCarousel />
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
    <footer className="border-t border-black/[.08] bg-white py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="sm:col-span-2 md:col-span-1">
            <span className="text-base font-bold text-zinc-900 sm:text-lg">
              Appointly<span className="text-indigo-500">AI</span>
            </span>
            <p className="mt-2 text-xs leading-relaxed text-zinc-400 sm:text-sm">
              AI chatbots that actually book appointments on your calendar — without double booking.
            </p>
          </div>
          {[
            {
              title: "Product",
              links: [
                { text: "Features", href: "#features" },
                { text: "Demo", href: "#demo" },
                { text: "Pricing", href: "#pricing" },
                { text: "How It Works", href: "#how-it-works" },
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
                { text: "Privacy Policy", href: "#" },
                { text: "Terms of Service", href: "#" },
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
          &copy; 2026 Appointly AI. All rights reserved.
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
      <Integrations />
      <Versus />
      <Calculator />
      <Pricing />
      <FAQ />
      <Contact />
      <Footer />
      <LiveChatWidget />
    </div>
  );
}
