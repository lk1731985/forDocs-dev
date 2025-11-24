import{_ as t,c as i,o as a,ag as s}from"./chunks/framework.7sd1gWXP.js";const c=JSON.parse('{"title":"1. 配置 Git 全局身份（首次使用必须）","description":"","frontmatter":{},"headers":[],"relativePath":"studyCn/git/教程.md","filePath":"studyCn/git/教程.md"}'),n={name:"studyCn/git/教程.md"};function o(r,e,l,p,h,d){return a(),i("div",null,[...e[0]||(e[0]=[s(`<h3 id="vitepress-部署至-github-pages-问题总结与完整教程" tabindex="-1">VitePress 部署至 GitHub Pages 问题总结与完整教程 <a class="header-anchor" href="#vitepress-部署至-github-pages-问题总结与完整教程" aria-label="Permalink to &quot;VitePress 部署至 GitHub Pages 问题总结与完整教程&quot;">​</a></h3><p>一、全程核心问题总结</p><ol><li>Git 基础配置问题 提交代码提示「Author identity unknown」：未配置 Git 用户名 / 邮箱，无法完成代码提交； 推送被拒绝：远程 main 分支有本地未同步的代码，Git 要求先合并再推送； SSL 证书验证失败：Windows 系统下 Git 因 SSL 证书配置问题，无法连接 GitHub 远程仓库。</li><li>GitHub Pages 部署冲突问题 Jekyll 构建干扰：GitHub Pages 默认触发 Jekyll 构建，与 VitePress 静态产物冲突，导致文件解析错误； YAML 语法错误：index.md 前置元数据格式错误，触发 Jekyll 解析失败； 部署分支 / 目录不匹配：Action 监听分支（原 dev）与实际推送分支（main）不一致，部署未触发；Pages 部署源目录选错（非 gh-pages 根目录）。</li><li>VitePress 配置与路由问题 base 路径未配置：GitHub Pages 部署在子路径 /forDocs-dev/，VitePress 资源路径错误导致 404； 单页应用路由兼容：VitePress 默认 history 模式与 GitHub Pages 路由规则不匹配，引发 404。</li><li>自动化部署 Action 问题 缺少 pnpm 环境：GitHub Actions 运行环境未预装 pnpm，导致「找不到 pnpm 命令」； 锁文件不一致：pnpm-lock.yaml 与 package.json 依赖版本不匹配，CI 环境下 frozen-lockfile 校验失败。 二、完整部署教程</li><li>本地准备与 Git 基础配置 bash</li></ol><h1 id="_1-配置-git-全局身份-首次使用必须" tabindex="-1">1. 配置 Git 全局身份（首次使用必须） <a class="header-anchor" href="#_1-配置-git-全局身份-首次使用必须" aria-label="Permalink to &quot;1. 配置 Git 全局身份（首次使用必须）&quot;">​</a></h1><p>git config --global user.name &quot;你的GitHub用户名&quot; git config --global user.email &quot;你的GitHub注册邮箱&quot;</p><h1 id="_2-解决-windows-下-ssl-证书推送失败问题-临时方案" tabindex="-1">2. 解决 Windows 下 SSL 证书推送失败问题（临时方案） <a class="header-anchor" href="#_2-解决-windows-下-ssl-证书推送失败问题-临时方案" aria-label="Permalink to &quot;2. 解决 Windows 下 SSL 证书推送失败问题（临时方案）&quot;">​</a></h1><p>git config --global http.sslVerify false</p><h1 id="_3-可选-永久修复-ssl-证书问题-windows" tabindex="-1">3. （可选）永久修复 SSL 证书问题（Windows） <a class="header-anchor" href="#_3-可选-永久修复-ssl-证书问题-windows" aria-label="Permalink to &quot;3. （可选）永久修复 SSL 证书问题（Windows）&quot;">​</a></h1><p>git config --global http.sslCAinfo &quot;C:\\Program Files\\Git\\mingw64\\ssl\\certs\\ca-bundle.crt&quot; 2. VitePress 关键配置（解决 404 核心） 修改 docs/.vitepress/config.ts，确保路径与路由兼容： typescript import { defineConfig } from &#39;vitepress&#39;;</p><p>export default defineConfig({ // 核心：与 GitHub 仓库名一致（例：仓库名 forDocs-dev，填 /forDocs-dev/） base: &#39;/forDocs-dev/&#39;,<br> build: { outDir: &#39;./docs/.vitepress/dist&#39; // 构建产物输出目录 }, // 兼容 GitHub Pages 路由规则（可选，解决单页应用 404） vite: { build: { target: &#39;es2020&#39; } } }); 3. 创建自动化部署 Action 配置 在仓库根目录创建 .github/workflows/deploy.yml，内容如下： yaml name: VitePress Deploy</p><h1 id="触发条件-main-分支推送-手动触发" tabindex="-1">触发条件：main 分支推送 / 手动触发 <a class="header-anchor" href="#触发条件-main-分支推送-手动触发" aria-label="Permalink to &quot;触发条件：main 分支推送 / 手动触发&quot;">​</a></h1><p>on: push: branches: [main] workflow_dispatch:</p><p>jobs: deploy: runs-on: ubuntu-latest permissions: contents: write # 赋予写入 gh-pages 分支权限</p><pre><code>steps:
  - name: 拉取仓库代码
    uses: actions/checkout@v4
    with:
      fetch-depth: 0

  - name: 安装 Node.js
    uses: actions/setup-node@v4
    with:
      node-version: 20

  - name: 安装 pnpm 包管理器
    run: npm install -g pnpm

  - name: 安装项目依赖（跳过锁文件校验）
    run: pnpm install --no-frozen-lockfile

  - name: 构建 VitePress 静态文件
    run: pnpm run build

  - name: 创建 .nojekyll 文件（禁用 Jekyll 构建）
    run: touch docs/.vitepress/dist/.nojekyll

  - name: 部署至 gh-pages 分支
    uses: JamesIves/github-pages-deploy-action@v4
    with:
      folder: docs/.vitepress/dist # 构建产物目录
      branch: gh-pages # 部署目标分支
      clean: true # 清理旧文件
      single-commit: true # 单个提交记录
</code></pre><ol start="4"><li>配置 GitHub Pages 部署源 打开 GitHub 仓库 → 点击顶部「Settings」（设置）； 左侧菜单栏选择「Pages」； 「Source」选择「Deploy from a branch」； 「Branch」选择「gh-pages」，目录选择「/ (root)」； 点击「Save」保存，等待部署完成。</li><li>代码提交与触发部署 bash</li></ol><h1 id="_1-添加所有修改的文件" tabindex="-1">1. 添加所有修改的文件 <a class="header-anchor" href="#_1-添加所有修改的文件" aria-label="Permalink to &quot;1. 添加所有修改的文件&quot;">​</a></h1><p>git add .</p><h1 id="_2-提交代码" tabindex="-1">2. 提交代码 <a class="header-anchor" href="#_2-提交代码" aria-label="Permalink to &quot;2. 提交代码&quot;">​</a></h1><p>git commit -m &quot;feat: 配置 VitePress 自动化部署&quot;</p><h1 id="_3-强制推送至-main-分支-覆盖远程不一致内容" tabindex="-1">3. 强制推送至 main 分支（覆盖远程不一致内容） <a class="header-anchor" href="#_3-强制推送至-main-分支-覆盖远程不一致内容" aria-label="Permalink to &quot;3. 强制推送至 main 分支（覆盖远程不一致内容）&quot;">​</a></h1><p>git push -f origin main 6. 访问与故障排查 （1）网站访问地址 格式：https://&lt;你的GitHub用户名&gt;.github.io/&lt;仓库名&gt;/示例：<a href="https://lk1731985.github.io/forDocs-dev/" target="_blank" rel="noreferrer">https://lk1731985.github.io/forDocs-dev/</a> （2）国内访问问题解决 镜像站访问：<a href="https://ghproxy.com/https://lk1731985.github.io/forDocs-dev/%EF%BC%9B" target="_blank" rel="noreferrer">https://ghproxy.com/https://lk1731985.github.io/forDocs-dev/；</a> 配置 Hosts / 使用加速器（如 Watt Toolkit、DevSidecar）后访问原链接。 （3）404 兜底修复 若仍提示 404，在 gh-pages 分支根目录添加 404.html，内容与 index.html 完全一致（适配单页应用路由）。 三、核心要点回顾 Git 基础：提交前必须配置用户名 / 邮箱，推送冲突优先 git pull 合并，特殊场景可强制推送（谨慎）； 部署关键：通过 .nojekyll 禁用 Jekyll、配置正确的 base 路径、部署至 gh-pages 分支； 路由兼容：VitePress 部署至静态托管平台需适配路由规则，必要时添加 404.html 回退； 自动化保障：Action 需匹配包管理器（pnpm/npm）、赋予写入权限，确保构建产物正确推送。</p>`,21)])])}const g=t(n,[["render",o]]);export{c as __pageData,g as default};
