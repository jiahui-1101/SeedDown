# SeedDown Cloud Deployment Guide

This guide deploys SeedDown as two cloud apps:

- Backend API: Render Web Service from `render.yaml`
- Frontend UI: Vercel Vite static app from `frontend`

Dashboard deployment is the recommended path. CLI deployment is optional after you install and log in to the CLIs.

## 1. Confirm The Git Repo

From the repo root:

```powershell
cd C:\Users\User\OneDrive\Documents\utmxhackathon_improved\SeedDown
git status --short
git remote -v
git branch --show-current
```

Current expected state:

```text
remote: origin https://github.com/jiahui-1101/seeddown_improve.git
branch: main
```

If the working tree is clean, push the latest commit before deploying:

```powershell
git push origin main
```

Never commit `.env` files, Firebase service account JSON files, or real API keys.

## 2. Deploy Backend On Render

1. Open Render Dashboard.
2. Choose New -> Blueprint.
3. Connect the GitHub repo that contains this file at repo root:

```text
render.yaml
```

4. Render should create one web service:

```text
Name: seeddown-backend
Runtime: Node
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

5. In the Render environment variable screen, fill these values:

```text
NODE_ENV=production
JWT_SECRET=<long-random-secret>
FIREBASE_PROJECT_ID=<your-firebase-project-id>
FIREBASE_SERVICE_ACCOUNT_JSON=<entire-firebase-admin-service-account-json>
GROQ_API_KEY=<optional-for-groq-ai>
GEMINI_API_KEY=<optional-ai-fallback>
GEMINI_API_KEY_2=<optional-ai-fallback>
DA3_SERVICE_URL=<optional-external-disease-or-3d-service-url>
```

`DA3_SERVICE_URL` is optional. Leave it empty unless you deployed that separate service.

6. Get `FIREBASE_SERVICE_ACCOUNT_JSON` from Firebase:

```text
Firebase Console
-> Project settings
-> Service accounts
-> Generate new private key
```

Paste the complete downloaded JSON as the Render variable value. Do not upload or commit the JSON file to this repo.

7. Click deploy and wait for the service to become live.

8. Test the backend root URL:

```text
https://<your-render-service>.onrender.com/
```

Expected response:

```json
{"status":"SeedDown API running"}
```

Save this Render URL. You need it for Vercel as `VITE_API_BASE`.

## 3. Deploy Frontend On Vercel

1. Open Vercel Dashboard.
2. Choose Add New Project.
3. Import the same GitHub repo.
4. Set Root Directory to:

```text
frontend
```

5. Confirm build settings:

```text
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
```

The project already includes `frontend/vercel.json` with the build command, output directory, and SPA rewrite rule.

6. Add this environment variable for Production and Preview:

```text
VITE_API_BASE=https://<your-render-service>.onrender.com
```

Do not add a trailing slash.

7. Deploy. If you added or changed `VITE_API_BASE` after the first deployment, redeploy because Vite reads this value at build time.

8. Open the Vercel site and check:

- The page is not blank.
- Login/register pages load.
- Browser DevTools -> Network shows API calls going to the Render URL.

If Firebase login rejects the domain, add your Vercel domain in:

```text
Firebase Console
-> Authentication
-> Settings
-> Authorized domains
```

## 4. Optional CLI Path

Use CLI only after the Dashboard deployment path is understood.

### Vercel CLI

```powershell
pnpm i -g vercel
vercel login
vercel --cwd frontend
vercel --cwd frontend --prod
```

If you use npm instead of pnpm:

```powershell
npm i -g vercel
```

### Render CLI

Install the Render CLI from the official Render CLI documentation, then:

```powershell
render login
render blueprints validate render.yaml
render services
render deploys create <SERVICE_ID> --wait
```

## 5. Final Verification Checklist

- Render deploy is live.
- Render root URL returns `SeedDown API running`.
- Vercel deploy is live.
- Vercel has `VITE_API_BASE` set to the Render backend URL.
- Browser network requests for `/api/...` go to Render.
- Firebase Auth authorized domains include the Vercel domain.
- AI pages are tested only after `GROQ_API_KEY`, `GEMINI_API_KEY`, or `GEMINI_API_KEY_2` are configured.
- Disease or 3D proxy features are tested only after `DA3_SERVICE_URL` is configured.

## Troubleshooting

### Render deploy fails during startup

Check Render logs for Firebase credential errors. The most common causes are:

- `FIREBASE_PROJECT_ID` does not match the service account project.
- `FIREBASE_SERVICE_ACCOUNT_JSON` was pasted incompletely.
- Private key line breaks were modified manually.

### Vercel site calls the wrong backend

Make sure `VITE_API_BASE` is set in Vercel and then redeploy. Vite injects `VITE_*` variables during build.

### Frontend routes return 404 on refresh

Confirm Vercel is using `frontend` as the project root and that `frontend/vercel.json` is included in the deployed project.

### API works locally but not from Vercel

Open Browser DevTools -> Network and inspect the request URL. It should start with:

```text
https://<your-render-service>.onrender.com/api/
```

The backend currently allows cross-origin requests with Express CORS middleware, so a wrong `VITE_API_BASE` is usually the first thing to check.
