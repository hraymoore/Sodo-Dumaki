/* ============================================
   SODO DUMAKI — Commerce data & shared logic
   Business/event bulk orders, order logging for
   analytics, and the Sodo Rewards points program.

   NOTE: All of this is demo-grade localStorage
   storage, same caveat as js/main.js — it only
   sees orders placed in THIS browser. See README
   for the real production path (real backend +
   database, Square's own reporting, and Google
   Analytics for site-traffic geography).
   ============================================ */

const SD_US_STATES = [
  ["AL","Alabama"],["AK","Alaska"],["AZ","Arizona"],["AR","Arkansas"],["CA","California"],
  ["CO","Colorado"],["CT","Connecticut"],["DE","Delaware"],["FL","Florida"],["GA","Georgia"],
  ["HI","Hawaii"],["ID","Idaho"],["IL","Illinois"],["IN","Indiana"],["IA","Iowa"],
  ["KS","Kansas"],["KY","Kentucky"],["LA","Louisiana"],["ME","Maine"],["MD","Maryland"],
  ["MA","Massachusetts"],["MI","Michigan"],["MN","Minnesota"],["MS","Mississippi"],["MO","Missouri"],
  ["MT","Montana"],["NE","Nebraska"],["NV","Nevada"],["NH","New Hampshire"],["NJ","New Jersey"],
  ["NM","New Mexico"],["NY","New York"],["NC","North Carolina"],["ND","North Dakota"],["OH","Ohio"],
  ["OK","Oklahoma"],["OR","Oregon"],["PA","Pennsylvania"],["RI","Rhode Island"],["SC","South Carolina"],
  ["SD","South Dakota"],["TN","Tennessee"],["TX","Texas"],["UT","Utah"],["VT","Vermont"],
  ["VA","Virginia"],["WA","Washington"],["WV","West Virginia"],["WI","Wisconsin"],["WY","Wyoming"],
  ["DC","District of Columbia"],
];

const SD_SPORTS = [
  "Football", "Basketball", "Baseball", "Softball", "Soccer", "Volleyball",
  "Track & Field", "Cross Country", "Wrestling", "Golf", "Bowling", "Tennis",
  "Swim & Dive", "Lacrosse", "Cheer & Spirit", "Ice Hockey", "Field Hockey", "Rugby",
];

const SD_APPAREL_TYPES = [
  "Game Uniforms", "Practice Uniforms", "Warm-Up Suits", "Work Uniforms / Staff Apparel",
  "Team Bags", "Headwear (Hats / Beanies)", "Outerwear / Jackets", "Spirit Wear / Fan Gear",
  "Custom Logo Apparel (from catalog)", "Event Tees",
];

const SD_SIZE_LIST = [
  ["yS", "Youth S"], ["yM", "Youth M"], ["yL", "Youth L"],
  ["aS", "Adult S"], ["aM", "Adult M"], ["aL", "Adult L"],
  ["aXL", "Adult XL"], ["a2XL", "Adult 2XL"], ["a3XL", "Adult 3XL"],
];

const SD_BULK_MINIMUM = 100;

/* ---------------- shared form fragments ---------------- */
function sdStateSelectHtml(id, required = true, selected = "") {
  const opts = SD_US_STATES.map(([abbr, name]) => `<option value="${abbr}" ${abbr === selected ? "selected" : ""}>${name}</option>`).join("");
  return `<select id="${id}" ${required ? "required" : ""}><option value="">Select state...</option>${opts}</select>`;
}

function sdChecklistHtml(name, items) {
  return `
    <div class="checklist-grid">
      ${items.map((item, i) => `
        <label class="checklist-item">
          <input type="checkbox" name="${name}" value="${item}" id="${name}-${i}" />
          <span>${item}</span>
        </label>
      `).join("")}
    </div>
  `;
}

function sdSizeGridHtml(prefix) {
  return `
    <div class="size-grid" data-size-prefix="${prefix}">
      ${SD_SIZE_LIST.map(([code, label]) => `
        <div class="size-cell">
          <label for="${prefix}-${code}">${label}</label>
          <input type="number" min="0" value="0" id="${prefix}-${code}" data-size-input="${prefix}" />
        </div>
      `).join("")}
    </div>
    <div class="size-total">Total pieces: <strong id="${prefix}-total">0</strong> <span class="size-total-hint">(${SD_BULK_MINIMUM}-piece minimum per order)</span></div>
  `;
}

function sdBindSizeGrid(prefix) {
  const inputs = document.querySelectorAll(`[data-size-input="${prefix}"]`);
  const totalEl = document.getElementById(`${prefix}-total`);
  function update() {
    let total = 0;
    inputs.forEach((el) => { total += Math.max(0, Number(el.value) || 0); });
    totalEl.textContent = total;
    totalEl.parentElement.classList.toggle("under-minimum", total < SD_BULK_MINIMUM);
  }
  inputs.forEach((el) => el.addEventListener("input", update));
  update();
}

function sdSizeGridTotal(prefix) {
  let total = 0;
  document.querySelectorAll(`[data-size-input="${prefix}"]`).forEach((el) => { total += Math.max(0, Number(el.value) || 0); });
  return total;
}

function sdSizeGridBreakdown(prefix) {
  return SD_SIZE_LIST
    .map(([code, label]) => {
      const el = document.getElementById(`${prefix}-${code}`);
      const qty = el ? Math.max(0, Number(el.value) || 0) : 0;
      return qty > 0 ? `${label}: ${qty}` : null;
    })
    .filter(Boolean)
    .join(", ");
}

function sdCheckedValues(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map((el) => el.value);
}

/* ---------------- order log (for analytics) ---------------- */
const SD_ORDERS_KEY = "sdOrders";
function sdGetOrders() { return sdGet(SD_ORDERS_KEY, []); }
function sdRecordOrder(order) {
  const orders = sdGetOrders();
  orders.push({
    id: "ord_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    date: new Date().toISOString(),
    ...order,
  });
  sdSet(SD_ORDERS_KEY, orders);
  return order;
}

/* ---------------- Sodo Rewards points ---------------- */
const SD_POINTS_PER_DOLLAR = 1; // $1 spent = 1 point ($100 spent = 100 points)

const SD_REWARD_CATALOG = [
  { points: 250, label: "Free Wristband Set" },
  { points: 500, label: "Free Crew Socks (3-Pack)" },
  { points: 1000, label: "Free Snapback or Beanie" },
  { points: 2500, label: "Free Performance Tee" },
  { points: 5000, label: "Free Signature Hoodie" },
];

const SD_REWARD_TIERS = [
  { min: 0, name: "Rookie", perk: "Earn points on every purchase" },
  { min: 1000, name: "All-Star", perk: "Early access to new drops" },
  { min: 5000, name: "MVP", perk: "Free shipping on every order + birthday reward" },
];

function sdGetTier(points) {
  return SD_REWARD_TIERS.slice().reverse().find((t) => points >= t.min) || SD_REWARD_TIERS[0];
}

function sdAwardPoints(email, dollarAmount) {
  if (!email) return;
  const users = sdGetUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return;
  user.points = (user.points || 0) + Math.floor(dollarAmount * SD_POINTS_PER_DOLLAR);
  sdSet(SD_KEYS.users, users);
}

/* ---------------- business accounts ---------------- */
const SD_BUSINESS_TYPES = [
  "School / Athletic Program", "Club / League", "Event or Race Organizer",
  "Hotel / Hospitality", "Medical / Doctor's Office", "Airport / Airline / Transportation",
  "Restaurant / Food Service", "Corporate / Office", "Security / Public Safety",
  "Industrial / Trades", "Nonprofit / Organization", "Other",
];

function sdSignupBusiness(fields) {
  if (sdFindUser(fields.email)) return { ok: false, error: "An account with that email already exists." };
  const users = sdGetUsers();
  users.push({
    isBusiness: true,
    name: fields.contactName,
    email: fields.email,
    password: fields.password,
    businessName: fields.businessName,
    businessType: fields.businessType,
    ein: fields.ein,
    phone: fields.phone,
    address: fields.address,
    city: fields.city,
    state: fields.state,
    zip: fields.zip,
    points: 0,
    createdAt: new Date().toISOString(),
  });
  sdSet(SD_KEYS.users, users);
  sdSet(SD_KEYS.newsletter, Array.from(new Set([...sdGet(SD_KEYS.newsletter, []), fields.email])));
  sdSet(SD_KEYS.session, { email: fields.email, guest: false });
  return { ok: true };
}

/* ---------------- bulk order request form (Business tab) ---------------- */
function sdBulkCatalogHtml() {
  const products = typeof SD_PRODUCTS !== "undefined" ? SD_PRODUCTS : [];
  return `
    <div class="bulk-catalog">
      <table class="bulk-catalog-table">
        <thead><tr><th>Item</th><th>Category</th><th>Unit Price</th><th>Bulk Qty</th></tr></thead>
        <tbody>
          ${products.map((p) => `
            <tr>
              <td>${p.name}</td>
              <td class="cap">${p.category}</td>
              <td>${sdFormatPrice(p.price)}</td>
              <td><input type="number" min="0" value="0" class="qty-input" data-bulk-catalog-qty="${p.id}" /></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function sdBulkCatalogSelections() {
  const products = typeof SD_PRODUCTS !== "undefined" ? SD_PRODUCTS : [];
  return Array.from(document.querySelectorAll("[data-bulk-catalog-qty]"))
    .map((el) => {
      const qty = Math.max(0, Number(el.value) || 0);
      if (qty <= 0) return null;
      const product = products.find((p) => p.id === el.getAttribute("data-bulk-catalog-qty"));
      return product ? `${qty} x ${product.name} (${sdFormatPrice(product.price)} each)` : null;
    })
    .filter(Boolean);
}

function sdRenderBulkOrderForm(mountId, prefill = {}) {
  const mount = document.getElementById(mountId);
  if (!mount) return;

  mount.innerHTML = `
    <form id="bulkOrderForm">
      <div class="field">
        <label>What's this order for?</label>
        <div class="radio-row">
          <label><input type="radio" name="purpose" value="program" checked /> Team / Sports Program</label>
          <label><input type="radio" name="purpose" value="staff" /> Staff / Work Uniform Program</label>
          <label><input type="radio" name="purpose" value="event" /> One-Time Event (race, function, tournament...)</label>
        </div>
        <div class="field-hint">Hotels, medical offices, airports, restaurants and similar businesses — choose "Staff / Work Uniform Program."</div>
      </div>

      <div id="eventFields" style="display:none;">
        <div class="grid-2" style="gap:16px;">
          <div class="field"><label for="bEventName">Event Name</label><input type="text" id="bEventName" /></div>
          <div class="field"><label for="bEventDate">Event Date</label><input type="date" id="bEventDate" /></div>
        </div>
      </div>

      <div id="sportFields">
        <div class="field">
          <label>Sport(s) / Program(s)</label>
          ${sdChecklistHtml("sports", SD_SPORTS)}
          <div class="field" style="margin-top:10px;">
            <input type="text" id="bSportOther" placeholder="Other sport not listed" />
          </div>
        </div>
      </div>

      <div class="field">
        <label for="bOrgName">Business / Organization Name</label>
        <input type="text" id="bOrgName" value="${prefill.businessName || ""}" required />
      </div>
      <div class="grid-2" style="gap:16px;">
        <div class="field">
          <label for="bBusinessType">Business Type</label>
          <select id="bBusinessType">${SD_BUSINESS_TYPES.map((t) => `<option value="${t}" ${prefill.businessType === t ? "selected" : ""}>${t}</option>`).join("")}</select>
        </div>
        <div class="field">
          <label for="bEin">EIN (Employer ID Number)</label>
          <input type="text" id="bEin" placeholder="XX-XXXXXXX" value="${prefill.ein || ""}" />
          <div class="field-hint">Don't have one yet? Leave blank — we'll follow up.</div>
        </div>
      </div>

      <div class="grid-2" style="gap:16px;">
        <div class="field"><label for="bContactName">Contact Name</label><input type="text" id="bContactName" value="${prefill.name || ""}" required /></div>
        <div class="field"><label for="bPhone">Phone</label><input type="tel" id="bPhone" value="${prefill.phone || ""}" required /></div>
      </div>
      <div class="field">
        <label for="bEmail">Business Email</label>
        <input type="email" id="bEmail" value="${prefill.email || ""}" required />
      </div>

      <div class="field"><label for="bAddress">Delivery Address</label><input type="text" id="bAddress" value="${prefill.address || ""}" required /></div>
      <div class="grid-3-addr">
        <div class="field"><label for="bCity">City</label><input type="text" id="bCity" value="${prefill.city || ""}" required /></div>
        <div class="field"><label for="bState">State</label>${sdStateSelectHtml("bState", true, prefill.state || "")}</div>
        <div class="field"><label for="bZip">ZIP Code</label><input type="text" id="bZip" value="${prefill.zip || ""}" required /></div>
      </div>

      <div class="field">
        <label>Uniform / Apparel Types Needed</label>
        ${sdChecklistHtml("apparel", SD_APPAREL_TYPES)}
      </div>

      <div class="field">
        <label for="bColors">Team Colors / Design Notes</label>
        <textarea id="bColors" rows="2" placeholder="e.g. Purple &amp; gold, wordmark on chest, numbers on back"></textarea>
      </div>

      <div class="field">
        <label>Custom Uniform Size Breakdown</label>
        ${sdSizeGridHtml("bulk")}
      </div>

      <div class="field">
        <label><input type="checkbox" id="bWantsCatalog" style="width:auto;display:inline-block;margin-right:8px;" /> Also bulk order standard catalog items (tees, hoodies, bags, accessories...)</label>
        <div id="catalogSection" style="display:none;margin-top:14px;">${sdBulkCatalogHtml()}</div>
      </div>

      <div class="field">
        <label for="bLogoUpload">Logo &amp; Design Files</label>
        <input type="file" id="bLogoUpload" multiple accept="image/*,.pdf,.ai,.eps" />
        <div class="field-hint">Selecting files here just confirms what you have ready — since this form can't attach files automatically, please also attach them to the confirmation email before sending.</div>
      </div>

      <div class="field">
        <label for="bExistingUniform">Existing Uniform Photos (optional)</label>
        <input type="file" id="bExistingUniform" multiple accept="image/*,.pdf" />
        <div class="field-hint">Replacing or refreshing a current uniform? Upload photos of what you have now and we can match or update the same style. Attach these to the confirmation email too.</div>
      </div>

      <div class="grid-2" style="gap:16px;">
        <div class="field"><label for="bNeededBy">Needed By</label><input type="date" id="bNeededBy" /></div>
        <div class="field">
          <label>Payment Preference</label>
          <div class="radio-row">
            <label><input type="radio" name="payment" value="full" checked /> Pay in Full (Square Invoice)</label>
            <label><input type="radio" name="payment" value="layaway" /> Layaway (60% now, 40% at completion)</label>
          </div>
        </div>
      </div>

      <div class="field">
        <label for="bNotes">Additional Notes</label>
        <textarea id="bNotes" rows="3" placeholder="Roster/name-and-number needs, prior order references, anything else we should know"></textarea>
      </div>

      <div class="form-alert" id="bulkAlert"></div>
      <button type="submit" class="btn btn-gold btn-block">Submit Bulk Order Request</button>
      <p class="form-note">This sends your request to our team for a custom quote — we'll follow up by email within 1-2 business days.</p>
    </form>
  `;

  sdBindSizeGrid("bulk");

  const purposeRadios = mount.querySelectorAll('input[name="purpose"]');
  const eventFields = document.getElementById("eventFields");
  const sportFields = document.getElementById("sportFields");
  purposeRadios.forEach((r) => r.addEventListener("change", () => {
    const purpose = mount.querySelector('input[name="purpose"]:checked').value;
    eventFields.style.display = purpose === "event" ? "block" : "none";
    sportFields.style.display = purpose === "program" ? "block" : "none";
  }));

  const catalogCheckbox = document.getElementById("bWantsCatalog");
  const catalogSection = document.getElementById("catalogSection");
  catalogCheckbox.addEventListener("change", () => {
    catalogSection.style.display = catalogCheckbox.checked ? "block" : "none";
  });

  document.getElementById("bulkOrderForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const purpose = mount.querySelector('input[name="purpose"]:checked').value;
    const payment = mount.querySelector('input[name="payment"]:checked').value;
    const sports = sdCheckedValues("sports");
    const otherSport = document.getElementById("bSportOther").value.trim();
    if (otherSport) sports.push(otherSport);
    const apparel = sdCheckedValues("apparel");
    const sizeTotal = sdSizeGridTotal("bulk");
    const sizeBreakdown = sdSizeGridBreakdown("bulk");
    const catalogItems = catalogCheckbox.checked ? sdBulkCatalogSelections() : [];

    const alertEl = document.getElementById("bulkAlert");
    if (apparel.length > 0 && sizeTotal > 0 && sizeTotal < SD_BULK_MINIMUM) {
      alertEl.textContent = `Custom uniform orders need a ${SD_BULK_MINIMUM}-piece minimum — you're at ${sizeTotal}. Adjust your sizes or add a note if you're combining orders.`;
      alertEl.className = "form-alert show error";
      return;
    }
    if (apparel.length === 0 && catalogItems.length === 0) {
      alertEl.textContent = "Select at least one apparel type, or check the box to bulk order standard catalog items.";
      alertEl.className = "form-alert show error";
      return;
    }

    const orgName = document.getElementById("bOrgName").value.trim();
    const email = document.getElementById("bEmail").value.trim();
    const state = document.getElementById("bState").value;
    const city = document.getElementById("bCity").value.trim();

    const summary = {
      purpose,
      eventName: document.getElementById("bEventName").value.trim(),
      eventDate: document.getElementById("bEventDate").value,
      sports,
      orgName,
      businessType: document.getElementById("bBusinessType").value,
      ein: document.getElementById("bEin").value.trim(),
      contactName: document.getElementById("bContactName").value.trim(),
      phone: document.getElementById("bPhone").value.trim(),
      email,
      address: document.getElementById("bAddress").value.trim(),
      city, state, zip: document.getElementById("bZip").value.trim(),
      apparel,
      colors: document.getElementById("bColors").value.trim(),
      sizeBreakdown, sizeTotal,
      catalogItems,
      neededBy: document.getElementById("bNeededBy").value,
      payment,
      notes: document.getElementById("bNotes").value.trim(),
      logoFileCount: document.getElementById("bLogoUpload").files.length,
      existingUniformFileCount: document.getElementById("bExistingUniform").files.length,
    };

    sdRecordOrder({
      type: "business",
      email, state, city, zip: summary.zip,
      total: null,
      items: [...apparel, ...catalogItems],
      meta: summary,
    });

    const purposeLabel = purpose === "event" ? "One-Time Event" : purpose === "staff" ? "Staff / Work Uniform Program" : "Team / Sports Program";
    const bodyLines = [
      `Order purpose: ${purposeLabel}`,
      purpose === "event" ? `Event: ${summary.eventName} on ${summary.eventDate}`
        : purpose === "program" ? `Sports: ${sports.join(", ") || "(none selected)"}`
        : "",
      ``,
      `Organization: ${orgName}`,
      `Business Type: ${summary.businessType}`,
      `EIN: ${summary.ein || "(not provided)"}`,
      `Contact: ${summary.contactName} — ${summary.phone} — ${email}`,
      `Delivery Address: ${summary.address}, ${city}, ${state} ${summary.zip}`,
      ``,
      `Apparel Types: ${apparel.join(", ") || "(none)"}`,
      `Team Colors / Notes: ${summary.colors || "(none)"}`,
      `Size Breakdown: ${sizeBreakdown || "(none)"}  |  Total custom pieces: ${sizeTotal}`,
      catalogItems.length ? `Bulk Catalog Items:\n- ${catalogItems.join("\n- ")}` : "",
      ``,
      `Needed By: ${summary.neededBy || "(not specified)"}`,
      `Payment Preference: ${payment === "layaway" ? "Layaway (60% now / 40% at completion)" : "Pay in Full via Square Invoice"}`,
      `Additional Notes: ${summary.notes || "(none)"}`,
      ``,
      `[Remember to attach: ${summary.logoFileCount} logo/design file(s), ${summary.existingUniformFileCount} existing-uniform photo(s) selected on the form]`,
    ].filter(Boolean);

    const mailLink = `mailto:business@sododumaki.com?subject=${encodeURIComponent("Bulk Order Request — " + orgName)}&body=${encodeURIComponent(bodyLines.join("\n"))}`;

    alertEl.innerHTML = `Request saved. <a href="${mailLink}" style="color:inherit;text-decoration:underline;font-weight:700;">Click here to email it to our team</a> — attach your logo and uniform files to that email before sending.`;
    alertEl.className = "form-alert show success";
    window.location.href = mailLink;
  });
}
