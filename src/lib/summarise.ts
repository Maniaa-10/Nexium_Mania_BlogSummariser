// lib/summarise.ts
// summary includes sentences containing frequently used words

export function summariseText(text: string): string 
{
  text = text.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim()
  const stopwords = ['the', 'is', 'and', 'to', 'in', 'a', 'of', 'for', 'on', 'with', 'that', 'by']  //ignoring these words while measuring the importance of the words
  const words = text.toLowerCase().match(/\b\w+\b/g) || []  // getting all the words

  const freqMap: Record<string, number> = {}         // count of each word
  words.forEach(word =>
  {
    if (!stopwords.includes(word)) 
    {
      freqMap[word] = (freqMap[word] || 0) + 1
    }
  })

  const sentences = text.split('.').filter(Boolean).map(s => s.trim())
  const scored = sentences.map(s => 
  {
    const words = s.toLowerCase().match(/\b\w+\b/g) || []
    const score = words.reduce((sum, w) => sum + (freqMap[w] || 0), 0)
    return { sentence: s, score }
  })

  const topSentences = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(obj => obj.sentence)

  return topSentences.join('. ') + '.'
}
