"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { getSupabase } from "@/lib/supabase";

/* ─── types ─────────────────────────────────────────────── */
interface FormState {
  full_name: string;
  business_name: string;
  website_url: string;
  phone: string;
  email: string;
}

interface FieldErrors {
  [key: string]: string;
}

const STORAGE_KEY = "apivo_onboarding_form";

/* ─── square connect section ─────────────────────────────── */
function SquareConnectSection({
  businessName,
  connected,
  error,
  onConnect,
  onDisconnect,
}: {
  businessName: string;
  connected: boolean;
  error?: string;
  onConnect: () => void;
  onDisconnect: () => void;
}) {
  return (
    <div className="rounded-2xl border border-black/[.08] bg-white p-6 shadow-[0_2px_20px_rgba(0,0,0,.06)] sm:p-8">
      <h2 className="mb-6 border-l-4 border-indigo-500 pl-3 text-base font-semibold text-zinc-900 sm:text-lg">
        2. Your Square Account
      </h2>

      {connected ? (
        <div className="flex items-center gap-3">
          <CheckCircle className="h-5 w-5 shrink-0 text-green-500" />
          <span className="text-sm font-medium text-green-700">Square account connected</span>
          <button
            type="button"
            onClick={onDisconnect}
            className="ml-auto text-xs text-zinc-400 underline hover:text-zinc-600"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={onConnect}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#006AFF] bg-white px-4 py-3 text-sm font-semibold text-[#006AFF] transition-colors hover:bg-blue-50"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#006AFF]">
              <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm2 5v8h10V8H7zm2 2h6v4H9v-4z"/>
            </svg>
            Connect Your Square Account
          </button>
          <p className="mt-2 text-center text-xs text-zinc-400">
            We&apos;ll securely connect to your Square account to enable live booking. You&apos;ll be
            redirected to Square and back in under a minute.
          </p>
          {error && <p className="mt-2 text-center text-xs font-medium text-red-500">{error}</p>}
        </>
      )}
    </div>
  );
}

/* ─── main page ──────────────────────────────────────────── */
export default function OnboardingPage() {
  const [form, setForm] = useState<FormState>({
    full_name: "",
    business_name: "",
    website_url: "",
    phone: "",
    email: "",
  });

  const [squareConnected, setSquareConnected] = useState(false);
  const [squareError, setSquareError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState(false);

  /* ── restore form from sessionStorage after Square redirect ── */
  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setForm(JSON.parse(saved)); } catch {}
      sessionStorage.removeItem(STORAGE_KEY);
    }

    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");
    if (emailParam) setForm((f) => ({ ...f, email: emailParam }));

    if (params.get("square_connected") === "true") {
      setSquareConnected(true);
      history.replaceState({}, "", "/onboarding");
    }
  }, []);

  /* ── field helpers ── */
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setFieldErrors((fe) => { const n = { ...fe }; delete n[name]; return n; });
  }

  /* ── Square connect ── */
  function handleSquareConnect() {
    if (!form.business_name.trim()) {
      setSquareError("Please enter your business name before connecting Square.");
      return;
    }
    setSquareError("");
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    window.location.href = `https://n8n.srv1150282.hstgr.cloud/webhook/square-auth?business_name=${encodeURIComponent(form.business_name)}`;
  }

  /* ── submit ── */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("[handleSubmit] called", form);

    const errors: FieldErrors = {};
    if (!form.full_name.trim())     errors["full_name"]     = "Full name is required.";
    if (!form.business_name.trim()) errors["business_name"] = "Business name is required.";
    if (!form.website_url.trim())   errors["website_url"]   = "Website URL is required.";
    if (!form.phone.trim())         errors["phone"]         = "Phone number is required.";
    if (!form.email.trim())         errors["email"]         = "Email address is required.";
    if (!squareConnected)           errors["square"]        = "Please connect your Square account.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const firstKey = Object.keys(errors)[0];
      document.getElementById(`field-${firstKey}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const supabase = getSupabase();
      console.log("[supabase] URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
      console.log("[supabase] anon key present:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
      console.log("[handleSubmit] inserting row…");

      const { error: insertError } = await supabase.from("clients").upsert({
        full_name:         form.full_name.trim(),
        business_name:     form.business_name.trim(),
        email:             form.email.trim(),
        phone:             form.phone.trim(),
        website_url:       form.website_url.trim(),
      }, { onConflict: "email" });

      if (insertError) throw new Error(insertError.message);

      console.log("[handleSubmit] success");
      setSuccess(true);
    } catch (err: unknown) {
      console.error("[handleSubmit] error", err);
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  /* ── success screen ── */
  if (success) {
    const firstName = form.full_name.trim().split(" ")[0];
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#fafafa] px-6 text-center">
        <img src="/apivo-logo_black.png" alt="Apivo" className="mb-8 h-8 w-auto" />
        <CheckCircle className="mb-4 h-14 w-14 text-indigo-500" />
        <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">
          You&apos;re all set, {firstName}.
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-500 sm:text-base">
          We&apos;ll have your AI receptionist live within 48 hours. We&apos;ll be in touch at{" "}
          <span className="font-medium text-zinc-700">{form.email}</span>.
        </p>
      </div>
    );
  }

  /* ── form ── */
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* header */}
      <div className="border-b border-black/[.08] bg-white py-8 text-center">
        <img src="/apivo-logo_black.png" alt="Apivo" className="mx-auto mb-6 h-8 w-auto" />
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
          Welcome to Apivo. Let&apos;s get you live.
        </h1>
        <p className="mt-2 text-sm text-zinc-500 sm:text-base">
          Fill out the form below. We&apos;ll have your AI receptionist live within 48 hours.
        </p>
      </div>

      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
        <form onSubmit={handleSubmit} noValidate className="space-y-6">

          {/* ── Section 1: Your Business ── */}
          <div className="rounded-2xl border border-black/[.08] bg-white p-6 shadow-[0_2px_20px_rgba(0,0,0,.06)] sm:p-8">
            <h2 className="mb-6 border-l-4 border-indigo-500 pl-3 text-base font-semibold text-zinc-900 sm:text-lg">
              1. Your Business
            </h2>
            <div className="space-y-4">
              {[
                { id: "full_name",     label: "Full Name",             type: "text",  placeholder: "Jane Smith" },
                { id: "business_name", label: "Med Spa Business Name",  type: "text",  placeholder: "Glow Aesthetics" },
                { id: "website_url",   label: "Website URL",            type: "text",  placeholder: "https://yourmedspa.com" },
                { id: "phone",         label: "Best Phone Number",      type: "tel",   placeholder: "(555) 000-0000" },
                { id: "email",         label: "Email Address",          type: "email", placeholder: "jane@yourmedspa.com" },
              ].map(({ id, label, type, placeholder }) => (
                <div key={id} id={`field-${id}`}>
                  <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-zinc-700">
                    {label} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id={id}
                    name={id}
                    type={type}
                    value={form[id as keyof FormState]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-300 focus:ring-2 focus:ring-indigo-400 ${
                      fieldErrors[id] ? "border-red-400 bg-red-50" : "border-black/[.10] bg-white"
                    }`}
                  />
                  {fieldErrors[id] && (
                    <p className="mt-1 text-xs text-red-500">{fieldErrors[id]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── Section 2: Square Connect ── */}
          <div id="field-square">
            <SquareConnectSection
              businessName={form.business_name}
              connected={squareConnected}
              error={squareError || fieldErrors["square"]}
              onConnect={handleSquareConnect}
              onDisconnect={() => setSquareConnected(false)}
            />
          </div>

          {/* ── submit ── */}
          {submitError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {submitError}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-indigo-500 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-600 disabled:opacity-60"
          >
            {submitting ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Submitting…
              </>
            ) : (
              "Submit My Information"
            )}
          </button>

        </form>
      </main>
    </div>
  );
}
