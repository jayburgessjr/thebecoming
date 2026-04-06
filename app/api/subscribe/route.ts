import { NextResponse } from 'next/server'

import { createServerSupabaseClient } from '@/lib/supabase-server'

type SubscribePayload = {
  firstName?: string
  lastName?: string
  email?: string
}

export async function POST(request: Request) {
  let payload: SubscribePayload

  try {
    payload = (await request.json()) as SubscribePayload
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const firstName = payload.firstName?.trim()
  const lastName = payload.lastName?.trim() ?? ''
  const email = payload.email?.trim().toLowerCase()

  if (!firstName) {
    return NextResponse.json({ error: 'Please enter your name' }, { status: 400 })
  }

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Please enter a valid email' }, { status: 400 })
  }

  try {
    const supabase = createServerSupabaseClient()
    const { error } = await supabase.from('subscribers').insert({
      first_name: firstName,
      last_name: lastName,
      email,
    })

    if (error && error.code !== '23505') {
      return NextResponse.json(
        { error: 'Unable to save your access right now.' },
        { status: 500 },
      )
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json(
      { error: 'Missing Supabase environment variables.' },
      { status: 500 },
    )
  }
}
