# Sodo Dumaki — Athletic Designer Apparel

A responsive, mobile-friendly front end for the Sodo Dumaki e-commerce site: shop, layaway, careers, about, and account pages, built in plain HTML/CSS/JS (no build step required).

## Pages

| Page | Purpose |
|---|---|
| `index.html` | Home — hero, category tiles, best sellers, layaway callout, newsletter signup |
| `products.html` | Full catalog with category tabs (Tops, Bottoms, Outerwear, Headwear, Bags, Accessories) |
| `about.html` | Brand story, mission, values |
| `careers.html` | Open roles, perks, apply-by-email |
| `layaway.html` | Layaway program explainer + live calculator (60% down / 40% at completion) |
| `login.html` | Sign in, create an account (email + password), or continue as guest |
| `account.html` | Account portal — profile, order history, layaway plan status |
| `cart.html` | Shopping cart |
| `checkout.html` | Shipping info, then hands off to Square for payment (or emails a layaway request) |

## Brand system

- **Colors:** deep royal purple `#4b2e83`, metallic gold `#d4af37`, black `#0b0b0d`, and a grey scale from `#e7e7ea` to `#3a3a3f` — defined as CSS variables at the top of `css/styles.css`. This reads as premium/athletic (closer to a Nike x Nordstrom hybrid) without leaning fully "streetwear" or fully "luxury." If you'd rather try an accent shift (e.g. a brighter violet or a warmer champagne gold for more contrast on mobile), that's a one-file change in `:root`.
- **Type:** "Bebas Neue" (condensed display, headlines/buttons) + "Inter" (body), loaded from Google Fonts.
- **Logo:** `assets/logo.svg` is a placeholder wordmark/emblem — no logo file was ever provided in this repo or conversation, so swap in your real logo (SVG or PNG) and update the `<img src="assets/logo.svg">` references in `js/main.js` (`sdRenderHeader`/`sdRenderFooter`) once you have it.
- **Product photos:** every product image is a self-contained placeholder SVG generated in `js/products-data.js` (no external image service, so nothing to break). Replace each product's `image` field with a real photo URL before launch.

## How the site is wired together

- `js/main.js` injects the shared header/footer into every page's `#site-header` / `#site-footer` divs, handles the mobile nav toggle, cart badge, toasts, and the "add to cart" buttons.
- `js/products-data.js` holds the product catalog (id, name, category, price, image, badge, `squareLink`) — this is the single source of truth for products shown on the home page, `products.html`, and the layaway calculator.
- Cart, accounts, and the newsletter/email list are stored in the browser's `localStorage` so the whole flow (browse → cart → login/guest → checkout) works end-to-end for demos and review.

## Connecting real payments: Square

This site is built to connect to **Square** (app.squareup.com — payments/POS), not Squarespace (a different company/website builder). Because this is a custom-coded site, Square is the natural fit: it gives you real hosted checkout links you can drop straight into HTML, with no separate site builder to migrate into.

We're using the simplest, no-backend approach: **Square Payment Links**. Each product gets its own secure Square-hosted checkout page; this site just links out to it.

### Setup steps

1. **Create your items in Square.** In the [Square Dashboard](https://app.squareup.com/dashboard/) → **Items & Orders → Items**, add each product from `js/products-data.js` with the matching name and price (22 products across Tops, Bottoms, Outerwear, Headwear, Bags, Accessories).
2. **Generate a Payment Link per item.** Square Dashboard → **Payments → Payment Links** (or from an item's page, "Share" → "Create a link"). Copy the URL Square gives you.
3. **Paste each link into the catalog.** Open `js/products-data.js` — every product has a line like:
   ```js
   squareLink: null, // paste this item's Square Payment Link URL here
   ```
   Replace `null` with the URL in quotes, e.g. `squareLink: "https://square.link/u/abc123",`.
4. That's it. Once a product has a `squareLink`, its **"Buy Now — Square"** button (on `products.html`, the home page, and `checkout.html`) automatically goes live and opens Square's secure hosted checkout in a new tab. Products without a link yet show a disabled **"Coming Soon"** state instead of a broken button.

### Why checkout works the way it does

Square Payment Links are one link per item — they don't merge multiple different products into a single combined payment without a backend calling Square's Orders/Checkout API directly. So on this site:

- **Cart (`cart.html`)** is a review step — see everything you're about to buy and the estimated total.
- **Checkout (`checkout.html`)** collects shipping info, then presents a **"Pay via Square"** button for each item in the cart, each opening that item's Square Payment Link in its own tab. For a single-item purchase this is a one-click flow; for a multi-item order it's a couple of clicks instead of one.
- If you outgrow this later, a small backend (serverless function calling Square's Orders + Checkout API) can combine multiple items into a single Square-hosted checkout and give you a real shopping cart experience. Not needed to launch.

### Layaway → Square Invoices

Square doesn't support splitting a single Payment Link into a deposit + balance, but **Square Invoices does** — it has a built-in **Installments** feature that lets you send an invoice with a deposit due now and a balance due later, which matches this business's terms exactly (60% now, 40% at completion).

The flow as built:
1. A customer fills out the layaway form on `checkout.html` and clicks **"Email My Layaway Request"** — this opens their email client with a pre-filled message (to `layaway@sododumaki.com`) listing their items, total, and the 60%/40% split.
2. You (the merchant) go to Square Dashboard → **Invoices → Create Invoice**, add the items, turn on **Installments**, and set the first payment to 60% and the second to 40% — due whenever the order is complete.
3. Square emails the customer a secure invoice; they pay the deposit online, and you get paid the balance the same way once the order's ready to ship.

This is a manual step today (no backend to automate invoice creation), but it's fast, and it's real Square functionality — not a workaround.

## Accounts & email storage

`localStorage` (used for `login.html` / `account.html` right now) is not a database — it only lives in one browser and isn't secure for real passwords. Before launch, pick one:

- **Recommended:** if you also set up **Square Online** or use Square's customer directory, Square already collects customer emails from every purchase — you may not need a separate login system at all for a v1 launch.
- **If you want real accounts on this site:** stand up a small backend (e.g. a serverless function on Netlify/Vercel + a hosted database like Supabase or Postgres) to store hashed passwords and emails properly.

## Layaway terms (as implemented)

- **60% deposit due before an order starts production.**
- **40% balance due at completion**, before the order ships.
- No interest, no credit check — shown throughout `layaway.html` and the checkout flow.

## Running locally

No build tools needed — open `index.html` in a browser, or serve the folder with any static server, e.g.:

```
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.
