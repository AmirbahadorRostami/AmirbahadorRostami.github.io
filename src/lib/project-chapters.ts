type NarrativeChapter = 'experience' | 'contribution' | 'technical' | 'process' | 'credits';

/** Group trusted, already-rendered Markdown at build time; keep every authored block. */
export function projectChapters(html: string): Record<NarrativeChapter, string> {
  const chapters: Record<NarrativeChapter, string> = {
    experience: '', contribution: '', technical: '', process: '', credits: '',
  };
  const parts = html.split(/<!--\s*chapter:(experience|contribution|technical|process|credits)\s*-->/);
  chapters.experience = parts[0];
  for (let index = 1; index < parts.length; index += 2) {
    chapters[parts[index] as NarrativeChapter] += parts[index + 1];
  }
  for (const key of Object.keys(chapters) as NarrativeChapter[]) {
    chapters[key] = chapters[key].trim().replace(/<(\/?)h2(?=[\s>])/g, '<$1h3');
  }
  return chapters;
}
