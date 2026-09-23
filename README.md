# Resale frontend

React/Vite inventory frontend. Authentication is outside the current MVP.

## Development

Use Node 22.22.1 or a compatible newer Node version.

```sh
npm ci
npm run dev
```

By default, browser requests to `/api` are proxied to `http://127.0.0.1:8000`.
The proxy removes `/api`: `/api/purchases` becomes `/purchases` on the backend.
Copy `.env.example` to `.env.development.local` to override these defaults.
Restart Vite after changing environment variables.

## Environment configuration

| Variable            | Purpose                                                                                                             |
| ------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `VITE_API_BASE_URL` | Browser-visible backend URL, including any API path prefix. Defaults to `/api` in development; required for builds. |
| `API_PROXY_TARGET`  | Backend target for the development proxy. Defaults to `http://127.0.0.1:8000`. Not included in the browser bundle.  |

Set `VITE_API_BASE_URL=https://your-backend.onrender.com` if the backend serves `/purchases`.
Set `VITE_API_BASE_URL=https://your-backend.onrender.com/api` if it serves `/api/purchases`.
Trailing slashes are removed. All active API calls use this single base URL.

For local production builds, create `.env.production.local` with the production base URL, then run `npm run build`.
For staging, use `.env.staging.local` and `npm run build -- --mode staging`.
Environment files are ignored by Git except `.env.example`. Variables supplied by the build environment take precedence over env files.

Vite embeds `VITE_*` variables into the build: they are public and must not contain secrets.
Changing a deployed API URL requires a new build and deploy.
Relative API prefixes are supported only when the hosting environment has a matching backend proxy; Vite's development proxy does not run on Render static sites or in `vite preview`.

## Render static site

- Build command: `npm ci && npm run build`
- Publish directory: `dist`
- Environment: set `VITE_API_BASE_URL` to the actual HTTPS backend base URL.
- Set `NODE_VERSION=22.22.1` to use the version tested locally.
- Add a rewrite: source `/*`, destination `/index.html`, action **Rewrite**.

The backend must allow the frontend origin through CORS, including GET, POST, PUT, DELETE, and Content-Type preflights.
The frontend currently sends no authentication tokens and does not opt in to cross-origin cookies.

## Verification

```sh
npm run lint
npm test
npm run build
npm run preview
```

With the configured backend, verify inventory loading, purchase creation/editing/deletion, item deletion, recording sales, refunds, and refreshing `/inventory` on Render.
Unit tests mock API calls; they do not verify backend availability or CORS.
