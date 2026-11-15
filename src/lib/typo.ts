// Typographie fine pour les textes du site :
//  - les petits mots (a, of, the, in…) sont liés au mot suivant par une espace
//    insécable, pour qu'aucune ligne ne se termine par l'un d'eux ;
//  - un titre en italique (<i>…</i>) de 40 caractères ou moins ne se coupe pas ;
//  - les apostrophes droites entre deux lettres deviennent typographiques (’).
// Les balises HTML sont laissées intactes : seul le texte entre les balises
// est modifié.
const SHORT_WORDS = /\b(a|an|the|of|in|on|to|at|by|or|as|is|if|and|for|but|nor|no|so|I)\s+/gi;
const SHORT_ITALIC = /<i>([^<]{1,40})<\/i>/gi;

export function noOrphans(html: string): string {
  return html
    .replace(SHORT_ITALIC, (_, title: string) => `<i>${title.replace(/ /g, '\u00a0')}</i>`)
    .split(/(<[^>]+>)/)
    .map((part) =>
      part.startsWith('<')
        ? part
        : part.replace(SHORT_WORDS, '$1\u00a0').replace(/(\w)'(\w)/g, '$1\u2019$2')
    )
    .join('');
}
