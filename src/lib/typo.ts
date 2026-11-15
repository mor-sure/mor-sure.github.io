// Phrases qui ne doivent jamais être coupées en fin de ligne (vide pour l'instant).
const PROTECTED: string[] = [];

const SHORT_WORDS = /\b(a|an|the|of|in|on|to|at|by|or|as|is|if|and|for|but|nor|no|so|I)[ \u00a0]+/gi;

function glue(text: string): string {
  return text.replace(/ /g, '\u00a0');
}

export function noOrphans(html: string): string {
  let out = html;

  for (const phrase of PROTECTED) {
    out = out.split(phrase).join(glue(phrase));
  }

  return out
    .split(/(<[^>]+>)/)
    .map((part) =>
      part.startsWith('<')
        ? part
        : part.replace(SHORT_WORDS, '$1\u00a0').replace(/(\w)'(\w)/g, '$1\u2019$2')
    )
    .join('');
}
