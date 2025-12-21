// src/data.ts
import { Github, Twitter, Linkedin, Mail, ExternalLink, Globe } from "lucide-react";

export const USER_DATA = {
  name: "Your Name",
  title: "Full Stack Developer & Designer",
  bio: "Building digital products that combine clean code with exceptional user experience. Currently focused on freelance projects and open-source.",
  email: "hello@yourname.com",
  socials: [
    { name: "GitHub", href: "https://github.com/yourusername", icon: Github },
    { name: "Twitter", href: "https://twitter.com/yourusername", icon: Twitter },
    { name: "LinkedIn", href: "https://linkedin.com/in/yourusername", icon: Linkedin },
  ],
  projects: [
    {
      title: "Project One",
      description: "A high-performance web app built with Next.js and Tailwind.",
      tags: ["Next.js", "TypeScript", "Prisma"],
      link: "https://project1.com",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000",
    },
    {
      title: "Project Two",
      description: "Mobile-first design for a modern e-commerce platform.",
      tags: ["React Native", "Firebase"],
      link: "https://project2.com",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000",
    },
  ]
};