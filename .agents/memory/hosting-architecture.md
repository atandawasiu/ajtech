---
name: External hosting architecture
description: How AJTech behaves when its Vite frontend and Express API are hosted on different platforms.
---

The frontend and API can be hosted separately: the frontend uses `VITE_API_URL`, while the API must allow the exact frontend origin through `CORS_ORIGIN`. Production admin cookies must support secure cross-site requests.

**Why:** Vercel and Netlify are a natural fit for the static Vite frontend, but the existing Express API and PostgreSQL connection need a Node-capable host unless a platform adapter is added.

**How to apply:** Keep same-origin Replit routing as the default. For an external frontend, set `VITE_API_URL` at build time and set the API's `CORS_ORIGIN`, `DATABASE_URL`, `ADMIN_PASSWORD`, and `SESSION_SECRET` in the host environment without committing values.