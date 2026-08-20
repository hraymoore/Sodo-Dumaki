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
| `business.html` | Business account sign in/registration + bulk order request form (teams, schools, hotels, medical offices, staff uniforms, events — 100-piece minimum) |
| `rewards.html` | Public Sodo Rewards explainer — earning rate, reward catalog, status tiers |

## Brand system

- **Colors:** deep royal purple `#4b2e83`, metallic gold `#d4af37`, black `#0b0b0d`, and a grey scale from `#e7e7ea` to `#3a3a3f` — defined as CSS variables at the top of `css/styles.css`. This reads as premium/athletic (closer to a Nike x Nordstrom hybrid) without leaning fully "streetwear" or fully "luxury." If you'd rather try an accent shift (e.g. a brighter violet or a warmer champagne gold for more contrast on mobile), that's a one-file change in `:root`.
- **Type:** "Bebas Neue" (condensed display, headlines/buttons) + "Inter" (body), loaded from Google Fonts.
- **Logo:** `assets/logo.svg` is a placeholder wordmark/emblem — no logo file was ever provided in this repo or conversation, so swap in your real logo (SVG or PNG) and update the `<img src="assets/logo.svg">` references in `js/main.js` (`sdRenderHeader`/`sdRenderFooter`) once you have it.
- **Product photos:** every product image is a self-contained placeholder SVG generated in `js/products-data.js` (no external image service, so nothing to break). Replace each product's `image` field with a real photo URL before launch.

## How the site is wired together

- `js/main.js` injects the shared header/footer into every page's `#site-header` / `#site-footer` divs, handles the mobile nav toggle, cart badge, toasts, and the "add to cart" buttons.
- `js/products-data.js` holds the product catalog (id, name, category, price, image, badge, `squareLink`) — this is the single source of truth for products shown on the home page, `products.html`, and the layaway calculator.
- `js/commerce.js` holds everything business/bulk-order specific: the sports/apparel/state/size-grid data and HTML helpers, business account signup, the order log (`sdRecordOrder`/`sdGetOrders`), and the shared bulk order form renderer used by `business.html` and the business account portal.
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

## Business & bulk orders

`business.html` is a separate track for B2B customers — teams, schools, hotels, medical offices, airports, restaurants, event/race organizers, or any organization that needs uniforms or bulk apparel — kept apart from the regular consumer shop so retail customers never see it and business customers get a form built for what they actually need.

- **Business accounts** register with business name, business type, EIN, contact info, and address (`sdSignupBusiness` in `js/commerce.js`) — stored in the same `sdUsers` localStorage array as consumer accounts, flagged `isBusiness: true`. When a business account signs in and visits `account.html`, they see a completely different portal (Business Profile / New Bulk Request / My Requests) instead of the consumer Profile/Orders/Layaway panels — same page, different render branch based on `user.isBusiness`.
- **The bulk order form** (`sdRenderBulkOrderForm` in `js/commerce.js`, used on both `business.html` and the business account portal) covers:
  - **Purpose**: Team/Sports Program, Staff/Work Uniform Program (hotels, medical, airports, restaurants, etc.), or a One-Time Event — each reveals the relevant fields (sport checklist, or event name/date).
  - Business info, EIN, delivery address (with state, for order-geography records).
  - Apparel/uniform types needed, team colors/design notes, and a size-quantity grid (youth/adult) with a **live 100-piece minimum check**.
  - A checkbox to **also bulk order anything from the regular consumer catalog** (every product in `js/products-data.js`, with quantity fields) — so a business can order custom uniforms and standard catalog items in the same request.
  - File pickers for logo/design files and **existing uniform photos** (so a business replacing or refreshing a current uniform can show what they have now). Browsers can't attach files to a `mailto:` link automatically, so the form reminds the requester to attach them to the email before sending.
  - **Payment preference: pay in full, or layaway (60% now / 40% at completion).** Layaway is only offered here — the regular consumer `checkout.html` is untouched and does not offer it. This matches the business's policy that layaway is for business/bulk custom orders, not everyday retail purchases.
- **Submitting** the form saves the request locally (`sdRecordOrder`, so a business can see "My Requests" in their portal) and opens a pre-filled `mailto:business@sododumaki.com` with the complete order spec for your team to quote and fulfill manually.
- **Payment**: same as retail — quote and invoice through Square. For the layaway option, use Square Invoices' Installments feature (see the Square section above) with the deposit/balance split the customer requested.

**EIN and business address data is stored the same way as everything else in this prototype — in `localStorage`, per-browser, unencrypted.** This is fine for demoing the flow, but EIN numbers and business banking-adjacent info deserve a real backend with real security before you're collecting them from actual customers. Treat this the same as the accounts caveat below: fine to launch a v1 that emails you the request, not fine as a long-term store of sensitive business data.

## Sodo Rewards (points program)

A simple points program for consumer accounts, defined in `js/commerce.js`:

- **Earning:** 1 point per $1 spent ($100 spent = 100 points). Points post automatically when a signed-in (non-guest, non-business) customer completes a standard checkout on `checkout.html` (`sdAwardPoints`) — guest checkouts don't earn points, which is called out on the confirmation screen as a reason to create an account.
- **Redeeming:** `js/commerce.js` defines a `SD_REWARD_CATALOG` (Free Wristband Set → Free Signature Hoodie, 250–5,000 points) and `SD_REWARD_TIERS` (Rookie / All-Star / MVP, unlocked at 0 / 1,000 / 5,000 points with perks like early drop access and free shipping). Redeeming (`sdRedeemReward`) deducts points immediately and logs the redemption — there's no automatic fulfillment, so redemptions should be checked and shipped manually until there's a real backend.
- **Where customers see it:** `account.html` has a "Sodo Rewards" panel (balance, tier, progress bar, redeem buttons, points activity) for consumer accounts, and `rewards.html` is the public marketing page explaining the program to people who haven't signed up yet.
- **Adjusting the program:** change `SD_POINTS_PER_DOLLAR`, `SD_REWARD_CATALOG`, or `SD_REWARD_TIERS` at the top of `js/commerce.js` — every page that renders rewards content reads from those same constants, so there's one place to edit.
- Like everything else in this prototype, point balances live in `localStorage` per-browser. Before launch, points need to move into whatever real backend/database ends up storing accounts (see below) so a customer's balance is the same on every device.

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
