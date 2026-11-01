# Local synthetic Chrome QA

Follow the sibling backend [local QA setup guide](../../../cash4us-django/docs/LOCAL_QA.md) for prerequisites, isolated database/schema preparation, synthetic accounts, legacy fixtures, separate Thursday/Monday clocks, headed commands and cleanup.

Complete the guide in order: install Python/backend requirements and Docker/PostgreSQL, create the dedicated loopback database, then prepare a fresh prefixed schema and run migrations. Start the backend with that schema on `127.0.0.1:8010`. In the frontend checkout, install with `npm.cmd ci`, configure the ignored local API URL as documented, run `npm.cmd run build`, and serve with `npm.cmd run preview -- --host 127.0.0.1 --port 5180 --strictPort`.

The API and fixture subprocesses must share `config.settings.fullqa`, `FULLQA_FIXTURES_ENABLED=1` and the same prepared `FULLQA_SCHEMA`. Fixture commands require `--confirm-isolated`. Never use production/staging data.

Start the loopback API on 8010 and frontend production preview on 5180 as documented. From the frontend directory run:

```powershell
$env:DJANGO_SETTINGS_MODULE='config.settings.fullqa'
$env:FULLQA_FIXTURES_ENABLED='1'
# Set FULLQA_SCHEMA to the prepared server schema; set QA_RUN to a unique key.
npx.cmd playwright test --config playwright.fullqa.config.ts
```

Keep installed Google Chrome visible and the computer awake. The full configuration uses one worker and zero retries. Record all 69 workflows from one uninterrupted run; preserve failures without combining reruns.

The seven legacy financial tests use `playwright.legacy.config.ts`, a separate prepared schema and synthetic admin credentials loaded from private manifests. Run six open-window cases with the documented Thursday backend clock, then the closed-window case with the Monday clock. See the backend guide for exact commands.

For that separate schema, run `seed_visible_e2e --confirm-isolated` and `seed_fullqa --key <unique-key> --confirm-isolated` from the backend as documented. Load `E2E_LEGACY_ADMIN_EMAIL` and `E2E_LEGACY_ADMIN_PASSWORD` from the resulting synthetic admin manifest, and `E2E_MEMBER_EMAIL` and `E2E_MEMBER_PASSWORD` from the visible fixture manifest, without printing their contents. The admin must belong to the same legacy schema.

Restart the backend with `WITHDRAWAL_LOCAL_E2E_ENABLED=True` and `WITHDRAWAL_LOCAL_TEST_NOW=2026-11-05T12:00:00+00:00` for the open-window batch. In the frontend shell run:

```powershell
npx.cmd playwright test --config playwright.legacy.config.ts --grep-invert 'withdrawal form displays'
```

Then restart the backend on the same schema with `WITHDRAWAL_LOCAL_TEST_NOW=2026-11-02T12:00:00+00:00` and run:

```powershell
npx.cmd playwright test --config playwright.legacy.config.ts --grep 'withdrawal form displays'
```

Both configurations use headed installed Chrome, one worker and zero retries. Disable both withdrawal-time overrides for the full suite. Clear the fixture/schema/time variables and follow the guide's guarded cleanup procedure after testing.

Keep credential manifests, reports, traces, screenshots and uploads outside Git under `qa-artifacts`. Never commit credentials or generated data.
