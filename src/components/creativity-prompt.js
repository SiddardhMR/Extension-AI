"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Textarea } from "./ui/textarea"
import { Badge } from "./ui/badge"
import { Lightbulb, Timer, Zap, RotateCcw, Trophy } from "lucide-react"
import { generateAIResponse } from "../utils/deepseek-api"

const creativeChallenges = [
  "Invent a new fruit with unexpected side effects",
  "Design a T-shirt slogan for introverts",
  "Create a superhero whose power is completely useless",
  "Describe a restaurant that serves only foods that start with the same letter",
  "Invent a new holiday and explain how people celebrate it",
  "Design a product that solves a problem that doesn't exist",
  "Create a dating app for inanimate objects",
  "Describe a world where gravity works backwards on Tuesdays",
  "Invent a new sport that can only be played in elevators",
  "Design a theme park based on everyday chores",
  "Create a social media platform for time travelers",
  "Describe a job interview for becoming a professional cloud watcher",
]

export default function CreativityPrompt() {
  const [gameState, setGameState] = useState("waiting") // waiting, active, comparing, finished
  const [currentChallenge, setCurrentChallenge] = useState("")
  const [userResponse, setUserResponse] = useState("")
  const [aiResponse, setAiResponse] = useState("")
  const [timeLeft, setTimeLeft] = useState(60)
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)

  useEffect(() => {
    let interval
    if (gameState === "active" && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameState("comparing")
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [gameState, timeLeft])

  const startChallenge = async () => {
    const challenge = creativeChallenges[Math.floor(Math.random() * creativeChallenges.length)]
    setCurrentChallenge(challenge)
    setGameState("active")
    setTimeLeft(60)
    setUserResponse("")
    setAiResponse("")

    // Generate AI response in background
    setIsGeneratingAI(true)
    try {
      const prompt = `Here's a creative challenge: "${challenge}". Give me your creative, funny, and original response. Be imaginative and entertaining. Keep it under 150 words.`
      const response = await generateAIResponse(prompt)
      setAiResponse(response)
    } catch (error) {
      setAiResponse(
        "The AI got distracted by a shiny object and forgot to respond! But I'm sure your idea is brilliant.",
      )
    }
    setIsGeneratingAI(false)
  }

  const submitEarly = () => {
    if (userResponse.trim()) {
      setGameState("comparing")
    }
  }

  const skipChallenge = () => {
    setGameState("comparing")
  }

  const newChallenge = () => {
    setGameState("waiting")
  }

  const formatTime = (seconds) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`
  }

  const getTimerColor = () => {
    if (timeLeft > 30) return "text-green-600"
    if (timeLeft > 10) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-6 h-6" />
          Zero-Commitment Creativity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {gameState === "waiting" && (
          <div className="text-center space-y-4">
            <p className="text-lg">Ready for a 60-second creative burst?</p>
            <p className="text-sm text-gray-600">
              Get a random challenge, think fast, and see how your creativity compares to AI!
            </p>
            <Button onClick={startChallenge} size="lg" className="bg-yellow-500 hover:bg-yellow-600">
              <Zap className="w-4 h-4 mr-2" />
              Surprise Me!
            </Button>
          </div>
        )}

        {gameState === "active" && (
          <div className="space-y-4">
            <div className="text-center">
              <Badge variant="outline" className={`text-2xl px-4 py-2 ${getTimerColor()}`}>
                <Timer className="w-5 h-5 mr-2" />
                {formatTime(timeLeft)}
              </Badge>
            </div>

            <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
              <CardContent className="pt-4">
                <h3 className="font-bold text-lg mb-2">Your Challenge:</h3>
                <p className="text-gray-800">{currentChallenge}</p>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Your creative response:</label>
              <Textarea
                placeholder="Let your imagination run wild..."
                value={userResponse}
                onChange={(e) => setUserResponse(e.target.value)}
                className="min-h-32"
                disabled={timeLeft === 0}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={submitEarly}
                disabled={!userResponse.trim()}
                className="flex-1 bg-green-500 hover:bg-green-600"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Submit Early
              </Button>
              <Button onClick={skipChallenge} variant="outline">
                Skip
              </Button>
            </div>
          </div>
        )}

        {gameState === "comparing" && (
          <div className="space-y-4">
            <div className="text-center">
              <Badge variant="outline" className="text-lg px-4 py-2">
                Time's Up! Let's Compare
              </Badge>
            </div>

            <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
              <CardContent className="pt-4">
                <h3 className="font-bold text-sm mb-2">The Challenge:</h3>
                <p className="text-sm text-gray-700">{currentChallenge}</p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Your Response</CardTitle>
                </CardHeader>
                <CardContent>
                  {userResponse ? (
                    <p className="text-sm leading-relaxed">{userResponse}</p>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No response submitted</p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">AI's Response</CardTitle>
                </CardHeader>
                <CardContent>
                  {isGeneratingAI ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                      <p className="text-sm text-gray-600">AI is being creative...</p>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed">{aiResponse}</p>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">Both responses are creative in their own way! 🎉</p>
              <Button onClick={newChallenge} size="lg" className="bg-yellow-500 hover:bg-yellow-600">
                <RotateCcw className="w-4 h-4 mr-2" />
                New Challenge
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
