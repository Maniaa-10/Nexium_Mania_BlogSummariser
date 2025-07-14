// lib/translateToUrdu.ts

import dictionary from '@/lib/dictionary'

export function translateToUrdu(summary: string): string 
{
  return summary
    .split(' ')
    .map(word => 
    {
      const clean = word.toLowerCase().replace(/[^a-z]/gi, '') // remove punctuation
      return dictionary[clean] || word
    })
    .join(' ')
}
