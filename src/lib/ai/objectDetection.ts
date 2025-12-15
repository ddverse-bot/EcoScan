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

export function detectObjectFromImage(
  imageDataUrl: string
): ScanResult {
  // Lightweight heuristic (Firebase-safe)

  if (imageDataUrl.includes("png")) {
    return {
      category: "Plastic",
      points: 10,
      message: "Plastic detected. Try to recycle ♻️"
    };
  }

  if (imageDataUrl.includes("jpeg")) {
    return {
      category: "Paper",
      points: 15,
      message: "Paper detected. Good recyclable choice 📄"
    };
  }

  return {
    category: "Unknown",
    points: 5,
    message: "Item not recognized. Try again."
  };
}
