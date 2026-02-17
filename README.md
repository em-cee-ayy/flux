# Flux Task Management App

  This is a code bundle for Flux Task Management App. The original project is available at https://www.figma.com/design/QcMzmv337rphy0BANnjGCt/Flux-Task-Management-App.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
## AI integration (privacy-first)

This UI expects a backend endpoint:

- `POST /api/analyze`
- body: `{ "tasks": string, "vibe": string }`
- returns the JSON shape described in `src/app/lib/ai.ts` (`AiResponse`)

If the endpoint is not available, the app automatically falls back to an on-device mock response so you can keep building the UI.

**Why this approach?** It keeps provider API keys off the client and lets you later add encryption, logging controls, and vendor swaps server-side.
