# a-lign studio — Next.js (App Router)

React + Vite se Next.js (App Router) mein convert kiya gaya version.
**Design, animations (GSAP), aur CSS 1:1 same hain** — koi visual ya
behavioral change nahi kiya gaya.

## Run karne ke liye

```bash
npm install
npm run dev
```

`http://localhost:3000` pe khul jayega.

Production build:

```bash
npm run build
npm run start
```

## Kya convert hua (structure only, visuals same)

- `index.html` + `main.jsx` → `src/app/layout.jsx` + `src/app/page.jsx`
  (Next.js App Router ka standard entry point)
- `<script src="/src/main.jsx">` wala CSR bootstrap hat gaya — ab
  React tree normally Next.js render karta hai (SSR + hydration),
  jo crawlers ko actual HTML content deta hai (SEO ke liye better)
- Google Fonts `<link>` tags → `next/font/google`
  (Space Grotesk, Bricolage Grotesque, Inter — same families, same
  weights). Ye fonts ab self-host hote hain, koi external request
  nahi jaata, aur font-swap layout-shift nahi hota — dikhne mein
  bilkul same, bas faster aur behtar Core Web Vitals
- Har interactive component (`Preloader.jsx`, `Hero.jsx`, `App.jsx`)
  pe `"use client"` add kiya gaya — kyunke ye GSAP, refs, aur
  `window`/`document` use karte hain. Inke andar ka logic/JSX/CSS
  bilkul waisa hi hai jaisa pehle tha
- SEO ke liye naya add hua: Metadata API (`layout.jsx` mein title,
  description, Open Graph, Twitter card, canonical, robots meta),
  auto-generated `robots.txt` (`src/app/robots.js`) aur `sitemap.xml`
  (`src/app/sitemap.js`), aur JSON-LD structured data
  (`src/app/page.jsx`) for rich search results

## Aapko ye cheezein fill karni hain (`TODO` comments dekhein)

1. **`src/app/layout.jsx`** — `SITE_URL` ko apne asli domain se
   replace karein (`https://your-domain.com` abhi placeholder hai)
2. **`src/app/robots.js`**, **`src/app/sitemap.js`**, aur
   **`src/app/page.jsx`** (JSON-LD) — inme bhi wahi domain daalein
3. **`public/og-image.jpg`** (1200×630) — social share preview ke
   liye add karein
4. **`public/favicon.ico`** — apna favicon add karein
5. Agar aage aur pages add karte hain (e.g. `/work`, `/contact`), to
   unhe `sitemap.js` ki array mein add karte rahein

## Note

- React version (18.3.1) aur GSAP version (3.12.5) bilkul same rakhe
  gaye hain — koi dependency upgrade force nahi kiya
- `next.config.mjs` minimal hai; agar images, redirects, ya custom
  headers chahiye ho to yahan add kar sakte hain
