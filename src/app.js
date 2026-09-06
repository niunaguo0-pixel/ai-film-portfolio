import { WORK_CATEGORIES, portfolioItems, filterPortfolio, findPortfolioItem } from "./portfolio-data.js?v=6";

const filters = document.querySelector("#work-filters");
const grid = document.querySelector("#work-grid");
const regionFilters = document.querySelector("#region-filters");
for (const region of ["全部", "国外", "国内"]) {
  const button = document.createElement("button");
  button.className = "filter-button";
  button.type = "button";
  button.dataset.region = region;
  button.textContent = region;
  button.setAttribute("aria-pressed", String(region === "全部"));
  regionFilters.append(button);
}
regionFilters.addEventListener("click", event => {
  const button = event.target.closest(".filter-button");
  if (!button || !regionFilters.contains(button)) return;
  for (const option of regionFilters.querySelectorAll(".filter-button")) {
    option.setAttribute("aria-pressed", String(option === button));
  }
  renderWorks("AI短剧", button.dataset.region);
});

function appendTextElement(parent, tagName, className, text) {
  const element = document.createElement(tagName);
  element.className = className;
  element.textContent = text;
  parent.append(element);
  return element;
}

function createWorkCard(item) {
  const card = document.createElement("article");
  card.className = "work-card";
  card.style.setProperty("--card-accent", item.accent);

  const playButton = document.createElement("button");
  playButton.className = item.poster ? "work-card__play work-card__play--poster" : "work-card__play";
  playButton.type = "button";
  playButton.dataset.workId = item.id;
  const isGallery = Boolean(item.gallery?.length);
  playButton.setAttribute("aria-label", `${isGallery ? "查看" : "播放"}《${item.title}》`);

  if (item.coverUrl) {
    const cover = document.createElement("img");
    cover.className = "work-card__cover";
    cover.src = item.coverUrl;
    cover.alt = "";
    cover.loading = "lazy";
    cover.decoding = "async";
    cover.fetchPriority = "low";
    playButton.append(cover);
  }

  const metadata = document.createElement("div");
  metadata.className = "work-card__metadata";
  if (item.isDemo !== false) appendTextElement(metadata, "span", "work-card__demo", "演示项目");
  appendTextElement(playButton, "span", "work-card__title", item.title);
  appendTextElement(playButton, "span", "work-card__summary", item.summary);
  appendTextElement(playButton, "span", "work-card__action", `${isGallery ? "查看作品" : "查看影片"} ↗`).setAttribute("aria-hidden", "true");
  playButton.prepend(metadata);

  card.append(playButton);
  return card;
}

function renderFilters(activeCategory = "全部") {
  const fragment = document.createDocumentFragment();

  for (const category of WORK_CATEGORIES) {
    const button = document.createElement("button");
    button.className = "filter-button";
    button.type = "button";
    button.dataset.category = category;
    button.setAttribute("aria-pressed", String(category === activeCategory));
    button.textContent = category;
    fragment.append(button);
  }

  filters.replaceChildren(fragment);
}

function renderWorks(category = "全部", region = "全部") {
  const fragment = document.createDocumentFragment();

  const items = filterPortfolio(portfolioItems, category, region);
  for (const item of items) {
    fragment.append(createWorkCard(item));
  }

  if (!items.length) appendTextElement(fragment, "p", "work-empty", "该分类作品即将更新").setAttribute("role", "status");
  grid.replaceChildren(fragment);
}

function setActiveFilter(category) {
  for (const button of filters.querySelectorAll(".filter-button")) {
    button.setAttribute("aria-pressed", String(button.dataset.category === category));
  }
}

renderFilters();
renderWorks();

filters.addEventListener("click", (event) => {
  const button = event.target.closest(".filter-button");
  if (!button || !filters.contains(button)) return;

  const category = button.dataset.category;
  regionFilters.hidden = category !== "AI短剧";
  for (const option of regionFilters.querySelectorAll(".filter-button")) {
    option.setAttribute("aria-pressed", String(option.dataset.region === "全部"));
  }
  setActiveFilter(category);
  renderWorks(category);
});

const dialog = document.querySelector("#video-dialog");
const video = dialog.querySelector("video");
const videoTitle = dialog.querySelector("#video-title");
const videoStatus = dialog.querySelector("#video-status");
const videoFeedback = dialog.querySelector("#video-feedback");
const videoRetry = dialog.querySelector("#video-retry");
const imageGallery = dialog.querySelector("#image-gallery");
let lastTrigger = null;
let previousOverflow = "";
let modalActive = false;
let activeSources = [];
let activeSourceIndex = 0;

function loadActiveVideo() {
  const source = activeSources[activeSourceIndex];
  if (!source) return;
  video.hidden = false;
  videoFeedback.hidden = false;
  videoRetry.hidden = true;
  videoStatus.textContent = activeSourceIndex === 0 ? "正在加载适合网页播放的版本…" : "正在尝试备用视频源…";
  video.src = source;
  video.load();
}

function openVideo(item, trigger = document.activeElement) {
  if (modalActive) closeVideo();
  lastTrigger = trigger;
  previousOverflow = document.body.style.overflow;
  modalActive = true;
  videoTitle.textContent = item.title;
  videoStatus.textContent = "视频素材即将更新";
  imageGallery.replaceChildren();
  const hasGallery = Boolean(item.gallery?.length);
  imageGallery.hidden = !hasGallery;
  if (hasGallery) {
    const fragment = document.createDocumentFragment();
    item.gallery.forEach((source, index) => {
      const image = document.createElement("img");
      image.src = source;
      image.alt = `${item.title}，第 ${index + 1} 张`;
      image.loading = index === 0 ? "eager" : "lazy";
      image.decoding = "async";
      fragment.append(image);
    });
    imageGallery.append(fragment);
  }
  activeSources = [item.videoUrl, item.videoFallbackUrl].filter((source, index, sources) =>
    source?.trim() && sources.indexOf(source) === index
  );
  activeSourceIndex = 0;
  const hasVideo = activeSources.length > 0;
  video.hidden = !hasVideo;
  videoFeedback.hidden = hasGallery;
  videoRetry.hidden = true;
  if (hasVideo && !hasGallery) loadActiveVideo();
  document.body.style.overflow = "hidden";
  dialog.showModal();
}

function releaseVideo() {
  if (!modalActive) return;
  modalActive = false;
  video.pause();
  video.removeAttribute("src");
  video.load();
  video.hidden = true;
  imageGallery.hidden = true;
  imageGallery.replaceChildren();
  activeSources = [];
  activeSourceIndex = 0;
  document.body.style.overflow = previousOverflow;
  const trigger = lastTrigger;
  lastTrigger = null;
  if (trigger?.isConnected) trigger.focus({ preventScroll: true });
}

function closeVideo() {
  // Native close emits its own event; cleanup is guarded and never calls close.
  if (dialog.open) dialog.close();
  releaseVideo();
}

grid.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-work-id]");
  if (!trigger || !grid.contains(trigger)) return;
  const item = findPortfolioItem(portfolioItems, trigger.dataset.workId);
  if (item) openVideo(item, trigger);
});

dialog.querySelector("[data-close-dialog]").addEventListener("click", closeVideo);
dialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeVideo();
});
dialog.addEventListener("close", () => {
  // Ignore a queued event from an earlier dialog session if already reopened.
  if (!dialog.open) releaseVideo();
});
dialog.addEventListener("click", (event) => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom) closeVideo();
});
video.addEventListener("error", () => {
  if (!modalActive || !video.getAttribute("src")) return;
  if (activeSourceIndex + 1 < activeSources.length) {
    activeSourceIndex += 1;
    loadActiveVideo();
    return;
  }
  video.pause();
  video.hidden = true;
  videoFeedback.hidden = false;
  videoRetry.hidden = false;
  videoStatus.textContent = "视频暂时无法播放，请稍后再试。";
});
video.addEventListener("loadedmetadata", () => {
  if (!modalActive) return;
  videoFeedback.hidden = true;
});
videoRetry.addEventListener("click", () => {
  activeSourceIndex = 0;
  loadActiveVideo();
});

const navLinks = [...document.querySelectorAll('nav a[href^="#"]')];
const sections = [...document.querySelectorAll("main > section[id]")];

function updateNavigation() {
  let current = sections[0];
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= window.innerHeight * 0.35) current = section;
  }
  // The final, short section may never reach the viewport's upper region.
  if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
    current = sections.at(-1);
  }
  for (const link of navLinks) {
    if (link.getAttribute("href") === `#${current.id}`) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  }
}

if (typeof IntersectionObserver !== "undefined") {
  const observer = new IntersectionObserver(updateNavigation, { threshold: [0, 0.25, 0.5, 0.75, 1] });
  sections.forEach(section => observer.observe(section));
}
window.addEventListener("scroll", updateNavigation, { passive: true });
window.addEventListener("resize", updateNavigation);
updateNavigation();

if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations()
    .then(registrations => Promise.all(registrations.map(registration => registration.unregister())))
    .catch(() => {});
}
if (typeof caches !== "undefined") {
  caches.keys()
    .then(keys => Promise.all(keys.filter(key => key.startsWith("ai-film-portfolio-")).map(key => caches.delete(key))))
    .catch(() => {});
}
