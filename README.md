# Championship Day

A small React exercise for a WCAG engineering interview. The page is a one-day competition dashboard: switch views, filter sessions, open alert preferences, expand a session, and read results.

## Brief

People using a keyboard, a screen reader, and low-vision settings have reported that the page is difficult to use. The visual layout is intentional. Treat the behaviour you can operate with a mouse as the product behaviour that must keep working.

Please:

1. Audit the rendered page. Record each issue with the user impact, the WCAG 2.1 criterion, and a concrete fix.
2. Implement the fixes in this application.
3. Add or update tests that lock the repaired behaviour.
4. Keep the same content, the same mouse interactions, and a usable layout from a narrow phone width through a desktop width.
5. Publish the result on GitHub.

Two reports from colleagues, without a prescribed root cause:

- The session filter is awkward when using only a keyboard.
- Result status is not clear for colleagues who cannot rely on colour.

Do not assume those are the only issues. Do not change the event, the athlete names, or the available views.

## Run

This app is self-contained. Install and run it from this folder:

```bash
pnpm install
pnpm dev
```

Open the URL Vite prints. The app uses port `5174` when that port is free.

```bash
pnpm test
pnpm check
pnpm lint
```

Suggested time box: 2–3 hours. A written audit plus a partial implementation is more useful than an unfinished rewrite. Simple, native fixes are fully acceptable.

## Publish the result

Publish the finished result on GitHub. The repository must contain the repaired application and your written audit. Send the repository URL when you are done.
