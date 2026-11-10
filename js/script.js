/* ReLoop marketplace behavior */
(() => {
  "use strict";

  const categories = ["Clothes", "Shoes", "Bags", "Glasses", "Electronics", "Furniture", "Accessories"];
  const sampleProducts = [
    { id: "denim-jacket", nameKey: "product_denim", category: "Clothes", price: 1200, condition: "Like New", description: "A classic denim jacket in great shape.", image: "caio-coelho-QRN47la37gw-unsplash.jpg", phone: "201000000001", date: "2026-11-10" },
    { id: "dark-jeans", nameKey: "product_jeans", category: "Clothes", price: 650, condition: "Good", description: "Comfortable dark denim with plenty of wear left.", image: "tuananh-blue-h6PKsr0wDH4-unsplash.jpg", phone: "201000000002", date: "2026-11-09" },
    { id: "everyday-sneakers", nameKey: "product_sneakers", category: "Shoes", price: 950, condition: "Good", description: "Everyday sneakers, clean and ready to go.", image: "maksim-larin-NOpsC3nWTzY-unsplash.jpg", phone: "201000000003", date: "2026-11-08" },
    { id: "leather-bag", nameKey: "product_bag", category: "Bags", price: 1450, condition: "Like New", description: "A simple shoulder bag with room for daily essentials.", image: "robert-richman-vcTKFYNZop4-unsplash.jpg", phone: "201000000004", date: "2026-11-07" },
    { id: "round-glasses", nameKey: "product_glasses", category: "Glasses", price: 500, condition: "Good", description: "Round-frame glasses in good condition.", image: "tuananh-blue-h6PKsr0wDH4-unsplash.jpg", phone: "201000000005", date: "2026-11-06" },
    { id: "smart-tv", nameKey: "product_tv", category: "Electronics", price: 7800, condition: "Good", description: "Smart TV with a clear picture and remote included.", image: "nicolas-j-leclercq-qDLLP0yP7FU-unsplash.jpg", phone: "201000000006", date: "2026-11-05" },
    { id: "wooden-table", nameKey: "product_table", category: "Furniture", price: 3200, condition: "Used", description: "A sturdy wooden table with a clean, simple design.", image: "sam-moghadam-kvmdsTrGOBM-unsplash.jpg", phone: "201000000007", date: "2026-11-04" },
    { id: "wireless-headphones", nameKey: "product_headphones", category: "Electronics", price: 1100, condition: "Like New", description: "Lightweight wireless headphones with clear sound.", image: "howard-bouchevereau-RSCirJ70NDM-unsplash.jpg", phone: "201000000008", date: "2026-11-03" },
    { id: "wrist-watch", nameKey: "product_watch", category: "Accessories", price: 1800, condition: "Good", description: "A timeless watch that still keeps great time.", image: "tuananh-blue-h6PKsr0wDH4-unsplash.jpg", phone: "201000000009", date: "2026-11-02" },
    { id: "laptop", nameKey: "product_laptop", category: "Electronics", price: 18500, condition: "Good", description: "A reliable laptop for everyday work and browsing.", image: "howard-bouchevereau-RSCirJ70NDM-unsplash.jpg", phone: "201000000010", date: "2026-11-01" },
    { id: "two-seat-sofa", nameKey: "product_sofa", category: "Furniture", price: 6200, condition: "Used", description: "A comfortable two-seat sofa in good working order.", image: "sam-moghadam-kvmdsTrGOBM-unsplash.jpg", phone: "201000000011", date: "2026-10-31" },
    { id: "mobile-phone", nameKey: "product_phone", category: "Electronics", price: 5600, condition: "Like New", description: "A well-kept mobile phone, ready for a new owner.", image: "alex-tyson-IjfDxaiM6bE-unsplash.jpg", phone: "201000000012", date: "2026-10-30" },
    { id: "canvas-backpack", nameKey: "product_backpack", category: "Bags", price: 750, condition: "Good", description: "A roomy backpack for commuting or weekend plans.", image: "caio-coelho-QRN47la37gw-unsplash.jpg", phone: "201000000013", date: "2026-10-29" }
  ];

  const storageKeys = { language: "reloop-language", products: "reloop-products" };
  let language = "en";
  let selectedPhoto = "";
  const dictionary = () => window.RELOOP_TRANSLATIONS[language];
  const translate = (key) => dictionary()[key] || window.RELOOP_TRANSLATIONS.en[key] || key;

  function loadLanguage() {
    try {
      const saved = localStorage.getItem(storageKeys.language);
      language = saved === "ar" ? "ar" : "en";
    } catch (error) {
      console.error("Could not read the saved language preference.", error);
    }
    applyLanguage();
  }

  function applyLanguage() {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const value = translate(element.dataset.i18n);
      if (value.includes("<br>")) element.innerHTML = value;
      else element.textContent = value;
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
      element.placeholder = translate(element.dataset.i18nPlaceholder);
    });
    document.querySelectorAll(".language-toggle").forEach((button) => {
      button.setAttribute("aria-label", language === "en" ? "Switch to Arabic" : "Switch to English");
      button.querySelectorAll("span")[0].classList.toggle("language-current", language === "en");
      button.querySelectorAll("span")[2].classList.toggle("language-current", language === "ar");
    });
    updateCategoryOptions();
    renderProductSurfaces();
    updatePriceDisplay();
  }

  function getUserProducts() {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKeys.products) || "[]");
      return Array.isArray(stored) ? stored.filter((product) => product && typeof product === "object") : [];
    } catch (error) {
      console.error("Could not read saved listings.", error);
      return [];
    }
  }

  function getProducts() {
    return [...getUserProducts(), ...sampleProducts].sort((a, b) => String(b.date).localeCompare(String(a.date)));
  }

  function formatPrice(price) {
    const number = Number(price);
    if (!Number.isFinite(number)) return "";
    return `${new Intl.NumberFormat(language === "ar" ? "ar-EG" : "en-EG", { maximumFractionDigits: 0 }).format(number)} ${language === "ar" ? "ج.م" : "EGP"}`;
  }

  function productName(product) {
    return product.nameKey ? translate(product.nameKey) : product.name;
  }

  function productCard(product) {
    const imagePath = product.image.startsWith("data:") ? product.image : `image/${product.image}`;
    const name = productName(product);
    const categoryName = translate(`category_${product.category}`);
    const condition = translate(product.condition === "Like New" ? "likeNew" : product.condition.toLowerCase());
    const phone = String(product.phone || "").replace(/\D/g, "");
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(language === "ar" ? `مرحباً، أنا مهتم بـ ${name}` : `Hi, I'm interested in ${name}`)}`;
    return `<article class="product-card">
      <div class="product-photo"><img src="${escapeAttribute(imagePath)}" alt="${escapeAttribute(name)}" loading="lazy"><span class="condition-tag">${escapeHtml(condition)}</span></div>
      <div class="product-info"><p class="product-category">${escapeHtml(categoryName)}</p><h3 class="product-name" title="${escapeAttribute(name)}">${escapeHtml(name)}</h3>
        <div class="product-bottom"><p class="product-price">${escapeHtml(formatPrice(product.price))}</p><a class="product-contact" href="${escapeAttribute(whatsappUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(translate("contactSeller"))} <span aria-hidden="true">↗</span></a></div>
      </div>
    </article>`;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
  }

  function escapeAttribute(value) {
    return escapeHtml(value);
  }

  function updateCategoryOptions() {
    const categoryFilter = document.getElementById("category-filter");
    if (categoryFilter) {
      const selected = categoryFilter.value || new URLSearchParams(location.search).get("category") || "all";
      categoryFilter.innerHTML = `<option value="all">${escapeHtml(translate("allCategories"))}</option>${categories.map((category) => `<option value="${category}">${escapeHtml(translate(`category_${category}`))}</option>`).join("")}`;
      categoryFilter.value = categories.includes(selected) ? selected : "all";
    }
    const sellCategory = document.getElementById("sell-category");
    if (sellCategory) {
      const selected = sellCategory.value;
      sellCategory.innerHTML = `<option value="">${escapeHtml(translate("chooseCategory"))}</option>${categories.map((category) => `<option value="${category}">${escapeHtml(translate(`category_${category}`))}</option>`).join("")}`;
      sellCategory.value = categories.includes(selected) ? selected : "";
    }
  }

  function renderProductSurfaces() {
    const products = getProducts();
    const freshGrid = document.getElementById("fresh-products");
    if (freshGrid) freshGrid.innerHTML = products.slice(0, 8).map(productCard).join("");
    const allGrid = document.getElementById("all-products");
    if (allGrid) renderAllProducts(products);
  }

  function renderAllProducts(products) {
    const searchValue = (document.getElementById("product-search")?.value || "").trim().toLocaleLowerCase(language);
    const category = document.getElementById("category-filter")?.value || "all";
    const maxPrice = Number(document.getElementById("price-filter")?.value || 50000);
    const sort = document.getElementById("sort-filter")?.value || "default";
    let filtered = products.filter((product) => {
      const name = productName(product).toLocaleLowerCase(language);
      const categoryName = translate(`category_${product.category}`).toLocaleLowerCase(language);
      const matchesSearch = !searchValue || `${name} ${categoryName}`.toLocaleLowerCase(language).includes(searchValue);
      return matchesSearch && (category === "all" || product.category === category) && Number(product.price) <= maxPrice;
    });
    if (sort === "low") filtered.sort((a, b) => Number(a.price) - Number(b.price));
    if (sort === "high") filtered.sort((a, b) => Number(b.price) - Number(a.price));
    const grid = document.getElementById("all-products");
    const emptyState = document.getElementById("empty-state");
    const count = document.getElementById("results-count");
    if (!grid) return;
    grid.innerHTML = filtered.map(productCard).join("");
    if (emptyState) emptyState.hidden = filtered.length !== 0;
    if (count) count.textContent = translate("resultCount").replace("{count}", new Intl.NumberFormat(language).format(filtered.length));
    updatePriceDisplay();
  }

  function updatePriceDisplay() {
    const priceValue = document.getElementById("price-value");
    const priceFilter = document.getElementById("price-filter");
    if (priceValue && priceFilter) priceValue.textContent = formatPrice(priceFilter.value);
  }

  function setupLanguageToggle() {
    document.querySelectorAll(".language-toggle").forEach((button) => button.addEventListener("click", () => {
      language = language === "en" ? "ar" : "en";
      try {
        localStorage.setItem(storageKeys.language, language);
      } catch (error) {
        console.error("Could not save the language preference.", error);
      }
      applyLanguage();
    }));
  }

  function setupNavigation() {
    const toggle = document.querySelector(".menu-toggle");
    const links = document.querySelector(".nav-links");
    if (toggle && links) {
      toggle.addEventListener("click", () => {
        const isOpen = links.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(isOpen));
      });
      links.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }));
    }
    document.querySelectorAll(".current-year").forEach((element) => element.textContent = String(new Date().getFullYear()));
    const backToTop = document.querySelector(".back-to-top");
    if (backToTop) {
      const updateVisibility = () => backToTop.classList.toggle("is-visible", window.scrollY > 420);
      window.addEventListener("scroll", updateVisibility, { passive: true });
      updateVisibility();
      backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    }
  }

  function setupBrowseFilters() {
    const filterForm = document.getElementById("product-filters");
    if (!filterForm) return;
    const initialCategory = new URLSearchParams(location.search).get("category");
    const categoryFilter = document.getElementById("category-filter");
    if (initialCategory && categories.includes(initialCategory)) categoryFilter.value = initialCategory;
    filterForm.addEventListener("input", () => renderAllProducts(getProducts()));
    filterForm.addEventListener("change", () => renderAllProducts(getProducts()));
    filterForm.addEventListener("reset", () => requestAnimationFrame(() => renderAllProducts(getProducts())));
    document.getElementById("empty-reset")?.addEventListener("click", () => {
      filterForm.reset();
      requestAnimationFrame(() => renderAllProducts(getProducts()));
    });
  }

  function setFieldError(field, message) {
    field.setAttribute("aria-invalid", message ? "true" : "false");
    let error = field.parentElement.querySelector(".field-error");
    if (!message) {
      if (error) error.remove();
      return;
    }
    if (!error) {
      error = document.createElement("small");
      error.className = "field-error";
      field.insertAdjacentElement("afterend", error);
    }
    error.textContent = message;
  }

  function validateListing(form) {
    const values = new FormData(form);
    const fields = {
      name: form.elements.name,
      category: form.elements.category,
      price: form.elements.price,
      condition: form.elements.condition,
      description: form.elements.description,
      phone: form.elements.phone,
      photo: form.elements.photo
    };
    const file = fields.photo.files[0];
    const errors = {
      name: String(values.get("name") || "").trim().length < 2 || String(values.get("name") || "").trim().length > 70 ? translate("errorName") : "",
      category: categories.includes(values.get("category")) ? "" : translate("errorCategory"),
      price: Number(values.get("price")) > 0 && Number(values.get("price")) <= 10000000 ? "" : translate("errorPrice"),
      condition: ["Like New", "Good", "Used"].includes(values.get("condition")) ? "" : translate("errorCondition"),
      description: String(values.get("description") || "").trim().length < 10 || String(values.get("description") || "").trim().length > 500 ? translate("errorDescription") : "",
      phone: (() => {
        const digitCount = (String(values.get("phone") || "").match(/\d/g) || []).length;
        return digitCount < 8 || digitCount > 15 ? translate("errorPhone") : "";
      })(),
      photo: !file || !file.type.startsWith("image/") || file.size > 5 * 1024 * 1024 ? translate("errorPhoto") : ""
    };
    Object.entries(fields).forEach(([key, field]) => setFieldError(field, errors[key]));
    return { valid: Object.values(errors).every((message) => !message), values, file };
  }

  function setupSellForm() {
    const form = document.getElementById("sell-form");
    if (!form) return;
    const status = document.getElementById("sell-status");
    const fileInput = form.elements.photo;
    fileInput.addEventListener("change", () => {
      const file = fileInput.files[0];
      const previewWrap = document.getElementById("image-preview-wrap");
      const preview = document.getElementById("image-preview");
      const previewName = document.getElementById("image-preview-name");
      selectedPhoto = "";
      if (!file) {
        previewWrap.hidden = true;
        preview.removeAttribute("src");
        return;
      }
      if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
        setFieldError(fileInput, translate("errorPhoto"));
        previewWrap.hidden = true;
        return;
      }
      setFieldError(fileInput, "");
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        if (typeof reader.result !== "string") {
          setFieldError(fileInput, translate("invalidImage"));
          return;
        }
        const image = new Image();
        image.addEventListener("load", () => {
          const maxDimension = 1400;
          const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
          canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
          const context = canvas.getContext("2d");
          if (!context) {
            setFieldError(fileInput, translate("invalidImage"));
            return;
          }
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          selectedPhoto = canvas.toDataURL("image/jpeg", 0.82);
          preview.src = selectedPhoto;
          preview.alt = String(form.elements.name.value || translate("photoLabel"));
          previewName.textContent = file.name;
          previewWrap.hidden = false;
        });
        image.addEventListener("error", () => setFieldError(fileInput, translate("invalidImage")));
        image.src = reader.result;
      });
      reader.addEventListener("error", () => setFieldError(fileInput, translate("invalidImage")));
      reader.readAsDataURL(file);
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      status.textContent = "";
      const validation = validateListing(form);
      if (!validation.valid) {
        status.textContent = translate("errorContactGeneral");
        const firstError = form.querySelector('[aria-invalid="true"]');
        firstError?.focus();
        return;
      }
      if (!selectedPhoto) {
        setFieldError(fileInput, translate("invalidImage"));
        status.textContent = translate("errorContactGeneral");
        return;
      }
      const listing = {
        id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: String(validation.values.get("name")).trim(),
        category: String(validation.values.get("category")),
        price: Number(validation.values.get("price")),
        condition: String(validation.values.get("condition")),
        description: String(validation.values.get("description")).trim(),
        image: selectedPhoto,
        phone: String(validation.values.get("phone")).trim(),
        date: new Date().toISOString()
      };
      try {
        const products = getUserProducts();
        products.unshift(listing);
        localStorage.setItem(storageKeys.products, JSON.stringify(products));
      } catch (error) {
        console.error("Could not save the new listing.", error);
        status.textContent = translate("errorStorage");
        return;
      }
      status.textContent = translate("listingSuccess");
      form.reset();
      selectedPhoto = "";
      document.getElementById("image-preview-wrap").hidden = true;
      document.getElementById("image-preview").removeAttribute("src");
      document.getElementById("image-preview-name").textContent = "";
      form.querySelectorAll('[aria-invalid="true"]').forEach((field) => setFieldError(field, ""));
    });
    form.addEventListener("input", (event) => {
      if (event.target.matches("input, select, textarea")) setFieldError(event.target, "");
    });
    form.addEventListener("change", (event) => {
      if (event.target.matches("input, select, textarea")) setFieldError(event.target, "");
    });
  }

  function setupContactForms() {
    document.querySelectorAll(".contact-form").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const status = form.querySelector(".form-status");
        const name = form.elements.name;
        const email = form.elements.email;
        const message = form.elements.message;
        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
        const errors = [
          name.value.trim() ? "" : translate("errorContactName"),
          emailValid ? "" : translate("errorContactEmail"),
          message.value.trim().length >= 10 ? "" : translate("errorContactMessage")
        ];
        [name, email, message].forEach((field, index) => setFieldError(field, errors[index]));
        if (errors.some(Boolean)) {
          status.textContent = translate("errorContactGeneral");
          form.querySelector('[aria-invalid="true"]')?.focus();
          return;
        }
        status.textContent = translate("contactSuccess");
        form.reset();
      });
      form.addEventListener("input", (event) => {
        if (event.target.matches("input, textarea")) setFieldError(event.target, "");
      });
    });
  }

  function initialize() {
    loadLanguage();
    setupLanguageToggle();
    setupNavigation();
    setupBrowseFilters();
    setupSellForm();
    setupContactForms();
    renderProductSurfaces();
  }

  document.addEventListener("DOMContentLoaded", initialize);
})();
