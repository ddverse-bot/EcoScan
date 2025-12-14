"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Award, TrendingUp, Zap, Target, Calendar, Leaf } from "lucide-react";
import { gamificationService, UserProgress, LEVELS } from "@/lib/gamification";

export default function ProgressPage() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userProgress = gamificationService.getProgress();
    setProgress(userProgress);
    setIsLoading(false);
  }, []);

  const goBack = () => {
    window.location.href = "/";
  };

  if (isLoading || !progress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your progress...</p>
        </div>
      </div>
    );
  }

  const currentLevel = gamificationService.getLevelInfo(progress.ecoPoints);
  const nextLevel = gamificationService.getNextLevelInfo(progress.ecoPoints);
  const progressToNext = gamificationService.getProgressToNextLevel(progress.ecoPoints);

  const formatCO2 = (grams: number): string => {
    if (grams >= 1000) {
      return `${(grams / 1000).toFixed(1)}kg`;
    }
    return `${grams}g`;
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'rare': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'epic': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'legendary': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="p-4 bg-white/80 backdrop-blur-sm border-b border-green-200">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={goBack}
            className="text-green-700 hover:bg-green-100"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-bold text-green-800">Your Progress</h1>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Level and Points Overview */}
        <Card className="bg-white/80 backdrop-blur-sm border-green-200">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Award className="w-6 h-6 text-green-600" />
              <CardTitle className="text-2xl text-green-800">{currentLevel.name}</CardTitle>
            </div>
            <p className="text-gray-600">{currentLevel.description}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {progress.ecoPoints.toLocaleString()}
              </div>
              <p className="text-sm text-gray-600">EcoPoints</p>
            </div>

            {nextLevel && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress to {nextLevel.name}</span>
                  <span className="text-green-600 font-medium">{progressToNext}%</span>
                </div>
                <Progress value={progressToNext} className="h-2" />
                <div className="text-center text-sm text-gray-500">
                  {nextLevel.minPoints - progress.ecoPoints} points to next level
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white/80 backdrop-blur-sm border-green-200">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">{progress.dailyStreak}</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-green-200">
            <CardContent className="p-4 text-center">
              <Zap className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{progress.totalScans}</div>
              <div className="text-sm text-gray-600">Items Scanned</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-green-200">
            <CardContent className="p-4 text-center">
              <Leaf className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{formatCO2(progress.co2Tracked)}</div>
              <div className="text-sm text-gray-600">CO₂ Tracked</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-green-200">
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">{progress.badges.length}</div>
              <div className="text-sm text-gray-600">Badges Earned</div>
            </CardContent>
          </Card>
        </div>

        {/* Badges Collection */}
        <Card className="bg-white/80 backdrop-blur-sm border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-yellow-500" />
              <span>Badge Collection</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {progress.badges.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {progress.badges.map((badge) => (
                  <div
                    key={badge.id}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="text-2xl">{badge.icon}</div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{badge.name}</div>
                      <div className="text-sm text-gray-600">{badge.description}</div>
                      <Badge variant="outline" className={`mt-1 text-xs ${getRarityColor(badge.rarity)}`}>
                        {badge.rarity}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No badges earned yet</p>
                <p className="text-sm text-gray-400">Start scanning to earn your first badge!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="bg-white/80 backdrop-blur-sm border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-500" />
              <span>Achievements</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {progress.achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 ${
                  achievement.completed
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-gray-800">{achievement.name}</div>
                  {achievement.completed && (
                    <Badge className="bg-green-100 text-green-800">
                      +{achievement.reward} points
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Progress: {achievement.progress.toLocaleString()} / {achievement.target.toLocaleString()}
                    </span>
                    <span className={achievement.completed ? 'text-green-600' : 'text-gray-600'}>
                      {Math.floor((achievement.progress / achievement.target) * 100)}%
                    </span>
                  </div>
                  <Progress
                    value={(achievement.progress / achievement.target) * 100}
                    className="h-2"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button
            onClick={() => window.location.href = "/scan"}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <Zap className="w-4 h-4 mr-2" />
            Continue Scanning
          </Button>
          <Button
            variant="outline"
            onClick={goBack}
            className="flex-1 border-green-300 text-green-700 hover:bg-green-50"
          >
            <Calendar className="w-4 h-4 mr-2" />
            View Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}