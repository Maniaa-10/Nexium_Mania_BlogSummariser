
"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { Info } from "lucide-react"

export default function HomePage() 
{
  const [url, setUrl] = useState("")   // url of the blog
  //const [scrapedText, setScrapedText] = useState("") //text that is scrapped from the blog
  const [summary, setSummary] = useState("")       // text of the summary
  const [urdu, setUrdu] = useState("")             // urdu translation of the summary
  const [language, setLanguage] = useState("en") // 'en' or 'ur'

  const handleSubmit = async (e: React.FormEvent) =>
  {
    e.preventDefault()

    try                               //sending a POST request
    {                             
      const res = await fetch('/api/scrape', 
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        })

      const data = await res.json()
      console.log("API Response:", data) 

      if (res.ok)                   // successful scrapping
      { 
        setSummary(data.summary)
        setUrdu(data.urdu)
      } 
      else                          // scrapping failed
      {
        console.error("Scrape failed: Scraping failed. Please try another URL", data.error)
        setSummary("")
        setUrdu("")
      }
    } 
    catch (err)                      // incase of error
    {
      console.error("Error scraping: Something went wrong. Please check the URL and try again", err)
    }
    
    console.log("Blog URL:", url)
  }

  return (
   <main className="flex min-h-screen flex-col items-center justify-start p-6 bg-gradient-to-br from-pink-200 via-indigo-300 to-purple-400">


      <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full max-w-xl bg-purple-100 p-6 rounded-xl shadow-lg mt-20">
        
        <h1 className="text-4xl font-bold text-center text-gray-900 hover:text-gray-900 hover:[-webkit-text-stroke:1px_black]">Blog Summariser</h1>

        <h1 className="text-gray-800 text-opacity-80 text-center mb-6">
          Get the gist, ditch the rest
        </h1>   
        <Input
          type="url"
          placeholder="Enter blog URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full bg-white rounded-lg mb-2"
        />
        <Button 
          type="submit" 
          className="bg-gray-900 hover:bg-gray-700 text-white font-medium rounded-lg hover:scale-102"
        >
        Summarise
        </Button>
      </form>

      {/*Temporarily showing the scrapped content 
        {scrapedText && (
        <div className="mt-6">
        <h2 className="font-semibold mb-2">Scraped Content:</h2>
        <p className="text-sm text-gray-800 whitespace-pre-wrap">{scrapedText}</p>
        </div>
        )}
      */}

      {summary && urdu && (
      <div className="mt-6  w-full max-w-xl bg-purple-100 p-4 rounded-xl shadow flex flex-col gap-4">
              <div className="flex w-full max-w-3xl justify-between items-center mt-6">
        <Button 
          className=" ml-auto bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          onClick={() => setLanguage((prev) => prev === "en" ? "ur" : "en")}
        >
          Switch to {language === "en" ? "Urdu" : "English"}
        </Button>
      </div>

      {language === "en" ? (
            <div>
              <h2 className="font-semibold mb-2">Summary: </h2>
              <p className="text-sm text-gray-800 whitespace-pre-wrap">{summary}</p>              
            </div>
          ) : (
            <div>
                            <TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Info className="w-4 h-4 ml-2 cursor-pointer" />
    </TooltipTrigger>
    <TooltipContent side="top" className="text-xs">
              <div className="flex flex-col items-center" >
                <p className="text-xs text-white text-centre italic mt-1 ">
                ⚠️Only a few words translated via hardcoded limited JS dictionary</p>
                <p className="text-xs text-white text-centre mb-1">
                (یہ ترجمہ محدود جاوا اسکرپٹ لغت پر مبنی ہے  )  </p>
              </div>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
              <h2 className="font-semibold text-right mb-2">:اردو ترجمہ</h2>
              <p className="text-sm text-gray-800 text-right whitespace-pre-wrap">{urdu}</p>


            </div>
      )}
      </div>
      )}


      <button
        onClick={() => 
        {
          setSummary("")
          setUrdu("")
          setUrl("")
        }
        }
        className="font-semibold fixed bottom-4 right-4 bg-indigo-400 hover:bg-pink-400 text-white rounded-full px-4 py-2 shadow-lg transition-all"
        >
        Home
      </button>

    </main>
  )
}