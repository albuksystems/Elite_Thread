/* ==========================================================================
   ELITE THREAD — Shared site engine
   Runs on every page. Reads PRODUCTS / CATEGORIES from products.js.
   Behaviour is driven by which elements exist on the current page, and by
   a `data-base` attribute on <body> ("" at the site root, "../" inside
   /categories/) so links and image paths resolve correctly either way.
   ========================================================================== */

(function () {
  "use strict";

  const WHATSAPP_NUMBER = "254758575588"; // no leading + or spaces, for wa.me links
  const BASE = document.body.getAttribute("data-base") || "";

  /* ---------------- Helpers ---------------- */

  function formatPrice(product) {
    if (product.priceOnRequest || !product.price) return "Price on request";
    return "KES " + product.price.toLocaleString("en-KE");
  }

  function categoryName(slug) {
    const cat = CATEGORIES.find((c) => c.slug === slug);
    return cat ? cat.name : slug;
  }

  function buildWhatsAppLink(product) {
    const lines = [
      "Hello ELITE THREAD, I am interested in:",
      product.name,
      product.priceOnRequest || !product.price ? "Price: please confirm" : "Price: " + formatPrice(product),
      "",
      "Please let me know if it is available."
    ];
    const text = encodeURIComponent(lines.join("\n"));
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + text;
  }

  function generalWhatsAppLink(message) {
    const text = encodeURIComponent(message || "Hello ELITE THREAD, I'd like to know more about your pieces.");
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + text;
  }

  function productHref(id) {
    return BASE + "product.html?id=" + encodeURIComponent(id);
  }

  function imgPath(path) {
    return BASE + path;
  }

  function getParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  function matchesQuery(product, query) {
    const haystack = [
      product.name,
      product.category,
      categoryName(product.category),
      product.type,
      product.brand,
      product.color,
      product.description,
      product.shortDescription,
      ...(product.keywords || [])
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(query.toLowerCase());
  }

  /* ---------------- Product card rendering ---------------- */

  function productCardHTML(product) {
    const unavailable = product.available === false;
    return `
      <article class="product-card">
        <a href="${productHref(product.id)}" class="product-card__image" aria-label="View ${escapeHTML(product.name)}">
          ${unavailable ? `<span class="product-card__tag product-card__tag--unavailable">Unavailable</span>` : (product.newArrival ? `<span class="product-card__tag">New</span>` : "")}
          <img src="${imgPath(product.images[0])}" alt="${escapeHTML(product.name)}" loading="lazy" onerror="this.src='${imgPath('images/products/placeholder.svg')}'">
        </a>
        <div class="product-card__type">${escapeHTML(product.type)}</div>
        <a href="${productHref(product.id)}"><h3 class="product-card__name">${escapeHTML(product.name)}</h3></a>
        <div class="product-card__price mono">${formatPrice(product)}</div>
        <div class="product-card__actions">
          <a class="btn btn--sm" href="${productHref(product.id)}">View</a>
          ${unavailable
            ? `<span class="btn btn--sm" aria-disabled="true" style="opacity:.4;pointer-events:none;">Sold out</span>`
            : `<a class="btn btn--sm btn--gold" href="${buildWhatsAppLink(product)}" target="_blank" rel="noopener">WhatsApp</a>`}
        </div>
      </article>`;
  }

  function escapeHTML(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderGrid(container, products) {
    if (!container) return;
    if (products.length === 0) {
      container.innerHTML = "";
      return;
    }
    container.innerHTML = products.map(productCardHTML).join("");
  }

  function renderEmptyState(target, onClear) {
    target.innerHTML = `
      <div class="empty-state">
        <h3>No products found</h3>
        <p>Try another search term, or browse our categories instead.</p>
        <button class="btn" type="button" id="clear-filters-btn">Clear filters</button>
      </div>`;
    const btn = target.querySelector("#clear-filters-btn");
    if (btn) btn.addEventListener("click", onClear);
  }

  /* ---------------- Mobile nav ---------------- */

  function initMobileNav() {
    const toggle = document.querySelector("[data-nav-toggle]");
    const drawer = document.querySelector("[data-mobile-nav]");
    const closeBtn = document.querySelector("[data-nav-close]");
    if (!toggle || !drawer) return;

    function open() {
      drawer.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }
    function close() {
      drawer.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
    toggle.addEventListener("click", () => {
      drawer.classList.contains("is-open") ? close() : open();
    });
    if (closeBtn) closeBtn.addEventListener("click", close);
    drawer.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  /* ---------------- Search overlay ---------------- */

  function initSearchOverlay() {
    const openBtns = document.querySelectorAll("[data-search-open]");
    const overlay = document.querySelector("[data-search-overlay]");
    if (!overlay) return;
    const closeBtn = overlay.querySelector("[data-search-close]");
    const input = overlay.querySelector("input[type='search']");
    const resultsEl = overlay.querySelector("[data-search-results]");

    function open() {
      overlay.classList.add("is-open");
      document.body.style.overflow = "hidden";
      setTimeout(() => input && input.focus(), 50);
    }
    function close() {
      overlay.classList.remove("is-open");
      document.body.style.overflow = "";
    }
    openBtns.forEach((b) => b.addEventListener("click", open));
    if (closeBtn) closeBtn.addEventListener("click", close);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });

    if (input) {
      input.addEventListener("input", () => {
        const q = input.value.trim();
        if (q.length < 2) {
          resultsEl.innerHTML = "";
          return;
        }
        const matches = PRODUCTS.filter((p) => matchesQuery(p, q)).slice(0, 8);
        if (matches.length === 0) {
          resultsEl.innerHTML = `<p class="search-empty">No products found for "${escapeHTML(q)}".</p>`;
          return;
        }
        resultsEl.innerHTML = matches
          .map(
            (p) => `
          <a href="${productHref(p.id)}">
            <img src="${imgPath(p.images[0])}" alt="" loading="lazy">
            <span>${escapeHTML(p.name)}<br><span class="mono" style="color:var(--gold-dim);font-size:.78rem;">${formatPrice(p)}</span></span>
          </a>`
          )
          .join("");
      });
      input.closest("form").addEventListener("submit", (e) => e.preventDefault());
    }
  }

  /* ---------------- Featured / New arrivals (home) ---------------- */

  function initHomeSections() {
    const featuredEl = document.querySelector("[data-featured-grid]");
    const arrivalsEl = document.querySelector("[data-arrivals-grid]");
    if (featuredEl) renderGrid(featuredEl, PRODUCTS.filter((p) => p.featured).slice(0, 8));
    if (arrivalsEl) renderGrid(arrivalsEl, PRODUCTS.filter((p) => p.newArrival).slice(0, 8));

    const catGrid = document.querySelector("[data-category-grid]");
    if (catGrid) {
      catGrid.innerHTML = CATEGORIES.map((c) => {
        const count = PRODUCTS.filter((p) => p.category === c.slug).length;
        return `
          <a class="cat-card" href="${imgPath(c.page)}">
            <img src="${imgPath('images/categories/' + c.slug + '.jpg')}" alt="${escapeHTML(c.name)}" loading="lazy" onerror="this.src='${imgPath('images/categories/placeholder.svg')}'">
            <span class="cat-card__label">${escapeHTML(c.name)}<span>${count > 0 ? count + " piece" + (count === 1 ? "" : "s") : "Coming soon"}</span></span>
          </a>`;
      }).join("");
    }
  }

  /* ---------------- Shop / Category listing (shared filter engine) ---------------- */

  function initListingPage() {
    const grid = document.querySelector("[data-listing-grid]");
    if (!grid) return;

    const fixedCategory = document.body.getAttribute("data-category") || "";
    const searchInput = document.querySelector("[data-listing-search]");
    const categorySelect = document.querySelector("[data-filter-category]");
    const typeSelect = document.querySelector("[data-filter-type]");
    const sortSelect = document.querySelector("[data-filter-sort]");
    const countEl = document.querySelector("[data-results-count]");
    const drawer = document.querySelector("[data-filter-drawer]");
    const drawerOpen = document.querySelector("[data-filter-open]");
    const drawerClose = document.querySelector("[data-filter-close]");
    const applyBtn = document.querySelector("[data-filter-apply]");

    const pool = fixedCategory ? PRODUCTS.filter((p) => p.category === fixedCategory) : PRODUCTS.slice();

    // Populate category filter (shop page only — category pages are pre-scoped)
    if (categorySelect && !fixedCategory) {
      CATEGORIES.forEach((c) => {
        const opt = document.createElement("option");
        opt.value = c.slug;
        opt.textContent = c.name;
        categorySelect.appendChild(opt);
      });
    }

    // Populate type filter from whatever's actually in the pool
    if (typeSelect) {
      const types = Array.from(new Set(pool.map((p) => p.type))).sort();
      types.forEach((t) => {
        const opt = document.createElement("option");
        opt.value = t;
        opt.textContent = t;
        typeSelect.appendChild(opt);
      });
    }

    function currentFilters() {
      return {
        q: searchInput ? searchInput.value.trim() : "",
        category: categorySelect ? categorySelect.value : "",
        type: typeSelect ? typeSelect.value : "",
        sort: sortSelect ? sortSelect.value : "newest"
      };
    }

    function applyFilters() {
      const f = currentFilters();
      let results = pool.filter((p) => {
        if (f.category && p.category !== f.category) return false;
        if (f.type && p.type !== f.type) return false;
        if (f.q && !matchesQuery(p, f.q)) return false;
        return true;
      });

      switch (f.sort) {
        case "price-asc":
          results.sort((a, b) => (a.price || 0) - (b.price || 0));
          break;
        case "price-desc":
          results.sort((a, b) => (b.price || 0) - (a.price || 0));
          break;
        case "name-asc":
          results.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default: // newest
          results.sort((a, b) => (b.newArrival === true) - (a.newArrival === true));
      }

      if (countEl) {
        countEl.textContent = results.length + (results.length === 1 ? " product found" : " products found");
      }

      if (results.length === 0) {
        renderEmptyState(grid, clearFilters);
      } else {
        renderGrid(grid, results);
      }
    }

    function clearFilters() {
      if (searchInput) searchInput.value = "";
      if (categorySelect) categorySelect.value = "";
      if (typeSelect) typeSelect.value = "";
      if (sortSelect) sortSelect.value = "newest";
      applyFilters();
    }

    [searchInput, categorySelect, typeSelect, sortSelect].forEach((el) => {
      if (!el) return;
      el.addEventListener("input", applyFilters);
      el.addEventListener("change", applyFilters);
    });

    if (drawerOpen && drawer) {
      drawerOpen.addEventListener("click", () => drawer.classList.add("is-open"));
    }
    if (drawerClose && drawer) {
      drawerClose.addEventListener("click", () => drawer.classList.remove("is-open"));
    }
    if (applyBtn && drawer) {
      applyBtn.addEventListener("click", () => {
        drawer.classList.remove("is-open");
        applyFilters();
      });
    }

    // Pre-fill search from a query param, e.g. shop.html?q=jeans
    const initialQ = getParam("q");
    if (initialQ && searchInput) searchInput.value = initialQ;

    applyFilters();
  }

  /* ---------------- Product detail page ---------------- */

  function initProductPage() {
    const root = document.querySelector("[data-product-page]");
    if (!root) return;

    const id = getParam("id");
    const product = PRODUCTS.find((p) => p.id === id);

    if (!product) {
      root.innerHTML = `
        <div class="empty-state">
          <h3>We couldn't find that product</h3>
          <p>It may have been removed or the link is incorrect.</p>
          <a class="btn" href="${imgPath("shop.html")}">Back to shop</a>
        </div>`;
      return;
    }

    document.title = product.name + " — ELITE THREAD";
    const metaDesc = document.querySelector("meta[name='description']");
    if (metaDesc) metaDesc.setAttribute("content", product.shortDescription);

    const unavailable = product.available === false;

    root.innerHTML = `
      <nav class="breadcrumb container" aria-label="Breadcrumb">
        <a href="${imgPath("index.html")}">Home</a><span class="sep">/</span>
        <a href="${imgPath("shop.html")}">Shop</a><span class="sep">/</span>
        <a href="${imgPath(categorySlugToPage(product.category))}">${escapeHTML(categoryName(product.category))}</a><span class="sep">/</span>
        ${escapeHTML(product.name)}
      </nav>
      <div class="container product-detail">
        <div class="pd-gallery" data-gallery>
          <div class="pd-gallery__main">
            <img src="${imgPath(product.images[0])}" alt="${escapeHTML(product.name)}" id="pd-main-img" onerror="this.src='${imgPath('images/products/placeholder.svg')}'">
          </div>
          ${product.images.length > 1 ? `
          <div class="pd-gallery__thumbs">
            ${product.images.map((img, i) => `<img src="${imgPath(img)}" alt="" data-thumb data-src="${imgPath(img)}" class="${i === 0 ? "is-active" : ""}" onerror="this.src='${imgPath('images/products/placeholder.svg')}'">`).join("")}
          </div>` : ""}
        </div>
        <div class="pd-info">
          <span class="eyebrow">${escapeHTML(categoryName(product.category))} · ${escapeHTML(product.type)}</span>
          <h1>${escapeHTML(product.name)}</h1>
          <div class="pd-info__price">${formatPrice(product)}</div>
          <div class="pd-info__meta">
            <div><span class="label mono">COLOUR</span>${escapeHTML(product.color || "—")}</div>
            <div><span class="label mono">CATEGORY</span>${escapeHTML(categoryName(product.category))}</div>
            <div><span class="label mono">STATUS</span>
              <span class="${unavailable ? "pd-info__status--unavailable" : "pd-info__status--available"}">
                ${unavailable ? "Currently unavailable" : "Available"}
              </span>
            </div>
          </div>
          <p>${escapeHTML(product.description)}</p>
          ${unavailable
            ? `<button class="btn btn--full" disabled style="opacity:.4;">Currently unavailable</button>`
            : `<a class="btn btn--gold btn--full" href="${buildWhatsAppLink(product)}" target="_blank" rel="noopener">Order on WhatsApp</a>`}
          <a class="btn btn--full" href="${imgPath(categorySlugToPage(product.category))}">Back to ${escapeHTML(categoryName(product.category))}</a>
        </div>
      </div>
      <div class="container section--tight">
        <h3 class="related-heading">You may also like</h3>
        <div class="product-grid" data-related-grid></div>
      </div>`;

    const thumbs = root.querySelectorAll("[data-thumb]");
    const mainImg = document.getElementById("pd-main-img");
    thumbs.forEach((t) => {
      t.addEventListener("click", () => {
        mainImg.src = t.getAttribute("data-src");
        thumbs.forEach((x) => x.classList.remove("is-active"));
        t.classList.add("is-active");
      });
    });

    const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
    renderGrid(root.querySelector("[data-related-grid]"), related);
  }

  function categorySlugToPage(slug) {
    const cat = CATEGORIES.find((c) => c.slug === slug);
    return cat ? cat.page : "shop.html";
  }

  /* ---------------- Global WhatsApp links & footer year ---------------- */

  function initGlobalWhatsAppLinks() {
    document.querySelectorAll("[data-wa-general]").forEach((el) => {
      el.setAttribute("href", generalWhatsAppLink(el.getAttribute("data-wa-message") || undefined));
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    });
  }

  function initFooterYear() {
    document.querySelectorAll("[data-year]").forEach((el) => {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ---------------- Init ---------------- */

  document.addEventListener("DOMContentLoaded", () => {
    initMobileNav();
    initSearchOverlay();
    initGlobalWhatsAppLinks();
    initFooterYear();
    initHomeSections();
    initListingPage();
    initProductPage();
  });

  // Expose a couple of helpers other page scripts might want.
  window.EliteThread = { formatPrice, buildWhatsAppLink, productHref };
})();
