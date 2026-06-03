# 初恋资源站 — 项目文档

## 项目概述

初恋资源站是一个绿色的软件/资源下载站，使用静态站点生成器构建，部署在 Cloudflare Pages。

**定位**：专注绿色纯净资源的下载平台  
**链接**：https://clziyuanku.ccwu.cc  
**技术栈**：Node.js + EJS + Markdown + Bootstrap 5 + Cloudflare Pages  

---

## 项目结构

```
chulian-resource-static/
├── src/
│   ├── data/
│   │   └── site.json          # ★ 核心：所有文章和分类数据
│   └── templates/             # EJS 页面模板
│       ├── layout.ejs         # 全局布局（导航栏 + 页脚）
│       ├── index.ejs          # 首页
│       ├── category.ejs       # 分类列表页
│       ├── post.ejs          # 文章详情页
│       ├── search.ejs        # 搜索页（客户端过滤）
│       ├── about.ejs         # 关于页
│       ├── tags.ejs          # 标签页
│       └── error.ejs         # 错误页
├── public/
│   ├── css/style.css         # 全局样式（暗色主题）
│   └── js/main.js            # 前端脚本
├── build.js                   # ★ 构建脚本：读取 JSON → 生成静态 HTML
├── dist/                      # 构建输出目录（上传到 Cloudflare Pages）
├── CLOUDFLARE.md              # 部署到 Cloudflare Pages 的详细指南
└── package.json
```

---

## 添加文章

编辑 `src/data/site.json`，在 `posts` 数组中添加新对象：

```json
{
  "id": 6,
  "title": "文章标题",
  "slug": "article-slug",
  "content": "## Markdown 内容\n\n正文...",
  "summary": "一句话简介",
  "category_id": 1,
  "cover_image": "",
  "download_url": "https://...",
  "file_size": "15MB",
  "file_version": "v3.0",
  "extract_code": "1234",
  "is_featured": 0,
  "view_count": 0,
  "status": "published",
  "created_at": "2026-06-04 12:00:00",
  "category_name": "安卓软件",
  "category_slug": "android"
}
```

**字段说明：**

| 字段 | 说明 | 必填 |
|------|------|------|
| `id` | 唯一编号，新 id = 最大 id + 1 | 是 |
| `title` | 文章标题 | 是 |
| `slug` | URL 中的英文别名 | 是 |
| `content` | Markdown 格式正文 | 是 |
| `summary` | 列表页显示的摘要 | 推荐 |
| `category_id` | 所属分类 id | 是 |
| `download_url` | 下载链接 | 可选 |
| `file_size` | 文件大小 | 可选 |
| `file_version` | 版本号 | 可选 |
| `extract_code` | 提取码 | 可选 |
| `is_featured` | 1=首页轮播推荐 | 可选 |
| `status` | "published" 或 "draft" | 是 |

**分类表：**

| id | name | slug |
|----|------|------|
| 1 | 安卓软件 | android |
| 2 | PC软件 | pc-software |
| 3 | 游戏资源 | games |
| 4 | 实用教程 | tutorials |
| 5 | 在线工具 | online-tools |

---

## 构建与部署

### 本地构建

```bash
npm install
npm run build
```

输出到 `dist/` 目录。

### 本地预览

```bash
cd dist
python -m http.server 8080
# 访问 http://localhost:8080
```

### Cloudflare Pages 自动部署

连接 Git 仓库后，每次 push 到 main 分支自动构建部署：

```
构建命令: npm run build
输出目录: dist
```

---

## 版本记录

| 日期 | 版本 | 说明 |
|------|------|------|
| 2026-06-03 | v1.0 | 初始版本，静态站点 + Cloudflare Pages 部署 |

---

## 相关链接

- 线上网站：https://clziyuanku.ccwu.cc
- 源码仓库：https://github.com/lss5148/chulian-ziyuanzhan
- Cloudflare Dashboard：https://dash.cloudflare.com

---

## 微信公众号矩阵

公众号名称（建议）：**初恋资源站**  
定位：软件推荐 + 实用教程 + 游戏资源  
更新频率：每周 2-3 篇  
引流路径：公众号文章 → 阅读原文 → 网站  
变现路径：流量主（500粉）→ 软文（2000粉+）→ 广告联盟（网站端）

### 公众号文章模板

每篇包含：
1. 标题（吸引眼球，但不过分标题党）
2. 导语（一句话概括价值）
3. 正文（功能亮点 + 截图 + 使用感受，500-800字）
4. 结尾（引导点击阅读原文到网站，无诱导话术）
