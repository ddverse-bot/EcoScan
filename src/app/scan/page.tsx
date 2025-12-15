"use client";

import { useEffect, useRef, useState } from "react";
import { detectObjectFromImage, ScanResult } from "@/lib/ai/objectDetection";
import { addEcoPoints } from "@/lib/ecoPoints";

export default function ScanPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment"
  );
  const [scanResult, setScanResult] = useState<
    (ScanResult & { totalPoints: number }) | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  /* ---------------- START CAMERA ---------------- */
  useEffect(() => {
    let stream: MediaStream;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError("Camera access denied");
      }
    }

    startCamera();

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [facingMode]);

  /* ---------------- CAPTURE IMAGE ---------------- */
  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataUrl = canvas.toDataURL("image/png");

    const result = detectObjectFromImage(imageDataUrl);
    const totalPoints = addEcoPoints(result.points);

    setScanResult({
      ...result,
      totalPoints,
    });
  };

  return (
    <div className="p-4 max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">📸 Scan Item</h1>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="rounded-lg w-full mb-3"
      />

      <canvas ref={canvasRef} className="hidden" />

      <div className="flex justify-between gap-2">
        <button
          onClick={captureImage}
          className="flex-1 bg-green-600 text-white py-2 rounded"
        >
          Scan
        </button>

        <button
          onClick={() =>
            setFacingMode((prev) =>
              prev === "environment" ? "user" : "environment"
            )
          }
          className="flex-1 bg-gray-600 text-white py-2 rounded"
        >
          Flip Camera
        </button>
      </div>

      {scanResult && (
        <div className="mt-4 p-4 rounded bg-green-100">
          <p className="text-lg font-bold">
            Category: {scanResult.category}
          </p>
          <p className="mt-1">➕ Points Earned: {scanResult.points}</p>
          <p className="mt-1">⭐ Total Eco Points: {scanResult.totalPoints}</p>
          <p className="mt-2">{scanResult.message}</p>
        </div>
      )}
    </div>
  );
}
