import { build, defineConfig } from "vitepress";
// import { head } from "./config/head";
import { nav } from "./config/nav";
import { sidebar } from "./config/sidebar";
import path from 'path';

export default defineConfig({
  title: "ForDocs",
  // clientAppEnhanceFiles: ["./config/enhanceApp.ts"],
  description: "VitePress",
  // darkMode: true,
  base: '/forDocs-dev/', 
  cleanUrls: true,
  themeConfig: {
    nav,
    sidebar,
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "搜索文档",
            buttonAriaLabel: "搜索文档",
          },
          modal: {
            noResultsText: "无法找到相关结果",
            resetButtonTitle: "清除查询条件",
            footer: {
              selectText: "选择",
              navigateText: "切换",
            },
          },
        },
      },
    },
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/tsinghua-lau",
      },
    ],
    outlineTitle: "本页目录",
    outline: 'deep',
    logo: "/images/logo.svg",
    // editLink: {
    //   pattern:
    //     "https://github.com/tsinghua-lau/tsinghua-lau.github.io/tree/dev/docs/:path",
    //   text: "在 GitHub 上编辑此页",
    // },
    // lastUpdated: true,
    // editLinks: true,
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },
    footer: {
      message: "Released under the MIT License.",
      copyright: "XXX",
    },
  },
});
