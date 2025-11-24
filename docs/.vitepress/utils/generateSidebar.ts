import { DefaultTheme } from "vitepress/dist/node";
import fs from "fs";
import path from "path";

/**
 * 侧边栏生成配置选项
 */
interface SidebarOptions {
  scanDir: string;          // 要扫描的目录
  baseUrl: string;          // URL前缀
  collapsed?: boolean;      // 是否折叠，默认false
  ignore?: string[];        // 忽略的文件/目录
  dirOrder?: string[];      // 目录排序顺序
  titleFormatter?: (name: string) => string; // 标题格式化函数
}

/**
 * 极简侧边栏生成器
 * @param options 配置选项
 * @returns 侧边栏配置
 */
export function generateSidebar(options: SidebarOptions) {
  const {
    scanDir,
    baseUrl,
    collapsed = false,
    ignore = ['.vue', '.DS_Store'],
    dirOrder = [],
    titleFormatter = (name) => name
  } = options;

  // 排序函数
  const sortByOrder = (order: string[]) => (a: string, b: string) => {
    const aIndex = order.indexOf(a);
    const bIndex = order.indexOf(b);
    return (aIndex === -1 ? Infinity : aIndex) - (bIndex === -1 ? Infinity : bIndex) || a.localeCompare(b);
  };

  const fullPath = path.join(process.cwd(), 'docs', scanDir);
  const sidebarItems: DefaultTheme.SidebarItem[] = [];

  // 读取并排序子目录
  fs.readdirSync(fullPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && !ignore.includes(dirent.name))
    .sort((a, b) => sortByOrder(dirOrder)(a.name, b.name))
    .forEach(dirent => {
      const dirPath = path.join(fullPath, dirent.name);
      const files: DefaultTheme.SidebarItem[] = [];

      // 读取目录下的md文件并排序
      fs.readdirSync(dirPath)
        .filter(file => file.endsWith('.md') && !ignore.some(item => file.includes(item)))
        .map(file => file.replace(/\.md$/, ''))
        .sort((a, b) => a === 'index' ? -1 : b === 'index' ? 1 : a.localeCompare(b))
        .forEach(fileName => {
          const link = fileName === 'index' ? `${baseUrl}/${dirent.name}/` : `${baseUrl}/${dirent.name}/${fileName}`;
          const title = titleFormatter(fileName); 
          
          files.push({ text: title, link });
        });

      sidebarItems.push({
        text: titleFormatter(dirent.name),
        collapsed,
        items: files
      });
    });

  return { [baseUrl]: sidebarItems };
}