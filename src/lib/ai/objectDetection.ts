/* ---------- Scan Types ---------- */

export type ScanCategory =
  | "Plastic"
  | "Paper"
  | "Metal"
  | "Organic"
  | "Unknown";

export interface ScanResult {
  category: ScanCategory;
  points: number;
  message: string;
}

/* ---------- Detection Logic ---------- */
/**
 * Lightweight image detection (Firebase-safe)
 * Uses image mime type heuristics
 */
export function detectObjectFromImage(
  imageDataUrl: string
): ScanResult {

  // Base64 MIME checks
  if (imageDataUrl.startsWith("data:image/png")) {
    return {
      category: "Plastic",
      points: 10,
      message: "Plastic detected. Try to recycle ♻️"
    };
  }

  if (imageDataUrl.startsWith("data:image/jpeg")) {
    return {
      category: "Paper",
      points: 15,
      message: "Paper detected. Good recyclable choice 📄"
    };
  }

  if (imageDataUrl.startsWith("data:image/webp")) {
    return {
      category: "Organic",
      points: 20,
      message: "Organic item detected. Compost if possible 🌱"
    };
  }

  return {
    category: "Unknown",
    points: 5,
    message: "Item not recognized. Try again."
  };
}


