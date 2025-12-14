"use client";

import { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import type { DetectedObject } from "@tensorflow-models/coco-ssd";

export default function ScanPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load TensorFlow + model
  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.setBackend("webgl");
        await tf.ready();
        const loadedModel = await cocoSsd.load();
        setModel(loadedModel);
        setLoading(false);
      } catch {
        setError("Failed to load AI model");
        setLoading(false);
      }
    };

    loadModel();
  }, []);

  // Start camera
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch {
        setError("Camera access denied or unavailable");
      }
    };

    startCamera();
  }, []);

  // Detection loop
  useEffect(() => {
    let animationId: number;

    const detectFrame = async () => {
      if (
        model &&
        videoRef.current &&
        canvasRef.current &&
        videoRef.current.readyState === 4
      ) {
        const predictions: DetectedObject[] =
          await model.detect(videoRef.current);

        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          ctx.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );

          predictions.forEach((prediction: DetectedObject) => {
            const [x, y, width, height] = prediction.bbox;

            ctx.strokeStyle = "#00FF00";
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, width, height);

            ctx.fillStyle = "#00FF00";
            ctx.font = "16px Arial";
            ctx.fillText(
              `${prediction.class} (${Math.round(
                prediction.score * 100
              )}%)`,
              x,
              y > 10 ? y - 5 : 10
            );
          });
        }
      }

      animationId = requestAnimationFrame(detectFrame);
    };

    detectFrame();

    return () => cancelAnimationFrame(animationId);
  }, [model]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-lg">
        Loading AI model...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden">
      <video
        ref={videoRef}
        className="absolute top-0 left-0 h-full w-full object-cover"
        muted
        playsInline
      />

      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        className="absolute top-0 left-0 h-full w-full"
      />

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded bg-black/70 px-4 py-2 text-white text-sm">
        EcoScan — AI Object Detection
      </div>
    </div>
  );
}
