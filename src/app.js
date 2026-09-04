import { WORK_CATEGORIES, portfolioItems, filterPortfolio } from "./portfolio-data.js";

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
