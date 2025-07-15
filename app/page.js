"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Palette, MessageCircle, Feather, Theater, Lightbulb, Sparkles } from "lucide-react"
import DoodleDuel from "./components/doodle-duel"
import RoastToast from "./components/roast-toast"
import HaikuGenerator from "./components/haiku-generator"
import RoleplayGame from "./components/roleplay-game"
import CreativityPrompt from "./components/creativity-prompt"

export default function BoredomBusterAI() {
  const [activeTab, setActiveTab] = useState("home")

  const features = [
    {
      id: "doodle",
      title: "AI Doodle Duel",
      description: "Draw against AI and see who wins!",
      icon: Palette,
      color: "bg-purple-500",
    },
    {
      id: "roast",
      title: "Roast or Toast",
      description: "Get roasted or toasted by AI",
      icon: MessageCircle,
      color: "bg-orange-500",
    },
    {
      id: "haiku",
      title: "Haiku Generator",
      description: "Instant poetic inspiration",
      icon: Feather,
      color: "bg-green-500",
    },
    {
      id: "roleplay",
      title: "Roleplay Game",
      description: "3-turn adventure stories",
      icon: Theater,
      color: "bg-blue-500",
    },
    {
      id: "creativity",
      title: "Creativity Prompt",
      description: "60-second creative challenges",
      icon: Lightbulb,
      color: "bg-yellow-500",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4">
      <div className="max-w-4xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="text-center mb-6">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 flex items-center justify-center gap-2">
              <Sparkles className="w-8 h-8 md:w-12 md:h-12" />
              Boredom Buster AI
            </h1>
            <p className="text-white/80 text-lg">Micro-doses of fun, randomness, and creativity</p>
          </div>

          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-6 bg-white/20 backdrop-blur-sm">
            <TabsTrigger
              value="home"
              className="text-white data-[state=active]:bg-white data-[state=active]:text-black"
            >
              Home
            </TabsTrigger>
            {features.map((feature) => (
              <TabsTrigger
                key={feature.id}
                value={feature.id}
                className="text-white data-[state=active]:bg-white data-[state=active]:text-black"
              >
                <feature.icon className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">{feature.title.split(" ")[0]}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="home" className="space-y-6">
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Choose Your Adventure!</CardTitle>
                <CardDescription className="text-center">
                  Each experience is designed to be quick, fun, and under 2 minutes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {features.map((feature) => (
                    <Card
                      key={feature.id}
                      className="cursor-pointer hover:scale-105 transition-transform duration-200 border-2 hover:border-purple-400"
                      onClick={() => setActiveTab(feature.id)}
                    >
                      <CardHeader className="text-center">
                        <div
                          className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-2`}
                        >
                          <feature.icon className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                        <CardDescription>{feature.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="doodle">
            <DoodleDuel />
          </TabsContent>

          <TabsContent value="roast">
            <RoastToast />
          </TabsContent>

          <TabsContent value="haiku">
            <HaikuGenerator />
          </TabsContent>

          <TabsContent value="roleplay">
            <RoleplayGame />
          </TabsContent>

          <TabsContent value="creativity">
            <CreativityPrompt />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
