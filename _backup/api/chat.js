// /api/chat.js — Vercel Serverless Function
// Proxies text messages to Vapi's Chat REST API.
// VAPI_PRIVATE_KEY is set as an environment variable in Vercel so the key
// is never exposed to the browser.

const VAPI_CHAT_URL = 'https://api.vapi.ai/chat';
const ASSISTANT_ID  = 'a1471688-687e-407e-a8ce-456bce6bdc0e';

export default async function handler(req, res) {
  // Only accept POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userMessage, previousChatId } = req.body ?? {};

  if (!userMessage || typeof userMessage !== 'string' || !userMessage.trim()) {
    return res.status(400).json({ error: 'userMessage is required' });
  }

  const body = {
    assistantId: ASSISTANT_ID,
    input: [{ role: 'user', content: userMessage.trim() }],
  };

  if (previousChatId && typeof previousChatId === 'string') {
    body.previousChatId = previousChatId;
  }

  let vapiRes;
  try {
    vapiRes = await fetch(VAPI_CHAT_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.VAPI_PRIVATE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  } catch (networkErr) {
    console.error('Vapi network error:', networkErr);
    return res.status(502).json({ error: 'Could not reach Vapi API' });
  }

  if (!vapiRes.ok) {
    const details = await vapiRes.text().catch(() => '');
    console.error(`Vapi ${vapiRes.status}:`, details);
    return res.status(vapiRes.status).json({ error: 'Vapi API error', details });
  }

  const data = await vapiRes.json();

  // Extract the assistant's reply.
  // When tool calls happen (lookupClient, checkAvailability, etc.) the output
  // array contains multiple assistant messages: a pre-tool-call message AND the
  // final answer. We always want the LAST assistant message with real content.
  const assistantMsgs = (data.output ?? data.messages ?? [])
    .filter(m => m.role === 'assistant' && m.content && m.content.trim());

  const reply = assistantMsgs.length
    ? assistantMsgs[assistantMsgs.length - 1].content
    : "I'm sorry, I couldn't process that request. Please try again.";

  return res.status(200).json({ reply, chatId: data.id ?? null });
}
