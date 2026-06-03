# 部署到 Cloudflare Pages 完全指南

## 前提条件

1. 注册 Cloudflare 账号 (cloudflare.com)
2. 准备好你的域名（可选，也可以用 cloudflare 提供的免费域名）

---

## 部署步骤

### 第一步：生成静态文件

在本地电脑运行：

```bash
cd chulian-resource-static
npm install     # 只需运行一次
npm run build   # 每次更新内容后重新生成
```

生成的文件在 `dist/` 文件夹中。

### 第二步：上传到 Cloudflare Pages

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 左侧菜单 → **Workers 和 Pages**
3. 点击 **Pages** → **创建应用程序** → **Pages**
4. 选择 **直接上传**

   ![](https://cloudflare.com)

5. 项目名称填写：`chulian-resource`（或你喜欢的名字）
6. **生产分支**：随便填（不上传代码，只上传静态文件）
7. 点击"创建目录"，选择 `dist/` 整个文件夹
8. 点击 **部署**

等待约 30 秒，部署完成后会分配一个域名：
`https://chulian-resource.pages.dev`

### 第三步（可选）：绑定自定义域名

1. 部署完成后，点击项目 → **自定义域**
2. 添加你的域名（如 `resource.chulian.cc`）
3. 按照提示设置 DNS 解析

---

## 如何添加新文章

1. 编辑 `src/data/site.json`
2. 在 `posts` 数组末尾添加新文章对象：

```json
{
  "id": 6,
  "title": "新文章标题",
  "slug": "new-article-slug",
  "content": "## Markdown 内容\n\n写文章内容...",
  "summary": "文章简介",
  "category_id": 1,
  "cover_image": "",
  "download_url": "https://pan.baidu.com/...",
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

3. 运行 `npm run build`
4. 在 Cloudflare Pages 点击 → **部署** → 重新上传 `dist/` 文件夹

---

## 内容管理小技巧

**没有后台的情况下，建议配合 GitHub：**

1. 将项目推到 GitHub 仓库
2. 在 Cloudflare Pages 的 **创建应用程序** 中选择 **连接到 Git**
3. 选择你的仓库
4. 设置构建命令：`npm run build`
5. 设置输出目录：`dist`
6. 每次你 push 代码到 GitHub，Cloudflare 会自动重新构建和部署

这样你只要：
```
编辑 site.json → git push → 自动部署完成
```

---

## 本地预览

```bash
cd dist
# 用 Python 启动本地服务器
python3 -m http.server 8080
# 或
npx serve .

# 访问 http://localhost:8080
```

---

## 文件结构说明

```
chulian-resource-static/
├── src/
│   ├── data/
│   │   └── site.json          # 所有文章和分类数据（编辑这个）
│   └── templates/             # EJS 模板文件（一般不用动）
│       ├── layout.ejs
│       ├── index.ejs
│       ├── category.ejs
│       ├── post.ejs
│       ├── search.ejs
│       ├── about.ejs
│       └── tags.ejs
├── public/                    # 静态资源
│   ├── css/style.css
│   └── js/main.js
├── build.js                   # 构建脚本
├── dist/                      # 生成的结果，上传这个到 Cloudflare
└── CLOUDFLARE.md              # 本文件
```
