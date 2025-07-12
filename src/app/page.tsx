"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function HomePage() 
{
  const [url, setUrl] = useState("")

  const handleSubmit = (e: React.FormEvent) =>
  {
    e.preventDefault()
    console.log("Blog URL:", url)
  }

  return (
   <main className="flex min-h-screen flex-col items-center justify-start p-6 bg-gradient-to-br from-pink-200 via-indigo-300 to-purple-400">


      <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full max-w-md bg-purple-100 p-6 rounded-xl shadow-lg mt-20">
        
        <h1 className="text-2xl font-bold text-center text-gray-900 hover:text-gray-900 hover:[-webkit-text-stroke:1px_black]">Blog Summariser</h1>

        <h2 className="text-gray-800 text-opacity-80 text-sm text-center max-w-md  mb-6">
          Get the gist, ditch the rest
        </h2>   
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
    </main>
  )
}
