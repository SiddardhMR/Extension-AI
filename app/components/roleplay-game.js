"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Theater, Play, RotateCcw, MessageSquare } from "lucide-react"
import { generateAIResponse } from "../utils/deepseek-api"

const scenarios = [
  "You're a grumpy cactus running for mayor in a human town",
  "You're a space cat detective solving a chocolate theft on Mars",
  "You're a time-traveling barista who accidentally served coffee to dinosaurs",
  "You're a superhero whose only power is making really good sandwiches",
  "You're a dragon who's terrible at being scary and just wants to make friends",
  "You're a robot butler in a haunted mansion where the ghosts are surprisingly polite",
  "You're a pirate captain whose crew consists entirely of rubber ducks",
  "You're a wizard who can only cast spells that make things slightly more convenient",
  "You're a vampire who's allergic to blood and has to find alternative food sources",
  "You're an alien anthropologist studying human behavior at a shopping mall",
]

export default function RoleplayGame() {
  const [gameState, setGameState] = useState("waiting") // waiting, playing, finished
  const [scenario, setScenario] = useState("")
  const [conversation, setConversation] = useState([])
  const [userInput, setUserInput] = useState("")
  const [turnCount, setTurnCount] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)

  const startGame = async () => {
    const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)]
    setScenario(randomScenario)
    setGameState("playing")
    setConversation([])
    setTurnCount(0)
    setUserInput("")

    // Generate opening narration
    setIsGenerating(true)
    try {
      const prompt = `You're a creative narrator for a short, silly roleplay game. The scenario is: "${randomScenario}". Start the adventure with an engaging opening scene (2-3 sentences) and ask the player what they do first. Keep it fun and lighthearted.`

      const response = await generateAIResponse(prompt)
      setConversation([{ type: "ai", content: response }])
    } catch (error) {
      setConversation([
        {
          type: "ai",
          content: `Welcome to your adventure! ${randomScenario}. The scene is set, and everyone is looking at you expectantly. What do you do first?`,
        },
      ])
    }
    setIsGenerating(false)
  }

  const submitAction = async () => {
    if (!userInput.trim() || turnCount >= 3) return

    const newConversation = [...conversation, { type: "user", content: userInput }]
    setConversation(newConversation)
    setUserInput("")
    setIsGenerating(true)

    const newTurnCount = turnCount + 1

    try {
      let prompt
      if (newTurnCount >= 3) {
        prompt = `Continue this roleplay story. Scenario: "${scenario}". Previous conversation: ${newConversation.map((msg) => `${msg.type}: ${msg.content}`).join("\n")}. This is the final turn (turn 3/3). Provide an entertaining conclusion to the adventure. Keep it brief and fun.`
      } else {
        prompt = `Continue this roleplay story. Scenario: "${scenario}". Previous conversation: ${newConversation.map((msg) => `${msg.type}: ${msg.content}`).join("\n")}. This is turn ${newTurnCount}/3. Respond in character as the narrator, describe what happens, and ask what the player does next. Keep it brief and entertaining.`
      }

      const response = await generateAIResponse(prompt)
      setConversation([...newConversation, { type: "ai", content: response }])

      if (newTurnCount >= 3) {
        setGameState("finished")
      }
    } catch (error) {
      setConversation([
        ...newConversation,
        {
          type: "ai",
          content:
            newTurnCount >= 3
              ? "And so your adventure comes to a wonderfully chaotic end! Thanks for playing!"
              : "Something unexpected happens... What do you do next?",
        },
      ])

      if (newTurnCount >= 3) {
        setGameState("finished")
      }
    }

    setTurnCount(newTurnCount)
    setIsGenerating(false)
  }

  const resetGame = () => {
    setGameState("waiting")
    setScenario("")
    setConversation([])
    setUserInput("")
    setTurnCount(0)
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      submitAction()
    }
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Theater className="w-6 h-6" />
          Random Roleplay Game
          {gameState === "playing" && <Badge variant="outline">Turn {turnCount}/3</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {gameState === "waiting" && (
          <div className="text-center space-y-4">
            <p className="text-lg">Ready for a 3-turn adventure?</p>
            <p className="text-sm text-gray-600">
              You'll get a random character and situation, then have 3 chances to shape the story!
            </p>
            <Button onClick={startGame} size="lg" className="bg-blue-500 hover:bg-blue-600">
              <Play className="w-4 h-4 mr-2" />
              Start Adventure!
            </Button>
          </div>
        )}

        {(gameState === "playing" || gameState === "finished") && (
          <div className="space-y-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <p className="text-sm font-medium text-blue-800">Your Role:</p>
                <p className="text-blue-700">{scenario}</p>
              </CardContent>
            </Card>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {conversation.map((message, index) => (
                <div key={index} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === "user" ? "bg-purple-500 text-white" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.type === "ai" && <MessageSquare className="w-4 h-4 mt-1 flex-shrink-0" />}
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}

              {isGenerating && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                      <p className="text-sm text-gray-600">Narrator is thinking...</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {gameState === "playing" && (
              <div className="space-y-2">
                <Input
                  placeholder="What do you do? (Press Enter to submit)"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isGenerating}
                  className="w-full"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={submitAction}
                    disabled={!userInput.trim() || isGenerating || turnCount >= 3}
                    className="flex-1 bg-green-500 hover:bg-green-600"
                  >
                    Submit Action
                  </Button>
                  <Button onClick={resetGame} variant="outline">
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {gameState === "finished" && (
              <div className="text-center space-y-4">
                <Badge variant="outline" className="text-lg px-4 py-2">
                  Adventure Complete!
                </Badge>
                <Button onClick={resetGame} size="lg" className="bg-blue-500 hover:bg-blue-600">
                  <Play className="w-4 h-4 mr-2" />
                  New Adventure
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
