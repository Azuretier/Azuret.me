"use client"

import { useEffect, useState, createContext, useContext } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Cake, GraduationCap, Send, Folder, Share2, ChevronRight, Star, Github, Youtube, Instagram, MessageCircle, Sun, Moon, MapPin, Mail, Globe, Sparkles, TrendingUp, Clock, ExternalLink, User, BarChart3, Terminal, Settings, X, Minimize2, Maximize2, FolderOpen, Image as ImageIcon, Music, Film, BookOpen, Bot, Command, Zap, Shield, Heart, Code, HelpCircle, ChevronDown, ChevronUp, Copy, Check, ArrowLeft, Layers, Server, Database, Cpu } from "lucide-react"
import RainEffect from '@/components/main/realistic-rain';

// --- SETTINGS CONTEXT ---
interface SettingsContextType {
  theme: string;
  setTheme: (theme: string) => void;
  rainIntensity: number;
  setRainIntensity: (intensity: number) => void;
  newsSpeed: number;
  setNewsSpeed: (speed: number) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  notifications: boolean;
  setNotifications: (enabled: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within SettingsProvider");
  return context;
};

// Theme configurations
const THEMES = {
  purple: {
    id: 'purple',
    name: 'Purple Dream',
    gradient: 'from-purple-500 to-pink-500',
    primary: 'rgb(168, 85, 247)',
    secondary: 'rgb(236, 72, 153)',
    accent: 'purple-500',
    glow: 'shadow-purple-500/50',
    bg: 'from-slate-800 via-purple-900/20 to-slate-950',
  },
  blue: {
    id: 'blue',
    name: 'Ocean Blue',
    gradient: 'from-blue-500 to-cyan-500',
    primary: 'rgb(59, 130, 246)',
    secondary: 'rgb(6, 182, 212)',
    accent: 'blue-500',
    glow: 'shadow-blue-500/50',
    bg: 'from-slate-800 via-blue-900/20 to-slate-950',
  },
  green: {
    id: 'green',
    name: 'Forest Green',
    gradient: 'from-green-500 to-emerald-500',
    primary: 'rgb(34, 197, 94)',
    secondary: 'rgb(16, 185, 129)',
    accent: 'green-500',
    glow: 'shadow-green-500/50',
    bg: 'from-slate-800 via-green-900/20 to-slate-950',
  },
  orange: {
    id: 'orange',
    name: 'Sunset Orange',
    gradient: 'from-orange-500 to-red-500',
    primary: 'rgb(249, 115, 22)',
    secondary: 'rgb(239, 68, 68)',
    accent: 'orange-500',
    glow: 'shadow-orange-500/50',
    bg: 'from-slate-800 via-orange-900/20 to-slate-950',
  },
};

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

const NEWS_HEADLINES = [
  "Breaking: New web framework announced at conference today",
  "My meta: 顔面最可愛い幸せ𝓪𝓷𝓰𝓮𝓵...",
  "Latest project reaches 100% completion milestone",
];

// --- AZURE SUPPORTER DOCUMENTATION DATA ---
const AZURE_DOCS = {
  overview: {
    title: "Azure Supporter",
    tagline: "Your Ultimate Discord Server Management Bot",
    description: "Azure Supporter is a powerful, feature-rich Discord bot designed to enhance your server experience with moderation tools, utility commands, fun features, and seamless integrations.",
    version: "2.5.0",
    prefix: "!az",
    invite: "https://discord.com/oauth2/authorize?client_id=YOUR_BOT_ID",
  },
  features: [
    {
      icon: Shield,
      title: "Moderation",
      description: "Powerful moderation tools to keep your server safe",
      commands: [
        { name: "!az ban", desc: "Ban a user from the server", usage: "!az ban @user [reason]" },
        { name: "!az kick", desc: "Kick a user from the server", usage: "!az kick @user [reason]" },
        { name: "!az mute", desc: "Mute a user temporarily", usage: "!az mute @user [duration] [reason]" },
        { name: "!az warn", desc: "Issue a warning to a user", usage: "!az warn @user [reason]" },
        { name: "!az clear", desc: "Delete multiple messages", usage: "!az clear [amount]" },
        { name: "!az slowmode", desc: "Set channel slowmode", usage: "!az slowmode [seconds]" },
      ]
    },
    {
      icon: Zap,
      title: "Utility",
      description: "Essential utility commands for everyday use",
      commands: [
        { name: "!az userinfo", desc: "Display user information", usage: "!az userinfo [@user]" },
        { name: "!az serverinfo", desc: "Display server statistics", usage: "!az serverinfo" },
        { name: "!az avatar", desc: "Get user's avatar", usage: "!az avatar [@user]" },
        { name: "!az poll", desc: "Create a poll", usage: "!az poll \"Question\" \"Option1\" \"Option2\"" },
        { name: "!az remind", desc: "Set a reminder", usage: "!az remind [time] [message]" },
        { name: "!az translate", desc: "Translate text", usage: "!az translate [lang] [text]" },
      ]
    },
    {
      icon: Heart,
      title: "Fun & Games",
      description: "Entertainment commands to engage your community",
      commands: [
        { name: "!az 8ball", desc: "Ask the magic 8-ball", usage: "!az 8ball [question]" },
        { name: "!az coinflip", desc: "Flip a coin", usage: "!az coinflip" },
        { name: "!az roll", desc: "Roll dice", usage: "!az roll [sides]" },
        { name: "!az meme", desc: "Get a random meme", usage: "!az meme" },
        { name: "!az trivia", desc: "Start a trivia game", usage: "!az trivia [category]" },
        { name: "!az quote", desc: "Get an inspirational quote", usage: "!az quote" },
      ]
    },
    {
      icon: Server,
      title: "Server Management",
      description: "Advanced server configuration and automation",
      commands: [
        { name: "!az welcome", desc: "Configure welcome messages", usage: "!az welcome #channel [message]" },
        { name: "!az autorole", desc: "Set auto-assign roles", usage: "!az autorole @role" },
        { name: "!az logs", desc: "Configure logging channel", usage: "!az logs #channel" },
        { name: "!az prefix", desc: "Change bot prefix", usage: "!az prefix [new prefix]" },
        { name: "!az antiraid", desc: "Enable anti-raid protection", usage: "!az antiraid [on/off]" },
        { name: "!az backup", desc: "Create server backup", usage: "!az backup create" },
      ]
    },
    {
      icon: Music,
      title: "Music",
      description: "High-quality music playback for voice channels",
      commands: [
        { name: "!az play", desc: "Play a song or playlist", usage: "!az play [song/URL]" },
        { name: "!az skip", desc: "Skip current song", usage: "!az skip" },
        { name: "!az queue", desc: "View the music queue", usage: "!az queue" },
        { name: "!az pause", desc: "Pause/resume playback", usage: "!az pause" },
        { name: "!az volume", desc: "Adjust volume", usage: "!az volume [0-100]" },
        { name: "!az lyrics", desc: "Get song lyrics", usage: "!az lyrics [song]" },
      ]
    },
    {
      icon: Database,
      title: "Economy",
      description: "Virtual economy system for your server",
      commands: [
        { name: "!az balance", desc: "Check your balance", usage: "!az balance [@user]" },
        { name: "!az daily", desc: "Claim daily reward", usage: "!az daily" },
        { name: "!az work", desc: "Work for coins", usage: "!az work" },
        { name: "!az shop", desc: "View the shop", usage: "!az shop" },
        { name: "!az buy", desc: "Purchase an item", usage: "!az buy [item]" },
        { name: "!az leaderboard", desc: "View richest users", usage: "!az leaderboard" },
      ]
    },
  ],
  quickStart: [
    { step: 1, title: "Invite Azure Supporter", description: "Click the invite link and select your server" },
    { step: 2, title: "Grant Permissions", description: "Ensure the bot has necessary permissions" },
    { step: 3, title: "Configure Settings", description: "Use !az setup to configure basic settings" },
    { step: 4, title: "Start Using", description: "Begin using commands with the !az prefix" },
  ],
  faq: [
    { q: "How do I change the bot prefix?", a: "Use the command !az prefix [new prefix] to change it. You need Administrator permissions." },
    { q: "The bot isn't responding to commands?", a: "Check if the bot has permission to read and send messages in the channel. Also verify the prefix is correct." },
    { q: "How do I set up welcome messages?", a: "Use !az welcome #channel Your welcome message here. Use {user} for mentions and {server} for server name." },
    { q: "Can I use Azure Supporter for free?", a: "Yes! Azure Supporter is completely free. Premium features are available for additional perks." },
    { q: "How do I report a bug?", a: "Join our support server and create a ticket, or use !az bugreport [description]." },
  ]
};

const Main = () => {
  // Settings state
  const [theme, setTheme] = useState('purple');
  const [rainIntensity, setRainIntensity] = useState(150);
  const [newsSpeed, setNewsSpeed] = useState(5);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [time, setTime] = useState(new Date());
  const [openWindows, setOpenWindows] = useState<string[]>([]);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [selectedSns, setSelectedSns] = useState(0);
  const [selectedProject, setSelectedProject] = useState(0);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);

  const currentTheme = THEMES[theme as keyof typeof THEMES] || THEMES.purple;

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const newsInterval = setInterval(() => {
      setCurrentNewsIndex((prev) => (prev + 1) % NEWS_HEADLINES.length);
    }, newsSpeed * 1000);
    return () => clearInterval(newsInterval);
  }, [newsSpeed]);

  // Modern loading animation
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 300);
          return 100;
        }
        return prev + 1;
      });
    }, 30);
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

  const handleSnsScroll = (e: React.WheelEvent) => {
    e.stopPropagation();
    if (e.deltaY > 0 && selectedSns < SNS_LINKS.length - 1) {
      setSelectedSns(selectedSns + 1);
    } else if (e.deltaY < 0 && selectedSns > 0) {
      setSelectedSns(selectedSns - 1);
    }
  };

  const handleProjectScroll = (e: React.WheelEvent) => {
    e.stopPropagation();
    if (e.deltaY > 0 && selectedProject < PROJECTS.length - 1) {
      setSelectedProject(selectedProject + 1);
    } else if (e.deltaY < 0 && selectedProject > 0) {
      setSelectedProject(selectedProject - 1);
    }
  };

  const desktopIcons = [
    { id: 'profile', icon: User, label: 'Profile', color: `bg-${currentTheme.accent}` },
    { id: 'social', icon: Share2, label: 'Social', color: 'bg-purple-500' },
    { id: 'projects', icon: FolderOpen, label: 'Projects', color: 'bg-green-500' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', color: 'bg-orange-500' },
    { id: 'azure-docs', icon: Bot, label: 'Azure Docs', color: 'bg-indigo-500' },
    { id: 'terminal', icon: Terminal, label: 'Terminal', color: 'bg-gray-700' },
    { id: 'settings', icon: Settings, label: 'Settings', color: 'bg-red-500' },
  ];

  const settingsValue: SettingsContextType = {
    theme, setTheme,
    rainIntensity, setRainIntensity,
    newsSpeed, setNewsSpeed,
    isDarkMode, setIsDarkMode,
    notifications, setNotifications,
  };

  return (
    <SettingsContext.Provider value={settingsValue}>
      {/* Modern Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
          >
            {/* Animated background circles */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div
                className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
                animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-8">
              {/* Logo animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.8 }}
                className="relative"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-24 h-24 border-4 border-transparent border-t-purple-500 border-r-blue-500 rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="text-white" size={40} />
                </div>
              </motion.div>

              {/* Loading text */}
              <div className="text-center space-y-2">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl font-black text-white"
                >
                  Loading Experience
                </motion.h2>
                <p className="text-white/60 text-sm">Please wait while we prepare everything</p>
              </div>

              {/* Modern progress bar */}
              <div className="w-80 space-y-2">
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                    style={{ width: `${loadingProgress}%` }}
                  />
                </div>
                <div className="flex justify-between text-white/40 text-xs">
                  <span>Initializing</span>
                  <span>{loadingProgress}%</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop with Rain Effect */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        className={`relative w-full h-screen overflow-hidden bg-gradient-to-br ${currentTheme.bg}`}
      >
        {/* Rain Effect Canvas */}
        <RainEffect onLoaded={() => setIsLoaded(true)} />

        {/* Clock and News Overlay */}
        <div className="absolute top-96 left-16 z-10 space-y-4">
          {/* Large Clock */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white"
          >
            <div className="text-8xl font-bold tracking-tighter leading-none drop-shadow-2xl">
              {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
            </div>
            <div className="text-2xl font-medium mt-2 opacity-90">
              {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: '2-digit' })}
            </div>
          </motion.div>

          {/* News Ticker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-black/30 backdrop-blur-md border border-white/10 rounded-xl p-4 max-w-2xl"
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={currentNewsIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-white/90 text-sm leading-relaxed"
              >
                {NEWS_HEADLINES[currentNewsIndex]}
              </motion.p>
            </AnimatePresence>
            
            {/* Dots indicator */}
            <div className="flex gap-2 mt-3">
              {NEWS_HEADLINES.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentNewsIndex ? `bg-white w-6` : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Desktop Icons */}
        <div className="absolute top-6 right-6 grid grid-cols-1 gap-6">
          {desktopIcons.map((icon) => (
            <motion.button
              key={icon.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openWindow(icon.id)}
              className="group flex flex-col items-center gap-2"
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

        {/* Windows with Scrollable Content */}
        <AnimatePresence>
          {openWindows.includes('profile') && (
            <WindowFrame
              title="Profile"
              id="profile"
              onClose={() => closeWindow('profile')}
              isActive={activeWindow === 'profile'}
              onFocus={() => setActiveWindow('profile')}
              theme={currentTheme}
            >
              <ProfileWindow theme={currentTheme} />
            </WindowFrame>
          )}

          {openWindows.includes('social') && (
            <WindowFrame
              title="Social Networks"
              id="social"
              onClose={() => closeWindow('social')}
              isActive={activeWindow === 'social'}
              onFocus={() => setActiveWindow('social')}
              theme={currentTheme}
            >
              <div className="relative h-[500px] flex items-center justify-center" onWheel={handleSnsScroll}>
                {SNS_LINKS.map((sns, index) => {
                  const offset = index - selectedSns;
                  const isSelected = index === selectedSns;
                  
                  return (
                    <div
                      key={sns.id}
                      className="absolute transition-all duration-300 ease-out cursor-pointer"
                      style={{
                        left: '50%',
                        top: '50%',
                        transform: `translateX(-50%) translateY(calc(-50% + ${offset * 140}px)) scale(${isSelected ? 1 : 0.85})`,
                        opacity: Math.abs(offset) > 2 ? 0 : 1 - Math.abs(offset) * 0.3,
                        zIndex: 100 - Math.abs(offset),
                        pointerEvents: Math.abs(offset) > 2 ? 'none' : 'auto',
                      }}
                      onClick={() => setSelectedSns(index)}
                    >
                      <SnsWidget {...sns} isSelected={isSelected} />
                    </div>
                  );
                })}
              </div>
            </WindowFrame>
          )}

          {openWindows.includes('projects') && (
            <WindowFrame
              title="Projects"
              id="projects"
              onClose={() => closeWindow('projects')}
              isActive={activeWindow === 'projects'}
              onFocus={() => setActiveWindow('projects')}
              theme={currentTheme}
            >
              <div className="relative h-[500px] flex items-center justify-center" onWheel={handleProjectScroll}>
                {PROJECTS.map((project, index) => {
                  const offset = index - selectedProject;
                  const isSelected = index === selectedProject;
                  
                  return (
                    <div
                      key={project.id}
                      className="absolute transition-all duration-300 ease-out cursor-pointer"
                      style={{
                        left: '50%',
                        top: '50%',
                        transform: `translateX(-50%) translateY(calc(-50% + ${offset * 140}px)) scale(${isSelected ? 1 : 0.85})`,
                        opacity: Math.abs(offset) > 2 ? 0 : 1 - Math.abs(offset) * 0.3,
                        zIndex: 100 - Math.abs(offset),
                        pointerEvents: Math.abs(offset) > 2 ? 'none' : 'auto',
                      }}
                      onClick={() => setSelectedProject(index)}
                    >
                      <ProjectWidget {...project} isSelected={isSelected} />
                    </div>
                  );
                })}
              </div>
            </WindowFrame>
          )}

          {openWindows.includes('analytics') && (
            <WindowFrame
              title="Site Analytics"
              id="analytics"
              onClose={() => closeWindow('analytics')}
              isActive={activeWindow === 'analytics'}
              onFocus={() => setActiveWindow('analytics')}
              theme={currentTheme}
            >
              <AnalyticsWindow theme={currentTheme} />
            </WindowFrame>
          )}

          {openWindows.includes('azure-docs') && (
            <WindowFrame
              title="Azure Supporter Documentation"
              id="azure-docs"
              onClose={() => closeWindow('azure-docs')}
              isActive={activeWindow === 'azure-docs'}
              onFocus={() => setActiveWindow('azure-docs')}
              theme={currentTheme}
              large
            >
              <AzureDocsWindow theme={currentTheme} />
            </WindowFrame>
          )}

          {openWindows.includes('terminal') && (
            <WindowFrame
              title="Terminal"
              id="terminal"
              onClose={() => closeWindow('terminal')}
              isActive={activeWindow === 'terminal'}
              onFocus={() => setActiveWindow('terminal')}
              theme={currentTheme}
            >
              <TerminalWindow />
            </WindowFrame>
          )}

          {openWindows.includes('settings') && (
          <WindowFrame
            title="Settings"
            id="settings"
            onClose={() => closeWindow('settings')}
            isActive={activeWindow === 'settings'}
            onFocus={() => setActiveWindow('settings')}
            theme={currentTheme}
          >
            <SettingsWindow theme={currentTheme} />
          </WindowFrame>
          )}
        </AnimatePresence>

        {/* Taskbar */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-slate-900/95 backdrop-blur-md border-t border-white/10 flex items-center px-4 gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-3 bg-gradient-to-r ${currentTheme.gradient} rounded-lg shadow-lg`}
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
    </SettingsContext.Provider>
  );
};

// Window Frame Component
const WindowFrame = ({ title, id, onClose, isActive, onFocus, children, theme, large = false }: any) => {
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
        left: large ? 50 : position.x,
        top: large ? 30 : position.y,
        zIndex: isActive ? 50 : 40,
      }}
      className={`bg-slate-800 rounded-lg shadow-2xl border-2 ${isActive ? `border-${theme.accent}` : 'border-white/10'} overflow-hidden`}
    >
      {/* Title Bar */}
      <div className={`bg-gradient-to-r ${isActive ? theme.gradient : 'from-slate-900 to-slate-800'} bg-opacity-90 px-6 py-4 flex items-center justify-between cursor-move border-b border-white/10`}>
        <span className="text-white font-bold text-sm">{title}</span>
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
      <div className={`p-6 ${large ? 'min-w-[900px] max-h-[80vh] overflow-y-auto' : 'min-w-[700px]'}`}>
        {children}
      </div>
    </motion.div>
  );
};

// Profile Window
const ProfileWindow = ({ theme }: { theme: any }) => (
  <div className="space-y-6">
    <div className="flex items-start gap-6">
      <div className="relative">
        <div className={`w-32 h-32 rounded-2xl overflow-hidden border-4 border-opacity-50 shadow-xl`} style={{ borderColor: theme.primary }}>
          <img src={PROFILE_INFO.images[0]} alt="Profile" className="w-full h-full object-cover" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-slate-800"></div>
      </div>
      <div className="flex-1 space-y-3">
        <h2 className="text-3xl font-black text-white">{PROFILE_INFO.name}</h2>
        <p className="font-bold uppercase text-sm tracking-wider" style={{ color: theme.primary }}>{PROFILE_INFO.pronouns}</p>
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

// SNS Widget (Scrollable osu-style)
const SnsWidget = ({ icon: Icon, label, username, followers, isSelected }: any) => {
  const brandStyles: Record<string, { gradient: string; glowColor: string }> = {
    YouTube: { gradient: "from-red-500 to-red-600", glowColor: "shadow-red-500/50" },
    GitHub: { gradient: "from-gray-700 to-gray-900", glowColor: "shadow-gray-500/50" },
    Instagram: { gradient: "from-purple-500 via-pink-500 to-orange-500", glowColor: "shadow-pink-500/50" },
    Discord: { gradient: "from-indigo-500 to-blue-600", glowColor: "shadow-blue-500/50" },
  };

  const activeBrand = brandStyles[label] || { gradient: "from-gray-500 to-gray-700", glowColor: "shadow-gray-500/50" };

  return (
    <div className={`
      w-[600px] h-28 rounded-2xl border-2 transition-all duration-300
      ${isSelected 
        ? `border-white bg-gradient-to-r shadow-2xl ${activeBrand.glowColor}` 
        : 'border-white/20 bg-gradient-to-r'
      } ${activeBrand.gradient}
    `}>
      <div className="relative h-full flex items-center px-8 gap-5 backdrop-blur-sm bg-black/40 rounded-2xl">
        <div className={`w-1.5 h-20 rounded-full bg-white ${isSelected ? 'opacity-100' : 'opacity-50'}`}></div>
        
        <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${isSelected ? 'bg-white/30' : 'bg-white/20'} backdrop-blur-sm`}>
          <Icon size={28} className="text-white" />
        </div>

        <div className="flex-1">
          <h3 className="text-white font-bold text-2xl truncate mb-1">{label}</h3>
          <p className="text-white/80 text-sm truncate">{username}</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-white/60 text-xs">{followers} followers</span>
          </div>
        </div>

        {isSelected && (
          <ChevronRight className="w-6 h-6 text-white animate-pulse" />
        )}
      </div>
    </div>
  );
};

// Project Widget (Scrollable osu-style)
const ProjectWidget = ({ title, status, tech, progress, lastUpdate, isSelected }: any) => {
  const statusColors: Record<string, { gradient: string; glowColor: string }> = {
    'In Progress': { gradient: 'from-yellow-500 to-orange-500', glowColor: 'shadow-orange-500/50' },
    'Completed': { gradient: 'from-green-500 to-emerald-500', glowColor: 'shadow-green-500/50' },
    'Planning': { gradient: 'from-purple-500 to-pink-500', glowColor: 'shadow-purple-500/50' },
  };

  const statusStyle = statusColors[status] || { gradient: 'from-cyan-500 to-blue-600', glowColor: 'shadow-cyan-500/50' };

  return (
    <div className={`
      w-[600px] h-28 rounded-2xl border-2 transition-all duration-300
      ${isSelected 
        ? `border-white bg-gradient-to-r shadow-2xl ${statusStyle.glowColor}` 
        : 'border-white/20 bg-gradient-to-r'
      } ${statusStyle.gradient}
    `}>
      <div className="relative h-full flex items-center px-8 gap-5 backdrop-blur-sm bg-black/40 rounded-2xl">
        <div className={`w-1.5 h-20 rounded-full bg-white ${isSelected ? 'opacity-100' : 'opacity-50'}`}></div>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black px-3 py-1 rounded-full bg-white/20 text-white uppercase tracking-widest border border-white/20">
              {status}
            </span>
            <span className="text-white/50 text-xs">{lastUpdate}</span>
          </div>
          
          <h3 className="text-white font-bold text-2xl truncate">{title}</h3>
          <p className="text-white/70 text-xs truncate">{tech}</p>
          
          <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-full">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-white text-xs font-bold">{progress}%</span>
          </div>
          {isSelected && (
            <ChevronRight className="w-6 h-6 text-white animate-pulse" />
          )}
        </div>
      </div>
    </div>
  );
};

// Analytics Window
const AnalyticsWindow = ({ theme }: { theme: any }) => (
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
                className={`h-full bg-gradient-to-r ${theme.gradient} rounded-full`}
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

// Azure Supporter Documentation Window
const AzureDocsWindow = ({ theme }: { theme: any }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [expandedFeature, setExpandedFeature] = useState<number | null>(0);
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCommand(text);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  const sections = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'quickstart', label: 'Quick Start', icon: Zap },
    { id: 'commands', label: 'Commands', icon: Command },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
  ];

  return (
    <div className="flex gap-6 min-h-[600px]">
      {/* Sidebar Navigation */}
      <div className="w-48 flex-shrink-0 space-y-2">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-12 h-12 bg-gradient-to-r ${theme.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
            <Bot className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-white font-black text-lg">Azure</h3>
            <p className="text-white/50 text-xs">v{AZURE_DOCS.overview.version}</p>
          </div>
        </div>

        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
              activeSection === section.id
                ? `bg-gradient-to-r ${theme.gradient} text-white shadow-lg`
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            <section.icon size={18} />
            <span className="font-medium text-sm">{section.label}</span>
          </button>
        ))}

        {/* Invite Button */}
        <div className="pt-4 mt-4 border-t border-white/10">
          <a
            href={AZURE_DOCS.overview.invite}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r ${theme.gradient} text-white font-bold text-sm shadow-lg hover:opacity-90 transition-opacity`}
          >
            <ExternalLink size={16} />
            Add to Server
          </a>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto pr-2">
        <AnimatePresence mode="wait">
          {activeSection === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Hero Section */}
              <div className={`bg-gradient-to-r ${theme.gradient} rounded-2xl p-8 relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10">
                  <h1 className="text-4xl font-black text-white mb-2">{AZURE_DOCS.overview.title}</h1>
                  <p className="text-white/90 text-xl mb-4">{AZURE_DOCS.overview.tagline}</p>
                  <p className="text-white/70 max-w-2xl">{AZURE_DOCS.overview.description}</p>
                  
                  <div className="flex items-center gap-4 mt-6">
                    <div className="bg-black/30 px-4 py-2 rounded-lg backdrop-blur-sm">
                      <span className="text-white/60 text-sm">Prefix:</span>
                      <span className="text-white font-mono font-bold ml-2">{AZURE_DOCS.overview.prefix}</span>
                    </div>
                    <div className="bg-black/30 px-4 py-2 rounded-lg backdrop-blur-sm">
                      <span className="text-white/60 text-sm">Version:</span>
                      <span className="text-white font-mono font-bold ml-2">{AZURE_DOCS.overview.version}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature Cards */}
              <div className="grid grid-cols-3 gap-4">
                {AZURE_DOCS.features.slice(0, 6).map((feature, i) => (
                  <div
                    key={i}
                    className="bg-slate-900/50 p-5 rounded-xl border border-white/10 hover:border-white/20 transition-all group"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-r ${theme.gradient} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <feature.icon className="text-white" size={22} />
                    </div>
                    <h3 className="text-white font-bold mb-1">{feature.title}</h3>
                    <p className="text-white/50 text-sm">{feature.commands.length} commands</p>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Servers', value: '50,000+' },
                  { label: 'Users', value: '2M+' },
                  { label: 'Commands', value: '100+' },
                  { label: 'Uptime', value: '99.9%' },
                ].map((stat, i) => (
                  <div key={i} className="bg-slate-900/50 p-4 rounded-xl border border-white/10 text-center">
                    <div className="text-2xl font-black text-white">{stat.value}</div>
                    <div className="text-white/50 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSection === 'quickstart' && (
            <motion.div
              key="quickstart"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-black text-white">Quick Start Guide</h2>
              <p className="text-white/60">Get Azure Supporter running on your server in minutes.</p>

              <div className="space-y-4">
                {AZURE_DOCS.quickStart.map((step) => (
                  <div
                    key={step.step}
                    className="flex items-start gap-4 bg-slate-900/50 p-6 rounded-xl border border-white/10"
                  >
                    <div className={`w-10 h-10 bg-gradient-to-r ${theme.gradient} rounded-full flex items-center justify-center flex-shrink-0 font-black text-white`}>
                      {step.step}
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">{step.title}</h3>
                      <p className="text-white/60">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Example Commands */}
              <div className="bg-slate-900/50 p-6 rounded-xl border border-white/10">
                <h3 className="text-white font-bold text-lg mb-4">Try These Commands First</h3>
                <div className="space-y-3">
                  {['!az help', '!az setup', '!az serverinfo'].map((cmd) => (
                    <div key={cmd} className="flex items-center justify-between bg-black/30 p-3 rounded-lg">
                      <code className="text-green-400 font-mono">{cmd}</code>
                      <button
                        onClick={() => copyToClipboard(cmd)}
                        className="text-white/50 hover:text-white transition-colors"
                      >
                        {copiedCommand === cmd ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'commands' && (
            <motion.div
              key="commands"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h2 className="text-3xl font-black text-white">Commands</h2>
              <p className="text-white/60 mb-6">Explore all available commands organized by category.</p>

              {AZURE_DOCS.features.map((feature, index) => (
                <div key={index} className="bg-slate-900/50 rounded-xl border border-white/10 overflow-hidden">
                  <button
                    onClick={() => setExpandedFeature(expandedFeature === index ? null : index)}
                    className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 bg-gradient-to-r ${theme.gradient} rounded-lg flex items-center justify-center`}>
                        <feature.icon className="text-white" size={20} />
                      </div>
                      <div className="text-left">
                        <h3 className="text-white font-bold">{feature.title}</h3>
                        <p className="text-white/50 text-sm">{feature.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-white/40 text-sm">{feature.commands.length} commands</span>
                      {expandedFeature === index ? (
                        <ChevronUp className="text-white/50" size={20} />
                      ) : (
                        <ChevronDown className="text-white/50" size={20} />
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {expandedFeature === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/10"
                      >
                        <div className="p-5 space-y-3">
                          {feature.commands.map((cmd, cmdIndex) => (
                            <div
                              key={cmdIndex}
                              className="bg-black/30 p-4 rounded-lg hover:bg-black/40 transition-colors"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <code className="text-green-400 font-mono font-bold">{cmd.name}</code>
                                <button
                                  onClick={() => copyToClipboard(cmd.usage)}
                                  className="text-white/50 hover:text-white transition-colors p-1"
                                >
                                  {copiedCommand === cmd.usage ? (
                                    <Check size={16} className="text-green-400" />
                                  ) : (
                                    <Copy size={16} />
                                  )}
                                </button>
                              </div>
                              <p className="text-white/70 text-sm mb-2">{cmd.desc}</p>
                              <div className="flex items-center gap-2">
                                <span className="text-white/40 text-xs">Usage:</span>
                                <code className="text-yellow-400/80 text-xs font-mono">{cmd.usage}</code>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>
          )}

          {activeSection === 'faq' && (
            <motion.div
              key="faq"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-black text-white">Frequently Asked Questions</h2>
              <p className="text-white/60">Find answers to common questions about Azure Supporter.</p>

              <div className="space-y-4">
                {AZURE_DOCS.faq.map((item, index) => (
                  <div key={index} className="bg-slate-900/50 p-6 rounded-xl border border-white/10">
                    <div className="flex items-start gap-4">
                      <div className={`w-8 h-8 bg-gradient-to-r ${theme.gradient} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <HelpCircle className="text-white" size={16} />
                      </div>
                      <div>
                        <h3 className="text-white font-bold mb-2">{item.q}</h3>
                        <p className="text-white/60">{item.a}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Support Card */}
              <div className={`bg-gradient-to-r ${theme.gradient} rounded-xl p-6 relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-bold text-xl mb-1">Still need help?</h3>
                    <p className="text-white/80">Join our support server for assistance</p>
                  </div>
                  <a
                    href="#"
                    className="bg-white/20 hover:bg-white/30 text-white font-bold px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <MessageCircle size={18} />
                    Join Support Server
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Settings Window with functional controls
const SettingsWindow = ({ theme }: { theme: any }) => {
  const settings = useSettings();
  const [language, setLanguage] = useState('en');
  const [autoSave, setAutoSave] = useState(true);
  const [showSaveNotification, setShowSaveNotification] = useState(false);

  const themes = [
    { id: 'purple', name: 'Purple Dream', gradient: 'from-purple-500 to-pink-500' },
    { id: 'blue', name: 'Ocean Blue', gradient: 'from-blue-500 to-cyan-500' },
    { id: 'green', name: 'Forest Green', gradient: 'from-green-500 to-emerald-500' },
    { id: 'orange', name: 'Sunset Orange', gradient: 'from-orange-500 to-red-500' },
  ];

  const handleSave = () => {
    setShowSaveNotification(true);
    setTimeout(() => setShowSaveNotification(false), 2000);
  };

  const handleReset = () => {
    settings.setTheme('purple');
    settings.setRainIntensity(150);
    settings.setNewsSpeed(5);
    settings.setIsDarkMode(true);
    settings.setNotifications(true);
  };

  return (
    <div className="space-y-6 relative">
      {/* Save Notification */}
      <AnimatePresence>
        {showSaveNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute -top-2 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-2 rounded-lg font-bold shadow-lg z-50 flex items-center gap-2"
          >
            <Check size={18} />
            Settings Saved!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Appearance Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-white flex items-center gap-2">
          <Sun className="text-yellow-400" size={24} />
          Appearance
        </h3>
        
        {/* Dark Mode Toggle */}
        <div className="bg-slate-900/50 p-4 rounded-lg border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-white font-medium">Dark Mode</p>
            <p className="text-gray-400 text-sm">Use dark theme across the interface</p>
          </div>
          <button
            onClick={() => settings.setIsDarkMode(!settings.isDarkMode)}
            className={`relative w-14 h-8 rounded-full transition-colors ${
              settings.isDarkMode ? `bg-gradient-to-r ${theme.gradient}` : 'bg-gray-600'
            }`}
          >
            <motion.div
              className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full"
              animate={{ x: settings.isDarkMode ? 24 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
        </div>

        {/* Theme Selection */}
        <div className="bg-slate-900/50 p-4 rounded-lg border border-white/10">
          <p className="text-white font-medium mb-3">Color Theme</p>
          <div className="grid grid-cols-2 gap-3">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => settings.setTheme(t.id)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  settings.theme === t.id
                    ? 'border-white bg-white/10'
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                <div className={`w-full h-8 rounded bg-gradient-to-r ${t.gradient} mb-2`}></div>
                <p className="text-white text-sm font-medium">{t.name}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-white flex items-center gap-2">
          <MessageCircle className="text-blue-400" size={24} />
          Notifications
        </h3>
        
        <div className="bg-slate-900/50 p-4 rounded-lg border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-white font-medium">Enable Notifications</p>
            <p className="text-gray-400 text-sm">Receive updates and alerts</p>
          </div>
          <button
            onClick={() => settings.setNotifications(!settings.notifications)}
            className={`relative w-14 h-8 rounded-full transition-colors ${
              settings.notifications ? `bg-gradient-to-r ${theme.gradient}` : 'bg-gray-600'
            }`}
          >
            <motion.div
              className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full"
              animate={{ x: settings.notifications ? 24 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
        </div>
      </div>

      {/* Effects Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-white flex items-center gap-2">
          <Sparkles className="text-purple-400" size={24} />
          Visual Effects
        </h3>

        {/* Rain Intensity Slider */}
        <div className="bg-slate-900/50 p-4 rounded-lg border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <p className="text-white font-medium">Rain Effect Intensity</p>
            <span style={{ color: theme.primary }} className="font-bold">{settings.rainIntensity}</span>
          </div>
          <input
            type="range"
            min="50"
            max="300"
            value={settings.rainIntensity}
            onChange={(e) => settings.setRainIntensity(Number(e.target.value))}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, ${theme.primary} 0%, ${theme.primary} ${((settings.rainIntensity - 50) / 250) * 100}%, rgba(255,255,255,0.1) ${((settings.rainIntensity - 50) / 250) * 100}%, rgba(255,255,255,0.1) 100%)`
            }}
          />
          <p className="text-gray-500 text-xs mt-2">Adjusts the number of raindrops displayed</p>
        </div>

        {/* News Speed Slider */}
        <div className="bg-slate-900/50 p-4 rounded-lg border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <p className="text-white font-medium">News Rotation Speed</p>
            <span style={{ color: theme.primary }} className="font-bold">{settings.newsSpeed}s</span>
          </div>
          <input
            type="range"
            min="3"
            max="10"
            value={settings.newsSpeed}
            onChange={(e) => settings.setNewsSpeed(Number(e.target.value))}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, ${theme.primary} 0%, ${theme.primary} ${((settings.newsSpeed - 3) / 7) * 100}%, rgba(255,255,255,0.1) ${((settings.newsSpeed - 3) / 7) * 100}%, rgba(255,255,255,0.1) 100%)`
            }}
          />
          <p className="text-gray-500 text-xs mt-2">How fast the news ticker rotates (in seconds)</p>
        </div>
      </div>

      {/* Language & Region */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-white flex items-center gap-2">
          <Globe className="text-green-400" size={24} />
          Language & Region
        </h3>
        
        <div className="bg-slate-900/50 p-4 rounded-lg border border-white/10">
          <p className="text-white font-medium mb-3">Language</p>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full bg-slate-800 text-white p-3 rounded-lg border border-white/10 focus:border-purple-500 focus:outline-none"
          >
            <option value="en">English</option>
            <option value="ja">日本語 (Japanese)</option>
            <option value="es">Español (Spanish)</option>
            <option value="fr">Français (French)</option>
            <option value="de">Deutsch (German)</option>
            <option value="zh">中文 (Chinese)</option>
          </select>
        </div>
      </div>

      {/* System Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-white flex items-center gap-2">
          <Settings className="text-red-400" size={24} />
          System
        </h3>
        
        <div className="bg-slate-900/50 p-4 rounded-lg border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-white font-medium">Auto-save Settings</p>
            <p className="text-gray-400 text-sm">Automatically save changes</p>
          </div>
          <button
            onClick={() => setAutoSave(!autoSave)}
            className={`relative w-14 h-8 rounded-full transition-colors ${
              autoSave ? `bg-gradient-to-r ${theme.gradient}` : 'bg-gray-600'
            }`}
          >
            <motion.div
              className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full"
              animate={{ x: autoSave ? 24 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
        </div>

        {/* Reset Button */}
        <button 
          onClick={handleReset}
          className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold py-3 px-4 rounded-lg border border-red-500/50 transition-all flex items-center justify-center gap-2"
        >
          <X size={20} />
          Reset to Default Settings
        </button>

        {/* Save Button */}
        <button 
          onClick={handleSave}
          className={`w-full bg-gradient-to-r ${theme.gradient} hover:opacity-90 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-lg`}
        >
          Save Changes
        </button>
      </div>

      {/* About Section */}
      <div className="bg-slate-900/50 p-6 rounded-lg border border-white/10">
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-16 h-16 bg-gradient-to-r ${theme.gradient} rounded-2xl flex items-center justify-center`}>
            <Sparkles className="text-white" size={32} />
          </div>
          <div>
            <h4 className="text-white font-black text-lg">Portfolio v2.0</h4>
            <p className="text-gray-400 text-sm">Built with React & Tailwind CSS</p>
          </div>
        </div>
        <div className="text-gray-400 text-xs space-y-1">
          <p>© 2024 Your Name. All rights reserved.</p>
          <p>Last updated: December 2024</p>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, color }: any) => (
  <div className="bg-slate-900/50 p-6 rounded-lg border border-white/10">
    <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center mb-3`}>
      <Icon className="text-white" size={24} />
    </div>
    <p className="text-3xl font-black text-white mb-1">{value}</p>
    <p className="text-gray-400 text-sm font-medium">{label}</p>
  </div>
);

export default Main;