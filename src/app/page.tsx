"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, Award, TrendingUp, Camera, Zap } from "lucide-react";

export default function HomePage() {
  const [ecoPoints, setEcoPoints] = useState(0);
  const [dailyStreak, setDailyStreak] = useState(0);
  const [currentLevel, setCurrentLevel] = useState("Eco Beginner");
  const [isAnimating, setIsAnimating] = useState(false);

  // Load user data from localStorage on component mount
  useEffect(() => {
    const savedPoints = localStorage.getItem("ecoPoints");
    const savedStreak = localStorage.getItem("dailyStreak");
    const savedLevel = localStorage.getItem("currentLevel");
    
    if (savedPoints) setEcoPoints(parseInt(savedPoints));
    if (savedStreak) setDailyStreak(parseInt(savedStreak));
    if (savedLevel) setCurrentLevel(savedLevel);
  }, []);

  const handleScanClick = () => {
    setIsAnimating(true);
    setTimeout(() => {
      window.location.href = "/scan";
    }, 300);
  };

  const ecoTips = [
    "Scan your breakfast to see its carbon footprint!",
    "Did you know? Plant-based meals have 50% lower emissions.",
    "Check your clothing tags - synthetic fabrics shed microplastics.",
    "Old appliances can use 2x more energy than new ones.",
    "Reusable water bottles save 1,460 plastic bottles per year!"
  ];

  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % ecoTips.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [ecoTips.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-200/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-emerald-200/40 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-32 left-20 w-40 h-40 bg-teal-200/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-green-300/30 rounded-full blur-xl animate-bounce"></div>
      </div>

      {/* Header Stats */}
      <div className="relative z-10 pt-8 px-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Leaf className="w-6 h-6 text-green-600" />
              <span className="text-2xl font-bold text-green-800">EcoScan</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-green-100 text-green-800 px-3 py-1">
              <Zap className="w-4 h-4 mr-1" />
              {ecoPoints} Points
            </Badge>
            <Badge variant="secondary" className="bg-orange-100 text-orange-800 px-3 py-1">
              <TrendingUp className="w-4 h-4 mr-1" />
              {dailyStreak} Day Streak
            </Badge>
          </div>
        </div>

        {/* Level Badge */}
        <div className="text-center mb-8">
          <Badge variant="outline" className="bg-emerald-100 text-emerald-800 px-4 py-2 text-lg border-emerald-300">
            <Award className="w-5 h-5 mr-2" />
            {currentLevel}
          </Badge>
        </div>
      </div>

      {/* Main Scan Button */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Scan Your World
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Point your camera at any object to discover its environmental impact and learn how to live more sustainably.
          </p>
        </div>

        {/* Scan Button */}
        <div className="relative">
          <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
          <Button
            onClick={handleScanClick}
            size="lg"
            className={`relative w-32 h-32 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-2xl transform transition-all duration-300 ${
              isAnimating ? "scale-95" : "hover:scale-105"
            }`}
          >
            <div className="flex flex-col items-center">
              <Camera className="w-8 h-8 mb-2" />
              <span className="text-sm font-semibold">SCAN</span>
            </div>
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mt-12 w-full max-w-md">
          <Card className="bg-white/70 backdrop-blur-sm border-green-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-sm text-gray-600">Items Scanned</div>
            </CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm border-green-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">0kg</div>
              <div className="text-sm text-gray-600">CO₂ Tracked</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Tips Carousel */}
      <div className="relative z-10 px-6 pb-8">
        <Card className="bg-white/80 backdrop-blur-sm border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">Eco Tip</p>
                <p className="text-sm text-gray-600 transition-all duration-500">
                  {ecoTips[currentTip]}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Dots */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === 0 ? "bg-green-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}