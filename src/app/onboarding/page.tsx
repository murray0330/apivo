'use client'

export const dynamic = 'force-dynamic'

import { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { getSupabase } from '@/lib/supabase'

// ── Types ─────────────────────────────────────────────────────────────────────

interface FormData {
  full_name: string
  business_name: string
  website_url: string
  phone: string
  email: string
  staff_languages: string
  additional_notes: string
  excluded_treatments: string
}

interface FileSlot {
  file: File | null
  dragging: boolean
}

// ── Square Connect Section ────────────────────────────────────────────────────

function SquareLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="22" height="22" rx="4" fill="currentColor" />
      <rect x="7" y="7" width="10" height="10" rx="1.5" fill="white" />
    </svg>
  )
}

interface SquareConnectSectionProps {
  connected: boolean
  error: string | null
  onConnect: () => void
  onDisconnect: () => void
}

function SquareConnectSection({ connected, error, onConnect, onDisconnect }: SquareConnectSectionProps) {
  if (connected) {
    return (
      <div className="flex items-center justify-between py-1">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50 border border-green-200">
            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-sm font-medium text-zinc-800">Square account connected ✓</span>
        </div>
        <button
          type="button"
          onClick={onDisconnect}
          className="text-xs text-zinc-400 hover:text-zinc-600 underline underline-offset-2 transition-colors"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <div>
      <button
        type="button"
        onClick={onConnect}
        className="w-full flex items-center justify-center gap-3 rounded-xl border border-[#006AFF] bg-white px-4 py-3 text-sm font-semibold text-[#006AFF] transition-colors hover:bg-[#006AFF]/5"
      >
        <SquareLogo className="h-5 w-5 text-[#006AFF] shrink-0" />
        Connect Your Square Account
      </button>
      {error && (
        <p className="mt-2 text-xs font-medium text-red-600">{error}</p>
      )}
      <p className="mt-2.5 text-xs text-zinc-400 leading-relaxed">
        We&apos;ll securely connect to your Square account to enable live booking. You&apos;ll be
        redirected to Square and back in under a minute.
      </p>
    </div>
  )
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

function FileUploadArea({ label, required, id, value, dragging, onChange, onDragChange }: FileUploadAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    onDragChange(true)
  }, [onDragChange])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    onDragChange(false)
  }, [onDragChange])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    onDragChange(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped && isValidFile(dropped)) onChange(dropped)
  }, [onChange, onDragChange])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null
    if (f && isValidFile(f)) onChange(f)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700 mb-1.5">
        {label}
        {required
          ? <span className="text-indigo-500 ml-1">*</span>
          : <span className="text-zinc-400 ml-1 font-normal">(optional)</span>}
      </label>
      <div
        className={`relative rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
          dragging
            ? 'border-indigo-400 bg-indigo-50'
            : value
            ? 'border-indigo-400 bg-indigo-50/60'
            : 'border-black/[.12] hover:border-indigo-400 hover:bg-indigo-50/40'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <div className="flex flex-col items-center justify-center py-7 px-4 text-center">
          {value ? (
            <>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 mb-2">
                <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm font-medium text-indigo-600">{value.name}</p>
              <p className="text-xs text-zinc-400 mt-0.5">{(value.size / 1024 / 1024).toFixed(2)} MB — click to replace</p>
            </>
          ) : (
            <>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 mb-2">
                <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-sm text-zinc-500">
                <span className="text-indigo-500 font-medium">Click to upload</span> or drag &amp; drop
              </p>
              <p className="text-xs text-zinc-400 mt-0.5">PDF or DOCX, up to 50 MB</p>
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
  const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  const ext = '.' + file.name.split('.').pop()?.toLowerCase()
  return allowed.includes(file.type) || ['.pdf', '.doc', '.docx'].includes(ext)
}

// ── Section Card ──────────────────────────────────────────────────────────────

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-black/[.08] bg-white p-6 shadow-[0_2px_20px_rgba(0,0,0,.06)] sm:p-7">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-5 w-1 rounded-full bg-indigo-500" />
        <h2 className="text-base font-semibold text-zinc-900 sm:text-lg">{title}</h2>
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  )
}

// ── Field helpers ─────────────────────────────────────────────────────────────

const inputClass =
  'w-full rounded-xl border border-black/[.10] bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10'

const textareaClass = inputClass + ' resize-none'

function FieldLabel({ children, optional }: { children: React.ReactNode; optional?: boolean }) {
  return (
    <label className="block text-sm font-medium text-zinc-700 mb-1.5">
      {children}
      {!optional && <span className="text-indigo-500 ml-1">*</span>}
      {optional && <span className="text-zinc-400 ml-1 font-normal">(optional)</span>}
    </label>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const [form, setForm] = useState<FormData>({
    full_name: '',
    business_name: '',
    website_url: '',
    phone: '',
    email: '',
    staff_languages: '',
    additional_notes: '',
    excluded_treatments: '',
  })

  const [squareConnected, setSquareConnected] = useState(false)
  const [squareError, setSquareError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const [files, setFiles] = useState<Record<string, FileSlot>>({
    services:  { file: null, dragging: false },
    policies:  { file: null, dragging: false },
    pricing:   { file: null, dragging: false },
    aftercare: { file: null, dragging: false },
    other:     { file: null, dragging: false },
  })

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    // Restore form data saved before Square OAuth redirect
    const saved = sessionStorage.getItem('onboarding_form')
    if (saved) {
      try { setForm((f) => ({ ...f, ...JSON.parse(saved) })) } catch {}
      sessionStorage.removeItem('onboarding_form')
    }

    const email = params.get('email')
    if (email) setForm((f) => ({ ...f, email }))

    if (params.get('square_connected') === 'true') {
      setSquareConnected(true)
      window.history.replaceState({}, '', '/onboarding')
    }

    const squareError = params.get('square_error')
    if (squareError) {
      setError(`Square connection failed: ${squareError}. Please try again.`)
      window.history.replaceState({}, '', '/onboarding')
    }
  }, [])

  const handleSquareConnect = () => {
    if (!form.business_name.trim()) {
      setSquareError('Please enter your business name before connecting Square.')
      return
    }
    setSquareError(null)
    sessionStorage.setItem('onboarding_form', JSON.stringify(form))
    const params = new URLSearchParams({ business_name: form.business_name.trim() })
    window.location.href = `https://n8n.srv1150282.hstgr.cloud/webhook/square-auth?${params}`
  }

  const handleSquareDisconnect = () => {
    setSquareConnected(false)
  }

  const setFile     = (key: string, file: File | null) => setFiles((p) => ({ ...p, [key]: { ...p[key], file } }))
  const setDragging = (key: string, d: boolean)        => setFiles((p) => ({ ...p, [key]: { ...p[key], dragging: d } }))
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (fieldErrors[name]) setFieldErrors((fe) => { const n = { ...fe }; delete n[name]; return n })
  }

  const uploadFile = async (file: File, businessName: string, prefix: string): Promise<string> => {
    const safe = businessName.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-')
    const ext  = file.name.split('.').pop()
    const path = `${safe}/${prefix}-${Date.now()}.${ext}`

    const { error } = await getSupabase().storage.from('client-files').upload(path, file, { upsert: true })
    if (error) throw new Error(`Upload failed for ${prefix}: ${error.message}`)

    return getSupabase().storage.from('client-files').getPublicUrl(path).data.publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Collect all field-level errors up front
    const errors: Record<string, string> = {}
    if (!form.full_name.trim())     errors.full_name     = 'Full name is required.'
    if (!form.business_name.trim()) errors.business_name = 'Business name is required.'
    if (!form.website_url.trim())   errors.website_url   = 'Website URL is required.'
    if (!form.phone.trim())         errors.phone         = 'Phone number is required.'
    if (!form.email.trim())         errors.email         = 'Email address is required.'
    if (!squareConnected)           errors.square        = 'Please connect your Square account.'
    if (!files.services.file)       errors.services      = 'Please upload your Services Menu.'
    if (!files.policies.file)       errors.policies      = 'Please upload your Cancellation & Rescheduling Policy.'

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      const firstKey = Object.keys(errors)[0]
      document.getElementById(`field-${firstKey}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setFieldErrors({})
    setSubmitting(true)
    try {
      const biz = form.business_name
      const uploads: Array<Promise<[string, string]>> = [
        uploadFile(files.services.file!,  biz, 'services').then((u) => ['services_file_url', u]),
        uploadFile(files.policies.file!, biz,  'policies').then((u) => ['policies_file_url', u]),
      ]
      if (files.pricing.file)   uploads.push(uploadFile(files.pricing.file,   biz, 'pricing')  .then((u) => ['pricing_file_url',  u]))
      if (files.aftercare.file) uploads.push(uploadFile(files.aftercare.file, biz, 'aftercare').then((u) => ['aftercare_file_url', u]))
      if (files.other.file)     uploads.push(uploadFile(files.other.file,     biz, 'other')    .then((u) => ['other_file_url',    u]))

      const fileUrls = Object.fromEntries(await Promise.all(uploads))

      const { error: insertError } = await getSupabase().from('clients').insert([{
        full_name:           form.full_name.trim(),
        business_name:       form.business_name.trim(),
        email:               form.email.trim(),
        phone:               form.phone.trim(),
        website_url:         form.website_url.trim(),
staff_languages:     form.staff_languages.trim()     || null,
        additional_notes:    form.additional_notes.trim()    || null,
        excluded_treatments: form.excluded_treatments.trim() || null,
        onboarding_status:   'submitted',
        ...fileUrls,
      }])

      if (insertError) throw new Error(`Could not save your information: ${insertError.message}`)

      setSuccess(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Success screen ──────────────────────────────────────────────────────────

  if (success) {
    const firstName = form.full_name.trim().split(' ')[0]
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-white px-6 py-16" style={{ fontFamily: "'Poppins', sans-serif" }}>
        <Image src="/apivo-logo.png" alt="Apivo" width={130} height={40} className="mb-10" />
        <div className="text-center max-w-lg">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 border border-indigo-100 mx-auto mb-6">
            <svg className="w-7 h-7 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl mb-3">
            You&apos;re all set, {firstName}.
          </h1>
          <p className="text-zinc-500 text-base leading-relaxed">
            Check your email for next steps — we&apos;ll see you at your kickoff call.
          </p>
        </div>
      </main>
    )
  }

  // ── Form ────────────────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-[#fafafa]" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Header */}
      <div className="bg-white border-b border-black/[.06]">
        <div className="flex flex-col items-center pt-12 pb-10 px-6">
          <Image src="/apivo-logo.png" alt="Apivo" width={130} height={40} className="mb-8" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-900 text-center leading-tight mb-3">
            Welcome to Apivo.{' '}
            <span className="text-indigo-500">Let&apos;s get you live.</span>
          </h1>
          <p className="text-zinc-500 text-center max-w-xl text-sm sm:text-base leading-relaxed">
            Fill out the form below and book your kickoff call. We&apos;ll have your AI
            receptionist live within 48 hours.
          </p>
        </div>
      </div>

      {/* Form body */}
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-5">

        {/* Section 1 — Your Business */}
        <SectionCard title="Your Business">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div id="field-full_name">
              <FieldLabel>Full Name</FieldLabel>
              <input type="text" name="full_name" value={form.full_name} onChange={handleChange} placeholder="Jane Smith" className={inputClass + (fieldErrors.full_name ? ' border-red-400' : '')} />
              {fieldErrors.full_name && <p className="mt-1 text-xs text-red-600">{fieldErrors.full_name}</p>}
            </div>
            <div id="field-business_name">
              <FieldLabel>Med Spa Business Name</FieldLabel>
              <input type="text" name="business_name" value={form.business_name} onChange={handleChange} placeholder="Glow Aesthetics" className={inputClass + (fieldErrors.business_name ? ' border-red-400' : '')} />
              {fieldErrors.business_name && <p className="mt-1 text-xs text-red-600">{fieldErrors.business_name}</p>}
            </div>
          </div>
          <div id="field-website_url">
            <FieldLabel>Website URL</FieldLabel>
            <input type="url" name="website_url" value={form.website_url} onChange={handleChange} placeholder="https://yourspa.com" className={inputClass + (fieldErrors.website_url ? ' border-red-400' : '')} />
            {fieldErrors.website_url && <p className="mt-1 text-xs text-red-600">{fieldErrors.website_url}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div id="field-phone">
              <FieldLabel>Best Phone Number</FieldLabel>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" className={inputClass + (fieldErrors.phone ? ' border-red-400' : '')} />
              {fieldErrors.phone && <p className="mt-1 text-xs text-red-600">{fieldErrors.phone}</p>}
            </div>
            <div id="field-email">
              <FieldLabel>Email Address</FieldLabel>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="jane@yourspa.com" className={inputClass + (fieldErrors.email ? ' border-red-400' : '')} />
              {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
            </div>
          </div>
        </SectionCard>

        {/* Section 2 — Square Account */}
        <div id="field-square">
          <SectionCard title="Your Square Account">
            <SquareConnectSection
              connected={squareConnected}
              error={squareError}
              onConnect={handleSquareConnect}
              onDisconnect={handleSquareDisconnect}
            />
            {fieldErrors.square && <p className="mt-1 text-xs text-red-600">{fieldErrors.square}</p>}
          </SectionCard>
        </div>

        {/* Section 3 — Knowledge Base Files */}
        <SectionCard title="Knowledge Base Files">
          <div id="field-services">
            <FileUploadArea id="services" label="Your Services Menu" required value={files.services.file} dragging={files.services.dragging} onChange={(f) => { setFile('services', f); setFieldErrors((fe) => { const n = {...fe}; delete n.services; return n }) }} onDragChange={(d) => setDragging('services', d)} />
            {fieldErrors.services && <p className="mt-1 text-xs text-red-600">{fieldErrors.services}</p>}
          </div>
          <div id="field-policies">
            <FileUploadArea id="policies" label="Cancellation & Rescheduling Policy" required value={files.policies.file} dragging={files.policies.dragging} onChange={(f) => { setFile('policies', f); setFieldErrors((fe) => { const n = {...fe}; delete n.policies; return n }) }} onDragChange={(d) => setDragging('policies', d)} />
            {fieldErrors.policies && <p className="mt-1 text-xs text-red-600">{fieldErrors.policies}</p>}
          </div>
          <FileUploadArea id="pricing"   label="Pricing List (if separate from services menu)"                     value={files.pricing.file}   dragging={files.pricing.dragging}   onChange={(f) => setFile('pricing',   f)} onDragChange={(d) => setDragging('pricing',   d)} />
          <FileUploadArea id="aftercare" label="Aftercare Instructions"                                            value={files.aftercare.file} dragging={files.aftercare.dragging} onChange={(f) => setFile('aftercare', f)} onDragChange={(d) => setDragging('aftercare', d)} />
          <FileUploadArea id="other"     label="Any other material you'd want your front desk to reference (sensitive skin concerns, skin prep, shaving, acne, etc.)" value={files.other.file} dragging={files.other.dragging} onChange={(f) => setFile('other', f)} onDragChange={(d) => setDragging('other', d)} />
        </SectionCard>

        {/* Section 4 — Additional Info */}
        <SectionCard title="Additional Info">
          <div>
            <FieldLabel optional>Languages spoken by staff</FieldLabel>
            <input type="text" name="staff_languages" value={form.staff_languages} onChange={handleChange} placeholder="English, Spanish, Mandarin…" className={inputClass} />
            <p className="mt-1.5 text-xs text-zinc-400">Apivo supports 29+ languages. Let us know your primary client languages.</p>
          </div>
          <div>
            <FieldLabel optional>Anything Apivo should know about your practice</FieldLabel>
            <textarea name="additional_notes" value={form.additional_notes} onChange={handleChange} rows={4} placeholder="Tell us about your practice, clientele, or anything else you'd like your AI receptionist to know…" className={textareaClass} />
          </div>
          <div>
            <FieldLabel optional>Treatments you do NOT want Apivo to discuss</FieldLabel>
            <textarea name="excluded_treatments" value={form.excluded_treatments} onChange={handleChange} rows={3} placeholder="e.g. injectable medications, off-label procedures…" className={textareaClass} />
          </div>
        </SectionCard>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-indigo-500 hover:bg-indigo-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-full py-3.5 transition-colors flex items-center justify-center gap-2.5 shadow-[0_2px_20px_rgba(99,102,241,.25)]"
        >
          {submitting ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Uploading &amp; Saving…
            </>
          ) : (
            'Submit & Book My Kickoff Call'
          )}
        </button>

        <p className="text-center text-xs text-zinc-400 pb-6">
          Your information is kept private and only used to set up your Apivo account.
        </p>
      </form>
    </main>
  )
}
