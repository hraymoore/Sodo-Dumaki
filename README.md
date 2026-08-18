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
| `checkout.html` | Checkout with a "Use Layaway" toggle |

## Brand system

- **Colors:** deep royal purple `#4b2e83`, metallic gold `#d4af37`, black `#0b0b0d`, and a grey scale from `#e7e7ea` to `#3a3a3f` — defined as CSS variables at the top of `css/styles.css`. This reads as premium/athletic (closer to a Nike x Nordstrom hybrid) without leaning fully "streetwear" or fully "luxury." If you'd rather try an accent shift (e.g. a brighter violet or a warmer champagne gold for more contrast on mobile), that's a one-file change in `:root`.
- **Type:** "Bebas Neue" (condensed display, headlines/buttons) + "Inter" (body), loaded from Google Fonts.
- **Logo:** `assets/logo.svg` is a placeholder wordmark/emblem — no logo file was ever provided in this repo or conversation, so swap in your real logo (SVG or PNG) and update the `<img src="assets/logo.svg">` references in `js/main.js` (`sdRenderHeader`/`sdRenderFooter`) once you have it.
- **Product photos:** every product image is a generated color-block placeholder from placehold.co (see `js/products-data.js`). Replace the `image` field per product with real photography before launch.

## How the site is wired together

- `js/main.js` injects the shared header/footer into every page's `#site-header` / `#site-footer` divs, handles the mobile nav toggle, cart badge, toasts, and the "add to cart" buttons.
- `js/products-data.js` holds the product catalog (id, name, category, price, image, badge) — this is the single source of truth for products shown on the home page, `products.html`, and the layaway calculator.
- Cart, accounts, and the newsletter/email list are stored in the browser's `localStorage` so the whole flow (browse → cart → login/guest → checkout → confirmation) works end-to-end for demos and review.

## Important: what's real vs. what's a prototype

This is a fully functional **front-end prototype**, not a production backend. Before taking real orders:

1. **Accounts & email storage.** `localStorage` is not a database — it only lives in one browser and isn't secure for real passwords. Before launch, pick one:
   - **Recommended (fastest with Squarespace):** use Squarespace's own **Customer Accounts** feature — it already handles signup/login and stores customer emails for you, so you may not need a separate login system at all.
   - **If you want a custom login outside Squarespace:** stand up a small backend (e.g. a serverless function on Netlify/Vercel + a hosted database like Supabase or Postgres) to store hashed passwords and emails properly.
2. **Payments & checkout.** `checkout.html` demonstrates the full UX (cart → info → layaway toggle → confirmation) but does not process real payment. To connect Squarespace:
   - Create matching products in Squarespace Commerce with the same names/prices as `js/products-data.js`.
   - Point each "Add to Cart" / checkout action at your Squarespace store's checkout URL for that product (Squarespace supports guest checkout natively).
   - For layaway, Squarespace doesn't natively support partial/split payments — the recommended approach is to sell a "60% Deposit" product in Squarespace for the down payment, then manually (or via a Squarespace invoice/payment link) collect the remaining 40% once the order is complete, per the terms below.
3. **Layaway data.** The layaway calculator and account-page layaway status are demo data. In production, track deposits/balances in whatever system processes your Squarespace payments (e.g. a simple spreadsheet, or your backend's database if you build one).

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
