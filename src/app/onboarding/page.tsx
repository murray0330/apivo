'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

// ── Types ─────────────────────────────────────────────────────────────────────

interface FormData {
  full_name: string
  business_name: string
  website_url: string
  phone: string
  email: string
  square_location_id: string
  staff_languages: string
  additional_notes: string
  excluded_treatments: string
}

interface FileState {
  file: File | null
  dragging: boolean
}

// ── File Upload Area ──────────────────────────────────────────────────────────

interface FileUploadAreaProps {
  label: string
  required?: boolean
  id: string
  value: File | null
  dragging: boolean
  onChange: (file: File | null) => void
  onDragChange: (dragging: boolean) => void
}

function FileUploadArea({
  label,
  required,
  id,
  value,
  dragging,
  onChange,
  onDragChange,
}: FileUploadAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      onDragChange(true)
    },
    [onDragChange]
  )

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      onDragChange(false)
    },
    [onDragChange]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      onDragChange(false)
      const dropped = e.dataTransfer.files[0]
      if (dropped && isValidFile(dropped)) onChange(dropped)
    },
    [onChange, onDragChange]
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null
    if (selected && isValidFile(selected)) onChange(selected)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-zinc-300 mb-2">
        {label}
        {required && <span className="text-indigo-400 ml-1">*</span>}
        {!required && (
          <span className="text-zinc-500 ml-1 font-normal">(optional)</span>
        )}
      </label>
      <div
        className={`relative rounded-xl border-2 border-dashed transition-all cursor-pointer ${
          dragging
            ? 'border-indigo-400 bg-indigo-500/10'
            : value
            ? 'border-indigo-500/60 bg-indigo-500/5'
            : 'border-zinc-600 hover:border-indigo-500/60 hover:bg-indigo-500/5'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
          {value ? (
            <>
              <svg
                className="w-8 h-8 text-indigo-400 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm font-medium text-indigo-300">{value.name}</p>
              <p className="text-xs text-zinc-500 mt-1">
                {(value.size / 1024 / 1024).toFixed(2)} MB — click to replace
              </p>
            </>
          ) : (
            <>
              <svg
                className="w-8 h-8 text-zinc-500 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-sm text-zinc-400">
                <span className="text-indigo-400 font-medium">Click to upload</span>{' '}
                or drag &amp; drop
              </p>
              <p className="text-xs text-zinc-500 mt-1">PDF or DOCX, up to 50 MB</p>
            </>
          )}
        </div>
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          onChange={handleChange}
        />
      </div>
    </div>
  )
}

function isValidFile(file: File) {
  const allowed = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]
  const allowedExt = ['.pdf', '.doc', '.docx']
  const ext = '.' + file.name.split('.').pop()?.toLowerCase()
  return allowed.includes(file.type) || allowedExt.includes(ext)
}

// ── Section Wrapper ───────────────────────────────────────────────────────────

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="border-l-4 border-indigo-500 pl-5">
      <h2 className="text-lg font-semibold text-white mb-5">{title}</h2>
      <div className="space-y-5">{children}</div>
    </div>
  )
}

// ── Input / Textarea Styles ───────────────────────────────────────────────────

const inputClass =
  'w-full bg-zinc-800/60 border border-zinc-700 text-white placeholder-zinc-500 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all'

const textareaClass = inputClass + ' resize-none'

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const [form, setForm] = useState<FormData>({
    full_name: '',
    business_name: '',
    website_url: '',
    phone: '',
    email: '',
    square_location_id: '',
    staff_languages: '',
    additional_notes: '',
    excluded_treatments: '',
  })

  const [files, setFiles] = useState<Record<string, FileState>>({
    services: { file: null, dragging: false },
    policies: { file: null, dragging: false },
    pricing: { file: null, dragging: false },
    aftercare: { file: null, dragging: false },
    other: { file: null, dragging: false },
  })

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Pre-fill email from query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const emailParam = params.get('email')
    if (emailParam) {
      setForm((f) => ({ ...f, email: emailParam }))
    }
  }, [])

  const setFile = (key: string, file: File | null) =>
    setFiles((prev) => ({ ...prev, [key]: { ...prev[key], file } }))

  const setDragging = (key: string, dragging: boolean) =>
    setFiles((prev) => ({ ...prev, [key]: { ...prev[key], dragging } }))

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const uploadFile = async (
    file: File,
    businessName: string,
    prefix: string
  ): Promise<string> => {
    const safeBusiness = businessName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, '-')
    const ext = file.name.split('.').pop()
    const path = `${safeBusiness}/${prefix}-${Date.now()}.${ext}`

    const { error } = await supabase.storage
      .from('client-files')
      .upload(path, file, { upsert: true })

    if (error) throw new Error(`Upload failed for ${prefix}: ${error.message}`)

    const { data } = supabase.storage.from('client-files').getPublicUrl(path)
    return data.publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate required files
    if (!files.services.file) {
      setError('Please upload your Services Menu.')
      return
    }
    if (!files.policies.file) {
      setError('Please upload your Cancellation & Rescheduling Policy.')
      return
    }

    setSubmitting(true)

    try {
      const biz = form.business_name

      // Upload all provided files in parallel
      const uploads: Array<Promise<[string, string]>> = []

      uploads.push(
        uploadFile(files.services.file, biz, 'services').then((url) => [
          'services_file_url',
          url,
        ])
      )
      uploads.push(
        uploadFile(files.policies.file!, biz, 'policies').then((url) => [
          'policies_file_url',
          url,
        ])
      )
      if (files.pricing.file) {
        uploads.push(
          uploadFile(files.pricing.file, biz, 'pricing').then((url) => [
            'pricing_file_url',
            url,
          ])
        )
      }
      if (files.aftercare.file) {
        uploads.push(
          uploadFile(files.aftercare.file, biz, 'aftercare').then((url) => [
            'aftercare_file_url',
            url,
          ])
        )
      }
      if (files.other.file) {
        uploads.push(
          uploadFile(files.other.file, biz, 'other').then((url) => [
            'additional_notes',
            url,
          ])
        )
      }

      const uploadResults = await Promise.all(uploads)
      const fileUrls = Object.fromEntries(uploadResults)

      // Insert row into clients table
      const { error: insertError } = await supabase.from('clients').insert([
        {
          full_name: form.full_name.trim(),
          business_name: form.business_name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          website_url: form.website_url.trim(),
          square_location_id: form.square_location_id.trim(),
          staff_languages: form.staff_languages.trim() || null,
          additional_notes: form.additional_notes.trim() || null,
          excluded_treatments: form.excluded_treatments.trim() || null,
          onboarding_status: 'submitted',
          ...fileUrls,
        },
      ])

      if (insertError)
        throw new Error(`Could not save your information: ${insertError.message}`)

      setSuccess(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Success Screen ──────────────────────────────────────────────────────────

  if (success) {
    const firstName = form.full_name.trim().split(' ')[0]
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center px-6 py-16 bg-zinc-950"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        <Image
          src="/apivo-logo_white.png"
          alt="Apivo"
          width={140}
          height={44}
          className="mb-10 opacity-90"
        />
        <div className="text-center max-w-lg">
          <div className="w-16 h-16 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-indigo-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-semibold text-white mb-4">
            You&apos;re all set, {firstName}.
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Check your email for next steps — we&apos;ll see you at your kickoff call.
          </p>
        </div>
      </main>
    )
  }

  // ── Form ────────────────────────────────────────────────────────────────────

  return (
    <main
      className="min-h-screen bg-zinc-950 text-white"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Header */}
      <div className="flex flex-col items-center pt-12 pb-10 px-6">
        <Image
          src="/apivo-logo_white.png"
          alt="Apivo"
          width={140}
          height={44}
          className="mb-8 opacity-90"
        />
        <h1 className="text-3xl sm:text-4xl font-semibold text-white text-center leading-tight mb-4">
          Welcome to Apivo.{' '}
          <span className="text-indigo-400">Let&apos;s get you live.</span>
        </h1>
        <p className="text-zinc-400 text-center max-w-xl text-base sm:text-lg leading-relaxed">
          Fill out the form below and book your kickoff call. We&apos;ll have your AI
          receptionist live within 48 hours.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto px-4 sm:px-6 pb-20 space-y-12"
      >
        {/* Section 1 — Your Business */}
        <Section title="Your Business">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Full Name <span className="text-indigo-400">*</span>
              </label>
              <input
                type="text"
                name="full_name"
                required
                value={form.full_name}
                onChange={handleChange}
                placeholder="Jane Smith"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Med Spa Business Name <span className="text-indigo-400">*</span>
              </label>
              <input
                type="text"
                name="business_name"
                required
                value={form.business_name}
                onChange={handleChange}
                placeholder="Glow Aesthetics"
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Website URL <span className="text-indigo-400">*</span>
            </label>
            <input
              type="url"
              name="website_url"
              required
              value={form.website_url}
              onChange={handleChange}
              placeholder="https://yourspa.com"
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Best Phone Number <span className="text-indigo-400">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={form.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Email Address <span className="text-indigo-400">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="jane@yourspa.com"
                className={inputClass}
              />
            </div>
          </div>
        </Section>

        {/* Section 2 — Square Account */}
        <Section title="Your Square Account">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Square Location ID <span className="text-indigo-400">*</span>
            </label>
            <input
              type="text"
              name="square_location_id"
              required
              value={form.square_location_id}
              onChange={handleChange}
              placeholder="LXXXXXXXXXXXXXXXXX"
              className={inputClass}
            />
            <p className="mt-2 text-xs text-zinc-500 leading-relaxed">
              Find this in your Square Dashboard → Locations → click your location
              → the ID is in the URL
            </p>
          </div>
        </Section>

        {/* Section 3 — Knowledge Base Files */}
        <Section title="Knowledge Base Files">
          <FileUploadArea
            id="services"
            label="Your Services Menu"
            required
            value={files.services.file}
            dragging={files.services.dragging}
            onChange={(f) => setFile('services', f)}
            onDragChange={(d) => setDragging('services', d)}
          />
          <FileUploadArea
            id="policies"
            label="Cancellation & Rescheduling Policy"
            required
            value={files.policies.file}
            dragging={files.policies.dragging}
            onChange={(f) => setFile('policies', f)}
            onDragChange={(d) => setDragging('policies', d)}
          />
          <FileUploadArea
            id="pricing"
            label="Pricing List (if separate from services menu)"
            value={files.pricing.file}
            dragging={files.pricing.dragging}
            onChange={(f) => setFile('pricing', f)}
            onDragChange={(d) => setDragging('pricing', d)}
          />
          <FileUploadArea
            id="aftercare"
            label="Aftercare Instructions"
            value={files.aftercare.file}
            dragging={files.aftercare.dragging}
            onChange={(f) => setFile('aftercare', f)}
            onDragChange={(d) => setDragging('aftercare', d)}
          />
          <FileUploadArea
            id="other"
            label="Any other material you'd want your front desk to reference (sensitive skin concerns, skin prep, shaving, acne, etc.)"
            value={files.other.file}
            dragging={files.other.dragging}
            onChange={(f) => setFile('other', f)}
            onDragChange={(d) => setDragging('other', d)}
          />
        </Section>

        {/* Section 4 — Additional Info */}
        <Section title="Additional Info">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Languages spoken by staff{' '}
              <span className="text-zinc-500 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              name="staff_languages"
              value={form.staff_languages}
              onChange={handleChange}
              placeholder="English, Spanish, Mandarin…"
              className={inputClass}
            />
            <p className="mt-2 text-xs text-zinc-500">
              Apivo supports 29+ languages. Let us know your primary client languages.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Anything Apivo should know about your practice{' '}
              <span className="text-zinc-500 font-normal">(optional)</span>
            </label>
            <textarea
              name="additional_notes"
              value={form.additional_notes}
              onChange={handleChange}
              rows={4}
              placeholder="Tell us about your practice, clientele, or anything else you'd like your AI receptionist to know…"
              className={textareaClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Treatments you do NOT want Apivo to discuss{' '}
              <span className="text-zinc-500 font-normal">(optional)</span>
            </label>
            <textarea
              name="excluded_treatments"
              value={form.excluded_treatments}
              onChange={handleChange}
              rows={3}
              placeholder="e.g. injectable medications, off-label procedures…"
              className={textareaClass}
            />
          </div>
        </Section>

        {/* Section 5 — Book Kickoff Call */}
        <div className="border-l-4 border-indigo-500 pl-5">
          <h2 className="text-lg font-semibold text-white mb-1">
            Book Your 20-Minute Kickoff Call
          </h2>
          <p className="text-sm text-zinc-400 mb-5">
            Pick a time that works for you. We&apos;ll walk through your setup together.
          </p>
          <div className="rounded-xl overflow-hidden border border-zinc-700 bg-zinc-900/60">
            <iframe
              src="https://calendly.com/apivo"
              title="Book a kickoff call"
              width="100%"
              height="650"
              frameBorder="0"
              className="block"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-base rounded-xl py-4 transition-all flex items-center justify-center gap-3"
        >
          {submitting ? (
            <>
              <svg
                className="w-5 h-5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              Uploading &amp; Saving…
            </>
          ) : (
            'Submit & Book My Kickoff Call'
          )}
        </button>
      </form>
    </main>
  )
}
