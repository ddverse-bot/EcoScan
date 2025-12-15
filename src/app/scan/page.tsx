"use client";

import { useEffect, useRef, useState } from "react";
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

type Result = "Plastic" | "Paper" | "Metal";

export default function ScanPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [result, setResult] = useState<Result | null>(null);
  const [points, setPoints] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" }
    }).then(stream => {
      if (videoRef.current) videoRef.current.srcObject = stream;
    });
  }, []);

  const analyzeBrightness = (): Result => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    let total = 0;
    for (let i = 0; i < data.length; i += 4) {
      total += (data[i] + data[i + 1] + data[i + 2]) / 3;
    }

    const avg = total / (data.length / 4);

    if (avg > 180) return "Paper";
    if (avg > 100) return "Plastic";
    return "Metal";
  };

  const capture = async () => {
    const video = videoRef.current!;
    const canvas = canvasRef.current!;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    canvas.getContext("2d")?.drawImage(video, 0, 0);

    const detected = analyzeBrightness();
    applyResult(detected);
  };

  const applyResult = async (type: Result) => {
    const earned =
      type === "Plastic" ? 10 :
      type === "Paper" ? 15 : 20;

    setResult(type);
    setPoints(p => p + earned);
    setProgress(p => Math.min(100, p + earned));

    await addDoc(collection(db, "scans"), {
      result: type,
      points: earned,
      createdAt: serverTimestamp()
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>EcoScan</h2>

      <video ref={videoRef} autoPlay playsInline width="100%" />

      <canvas ref={canvasRef} hidden />

      <button onClick={capture}>Scan</button>

      <div style={{ marginTop: 10 }}>
        <button onClick={() => applyResult("Plastic")}>Plastic</button>
        <button onClick={() => applyResult("Paper")}>Paper</button>
        <button onClick={() => applyResult("Metal")}>Metal</button>
      </div>

      {result && (
        <>
          <p>Detected: <b>{result}</b></p>
          <p>Points: <b>{points}</b></p>

          <div style={{
            height: 20,
            background: "#ddd",
            borderRadius: 10
          }}>
            <div style={{
              width: `${progress}%`,
              height: "100%",
              background: "green",
              borderRadius: 10
            }} />
          </div>
        </>
      )}
    </div>
  );
}

