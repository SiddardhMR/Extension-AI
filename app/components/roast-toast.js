"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircle, Copy, Share, Flame, Heart, Zap } from "lucide-react"
import { generateAIResponse } from "../utils/deepseek-api"

const tones = [
  { id: "nice", label: "Nice", icon: Heart, color: "bg-green-500", effect: "sparkles" },
  { id: "sarcastic", label: "Sarcastic", icon: Zap, color: "bg-yellow-500", effect: "lightning" },
  { id: "absurd", label: "Absurd", icon: Flame, color: "bg-purple-500", effect: "confetti" },
]

export default function RoastToast() {
  const [selectedTone, setSelectedTone] = useState("")
  const [userName, setUserName] = useState("")
  const [isRoast, setIsRoast] = useState(true)
  const [result, setResult] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [showEffect, setShowEffect] = useState(false)

  const generateMessage = async () => {
    if (!selectedTone) return

    setIsGenerating(true)
    setResult("")

    const type = isRoast ? "roast" : "toast"
    const target = userName || "this person"

    try {
      const prompt = `Give me a ${selectedTone} ${type} message for ${target}, no more than 40 words. Be entertaining but not offensive. Make it ${selectedTone === "nice" ? "uplifting and sweet" : selectedTone === "sarcastic" ? "witty and playfully teasing" : "completely absurd and random"}. ${type === "roast" ? "Light teasing only." : "Make them feel good!"}`

      const response = await generateAIResponse(prompt)
      setResult(response)
      setShowEffect(true)
      setTimeout(() => setShowEffect(false), 3000)
    } catch (error) {
      setResult(
        `${type === "roast" ? "🔥" : "🎉"} Oops! The AI is taking a coffee break. But you're ${type === "roast" ? "probably awesome anyway" : "definitely amazing"}!`,
      )
    }

    setIsGenerating(false)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result)
  }

  const shareMessage = () => {
    if (navigator.share) {
      navigator.share({
        title: "Boredom Buster AI",
        text: result,
      })
    }
  }

  const selectedToneData = tones.find((t) => t.id === selectedTone)

  return (
    <Card className="bg-white/90 backdrop-blur-sm relative overflow-hidden">
      {showEffect && (
        <div className="absolute inset-0 pointer-events-none">
          {selectedToneData?.effect === "sparkles" && (
            <div className="absolute inset-0 bg-gradient-to-r from-green-200/20 to-blue-200/20 animate-pulse" />
          )}
          {selectedToneData?.effect === "lightning" && (
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-200/20 to-orange-200/20 animate-bounce" />
          )}
          {selectedToneData?.effect === "confetti" && (
            <div className="absolute inset-0 bg-gradient-to-r from-purple-200/20 to-pink-200/20 animate-spin" />
          )}
        </div>
      )}

      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-6 h-6" />
          Roast or Toast
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Choose your style:</label>
            <div className="grid grid-cols-3 gap-2">
              {tones.map((tone) => (
                <Button
                  key={tone.id}
                  variant={selectedTone === tone.id ? "default" : "outline"}
                  onClick={() => setSelectedTone(tone.id)}
                  className={selectedTone === tone.id ? `${tone.color} hover:opacity-90` : ""}
                >
                  <tone.icon className="w-4 h-4 mr-2" />
                  {tone.label}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Your name or mood (optional):</label>
            <Input
              placeholder="e.g., Alex, feeling tired, coffee lover..."
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">What do you want?</label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={isRoast ? "default" : "outline"}
                onClick={() => setIsRoast(true)}
                className={isRoast ? "bg-red-500 hover:bg-red-600" : ""}
              >
                <Flame className="w-4 h-4 mr-2" />
                Roast Me
              </Button>
              <Button
                variant={!isRoast ? "default" : "outline"}
                onClick={() => setIsRoast(false)}
                className={!isRoast ? "bg-green-500 hover:bg-green-600" : ""}
              >
                <Heart className="w-4 h-4 mr-2" />
                Toast Me
              </Button>
            </div>
          </div>

          <Button
            onClick={generateMessage}
            disabled={!selectedTone || isGenerating}
            className="w-full bg-purple-500 hover:bg-purple-600"
            size="lg"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Generating...
              </>
            ) : (
              `Get ${isRoast ? "Roasted" : "Toasted"}!`
            )}
          </Button>
        </div>

        {result && (
          <Card
            className={`${selectedToneData?.color}/10 border-2 ${selectedToneData?.color.replace("bg-", "border-")}`}
          >
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="text-2xl">{isRoast ? "🔥" : "🎉"}</div>
                <p className="text-lg font-medium leading-relaxed">{result}</p>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={shareMessage}>
                    <Share className="w-4 h-4 mr-2" />
                    Share
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
