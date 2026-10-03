# Cash4Us Frontend

React, TypeScript, Vite, and Tailwind portal for Cash4Us members and administrators. It connects to the Django REST API in the sibling `cash4us-Django` repository.

## Features

- Member registration, JWT login/refresh, dashboard, packages, payments, wallet, transactions, referrals, daily tasks, withdrawals, resources, partners, community, support, notifications, profile, and settings.
- Administrator screens for packages, payments, task submissions, wallets, withdrawals, rewards, advertising, community pools, support, resources, partners, and audit data.
- Playwright browser coverage for the member portal.

## Local development

Start PostgreSQL and the Django API first, then run:

```powershell
npm install
npm run dev
```

The portal runs at `http://127.0.0.1:5173`.

Copy `.env.example` to `.env` for local development. `VITE_API_BASE_URL` defaults to `http://127.0.0.1:8000/api` when it is not set. This is a public browser value; never put secrets in a `VITE_*` variable.

For Playwright against a non-default local portal, set `PLAYWRIGHT_BASE_URL`; it defaults to `http://127.0.0.1:5173`.

## Commands

```powershell
npm run dev
npm run lint
npx playwright install chromium
npm run test:e2e
```

Playwright output is ignored by Git. See the backend repository’s `README.md` and `ARCHITECTURE.md` for database, payment, and business-rule documentation.
