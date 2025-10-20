import html from "../assets/icons/HTML5.svg";
import css from "../assets/icons/CSS3.svg";
import javascript from "../assets/icons/Javascript.svg";
import react from "../assets/icons/React.svg";
import nodejs from "../assets/icons/Nodejs.svg";
import python from "../assets/icons/Python.svg";
import typescript from "../assets/icons/Typescript.svg";
export const technologies = [
  {
    id: "html",
    name: "HTML",
    icon: html,
  },
  { id: "css", name: "CSS", icon: css },
  { id: "javascript", name: "JavaScript", icon: javascript },
  { id: "react", name: "React", icon: react },
  { id: "nodejs", name: "Node.js", icon: nodejs },
  { id: "python", name: "Python", icon: python },
  { id: "typescript", name: "TypeScript", icon: typescript },
] as const;

export const topics = {
  html: [
    { id: "basics", name: "HTML Basics" },
    { id: "elements", name: "HTML Elements" },
    { id: "forms", name: "Forms & Input" },
    { id: "semantic", name: "Semantic HTML" },
  ],
  css: [
    { id: "selectors", name: "CSS Selectors" },
    { id: "flexbox", name: "Flexbox" },
    { id: "grid", name: "CSS Grid" },
    { id: "animations", name: "Animations" },
  ],
  javascript: [
    { id: "variables", name: "Variables" },
    { id: "functions", name: "Functions" },
    { id: "arrays", name: "Arrays" },
    { id: "loops", name: "Loops" },
    { id: "promises", name: "Promises & Async" },
  ],
  react: [
    { id: "components", name: "Components" },
    { id: "hooks", name: "Hooks" },
    { id: "state", name: "State Management" },
    { id: "props", name: "Props" },
  ],
  nodejs: [
    { id: "modules", name: "Modules" },
    { id: "npm", name: "NPM" },
    { id: "express", name: "Express.js" },
    { id: "async", name: "Async Operations" },
  ],
  python: [
    { id: "basics", name: "Python Basics" },
    { id: "functions", name: "Functions" },
    { id: "classes", name: "Classes & OOP" },
    { id: "lists", name: "Lists & Dictionaries" },
  ],
  typescript: [
    { id: "types", name: "Type System" },
    { id: "interfaces", name: "Interfaces" },
    { id: "generics", name: "Generics" },
    { id: "decorators", name: "Decorators" },
  ],
} as const;

export type TechnologyId = (typeof technologies)[number]["id"];
export type TopicId = string;
