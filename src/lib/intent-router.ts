import { HOMEPAGE_CONFIG, INTENT_KEYWORDS } from "./homepage-config";

export type IntentDestination = "x" | "youtube" | "discord" | "github" | "instagram" | "unknown";

export interface IntentResult {
  destination: IntentDestination;
  url?: string;
  confidence: number;
  message: string;
}

/**
 * Parse user input to determine intent and route to appropriate destination
 * Uses heuristic keyword matching
 */
export function parseIntent(userInput: string): IntentResult {
  const input = userInput.toLowerCase().trim();

  // Check for empty input
  if (!input) {
    return {
      destination: "unknown",
      confidence: 0,
      message: "Try asking where you can find me! (X, YouTube, Discord, GitHub, or Instagram)",
    };
  }

  // Calculate match scores for each destination
  const scores: Record<IntentDestination, number> = {
    x: 0,
    youtube: 0,
    discord: 0,
    github: 0,
    instagram: 0,
    unknown: 0,
  };

  // Check X/Twitter keywords
  INTENT_KEYWORDS.x.forEach((keyword) => {
    if (input.includes(keyword)) {
      scores.x += 1;
    }
  });

  // Check YouTube keywords
  INTENT_KEYWORDS.youtube.forEach((keyword) => {
    if (input.includes(keyword)) {
      scores.youtube += 1;
    }
  });

  // Check Discord keywords
  INTENT_KEYWORDS.discord.forEach((keyword) => {
    if (input.includes(keyword)) {
      scores.discord += 1;
    }
  });

  // Check GitHub keywords
  INTENT_KEYWORDS.github.forEach((keyword) => {
    if (input.includes(keyword)) {
      scores.github += 1;
    }
  });

  // Check Instagram keywords
  INTENT_KEYWORDS.instagram.forEach((keyword) => {
    if (input.includes(keyword)) {
      scores.instagram += 1;
    }
  });

  // Find the highest scoring destination
  let maxScore = 0;
  let destination: IntentDestination = "unknown";

  (Object.keys(scores) as IntentDestination[]).forEach((key) => {
    if (scores[key] > maxScore && key !== "unknown") {
      maxScore = scores[key];
      destination = key;
    }
  });

  // Return result based on destination
  if (destination === "x") {
    return {
      destination: "x",
      url: HOMEPAGE_CONFIG.socials.x,
      confidence: maxScore,
      message: "Taking you to my X (Twitter) profile! 🐦",
    };
  }

  if (destination === "youtube") {
    return {
      destination: "youtube",
      url: HOMEPAGE_CONFIG.socials.youtube,
      confidence: maxScore,
      message: "Opening my YouTube channel! 🎥",
    };
  }

  if (destination === "discord") {
    return {
      destination: "discord",
      url: HOMEPAGE_CONFIG.socials.discord.invite,
      confidence: maxScore,
      message: "Let's chat on Discord! 💬",
    };
  }

  if (destination === "github") {
    return {
      destination: "github",
      url: HOMEPAGE_CONFIG.socials.github,
      confidence: maxScore,
      message: "Check out my GitHub projects! 💻",
    };
  }

  if (destination === "instagram") {
    return {
      destination: "instagram",
      url: HOMEPAGE_CONFIG.socials.instagram,
      confidence: maxScore,
      message: "See my Instagram photos! 📸",
    };
  }

  // No clear intent found
  return {
    destination: "unknown",
    confidence: 0,
    message: "I can help you find me on:\n• X (Twitter)\n• YouTube\n• Discord\n• GitHub\n• Instagram\n\nJust ask!",
  };
}
