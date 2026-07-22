// netlify/functions/chat.js
// Serverless function: the browser never sees your API key.
// Netlify reads GEMINI_API_KEY from your site's environment variables.
// Uses Google AI Studio's Gemini API (generativelanguage.googleapis.com).

const { SHOP_CONFIG } = require("../../shop-config");

function buildSystemPrompt() {
  const menuLines = SHOP_CONFIG.menu
    .map((m) => `- ${m.item}: ${m.price}${m.note ? " (" + m.note + ")" : ""}`)
    .join("\n");

  const hoursLines = Object.entries(SHOP_CONFIG.hours)
    .map(([day, time]) => `- ${day}: ${time}`)
    .join("\n");

  return `You are the FAQ assistant for "${SHOP_CONFIG.name}", a café/shop in Penang, Malaysia. ${SHOP_CONFIG.tagline}

Answer customer questions using ONLY the information below. Be warm, brief, and helpful — like a friendly staff member, not a corporate bot. Use plain sentences, no bullet-point walls unless listing the menu.

HOURS:
${hoursLines}

LOCATION:
${SHOP_CONFIG.location}

CONTACT:
Phone/WhatsApp: ${SHOP_CONFIG.contact.whatsapp}

MENU:
${menuLines}

OTHER FACTS:
${SHOP_CONFIG.extraFacts.map((f) => "- " + f).join("\n")}

RULES:
- If asked something not covered above (e.g. "do you have a table for 10 tonight", something you don't have data for), say you're not sure and suggest they call/WhatsApp the number above — do NOT make up an answer.
- Keep replies short: 1-3 sentences unless listing menu items.
- If asked who you are, say you're ${SHOP_CONFIG.name}'s assistant, here to help with hours, menu, and location questions.`;
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error:
          "No API key configured. Add GEMINI_API_KEY in Netlify Site settings → Environment variables."
      })
    };
  }

  let userMessage, history;
  try {
    const body = JSON.parse(event.body);
    userMessage = body.message;
    history = Array.isArray(body.history) ? body.history : [];
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid request body" }) };
  }

  if (!userMessage || typeof userMessage !== "string") {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing message" }) };
  }

  // Keep history short to control token cost per request
  const trimmedHistory = history.slice(-8);

  // Gemini uses "user" / "model" roles (not "assistant"), and wraps text in parts[]
  const contents = [
    ...trimmedHistory.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    })),
    { role: "user", parts: [{ text: userMessage }] }
  ];

  const model = "gemini-flash-lite-latest"; // Google's auto-updating alias — always points to the current stable Flash-Lite model, avoiding breakage when Google renames/retires versions

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: buildSystemPrompt() }]
          },
          contents,
          generationConfig: {
            maxOutputTokens: 400
          }
        })
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "Gemini API error", detail: errText })
      };
    }

    const data = await response.json();
    const reply =
      data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("\n") ||
      "Sorry, I couldn't generate a reply.";

    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error", detail: String(err) })
    };
  }
};


