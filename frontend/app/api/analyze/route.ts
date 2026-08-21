import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { imageUrl, questionnaire } = await req.json()

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 1000,
      messages: [
        {
          role: 'system',
          content: `You are Chael, a skin health assistant specialized in melanin-rich and Black skin.
You provide educational guidance only, never medical diagnoses.
Always frame findings descriptively, not diagnostically.
Never say "you have X condition." Say "we can see X" or "X factors appear strongly linked based on your answers."
Always recommend consulting a dermatologist.
Keep responses warm, clear, and concise.`,
        },
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: imageUrl },
            },
            {
              type: 'text',
              text: `Based on this photo and the following information about the user, provide a skin assessment:

${JSON.stringify(questionnaire, null, 2)}

Respond in this exact JSON format:
{
  "visible_findings": {
    "lesion_type": "describe what you see",
    "severity": "mild | moderate | severe",
    "pih_present": true | false,
    "pih_severity": "mild | moderate | severe | none",
    "location_notes": "describe where lesions appear"
  },
  "contributor_likelihood": [
    { "factor": "hormonal", "likelihood": "high | medium | low", "reason": "brief reason" },
    { "factor": "stress", "likelihood": "high | medium | low", "reason": "brief reason" },
    { "factor": "diet", "likelihood": "high | medium | low", "reason": "brief reason" },
    { "factor": "products", "likelihood": "high | medium | low", "reason": "brief reason" }
  ],
  "guidance": [
    "specific actionable tip 1 for melanin-rich skin",
    "specific actionable tip 2",
    "specific actionable tip 3"
  ],
  "see_derm": true | false,
  "derm_reason": "reason if see_derm is true, else null",
  "chael_message": "warm 2-3 sentence summary in Chael's voice"
}`,
            },
          ],
        },
      ],
    })

    const content = response.choices[0].message.content
    const clean = content?.replace(/```json|```/g, '').trim()
    const raw = JSON.parse(clean!)

    const likelihoodMap: Record<string, "low" | "medium" | "high"> = {
      low: "low",
      medium: "medium",
      high: "high",
    }

    const result = {
      id: `result-${Date.now()}`,
      date: new Date().toISOString(),
      condition: raw.visible_findings?.lesion_type ?? "unclear from photo",
      location: raw.visible_findings?.location_notes ?? "",
      severity: raw.visible_findings?.severity ?? "mild",
      contributors: (raw.contributor_likelihood ?? []).map((c: any) => ({
        label: c.factor,
        level: likelihoodMap[c.likelihood] ?? "low",
      })),
      summary: raw.chael_message ?? "",
      explanation: [raw.chael_message, ...(raw.guidance ?? [])].filter(Boolean).join(" "),
      chael_message: raw.chael_message,
      see_derm: raw.see_derm ?? false,
      derm_reason: raw.derm_reason ?? null,
    }

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json({ success: false, error: 'Analysis failed' }, { status: 500 })
  }
}