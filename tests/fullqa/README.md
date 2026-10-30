# Local full functional QA (work in progress)

This suite uses headed installed Google Chrome and real isolated local PostgreSQL APIs. Keep this repository beside `cash4us-Django`. The backend contains `scripts/fullqa.ps1`, `config.settings.fullqa`, and `seed_fullqa`.

The helper requires the existing local container `cash4us-phase5c-test-postgres-1` on port 55432. It selects only database `cash4us_phase5c_fullqa`, uses the container's local credentials without printing them, and disables blockchain credentials. Run the backend helper with `init` once, then `runserver -ExtraArgs '127.0.0.1:8010','--noreload'`. Start Vite with `VITE_API_BASE_URL=http://127.0.0.1:8010/api` on loopback port 5180.

Run from the frontend directory:

```powershell
npx playwright test --config playwright.fullqa.config.ts
```

Each test creates unique synthetic accounts and records. Use one worker: community distribution and weekly ranking operate across eligible accounts by design. Reports, screenshots, traces, fixture credentials and uploaded files remain outside both repositories, in sibling `qa-artifacts/`. Do not publish these artifacts or use this setup against another database.

Status at the requested interim push: frontend production build passes; focused PostgreSQL checks passed (9 tests, followed by 6 resource/storage tests). Admin browser testing is in progress, with confirmed fixes and targeted retests. Member tests are authored but have not run. The combined final browser regression, broader backend regression, final migration checks and coverage report are outstanding. This commit is not a completed QA certification.

Earlier `local-visible-*.spec.ts` scripts are preserved. They use external scenario-specific fixtures and are not automatically included in this isolated configuration. Completed withdrawal lifecycle scripts are intentionally not repeated here; withdrawal search, filters and details are included.
