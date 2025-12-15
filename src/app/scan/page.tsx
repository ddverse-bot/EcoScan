"use client";

import { useEffect, useRef, useState } from "react";
import { detectObjectFromImage, ScanResult } from "@/lib/ai/objectDetection";

export default function ScanPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment"
  );
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  /* ---------------- START CAMERA ---------------- */
  useEffect(() => {
    async function startCamera() {
      try {
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }

        const newStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: false
        });

        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
        }

        setStream(newStream);
      } catch {
        setError("Camera access denied or not available");
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  /* ---------------- SAVE SCAN ---------------- */
  function saveScan(scan: ScanResult) {
    const existing = JSON.parse(localStorage.getItem("eco_scans") || "[]");

    existing.push({
      category: scan.category,
      points: scan.points,
      date: new Date().toISOString()
    });

    localStorage.setItem("eco_scans", JSON.stringify(existing));
  }

  /* ---------------- CAPTURE IMAGE ---------------- */
  function captureImage() {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataUrl = canvas.toDataURL("image/png");

    const scanResult = detectObjectFromImage(imageDataUrl);
    setResult(scanResult);
    saveScan(scanResult);
  }

  return (
    <div style={{ padding: 16 }}>
      <h1>📷 Scan Item</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ width: "100%", maxWidth: 400, borderRadius: 12 }}
      />

      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div style={{ marginTop: 12 }}>
        <button onClick={captureImage}>📸 Capture</button>
        <button
          onClick={() =>
            setFacingMode(prev =>
              prev === "environment" ? "user" : "environment"
            )
          }
          style={{ marginLeft: 10 }}
        >
          🔄 Flip Camera
        </button>
      </div>

      {result && (
        <div style={{ marginTop: 16 }}>
          <h2>✅ Scan Result</h2>
          <p><strong>Category:</strong> {result.category}</p>
          <p><strong>Points:</strong> {result.points}</p>
          <p>{result.message}</p>
        </div>
      )}
    </div>
  );
}
