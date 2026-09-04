/* ==========================================================================
   ELITE THREAD — Product & Category Data
   ==========================================================================
   This is the ONLY file you need to touch to add, edit or remove a product.

   TO ADD A PRODUCT:
   1. Add image(s) to /images/products/ named like: et-00X-1.jpg, et-00X-2.jpg
   2. Copy one object below, give it a new unique "id", fill in the fields.
   3. Save. It will automatically appear in Shop, its category page, search,
      related products, and Featured / New Arrivals sections if flagged.

   FIELD NOTES:
   - price: number only (no commas/currency symbol) — formatted at display time
   - category: must exactly match a "slug" from CATEGORIES below
   - type: subcategory label, shown on product cards (free text, keep short)
   - images: array of paths, first image is the primary/cover image
   - keywords: extra searchable terms (colours, styles, alt names)
   - available: set to false to show "Currently Unavailable" and disable orders
   ========================================================================== */

const CATEGORIES = [
  {
    slug: "casual-wear",
    name: "Casual Wear",
    page: "categories/casual-wear.html",
    intro: "Everyday pieces built around comfort, movement and a bit of edge — the wear for the days you're not reporting to anyone."
  },
  {
    slug: "official-wear",
    name: "Official Wear",
    page: "categories/official-wear.html",
    intro: "Smart, considered pieces for the office and the occasions after it — sharp without trying too hard."
  },
  {
    slug: "footwear",
    name: "Footwear",
    page: "categories/footwear.html",
    intro: "Sneakers, boots, trainers and slides — the collection that carries everything else."
  },
  {
    slug: "mens-clothing",
    name: "Men's Clothing",
    page: "categories/mens-clothing.html",
    intro: "Polos, jeans, shirts and layers built for the everyday Nairobi rotation."
  },
  {
    slug: "mens-footwear",
    name: "Men's Footwear",
    page: "categories/mens-footwear.html",
    intro: "Boots, sneakers, trainers and slippers, chosen for how they'll actually get worn."
  },
  {
    slug: "accessories",
    name: "Accessories",
    page: "categories/accessories.html",
    intro: "The finishing details — coming soon to ELITE THREAD."
  }
];

const PRODUCTS = [
  {
    id: "et-001",
    name: "Wallabee-Style Boot — Cream Suede, Orange Shearling",
    category: "mens-footwear",
    type: "Boots",
    brand: "",
    price: 3500,
    currency: "KES",
    color: "Cream",
    images: ["images/products/et-001-1.jpg", "images/products/et-001-2.jpg"],
    shortDescription: "A cream suede boot with orange shearling trim, built for cold mornings and long days.",
    description: "A cream suede boot finished with warm orange shearling at the collar. The moc-toe construction and crepe-style sole bring a relaxed, worn-in character from the first wear. Pairs equally well with jeans or tapered trousers.",
    keywords: ["boots", "wallabee", "cream boots", "suede boots", "men's footwear", "shearling"],
    featured: true,
    newArrival: true,
    available: true
  },
  {
    id: "et-002",
    name: "Casual Sneaker — Light Blue",
    category: "mens-footwear",
    type: "Sneakers",
    brand: "",
    price: 0,
    priceOnRequest: true,
    currency: "KES",
    color: "Light Blue",
    images: ["images/products/et-002-1.jpg"],
    shortDescription: "A light blue casual sneaker for everyday wear. Price to be confirmed.",
    description: "A light blue low-top sneaker with a clean, casual silhouette that goes with almost anything in the everyday rotation. Message us on WhatsApp for current pricing and availability.",
    keywords: ["sneakers", "light blue sneaker", "casual sneaker", "men's footwear"],
    featured: true,
    newArrival: false,
    available: true
  },
  {
    id: "et-003",
    name: "Men's Polo Shirt",
    category: "mens-clothing",
    type: "Polo Shirts",
    brand: "",
    price: 1300,
    currency: "KES",
    color: "White, Blue, Black, Beige",
    images: ["images/products/et-003-1.jpg"],
    shortDescription: "A classic polo shirt, available in four colourways.",
    description: "A wardrobe staple cut for a clean, everyday fit. Available in white, blue, black and beige — order the colour you'd like via WhatsApp.",
    keywords: ["polo", "polo shirt", "men's clothing", "casual wear", "white polo", "blue polo", "black polo", "beige polo"],
    featured: true,
    newArrival: false,
    available: true
  },
  {
    id: "et-004",
    name: "Crocodile-Embroidered Slippers — Black & Grey",
    category: "mens-footwear",
    type: "Slippers",
    brand: "",
    price: 3500,
    currency: "KES",
    color: "Black, Grey",
    images: ["images/products/et-004-1.jpg"],
    shortDescription: "Black and grey slides with a crocodile embroidery detail.",
    description: "A slide built for comfort with a black and grey colourway and a crocodile embroidery detail across the strap. An easy everyday off-duty piece.",
    keywords: ["slippers", "slides", "crocodile", "men's footwear", "black slides"],
    featured: false,
    newArrival: true,
    available: true
  },
  {
    id: "et-005",
    name: "CRUX Jeans — Tan / Beige",
    category: "mens-clothing",
    type: "Jeans",
    brand: "CRUX",
    price: 1500,
    currency: "KES",
    color: "Tan / Beige",
    images: ["images/products/et-005-1.jpg"],
    shortDescription: "A tan/beige straight-leg jean from CRUX.",
    description: "A tan and beige jean cut for an easy, everyday fit. A versatile neutral that carries from casual to smart-casual with the right top layer.",
    keywords: ["jeans", "crux", "tan jeans", "beige jeans", "men's clothing", "casual wear"],
    featured: false,
    newArrival: true,
    available: true
  },
  {
    id: "et-006",
    name: "Shox-Style Trainer — Black with Turquoise Accents",
    category: "mens-footwear",
    type: "Trainers",
    brand: "",
    price: 3800,
    currency: "KES",
    color: "Black / Turquoise",
    images: ["images/products/et-006-1.jpg"],
    shortDescription: "A black trainer with turquoise accents and a visible cushioned sole.",
    description: "A black trainer with turquoise accent detailing and a visible cushioned sole unit for all-day comfort. A statement piece for anyone who wants their footwear doing some of the talking.",
    keywords: ["trainers", "shox", "black trainers", "turquoise", "men's footwear", "sneakers"],
    featured: true,
    newArrival: false,
    available: true
  }
];
