
/**
 * Décode les entités HTML (&lt;, &gt;, &amp;, etc.) pour reconstituer le XML brut.
 */
function decodeHtmlEntities(html: string): string {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || html;
}

/**
 * Extrait le premier <DisplayName> de chaque bloc commençant par xsdName="...".
 * Retourne une liste d'objets { xsdName, displayName }.
 */
export function extractFirstDisplayNamePerXsd(textData: string): Array<{ xsdName: string; displayName: string }> {
  if (!textData) return [];

  // 1) Décoder si le XML est échappé &lt;...&gt;
  const text = textData.includes('&lt;') ? decodeHtmlEntities(textData) : textData;

  // 2) Trouver toutes les occurrences de xsdName="..."
  const xsdRegex = /xsdName="([^"]+?)"/g;
  const results: Array<{ xsdName: string; displayName: string }> = [];

  // Collecter les indices de début de chaque bloc (position + valeur xsdName)
  const blocks: Array<{ xsdName: string; start: number }> = [];
  let match: RegExpExecArray | null;
  while ((match = xsdRegex.exec(text)) !== null) {
    blocks.push({ xsdName: match[1], start: match.index });
  }

  if (blocks.length === 0) return []; // aucun bloc

  // 3) Pour chaque bloc, délimiter jusqu'au prochain xsdName (ou fin) et trouver le premier <DisplayName>
  const displayNameRegex = /<DisplayName>([\s\S]*?)<\/DisplayName>/i; // i: case-insensitive

  blocks.forEach((blk, i) => {
    const start = blk.start;
    const end = i < blocks.length - 1 ? blocks[i + 1].start : text.length;
    const segment = text.slice(start, end);

    const dm = displayNameRegex.exec(segment);
    const displayName = dm ? (dm[1] || '').trim() : '';

    if (displayName) {
      results.push({ xsdName: blk.xsdName, displayName });
    } else {
      // Optionnel: pousser quand même avec displayName vide si tu veux garder la trace des xsd
      // results.push({ xsdName: blk.xsdName, displayName: '' });
    }
  });

  return results;
}

export function extractAllFirstDisplayNames(textData: string): string[] {
  return extractFirstDisplayNamePerXsd(textData).map(x => x.displayName);
}
