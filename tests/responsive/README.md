# Responsive viewport checks

Run against the existing isolated local QA stack: frontend on 127.0.0.1:5184,
backend on 127.0.0.1:8014 and the guarded loopback fullqa PostgreSQL database.
Use the schema selected for that backend, never the private production recovery
schema. The fixture guard rejects missing/unsafe settings before seeding.

```powershell
$env:FULLQA_SCHEMA = '<existing synthetic cash4us_qa_ schema>'
npx.cmd playwright test --config=playwright.responsive.config.ts
```

The suite creates synthetic records only. It scans every declared application
route at 320, 375, 768, 1024 and 1440 pixels with member/admin authentication.
It checks page overflow and browser exceptions, then exercises mobile navigation,
keyboard focus/Escape, desktop sidebar widths, and package/tenure, payment-review,
wallet and support dialogs at short viewport heights. It never confirms a payment,
sends funds or submits a financial action. External browser requests are blocked.

Reports/screenshots stay outside the repository in ../qa-artifacts. This verifies
local application layouts, not the state of an undeployed hosted release.
