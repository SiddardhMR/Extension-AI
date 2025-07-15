"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Palette, RotateCcw, Trophy, Users } from "lucide-react"
import { generateAIResponse } from "../utils/deepseek-api"

const drawingPrompts = [
  "a futuristic toaster",
  "a cat wearing a business suit",
  "a tree made of candy",
  "a robot doing yoga",
  "a pizza slice surfing",
  "a dragon reading a book",
  "a house on wheels",
  "a fish with legs",
  "a cloud with sunglasses",
  "a dancing cactus",
]

export default function DoodleDuel() {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentPrompt, setCurrentPrompt] = useState("")
  const [gameState, setGameState] = useState("waiting") // waiting, drawing, comparing
  const [aiImage, setAiImage] = useState(null)
  const [scores, setScores] = useState({ user: 0, ai: 0, draws: 0 })
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)

  useEffect(() => {
    // Load scores from localStorage
    const savedScores = localStorage.getItem("doodleDuelScores")
    if (savedScores) {
      setScores(JSON.parse(savedScores))
    }
  }, [])

  const saveScores = (newScores) => {
    setScores(newScores)
    localStorage.setItem("doodleDuelScores", JSON.stringify(newScores))
  }

  const startDuel = async () => {
    const prompt = drawingPrompts[Math.floor(Math.random() * drawingPrompts.length)]
    setCurrentPrompt(prompt)
    setGameState("drawing")
    setAiImage(null)

    // Clear canvas
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Generate AI interpretation
    setIsGeneratingAI(true)
    try {
      const aiResponse = await generateAIResponse(
        `Create a simple, creative description of ${prompt}. Describe it in vivid detail as if you're drawing it. Keep it under 100 words and make it entertaining.`,
      )
      setAiImage(aiResponse)
    } catch (error) {
      setAiImage("AI is taking a creative break! Imagine a wonderfully quirky interpretation here.")
    }
    setIsGeneratingAI(false)
  }

  const setupCanvas = (canvas) => {
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height

    const ctx = canvas.getContext("2d")
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 2
    ctx.lineCap = "round"
  }

  const startDrawing = (e) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext("2d")

    const x = (e.clientX || e.touches[0].clientX) - rect.left
    const y = (e.clientY || e.touches[0].clientY) - rect.top

    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext("2d")

    const x = (e.clientX || e.touches[0].clientX) - rect.left
    const y = (e.clientY || e.touches[0].clientY) - rect.top

    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const finishDrawing = () => {
    setGameState("comparing")
  }

  const vote = (winner) => {
    const newScores = { ...scores }
    if (winner === "user") newScores.user++
    else if (winner === "ai") newScores.ai++
    else newScores.draws++

    saveScores(newScores)
    setGameState("waiting")
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      setupCanvas(canvas)
    }
  }, [gameState])

  return (
    <Card className="bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-6 h-6" />
          AI Doodle Duel
        </CardTitle>
        <div className="flex gap-4 text-sm">
          <Badge variant="outline">You: {scores.user}</Badge>
          <Badge variant="outline">AI: {scores.ai}</Badge>
          <Badge variant="outline">Draws: {scores.draws}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {gameState === "waiting" && (
          <div className="text-center space-y-4">
            <p className="text-lg">Ready to duel with AI creativity?</p>
            <Button onClick={startDuel} size="lg" className="bg-purple-500 hover:bg-purple-600">
              Start a Doodle Duel!
            </Button>
          </div>
        )}

        {gameState === "drawing" && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">Draw: "{currentPrompt}"</h3>
              <p className="text-sm text-gray-600">Draw your interpretation below!</p>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <canvas
                ref={canvasRef}
                className="w-full h-64 border border-gray-300 rounded cursor-crosshair touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </div>

            <div className="flex gap-2 justify-center">
              <Button
                onClick={() => {
                  const canvas = canvasRef.current
                  const ctx = canvas.getContext("2d")
                  ctx.clearRect(0, 0, canvas.width, canvas.height)
                  ctx.fillStyle = "white"
                  ctx.fillRect(0, 0, canvas.width, canvas.height)
                }}
                variant="outline"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Clear
              </Button>
              <Button onClick={finishDrawing} className="bg-green-500 hover:bg-green-600">
                Done Drawing!
              </Button>
            </div>
          </div>
        )}

        {gameState === "comparing" && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-center">The Duel Results!</h3>
            <p className="text-center text-gray-600">Prompt: "{currentPrompt}"</p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-center">Your Drawing</h4>
                <canvas ref={canvasRef} className="w-full h-48 border border-gray-300 rounded" />
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-center">AI's Interpretation</h4>
                <div className="w-full h-48 border border-gray-300 rounded p-4 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                  {isGeneratingAI ? (
                    <div className="text-center">
                      <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                      <p>AI is creating...</p>
                    </div>
                  ) : (
                    <p className="text-sm text-center italic">{aiImage}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-center">
              <Button onClick={() => vote("user")} className="bg-green-500 hover:bg-green-600">
                <Trophy className="w-4 h-4 mr-2" />I Win!
              </Button>
              <Button onClick={() => vote("ai")} className="bg-red-500 hover:bg-red-600">
                AI Wins
              </Button>
              <Button onClick={() => vote("draw")} variant="outline">
                <Users className="w-4 h-4 mr-2" />
                It's a Draw!
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
