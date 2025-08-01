import { ArrowRight, ExternalLink, GithubIcon } from "lucide-react";

const projects = [
  {
    id: 1,
    title: "Clanflare Landing Page",
    description:
      "A modern and responsive landing page built with cutting-edge web technologies, featuring smooth animations, optimized performance, and seamless user experience across all devices.",
    image: "/projects/Clanflare.png",
    tags: ["React", "TypeScript", "SSG", "SEO", "TailwindCSS", "Shadcn"],
    demoUrl: "https://clanflare.dev/",
    githubUrl: null,
  },
  {
    id: 2,
    title: "BareThreads",
    description:
      "A complete full-stack e-commerce platform with user authentication, product management, and secure checkout, built using React, Node.js, and Tailwind CSS.",

    image: "/projects/BareThreads.png",
    tags: [
      "React",
      "TailwindCSS",
      "Redux Toolkit",
      "JWT Auth",
      "MongoDB",
      "Express",
      "Axios",
      "Payment Gateway",
      "Cloudinary",
    ],
    demoUrl: "https://bare-threads-kfs1.vercel.app/",
    githubUrl: "https://github.com/ayushanand89/BareThreads",
  },
  {
    id: 3,
    title: "TalkSphere",
    description:
      "A real-time chat and video calling application with seamless messaging, group chats, and secure peer-to-peer video communication.",

    image: "/projects/TalkSphere.png",
    tags: [
      "React",
      "TailwindCSS",
      "TanStack Query",
      "Zustand",
      "JWT Auth",
      "MongoDB",
      "Express",
      "Socket.IO",
      "WebRTC",
      "DaisyUI",
    ],
    demoUrl: "https://talksphere-lck2.onrender.com/",
    githubUrl: "https://github.com/ayushanand89/TalkSphere",
  },
];

export const ProjectsSection = () => {
  return (
    <section id="projects" className="py-24 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          {" "}
          <span className="text-primary"> Some </span>Featured{" "}
          <span className="text-primary"> Projects </span>
        </h2>

        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Here are some of my recent projects. Each project was carefully
          crafted with attention to detail, performance, and user experience.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {projects.map((project, key) => (
            <div
              key={key}
              className={`group bg-card rounded-lg overflow-hidden shadow-xs card-hover ${
                projects.length % 2 !== 0 && key === projects.length - 1
                  ? "md:col-span-2 md:max-w-md md:mx-auto"
                  : ""
              }`}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span className="px-2 py-1 text-xs font-medium border rounded-full bg-secondary text-secondary-foreground">
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="text-3xl font-bold mb-2"> {project.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {project.description}
                </p>
                <div className="flex justify-between items-center">
                  {/* Left Link */}
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    className="flex items-center space-x-2 text-foreground/80 hover:text-primary transition-colors duration-300"
                  >
                    <ExternalLink size={20} />
                    <span>Live Here</span>
                  </a>

                  {/* Right Link */}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      className="flex items-center space-x-2 text-foreground/80 hover:text-primary transition-colors duration-300"
                    >
                      <GithubIcon size={20} />
                      <span>GitHub Repo</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            className="cosmic-button w-fit flex items-center mx-auto gap-2"
            target="_blank"
            href="https://github.com/ayushanand89"
          >
            Check My Github <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
};
