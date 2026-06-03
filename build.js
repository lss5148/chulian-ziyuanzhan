/**
 * 初恋资源站 - 静态站点生成器
 * 用法: node build.js
 * 输出: dist/ 目录，部署到 Cloudflare Pages
 */

const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const { marked } = require('marked');

const SRC = path.join(__dirname, 'src');
const DIST = path.join(__dirname, 'dist');
const PUBLIC = path.join(__dirname, 'public');

// Read data
const data = JSON.parse(fs.readFileSync(path.join(SRC, 'data', 'site.json'), 'utf-8'));
const posts = data.posts.filter(p => p.status === 'published');
const categories = data.categories;

// Read templates
const layoutTpl = fs.readFileSync(path.join(SRC, 'templates', 'layout.ejs'), 'utf-8');
const indexTpl = fs.readFileSync(path.join(SRC, 'templates', 'index.ejs'), 'utf-8');
const categoryTpl = fs.readFileSync(path.join(SRC, 'templates', 'category.ejs'), 'utf-8');
const postTpl = fs.readFileSync(path.join(SRC, 'templates', 'post.ejs'), 'utf-8');
const aboutTpl = fs.readFileSync(path.join(SRC, 'templates', 'about.ejs'), 'utf-8');
const tagsTpl = fs.readFileSync(path.join(SRC, 'templates', 'tags.ejs'), 'utf-8');
const errorTpl = fs.readFileSync(path.join(SRC, 'templates', 'error.ejs'), 'utf-8');

// Helper: render page in layout
function renderPage(pageContent, pageData) {
  const body = ejs.render(pageContent, pageData, { async: false });
  return ejs.render(layoutTpl, { ...pageData, body }, { async: false });
}

// Helper: write HTML file
function writeHtml(filePath, html) {
  const fullPath = path.join(DIST, filePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, html);
  console.log(`  ✓ ${filePath}`);
}

// Clean dist
if (fs.existsSync(DIST)) {
  fs.rmSync(DIST, { recursive: true });
}
fs.mkdirSync(DIST);

console.log('\n=== 初恋资源站 - 静态生成 ===\n');

// Shared data for all pages
const sharedData = {
  title: '初恋资源站 - 专注绿色纯净资源的下载平台',
  description: '初恋资源站 - 专注绿色纯净资源的下载平台，提供安卓软件、PC软件、游戏资源、实用教程等免费下载。',
  categories,
  tags: data.tags || [],
  path: '/'
};

// 1. Homepage
console.log('生成首页...');
const featuredPosts = posts.filter(p => p.is_featured);
const homepageData = {
  ...sharedData,
  title: '初恋资源站 - 专注绿色纯净资源的下载平台',
  description: '初恋资源站，专注绿色纯净资源的下载平台',
  path: '/',
  posts,
  featuredPosts
};
const indexHtml = renderPage(indexTpl, homepageData);
writeHtml('index.html', indexHtml);

// 2. Category pages
console.log('生成分类页...');
categories.forEach(cat => {
  const catPosts = posts.filter(p => p.category_id === cat.id);
  const catData = {
    ...sharedData,
    title: `${cat.name} - 初恋资源站`,
    description: cat.description || `${cat.name} - 初恋资源站`,
    path: `/category/${cat.slug}`,
    category: cat,
    posts: catPosts
  };
  const html = renderPage(categoryTpl, catData);
  writeHtml(`category/${cat.slug}.html`, html);
});

// 3. Post pages
console.log('生成文章页...');
const recentPosts = posts.slice(0, 6);

posts.forEach(post => {
  const contentHtml = marked.parse(post.content || '', { breaks: true });
  const relatedPosts = posts.filter(p => p.category_id === post.category_id && p.id !== post.id).slice(0, 4);

  const postData = {
    ...sharedData,
    title: `${post.title} - 初恋资源站`,
    description: post.summary || `${post.title} - 初恋资源站`,
    path: `/post/${post.slug}`,
    post,
    contentHtml,
    relatedPosts,
    recentPosts
  };
  const html = renderPage(postTpl, postData);
  writeHtml(`post/${post.slug}.html`, html);
});

// 4. About page
console.log('生成关于页...');
const aboutData = {
  ...sharedData,
  title: '关于我们 - 初恋资源站',
  description: '关于初恋资源站',
  path: '/about'
};
writeHtml('about.html', renderPage(aboutTpl, aboutData));

// 5. Tags page
console.log('生成标签页...');
const tagsData = {
  ...sharedData,
  title: '标签云 - 初恋资源站',
  description: '标签云 - 初恋资源站',
  path: '/tags'
};
writeHtml('tags.html', renderPage(tagsTpl, tagsData));

// 6. Search page (client-side: embed all post data for JS filtering)
console.log('生成搜索页...');
const searchHtml = renderPage(`<div class="breadcrumb-custom">
  <a href="/">首页</a> &raquo; <span>搜索</span>
</div>

<div class="section-header">
  <h3>搜索</h3>
</div>

<div class="mb-3">
  <form onsubmit="event.preventDefault(); doSearch();">
    <div class="input-group" style="max-width: 500px;">
      <input type="text" class="form-control" id="searchInput" placeholder="输入关键词搜索..." value="">
      <button class="btn btn-search" type="submit"><i class="fa fa-search"></i> 搜索</button>
    </div>
  </form>
</div>

<div id="searchResults" class="row g-3"></div>

<div id="searchEmpty" class="empty-state" style="display:none;">
  <div class="empty-icon"><i class="fa fa-search"></i></div>
  <p id="searchEmptyText">输入关键词开始搜索</p>
</div>

<script>
// All post data embedded for client-side search
const searchPosts = ${JSON.stringify(posts.map(p => ({
  title: p.title,
  slug: p.slug,
  summary: p.summary,
  category_name: p.category_name,
  category_slug: p.category_slug,
  created_at: p.created_at,
  view_count: p.view_count
})))};

function doSearch() {
  const q = document.getElementById('searchInput').value.trim().toLowerCase();
  const resultsDiv = document.getElementById('searchResults');
  const emptyDiv = document.getElementById('searchEmpty');
  const emptyText = document.getElementById('searchEmptyText');

  if (!q) {
    resultsDiv.innerHTML = '';
    emptyDiv.style.display = 'block';
    emptyText.textContent = '输入关键词开始搜索';
    return;
  }

  const matched = searchPosts.filter(p =>
    p.title.toLowerCase().includes(q) ||
    (p.summary && p.summary.toLowerCase().includes(q))
  );

  if (matched.length === 0) {
    resultsDiv.innerHTML = '';
    emptyDiv.style.display = 'block';
    emptyText.textContent = '没有找到与 "' + q + '" 相关的内容';
    return;
  }

  emptyDiv.style.display = 'none';
  resultsDiv.innerHTML = matched.map(p => \`
    <div class="col-6 col-md-4 col-lg-3">
      <div class="card h-100">
        <div class="card-img-top d-flex align-items-center justify-content-center" style="background: linear-gradient(135deg, rgba(0,212,255,0.1), rgba(124,58,237,0.1));">
          <i class="fa fa-file-o" style="font-size: 2.5rem; color: var(--accent); opacity: 0.5;"></i>
        </div>
        <div class="card-body">
          <h5 class="card-title"><a href="/post/\${p.slug}">\${p.title}</a></h5>
          <p class="card-text">\${p.summary || '暂无摘要'}</p>
        </div>
        <div class="card-footer">
          <span><i class="fa fa-calendar"></i> \${new Date(p.created_at).toLocaleDateString('zh-CN')}</span>
          <span class="float-end"><i class="fa fa-eye"></i> \${p.view_count}</span>
        </div>
      </div>
    </div>
  \`).join('');
}

// Auto-search from URL param
(function() {
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');
  if (q) {
    document.getElementById('searchInput').value = q;
    doSearch();
  }
})();
</script>`, {
  ...sharedData,
  title: '搜索 - 初恋资源站',
  description: '搜索 - 初恋资源站',
  path: '/search'
});
writeHtml('search.html', searchHtml);

// 7. Copy static assets
console.log('\n复制静态资源...');
function copyDir(src, dst) {
  if (!fs.existsSync(dst)) fs.mkdirSync(dst, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const s = path.join(src, entry.name);
    const d = path.join(dst, entry.name);
    if (entry.isDirectory()) {
      copyDir(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}
copyDir(PUBLIC, path.join(DIST));
console.log('  ✓ css/, js/ 已复制');

// 8. Write _redirects
console.log('\n生成 Cloudflare 配置...');
const redirects = `# Clean URLs (internal rewrites, not redirects)
/category/:slug /category/:slug.html  200
/post/:slug /post/:slug.html  200
`;
fs.writeFileSync(path.join(DIST, '_redirects'), redirects);
console.log('  ✓ _redirects');

// 9. Write _headers
const headers = `# Cache policy
/css/*
  Cache-Control: public, max-age=604800, immutable
/js/*
  Cache-Control: public, max-age=604800, immutable
`;
fs.writeFileSync(path.join(DIST, '_headers'), headers);
console.log('  ✓ _headers');

// Summary
console.log(`\n=== 生成完成 ===`);
console.log(`  文章: ${posts.length} 篇`);
console.log(`  分类: ${categories.length} 个`);
console.log(`  输出: ${DIST}`);
console.log(`  部署: 将 dist/ 文件夹上传到 Cloudflare Pages\n`);
