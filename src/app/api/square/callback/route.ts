import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

const SQUARE_TOKEN_URL = 'https://connect.squareup.com/oauth2/token'
const SQUARE_LOCATIONS_URL = 'https://connect.squareup.com/v2/locations'
const REDIRECT_URI = 'https://apivo.ai/api/square/callback'

interface SquareTokenResponse {
  access_token: string
  refresh_token: string
  expires_at: string
  merchant_id: string
  token_type: string
  error?: string
  message?: string
}

interface SquareLocation {
  id: string
  status: string
  name: string
}

interface SquareLocationsResponse {
  locations?: SquareLocation[]
  errors?: Array<{ detail: string }>
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const code  = searchParams.get('code')
  const state = searchParams.get('state')
  const oauthError = searchParams.get('error')

  // Square denied / user cancelled
  if (oauthError) {
    return NextResponse.redirect(
      new URL(`/onboarding?square_error=${encodeURIComponent(oauthError)}`, request.url),
    )
  }

  if (!code) {
    return NextResponse.redirect(new URL('/onboarding?square_error=missing_code', request.url))
  }

  // ── Exchange code for token ────────────────────────────────────────────────
  const tokenRes = await fetch(SQUARE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Square-Version': '2024-01-18' },
    body: JSON.stringify({
      client_id: process.env.SQUARE_APP_ID,
      client_secret: process.env.SQUARE_APP_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: REDIRECT_URI,
    }),
  })

  const tokenData: SquareTokenResponse = await tokenRes.json()

  if (!tokenRes.ok || !tokenData.access_token) {
    const msg = tokenData.message ?? 'token_exchange_failed'
    return NextResponse.redirect(
      new URL(`/onboarding?square_error=${encodeURIComponent(msg)}`, request.url),
    )
  }

  const { access_token, refresh_token, expires_at, merchant_id } = tokenData

  // ── Fetch merchant locations ───────────────────────────────────────────────
  const locRes = await fetch(SQUARE_LOCATIONS_URL, {
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Square-Version': '2024-01-18',
    },
  })

  const locData: SquareLocationsResponse = await locRes.json()
  const activeLocation = locData.locations?.find((l) => l.status === 'ACTIVE') ?? locData.locations?.[0]
  const location_id = activeLocation?.id ?? null

  // ── Persist to Supabase ────────────────────────────────────────────────────
  const { error: upsertError } = await getSupabase()
    .from('square_tokens')
    .upsert(
      {
        merchant_id,
        access_token,
        refresh_token,
        token_expires_at: expires_at,
        location_id,
        status: 'active',
        business_name: '',
      },
      { onConflict: 'merchant_id' },
    )

  if (upsertError) {
    console.error('square_tokens upsert error:', upsertError.message)
    return NextResponse.redirect(
      new URL(`/onboarding?square_error=${encodeURIComponent(upsertError.message)}`, request.url),
    )
  }

  // Pass state back so the client page can validate it against sessionStorage
  const params = new URLSearchParams({
    square_connected: 'true',
    merchant_id,
    ...(state ? { state } : {}),
  })

  return NextResponse.redirect(new URL(`/onboarding?${params}`, request.url))
}
