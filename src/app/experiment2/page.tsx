"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Cake, GraduationCap, Send, Folder, Share2, ChevronRight, Star, Github, Youtube, Instagram, MessageCircle, Sun, Moon, MapPin, Mail, Globe, Sparkles, TrendingUp, Clock, ExternalLink, User, BarChart3, Terminal, Settings, X, Minimize2, Maximize2, FolderOpen, Image as ImageIcon, Music, Film } from "lucide-react"

// --- MOCK DATA ---
const PROFILE_INFO = {
  images: ["/api/placeholder/128/128"],
  name: "Your Name",
  pronouns: "they/them",
  birthday: "January 1st",
  role: "Developer & Designer",
  location: "Tokyo, Japan",
  email: "hello@example.com",
  website: "yoursite.com",
  bio_texts: ["Building cool stuff", "Learning new things", "Creating experiences"]
};

const SNS_LINKS = [
  { id: 1, icon: Youtube, label: "YouTube", username: "@yourchannel", href: "https://youtube.com", isStatic: false, followers: "10.5K" },
  { id: 2, icon: Github, label: "GitHub", username: "@yourusername", href: "https://github.com", isStatic: false, followers: "2.3K" },
  { id: 3, icon: Instagram, label: "Instagram", username: "@yourhandle", href: "https://instagram.com", isStatic: false, followers: "5.8K" },
  { id: 4, icon: MessageCircle, label: "Discord", username: "username#0000", href: "#", isStatic: true, followers: "Online" },
];

const PROJECTS = [
  { id: 1, title: "Portfolio Website", status: "Completed", tech: "Next.js, TailwindCSS", description: "Modern portfolio with smooth animations", progress: 100, lastUpdate: "2 days ago" },
  { id: 2, title: "Task Manager App", status: "In Progress", tech: "React, TypeScript", description: "Productivity app with kanban boards", progress: 65, lastUpdate: "5 hours ago" },
  { id: 3, title: "Music Player", status: "Planning", tech: "React, Web Audio API", description: "Beautiful audio player interface", progress: 15, lastUpdate: "1 week ago" },
  { id: 4, title: "Chat Application", status: "Completed", tech: "WebSocket, Node.js", description: "Real-time messaging platform", progress: 100, lastUpdate: "1 month ago" },
];

const VISITOR_DATA = {
  totalVisits: 12847,
  todayVisits: 234,
  uniqueVisitors: 8392,
  avgSessionTime: "3m 42s",
  topCountries: ["Japan 🇯🇵", "USA 🇺🇸", "UK 🇬🇧"],
  lastVisit: "2 minutes ago"
};

const Main = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [time, setTime] = useState(new Date());
  const [openWindows, setOpenWindows] = useState<string[]>([]);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [selectedSns, setSelectedSns] = useState(0);
  const [selectedProject, setSelectedProject] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Pixel art loading
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const openWindow = (windowId: string) => {
    if (!openWindows.includes(windowId)) {
      setOpenWindows([...openWindows, windowId]);
    }
    setActiveWindow(windowId);
  };

  const closeWindow = (windowId: string) => {
    setOpenWindows(openWindows.filter(w => w !== windowId));
    if (activeWindow === windowId) {
      setActiveWindow(openWindows[openWindows.length - 2] || null);
    }
  };

  const desktopIcons = [
    { id: 'profile', icon: User, label: 'Profile', color: 'bg-blue-500' },
    { id: 'social', icon: Share2, label: 'Social', color: 'bg-purple-500' },
    { id: 'projects', icon: FolderOpen, label: 'Projects', color: 'bg-green-500' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', color: 'bg-orange-500' },
    { id: 'terminal', icon: Terminal, label: 'Terminal', color: 'bg-gray-700' },
    { id: 'settings', icon: Settings, label: 'Settings', color: 'bg-red-500' },
  ];

  return (
    <>
      {/* Pixel Art Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0f0f23]"
            style={{ imageRendering: 'pixelated' }}
          >
            {/* Minecraft-style logo */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mb-12"
            >
              <div className="text-6xl font-black text-white tracking-wider mb-2" style={{ 
                textShadow: '4px 4px 0px #333, 8px 8px 0px #000',
                fontFamily: 'monospace'
              }}>
                PORTFOLIO
              </div>
              <div className="text-xl text-gray-400 text-center font-mono">Initializing...</div>
            </motion.div>

            {/* Pixel art loading bar */}
            <div className="w-96 space-y-4">
              <div className="h-8 bg-[#1a1a2e] border-4 border-[#333] relative overflow-hidden" style={{ imageRendering: 'pixelated' }}>
                <motion.div
                  className="h-full bg-gradient-to-r from-green-500 to-lime-400 relative"
                  style={{ width: `${loadingProgress}%` }}
                >
                  {/* Pixel pattern overlay */}
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
                  }}></div>
                </motion.div>
              </div>
              <div className="text-center text-white font-mono text-2xl" style={{ textShadow: '2px 2px 0px #000' }}>
                {loadingProgress}%
              </div>
            </div>

            {/* Pixel decorations */}
            <div className="mt-12 flex gap-4">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-4 h-4 bg-white"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  style={{ imageRendering: 'pixelated' }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Linux Desktop */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }}
      >
        {/* Desktop Icons */}
        <div className="absolute top-6 left-6 grid grid-cols-1 gap-6">
          {desktopIcons.map((icon) => (
            <motion.button
              key={icon.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openWindow(icon.id)}
              className="flex flex-col items-center gap-2 group"
            >
              <div className={`${icon.color} p-4 rounded-lg shadow-lg border-2 border-white/20 group-hover:border-white/40 transition-all`}>
                <icon.icon className="text-white" size={32} />
              </div>
              <span className="text-white text-sm font-bold bg-black/50 px-3 py-1 rounded backdrop-blur-sm">
                {icon.label}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Windows */}
        <AnimatePresence>
          {openWindows.includes('profile') && (
            <WindowFrame
              title="Profile"
              id="profile"
              onClose={() => closeWindow('profile')}
              isActive={activeWindow === 'profile'}
              onFocus={() => setActiveWindow('profile')}
            >
              <ProfileWindow />
            </WindowFrame>
          )}

          {openWindows.includes('social') && (
            <WindowFrame
              title="Social Networks"
              id="social"
              onClose={() => closeWindow('social')}
              isActive={activeWindow === 'social'}
              onFocus={() => setActiveWindow('social')}
            >
              <SocialWindow selectedSns={selectedSns} setSelectedSns={setSelectedSns} />
            </WindowFrame>
          )}

          {openWindows.includes('projects') && (
            <WindowFrame
              title="Projects"
              id="projects"
              onClose={() => closeWindow('projects')}
              isActive={activeWindow === 'projects'}
              onFocus={() => setActiveWindow('projects')}
            >
              <ProjectsWindow selectedProject={selectedProject} setSelectedProject={setSelectedProject} />
            </WindowFrame>
          )}

          {openWindows.includes('analytics') && (
            <WindowFrame
              title="Site Analytics"
              id="analytics"
              onClose={() => closeWindow('analytics')}
              isActive={activeWindow === 'analytics'}
              onFocus={() => setActiveWindow('analytics')}
            >
              <AnalyticsWindow />
            </WindowFrame>
          )}

          {openWindows.includes('terminal') && (
            <WindowFrame
              title="Terminal"
              id="terminal"
              onClose={() => closeWindow('terminal')}
              isActive={activeWindow === 'terminal'}
              onFocus={() => setActiveWindow('terminal')}
            >
              <TerminalWindow />
            </WindowFrame>
          )}
        </AnimatePresence>

        {/* Taskbar */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-slate-900/95 backdrop-blur-md border-t border-white/10 flex items-center px-4 gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 bg-blue-600 rounded-lg shadow-lg"
          >
            <Sparkles className="text-white" size={24} />
          </motion.button>

          <div className="flex-1 flex gap-2">
            {openWindows.map((windowId) => {
              const icon = desktopIcons.find(i => i.id === windowId);
              return (
                <button
                  key={windowId}
                  onClick={() => setActiveWindow(windowId)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    activeWindow === windowId
                      ? 'bg-white/20 border-2 border-white/30'
                      : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                  }`}
                >
                  {icon && <icon.icon className="text-white" size={18} />}
                  <span className="text-white text-sm font-medium">{icon?.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <div className="text-white text-sm font-mono">
              {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-white/60 text-xs">
              {time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
          </div>
        </div>
      </motion.main>
    </>
  );
};

// Window Frame Component
const WindowFrame = ({ title, id, onClose, isActive, onFocus, children }: any) => {
  const [position, setPosition] = useState({ x: 100 + Math.random() * 200, y: 50 + Math.random() * 100 });
  const [isDragging, setIsDragging] = useState(false);

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      drag
      dragMomentum={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      onMouseDown={onFocus}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        zIndex: isActive ? 50 : 40,
      }}
      className={`bg-slate-800 rounded-lg shadow-2xl border-2 ${isActive ? 'border-blue-500' : 'border-white/10'} overflow-hidden`}
    >
      {/* Title Bar */}
      <div className="bg-slate-900 px-4 py-3 flex items-center justify-between cursor-move border-b border-white/10">
        <span className="text-white font-medium text-sm">{title}</span>
        <div className="flex gap-2">
          <button className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors"></button>
          <button className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors"></button>
          <button
            onClick={onClose}
            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
          ></button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 min-w-[500px] max-w-[700px] max-h-[600px] overflow-auto">
        {children}
      </div>
    </motion.div>
  );
};

// Profile Window
const ProfileWindow = () => (
  <div className="space-y-6">
    <div className="flex items-start gap-6">
      <div className="relative">
        <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-blue-500/50 shadow-xl">
          <img src={PROFILE_INFO.images[0]} alt="Profile" className="w-full h-full object-cover" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-slate-800"></div>
      </div>
      <div className="flex-1 space-y-3">
        <h2 className="text-3xl font-black text-white">{PROFILE_INFO.name}</h2>
        <p className="text-purple-400 font-bold uppercase text-sm tracking-wider">{PROFILE_INFO.pronouns}</p>
        <p className="text-gray-400">{PROFILE_INFO.role}</p>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <InfoCard icon={Cake} label="Birthday" value={PROFILE_INFO.birthday} color="text-pink-400" />
      <InfoCard icon={MapPin} label="Location" value={PROFILE_INFO.location} color="text-green-400" />
      <InfoCard icon={Mail} label="Email" value={PROFILE_INFO.email} color="text-blue-400" />
      <InfoCard icon={Globe} label="Website" value={PROFILE_INFO.website} color="text-purple-400" />
    </div>
  </div>
);

const InfoCard = ({ icon: Icon, label, value, color }: any) => (
  <div className="bg-slate-900/50 p-4 rounded-lg border border-white/10">
    <div className="flex items-center gap-2 mb-2">
      <Icon className={color} size={16} />
      <span className="text-gray-400 text-xs font-bold uppercase">{label}</span>
    </div>
    <p className="text-white font-medium text-sm">{value}</p>
  </div>
);

// Social Window
const SocialWindow = ({ selectedSns, setSelectedSns }: any) => (
  <div className="space-y-4">
    {SNS_LINKS.map((sns, index) => (
      <motion.div
        key={sns.id}
        whileHover={{ scale: 1.02 }}
        onClick={() => setSelectedSns(index)}
        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
          selectedSns === index
            ? 'bg-gradient-to-r from-purple-600 to-blue-600 border-white'
            : 'bg-slate-900/50 border-white/10 hover:border-white/30'
        }`}
      >
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-lg ${selectedSns === index ? 'bg-white/20' : 'bg-white/10'}`}>
            <sns.icon className="text-white" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-lg">{sns.label}</h3>
            <p className="text-white/70 text-sm">{sns.username}</p>
          </div>
          <div className="text-right">
            <p className="text-white/60 text-xs">Followers</p>
            <p className="text-white font-bold">{sns.followers}</p>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
);

// Projects Window
const ProjectsWindow = ({ selectedProject, setSelectedProject }: any) => (
  <div className="space-y-4">
    {PROJECTS.map((project, index) => (
      <motion.div
        key={project.id}
        whileHover={{ scale: 1.02 }}
        onClick={() => setSelectedProject(index)}
        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
          selectedProject === index
            ? 'bg-gradient-to-r from-green-600 to-emerald-600 border-white'
            : 'bg-slate-900/50 border-white/10 hover:border-white/30'
        }`}
      >
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-white font-bold text-lg">{project.title}</h3>
              <p className="text-white/70 text-sm">{project.tech}</p>
            </div>
            <span className="px-3 py-1 bg-white/20 rounded-full text-white text-xs font-bold">
              {project.status}
            </span>
          </div>
          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all"
              style={{ width: `${project.progress}%` }}
            />
          </div>
          <p className="text-white/60 text-xs">{project.lastUpdate}</p>
        </div>
      </motion.div>
    ))}
  </div>
);

// Analytics Window
const AnalyticsWindow = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 gap-4">
      <StatCard label="Total Visits" value={VISITOR_DATA.totalVisits.toLocaleString()} icon={TrendingUp} color="bg-blue-500" />
      <StatCard label="Today's Visits" value={VISITOR_DATA.todayVisits.toLocaleString()} icon={Clock} color="bg-green-500" />
      <StatCard label="Unique Visitors" value={VISITOR_DATA.uniqueVisitors.toLocaleString()} icon={User} color="bg-purple-500" />
      <StatCard label="Avg. Session" value={VISITOR_DATA.avgSessionTime} icon={Clock} color="bg-orange-500" />
    </div>

    <div className="bg-slate-900/50 p-6 rounded-lg border border-white/10">
      <h3 className="text-white font-bold mb-4 flex items-center gap-2">
        <Globe className="text-blue-400" size={20} />
        Top Countries
      </h3>
      <div className="space-y-2">
        {VISITOR_DATA.topCountries.map((country, i) => (
          <div key={i} className="flex items-center justify-between text-white/80">
            <span>{country}</span>
            <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                style={{ width: `${100 - i * 20}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-slate-900/50 p-4 rounded-lg border border-white/10">
      <p className="text-gray-400 text-sm">
        Last visit: <span className="text-white font-medium">{VISITOR_DATA.lastVisit}</span>
      </p>
    </div>
  </div>
);

const StatCard = ({ label, value, icon: Icon, color }: any) => (
  <div className="bg-slate-900/50 p-6 rounded-lg border border-white/10">
    <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center mb-3`}>
      <Icon className="text-white" size={24} />
    </div>
    <p className="text-3xl font-black text-white mb-1">{value}</p>
    <p className="text-gray-400 text-sm font-medium">{label}</p>
  </div>
);

// Terminal Window
const TerminalWindow = () => {
  const [lines] = useState([
    '$ whoami',
    'developer@portfolio',
    '$ ls -la',
    'drwxr-xr-x  profile.txt',
    'drwxr-xr-x  projects/',
    'drwxr-xr-x  social/',
    '-rw-r--r--  README.md',
    '$ cat README.md',
    'Welcome to my portfolio!',
    'Feel free to explore around.',
    '$'
  ]);

  return (
    <div className="bg-black rounded-lg p-6 font-mono text-sm">
      {lines.map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className={line.startsWith('$') ? 'text-green-400' : 'text-white/80'}
        >
          {line}
        </motion.div>
      ))}
      <span className="text-green-400 animate-pulse">█</span>
    </div>
  );
};

export default Main;