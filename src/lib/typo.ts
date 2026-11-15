// Liaison des petits mots (a, of, the, in…) au mot suivant par une espace
// insécable, pour qu'aucune ligne ne se termine par l'un d'eux. Les balises
// HTML sont laissées intactes : seul le texte entre les balises est modifié.
const SHORT_WORDS = /\b(a|an|the|of|in|on|to|at|by|or|as|is|if|and|for|but|nor|no|so|I)\s+/gi;

export function noOrphans(html: string): string {
  return html
    .split(/(<[^>]+>)/)
    .map((part) => (part.startsWith('<') ? part : part.replace(SHORT_WORDS, '$1\u00a0')))
    .join('');
}
