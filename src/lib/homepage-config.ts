// Configuration for the interactive homepage
export const HOMEPAGE_CONFIG = {
  socials: {
    x: "https://x.com/c2c546",
    youtube: "https://www.youtube.com/@azuretya",
    discord: {
      invite: "https://discord.gg/z5Q2MSFWuu",
      serverId: "1448441468657074229",
    },
    github: "https://github.com/Azuretier",
    instagram: "https://www.instagram.com/rrrrrrrrrrvq",
  },
  owner: {
    name: "Azur",
    displayName: "Azuret",
    greeting: "Hey there! 👋 I'm Azur. Feel free to ask me where you can find me online!",
  },
} as const;

// Intent keywords for routing
export const INTENT_KEYWORDS = {
  x: ["x", "twitter", "tweet", "tweets"],
  youtube: ["youtube", "video", "videos", "yt", "channel"],
  discord: ["discord", "server", "chat", "community"],
  github: ["github", "code", "repos", "repository"],
  instagram: ["instagram", "insta", "ig", "photos"],
} as const;
