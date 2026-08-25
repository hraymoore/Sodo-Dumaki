/* ============================================
   SODO DUMAKI — Shared site logic
   Demo-grade client-side storage (localStorage).
   NOTE: This simulates accounts/cart/layaway for
   prototype purposes only. See README.md for how
   to wire up a real backend + Square before
   launch — do not treat localStorage as a
   production user database or payment system.
   ============================================ */

const SD_KEYS = {
  users: "sdUsers",
  session: "sdSession",
  cart: "sdCart",
  newsletter: "sdNewsletterEmails",
  layaways: "sdLayawayPlans",
};

/* ---------------- storage helpers ---------------- */
function sdGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}
function sdSet(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/* ---------------- cart ----------------
   Each line carries an optional baseColor/threadColor (from a product's
   customize box), so the same product in two different colorways is
   tracked as two separate cart lines. lineId is the unique cart key;
   `id` stays the plain productId for catalog lookups. */
function sdGetCart() { return sdGet(SD_KEYS.cart, []); }
function sdSaveCart(cart) { sdSet(SD_KEYS.cart, cart); sdUpdateCartBadge(); }
function sdCartCount() { return sdGetCart().reduce((sum, l) => sum + l.qty, 0); }
function sdCartLineId(productId, baseColor, threadColor) {
  return `${productId}::${baseColor || ""}::${threadColor || ""}`;
}
function sdAddToCart(productId, qty = 1, options = {}) {
  const { baseColor = null, threadColor = null } = options;
  const cart = sdGetCart();
  const lineId = sdCartLineId(productId, baseColor, threadColor);
  const existing = cart.find((l) => sdCartLineId(l.id, l.baseColor, l.threadColor) === lineId);
  if (existing) existing.qty += qty;
  else cart.push({ id: productId, qty, baseColor, threadColor });
  sdSaveCart(cart);
}
function sdUpdateQty(lineId, qty) {
  let cart = sdGetCart();
  if (qty <= 0) {
    cart = cart.filter((l) => sdCartLineId(l.id, l.baseColor, l.threadColor) !== lineId);
  } else {
    const line = cart.find((l) => sdCartLineId(l.id, l.baseColor, l.threadColor) === lineId);
    if (line) line.qty = qty;
  }
  sdSaveCart(cart);
}
function sdRemoveFromCart(lineId) {
  sdSaveCart(sdGetCart().filter((l) => sdCartLineId(l.id, l.baseColor, l.threadColor) !== lineId));
}
function sdCartLinesWithProducts() {
  const products = typeof SD_PRODUCTS !== "undefined" ? SD_PRODUCTS : [];
  return sdGetCart()
    .map((line) => {
      const product = products.find((p) => p.id === line.id);
      if (!product) return null;
      const lineId = sdCartLineId(line.id, line.baseColor, line.threadColor);
      return { ...line, lineId, product };
    })
    .filter(Boolean);
}
function sdCartSubtotal() {
  return sdCartLinesWithProducts().reduce((sum, l) => sum + l.product.price * l.qty, 0);
}
function sdUpdateCartBadge() {
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    const count = sdCartCount();
    el.textContent = count;
    el.style.display = count > 0 ? "flex" : "none";
  });
}

/* ---------------- auth (demo only) ---------------- */
function sdGetUsers() { return sdGet(SD_KEYS.users, []); }
function sdFindUser(email) {
  return sdGetUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}
function sdSignup(name, email, password) {
  if (sdFindUser(email)) return { ok: false, error: "An account with that email already exists." };
  const users = sdGetUsers();
  users.push({ name, email, password, createdAt: new Date().toISOString() });
  sdSet(SD_KEYS.users, users);
  sdSet(SD_KEYS.newsletter, Array.from(new Set([...sdGet(SD_KEYS.newsletter, []), email])));
  sdSet(SD_KEYS.session, { email, guest: false });
  return { ok: true };
}
function sdLogin(email, password) {
  const user = sdFindUser(email);
  if (!user || user.password !== password) return { ok: false, error: "Incorrect email or password." };
  sdSet(SD_KEYS.session, { email, guest: false });
  return { ok: true };
}
function sdContinueAsGuest() {
  sdSet(SD_KEYS.session, { email: null, guest: true });
}
function sdLogout() {
  localStorage.removeItem(SD_KEYS.session);
}
function sdCurrentSession() { return sdGet(SD_KEYS.session, null); }
function sdCurrentUser() {
  const session = sdCurrentSession();
  if (!session || session.guest) return null;
  return sdFindUser(session.email) || null;
}

/* ---------------- newsletter ---------------- */
function sdSubscribeNewsletter(email) {
  const list = sdGet(SD_KEYS.newsletter, []);
  if (!list.includes(email)) list.push(email);
  sdSet(SD_KEYS.newsletter, list);
}

/* ---------------- toast ---------------- */
function sdToast(message) {
  let el = document.querySelector(".toast");
  if (!el) {
    el = document.createElement("div");
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove("show"), 2600);
}

/* ---------------- header / footer render ---------------- */
function sdRenderHeader(activePage) {
  const mount = document.getElementById("site-header");
  if (!mount) return;
  const links = [
    ["index.html", "Home"],
    ["products.html", "Shop"],
    ["business.html", "Business"],
    ["about.html", "About"],
    ["careers.html", "Careers"],
  ];
  const navHtml = links
    .map(([href, label]) => `<a href="${href}" class="${activePage === href ? "active" : ""}">${label}</a>`)
    .join("");

  mount.innerHTML = `
    <div class="announce-bar">Free shipping on orders over <strong>$100</strong> &middot; New season drop is live</div>
    <div class="navbar">
      <a href="index.html" class="brand">
        <img src="assets/logo-icon.png" alt="Sodo Dumaki logo" />
        <span class="brand-word">SODO <span>DUMAKI</span></span>
      </a>
      <nav class="nav-links" id="navLinks">${navHtml}</nav>
      <div class="nav-actions">
        <a href="account.html" class="icon-btn" aria-label="Account">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>
        </a>
        <a href="cart.html" class="icon-btn" aria-label="Cart">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h2l2.4 12.2a2 2 0 0 0 2 1.8h8.2a2 2 0 0 0 2-1.6L21 8H6"/><circle cx="10" cy="21" r="1"/><circle cx="18" cy="21" r="1"/></svg>
          <span class="cart-count" data-cart-count>0</span>
        </a>
        <button class="nav-toggle" id="navToggle" aria-label="Toggle menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
        </button>
      </div>
    </div>
  `;

  const toggle = document.getElementById("navToggle");
  const navLinksEl = document.getElementById("navLinks");
  toggle?.addEventListener("click", () => navLinksEl.classList.toggle("open"));

  sdUpdateCartBadge();
}

function sdRenderFooter() {
  const mount = document.getElementById("site-footer");
  if (!mount) return;
  mount.innerHTML = `
    <div class="newsletter">
      <div class="container">
        <span class="eyebrow">Join the Roster</span>
        <h2>Get early access to new designs &amp; colorway drops</h2>
        <form id="newsletterForm">
          <input type="email" required placeholder="you@email.com" aria-label="Email address" />
          <button type="submit" class="btn btn-gold">Sign Up</button>
        </form>
      </div>
    </div>
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <a href="index.html" class="brand" style="margin-bottom:14px;">
              <img src="assets/logo-icon.png" alt="Sodo Dumaki logo" />
              <span class="brand-word">SODO <span>DUMAKI</span></span>
            </a>
            <p>Athletic-designer gear built for the game and the street — designer-level construction, and every signature piece customizable down to the thread.</p>
            <div class="social-row">
              <a href="#" aria-label="Instagram">IG</a>
              <a href="#" aria-label="TikTok">TT</a>
              <a href="#" aria-label="X / Twitter">X</a>
            </div>
          </div>
          <div>
            <h4>SHOP</h4>
            <ul>
              <li><a href="products.html">All Products</a></li>
              <li><a href="products.html#tops">Tops</a></li>
              <li><a href="products.html#bottoms">Bottoms</a></li>
              <li><a href="products.html#bags">Bags</a></li>
            </ul>
          </div>
          <div>
            <h4>COMPANY</h4>
            <ul>
              <li><a href="about.html">Our Story</a></li>
              <li><a href="careers.html">Careers</a></li>
              <li><a href="business.html">Business &amp; Bulk Orders</a></li>
              <li><a href="layaway.html">Business Layaway</a></li>
              <li><a href="rewards.html">Sodo Rewards</a></li>
              <li><a href="account.html">My Account</a></li>
            </ul>
          </div>
          <div>
            <h4>SUPPORT</h4>
            <ul>
              <li><a href="cart.html">Cart</a></li>
              <li><a href="checkout.html">Checkout</a></li>
              <li><a href="mailto:support@sododumaki.com">support@sododumaki.com</a></li>
              <li><a href="#">Shipping &amp; Returns</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <span>&copy; ${new Date().getFullYear()} Sodo Dumaki Athletics. All rights reserved.</span>
          <span>Payments securely processed via Square.</span>
        </div>
      </div>
    </footer>
  `;

  document.getElementById("newsletterForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = e.target.querySelector("input[type=email]");
    sdSubscribeNewsletter(input.value);
    sdToast("You're on the list — welcome to the roster.");
    input.value = "";
  });
}

/* ---------------- product card rendering ---------------- */
function sdSwatchRowHtml(group, colors, defaultKey) {
  return colors.map((c, i) => `
    <button type="button" class="swatch ${c.key === (defaultKey || colors[0].key) ? "active" : ""}"
      data-swatch-group="${group}" data-swatch-value="${c.key}"
      style="background:${c.hex};" title="${c.label}${c.isacord ? " (Isacord " + c.isacord + ")" : ""}"
      aria-label="${c.label}"></button>
  `).join("");
}

function sdCustomizeBoxHtml(p) {
  if (p.customizable) {
    const soldNow = sdColorwaySoldCount(p.id, SD_GARMENT_COLORS[0].key, SD_THREAD_COLORS[0].key);
    return `
      <div class="customize-box" data-customize="${p.id}">
        <div class="customize-row">
          <span class="customize-label">Base Color</span>
          <div class="swatch-row">${sdSwatchRowHtml("base", SD_GARMENT_COLORS)}</div>
        </div>
        <div class="customize-row">
          <span class="customize-label">Thread Color</span>
          <div class="swatch-row">${sdSwatchRowHtml("thread", SD_THREAD_COLORS)}</div>
        </div>
        <div class="colorway-stock" data-colorway-stock>${soldNow} of ${SD_COLORWAY_CAP} made in this colorway</div>
      </div>
    `;
  }
  if (p.colorizable) {
    return `
      <div class="customize-box customize-box--basic" data-customize="${p.id}">
        <div class="customize-row">
          <span class="customize-label">Color</span>
          <div class="swatch-row">${sdSwatchRowHtml("base", SD_GARMENT_COLORS)}</div>
        </div>
      </div>
    `;
  }
  return "";
}

function sdProductCardHtml(p) {
  const badge = p.badge ? `<span class="badge ${p.badge === "New" ? "badge-purple" : ""}">${p.badge}</span>` : "";
  const buyBtn = p.squareLink
    ? `<a class="btn btn-gold btn-block" href="${p.squareLink}" target="_blank" rel="noopener">Buy Now — Square</a>`
    : `<button class="btn btn-gold btn-block" disabled title="Square payment link not connected yet">Buy Now — Coming Soon</button>`;
  return `
    <div class="product-card" data-category="${p.category}">
      <div class="product-media">
        ${badge}
        <img src="${p.image}" alt="${p.name}" />
      </div>
      <div class="product-info">
        <span class="product-cat">${p.category}</span>
        <p class="product-name">${p.name}</p>
        <span class="product-price">${sdFormatPrice(p.price)}</span>
        ${sdCustomizeBoxHtml(p)}
        <div class="product-actions">
          ${buyBtn}
          <button class="btn btn-outline btn-block" data-add-to-cart="${p.id}">Add to Cart</button>
        </div>
      </div>
    </div>
  `;
}

function sdBindProductCardInteractions(root = document) {
  root.querySelectorAll(".product-card").forEach((card) => {
    card.querySelectorAll("[data-swatch-group]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const group = btn.dataset.swatchGroup;
        card.querySelectorAll(`[data-swatch-group="${group}"]`).forEach((b) => b.classList.toggle("active", b === btn));
        sdUpdateColorwayStock(card);
      });
    });
    sdUpdateColorwayStock(card);
  });

  root.querySelectorAll("[data-add-to-cart]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".product-card");
      const productId = btn.getAttribute("data-add-to-cart");
      const baseBtn = card?.querySelector('[data-swatch-group="base"].active');
      const threadBtn = card?.querySelector('[data-swatch-group="thread"].active');
      sdAddToCart(productId, 1, {
        baseColor: baseBtn ? baseBtn.dataset.swatchValue : null,
        threadColor: threadBtn ? threadBtn.dataset.swatchValue : null,
      });
      sdToast("Added to cart");
    });
  });
}
// kept as an alias — older pages may still call this name
function sdBindAddToCartButtons(root = document) { sdBindProductCardInteractions(root); }

function sdUpdateColorwayStock(card) {
  const stockEl = card.querySelector("[data-colorway-stock]");
  if (!stockEl) return;
  const productId = card.querySelector("[data-add-to-cart]")?.getAttribute("data-add-to-cart");
  const baseBtn = card.querySelector('[data-swatch-group="base"].active');
  const threadBtn = card.querySelector('[data-swatch-group="thread"].active');
  if (!productId || !baseBtn || !threadBtn) return;
  const sold = sdColorwaySoldCount(productId, baseBtn.dataset.swatchValue, threadBtn.dataset.swatchValue);
  const remaining = SD_COLORWAY_CAP - sold;
  stockEl.textContent = remaining <= 0
    ? `Sold out in this colorway (${SD_COLORWAY_CAP}/${SD_COLORWAY_CAP} made)`
    : `${sold} of ${SD_COLORWAY_CAP} made in this colorway`;
  stockEl.classList.toggle("colorway-stock--low", remaining > 0 && remaining <= 50);
  stockEl.classList.toggle("colorway-stock--out", remaining <= 0);
}

document.addEventListener("DOMContentLoaded", () => {
  sdUpdateCartBadge();
});
