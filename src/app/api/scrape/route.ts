// src/app/api/scrape/route.ts
import * as cheerio from 'cheerio'      //using cheerio library

export async function POST(req: Request)   // handling POST request at the backend
{
  try 
  {
    const { url } = await req.json()    // gets the url sent by the frontend

    const res = await fetch(url, 
    {
      headers: 
      {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'text/html',
      },
    })

    const html = await res.text()  // getting the ftml of the url(blog)

    const $ = cheerio.load(html)   // loads html into cheerio
    let text = ''
    $('h1, h2, h3, h4, h5, h6, p').each((_, el) => 
    {
      const tag = $(el).prop('tagName')?.toLowerCase()
      text += $(el).text().trim() + '\n\n'  // line breaks for spacing
    })
    return Response.json({ text })   // returning text to frontend
  } 
  catch (error) 
  {
    return Response.json({ error: 'Failed to fetch/scrape content' }, { status: 500 })   // if anything fails then return the error
  }
}
