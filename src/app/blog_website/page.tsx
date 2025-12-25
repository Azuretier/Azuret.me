import styles from '@/styles/blog/style.module.css';
import { Github, Youtube, Instagram, MessageSquare, ExternalLink, Mail, MapPin, Sparkles, ArrowRight } from "lucide-react";

const USER_DATA = {
  name: "Your Name",
  handle: "@username",
  bio: "Creative developer making high-energy digital experiences. Focusing on clean code and soft aesthetics inspired by Caramel.",
  location: "Internet / Earth",
  email: "hello@yourname.com",
  socials: [
    { name: "GitHub", href: "https://github.com/yourusername", icon: <Github size={20} /> },
    { name: "YouTube", href: "https://youtube.com/@yourchannel", icon: <Youtube size={20} /> },
    { name: "Instagram", href: "https://instagram.com/yourhandle", icon: <Instagram size={20} /> },
  ],
  projects: [
    {
      title: "Project Caramel Hub",
      date: "Dec 2025",
      description: "A high-performance portfolio with minimalist aesthetics and neo-brutalist shadows.",
      tags: ["Next.js", "CSS Modules"],
      link: "#",
      image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop"
    },
    {
      title: "Neon Interface",
      date: "Nov 2025",
      description: "Exploration of vibrant colors and dark mode glassmorphism.",
      tags: ["React", "Tailwind"],
      link: "#",
      image: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1000&auto=format&fit=crop"
    }
  ]
};

export default function Home() {
  return (
    <div className={styles.mainWrapper}>
      <div className="max-w-6xl mx-auto px-6 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* --- LEFT SIDEBAR --- */}
          <aside className={`lg:col-span-4 space-y-8 ${styles.sidebarSticky}`}>
            <div className={`${styles.caramelCard} p-8`}>
              {/* Animated Avatar Box */}
              <div className="relative w-20 h-20 mb-8">
                <div className={`absolute inset-0 ${styles.avatarDecor}`}></div>
                <div className="relative w-full h-full bg-white border-2 border-black rounded-[1.5rem] flex items-center justify-center text-3xl shadow-inner">
                  🧸
                </div>
              </div>
              
              <h1 className="text-3xl font-black tracking-tighter mb-1">{USER_DATA.name}</h1>
              <p className="text-orange-500 font-black text-sm mb-4 tracking-tight">{USER_DATA.handle}</p>
              <p className="text-zinc-600 leading-relaxed mb-8 font-medium italic">
                "{USER_DATA.bio}"
              </p>

              {/* Interaction Hub */}
              <div className="flex flex-wrap gap-4 mb-8">
                {USER_DATA.socials.map((social) => (
                  <a 
                    key={social.name}
                    href={social.href}
                    className="p-3 border-2 border-black rounded-xl hover:bg-orange-400 hover:text-white transition-all hover:-rotate-6"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>

              {/* Non-Interactable Discord Tag */}
              <div className={styles.discordTag}>
                <MessageSquare size={18} />
                <span className="tracking-widest uppercase text-[10px]">Discord: @yourname</span>
              </div>

              <div className="mt-8 pt-6 border-t-2 border-dashed border-zinc-100 space-y-3">
                <div className="flex items-center gap-3 text-sm font-bold text-zinc-400">
                  <MapPin size={16} /> {USER_DATA.location}
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-orange-400">
                  <Sparkles size={16} /> Available for Work
                </div>
              </div>
            </div>

            <a 
              href={`mailto:${USER_DATA.email}`}
              className={`${styles.caramelCard} flex items-center justify-between w-full p-5 bg-black text-white font-black text-lg hover:bg-orange-500`}
            >
              Contact Me <ArrowRight />
            </a>
          </aside>

          {/* --- RIGHT CONTENT (Projects) --- */}
          <main className="lg:col-span-8 space-y-12">
            <div className="flex items-center gap-4">
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-300">Selected Works</h2>
              <div className="h-[2px] flex-1 bg-zinc-100"></div>
            </div>

            <div className="grid grid-cols-1 gap-10">
              {USER_DATA.projects.map((project) => (
                <div key={project.title} className={styles.caramelCard}>
                  <div className={styles.projectImageWrapper}>
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                  </div>
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-black text-orange-400 px-3 py-1 bg-orange-50 rounded-full">
                        {project.date}
                      </span>
                      <div className="flex gap-2">
                        {project.tags.map(tag => (
                          <span key={tag} className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <h3 className="text-3xl font-black mb-4 flex items-center justify-between">
                      {project.title}
                      <a href={project.link} className="hover:text-orange-500 transition-colors">
                        <ExternalLink size={24} />
                      </a>
                    </h3>
                    <p className="text-zinc-500 leading-relaxed font-medium text-lg">
                      {project.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <footer className="pt-20 pb-10 text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-300">
                Created with Next.js &bull; {new Date().getFullYear()}
              </p>
            </footer>
          </main>
          
        </div>
      </div>
    </div>
  );
}