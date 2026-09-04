# AI Film Portfolio

一个不需要构建步骤的静态单页作品集，使用原生 HTML、CSS 和 ES Module JavaScript 实现。页面包含 AI 短剧与 AI 广告片筛选、作品视频弹窗，以及响应式与基础可访问性处理。

## 本地预览

在项目目录运行：

```powershell
npx serve .
```

若已安装 Python，也可以离线启动本地预览：

```powershell
python -m http.server 4174 --bind 127.0.0.1
```

然后在浏览器打开命令行显示的地址；Python 命令通常为 `http://127.0.0.1:4174/`。

## 检查

```powershell
npm test
```

## 替换内容

当前四个作品（《雾城来信》《午夜档案》《余光》《零点咖啡》）均为演示项目，尚未配置封面或视频素材。首屏右侧是 CSS 制作的非作品视觉，不是作品截图或影片封面。

创作者姓名、邮箱和照片尚未提供，因此页面没有虚构这些信息。请按实际资料更新：

- `index.html`：页面标题、首屏/关于我文案，以及联系区的真实联系方式；当前联系区保留的是已有 GitHub 链接，若不用请替换或移除。
- `src/portfolio-data.js`：每个作品的 `coverUrl`、`videoUrl`、`order` 及标题、分类、时长、简介和强调色。`coverUrl` 可为仓库内相对图片路径或 HTTPS 图片地址；`order` 决定卡片与筛选后的展示顺序。
- `src/app.js`：作品卡片的“演示项目”标签目前硬编码在 `createWorkCard()` 中；正式上线时请在这里删除、替换，或改为由数据控制。

`videoUrl` 必须是浏览器能直接读取的媒体文件 URL（例如 `./assets/videos/example.mp4` 或返回 MP4/WebM 内容的 HTTPS URL）。不要填写 YouTube、Bilibili 等平台的“观看页”链接；这类页面不是视频文件，原生 `<video>` 无法直接播放。若使用外部地址，请同时确认它允许跨域读取和直接播放。

## 发布到 GitHub Pages

合并到目标仓库的 `main` 分支后，在 GitHub 仓库的 **Settings → Pages** 中：

1. 将 Source 设为 **Deploy from a branch**。
2. 选择分支 `main`。
3. 选择目录 `/ (root)` 并保存。

站点使用相对资源路径，因此适合以仓库根目录发布。GitHub Pages 是否可用取决于账户方案及该仓库的私有/公开设置；本项目不会自动将仓库改为公开，也不会替你修改部署或仓库可见性设置。
