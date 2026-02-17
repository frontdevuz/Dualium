# Dualium

Dualium is a bilingual (`uz` / `en`) educational platform for learning Ancient Eastern and Western philosophy through structured content and internally generated quizzes.

## Stack

- Vite + React + TypeScript
- react-router-dom v6
- TailwindCSS
- Framer Motion
- TanStack Query
- react-hook-form + zod
- react-i18next
- react-markdown + remark-gfm
- react-helmet-async
- localStorage quiz history

## Routes

- `/` Home
- `/learn` Learn library
- `/learn/:slug` Article detail
- `/search` Global search
- `/philosophers` Philosopher directory
- `/philosophers/:slug` Philosopher detail
- `/timeline` Interactive timeline
- `/quiz` Quiz setup + quiz session
- `/quiz/result` Quiz result + review

## Project Structure

```txt
src/
  components/
  context/
  data/
  i18n/
  lib/
  routes/
  styles/
```

## Local Development

```bash
yarn
```

```bash
yarn dev
```

`yarn dev` in this project also serves local API routes (`/api/chat`, `/api/feedback`) through Vite middleware, so quiz AI and feedback flows work in development.

```bash
yarn build
```

```bash
yarn preview
```

## Vercel

The project includes `vercel.json` SPA rewrites and is ready to deploy on Vercel.

Set environment variable in Vercel:

```env
GROQ_API_KEY=your_groq_key_here
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_target_chat_id
```

Security note:
- Never put `GROQ_API_KEY` in Vite env files (`VITE_*`) or frontend code.
- Frontend requests must go to `/api/chat` only.
- Keep Telegram credentials server-side only (`/api/feedback`), not in frontend code.
