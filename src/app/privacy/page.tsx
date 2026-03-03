import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Apivo",
  description: "Apivo Privacy Policy — how we collect, use, and protect your information.",
};

export default function PrivacyPolicy() {
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
          <h1 className="text-3xl font-light tracking-tight text-zinc-900 sm:text-4xl">Privacy Policy</h1>
          <p className="mt-3 text-sm font-light text-zinc-400">Effective Date: March 1, 2026 &nbsp;·&nbsp; Last Updated: March 1, 2026</p>
        </div>

        <div className="space-y-12 text-sm font-light leading-relaxed text-zinc-600 sm:text-base">

          <section>
            <h2 className="mb-4 text-base font-medium text-zinc-900 sm:text-lg">1. Introduction</h2>
            <p>Apivo (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is an AI-powered appointment booking service operated by Apivo, located in Hampton, Virginia. This Privacy Policy explains how we collect, use, disclose, and protect information when you use our services, including our AI chat widget, website (apivo.ai), and related tools powered by n8n (workflow automation) and VAPI (AI conversation infrastructure).</p>
            <p className="mt-3">By using Apivo, you agree to the terms of this Privacy Policy.</p>
          </section>

          <section>
            <h2 className="mb-4 text-base font-medium text-zinc-900 sm:text-lg">2. Information We Collect</h2>
            <p className="mb-3 font-medium text-zinc-700">Information collected through the chat widget:</p>
            <ul className="mb-6 list-disc space-y-1 pl-5">
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Appointment preferences (date, time, service type)</li>
              <li>Responses provided during the booking conversation</li>
            </ul>
            <p className="mb-3 font-medium text-zinc-700">Information collected automatically:</p>
            <ul className="mb-6 list-disc space-y-1 pl-5">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Device type</li>
              <li>Pages visited and time spent</li>
              <li>Referring URLs</li>
            </ul>
            <p className="mb-3 font-medium text-zinc-700">Information from dental practice clients (B2B):</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Business name and address</li>
              <li>Contact person name and email</li>
              <li>Google Calendar credentials (OAuth tokens)</li>
              <li>Business FAQs and service information uploaded to the knowledge base</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-base font-medium text-zinc-900 sm:text-lg">3. How We Use Your Information</h2>
            <p className="mb-3">We use collected information to:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Book, reschedule, and cancel appointments on behalf of dental practices</li>
              <li>Send automated email confirmations to patients</li>
              <li>Sync appointment data with connected Google Calendar</li>
              <li>Respond to inquiries submitted through the chat widget</li>
              <li>Improve our AI workflows and booking experience</li>
              <li>Communicate with dental practice clients about their accounts</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-base font-medium text-zinc-900 sm:text-lg">4. Third-Party Processors</h2>
            <p className="mb-4">Apivo uses the following third-party services to deliver our product. Each may process personal data on our behalf:</p>
            <div className="overflow-x-auto rounded-xl border border-black/[.08]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/[.08] bg-zinc-50 text-left">
                    <th className="px-4 py-3 font-medium text-zinc-700">Service</th>
                    <th className="px-4 py-3 font-medium text-zinc-700">Purpose</th>
                    <th className="px-4 py-3 font-medium text-zinc-700">Privacy Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[.06]">
                  {[
                    { name: "VAPI", purpose: "AI conversation engine, language processing", link: "vapi.ai/privacy" },
                    { name: "n8n", purpose: "Workflow automation and data routing", link: "n8n.io/privacy" },
                    { name: "Google Calendar", purpose: "Appointment scheduling and calendar sync", link: "policies.google.com" },
                    { name: "Google Sheets", purpose: "Optional data logging", link: "policies.google.com" },
                    { name: "Gmail", purpose: "Sending confirmation emails", link: "policies.google.com" },
                    { name: "Vercel", purpose: "Website hosting", link: "vercel.com/legal/privacy-policy" },
                  ].map((row) => (
                    <tr key={row.name} className="bg-white">
                      <td className="px-4 py-3 font-medium text-zinc-800">{row.name}</td>
                      <td className="px-4 py-3 text-zinc-500">{row.purpose}</td>
                      <td className="px-4 py-3 text-zinc-400">{row.link}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4">We do not sell your personal data to any third party.</p>
          </section>

          <section>
            <h2 className="mb-4 text-base font-medium text-zinc-900 sm:text-lg">5. Data Retention</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>Patient booking data is retained for as long as the dental practice remains an active Apivo client, or until deletion is requested</li>
              <li>Chat conversation logs are retained for up to 12 months for quality and support purposes</li>
              <li>Client account data is retained for the duration of the service agreement plus 90 days after cancellation</li>
              <li>You may request deletion of your data at any time by contacting us at <a href="mailto:privacy@apivo.ai" className="text-indigo-500 hover:text-indigo-400">privacy@apivo.ai</a></li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-base font-medium text-zinc-900 sm:text-lg">6. Data Security</h2>
            <p className="mb-3">We take reasonable technical and organizational measures to protect your data, including:</p>
            <ul className="mb-4 list-disc space-y-1 pl-5">
              <li>Encrypted data transmission (HTTPS/TLS)</li>
              <li>VAPI&apos;s privacy-conscious infrastructure settings enabled</li>
              <li>Access controls limiting who can view patient data</li>
              <li>Regular review of third-party vendor security practices</li>
            </ul>
            <p className="rounded-xl border border-black/[.08] bg-zinc-50 px-4 py-3 text-zinc-500">Note: While we implement these measures, no system is completely secure. Dental practice clients are encouraged to evaluate their own compliance obligations independently.</p>
          </section>

          <section>
            <h2 className="mb-4 text-base font-medium text-zinc-900 sm:text-lg">7. Your Rights — Virginia Residents (VCDPA)</h2>
            <p className="mb-3">If you are a Virginia resident, you have the following rights under the Virginia Consumer Data Protection Act (VCDPA):</p>
            <ul className="mb-4 list-disc space-y-1 pl-5">
              <li><span className="font-medium text-zinc-700">Right to access</span> — know what personal data we hold about you</li>
              <li><span className="font-medium text-zinc-700">Right to correct</span> — request corrections to inaccurate data</li>
              <li><span className="font-medium text-zinc-700">Right to delete</span> — request deletion of your personal data</li>
              <li><span className="font-medium text-zinc-700">Right to data portability</span> — receive a copy of your data in a portable format</li>
              <li><span className="font-medium text-zinc-700">Right to opt out</span> — opt out of the sale of personal data (note: we do not sell personal data)</li>
            </ul>
            <p>To exercise any of these rights, email us at <a href="mailto:privacy@apivo.ai" className="text-indigo-500 hover:text-indigo-400">privacy@apivo.ai</a>. We will respond within 45 days as required by the VCDPA.</p>
          </section>

          <section>
            <h2 className="mb-4 text-base font-medium text-zinc-900 sm:text-lg">8. Children&apos;s Privacy</h2>
            <p>Apivo is not directed at children under the age of 13. We do not knowingly collect personal data from children. If you believe a child has submitted data through our widget, contact us immediately at <a href="mailto:privacy@apivo.ai" className="text-indigo-500 hover:text-indigo-400">privacy@apivo.ai</a>.</p>
          </section>

          <section>
            <h2 className="mb-4 text-base font-medium text-zinc-900 sm:text-lg">9. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify active clients of material changes via email. Continued use of Apivo after changes constitutes acceptance of the updated policy.</p>
          </section>

          <section>
            <h2 className="mb-4 text-base font-medium text-zinc-900 sm:text-lg">10. Contact Us</h2>
            <address className="not-italic">
              <p className="font-medium text-zinc-800">Apivo</p>
              <p>Hampton, Virginia</p>
              <p><a href="mailto:privacy@apivo.ai" className="text-indigo-500 hover:text-indigo-400">privacy@apivo.ai</a></p>
              <p><a href="https://apivo.ai" className="text-indigo-500 hover:text-indigo-400">apivo.ai</a></p>
            </address>
          </section>

        </div>
      </main>

      <footer className="border-t border-black/[.08] bg-[#fafafa] py-8 text-center text-xs font-light text-zinc-400">
        &copy; 2026 Apivo. All rights reserved. &nbsp;·&nbsp;{" "}
        <Link href="/terms" className="hover:text-zinc-600">Terms of Service</Link>
      </footer>
    </div>
  );
}
