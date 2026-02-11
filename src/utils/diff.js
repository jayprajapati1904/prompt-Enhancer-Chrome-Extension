// Simple word-level diff algorithm
// Returns an array of { type: 'same' | 'add' | 'remove', word: string }

export function computeDiff(oldText, newText) {
  const oldWords = oldText.split(/\s+/).filter(Boolean);
  const newWords = newText.split(/\s+/).filter(Boolean);
  const result = [];

  let i = 0;
  let j = 0;

  while (i < oldWords.length || j < newWords.length) {
    if (
      i < oldWords.length &&
      j < newWords.length &&
      oldWords[i] === newWords[j]
    ) {
      result.push({ type: "same", word: oldWords[i] });
      i++;
      j++;
    } else {
      if (i < oldWords.length) {
        result.push({ type: "remove", word: oldWords[i] });
        i++;
      }
      if (j < newWords.length) {
        result.push({ type: "add", word: newWords[j] });
        j++;
      }
    }
  }

  return result;
}
