import { DefaultTheme } from "vitepress/dist/node";

export const nav: DefaultTheme.NavItem[] = [
  {
    text: "学习领域",
    items: [
      { text: "🧸 HTML", link: "/studyCn/HTML/" },
      { text: "🎯 CSS", link: "/studyCn/CSS/" },
      { text: "🎃 JavasSript", link: "/studyCn/Javascript/" },
      { text: "🐰 TypeScript", link: "/studyCn/TypeScript/" },
      { text: "🔨 Vue2", link: "/studyCn/Vue2/" },
      { text: "⚒️ Vue3", link: "/studyCn/Vue3/" },
      { text: "🪐 Network", link: "/studyCn/Network/" },
    ],
  },
  {
    text: "VitePress",
    link: "/vitepressCn/",
  },
];
