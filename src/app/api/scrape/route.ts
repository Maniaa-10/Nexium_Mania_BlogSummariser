// src/app/api/scrape/route.ts
import * as cheerio from 'cheerio'                          //using cheerio library
import { summariseText } from '@/lib/summarise'            // for finding summary
import { translateToUrdu } from '@/lib/translateToUrdu'   // for translating into urdu
import { supabase } from '@/lib/supabase'                // for saving summary into supabase
import clientPromise from '@/lib/mongodb'               // for saving complete blog into mongodb


export async function POST(req: Request)   // handling POST request at the backend
{
  try 
  {
    const { url } = await req.json()    // gets the url sent by the frontend
      console.log('🔗 Received URL:', url)

    const res = await fetch(url, 
    {
      headers: 
      {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'text/html',
      },
    })

    const html = await res.text()  // getting the html of the url(blog)
     console.log('📥 HTML fetched successfully')

    const $ = cheerio.load(html)   // loads html into cheerio
    
    $('.comments, #comments, .comment-list').remove() // Remove common comment sections
    let text = ''    
    const primary = $('article, main, section')
    if (primary.length) 
    {
      primary.find('p, h1, h2, h3, h4, h5, h6').each((_, el) => 
      {
        const cleaned = $(el).text().trim()
        if (cleaned) text += cleaned + '\n\n'
      })
    } 
    else 
    {
      $('h1, h2, h3, h4, h5, h6, p').each((_ , el) => 
      {
        const cleaned = $(el).text().trim()
        if (cleaned) text += cleaned + '\n\n'
      })
    }
    text = text.trim()   //remove starting/ending whitespace
      console.log("📄 Extracted text sample:")
      
    const summary = summariseText(text)  // Summarize the final content
     console.log("🧠 Summary generated:", summary)
    
    const urdu = translateToUrdu(summary)  // translate the summary into urdu 
     console.log("🌐 Urdu translation done")

    const { error } = await supabase   // Save to Supabase
    .from('summaries')
    .insert([
    { 
      url: url,
      summary: summary , 
      translatedSummary: urdu,
    },
    ])
    .select()

    if (error) 
    {
      console.error("Supabase Insert Error:", error.message || error.details || error)
      throw new Error("Failed to insert into Supabase")
    }
       

    const client = await clientPromise        // save to mongodb
    const db = client.db('nexium-blogSummariser')
    const collection = db.collection('fullblogs')

    await collection.insertOne
    ({
      url,
      text,
      createdAt: new Date()
    })
      
      
    return Response.json({ full: text, summary, urdu})    // returning text and summary to frontend
  } 
  catch (error) 
  {
    console.error("SCRAPE ERROR:", error)
    return Response.json({ error: 'Scraping or summarizing failed' }, { status: 500 })   // if anything fails then return the error
  }
}
