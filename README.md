# Leficious Portfolio

A standalone React portfolio for [leficious.com](https://leficious.com). It has no Lovable runtime, packages, metadata, or deployment dependency.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

The GitHub Actions workflow deploys `dist/` to GitHub Pages whenever `main` is updated. GitHub still requires `leficious.com` to be entered under **Settings → Pages → Custom domain**; the included `CNAME` file is useful for hosts and branch-based deployments that support it, but does not replace that setting for an Actions deployment.

## Domain setup

After enabling GitHub Pages with **GitHub Actions** as the source, add these records at the DNS provider for `leficious.com`:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `leficious.github.io` |

Remove conflicting A, AAAA, ALIAS, or CNAME records for `@` and `www`, but leave mail-related MX/TXT records alone. DNS changes can take time to propagate. In the repository's Pages settings, verify `leficious.com` and then enable **Enforce HTTPS**.
