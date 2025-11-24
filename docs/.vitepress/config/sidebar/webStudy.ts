
import { generateSidebar } from "../../utils/generateSidebar";

export const webStudy = generateSidebar({
  scanDir: "studyCn",
  baseUrl: "/studyCn",
  dirOrder: ['HTML', 'CSS', 'Javascript', 'TypeScript', 'Vue2', 'Vue3', 'Network', 'form']
});

// console.log(JSON.stringify(webStudy,null,2))
