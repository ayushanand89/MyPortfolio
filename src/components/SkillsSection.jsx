import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  FaHtml5,
  FaJs,
  FaReact,
  FaNodeJs,
  FaGitAlt,
  FaFigma,
  FaGithub,
} from "react-icons/fa";
import {
  SiTailwindcss,
  SiExpress,
  SiMongodb,
  SiPostgresql,
} from "react-icons/si";

const skills = [
  // Frontend
  { name: "HTML/CSS", icon: <FaHtml5 />, category: "frontend" },
  { name: "JavaScript", icon: <FaJs />, category: "frontend" },
  { name: "React", icon: <FaReact />, category: "frontend" },
  { name: "Tailwind CSS", icon: <SiTailwindcss />, category: "frontend" },

  // Backend
  { name: "Node.js", icon: <FaNodeJs />, category: "backend" },
  { name: "Express", icon: <SiExpress />, category: "backend" },
  { name: "MongoDB", icon: <SiMongodb />, category: "backend" },
  { name: "PostgreSQL", icon: <SiPostgresql />, category: "backend" },

  // Tools
  { name: "Git", icon: <FaGitAlt />, category: "tools" },
  { name: "GitHub", icon: <FaGithub />, category: "tools" },
  { name: "Figma", icon: <FaFigma />, category: "tools" },
];

const categories = ["all", "frontend", "backend", "tools"];

export const SkillsSection = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredSkills = skills.filter(
    (skill) => activeCategory === "all" || skill.category === activeCategory
  );

  return (
    <section id="skills" className="py-24 px-4 relative bg-secondary/30">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          My <span className="text-primary">Skills</span>
        </h2>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category, key) => (
            <button
              key={key}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "px-5 py-2 rounded-full transition-colors duration-300 capitalize",
                activeCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/70 text-foreground hover:bg-secondary"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Skills Pill Layout */}
        <div className="flex flex-wrap justify-center gap-4">
          {filteredSkills.map((skill, key) => (
            <div
              key={key}
              className="flex items-center gap-2 px-4 py-2 bg-card rounded-full shadow-sm hover:shadow-md transition text-sm"
            >
              <div className="p-2 rounded-full bg-primary/10 text-primary text-lg">
                {skill.icon}
              </div>
              <span className="text-foreground font-medium">{skill.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
