export const WORK_CATEGORIES = Object.freeze(["全部", "AI短剧", "AI广告片"]);

export const portfolioItems = Object.freeze([
  {
    id: "dont-look-back",
    title: "DON’T LOOK BACK",
    category: "AI短剧",
    label: "国外短片",
    region: "国外",
    isDemo: false,
    poster: true,
    coverUrl: "./assets/posters/dont-look-back.png",
    duration: "01:01",
    summary: "丧尸危机中，父亲马克为保护十岁的女儿莉莉，将即将尸变的自己锁进冷库，让她带着母亲留下的项链独自逃生。",
    videoUrl: "./assets/videos/dont-look-back-web.mp4",
    accent: "#44545c",
    order: 0
  },
  {
    id: "the-last-deal",
    title: "THE LAST DEAL",
    category: "AI短剧",
    label: "国外短剧",
    region: "国外",
    isDemo: false,
    poster: true,
    coverUrl: "./assets/posters/the-last-deal.png",
    duration: "01:51",
    summary: "被冷酷总裁当作交易抛弃的契约妻子，离婚后亮出拯救他商业帝国的神秘投资人身份，令他追悔求爱，却也引来一场暗中酝酿的阴谋。",
    videoUrl: "./assets/videos/the-last-deal-web.mp4",
    accent: "#8b795b",
    order: 0.5
  },
  {
    id: "guiyanlou",
    title: "归雁楼",
    category: "AI短剧",
    label: "国内短片",
    region: "国内",
    isDemo: false,
    poster: true,
    coverUrl: "./assets/posters/guiyanlou.png",
    duration: "02:28",
    summary: "为追查母亲死于二十年前大火的真相，林夏搬进能靠转发短信转移灾祸的归雁楼，揭穿老住户守护的秘密，并将一场火灾转给他，逼他面对父辈留下的血债。",
    videoUrl: "./assets/videos/guiyanlou-web.mp4",
    accent: "#665844",
    order: 0.75
  },
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

export function filterPortfolio(items, category, region = "全部") {
  const matchingItems = items.filter(item => (category === "全部" || item.category === category) && (category !== "AI短剧" || region === "全部" || item.region === region));
  return [...matchingItems].sort((a, b) => a.order - b.order);
}

export function findPortfolioItem(items, id) {
  return items.find((item) => item.id === id);
}
