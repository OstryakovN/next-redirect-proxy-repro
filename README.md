# next.config redirects break client-side navigation when proxy.ts is present (Pages Router)

Minimal reproduction for [vercel/next.js#98142](https://github.com/vercel/next.js/issues/98142).

## Setup

- `next.config.js` has a single redirect: `/old` → `/new` (301)
- `proxy.ts` exists and only calls `NextResponse.next()`
- `pages/[slug].tsx` uses `getServerSideProps` and renders `Page: <slug>`
- `pages/index.tsx` has `<Link href="/old">`

## Steps

```bash
npm install
npm run build
npm run start
```

1. Open http://localhost:3000/ and click the link.
2. **Actual:** the URL stays `/old` and the page renders `Page: EMPTY PROPS` (props are empty).
3. **Expected:** either the redirect is applied and the page shows `Page: new` at `/new`, or the redirect is skipped and `Page: old` is shown with its data.

Direct data request:

```bash
BUILD_ID=$(cat .next/BUILD_ID)
curl -sI "http://localhost:3000/_next/data/$BUILD_ID/old.json"
# HTTP/1.1 301 Moved Permanently
# location: /new
```

`fetch` in the client router follows that `Location` to the HTML page `/new`, the HTML is parsed as JSON and the page renders with empty props.

## Control: remove proxy.ts

```bash
rm proxy.ts
rm -rf .next && npm run build && npm run start
```

The same data request returns `200 {"pageProps":{"slug":"old"},"__N_SSP":true}` and the page shows `Page: old`.

## Results

| next | proxy.ts | `skipProxyUrlNormalize` | `_next/data/…/old.json` | Page after clicking the link |
|---|---|---|---|---|
| 16.4.3 | yes | — | `301 location: /new` | `Page: EMPTY PROPS` at `/old` |
| 16.4.3 | no | — | `200`, data of `/old` | `Page: old` at `/old` |
| 16.5.0-canary.36 | yes | — | `301 location: /new` | `Page: EMPTY PROPS` at `/old` |
| 16.5.0-canary.36 | yes | `true` | `301 location: /new` | — |

`next dev` (16.5.0-canary.36) behaves the same: the data request gets `301 location: /new`.
