const body = document.body;
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobilePanel = document.querySelector("[data-mobile-panel]");
const year = document.querySelector("[data-year]");
const track = document.querySelector("[data-track]");
const viewport = document.querySelector("[data-viewport]");
const dots = document.querySelector("[data-dots]");
const prev = document.querySelector("[data-prev]");
const next = document.querySelector("[data-next]");
const adminLinks = document.querySelectorAll("[data-admin-link]");
const adminTopbar = document.querySelector("[data-admin-topbar]");
const adminLinkForm = document.querySelector("[data-admin-link-form]");
const artworkForm = document.querySelector("[data-artwork-form]");
const adminArtworkList = document.querySelector("[data-admin-artworks]");
const imageBankForm = document.querySelector("[data-image-bank-form]");
const imageBankList = document.querySelector("[data-image-bank-list]");
const bankImageSelect = document.querySelector("[data-bank-image-select]");
const logoImageSelect = document.querySelector("[data-logo-image-select]");
const collectionForm = document.querySelector("[data-collection-form]");
const collectionList = document.querySelector("[data-collection-list]");
const collectionImageSelect = document.querySelector("[data-collection-image-select]");
const collectionSubmit = document.querySelector("[data-collection-submit]");
const cancelCollectionEdit = document.querySelector("[data-cancel-collection-edit]");
const artworkCollectionSelect = document.querySelector("[data-artwork-collection-select]");
const exhibitionForm = document.querySelector("[data-exhibition-form]");
const exhibitionList = document.querySelector("[data-exhibition-list]");
const exhibitionImageSelect = document.querySelector("[data-exhibition-image-select]");
const exhibitionContentMode = document.querySelector("[data-exhibition-content-mode]");
const exhibitionCollectionsField = document.querySelector("[data-exhibition-collections-field]");
const exhibitionArtworksField = document.querySelector("[data-exhibition-artworks-field]");
const exhibitionCollectionOptions = document.querySelector("[data-exhibition-collection-options]");
const exhibitionArtworkOptions = document.querySelector("[data-exhibition-artwork-options]");
const exhibitionSubmit = document.querySelector("[data-exhibition-submit]");
const cancelExhibitionEdit = document.querySelector("[data-cancel-exhibition-edit]");
const adminTabButtons = document.querySelectorAll("[data-admin-tab]");
const adminTabPanels = document.querySelectorAll("[data-admin-panel]");
const pageButtons = document.querySelectorAll("[data-edit-page]");
const pageEditForm = document.querySelector("[data-page-edit-form]");
const pagePreview = document.querySelector("[data-page-preview]");
const pageImageSelect = document.querySelector("[data-page-image-select]");
const styleForm = document.querySelector("[data-style-form]");
const customSectionForm = document.querySelector("[data-custom-section-form]");
const customSectionList = document.querySelector("[data-custom-section-list]");
const sectionImageSelect = document.querySelector("[data-section-image-select]");
const pageSaveStatus = document.querySelector("[data-page-save-status]");
const adminParam = new URLSearchParams(window.location.search).get("admin");
const defaultSocialLinks = {
  siteName: "Bao Le Tien",
  logoImageId: "asset-logo",
  instagram: "https://instagram.com/bao.letien1",
  linktree: "https://linktr.ee/"
};
const defaultPageContent = {
  home: {
    name: "Accueil",
    heroTitle: "Des tableaux, des traces, des histoires.",
    heroSubtitle: "Bienvenue chez Bao. Entrez par la couleur, la matière et les petits détails qui restent en tête.",
    heroImage: "/assets/images/bao-title.jpg",
    heroImageId: "asset-bao-title",
    titleFont: "Georgia, 'Times New Roman', serif"
  },
  about: {
    name: "Bao",
    heroTitle: "Bao, tout simplement.",
    heroSubtitle: "Un petit texte de présentation viendra bientôt raconter le parcours, les envies et les gestes de l’artiste.",
    heroImage: "/assets/images/bao-title.jpg",
    heroImageId: "asset-bao-title",
    titleFont: "Georgia, 'Times New Roman', serif"
  },
  expositions: {
    name: "Expositions",
    heroTitle: "Rencontrer les oeuvres",
    heroSubtitle: "Retrouvez les expositions en cours et les prochains rendez-vous en galerie.",
    heroImage: "/assets/images/echelle.jpg",
    heroImageId: "asset-echelle",
    titleFont: "Georgia, 'Times New Roman', serif"
  },
  tableaux: {
    name: "Tableaux",
    heroTitle: "Mes tableaux",
    heroSubtitle: "Tableaux disponibles à la vente",
    heroImage: "/assets/images/bao-title.jpg",
    heroImageId: "asset-bao-title",
    titleFont: "Georgia, 'Times New Roman', serif"
  }
};
let activeEditPage = "home";
let editingCollectionId = null;
let editingExhibitionId = null;
const defaultStyleSettings = {
  titleFont: "'DM Sans', 'Trebuchet MS', sans-serif",
  titleSize: 76,
  titleColor: "#121927",
  subtitleFont: "'DM Sans', 'Trebuchet MS', sans-serif",
  subtitleSize: 16,
  subtitleColor: "#b5a900",
  textFont: "'DM Sans', 'Trebuchet MS', sans-serif",
  textSize: 16,
  textColor: "#121927",
  headerFont: "'DM Sans', 'Trebuchet MS', sans-serif",
  headerSize: 14,
  headerText: "#121927"
};

function getSocialLinks() {
  try {
    return { ...defaultSocialLinks, ...JSON.parse(localStorage.getItem("monArtSocialLinks") || "{}") };
  } catch {
    return defaultSocialLinks;
  }
}

function applySocialLinks() {
  const links = getSocialLinks();
  document.querySelectorAll("[data-site-name]").forEach((element) => {
    element.textContent = links.siteName || defaultSocialLinks.siteName;
  });
  document.querySelectorAll("[data-site-year-name]").forEach((element) => {
    element.textContent = links.siteName || defaultSocialLinks.siteName;
  });
  document.querySelectorAll("[data-site-logo]").forEach((element) => {
    element.src = resolveImageSource(links.logoImageId || defaultSocialLinks.logoImageId, "/assets/images/logo.png");
    element.alt = links.siteName || defaultSocialLinks.siteName;
  });
  document.querySelectorAll("[data-social-link]").forEach((element) => {
    const key = element.dataset.socialLink;
    if (links[key]) element.href = links[key];
  });

  if (adminLinkForm) {
    Object.entries(links).forEach(([key, value]) => {
      const input = adminLinkForm.elements[key];
      if (input) input.value = value;
    });
    renderImageSelect(logoImageSelect, links.logoImageId || defaultSocialLinks.logoImageId);
  }
}

function getPageContent() {
  try {
    const savedContent = JSON.parse(localStorage.getItem("monArtPageContent") || "{}");
    return Object.fromEntries(
      Object.entries(defaultPageContent).map(([pageKey, defaults]) => [
        pageKey,
        {
          ...defaults,
          ...(savedContent[pageKey] || {}),
          heroImageId: savedContent[pageKey]?.heroImageId || defaults.heroImageId,
          heroImage: resolveImageSource(savedContent[pageKey]?.heroImageId || defaults.heroImageId, defaults.heroImage)
        }
      ])
    );
  } catch {
    return defaultPageContent;
  }
}

function savePageContent(content) {
  localStorage.setItem("monArtPageContent", JSON.stringify(content));
}

function getStyleSettings() {
  try {
    return { ...defaultStyleSettings, ...JSON.parse(localStorage.getItem("monArtStyleSettings") || "{}") };
  } catch {
    return defaultStyleSettings;
  }
}

function applyStyleSettings() {
  const styles = getStyleSettings();
  document.documentElement.style.setProperty("--serif", styles.titleFont);
  document.documentElement.style.setProperty("--sans", styles.textFont);
  document.documentElement.style.setProperty("--title-size", `${styles.titleSize}px`);
  document.documentElement.style.setProperty("--subtitle-font", styles.subtitleFont);
  document.documentElement.style.setProperty("--subtitle-size", `${styles.subtitleSize}px`);
  document.documentElement.style.setProperty("--text-size", `${styles.textSize}px`);
  document.documentElement.style.setProperty("--title-color", styles.titleColor);
  document.documentElement.style.setProperty("--subtitle-color", styles.subtitleColor);
  document.documentElement.style.setProperty("--text-color", styles.textColor);
  document.documentElement.style.setProperty("--header-font", styles.headerFont);
  document.documentElement.style.setProperty("--header-size", `${styles.headerSize}px`);
  document.documentElement.style.setProperty("--header-text", styles.headerText);
  if (styleForm) {
    Object.entries(styles).forEach(([key, value]) => {
      if (styleForm.elements[key]) styleForm.elements[key].value = value;
    });
  }
}

function resolveImageSource(imageId, fallback = "") {
  return getImageBank().find((image) => String(image.id) === String(imageId))?.src || fallback;
}

function applyPageContent() {
  const content = getPageContent();
  document.querySelectorAll("[data-content]").forEach((element) => {
    const [page, field] = element.dataset.content.split(".");
    if (content[page]?.[field]) element.textContent = content[page][field];
  });
  document.querySelectorAll("[data-image-content]").forEach((element) => {
    const [page, field] = element.dataset.imageContent.split(".");
    if (content[page]?.[field]) {
      const imageSource = resolveImageSource(content[page].heroImageId, content[page][field]);
      element.src = imageSource;
      element.closest("picture")?.querySelectorAll("source").forEach((source) => {
        source.srcset = imageSource;
      });
    }
  });
}

function renderPageEditor() {
  if (!pageEditForm || !pagePreview) return;
  const content = getPageContent();
  const page = content[activeEditPage];
  if (!page) return;
  Object.entries(page).forEach(([key, value]) => {
    const field = pageEditForm.querySelector(`[data-page-field="${key}"]`);
    if (field) field.value = value;
  });
  renderImageSelect(pageImageSelect, page.heroImageId);
  pagePreview.querySelector("[data-preview-name]").textContent = page.name;
  pagePreview.querySelector("[data-preview-title]").textContent = page.heroTitle;
  pagePreview.querySelector("[data-preview-subtitle]").textContent = page.heroSubtitle;
  pagePreview.querySelector("[data-preview-image]").src = resolveImageSource(page.heroImageId, page.heroImage);
  renderCustomSectionList();
}

function getCustomSections() {
  try {
    return JSON.parse(localStorage.getItem("monArtCustomSections") || "{}");
  } catch {
    return {};
  }
}

function saveCustomSections(sections) {
  localStorage.setItem("monArtCustomSections", JSON.stringify(sections));
}

function renderCustomSections() {
  const sections = getCustomSections();
  document.querySelectorAll("[data-custom-sections]").forEach((container) => {
    const pageKey = container.dataset.customSections;
    container.innerHTML = (sections[pageKey] || [])
      .map(
        (section) => `
          <section class="section custom-section section-reveal">
            ${section.imageId ? `<img src="${resolveImageSource(section.imageId)}" alt="${section.title || section.subtitle || "Section"}" />` : ""}
            <div>
              ${section.subtitle ? `<p class="eyebrow">${section.subtitle}</p>` : ""}
              ${section.title ? `<h2>${section.title}</h2>` : ""}
              ${section.paragraph ? `<p>${section.paragraph}</p>` : ""}
            </div>
          </section>
        `
      )
      .join("");
  });
}

function renderCustomSectionList() {
  if (!customSectionList) return;
  renderImageSelect(sectionImageSelect, sectionImageSelect?.value);
  const sections = getCustomSections()[activeEditPage] || [];
  customSectionList.innerHTML = sections.length
    ? sections.map((section) => `<article><strong>${section.title || "Section sans titre"}</strong><span>${section.subtitle || ""}</span><span>${section.paragraph || ""}</span><button type="button" data-delete-section="${section.id}">Supprimer</button></article>`).join("")
    : "<p>Aucune section ajoutee pour cette page.</p>";
}

if (adminParam === "0" && !window.location.pathname.startsWith("/admin/")) {
  if (adminTopbar) {
    adminTopbar.hidden = true;
  }
}

applySocialLinks();
applyPageContent();
applyStyleSettings();
renderCustomSections();

const profileTitle = document.getElementById("profile-title");
if (profileTitle) {
  window.setTimeout(() => {
    profileTitle.classList.add("is-visible");
  }, 200);
}

if (adminLinkForm) {
  adminLinkForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const links = {
      siteName: adminLinkForm.elements.siteName.value.trim() || defaultSocialLinks.siteName,
      logoImageId: adminLinkForm.elements.logoImageId.value || defaultSocialLinks.logoImageId,
      instagram: adminLinkForm.elements.instagram.value.trim() || defaultSocialLinks.instagram,
      linktree: adminLinkForm.elements.linktree.value.trim() || defaultSocialLinks.linktree
    };
    localStorage.setItem("monArtSocialLinks", JSON.stringify(links));
    applySocialLinks();
  });
}

if (styleForm) {
  styleForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const styles = {
      titleFont: styleForm.elements.titleFont.value,
      titleSize: Number(styleForm.elements.titleSize.value) || defaultStyleSettings.titleSize,
      titleColor: styleForm.elements.titleColor.value,
      subtitleFont: styleForm.elements.subtitleFont.value,
      subtitleSize: Number(styleForm.elements.subtitleSize.value) || defaultStyleSettings.subtitleSize,
      subtitleColor: styleForm.elements.subtitleColor.value,
      textFont: styleForm.elements.textFont.value,
      textSize: Number(styleForm.elements.textSize.value) || defaultStyleSettings.textSize,
      textColor: styleForm.elements.textColor.value,
      headerFont: styleForm.elements.headerFont.value,
      headerSize: Number(styleForm.elements.headerSize.value) || defaultStyleSettings.headerSize,
      headerText: styleForm.elements.headerText.value
    };
    localStorage.setItem("monArtStyleSettings", JSON.stringify(styles));
    applyStyleSettings();
  });
}

adminTabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    adminTabButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    adminTabPanels.forEach((panel) => panel.classList.toggle("is-active", panel.dataset.adminPanel === button.dataset.adminTab));
  });
});

pageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeEditPage = button.dataset.editPage;
    pageButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    renderPageEditor();
  });
});

if (pageEditForm) {
  pageEditForm.addEventListener("input", () => {
    const page = {
      ...getPageContent()[activeEditPage],
      heroTitle: pageEditForm.elements.heroTitle.value,
      heroSubtitle: pageEditForm.elements.heroSubtitle.value,
      heroImageId: pageEditForm.elements.heroImageId.value
    };
    pagePreview.querySelector("[data-preview-title]").textContent = page.heroTitle;
    pagePreview.querySelector("[data-preview-subtitle]").textContent = page.heroSubtitle;
    pagePreview.querySelector("[data-preview-image]").src = resolveImageSource(page.heroImageId, page.heroImage);
  });

  pageEditForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const content = getPageContent();
    content[activeEditPage] = {
      ...content[activeEditPage],
      heroTitle: pageEditForm.elements.heroTitle.value.trim(),
      heroSubtitle: pageEditForm.elements.heroSubtitle.value.trim(),
      heroImageId: pageEditForm.elements.heroImageId.value,
      heroImage: resolveImageSource(pageEditForm.elements.heroImageId.value, content[activeEditPage].heroImage)
    };
    savePageContent(content);
    applyPageContent();
    renderPageEditor();
    if (pageSaveStatus) {
      pageSaveStatus.textContent = "Page enregistree.";
      window.setTimeout(() => {
        pageSaveStatus.textContent = "";
      }, 2200);
    }
  });
  renderPageEditor();
}

if (customSectionForm) {
  customSectionForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(customSectionForm);
    const sections = getCustomSections();
    sections[activeEditPage] = sections[activeEditPage] || [];
    sections[activeEditPage].push({
      id: Date.now(),
      title: formData.get("title").trim(),
      subtitle: formData.get("subtitle").trim(),
      paragraph: formData.get("paragraph").trim(),
      imageId: formData.get("imageId")
    });
    saveCustomSections(sections);
    customSectionForm.reset();
    renderCustomSectionList();
    renderCustomSections();
  });
}

if (customSectionList) {
  customSectionList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-delete-section]");
    if (!button) return;
    const sections = getCustomSections();
    sections[activeEditPage] = (sections[activeEditPage] || []).filter((section) => String(section.id) !== button.dataset.deleteSection);
    saveCustomSections(sections);
    renderCustomSectionList();
    renderCustomSections();
  });
}

if (year) {
  year.textContent = new Date().getFullYear();
}

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    const isOpen = body.classList.toggle("menu-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

if (mobilePanel && menuToggle) {
  mobilePanel.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      body.classList.remove("menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".section-reveal").forEach((section) => revealObserver.observe(section));

const lightboxSelectors = ".exhibition-gallery img, .detail-layout img, .content-card-images img";
if (document.querySelector(".exhibition-gallery, .detail-layout, .content-card-images") || document.getElementById("artwork-detail")) {
  const lightboxOverlay = document.createElement("div");
  lightboxOverlay.className = "lightbox-overlay";
  lightboxOverlay.innerHTML = `
    <button type="button" class="lightbox-close" aria-label="Fermer">&times;</button>
    <button type="button" class="lightbox-prev" aria-label="Photo precedente">&#8249;</button>
    <button type="button" class="lightbox-next" aria-label="Photo suivante">&#8250;</button>
    <figure class="lightbox-figure">
      <img src="" alt="" />
      <figcaption class="lightbox-caption"></figcaption>
    </figure>
  `;
  document.body.appendChild(lightboxOverlay);

  const lightboxImg = lightboxOverlay.querySelector("img");
  const lightboxCaption = lightboxOverlay.querySelector(".lightbox-caption");
  const lightboxPrev = lightboxOverlay.querySelector(".lightbox-prev");
  const lightboxNext = lightboxOverlay.querySelector(".lightbox-next");
  const lightboxClose = lightboxOverlay.querySelector(".lightbox-close");

  let currentGalleryImages = [];
  let currentIndex = 0;

  function showLightboxImage(index) {
    if (!currentGalleryImages.length) return;
    currentIndex = (index + currentGalleryImages.length) % currentGalleryImages.length;
    const image = currentGalleryImages[currentIndex];
    lightboxImg.src = image.src;
    lightboxImg.alt = image.alt || "";
    lightboxCaption.textContent = currentGalleryImages.length > 1 ? `${currentIndex + 1} / ${currentGalleryImages.length}` : "";
  }

  function openLightbox(images, index) {
    currentGalleryImages = images;
    showLightboxImage(index);
    lightboxOverlay.classList.add("is-open");
    body.classList.add("lightbox-open");
    lightboxPrev.hidden = images.length < 2;
    lightboxNext.hidden = images.length < 2;
  }

  function closeLightbox() {
    lightboxOverlay.classList.remove("is-open");
    body.classList.remove("lightbox-open");
  }

  document.addEventListener("click", (event) => {
    const img = event.target.closest(lightboxSelectors);
    if (!img) return;
    const gallery = img.closest(".exhibition-gallery, .detail-layout, .content-card-images");
    const images = Array.from(gallery.querySelectorAll("img"));
    openLightbox(images, images.indexOf(img));
  });

  lightboxPrev.addEventListener("click", () => showLightboxImage(currentIndex - 1));
  lightboxNext.addEventListener("click", () => showLightboxImage(currentIndex + 1));
  lightboxClose.addEventListener("click", closeLightbox);

  lightboxOverlay.addEventListener("click", (event) => {
    if (event.target === lightboxOverlay) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (!lightboxOverlay.classList.contains("is-open")) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") showLightboxImage(currentIndex - 1);
    if (event.key === "ArrowRight") showLightboxImage(currentIndex + 1);
  });
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getLocalArtworks() {
  try {
    const savedArtworks = JSON.parse(localStorage.getItem("monArtLocalArtworks") || "null");
    return savedArtworks?.length ? savedArtworks : window.siteData?.artworks || [];
  } catch {
    return window.siteData?.artworks || [];
  }
}

function saveLocalArtworks(items) {
  localStorage.setItem("monArtLocalArtworks", JSON.stringify(items));
}

function getImageBank() {
  try {
    const customNames = JSON.parse(localStorage.getItem("monArtImageNames") || "{}");
    const assetImages = (window.siteData?.imageBank || []).map((image) => ({
      ...image,
      name: customNames[image.id] || image.name
    }));
    return [...assetImages, ...JSON.parse(localStorage.getItem("monArtImageBank") || "[]")];
  } catch {
    return window.siteData?.imageBank || [];
  }
}

function getLocalImageBank() {
  try {
    return JSON.parse(localStorage.getItem("monArtImageBank") || "[]");
  } catch {
    return [];
  }
}

function saveImageBank(items) {
  localStorage.setItem("monArtImageBank", JSON.stringify(items));
}

function renderImageSelect(select, selectedId = "") {
  if (!select) return;
  select.innerHTML = `<option value="">Choisir une image</option>${getImageBank()
    .map((image) => `<option value="${image.id}"${String(image.id) === String(selectedId) ? " selected" : ""}>${image.name}</option>`)
    .join("")}`;
}

function getCollections() {
  try {
    const localCollections = JSON.parse(localStorage.getItem("monArtCollections") || "[]");
    if (localCollections.length) return localCollections;
  } catch {}
  return [
    {
      id: "default-bao",
      name: "Bao",
      description: "Collection initiale autour des oeuvres ajoutees.",
      imageId: "asset-bao-title",
      status: "visible"
    }
  ];
}

function saveCollections(items) {
  localStorage.setItem("monArtCollections", JSON.stringify(items));
}

function renderCollectionSelect(select, selectedId = "") {
  if (!select) return;
  select.innerHTML = getCollections()
    .map((collection) => `<option value="${collection.id}"${String(collection.id) === String(selectedId) ? " selected" : ""}>${collection.name}</option>`)
    .join("");
}

function renderCollections() {
  renderCollectionSelect(artworkCollectionSelect, artworkCollectionSelect?.value);
  renderImageSelect(collectionImageSelect, collectionImageSelect?.value);
  renderExhibitionChoices();
  if (!collectionList) return;
  collectionList.innerHTML = getCollections()
    .map(
      (collection) => `
        <article>
          <strong>${collection.name}</strong>
          <span>${collection.status}</span>
          <span>${collection.description || ""}</span>
          <div class="admin-row-actions">
            <button type="button" data-edit-collection="${collection.id}">Modifier</button>
            <button type="button" data-delete-collection="${collection.id}">Supprimer</button>
          </div>
        </article>
      `
    )
    .join("");
}

function getExhibitions() {
  try {
    return JSON.parse(localStorage.getItem("monArtExhibitions") || "[]");
  } catch {
    return [];
  }
}

function saveExhibitions(items) {
  localStorage.setItem("monArtExhibitions", JSON.stringify(items));
}

function renderExhibitions() {
  renderImageSelect(exhibitionImageSelect, exhibitionImageSelect?.value);
  renderExhibitionChoices();
  if (!exhibitionList) return;
  const collections = getCollections();
  const artworksList = getArtworks();
  const exhibitions = getExhibitions();
  if (!exhibitions.length) {
    exhibitionList.innerHTML = "<p>Aucune exposition creee pour le moment.</p>";
    return;
  }
  exhibitionList.innerHTML = exhibitions
    .map((exhibition) => {
      const mode = exhibition.contentMode || "collections";
      const names =
        mode === "artworks"
          ? (exhibition.artworkIds || []).map((id) => artworksList.find((artwork) => String(artwork.id) === String(id))?.titre).filter(Boolean)
          : (exhibition.collectionIds || [exhibition.collectionId]).map((id) => collections.find((collection) => String(collection.id) === String(id))?.name).filter(Boolean);
      const contentLabel = names.join(", ") || "Aucun contenu";
      return `
        <article>
          <strong>${exhibition.title}</strong>
          <span>${exhibition.status}</span>
          <span>${contentLabel}</span>
          <div class="admin-row-actions">
            <button type="button" data-edit-exhibition="${exhibition.id}">Modifier</button>
            <button type="button" data-delete-exhibition="${exhibition.id}">Supprimer</button>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderExhibitionChoices(selectedCollectionIds = [], selectedArtworkIds = []) {
  if (exhibitionCollectionOptions) {
    exhibitionCollectionOptions.innerHTML = getCollections()
      .map(
        (collection) => `
          <label class="check-row">
            <input type="checkbox" name="collectionIds" value="${collection.id}"${selectedCollectionIds.map(String).includes(String(collection.id)) ? " checked" : ""} />
            ${collection.name}
          </label>
        `
      )
      .join("");
  }
  if (exhibitionArtworkOptions) {
    exhibitionArtworkOptions.innerHTML = getArtworks()
      .map(
        (artwork) => `
          <label class="check-row">
            <input type="checkbox" name="artworkIds" value="${artwork.id}"${selectedArtworkIds.map(String).includes(String(artwork.id)) ? " checked" : ""} />
            ${artwork.titre}
          </label>
        `
      )
      .join("");
  }
}

function syncExhibitionMode() {
  if (!exhibitionContentMode) return;
  const showCollections = exhibitionContentMode.value === "collections";
  if (exhibitionCollectionsField) exhibitionCollectionsField.hidden = !showCollections;
  if (exhibitionArtworksField) exhibitionArtworksField.hidden = showCollections;
}

function getImageNames() {
  try {
    return JSON.parse(localStorage.getItem("monArtImageNames") || "{}");
  } catch {
    return {};
  }
}

function saveImageName(id, name) {
  if (id.toString().startsWith("asset-")) {
    const names = getImageNames();
    names[id] = name;
    localStorage.setItem("monArtImageNames", JSON.stringify(names));
    return;
  }
  const images = getLocalImageBank().map((image) => (String(image.id) === String(id) ? { ...image, name } : image));
  saveImageBank(images);
}

function renderImageBank() {
  const images = getImageBank();
  renderImageSelect(bankImageSelect, bankImageSelect?.value);
  renderImageSelect(logoImageSelect, logoImageSelect?.value || getSocialLinks().logoImageId);
  renderImageSelect(pageImageSelect, pageImageSelect?.value || getPageContent()[activeEditPage]?.heroImageId);
  renderImageSelect(collectionImageSelect, collectionImageSelect?.value);
  renderImageSelect(exhibitionImageSelect, exhibitionImageSelect?.value);
  renderImageSelect(sectionImageSelect, sectionImageSelect?.value);
  if (!imageBankList) return;
  if (!images.length) {
    imageBankList.innerHTML = "<p>Aucune image dans la banque pour le moment.</p>";
    return;
  }
  imageBankList.innerHTML = images
    .map(
      (image) => `
        <article>
          <img src="${image.src}" alt="${image.name}" />
          <div>
            <strong>${image.name}</strong>
            <form class="image-rename-form" data-rename-image="${image.id}">
              <input name="imageName" value="${image.name}" aria-label="Nom de l'image ${image.name}" />
              <button type="submit">Renommer</button>
            </form>
            ${image.id.toString().startsWith("asset-") ? "<span>Image dossier</span>" : `<button type="button" data-delete-image="${image.id}">Supprimer</button>`}
          </div>
        </article>
      `
    )
    .join("");
}

function getArtworks() {
  return getLocalArtworks();
}

const artworks = getArtworks();
let activeIndex = 0;
let autoTimer;

function statusLabel(artwork) {
  if (artwork.prix.toLowerCase() === "sur demande") return "Sur demande";
  return artwork.disponible ? "Disponible" : "Vendu";
}

function renderArtworks() {
  if (!artworks.length) {
    track.innerHTML = `<p>Aucun tableau ajoute pour le moment.</p>`;
    dots.innerHTML = "";
    if (prev) prev.hidden = true;
    if (next) next.hidden = true;
    return;
  }
  track.innerHTML = artworks
    .map(
      (artwork) => `
        <article class="art-card">
          <a href="/tableaux/?art=${artwork.slug}" aria-label="Voir le tableau ${artwork.titre}">
            <img src="${artwork.images[0]}" alt="${artwork.titre}, ${artwork.technique}" width="900" height="1120" loading="lazy" />
            <div class="art-card-body">
              <div>
                <h3>${artwork.titre}</h3>
                <p>${artwork.dimensions}</p>
                <p>${artwork.technique}</p>
              </div>
              <div>
                <strong>${artwork.prix}</strong>
                <span>${statusLabel(artwork)}</span>
              </div>
              <em>Voir le tableau</em>
            </div>
          </a>
        </article>
      `
    )
    .join("");

  dots.innerHTML = artworks
    .map((_, index) => `<button type="button" data-dot="${index}" aria-label="Aller au tableau ${index + 1}"></button>`)
    .join("");
}

function updateCarousel() {
  const card = track.querySelector(".art-card");
  if (!card) return;
  const gap = parseFloat(getComputedStyle(track).gap) || 0;
  const visibleCards = Math.max(1, Math.round(viewport.getBoundingClientRect().width / card.getBoundingClientRect().width));
  const maxIndex = Math.max(0, artworks.length - visibleCards);
  if (activeIndex > maxIndex) activeIndex = 0;
  const offset = activeIndex * (card.getBoundingClientRect().width + gap);
  viewport.scrollTo({ left: offset, behavior: "smooth" });
  dots.querySelectorAll("button").forEach((dot, index) => {
    dot.classList.toggle("is-active", index === activeIndex);
  });
}

function goTo(index) {
  const card = track.querySelector(".art-card");
  const visibleCards = card ? Math.max(1, Math.round(viewport.getBoundingClientRect().width / card.getBoundingClientRect().width)) : 1;
  const maxIndex = Math.max(0, artworks.length - visibleCards);
  activeIndex = index > maxIndex ? 0 : index < 0 ? maxIndex : index;
  updateCarousel();
}

function startAuto() {
  stopAuto();
  autoTimer = window.setInterval(() => goTo(activeIndex + 1), 5000);
}

function stopAuto() {
  window.clearInterval(autoTimer);
}

if (track && viewport && dots && prev && next) {
  renderArtworks();
  if (artworks.length) {
  updateCarousel();
  startAuto();

  next.addEventListener("click", () => {
    stopAuto();
    goTo(activeIndex + 1);
    startAuto();
  });

  prev.addEventListener("click", () => {
    stopAuto();
    goTo(activeIndex - 1);
    startAuto();
  });

  dots.addEventListener("click", (event) => {
    const dot = event.target.closest("[data-dot]");
    if (!dot) return;
    stopAuto();
    goTo(Number(dot.dataset.dot));
    startAuto();
  });

  viewport.addEventListener("pointerdown", stopAuto);
  viewport.addEventListener("pointerup", startAuto);
  viewport.addEventListener("mouseenter", stopAuto);
  viewport.addEventListener("mouseleave", startAuto);
  window.addEventListener("resize", updateCarousel);
  }
}

function renderAdminArtworks() {
  if (!adminArtworkList) return;
  const localArtworks = getLocalArtworks();
  if (!localArtworks.length) {
    adminArtworkList.innerHTML = "<p>Aucun tableau ajoute pour le moment.</p>";
    return;
  }
  adminArtworkList.innerHTML = localArtworks
    .map(
      (artwork) => `
        <article>
          <strong>${artwork.titre}</strong>
          <span>${artwork.collection}</span>
          <span>${artwork.prix}</span>
          <button type="button" data-delete-artwork="${artwork.id}">Supprimer</button>
        </article>
      `
    )
    .join("");
}

if (artworkForm) {
  artworkForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(artworkForm);
    const titre = formData.get("titre").trim();
    const prix = formData.get("prix").trim();
    const collectionId = formData.get("collection");
    const collection = getCollections().find((item) => String(item.id) === String(collectionId))?.name || "Sans collection";
    const bankImageId = formData.get("bankImage");
    const bankImage = getImageBank().find((imageItem) => String(imageItem.id) === bankImageId);
    const image = bankImage?.src || formData.get("image").trim() || "/assets/images/bao-title.jpg";
    const localArtworks = getLocalArtworks();
    localArtworks.push({
      id: Date.now(),
      slug: `${slugify(titre)}-${Date.now()}`,
      titre,
      description: collection,
      images: [image],
      dimensions: "Format a preciser",
      technique: collection,
      prix,
      disponible: true,
      annee: new Date().getFullYear(),
      collectionId,
      collection
    });
    saveLocalArtworks(localArtworks);
    artworkForm.reset();
    renderAdminArtworks();
  });
}

if (collectionForm) {
  collectionForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(collectionForm);
    const collections = getCollections().filter((collection) => !String(collection.id).startsWith("default-") || String(collection.id) === String(editingCollectionId));
    const nextCollection = {
      id: editingCollectionId || Date.now(),
      name: formData.get("name").trim(),
      description: formData.get("description").trim(),
      imageId: formData.get("imageId"),
      status: formData.get("status")
    };
    const nextCollections = editingCollectionId
      ? collections.map((collection) => (String(collection.id) === String(editingCollectionId) ? nextCollection : collection))
      : [...collections, nextCollection];
    saveCollections(nextCollections);
    collectionForm.reset();
    editingCollectionId = null;
    collectionSubmit.textContent = "Ajouter la collection";
    cancelCollectionEdit.hidden = true;
    renderCollections();
  });
}

if (collectionList) {
  collectionList.addEventListener("click", (event) => {
    const editButton = event.target.closest("[data-edit-collection]");
    if (editButton && collectionForm) {
      const collection = getCollections().find((item) => String(item.id) === editButton.dataset.editCollection);
      if (!collection) return;
      editingCollectionId = collection.id;
      collectionForm.elements.name.value = collection.name || "";
      collectionForm.elements.description.value = collection.description || "";
      collectionForm.elements.imageId.value = collection.imageId || "";
      collectionForm.elements.status.value = collection.status || "visible";
      collectionSubmit.textContent = "Enregistrer la collection";
      cancelCollectionEdit.hidden = false;
      collectionForm.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const button = event.target.closest("[data-delete-collection]");
    if (!button) return;
    saveCollections(getCollections().filter((collection) => String(collection.id) !== button.dataset.deleteCollection));
    renderCollections();
  });
}

if (cancelCollectionEdit) {
  cancelCollectionEdit.addEventListener("click", () => {
    editingCollectionId = null;
    collectionForm.reset();
    collectionSubmit.textContent = "Ajouter la collection";
    cancelCollectionEdit.hidden = true;
  });
}

if (exhibitionForm) {
  exhibitionForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(exhibitionForm);
    const exhibitions = getExhibitions();
    const nextExhibition = {
      id: editingExhibitionId || Date.now(),
      title: formData.get("title").trim(),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
      place: formData.get("place").trim(),
      city: formData.get("city").trim(),
      contentMode: formData.get("contentMode"),
      collectionIds: formData.getAll("collectionIds"),
      artworkIds: formData.getAll("artworkIds"),
      imageId: formData.get("imageId"),
      status: formData.get("status"),
      description: formData.get("description").trim()
    };
    const nextExhibitions = editingExhibitionId
      ? exhibitions.map((exhibition) => (String(exhibition.id) === String(editingExhibitionId) ? nextExhibition : exhibition))
      : [...exhibitions, nextExhibition];
    saveExhibitions(nextExhibitions);
    exhibitionForm.reset();
    editingExhibitionId = null;
    exhibitionSubmit.textContent = "Ajouter l'exposition";
    cancelExhibitionEdit.hidden = true;
    renderExhibitions();
  });
}

if (exhibitionList) {
  exhibitionList.addEventListener("click", (event) => {
    const editButton = event.target.closest("[data-edit-exhibition]");
    if (editButton && exhibitionForm) {
      const exhibition = getExhibitions().find((item) => String(item.id) === editButton.dataset.editExhibition);
      if (!exhibition) return;
      editingExhibitionId = exhibition.id;
      exhibitionForm.elements.title.value = exhibition.title || "";
      exhibitionForm.elements.startDate.value = exhibition.startDate || "";
      exhibitionForm.elements.endDate.value = exhibition.endDate || "";
      exhibitionForm.elements.place.value = exhibition.place || "";
      exhibitionForm.elements.city.value = exhibition.city || "";
      exhibitionForm.elements.contentMode.value = exhibition.contentMode || "collections";
      renderExhibitionChoices(exhibition.collectionIds || [exhibition.collectionId].filter(Boolean), exhibition.artworkIds || []);
      syncExhibitionMode();
      exhibitionForm.elements.imageId.value = exhibition.imageId || "";
      exhibitionForm.elements.status.value = exhibition.status || "a venir";
      exhibitionForm.elements.description.value = exhibition.description || "";
      exhibitionSubmit.textContent = "Enregistrer l'exposition";
      cancelExhibitionEdit.hidden = false;
      exhibitionForm.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const button = event.target.closest("[data-delete-exhibition]");
    if (!button) return;
    saveExhibitions(getExhibitions().filter((exhibition) => String(exhibition.id) !== button.dataset.deleteExhibition));
    renderExhibitions();
  });
}

if (cancelExhibitionEdit) {
  cancelExhibitionEdit.addEventListener("click", () => {
    editingExhibitionId = null;
    exhibitionForm.reset();
    exhibitionSubmit.textContent = "Ajouter l'exposition";
    cancelExhibitionEdit.hidden = true;
  });
}

if (exhibitionContentMode) {
  exhibitionContentMode.addEventListener("change", syncExhibitionMode);
  syncExhibitionMode();
}

if (imageBankForm) {
  imageBankForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(imageBankForm);
    const file = formData.get("imageFile");
    const name = formData.get("imageName").trim();
    if (!file || !file.type?.startsWith("image/")) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const images = getImageBank();
      const localImages = getLocalImageBank();
      localImages.push({
        id: Date.now(),
        name,
        src: reader.result
      });
      saveImageBank(localImages);
      imageBankForm.reset();
      renderImageBank();
    });
    reader.readAsDataURL(file);
  });
}

if (imageBankList) {
  imageBankList.addEventListener("submit", (event) => {
    const form = event.target.closest("[data-rename-image]");
    if (!form) return;
    event.preventDefault();
    const nextName = form.elements.imageName.value.trim();
    if (!nextName) return;
    saveImageName(form.dataset.renameImage, nextName);
    renderImageBank();
  });

  imageBankList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-delete-image]");
    if (!button) return;
    saveImageBank(getLocalImageBank().filter((image) => String(image.id) !== button.dataset.deleteImage));
    renderImageBank();
  });
}

renderImageBank();
renderCollections();
renderExhibitions();

if (adminArtworkList) {
  adminArtworkList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-delete-artwork]");
    if (!button) return;
    saveLocalArtworks(getLocalArtworks().filter((artwork) => String(artwork.id) !== button.dataset.deleteArtwork));
    renderAdminArtworks();
  });
  renderAdminArtworks();
}
