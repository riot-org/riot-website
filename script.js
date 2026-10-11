/* ============================================================
   Riot 官网交互脚本
   ============================================================ */

/**
 * 下载地址跟着 GitHub 最新正式 Release 走。
 * 发 Riot_0.1.1 时资产会变成 Riot_0.1.1_aarch64.dmg，写死 0.1.0 就会下到旧包。
 * 没拉到接口时退回 /releases/latest 页面，不要链到某个过期文件名。
 */
const RELEASES_PAGE = "https://github.com/riot-org/Riot/releases/latest";
const RELEASES_API = "https://api.github.com/repos/riot-org/Riot/releases/latest";
const RELEASE_CACHE = "riot.latest-release.v3"; // 换键即可作废所有旧格式缓存
const RELEASE_TTL = 10 * 60 * 1000; // 缓存 10 分钟：长开的标签页里也能拿到新版本

const LANG_KEY = "riot.lang";

const DOWNLOADS = {
  mac: {
    url: RELEASES_PAGE,
    labelKey: "os.mac.label",
    metaKey: "os.mac.meta",
    size: 0,
  },
  win: {
    url: RELEASES_PAGE,
    labelKey: "os.win.label",
    metaKey: "os.win.meta",
    size: 0,
  },
};

/** 页面文案。HTML 里的中文是没开 JavaScript 时的兜底，开了就以这里为准。 */
const I18N = {
  zh: {
    "meta.title": "Riot · Codex 的开源替代",
    "meta.description":
      "Riot 是 Codex 的开源替代：Rust 内核，任务在本机执行。带 Cursor 式工作台，以及 Claude Code 式的权限、Skills 和 Hooks。可接 OpenAI / Anthropic 兼容的模型服务。支持 macOS、Windows，也能用 Docker 部署到 Linux 服务器。",
    "meta.og":
      "Codex 的开源替代。Cursor 式工作台，Claude Code 式权限与扩展，模型用自己的 API，任务在本机执行。",
    skip: "跳到主要内容",
    "nav.home": "Riot 首页",
    "nav.primary": "主导航",
    "nav.features": "功能",
    "nav.mobile": "移动端导航",
    "nav.download": "下载 Riot",
    "nav.downloadShort": "下载",
    "menu.open": "打开菜单",
    "menu.close": "关闭菜单",
    "lang.group": "语言",
    "footer.home": "回到 Riot 首页",
    "hero.badge": "Rust 内核 · 本地执行",
    "hero.heading": "Codex 的开源替代",
    "hero.download": "下载 Riot",
    "hero.see": "看看能做什么",
    "hero.meta": "macOS · Windows · Linux 服务器",
    "hero.imgAlt": "Riot 工作空间：项目会话、对话、终端与代码变更面板。",
    "hero.caption": "Riot 工作空间界面",
    "models.aria": "支持的模型服务",
    "models.label": "可接入",
    "features.eyebrow": "01 / 功能",
    "features.title": "不只写代码。",
    "features.sub": "网页、文档、定时任务也能做。",
    "cap.remote.h": "远程连接",
    "cap.remote.alt": "远程连接示意：手机浏览器与桌面 Riot 同步同一个会话和终端",
    "cap.remote.h4": "在手机上接着用桌面上的会话",
    "cap.remote.p":
      "用手机或另一台电脑的浏览器连上正在运行的 Riot，会话、终端和浏览器面板保持同步。任务还在原来那台机器上跑。",
    "cap.multi.h": "多 Agent 协作",
    "cap.multi.alt": "多 Agent 协作示意：主任务把检索、分析与实现分给三个子 Agent",
    "cap.multi.h4": "大任务拆给多个 Agent 分头做",
    "cap.multi.p":
      "检索、分析、实现分给不同的子 Agent 在后台跑，主任务负责协调，结果回到同一个工作空间。",
    "cap.schedule.h": "定时任务",
    "cap.schedule.alt": "定时任务示意：按每日、工作日、每周或延时编排的任务列表",
    "cap.schedule.h4": "让任务按时间表自己跑",
    "cap.schedule.p":
      "可以设成每天、工作日、每周或指定时间，也可以延时触发。错过的运行会自动补上。",
    "cap.docs.h": "文档能力",
    "cap.docs.alt": "文档能力示意：一句需求生成 Word、Excel、PPT 与 PDF",
    "cap.docs.h4": "直接生成 Word、Excel、PPT 和 PDF",
    "cap.docs.p": "新建和修改都行。装上文档运行时后，公式计算、排版渲染和检查也在本机完成。",
    "cap.browser.h": "内置浏览器",
    "cap.browser.alt": "内置浏览器示意：Agent 在页面中导航、填表与点击，步骤同步显示",
    "cap.browser.h4": "Agent 操作网页，你在旁边看着",
    "cap.browser.p":
      "内置 Chromium。导航、点击、填表、截图、执行 JavaScript 都能在对话里调用，每一步都显示在浏览器面板上。",
    "cap.dom.h": "DOM 拾取",
    "cap.dom.alt": "DOM 拾取示意：点选页面按钮，选择器作为上下文进入对话",
    "cap.dom.h4": "点一下元素，告诉 Agent 改哪里",
    "cap.dom.p": "悬停高亮，点击选中，元素的选择器和结构会附进对话。",
    "cap.server.h": "服务器部署",
    "cap.server.alt":
      "服务器部署示意：用 Docker 在 Linux 服务器上运行 riot-server，再用浏览器访问",
    "cap.server.h4": "部署到服务器，24 小时不下线",
    "cap.server.p":
      "电脑合上了，任务照样在跑。把 Riot 部署到 Linux 服务器（Docker 镜像，x86_64 / arm64），配合定时任务按计划自己干活；想看进度或接着聊，用手机或电脑的浏览器随时连上去。",
    "cap.pentest.h": "安全渗透",
    "cap.pentest.alt":
      "安全渗透示意：只对授权范围内的站点测试，结果整理成按严重度排序的报告",
    "cap.pentest.h4": "专门为安全渗透做过优化",
    "cap.pentest.p":
      "内置爬取、Fuzz、密钥泄露扫描等渗透工具，发现按严重度整理成带证据和修复建议的报告。渗透动作只打你授权过的目标，范围外即使开了「全部放行」也会先问你。",
    "security.eyebrow": "02 / 安全",
    "security.line1": "执行什么，",
    "security.line2": "由你批准。",
    "sec.data.h": "数据去向",
    "sec.data.p": "工具在本机运行。用远程模型时，任务需要的上下文会发给你配置的模型服务。",
    "sec.perm.h": "六档权限",
    "sec.perm.p": "从每步都问到无人值守，按任务选。不管哪一档，敏感操作都会先问你。",
    "sec.crash.h": "内核崩了，窗口还在",
    "sec.crash.p": "Agent 内核和界面是两个进程。内核出错时窗口照常可用，不用重开。",
    "sec.fix.h": "失败了接着改",
    "sec.fix.p": "工具执行失败时，报错会回到对话里，Agent 根据报错继续修正。",
    "perm.caption": "权限请求示意",
    "perm.wait": "等待确认",
    "perm.title": "执行这条命令？",
    "perm.body": "Agent 想运行项目测试。",
    "perm.path": "工作目录 · ~/code/my-project",
    "perm.aria": "应用内可选的授权范围",
    "perm.deny": "拒绝",
    "perm.once": "允许一次",
    "perm.session": "本会话允许",
    "download.eyebrow": "03 / 下载",
    "download.title": "装到你的电脑上",
    "download.detect": "选择你的系统。",
    "download.recommend": "为你推荐",
    "dl.mac.desc": "拖进「应用程序」，填上模型 API Key 就能用。",
    "dl.mac.btn": "下载 macOS 版",
    "dl.win.desc": "运行安装程序，填上模型 API Key 就能用。",
    "dl.win.btn": "下载 Windows 版",
    "dl.linux.h": "Linux 服务器",
    "dl.linux.sub": "Docker 镜像 · x86_64 / arm64",
    "dl.copy": "复制",
    "dl.copyAria": "复制命令",
    "dl.copyDone": "已复制",
    "dl.copyFail": "请手动复制",
    "dl.deploy": "部署说明",
    "dl.deployHref":
      "https://github.com/riot-org/Riot/blob/master/README.md#linux-服务器部署",
    "dl.note": "个人与非营利用途免费，商业使用需另行授权。",
    "dl.source": "源码与构建说明",
    "os.mac.label": "下载 macOS 版",
    "os.mac.meta": ".dmg · 仅 Apple Silicon",
    "os.win.label": "下载 Windows 版",
    "os.win.meta": "NSIS 安装包 · x64",
    "os.linux": "Linux 上没有桌面版，可以用下面的 Docker 镜像部署服务器版。",
    "os.mac.note": "macOS 版只支持 Apple Silicon（M1 及之后的芯片），Intel Mac 无法运行。",
    "os.win.note": "Windows 安装包适用于 x64 设备。",
    size: "约 {n} MB",
    "footer.tag": "Codex 的开源替代。",
    "footer.nav": "资源链接",
    "footer.arch": "架构文档",
    "footer.releases": "更新日志",
    "footer.security": "安全设计",
  },
  en: {
    "meta.title": "Riot · An open-source alternative to Codex",
    "meta.description":
      "Riot is an open-source alternative to Codex: a Rust core that runs tasks on your machine. A Cursor-style workspace, with Claude Code-style permissions, Skills, and Hooks. Connect any OpenAI- or Anthropic-compatible model. macOS, Windows, and a Docker image for Linux servers.",
    "meta.og":
      "An open-source alternative to Codex. A Cursor-style workspace, Claude Code-style permissions and extensions. Bring your own model API. Tasks run on your machine.",
    skip: "Skip to content",
    "nav.home": "Riot home",
    "nav.primary": "Primary",
    "nav.features": "Features",
    "nav.mobile": "Mobile",
    "nav.download": "Download",
    "nav.downloadShort": "Download",
    "menu.open": "Open menu",
    "menu.close": "Close menu",
    "lang.group": "Language",
    "footer.home": "Back to Riot home",
    "hero.badge": "Rust core · Runs locally",
    "hero.heading": "An open-source alternative to Codex",
    "hero.download": "Download Riot",
    "hero.see": "See what it does",
    "hero.meta": "macOS · Windows · Linux server",
    "hero.imgAlt":
      "Riot workspace: project sessions, chat, terminal, and the code changes panel.",
    "hero.caption": "Riot workspace",
    "models.aria": "Supported model providers",
    "models.label": "Works with",
    "features.eyebrow": "01 / Features",
    "features.title": "Not only code.",
    "features.sub": "Web pages, documents, and scheduled tasks too.",
    "cap.remote.h": "Remote access",
    "cap.remote.alt":
      "Remote access: a phone browser and desktop Riot share one session and terminal",
    "cap.remote.h4": "Pick up a desktop session on your phone",
    "cap.remote.p":
      "Open a running Riot from a phone or another computer's browser. The session, terminal, and browser panel stay in sync. The task keeps running on the original machine.",
    "cap.multi.h": "Multi-agent",
    "cap.multi.alt":
      "Multi-agent: the main task splits search, analysis, and implementation across three sub-agents",
    "cap.multi.h4": "Split a large task across agents",
    "cap.multi.p":
      "Search, analysis, and implementation run on background sub-agents. The main task coordinates, and the results come back to the same workspace.",
    "cap.schedule.h": "Schedules",
    "cap.schedule.alt":
      "Schedules: a task list set to daily, weekdays, weekly, or delayed",
    "cap.schedule.h4": "Let tasks run on a timetable",
    "cap.schedule.p":
      "Daily, weekdays, weekly, or a set time. You can also delay a run. Missed runs are caught up.",
    "cap.docs.h": "Documents",
    "cap.docs.alt":
      "Documents: one request produces Word, Excel, PowerPoint, and PDF",
    "cap.docs.h4": "Create Word, Excel, PowerPoint, and PDF",
    "cap.docs.p":
      "Create or edit. With the document runtime installed, formulas, layout, and checks happen on your machine.",
    "cap.browser.h": "Built-in browser",
    "cap.browser.alt":
      "Built-in browser: the agent navigates, fills forms, and clicks, with each step shown",
    "cap.browser.h4": "The agent uses the web. You watch.",
    "cap.browser.p":
      "A built-in Chromium. Navigate, click, fill forms, take screenshots, and run JavaScript from the chat. Each step shows in the browser panel.",
    "cap.dom.h": "DOM picker",
    "cap.dom.alt":
      "DOM picker: click a button on the page and its selector goes into the chat",
    "cap.dom.h4": "Click an element to say what to change",
    "cap.dom.p":
      "Hover to highlight, click to select. The selector and structure are attached to the chat.",
    "cap.server.h": "Server deploy",
    "cap.server.alt":
      "Server deploy: run riot-server with Docker on a Linux server, then open it in a browser",
    "cap.server.h4": "Deploy it, and it stays up",
    "cap.server.p":
      "Close the laptop and the task keeps running. Deploy Riot on a Linux server (Docker image, x86_64 / arm64) and pair it with schedules. Check progress or keep talking from a phone or computer browser.",
    "cap.pentest.h": "Security testing",
    "cap.pentest.alt":
      "Security testing: only authorized sites are tested, and findings are a report sorted by severity",
    "cap.pentest.h4": "Built for security testing",
    "cap.pentest.p":
      "Built-in crawl, fuzz, and secret-leak scans. Findings become a report sorted by severity, with evidence and fixes. Tests only hit targets you authorized. Outside that scope, Riot still asks even if you turned on allow-all.",
    "security.eyebrow": "02 / Security",
    "security.line1": "What runs",
    "security.line2": "is up to you.",
    "sec.data.h": "Where data goes",
    "sec.data.p":
      "Tools run on your machine. With a remote model, the context a task needs is sent to the model service you configured.",
    "sec.perm.h": "Six permission levels",
    "sec.perm.p":
      "From ask-every-step to unattended, pick a level per task. Sensitive actions still ask you, at every level.",
    "sec.crash.h": "If the kernel crashes, the window stays",
    "sec.crash.p":
      "The agent kernel and the window are two processes. If the kernel fails, the window stays usable.",
    "sec.fix.h": "Failures come back into the chat",
    "sec.fix.p":
      "When a tool fails, the error comes back into the chat and the agent keeps going from it.",
    "perm.caption": "Permission prompt",
    "perm.wait": "Waiting",
    "perm.title": "Run this command?",
    "perm.body": "The agent wants to run the project tests.",
    "perm.path": "Working directory · ~/code/my-project",
    "perm.aria": "Choices in the app",
    "perm.deny": "Deny",
    "perm.once": "Allow once",
    "perm.session": "Allow for this session",
    "download.eyebrow": "03 / Download",
    "download.title": "Install on your computer",
    "download.detect": "Choose your system.",
    "download.recommend": "Recommended",
    "dl.mac.desc": "Drag it into Applications, then add a model API key in Settings.",
    "dl.mac.btn": "Download for macOS",
    "dl.win.desc": "Run the installer, then add a model API key in Settings.",
    "dl.win.btn": "Download for Windows",
    "dl.linux.h": "Linux server",
    "dl.linux.sub": "Docker image · x86_64 / arm64",
    "dl.copy": "Copy",
    "dl.copyAria": "Copy command",
    "dl.copyDone": "Copied",
    "dl.copyFail": "Copy it manually",
    "dl.deploy": "Deploy guide",
    "dl.deployHref":
      "https://github.com/riot-org/Riot/blob/master/README.en.md#linux-server",
    "dl.note":
      "Free for personal and noncommercial use. Commercial use needs a separate license.",
    "dl.source": "Source and build notes",
    "os.mac.label": "Download for macOS",
    "os.mac.meta": ".dmg · Apple Silicon only",
    "os.win.label": "Download for Windows",
    "os.win.meta": "NSIS installer · x64",
    "os.linux":
      "There is no desktop build for Linux. Deploy the server image with Docker below.",
    "os.mac.note":
      "The macOS build only supports Apple Silicon (M1 and later). It does not run on Intel Macs.",
    "os.win.note": "The Windows installer is for x64 machines.",
    size: "about {n} MB",
    "footer.tag": "An open-source alternative to Codex.",
    "footer.nav": "Resources",
    "footer.arch": "Architecture",
    "footer.releases": "Releases",
    "footer.security": "Security",
  },
};

function currentLang() {
  return document.documentElement.dataset.lang === "en" ? "en" : "zh";
}

function t(key) {
  const pack = I18N[currentLang()] || I18N.zh;
  return pack[key] ?? I18N.zh[key] ?? key;
}

function applyI18n() {
  const lang = currentLang();
  document.documentElement.lang = lang === "en" ? "en" : "zh-CN";
  document.title = t("meta.title");
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute("content", t("meta.description"));
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute("content", t("meta.title"));
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute("content", t("meta.og"));
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
    el.alt = t(el.dataset.i18nAlt);
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    el.setAttribute("aria-label", t(el.dataset.i18nAria));
  });
  document.querySelectorAll("[data-i18n-href]").forEach((el) => {
    el.href = t(el.dataset.i18nHref);
  });
  document.querySelectorAll("[data-set-lang]").forEach((btn) => {
    const on = btn.dataset.setLang === lang;
    btn.setAttribute("aria-pressed", String(on));
    btn.classList.toggle("is-current", on);
  });
}

function setLang(lang) {
  if (lang !== "en" && lang !== "zh") return;
  document.documentElement.dataset.lang = lang;
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {
    /* 隐私模式 */
  }
  const url = new URL(location.href);
  url.searchParams.set("lang", lang);
  history.replaceState(null, "", url);
  const menu = document.getElementById("mobile-menu");
  const burger = document.getElementById("nav-burger");
  if (menu && burger && !menu.hidden) {
    menu.hidden = true;
    burger.setAttribute("aria-expanded", "false");
  }
  applyI18n();
  applyOS();
  initDownloadMeta();
}

function initI18n() {
  document.querySelectorAll("[data-set-lang]").forEach((btn) => {
    btn.addEventListener("click", () => setLang(btn.dataset.setLang));
  });
  applyI18n();
}

/** 全站统一版本号，注入 HTML 里所有 .js-version 占位。拉到最新 Release 后再改。 */
let VERSION = "";

function versionLabel(tag) {
  const v = String(tag || "")
    .replace(/^Riot_/i, "")
    .replace(/^v/i, "");
  return v ? `v${v}` : "";
}

function pickAsset(assets, suffix) {
  return (assets || []).find(
    (a) => typeof a.name === "string" && a.name.endsWith(suffix),
  );
}

function assetInfo(assets, suffix) {
  const a = pickAsset(assets, suffix);
  if (!a) return { url: "", size: 0 };
  return { url: a.browser_download_url, size: Number(a.size) || 0 };
}

function formatSize(bytes) {
  if (!bytes) return "";
  return t("size").replace("{n}", String(Math.round(bytes / (1024 * 1024))));
}

async function loadLatestRelease() {
  try {
    const cached = sessionStorage.getItem(RELEASE_CACHE);
    if (cached) {
      const { t, data } = JSON.parse(cached);
      // 只信任 TTL 内的缓存；过期就重新请求，保证发新版后很快能看到
      if (data && Date.now() - t < RELEASE_TTL) return data;
    }
  } catch {
    /* 隐私模式 / 禁用存储 / 旧格式 */
  }
  const res = await fetch(RELEASES_API, {
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!res.ok) throw new Error(`releases/latest ${res.status}`);
  const data = await res.json();
  const slim = {
    tag: data.tag_name,
    mac: assetInfo(data.assets, "_aarch64.dmg"),
    win: assetInfo(data.assets, "_x64-setup.exe"),
  };
  try {
    sessionStorage.setItem(
      RELEASE_CACHE,
      JSON.stringify({ t: Date.now(), data: slim }),
    );
  } catch {
    /* ignore */
  }
  return slim;
}

async function initDownloads() {
  try {
    const latest = await loadLatestRelease();
    if (latest.mac?.url) {
      DOWNLOADS.mac.url = latest.mac.url;
      DOWNLOADS.mac.size = latest.mac.size;
    }
    if (latest.win?.url) {
      DOWNLOADS.win.url = latest.win.url;
      DOWNLOADS.win.size = latest.win.size;
    }
    VERSION = versionLabel(latest.tag);
  } catch {
    /* 没网就停在 Release 页 */
  }
  applyOS();
  initVersion();
  initDownloadMeta();
}

const OS_ICONS = {
  mac: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>',
  win: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 5.5 10.5 4.4v7.1H3V5.5ZM3 12.5h7.5v7.1L3 18.5v-6ZM11.5 4.25 21 3v8.5h-9.5V4.25ZM21 12.5V21l-9.5-1.35V12.5H21Z"/></svg>',
};

/** Touch devices should see desktop download options, not a macOS installer. */
function detectOS() {
  const platform =
    navigator.userAgentData?.platform || navigator.platform || "";
  const ua = navigator.userAgent || "";
  if (
    /Android|iPhone|iPad|iPod/i.test(ua) ||
    (/Mac/i.test(platform) && navigator.maxTouchPoints > 1)
  )
    return null;
  if (/mac/i.test(platform) || /Mac OS X|Macintosh/i.test(ua)) return "mac";
  if (/win/i.test(platform) || /Windows/i.test(ua)) return "win";
  return null;
}

function applyOS() {
  document.querySelectorAll(".js-dl-mac").forEach((link) => {
    link.href = DOWNLOADS.mac.url;
  });
  document.querySelectorAll(".js-dl-win").forEach((link) => {
    link.href = DOWNLOADS.win.url;
  });
  const os = detectOS();
  if (!os) {
    if (/Linux/i.test(navigator.userAgent) && !/Android/i.test(navigator.userAgent)) {
      document.getElementById("download-detect").textContent = t("os.linux");
    }
    return;
  }
  const download = DOWNLOADS[os];
  document.querySelectorAll(".js-primary-download").forEach((link) => {
    link.href = download.url;
  });
  document.getElementById("hero-download-label").textContent = t(download.labelKey);
  document.getElementById("hero-os-icon").innerHTML = OS_ICONS[os];
  document.getElementById("hero-download-meta").textContent = t(download.metaKey);
  document.getElementById("download-detect").textContent =
    os === "mac" ? t("os.mac.note") : t("os.win.note");
  const card = document.getElementById(
    os === "mac" ? "dl-card-mac" : "dl-card-win",
  );
  card.classList.add("recommended");
  card.querySelector(".dl-recommend").hidden = false;
}

function initNav() {
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 32);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

function initMobileMenu() {
  const burger = document.getElementById("nav-burger");
  const menu = document.getElementById("mobile-menu");
  const desktop = window.matchMedia("(min-width: 701px)");
  const setOpen = (open) => {
    menu.hidden = !open;
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? t("menu.close") : t("menu.open"));
  };
  burger.addEventListener("click", () => setOpen(menu.hidden));
  menu.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      setOpen(false);
      if (link.hash) {
        const target = document.getElementById(link.hash.slice(1));
        if (target) {
          target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
        }
      } else {
        burger.focus();
      }
    }),
  );
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !menu.hidden) {
      setOpen(false);
      burger.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (
      !menu.hidden &&
      !menu.contains(event.target) &&
      !burger.contains(event.target)
    )
      setOpen(false);
  });
  document.addEventListener("focusin", (event) => {
    if (
      !menu.hidden &&
      !menu.contains(event.target) &&
      !burger.contains(event.target)
    )
      setOpen(false);
  });
  desktop.addEventListener("change", () => {
    if (desktop.matches) setOpen(false);
  });
}

/** 页脚年份 */
function initYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = String(new Date().getFullYear());
}

/** 统一注入版本号。没拉到 Release 时占位藏着，避免文案里写死某一个版本。 */
function initVersion() {
  document.querySelectorAll(".js-version").forEach((el) => {
    el.textContent = VERSION;
  });
  document.querySelectorAll(".js-ver").forEach((el) => {
    el.hidden = !VERSION;
  });
}

/** 下载卡片底下的「v0.1.1 · 约 158 MB」跟资产走，包变大了不用改文案。 */
function initDownloadMeta() {
  document.querySelectorAll(".dl-meta[data-os]").forEach((el) => {
    const os = el.getAttribute("data-os");
    const parts = [];
    if (VERSION) parts.push(VERSION);
    if (DOWNLOADS[os]?.size) parts.push(formatSize(DOWNLOADS[os].size));
    el.textContent = parts.join(" · ");
  });
}

/** 区块滚到视口时淡入。同一组卡片错开一点出场；减少动态效果时直接显示。 */
function initReveal() {
  const groups = [
    ".product-preview",
    ".section-heading",
    ".capability-gallery > .capability",
    ".principles > article",
    ".permission-example",
    ".download-heading",
    ".dl-grid > .dl-card",
    ".dl-server",
  ];
  const items = [];
  groups.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add("reveal");
      el.style.setProperty("--reveal-delay", `${(i % 3) * 0.08}s`);
      items.push(el);
    });
  });
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px" },
  );
  items.forEach((el) => io.observe(el));
}

/** 复制按钮：data-copy 指向要复制文本的元素 id。 */
function initCopy() {
  document.querySelectorAll(".copy-btn[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const source = document.getElementById(btn.dataset.copy);
      if (!source) return;
      try {
        await navigator.clipboard.writeText(source.textContent.trim());
        btn.textContent = t("dl.copyDone");
      } catch {
        btn.textContent = t("dl.copyFail");
      }
      setTimeout(() => {
        btn.textContent = t("dl.copy");
      }, 1600);
    });
  });
}

initI18n();
applyOS();
initDownloads();
initNav();
initMobileMenu();
initYear();
initReveal();
initCopy();
