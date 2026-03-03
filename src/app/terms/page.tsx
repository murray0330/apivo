import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | Apivo",
  description: "Apivo Terms of Service — the rules governing use of our AI booking platform.",
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="border-b border-black/[.08] bg-white/80 px-6 py-4 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/">
            <img src="/apivo-logo_black.png" alt="Apivo" className="h-7 w-auto" />
          </Link>
          <Link
            href="/"
            className="text-sm font-light text-zinc-500 transition-colors hover:text-zinc-900"
          >
            ← Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-16 sm:py-24">
        <div className="mb-12">
          <h1 className="text-3xl font-light tracking-tight text-zinc-900 sm:text-4xl">Terms of Service</h1>
          <p className="mt-3 text-sm font-light text-zinc-400">Effective Date: March 1, 2026 &nbsp;·&nbsp; Last Updated: March 1, 2026</p>
        </div>

        <div className="space-y-12 text-sm font-light leading-relaxed text-zinc-600 sm:text-base">

          <section>
            <h2 className="mb-4 text-base font-medium text-zinc-900 sm:text-lg">1. Agreement to Terms</h2>
            <p>By accessing or using Apivo&apos;s services — including our AI chat widget, website, and related tools — you (&quot;Client&quot; or &quot;you&quot;) agree to be bound by these Terms of Service. If you do not agree, do not use our services.</p>
            <p className="mt-3">These Terms apply to dental practices and other appointment-based businesses that subscribe to Apivo&apos;s services.</p>
          </section>

          <section>
            <h2 className="mb-4 text-base font-medium text-zinc-900 sm:text-lg">2. Description of Service</h2>
            <p className="mb-3">Apivo provides an AI-powered appointment booking widget that:</p>
            <ul className="mb-4 list-disc space-y-1 pl-5">
              <li>Engages website visitors in natural language conversation</li>
              <li>Checks real-time calendar availability via Google Calendar</li>
              <li>Books, reschedules, and cancels appointments automatically</li>
              <li>Sends email confirmations to patients</li>
              <li>Syncs contact data to Google Sheets (optional)</li>
              <li>Answers patient FAQs via a configured knowledge base</li>
            </ul>
            <p>The service is powered by VAPI (AI infrastructure) and n8n (workflow automation).</p>
          </section>

          <section>
            <h2 className="mb-4 text-base font-medium text-zinc-900 sm:text-lg">3. Subscription &amp; Payment</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>Apivo is offered on a month-to-month subscription at the current listed price on apivo.ai</li>
              <li>Billing occurs monthly on the date of signup</li>
              <li>No long-term contracts. You may cancel at any time</li>
              <li>Early adopter pricing, where applicable, is locked in for the lifetime of the subscription as long as it remains active and in good standing</li>
              <li>All fees are non-refundable except where required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-base font-medium text-zinc-900 sm:text-lg">4. Client Responsibilities</h2>
            <p className="mb-3">You agree to:</p>
            <ul className="mb-4 list-disc space-y-1 pl-5">
              <li>Provide accurate business information, calendar access, and FAQs during onboarding</li>
              <li>Maintain valid Google Calendar credentials and notify us of any changes</li>
              <li>Ensure your use of Apivo complies with all applicable laws, including any healthcare privacy regulations relevant to your practice</li>
              <li>Not use Apivo for any unlawful purpose</li>
              <li>Not attempt to reverse engineer, copy, or resell the Apivo service</li>
            </ul>
            <p className="rounded-xl border border-black/[.08] bg-zinc-50 px-4 py-3 text-zinc-500">Important: You are solely responsible for ensuring your practice&apos;s compliance with HIPAA and any other applicable healthcare regulations. Apivo provides tools with privacy-conscious settings enabled but does not guarantee HIPAA compliance on your behalf.</p>
          </section>

          <section>
            <h2 className="mb-4 text-base font-medium text-zinc-900 sm:text-lg">5. Intellectual Property</h2>
            <p>All software, workflows, AI configurations, prompts, and systems underlying Apivo are the intellectual property of Apivo. Your subscription grants you a limited, non-exclusive, non-transferable license to use the service for your business.</p>
            <p className="mt-3">Any business information, FAQs, or content you provide to configure your widget remains your property.</p>
          </section>

          <section>
            <h2 className="mb-4 text-base font-medium text-zinc-900 sm:text-lg">6. Uptime &amp; Service Availability</h2>
            <p className="mb-3">We strive for high availability but do not guarantee uninterrupted service. Downtime may occur due to:</p>
            <ul className="mb-4 list-disc space-y-1 pl-5">
              <li>Third-party service outages (VAPI, n8n, Google)</li>
              <li>Scheduled maintenance</li>
              <li>Events beyond our control</li>
            </ul>
            <p>We will communicate planned maintenance in advance where possible.</p>
          </section>

          <section>
            <h2 className="mb-4 text-base font-medium text-zinc-900 sm:text-lg">7. Limitation of Liability</h2>
            <p className="mb-3">To the maximum extent permitted by law:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Apivo is not liable for missed appointments, lost revenue, or business damages arising from service downtime or AI errors</li>
              <li>Our total liability to you shall not exceed the fees paid in the 30 days prior to the event giving rise to the claim</li>
              <li>We are not responsible for the accuracy of AI-generated responses in edge cases not covered by your configured knowledge base</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-base font-medium text-zinc-900 sm:text-lg">8. Termination</h2>
            <p className="mb-3">Either party may terminate the service at any time:</p>
            <ul className="mb-4 list-disc space-y-2 pl-5">
              <li><span className="font-medium text-zinc-700">You:</span> Cancel anytime via email to <a href="mailto:support@apivo.ai" className="text-indigo-500 hover:text-indigo-400">support@apivo.ai</a> — no penalty, no questions asked</li>
              <li><span className="font-medium text-zinc-700">Us:</span> We reserve the right to terminate accounts that violate these Terms, with 7 days written notice except in cases of severe violation</li>
            </ul>
            <p>Upon termination, your data will be retained for 90 days then deleted unless you request earlier deletion.</p>
          </section>

          <section>
            <h2 className="mb-4 text-base font-medium text-zinc-900 sm:text-lg">9. Governing Law</h2>
            <p>These Terms are governed by the laws of the Commonwealth of Virginia, without regard to conflict of law principles. Any disputes shall be resolved in the courts of Hampton, Virginia.</p>
          </section>

          <section>
            <h2 className="mb-4 text-base font-medium text-zinc-900 sm:text-lg">10. Changes to Terms</h2>
            <p>We may update these Terms periodically. We will notify you via email at least 14 days before material changes take effect. Continued use after that date constitutes acceptance.</p>
          </section>

          <section>
            <h2 className="mb-4 text-base font-medium text-zinc-900 sm:text-lg">11. Contact</h2>
            <address className="not-italic">
              <p className="font-medium text-zinc-800">Apivo</p>
              <p>Hampton, Virginia</p>
              <p><a href="mailto:support@apivo.ai" className="text-indigo-500 hover:text-indigo-400">support@apivo.ai</a></p>
              <p><a href="https://apivo.ai" className="text-indigo-500 hover:text-indigo-400">apivo.ai</a></p>
            </address>
          </section>

        </div>
      </main>

      <footer className="border-t border-black/[.08] bg-[#fafafa] py-8 text-center text-xs font-light text-zinc-400">
        &copy; 2026 Apivo. All rights reserved. &nbsp;·&nbsp;{" "}
        <Link href="/privacy" className="hover:text-zinc-600">Privacy Policy</Link>
      </footer>
    </div>
  );
}
