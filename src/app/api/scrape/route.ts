// src/app/api/scrape/route.ts
import { NextRequest } from 'next/server'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { summariseText } from '@/lib/summarise'
import { translateToUrdu } from '@/lib/translateToUrdu'
import { supabase } from '@/lib/supabase'
import clientPromise from '@/lib/mongodb'

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()
    console.log('🔗 Received URL:', url)

    const response = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/114.0.0.0 Safari/537.36',
      },
    })

    const html = response.data // ✅ Correct usage
    console.log('📥 HTML fetched successfully')

    const $ = cheerio.load(html)
    $('.comments, #comments, .comment-list').remove()

    let text = ''
    const primary = $('article, main, section')

    if (primary.length) {
      primary.find('p, h1, h2, h3, h4, h5, h6').each((_, el) => {
        const cleaned = $(el).text().trim()
        if (cleaned) text += cleaned + '\n\n'
      })
    } else {
      $('p, h1, h2, h3, h4, h5, h6').each((_, el) => {
        const cleaned = $(el).text().trim()
        if (cleaned) text += cleaned + '\n\n'
      })
    }
text = text.trim()
console.log("📄 Extracted text sample:", text.slice(0, 300))

if (!text || text.length < 100) {
  throw new Error('❌ Extracted text is too short or missing')
}

    const summary = summariseText(text)
    const urdu = translateToUrdu(summary)

    const { error } = await supabase.from('summaries').insert([
      {
        url,
        summary,
        translatedSummary: urdu,
      },
    ])

    if (error) {
      console.error('❌ Supabase error:', error)
      throw new Error('Failed to insert into Supabase')
    }

    const client = await clientPromise
    const db = client.db('nexium-blogSummariser')
    const collection = db.collection('fullblogs')

    await collection.insertOne({
      url,
      text,
      createdAt: new Date(),
    })

    return Response.json({ full: text, summary, urdu })
  } catch (err: unknown) {
    console.error('SCRAPE ERROR:', err)
    return Response.json(
      { error: 'Scraping or summarizing failed' },
      { status: 500 }
    )
  }
}