"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Camera, RotateCcw, Zap, AlertCircle } from "lucide-react";

export default function ScanPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cameraError, setCameraError] = useState<string>("");

  // Initialize camera on component mount
  useEffect(() => {
    initializeCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setHasCamera(true);
        setCameraError("");
      }
    } catch (error) {
      console.error("Camera access error:", error);
      setCameraError("Camera access denied. Please enable camera permissions to scan objects.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleScan = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsScanning(true);
    setIsAnalyzing(true);

    // Capture frame from video
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext("2d");
    
    if (ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);
      
      // Simulate AI analysis (will be replaced with actual TensorFlow.js)
      setTimeout(() => {
        const mockResults = [
          {
            item: "Plastic Water Bottle",
            category: "Plastic & Waste",
            co2Impact: "82g CO₂e",
            impactLevel: "high",
            description: "Single-use plastic bottle with high environmental impact",
            ecoTip: "Switch to a reusable water bottle to save 1,460 plastic bottles per year",
            points: 15
          },
          {
            item: "Organic Apple",
            category: "Food Items",
            co2Impact: "12g CO₂e",
            impactLevel: "low",
            description: "Fresh organic fruit with minimal packaging",
            ecoTip: "Great choice! Organic fruits have 25% lower carbon footprint",
            points: 25
          },
          {
            item: "Cotton T-Shirt",
            category: "Clothing",
            co2Impact: "2.1kg CO₂e",
            impactLevel: "medium",
            description: "Cotton garment with moderate environmental impact",
            ecoTip: "Look for organic cotton or recycled materials next time",
            points: 20
          }
        ];

        const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
        setScanResult(randomResult);
        setIsAnalyzing(false);
        setIsScanning(false);

        // Add points to user's total
        const currentPoints = parseInt(localStorage.getItem("ecoPoints") || "0");
        localStorage.setItem("ecoPoints", (currentPoints + randomResult.points).toString());
      }, 2000);
    }
  };

  const resetScan = () => {
    setScanResult(null);
    setIsScanning(false);
    setIsAnalyzing(false);
  };

  const goBack = () => {
    window.location.href = "/";
  };

  const getImpactColor = (level: string) => {
    switch (level) {
      case "low": return "bg-green-100 text-green-800 border-green-300";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "high": return "bg-red-100 text-red-800 border-red-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={goBack}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <div className="text-white text-lg font-semibold">AI EcoScan</div>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetScan}
            className="text-white hover:bg-white/20"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Camera View */}
      <div className="relative w-full h-full">
        {cameraError ? (
          <div className="flex items-center justify-center h-screen bg-gray-900">
            <Card className="mx-4 bg-red-50 border-red-200">
              <CardContent className="p-6 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-800 mb-2">Camera Access Required</h3>
                <p className="text-red-600 mb-4">{cameraError}</p>
                <Button onClick={initializeCamera} className="bg-red-600 hover:bg-red-700">
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
          </>
        )}

        {/* Scanning Overlay */}
        {hasCamera && !cameraError && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Scanning Frame */}
            <div className="relative w-64 h-64 border-2 border-white/50 rounded-lg">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-400 rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-400 rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-400 rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-400 rounded-br-lg"></div>
              
              {isScanning && (
                <div className="absolute inset-0 bg-green-400/20 rounded-lg animate-pulse">
                  <div className="absolute inset-0 border-2 border-green-400 rounded-lg animate-ping"></div>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="absolute bottom-32 left-0 right-0 text-center">
              <p className="text-white text-lg font-medium mb-2">
                {isAnalyzing ? "Analyzing object..." : "Point camera at an object"}
              </p>
              <p className="text-white/70 text-sm">
                {isAnalyzing ? "AI is calculating environmental impact" : "Food, clothing, appliances, or waste"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Scan Button */}
      {hasCamera && !cameraError && !scanResult && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <Button
            onClick={handleScan}
            disabled={isScanning}
            size="lg"
            className={`w-20 h-20 rounded-full bg-white hover:bg-gray-100 text-gray-800 shadow-2xl transform transition-all duration-300 ${
              isScanning ? "scale-95 opacity-50" : "hover:scale-105"
            }`}
          >
            <Camera className="w-8 h-8" />
          </Button>
        </div>
      )}

      {/* Scan Result Modal */}
      {scanResult && (
        <div className="absolute inset-0 bg-black/80 flex items-end justify-center z-30 p-4">
          <Card className="w-full max-w-md bg-white rounded-t-3xl animate-slide-up">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{scanResult.item}</h3>
                <Badge variant="outline" className="mb-4">
                  {scanResult.category}
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">CO₂ Impact</span>
                  <Badge className={getImpactColor(scanResult.impactLevel)}>
                    {scanResult.co2Impact}
                  </Badge>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-700">{scanResult.description}</p>
                </div>

                <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                  <p className="text-sm font-medium text-green-800 mb-1">Eco Tip</p>
                  <p className="text-sm text-green-700">{scanResult.ecoTip}</p>
                </div>

                <div className="flex items-center justify-center p-3 bg-yellow-50 rounded-lg">
                  <Zap className="w-5 h-5 text-yellow-600 mr-2" />
                  <span className="text-sm font-medium text-yellow-800">
                    +{scanResult.points} EcoPoints Earned!
                  </span>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <Button onClick={resetScan} variant="outline" className="flex-1">
                  Scan Another
                </Button>
                <Button onClick={goBack} className="flex-1 bg-green-600 hover:bg-green-700">
                  View Progress
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}