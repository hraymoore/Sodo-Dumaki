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

/* ---------------- cart ---------------- */
function sdGetCart() { return sdGet(SD_KEYS.cart, []); }
function sdSaveCart(cart) { sdSet(SD_KEYS.cart, cart); sdUpdateCartBadge(); }
function sdCartCount() { return sdGetCart().reduce((sum, l) => sum + l.qty, 0); }
function sdAddToCart(productId, qty = 1) {
  const cart = sdGetCart();
  const existing = cart.find((l) => l.id === productId);
  if (existing) existing.qty += qty;
  else cart.push({ id: productId, qty });
  sdSaveCart(cart);
}
function sdUpdateQty(productId, qty) {
  let cart = sdGetCart();
  if (qty <= 0) {
    cart = cart.filter((l) => l.id !== productId);
  } else {
    const line = cart.find((l) => l.id === productId);
    if (line) line.qty = qty;
  }
  sdSaveCart(cart);
}
function sdRemoveFromCart(productId) {
  sdSaveCart(sdGetCart().filter((l) => l.id !== productId));
}
function sdCartLinesWithProducts() {
  const products = typeof SD_PRODUCTS !== "undefined" ? SD_PRODUCTS : [];
  return sdGetCart()
    .map((line) => {
      const product = products.find((p) => p.id === line.id);
      return product ? { ...line, product } : null;
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
    ["layaway.html", "Layaway"],
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
        <img src="assets/logo.svg" alt="Sodo Dumaki logo" width="38" height="38" />
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
        <h2>Get early access to drops &amp; layaway perks</h2>
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
              <img src="assets/logo.svg" alt="Sodo Dumaki logo" width="34" height="34" />
              <span class="brand-word">SODO <span>DUMAKI</span></span>
            </a>
            <p>Athletic-designer gear built for the game and the street. Purple &amp; gold on the court, black &amp; grey off it.</p>
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
              <li><a href="layaway.html">Layaway</a></li>
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
        <div class="product-actions">
          ${buyBtn}
          <div style="display:flex;gap:8px;">
            <button class="btn btn-outline" data-add-to-cart="${p.id}">Add to Cart</button>
            <a class="btn btn-outline" href="layaway.html?item=${p.id}">Layaway</a>
          </div>
        </div>
      </div>
    </div>
  `;
}

function sdBindAddToCartButtons(root = document) {
  root.querySelectorAll("[data-add-to-cart]").forEach((btn) => {
    btn.addEventListener("click", () => {
      sdAddToCart(btn.getAttribute("data-add-to-cart"), 1);
      sdToast("Added to cart");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  sdUpdateCartBadge();
});
