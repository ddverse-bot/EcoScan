"use client";

import { useEffect, useState } from "react";

interface ScanHistory {
  category: string;
  points: number;
  date: string;
}

export default function ProgressPage() {
  const [scans, setScans] = useState<ScanHistory[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("eco_scans") || "[]");
    setScans(saved);

    const total = saved.reduce(
      (sum: number, scan: ScanHistory) => sum + scan.points,
      0
    );
    setTotalPoints(total);
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h1>🌱 Eco Progress</h1>

      <h2>Total Points</h2>
      <p style={{ fontSize: 24, fontWeight: "bold" }}>
        {totalPoints} pts
      </p>

      <h2>Scan History</h2>

      {scans.length === 0 && <p>No scans yet. Start scanning!</p>}

      <ul>
        {scans.map((scan, index) => (
          <li key={index} style={{ marginBottom: 8 }}>
            <strong>{scan.category}</strong> — {scan.points} pts  
            <br />
            <small>{new Date(scan.date).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
