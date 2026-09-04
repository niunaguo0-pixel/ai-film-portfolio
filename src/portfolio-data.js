export const WORK_CATEGORIES = Object.freeze(["全部", "AI短剧", "AI广告片"]);

export const portfolioItems = Object.freeze([
  {
    id: "drama-mist-letter",
    title: "雾城来信",
    category: "AI短剧",
    coverUrl: "",
    duration: "01:24",
    summary: "一封迟到多年的信，让两段被遗忘的记忆重新交汇。",
    videoUrl: "",
    accent: "#71685f",
    order: 1
  },
  {
    id: "drama-midnight-record",
    title: "午夜档案",
    category: "AI短剧",
    coverUrl: "",
    duration: "00:58",
    summary: "值夜员在旧档案中发现了一段仍在发生的影像。",
    videoUrl: "",
    accent: "#4f5960",
    order: 2
  },
  {
    id: "ad-afterglow",
    title: "余光",
    category: "AI广告片",
    coverUrl: "",
    duration: "00:30",
    summary: "以光影和材质变化呈现一支克制的品牌概念广告。",
    videoUrl: "",
    accent: "#8a6d4c",
    order: 3
  },
  {
    id: "ad-zero-coffee",
    title: "零点咖啡",
    category: "AI广告片",
    coverUrl: "",
    duration: "00:20",
    summary: "为夜晚仍在创造的人，保留一段清醒时刻。",
    videoUrl: "",
    accent: "#5d493c",
    order: 4
  }
]);

export function filterPortfolio(items, category) {
  const matchingItems = category === "全部" ? items : items.filter((item) => item.category === category);
  return [...matchingItems].sort((a, b) => a.order - b.order);
}

export function findPortfolioItem(items, id) {
  return items.find((item) => item.id === id);
}
