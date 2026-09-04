import { WORK_CATEGORIES, portfolioItems, filterPortfolio, findPortfolioItem } from "./portfolio-data.js";

const filters = document.querySelector("#work-filters");
const grid = document.querySelector("#work-grid");

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
  playButton.className = "work-card__play";
  playButton.type = "button";
  playButton.dataset.workId = item.id;
  playButton.setAttribute("aria-label", `播放《${item.title}》`);

  if (item.coverUrl) {
    const cover = document.createElement("img");
    cover.className = "work-card__cover";
    cover.src = item.coverUrl;
    cover.alt = "";
    cover.loading = "lazy";
    playButton.append(cover);
  }

  const metadata = document.createElement("div");
  metadata.className = "work-card__metadata";
  appendTextElement(metadata, "span", "work-card__index", item.category);
  appendTextElement(metadata, "span", "work-card__demo", "演示项目");
  appendTextElement(playButton, "span", "work-card__title", item.title);
  appendTextElement(playButton, "span", "work-card__summary", item.summary);
  appendTextElement(playButton, "span", "work-card__duration", item.duration);
  appendTextElement(playButton, "span", "work-card__action", "查看影片 ↗").setAttribute("aria-hidden", "true");
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

function renderWorks(category = "全部") {
  const fragment = document.createDocumentFragment();

  for (const item of filterPortfolio(portfolioItems, category)) {
    fragment.append(createWorkCard(item));
  }

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
  setActiveFilter(category);
  renderWorks(category);
});

const dialog = document.querySelector("#video-dialog");
const video = dialog.querySelector("video");
const videoTitle = dialog.querySelector("#video-title");
const videoStatus = dialog.querySelector("#video-status");
let lastTrigger = null;
let previousOverflow = "";
let modalActive = false;

function openVideo(item, trigger = document.activeElement) {
  if (modalActive) closeVideo();
  lastTrigger = trigger;
  previousOverflow = document.body.style.overflow;
  modalActive = true;
  videoTitle.textContent = item.title;
  videoStatus.textContent = "视频素材即将更新";
  const hasVideo = Boolean(item.videoUrl?.trim());
  video.hidden = !hasVideo;
  videoStatus.hidden = hasVideo;
  if (hasVideo) video.src = item.videoUrl;
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
  video.pause();
  video.hidden = true;
  videoStatus.hidden = false;
  videoStatus.textContent = "视频暂时无法播放，请稍后再试。";
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
