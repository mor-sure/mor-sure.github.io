// Phrases qui ne doivent jamais être coupées en fin de ligne.
// Ajoute ici d'autres titres si besoin.
const PROTECTED: string[] = [];

const SHORT_WORDS = /\b(a|an|the|of|in|on|to|at|by|or|as|is|if|and|for|but|nor|no|so|I)[ \u00a0]+/gi;
const SHORT_ITALIC = /<(i|em)>([^<]{1,40})<\/\1>/gi;

function glue(text: string): string {
  return text.replace(/ /g, '\u00a0');
}

export function noOrphans(html: string): string {
  let out = html.replace(SHORT_ITALIC, (_, tag: string, title: string) => `<${tag}>${glue(title)}</${tag}>`);

  // Phrases protégées : espaces insécables, avec ou sans balise autour
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
