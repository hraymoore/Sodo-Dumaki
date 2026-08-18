/* ============================================
   SODO DUMAKI — Product Catalog
   `image` values are self-contained placeholder
   SVGs — swap for real product photography when
   ready. `squareLink` is empty until you paste in
   this item's Payment Link URL from the Square
   Dashboard (Payments -> Payment Links). See
   README.md for the full walkthrough.
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
  { id: "sd-101", name: "Dumaki Elite Performance Tee", category: "tops", price: 38, badge: "Bestseller",
    squareLink: null, // paste this item's Square Payment Link URL here
    image: sdPlaceholder("SODO DUMAKI\\nElite Tee", "4b2e83", "ffffff") },
  { id: "sd-102", name: "Dumaki Elite Performance Tee — Gold Edition", category: "tops", price: 42,
    squareLink: null, // paste this item's Square Payment Link URL here
    image: sdPlaceholder("SODO DUMAKI\\nGold Tee", "0b0b0d", "d4af37") },
  { id: "sd-103", name: "Sodo Signature Crewneck Hoodie", category: "tops", price: 78, badge: "Bestseller",
    squareLink: null, // paste this item's Square Payment Link URL here
    image: sdPlaceholder("SIGNATURE\\nHOODIE", "2e1a54", "ffffff") },
  { id: "sd-104", name: "Sodo Pullover Hoodie — Charcoal", category: "tops", price: 82,
    squareLink: null, // paste this item's Square Payment Link URL here
    image: sdPlaceholder("CHARCOAL\\nHOODIE", "3a3a3f", "d4af37") },
  { id: "sd-105", name: "Dumaki Warmup Half-Zip", category: "tops", price: 64,
    squareLink: null, // paste this item's Square Payment Link URL here
    image: sdPlaceholder("WARMUP\\nHALF-ZIP", "6b6b70", "0b0b0d") },
  { id: "sd-106", name: "Sodo Compression Long Sleeve", category: "tops", price: 46,
    squareLink: null, // paste this item's Square Payment Link URL here
    image: sdPlaceholder("COMPRESSION\\nLONG SLEEVE", "0b0b0d", "ffffff") },

  // ---- Bottoms ----
  { id: "sd-201", name: "Dumaki Performance Shorts", category: "bottoms", price: 42,
    squareLink: null, // paste this item's Square Payment Link URL here
    image: sdPlaceholder("PERFORMANCE\\nSHORTS", "4b2e83", "d4af37") },
  { id: "sd-202", name: "Sodo Tapered Joggers", category: "bottoms", price: 58, badge: "Bestseller",
    squareLink: null, // paste this item's Square Payment Link URL here
    image: sdPlaceholder("TAPERED\\nJOGGERS", "0b0b0d", "ffffff") },
  { id: "sd-203", name: "Dumaki Compression Tights", category: "bottoms", price: 48,
    squareLink: null, // paste this item's Square Payment Link URL here
    image: sdPlaceholder("COMPRESSION\\nTIGHTS", "3a3a3f", "ffffff") },

  // ---- Outerwear ----
  { id: "sd-301", name: "Sodo Full-Zip Track Jacket", category: "outerwear", price: 96,
    squareLink: null, // paste this item's Square Payment Link URL here
    image: sdPlaceholder("TRACK\\nJACKET", "2e1a54", "d4af37") },
  { id: "sd-302", name: "Dumaki Coach's Bench Jacket", category: "outerwear", price: 148, badge: "New",
    squareLink: null, // paste this item's Square Payment Link URL here
    image: sdPlaceholder("BENCH\\nJACKET", "0b0b0d", "d4af37") },
  { id: "sd-303", name: "Sodo Windbreaker Anorak", category: "outerwear", price: 88,
    squareLink: null, // paste this item's Square Payment Link URL here
    image: sdPlaceholder("WINDBREAKER\\nANORAK", "4b2e83", "ffffff") },

  // ---- Headwear ----
  { id: "sd-401", name: "Dumaki Structured Snapback", category: "headwear", price: 34,
    squareLink: null, // paste this item's Square Payment Link URL here
    image: sdPlaceholder("SNAPBACK", "0b0b0d", "d4af37") },
  { id: "sd-402", name: "Sodo Performance Beanie", category: "headwear", price: 28,
    squareLink: null, // paste this item's Square Payment Link URL here
    image: sdPlaceholder("BEANIE", "3a3a3f", "ffffff") },
  { id: "sd-403", name: "Dumaki Bucket Hat", category: "headwear", price: 32,
    squareLink: null, // paste this item's Square Payment Link URL here
    image: sdPlaceholder("BUCKET HAT", "4b2e83", "d4af37") },

  // ---- Bags ----
  { id: "sd-501", name: "Sodo Elite Duffel Bag", category: "bags", price: 95, badge: "Bestseller",
    squareLink: null, // paste this item's Square Payment Link URL here
    image: sdPlaceholder("ELITE\\nDUFFEL", "0b0b0d", "ffffff") },
  { id: "sd-502", name: "Dumaki Court Backpack", category: "bags", price: 85,
    squareLink: null, // paste this item's Square Payment Link URL here
    image: sdPlaceholder("COURT\\nBACKPACK", "2e1a54", "d4af37") },
  { id: "sd-503", name: "Sodo Mini Gym Sack", category: "bags", price: 25,
    squareLink: null, // paste this item's Square Payment Link URL here
    image: sdPlaceholder("GYM SACK", "6b6b70", "0b0b0d") },

  // ---- Accessories ----
  { id: "sd-601", name: "Dumaki Crew Socks (3-Pack)", category: "accessories", price: 22,
    squareLink: null, // paste this item's Square Payment Link URL here
    image: sdPlaceholder("CREW SOCKS\\n3-PACK", "4b2e83", "ffffff") },
  { id: "sd-602", name: "Sodo Performance Gloves", category: "accessories", price: 30,
    squareLink: null, // paste this item's Square Payment Link URL here
    image: sdPlaceholder("PERFORMANCE\\nGLOVES", "0b0b0d", "d4af37") },
  { id: "sd-603", name: "Dumaki Stainless Water Bottle", category: "accessories", price: 28,
    squareLink: null, // paste this item's Square Payment Link URL here
    image: sdPlaceholder("WATER\\nBOTTLE", "3a3a3f", "ffffff") },
  { id: "sd-604", name: "Sodo Wristband Set", category: "accessories", price: 15,
    squareLink: null, // paste this item's Square Payment Link URL here
    image: sdPlaceholder("WRISTBAND\\nSET", "d4af37", "0b0b0d") },
];

function sdFormatPrice(n) {
  return "$" + n.toFixed(2).replace(/\.00$/, "");
}
