"use client";

import { useState } from "react";
import { getEcoPoints, resetEcoPoints } from "@/lib/ecoPoints";

export default function ProgressPage() {
  const [points, setPoints] = useState(getEcoPoints());

  return (
    <div className="p-6 max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">🌱 Eco Progress</h1>

      <div className="text-5xl font-bold text-green-600 mb-4">
        {points}
      </div>

      <p className="mb-6">Total Eco Points Earned</p>

      <button
        onClick={() => {
          resetEcoPoints();
          setPoints(0);
        }}
        className="px-4 py-2 bg-red-500 text-white rounded"
      >
        Reset Points
      </button>
    </div>
  );
}
