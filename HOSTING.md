# AJTech hosting

AJTech is a Vite single-page frontend with an Express API. The repository is
ready for Replit and for a single-project Vercel deployment: `api/index.ts`
adapts the existing Express API into a Vercel Function while the Vite build
serves the frontend. Netlify can host the frontend with the included config,
but its API needs a separate Node-capable deployment.

## Vercel full-stack deployment

1. Import the GitHub repository into Vercel.
2. Keep the Vercel **Root Directory** at the repository root. The root
   `vercel.json` runs the workspace build and publishes
   `artifacts/ajtech/dist/public`.
3. Set the Vercel **Install Command** to
   `pnpm install --frozen-lockfile` if Vercel does not detect it automatically.
4. Add the production environment variables listed below. Leave
   `VITE_API_URL` empty because the API is served from the same Vercel domain.
5. Deploy from the `main` branch. Vercel should detect `api/index.ts` as the
   API Function and the Vite output as the frontend.

The expected endpoints are:

- `https://your-project.vercel.app/` for the website
- `https://your-project.vercel.app/api/healthz` for the API health check
- `https://your-project.vercel.app/admin/login` for the admin area

## Netlify frontend

1. Import this repository and keep the repository root as the project root.
2. The included `netlify.toml` supplies the build command and SPA fallback.
3. Set `VITE_API_URL` to the public URL of a separately deployed API, without
   a trailing slash.
4. On the API host, set `CORS_ORIGIN` to the exact Netlify site origin.

## Required Vercel API variables

Set these in Vercel under **Settings → Environment Variables** for Preview and
Production as appropriate:

- `DATABASE_URL` — PostgreSQL connection string, such as the Supabase database
  connection string.
- `ADMIN_PASSWORD` — strong production admin password.
- `SESSION_SECRET` — long random session-signing secret.
- `CORS_ORIGIN` — the exact Vercel origin, for example
  `https://your-project.vercel.app`.
- `VITE_API_URL` — leave empty for the single-project Vercel setup. Set it only
  when the API is hosted on another domain.

Vercel applies changed environment variables only to new deployments, so
redeploy after changing them. Never commit their values to GitHub.

## Replit

Use the existing managed web and API services. The path-routed setup keeps
frontend requests on `/api`, so `VITE_API_URL` can remain empty.

## Production checklist

- Confirm the public home page and every deep link load after a hard refresh.
- Submit the contact form and confirm the message appears in the admin inbox.
- Sign in to `/admin/login` using the production `ADMIN_PASSWORD`.
- Confirm the API health endpoint responds at `/api/healthz`.
- Add a custom domain only after the first successful deployment.