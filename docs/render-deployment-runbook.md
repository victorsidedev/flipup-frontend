# Frontend deployment runbook — Render

Last reviewed: September 12, 2026  
Application: resale-frontend · React/Vite · Render Static Site  
Scope: frontend deployments. Authentication is outside the current MVP.

## Deployment details

Fill these in once and update them when infrastructure changes. Example URLs below are placeholders.

| Field                            | Value      |
| -------------------------------- | ---------- |
| Repository URL                   | To fill in |
| Production branch                | To fill in |
| Render service / dashboard link  | To fill in |
| Frontend URL                     | To fill in |
| Production API base URL          | To fill in |
| Backend service / dashboard link | To fill in |
| Deployment owner                 | To fill in |
| Auto-deploy enabled?             | To fill in |

## 1. One-time Render setup

Create a **Static Site**, connect the repository, and select the production branch.

| Setting           | Value                                                   |
| ----------------- | ------------------------------------------------------- |
| Root directory    | Leave blank when package.json is at the repository root |
| Build command     | `npm ci && npm run build`                               |
| Publish directory | `dist`                                                  |
| Start command     | None — static sites serve built files                   |

`npm run dev` is only for local development. Render serves the output of `npm run build`.

In **Environment**, configure:

| Key                 | Value                                           |
| ------------------- | ----------------------------------------------- |
| `VITE_API_BASE_URL` | Actual HTTPS production backend base URL        |
| `NODE_VERSION`      | `22.22.1` — version tested with this repository |

If the backend serves `/purchases`, use `https://your-backend.onrender.com`.
If it serves `/api/purchases`, use `https://your-backend.onrender.com/api`.
Do not include `/purchases` itself in the base URL. Trailing slashes are removed by the app.

Do not set `API_PROXY_TARGET` for Render: it controls only the local Vite proxy.
Do not use `/api` as the production base unless a separate, explicit same-origin API proxy has been configured.

Render can install dependencies automatically. Optionally set `SKIP_INSTALL_DEPS=true` to avoid that extra installation because the build command already runs `npm ci`. [Render static sites](https://render.com/docs/static-sites)

In **Redirects/Rewrites**, add:

| Source | Destination   | Action  |
| ------ | ------------- | ------- |
| `/*`   | `/index.html` | Rewrite |

This lets React Router handle direct links and refreshes such as `/inventory`. Existing static assets remain served normally. [Render routing documentation](https://render.com/docs/redirects-rewrites)

## 2. Backend CORS prerequisite

Different frontend and backend hostnames are different origins, even when both are hosted on Render.

Configure CORS on the backend to allow:

- The exact frontend origin, for example `https://your-frontend.onrender.com`, with no path or trailing slash.
- Methods used by the app: `GET`, `POST`, `PUT`, and `DELETE`.
- The `Content-Type` request header.
- `OPTIONS` preflight handling, as required by the backend framework.

Add staging or custom-domain origins separately when used. Redeploy the backend after changing its configuration. The frontend currently sends no authentication tokens and does not opt in to cross-origin cookies.

## 3. Before each deployment

- [ ] Confirm the target branch, frontend service, and backend URL.
- [ ] Review `git status` and `git diff`; include intended new files in the commit.
- [ ] Ensure `package-lock.json` is committed and matches `package.json`.
- [ ] Run the checks below from the repository root.
- [ ] Confirm any required backend changes are deployed and compatible.
- [ ] Record the current successful Render deployment for rollback.

```sh
npm ci
npm run lint
npm test
```

Create an ignored `.env.production.local` file for a local production build:

```dotenv
VITE_API_BASE_URL=https://your-backend.onrender.com
```

Replace the example URL, then run:

```sh
npm run build
npm run preview
```

Open the preview URL printed by Vite and visit `/inventory`. Preview uses the configured backend directly; it does not run the development API proxy. Browser checks against preview require the backend to allow the preview origin too. Use designated test records for write operations.

Unit tests mock API requests, so passing tests do not prove backend connectivity or CORS works.

## 4. Deploy

1. Commit the reviewed changes and push them to the branch connected to Render.
2. If auto-deploy is enabled, watch the triggered deployment. Otherwise use **Manual Deploy → Deploy latest commit**.
3. Confirm Render is deploying the intended commit.
4. Check the build log for successful dependency installation and Vite build output.
5. Wait for Render to report the deployment is live.
6. Complete the verification checklist below before marking the deployment successful.

Render supports automatic and manual deployments. [Render deployment documentation](https://render.com/docs/deploys)

### When changing an API URL

Update `VITE_API_BASE_URL` in Render **Environment**, then choose **Save, rebuild, and deploy**. Vite embeds this value into JavaScript at build time; serving an existing build will retain its previous API URL. Local `.env.*.local` files are ignored by Git and do not configure Render. Never put secrets in browser-visible `VITE_*` variables. [Render environment settings](https://render.com/docs/configure-environment-variables)

## 5. Verify the live deployment

- [ ] Open the frontend `/inventory` URL in a fresh browser tab.
- [ ] Refresh `/inventory` directly; it should still load.
- [ ] In DevTools → Network, confirm requests target the correct HTTPS backend and path prefix.
- [ ] Confirm inventory loads without CORS errors or failed requests.
- [ ] Create a clearly labeled test purchase and item; refresh and confirm persistence.
- [ ] Edit the test purchase and item; confirm the changes persist.
- [ ] Record a sale and refund it; verify the resulting status.
- [ ] Delete only the designated test item and purchase; confirm removal.
- [ ] Check desktop and mobile navigation.
- [ ] Check DevTools Console for uncaught errors.
- [ ] Record the commit, deployment URL, verification result, and any follow-up work.

As of this review, `/` redirects to `/overview`, and Overview and Settings render empty content. Use `/inventory` for the functional smoke test until those pages are implemented or the default route changes.

## 6. Troubleshooting

| Symptom                                                  | Check / resolution                                                                                                                          |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Build says to set `VITE_API_BASE_URL`                    | Add the variable to the frontend Render service and rebuild.                                                                                |
| Build cannot find an imported file                       | Confirm it was committed and pushed; check filename capitalization on Linux.                                                                |
| `npm ci` fails                                           | Read the installation error; check lockfile consistency and Node version.                                                                   |
| `/inventory` returns a hosting 404 on refresh            | Verify the `/*` → `/index.html` rule uses Rewrite.                                                                                          |
| API response is HTML or reports an unexpected JSON token | Inspect the request URL. `/api` may be hitting the static frontend and receiving index.html. Set the absolute backend URL and rebuild.      |
| API returns 404                                          | Check whether the base URL needs `/api`; avoid duplicating or omitting the prefix.                                                          |
| CORS header missing with status 200                      | The server responded, but the browser cannot expose the response. Fix backend CORS for the actual frontend origin and redeploy the backend. |
| GET works but saves/deletes fail                         | Inspect the OPTIONS preflight and allow the method and Content-Type header on the backend.                                                  |
| HTTP backend blocked from HTTPS frontend                 | Configure an HTTPS backend URL and rebuild.                                                                                                 |
| Old API URL is still used                                | Confirm the correct Render service was edited and a new build ran; then refresh the browser.                                                |
| Blank content at `/overview` or `/settings`              | These are currently empty pages; check `/inventory`.                                                                                        |

For CORS debugging, inspect both the preflight response and the actual response in DevTools. A successful actual response should include `Access-Control-Allow-Origin` matching the frontend origin. Opening an API URL directly does not verify cross-origin browser access. Do not add `mode: 'no-cors'`: the app needs to read JSON responses.

## 7. Rollback

Use rollback when a deployed frontend regression prevents normal use.

1. Open the frontend service's **Deploys** page.
2. Find a known-good successful deployment with a retained build artifact.
3. Select **Rollback**, then confirm **Rollback to this deploy**.
4. Repeat the live verification checklist, including the API URL check.
5. Fix or revert the faulty source change before the next normal deployment.
6. Recheck current environment values and routing settings. Dashboard rollback disables auto-deploy; reenable it after resolving the issue if desired.

Rollback reuses the previous build, including its embedded API URL. It does not revert the service's current redirects, rewrites, custom domains, or static headers, and it does not undo backend data changes. Current saved configuration applies again on the next normal deploy. If the old artifact is unavailable, restore the known-good code through a reviewed Git change and build it with the intended environment. [Render rollback documentation](https://render.com/docs/rollbacks)

## Deployment record template

Duplicate this for each release:

| Field                           | Value |
| ------------------------------- | ----- |
| Date / time / timezone          |       |
| Deployed by                     |       |
| Environment / Render service    |       |
| Branch / commit SHA             |       |
| Render deployment link          |       |
| API base URL used               |       |
| Changes included                |       |
| Checks and smoke-test result    |       |
| Previous known-good deployment  |       |
| Outcome / rollback / follow-ups |       |
