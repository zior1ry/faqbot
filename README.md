# Kopi & Co — FAQ Bot (Demo)

A café FAQ assistant powered by Google's Gemini API (via Google AI Studio). Answers questions about hours, menu, and location — grounded only in the info you give it in `shop-config.js`, so it won't make things up.

## Files
- `index.html` — the chat widget (frontend)
- `shop-config.js` — **the only file you need to edit** to reuse this for a different shop
- `netlify/functions/chat.js` — serverless function that calls the Claude API (keeps your key hidden from the browser)
- `netlify.toml` — tells Netlify where the function lives

## How to reuse this for a real shop
Open `shop-config.js` and replace the hours, menu, location, and contact info with the real shop's details. Nothing else needs to change — the bot rebuilds its own instructions from this file automatically.

## Deploying (same GitHub + Netlify flow you already use)

1. **Create a new GitHub repo** (e.g. `kopi-faq-bot`) and upload all these files, keeping the folder structure intact (the `netlify/functions/chat.js` path matters — don't flatten it).

2. **Import into Netlify:**
   - Netlify → Add new site → Import an existing project → pick the repo
   - Build settings: leave blank (no build command needed)
   - Deploy

3. **Add your API key:**
   - Get a key from **aistudio.google.com** → "Get API key" (free tier available, no credit card needed to start)
   - In Netlify: Site settings → Environment variables → Add a variable
   - Key: `GEMINI_API_KEY`
   - Value: your key from AI Studio (starts with `AIza`)
   - Save, then **trigger a redeploy** (Deploys tab → Trigger deploy) so the function picks up the new variable
   - **Never paste this key anywhere but here** — not in chat, not committed to GitHub, not in the HTML. Treat it like a password.

4. **Test it:**
   - Open your live Netlify URL
   - Try the suggested questions, or ask "what time do you close on Sunday?"
   - If you get an error mentioning "No API key configured," the environment variable didn't save or you forgot to redeploy after adding it

## Cost note
Uses **`gemini-2.0-flash`** via Google AI Studio — it has a genuinely free tier (with daily rate limits) that's plenty for demoing and light real-world use. If you outgrow the free tier, Google's pricing page shows paid rates; the code doesn't need to change, just the key's billing status.

## Security note
Never put your API key directly in `index.html` or any frontend file — it would be visible to anyone who views the page source. Never paste it into a chat conversation (with Claude or anyone else) either — once typed into a chat, treat that key as exposed and generate a new one. The whole point of the `netlify/functions/chat.js` file is that the key stays server-side, only accessible via the environment variable you set directly in Netlify's dashboard.
