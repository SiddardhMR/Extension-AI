"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Feather, Download, Share, RefreshCw, Globe } from "lucide-react"
import { generateAIResponse } from "../utils/deepseek-api"

const backgroundThemes = [
  "bg-gradient-to-br from-blue-400 to-purple-600",
  "bg-gradient-to-br from-green-400 to-blue-500",
  "bg-gradient-to-br from-purple-400 to-pink-600",
  "bg-gradient-to-br from-yellow-400 to-orange-500",
  "bg-gradient-to-br from-pink-400 to-red-500",
  "bg-gradient-to-br from-indigo-400 to-purple-500",
]

export default function HaikuGenerator() {
  const [haiku, setHaiku] = useState("")
  const [theme, setTheme] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [backgroundTheme, setBackgroundTheme] = useState(backgroundThemes[0])
  const [useTabTitle, setUseTabTitle] = useState(true)
  const [tabTitle, setTabTitle] = useState("")

  useEffect(() => {
    // Get the current tab title
    setTabTitle(document.title)
  }, [])

  const generateHaiku = async () => {
    setIsGenerating(true)
    setHaiku("")

    // Random background
    setBackgroundTheme(backgroundThemes[Math.floor(Math.random() * backgroundThemes.length)])

    const inspiration = useTabTitle ? tabTitle : theme || "life"

    try {
      const prompt = `Write a beautiful 3-line haiku (5-7-5 syllables) inspired by the theme: "${inspiration}". Make it poetic, thoughtful, and evocative. Format it as three separate lines.`

      const response = await generateAIResponse(prompt)
      setHaiku(response)
    } catch (error) {
      setHaiku(`Code flows through my mind\nAI dreams in silicon\nCreativity blooms`)
    }

    setIsGenerating(false)
  }

  const downloadHaiku = () => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    canvas.width = 800
    canvas.height = 600

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, "#667eea")
    gradient.addColorStop(1, "#764ba2")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Add text
    ctx.fillStyle = "white"
    ctx.font = "bold 48px serif"
    ctx.textAlign = "center"

    const lines = haiku.split("\n")
    lines.forEach((line, index) => {
      ctx.fillText(line.trim(), canvas.width / 2, 200 + index * 80)
    })

    // Download
    const link = document.createElement("a")
    link.download = "haiku.png"
    link.href = canvas.toDataURL()
    link.click()
  }

  const shareHaiku = () => {
    if (navigator.share) {
      navigator.share({
        title: "My AI Haiku",
        text: haiku,
      })
    }
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Feather className="w-6 h-6" />
          Haiku Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Button variant={useTabTitle ? "default" : "outline"} onClick={() => setUseTabTitle(true)} size="sm">
              <Globe className="w-4 h-4 mr-2" />
              Use Page Title
            </Button>
            <Button variant={!useTabTitle ? "default" : "outline"} onClick={() => setUseTabTitle(false)} size="sm">
              Custom Theme
            </Button>
          </div>

          {useTabTitle ? (
            <div className="p-3 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-600">Current page: </p>
              <p className="font-medium">{tabTitle}</p>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-2">Enter your theme or mood:</label>
              <Input
                placeholder="e.g., rainy day, first love, morning coffee..."
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full"
              />
            </div>
          )}

          <Button
            onClick={generateHaiku}
            disabled={isGenerating || (!useTabTitle && !theme)}
            className="w-full bg-green-500 hover:bg-green-600"
            size="lg"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Creating Poetry...
              </>
            ) : (
              <>
                <Feather className="w-4 h-4 mr-2" />
                Generate Haiku
              </>
            )}
          </Button>
        </div>

        {haiku && (
          <Card className={`${backgroundTheme} text-white border-0 shadow-lg`}>
            <CardContent className="pt-8 pb-8">
              <div className="text-center space-y-6">
                <div className="space-y-2">
                  {haiku.split("\n").map((line, index) => (
                    <p key={index} className="text-xl md:text-2xl font-serif leading-relaxed">
                      {line.trim()}
                    </p>
                  ))}
                </div>

                <div className="flex gap-2 justify-center pt-4">
                  <Button variant="secondary" size="sm" onClick={downloadHaiku}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="secondary" size="sm" onClick={shareHaiku}>
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="secondary" size="sm" onClick={generateHaiku}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    New Haiku
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  )
}
