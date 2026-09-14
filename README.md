# Sahan-Frontend

CRT-terminal portfolio frontend for Sahan Chathumina — Cybersecurity &
Network Engineering student based in Sri Lanka.

## Setup

```sh
npm install
cp .env.example .env
npm run dev
```

## Environment

| Variable       | Default               | Purpose                                            |
| -------------- | --------------------- | -------------------------------------------------- |
| `VITE_API_URL` | _(unset)_             | Backend base URL. When unset, contact uses mailto. |

When `VITE_API_URL` is set, the contact form POSTs JSON to
`<VITE_API_URL>/api/contact`. Otherwise it falls back to opening the
visitor's mail client addressed to `chathuminacsahan25@gmail.com`.

## Scripts

- `npm run dev` — local dev server
- `npm run build` — production build into `dist/`
- `npm run preview` — preview the production build

## Backend

Pair with [Sahan-Backend](https://github.com/Sahan-Chathumina-25/Sahan-Backend),
which serves `POST /api/contact`.
