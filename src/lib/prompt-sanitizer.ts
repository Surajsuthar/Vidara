export type PromptSafetyCategory =
  | "explicit-sexual"
  | "sexualized-minors"
  | "graphic-nudity"
  | "vulgar";

export type PromptSanitizationResult =
  | {
      ok: true;
      prompt: string;
    }
  | {
      ok: false;
      prompt: string;
      category: PromptSafetyCategory;
      reason: string;
    };

const ZERO_WIDTH_CHARS = /[\u200B-\u200D\uFEFF]/g;

const BLOCKED_PATTERNS: {
  category: PromptSafetyCategory;
  reason: string;
  patterns: RegExp[];
}[] = [
  {
    category: "sexualized-minors",
    reason: "Prompts cannot request sexualized depictions of minors.",
    patterns: [
      /\b(?:child|children|minor|underage|teen|teenage|schoolgirl|schoolboy)\b.*\b(?:nude|naked|sexual|erotic|porn|explicit|seductive)\b/i,
      /\b(?:nude|naked|sexual|erotic|porn|explicit|seductive)\b.*\b(?:child|children|minor|underage|teen|teenage|schoolgirl|schoolboy)\b/i,
    ],
  },
  {
    category: "explicit-sexual",
    reason: "Prompts cannot request pornographic or explicit sexual content.",
    patterns: [
      /\b(?:porn|pornographic|hardcore|explicit sex|sexual intercourse|oral sex|anal sex|masturbat(?:e|ion)|orgasm|fetish)\b/i,
      /\b(?:blowjob|handjob|cunnilingus|fellatio|penetrat(?:e|ion)|ejaculat(?:e|ion))\b/i,
    ],
  },
  {
    category: "graphic-nudity",
    reason: "Prompts cannot request graphic nudity.",
    patterns: [
      /\b(?:full frontal nudity|graphic nudity|visible genitals|exposed genitals|naked genitals)\b/i,
      /\b(?:nude|naked)\b.*\b(?:genitals|breasts|explicit|sexual|erotic)\b/i,
    ],
  },
  {
    category: "vulgar",
    reason: "Prompts cannot include vulgar sexual terms.",
    patterns: [/\b(?:fuck|fucking|cunt|dick|cock|pussy)\b/i],
  },
];

function normalizePrompt(input: string) {
  const normalized = input
    .normalize("NFKC")
    .replace(ZERO_WIDTH_CHARS, "")
    .split("")
    .map((char) =>
      char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127 ? " " : char,
    )
    .join("");

  return normalized.replace(/\s+/g, " ").trim();
}

function normalizeForMatching(input: string) {
  return normalizePrompt(input)
    .replace(/[0]/g, "o")
    .replace(/[1!|]/g, "i")
    .replace(/[3]/g, "e")
    .replace(/[4@]/g, "a")
    .replace(/[5$]/g, "s")
    .replace(/[7]/g, "t")
    .replace(/\s*[-_.]+\s*/g, " ")
    .toLowerCase();
}

export function sanitizePrompt(input: string): PromptSanitizationResult {
  const prompt = normalizePrompt(input);
  const comparablePrompt = normalizeForMatching(prompt);

  for (const rule of BLOCKED_PATTERNS) {
    if (rule.patterns.some((pattern) => pattern.test(comparablePrompt))) {
      return {
        ok: false,
        prompt,
        category: rule.category,
        reason: rule.reason,
      };
    }
  }

  return {
    ok: true,
    prompt,
  };
}

export function assertSafePrompt(input: string) {
  const result = sanitizePrompt(input);
  if (!result.ok) {
    throw new Error(result.reason);
  }

  return result.prompt;
}
