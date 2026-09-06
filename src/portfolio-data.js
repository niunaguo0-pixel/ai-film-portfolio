export const WORK_CATEGORIES = Object.freeze(["全部", "AI短剧", "AI广告片", "其他"]);

export const portfolioItems = Object.freeze([
  {
    id: "dont-look-back",
    title: "DON’T LOOK BACK",
    category: "AI短剧",
    region: "国外",
    isDemo: false,
    poster: true,
    coverUrl: "./assets/posters-web/dont-look-back.webp",
    duration: "01:01",
    summary: "丧尸危机中，父亲马克为保护十岁的女儿莉莉，将即将尸变的自己锁进冷库，让她带着母亲留下的项链独自逃生。",
    videoUrl: "./assets/videos/dont-look-back-web.mp4",
    videoFallbackUrl: "https://github.com/niunaguo0-pixel/ai-film-portfolio/releases/download/portfolio-media/dont-look-back-original.mp4",
    accent: "#44545c",
    order: 0
  },
  {
    id: "the-last-deal",
    title: "THE LAST DEAL",
    category: "AI短剧",
    region: "国外",
    isDemo: false,
    poster: true,
    coverUrl: "./assets/posters-web/the-last-deal.webp",
    duration: "01:51",
    summary: "被冷酷总裁当作交易抛弃的契约妻子，离婚后亮出拯救他商业帝国的神秘投资人身份，令他追悔求爱，却也引来一场暗中酝酿的阴谋。",
    videoUrl: "./assets/videos/the-last-deal-web.mp4",
    videoFallbackUrl: "https://github.com/niunaguo0-pixel/ai-film-portfolio/releases/download/portfolio-media/the-last-deal-original.mp4",
    accent: "#8b795b",
    order: 0.5
  },
  {
    id: "guiyanlou",
    title: "归雁楼",
    category: "AI短剧",
    region: "国内",
    isDemo: false,
    poster: true,
    coverUrl: "./assets/posters-web/guiyanlou.webp",
    duration: "02:28",
    summary: "为追查母亲死于二十年前大火的真相，林夏搬进能靠转发短信转移灾祸的归雁楼，揭穿老住户守护的秘密，并将一场火灾转给他，逼他面对父辈留下的血债。",
    videoUrl: "./assets/videos/guiyanlou-web-optimized.mp4",
    accent: "#665844",
    order: 0.75
  },
  {
    id: "hotel-cleaner-ceo",
    title: "我在酒店当保洁，顺手收了个总裁",
    category: "AI短剧",
    region: "国内",
    isDemo: false,
    coverUrl: "./assets/posters-web/hotel-cleaner-ceo-frame.webp",
    duration: "02:31",
    summary: "总裁陆青云卧底自家酒店装笨查亏损，被保洁陈圆圆当成新人罩着，两人联手花式反杀黑心经理，连反派都成了“神助攻黑粉”，一路打脸逆袭成总裁夫人。",
    videoUrl: "./assets/videos/hotel-cleaner-ceo-web.mp4",
    videoFallbackUrl: "https://github.com/niunaguo0-pixel/ai-film-portfolio/releases/download/portfolio-media/hotel-cleaner-ceo-original.mp4",
    accent: "#9a7445",
    order: 0.9
  },
  {
    id: "ad-speed-prologue",
    title: "疾速序章",
    category: "AI广告片",
    coverUrl: "./assets/posters-web/speed-prologue.webp",
    duration: "00:30",
    isDemo: false,
    summary: "以速度与力量的视觉表达，展现跑车的动感锋芒与驾驭激情。",
    videoUrl: "./assets/videos/speed-prologue-web.mp4",
    videoFallbackUrl: "https://github.com/niunaguo0-pixel/ai-film-portfolio/releases/download/portfolio-media/speed-prologue-original.mp4",
    accent: "#8a6d4c",
    order: 0.91
  },
  {
    id: "ad-light-is-her",
    title: "光，即是她",
    category: "AI广告片",
    coverUrl: "./assets/posters-web/light-is-her.webp",
    duration: "00:15",
    isDemo: false,
    summary: "以光影映衬珠宝之美，诠释女性自信闪耀的独特魅力。",
    videoUrl: "./assets/videos/light-is-her-web.mp4",
    videoFallbackUrl: "https://github.com/niunaguo0-pixel/ai-film-portfolio/releases/download/portfolio-media/light-is-her-original.mp4",
    accent: "#5d493c",
    order: 4
  },
  {
    id: "other-cat-ip-brand",
    title: "猫咪 IP 与品牌空间设计",
    category: "其他",
    isDemo: false,
    coverUrl: "./assets/other/cat-ip-01.webp",
    summary: "从角色设定、品牌视觉、包装周边到线下零售空间的猫咪 IP 系统设计。",
    gallery: [
      "./assets/other/cat-ip-01.webp",
      "./assets/other/cat-ip-02.webp",
      "./assets/other/cat-ip-03.webp",
      "./assets/other/cat-ip-04.webp",
      "./assets/other/cat-ip-05.webp",
      "./assets/other/cat-ip-06.webp"
    ],
    accent: "#c58f78",
    order: 5
  },
  {
    id: "other-fashion-commerce",
    title: "女装电商视觉",
    category: "其他",
    isDemo: false,
    coverUrl: "./assets/other/fashion-01.webp",
    summary: "围绕针织女装打造的详情页、材质卖点、配色与穿搭场景视觉。",
    gallery: [
      "./assets/other/fashion-01.webp",
      "./assets/other/fashion-02.webp",
      "./assets/other/fashion-03.webp",
      "./assets/other/fashion-04.webp"
    ],
    accent: "#b99072",
    order: 6
  },
  {
    id: "other-golden-night",
    title: "鎏金假面夜活动海报",
    category: "其他",
    isDemo: false,
    coverUrl: "./assets/other/golden-night-01.webp",
    summary: "以黑金光影与假面小提琴手为核心的高端音乐活动主视觉海报。",
    gallery: ["./assets/other/golden-night-01.webp"],
    accent: "#ad7a2d",
    order: 7
  }
]);

export function filterPortfolio(items, category, region = "全部") {
  const matchingItems = items.filter(item => (category === "全部" || item.category === category) && (category !== "AI短剧" || region === "全部" || item.region === region));
  return [...matchingItems].sort((a, b) => a.order - b.order);
}

export function findPortfolioItem(items, id) {
  return items.find((item) => item.id === id);
}
