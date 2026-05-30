import speechRaw from "./ShopIt-Speech-v2.md?raw";

/**
 * Speaker notes for one slide, as parsed from ShopIt-Speech-v2.md.
 *
 * The .md uses a fixed structure per slide:
 *
 *     ### სლაიდი {N} — {Title}
 *     *ხანგრძლივობა ≈ ...*
 *     {paragraph 1}
 *     {paragraph 2}
 *     ...
 *     ---
 *
 * Sections are separated by an `---` line. The first chunk of the file is
 * the document cover (title + meta) and is skipped.
 */
export interface SlideNotes {
  /** 0-based slide index — matches `currentIndex` in SlideNavigationContext. */
  index: number;
  /** Heading text as it appears in the .md (without the "### სლაიდი N — " prefix). */
  title: string;
  /** The italic duration line, if present (e.g. "ხანგრძლივობა ≈ 1 წთ 30 წმ"). */
  duration?: string;
  /** Body paragraphs in source order. Empty array for slides with no body. */
  paragraphs: string[];
}

const SECTION_DELIMITER = /\n---\n/;
const HEADING_RE = /^###\s+სლაიდი\s+(\d+)\s+—\s+(.+?)\s*$/m;
const DURATION_RE = /^\*\s*ხანგრძლივობა[^*]+\*\s*$/m;

/**
 * Parse the v2.md speech file into a map of slide-index → notes.
 *
 * Why a single eager parse at module load: the .md is small (~10 KB), Vite
 * inlines it via `?raw`, and the parsed result is constant. Doing the work
 * once on import means the presenter view doesn't pay parse cost on every
 * slide change.
 */
function parseSpeechMd(source: string): Record<number, SlideNotes> {
  const sections = source.split(SECTION_DELIMITER);
  const result: Record<number, SlideNotes> = {};

  for (const section of sections) {
    const trimmed = section.trim();
    if (!trimmed) continue;

    const headingMatch = trimmed.match(HEADING_RE);
    if (!headingMatch) {
      // Cover block or anything else without a slide heading — skip.
      continue;
    }

    const index = Number.parseInt(headingMatch[1]!, 10);
    const title = headingMatch[2]!.trim();

    // Remove the heading line itself from the body.
    let body = trimmed.replace(HEADING_RE, "").trim();

    // Pull out the optional duration line.
    let duration: string | undefined;
    const durationMatch = body.match(DURATION_RE);
    if (durationMatch) {
      duration = durationMatch[0].replace(/^\*|\*$/g, "").trim();
      body = body.replace(DURATION_RE, "").trim();
    }

    // Split remaining body into paragraphs on blank lines.
    const paragraphs = body
      .split(/\n\s*\n/)
      .map((para) => para.trim())
      .filter((para) => para.length > 0);

    result[index] = { index, title, duration, paragraphs };
  }

  return result;
}

/** Parsed notes by slide index. Computed once at module load. */
export const slideNotesByIndex: Readonly<Record<number, SlideNotes>> =
  parseSpeechMd(speechRaw);

/** Convenience accessor — returns null if the slide has no notes section. */
export function getSlideNotes(index: number): SlideNotes | null {
  return slideNotesByIndex[index] ?? null;
}
