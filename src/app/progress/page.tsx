"use client";

export default function ProgressPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-green-50 px-6">
      <h1 className="text-3xl font-bold text-green-700 mb-4">
        Your Eco Progress
      </h1>

      <p className="text-gray-700 text-center max-w-md">
        Start scanning items to earn eco points and level up.
        Your progress will appear here once you begin using EcoScan.
      </p>
    </div>
  );
}
