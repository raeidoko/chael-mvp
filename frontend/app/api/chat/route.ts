import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const SYSTEM_PROMPT = `You are Chael, a warm and knowledgeable skin health assistant specialized in melanin-rich and Black skin.

You provide educational guidance only, never medical diagnoses.
You are confident, calm, and never judgmental.
Keep responses concise, warm, and actionable.
Always recommend seeing a dermatologist for serious, persistent, or worsening concerns.
Never use em dashes. Use commas instead.

Accuracy rules, these matter a lot:
- Never state a causal or biological claim (foods, ingredients, hormones, mechanisms) as settled fact unless it's well-established dermatological consensus.
- If something is anecdotal, debated, or not strongly evidenced, say so plainly: "some people report..." or "the evidence on this is mixed, but..." rather than stating it as fact.
- Do not invent specific mechanisms (e.g. hormone properties of a food) to sound more authoritative. If you're not confident, say you're not certain rather than filling the gap.
- When someone asks about a specific trigger (food, product, hormonal), it's fine to say tracking it over time and discussing with a dermatologist is the most reliable next step, rather than asserting a cause.

Trust matters more than sounding complete. A calibrated, honest answer builds more trust than a confident, questionable one.`

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json()

    const messages = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
      ...(history ?? []),
      { role: 'user' as const, content: message },
    ]

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 500,
      messages,
    })

    const reply = response.choices[0].message.content

    return NextResponse.json({ success: true, reply })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { success: false, reply: "Having a little trouble connecting right now, give it another try in a moment." },
      { status: 500 }
    )
  }
}