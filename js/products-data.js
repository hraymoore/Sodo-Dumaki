/* ============================================
   SODO DUMAKI — Product Catalog
   `image` values are self-contained placeholder
   SVGs — swap for real product photography when
   ready. `squareLink` is empty until you paste in
   this item's Payment Link URL from the Square
   Dashboard (Payments -> Payment Links). See
   README.md for the full walkthrough.

   `type` — the specific style within a category
   (e.g. "Tee" vs "Hoodie" within Tops). Drives the
   Type filter on products.html alongside the main
   category tabs.
   `customizable: true` — this design is capped at
   SD_COLORWAY_CAP units per base+thread colorway
   (see js/commerce.js), same as the rest of the
   signature line. `customizable: false` items (the
   Essential basics + hard goods) still get the same
   base+thread customize box, just uncapped — they're
   meant to restock indefinitely.
   `blankSku` — a realistic reference blank garment
   for sourcing/production (confirm with your actual
   supplier before ordering — shown for planning
   purposes).
   ============================================ */

const SD_CATEGORIES = [
  { id: "all", label: "All Products" },
  { id: "tops", label: "Tops" },
  { id: "bottoms", label: "Bottoms" },
  { id: "outerwear", label: "Outerwear" },
  { id: "headwear", label: "Headwear" },
  { id: "bags", label: "Bags" },
  { id: "accessories", label: "Accessories" },
];

function sdPlaceholder(text, bg, fg) {
  const w = 700, h = 875, fontSize = 42;
  const lines = text.split("\\n");
  const startY = h / 2 - ((lines.length - 1) * fontSize * 0.75) / 2 + fontSize * 0.35;
  const texts = lines
    .map((line, i) => {
      const y = Math.round(startY + i * fontSize * 0.75);
      return `<text x="${w / 2}" y="${y}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="${fontSize}" letter-spacing="2" fill="#${fg}">${line}</text>`;
    })
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="#${bg}"/>${texts}</svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

const SD_PRODUCTS = [
  // ---- Tops ----
  { id: "sd-101", name: "Dumaki Elite Performance Tee", category: "tops", type: "Tee", price: 38, badge: "Bestseller",
    customizable: true, blankSku: "Bella+Canvas 3001 — Unisex Jersey Tee",
    squareLink: null, // paste this item's Square Payment Link URL here
    image: sdPlaceholder("SODO DUMAKI\\nElite Tee", "4b2e83", "ffffff") },
  { id: "sd-102", name: "Dumaki Elite Performance Tee — Gold Edition", category: "tops", type: "Tee", price: 42,
    customizable: true, blankSku: "Bella+Canvas 3001 — Unisex Jersey Tee",
    squareLink: null, // paste this item's Square Payment Link URL here
    image: sdPlaceholder("SODO DUMAKI\\nGold Tee", "0b0b0d", "d4af37") },
  { id: "sd-103", name: "Sodo Signature Crewneck Hoodie", category: "tops", type: "Hoodie", price: 78, badge: "Bestseller",
    customizable: true, blankSku: "Independent Trading Co. SS4500 — Midweight Hoodie",
    squareLink: null, // paste this item's Square Payment Link URL here
    image: sdPlaceholder("SIGNATURE\\nHOODIE", "2e1a54", "ffffff") },
  { id: "sd-104", name: "Sodo Pullover Hoodie — Charcoal", category: "tops", type: "Hoodie", price: 82,
    customizable: true, blankSku: "Independent Trading Co. SS4500 — Midweight Hoodie",
    squareLink: null, // paste this item's Square Payment Link URL here
    image: sdPlaceholder("CHARCOAL\\nHOODIE", "3a3a3f", "d4af37") },
  { id: "sd-105", name: "Dumaki Warmup Half-Zip", category: "tops", type: "Half-Zip", price: 64,
    customizable: true, blankSku: "Augusta Sportswear 5401 — Half-Zip Pullover",
    squareLink: null, // paste this item's Square Payment Link URL here
    image: sdPlaceholder("WARMUP\\nHALF-ZIP", "6b6b70", "0b0b0d") },
  { id: "sd-106", name: "Sodo Compression Long Sleeve", category: "tops", type: "Long Sleeve", price: 46,
    customizable: true, blankSku: "Performance poly/spandex compression blank",
    squareLink: null, // paste this item's Square Payment Link URL here
    image: sdPlaceholder("COMPRESSION\\nLONG SLEEVE", "0b0b0d", "ffffff") },
  { id: "sd-107", name: "Sodo Essential Tee", category: "tops", type: "Tee", price: 24,
    customizable: false, blankSku: "Gildan 64000 — Softstyle Tee",
    squareLink: null, // paste this item's Square Payment Link URL here
    image: sdPlaceholder("ESSENTIAL\\nTEE", "3a3a3f", "ffffff") },
  { id: "sd-108", name: "Sodo Essential Pocket Tee", category: "tops", type: "Tee", price: 26,
    customizable: false, blankSku: "Comfort Colors 6030 — Pocket Tee",
    squareLink: null, // paste this item's Square Payment Link URL here
    image: sdPlaceholder("ESSENTIAL\\nPOCKET TEE", "6b6b70", "0b0b0d") },

  // ---- Bottoms ----
  { id: "sd-201", name: "Dumaki Performance Shorts", category: "bottoms", type: "Shorts", price: 42,
    customizable: true, blankSku: "Badger Sport B-Core Short",
    squareLink: null, // paste this item's Square Payment Link URL here
    image: sdPlaceholder("PERFORMANCE\\nSHORTS", "4b2e83", "d4af37") },
  { id: "sd-202", name: "Sodo Tapered Joggers", category: "bottoms", type: "Joggers", price: 58, badge: "Bestseller",
    customizable: true, blankSku: "Independent Trading Co. IND20PNT — Fleece Pant",
    squareLink: null, // paste this item's Square Payment Link URL here
    image: sdPlaceholder("TAPERED\\nJOGGERS", "0b0b0d", "ffffff") },
  { id: "sd-203", name: "Dumaki Compression Tights", category: "bottoms", type: "Tights", price: 48,
    customizable: true, blankSku: "Performance poly/spandex compression blank",
    squareLink: null, // paste this item's Square Payment Link URL here
    image: sdPlaceholder("COMPRESSION\\nTIGHTS", "3a3a3f", "ffffff") },

  // ---- Outerwear ----
  { id: "sd-301", name: "Sodo Full-Zip Track Jacket", category: "outerwear", type: "Track Jacket", price: 96,
    customizable: true, blankSku: "Augusta Sportswear 4295 — Medalist Jacket",
    squareLink: null, // paste this item's Square Payment Link URL here
    image: sdPlaceholder("TRACK\\nJACKET", "2e1a54", "d4af37") },
  { id: "sd-302", name: "Dumaki Coach's Bench Jacket", category: "outerwear", type: "Bench Jacket", price: 148, badge: "New",
    customizable: true, blankSku: "Holloway Coach's Jacket — Heavyweight",
    squareLink: null, // paste this item's Square Payment Link URL here
    image: sdPlaceholder("BENCH\\nJACKET", "0b0b0d", "d4af37") },
  { id: "sd-303", name: "Sodo Windbreaker Anorak", category: "outerwear", type: "Anorak", price: 88,
    customizable: true, blankSku: "Team 365 TT77 — Zone Protect Anorak",
    squareLink: null, // paste this item's Square Payment Link URL here
    image: sdPlaceholder("WINDBREAKER\\nANORAK", "4b2e83", "ffffff") },

  // ---- Headwear ----
  { id: "sd-401", name: "Dumaki Structured Snapback", category: "headwear", type: "Snapback", price: 34,
    customizable: true, blankSku: "Yupoong 6089M — Structured Snapback",
    squareLink: null, // paste this item's Square Payment Link URL here
    image: sdPlaceholder("SNAPBACK", "0b0b0d", "d4af37") },
  { id: "sd-402", name: "Sodo Performance Beanie", category: "headwear", type: "Beanie", price: 28,
    customizable: true, blankSku: "Yupoong 1501KC — Cuffed Knit Beanie",
    squareLink: null, // paste this item's Square Payment Link URL here
    image: sdPlaceholder("BEANIE", "3a3a3f", "ffffff") },
  { id: "sd-403", name: "Dumaki Bucket Hat", category: "headwear", type: "Bucket Hat", price: 32,
    customizable: true, blankSku: "Yupoong 1500 — Cotton Twill Bucket Hat",
    squareLink: null, // paste this item's Square Payment Link URL here
    image: sdPlaceholder("BUCKET HAT", "4b2e83", "d4af37") },

  // ---- Bags ----
  { id: "sd-501", name: "Sodo Elite Duffel Bag", category: "bags", type: "Duffel", price: 95, badge: "Bestseller",
    customizable: true, blankSku: "OGIO Half Dome Duffel",
    squareLink: null, // paste this item's Square Payment Link URL here
    image: sdPlaceholder("ELITE\\nDUFFEL", "0b0b0d", "ffffff") },
  { id: "sd-502", name: "Dumaki Court Backpack", category: "bags", type: "Backpack", price: 85,
    customizable: true, blankSku: "OGIO Axle Pack",
    squareLink: null, // paste this item's Square Payment Link URL here
    image: sdPlaceholder("COURT\\nBACKPACK", "2e1a54", "d4af37") },
  { id: "sd-503", name: "Sodo Mini Gym Sack", category: "bags", type: "Gym Sack", price: 25,
    customizable: true, blankSku: "Liberty Bags 8886 — Drawstring Sack",
    squareLink: null, // paste this item's Square Payment Link URL here
    image: sdPlaceholder("GYM SACK", "6b6b70", "0b0b0d") },

  // ---- Accessories ----
  { id: "sd-601", name: "Dumaki Dri-Fit Designer Crew Socks (5-Pack)", category: "accessories", type: "Socks", price: 34,
    customizable: true, blankSku: "Knit-in logo, dri-fit crew sock blank",
    squareLink: null, // paste this item's Square Payment Link URL here
    image: sdPlaceholder("DRI-FIT SOCKS\\n5-PACK", "4b2e83", "ffffff") },
  { id: "sd-602", name: "Sodo Performance Gloves", category: "accessories", type: "Gloves", price: 30,
    customizable: false, blankSku: "Heat-transfer branding, custom trim color",
    squareLink: null, // paste this item's Square Payment Link URL here
    image: sdPlaceholder("PERFORMANCE\\nGLOVES", "0b0b0d", "d4af37") },
  { id: "sd-603", name: "Dumaki Stainless Water Bottle", category: "accessories", type: "Water Bottle", price: 28,
    customizable: false, blankSku: "Laser-etched branding, custom cap color",
    squareLink: null, // paste this item's Square Payment Link URL here
    image: sdPlaceholder("WATER\\nBOTTLE", "3a3a3f", "ffffff") },
  { id: "sd-604", name: "Sodo Wristband Set", category: "accessories", type: "Wristbands", price: 15,
    customizable: true, blankSku: "Knit-in logo, standard wristband blank",
    squareLink: null, // paste this item's Square Payment Link URL here
    image: sdPlaceholder("WRISTBAND\\nSET", "d4af37", "0b0b0d") },
];

function sdFormatPrice(n) {
  return "$" + n.toFixed(2).replace(/\.00$/, "");
}
