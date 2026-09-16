# Univmar

Coming soon page for UNIVMAR, built with Next.js.

## Run locally

```bash
npm install
npm run dev
```

## Deploy on Vercel (recommended)

Next.js 15 runs reliably on Vercel. Connect the GitHub repo and add environment variables:

- `NEXT_PUBLIC_GA_ID` — GA4 Measurement ID (`G-XXXXXXXXXX`)

Point `universmarbre.com` DNS to Vercel (see Vercel project → Settings → Domains).

## Deploy on Hostinger Node.js

If using Hostinger **Node.js Web Apps** (not static hosting):

| Setting | Value |
|---------|--------|
| Node.js version | **20** |
| Install | `npm ci` or `npm install` |
| Build | `npm run build` |
| Start | `npm run start` |

The build uses Next standalone output and copies `public` plus `.next/static` into `.next/standalone`. This is required for deployed CSS and JS to load from `/_next/static/...`.

Add `NEXT_PUBLIC_GA_ID` in hPanel environment variables, then redeploy. If CSS is missing after deploy, verify that the deployed folder contains `.next/standalone/.next/static/css`. If you still get **503**, check **Deployment logs** and `stderr.log` in the app root — the Node process is not starting (OOM, build failure, or wrong port).

**Tip:** If Vercel already works, point the domain DNS to Vercel and disable the Hostinger Node app to avoid 503 conflicts.
