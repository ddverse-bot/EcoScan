import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

export interface DetectionResult {
  class: string;
  score: number;
  bbox?: [number, number, number, number];
}

export interface EcoAnalysis {
  item: string;
  category: string;
  co2Impact: string;
  impactLevel: 'low' | 'medium' | 'high';
  description: string;
  ecoTip: string;
  points: number;
  confidence: number;
}

class ObjectDetectionService {
  private mobilenetModel: mobilenet.MobileNet | null = null;
  private cocoModel: cocoSsd.ObjectDetection | null = null;
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Set TensorFlow.js backend
      await tf.ready();
      console.log('TensorFlow.js backend:', tf.getBackend());

      // Load models
      console.log('Loading AI models...');
      const [mobilenetModel, cocoModel] = await Promise.all([
        mobilenet.load({ version: 2, alpha: 1.0 }),
        cocoSsd.load()
      ]);

      this.mobilenetModel = mobilenetModel;
      this.cocoModel = cocoModel;
      this.isInitialized = true;
      console.log('AI models loaded successfully');
    } catch (error) {
      console.error('Failed to initialize AI models:', error);
      throw new Error('AI initialization failed');
    }
  }

  async detectObjects(imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement): Promise<DetectionResult[]> {
    if (!this.isInitialized || !this.cocoModel) {
      throw new Error('AI models not initialized');
    }

    try {
      const predictions = await this.cocoModel.detect(imageElement);
      return predictions.map(pred => ({
        class: pred.class,
        score: pred.score,
        bbox: pred.bbox
      }));
    } catch (error) {
      console.error('Object detection failed:', error);
      return [];
    }
  }

  async classifyImage(imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement): Promise<DetectionResult[]> {
    if (!this.isInitialized || !this.mobilenetModel) {
      throw new Error('AI models not initialized');
    }

    try {
      const predictions = await this.mobilenetModel.classify(imageElement);
      return predictions.map(pred => ({
        class: pred.className,
        score: pred.probability
      }));
    } catch (error) {
      console.error('Image classification failed:', error);
      return [];
    }
  }

  async analyzeEcologicalFootprint(imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement): Promise<EcoAnalysis | null> {
    try {
      // Get both object detection and classification results
      const [objects, classifications] = await Promise.all([
        this.detectObjects(imageElement),
        this.classifyImage(imageElement)
      ]);

      // Combine results and find the best match
      const allDetections = [...objects, ...classifications];
      if (allDetections.length === 0) {
        return null;
      }

      // Sort by confidence/score
      allDetections.sort((a, b) => b.score - a.score);
      const bestDetection = allDetections[0];

      // Map detection to ecological analysis
      return this.mapToEcoAnalysis(bestDetection);
    } catch (error) {
      console.error('Ecological analysis failed:', error);
      return null;
    }
  }

  private mapToEcoAnalysis(detection: DetectionResult): EcoAnalysis {
    const className = detection.class.toLowerCase();
    
    // Food items mapping
    if (this.isFoodItem(className)) {
      return this.analyzeFoodItem(className, detection.score);
    }
    
    // Clothing items mapping
    if (this.isClothingItem(className)) {
      return this.analyzeClothingItem(className, detection.score);
    }
    
    // Plastic and waste mapping
    if (this.isPlasticWaste(className)) {
      return this.analyzePlasticWaste(className, detection.score);
    }
    
    // Appliances mapping
    if (this.isAppliance(className)) {
      return this.analyzeAppliance(className, detection.score);
    }
    
    // Transportation mapping
    if (this.isTransportation(className)) {
      return this.analyzeTransportation(className, detection.score);
    }

    // Default analysis for unrecognized items
    return this.getDefaultAnalysis(className, detection.score);
  }

  private isFoodItem(className: string): boolean {
    const foodKeywords = [
      'apple', 'banana', 'orange', 'pizza', 'hamburger', 'hot dog',
      'sandwich', 'taco', 'burrito', 'salad', 'soup', 'bread',
      'meat', 'chicken', 'beef', 'fish', 'vegetable', 'fruit'
    ];
    return foodKeywords.some(keyword => className.includes(keyword));
  }

  private isClothingItem(className: string): boolean {
    const clothingKeywords = [
      'shirt', 'pants', 'dress', 'jacket', 'coat', 'shoes',
      'hat', 'cap', 'jeans', 'sweater', 'hoodie', 'socks'
    ];
    return clothingKeywords.some(keyword => className.includes(keyword));
  }

  private isPlasticWaste(className: string): boolean {
    const plasticKeywords = [
      'bottle', 'plastic', 'cup', 'container', 'bag',
      'wrapper', 'packaging', 'straw', 'utensil'
    ];
    return plasticKeywords.some(keyword => className.includes(keyword));
  }

  private isAppliance(className: string): boolean {
    const applianceKeywords = [
      'refrigerator', 'microwave', 'oven', 'dishwasher', 'washing machine',
      'dryer', 'air conditioner', 'heater', 'fan', 'television', 'computer'
    ];
    return applianceKeywords.some(keyword => className.includes(keyword));
  }

  private isTransportation(className: string): boolean {
    const transportKeywords = [
      'car', 'truck', 'bus', 'bicycle', 'motorcycle',
      'train', 'airplane', 'boat', 'ship'
    ];
    return transportKeywords.some(keyword => className.includes(keyword));
  }

  private analyzeFoodItem(className: string, confidence: number): EcoAnalysis {
    const isPlantBased = ['apple', 'banana', 'orange', 'vegetable', 'fruit', 'salad'].some(item => className.includes(item));
    const isMeat = ['hamburger', 'hot dog', 'meat', 'chicken', 'beef'].some(item => className.includes(item));

    if (isPlantBased) {
      return {
        item: this.formatItemName(className),
        category: 'Food Items',
        co2Impact: '12-25g CO₂e',
        impactLevel: 'low',
        description: 'Plant-based food with minimal environmental impact',
        ecoTip: 'Great choice! Plant-based foods have 50% lower carbon footprint than meat',
        points: 25,
        confidence
      };
    } else if (isMeat) {
      return {
        item: this.formatItemName(className),
        category: 'Food Items',
        co2Impact: '2.5-6.1kg CO₂e',
        impactLevel: 'high',
        description: 'Meat product with significant environmental impact',
        ecoTip: 'Try plant-based alternatives to reduce your carbon footprint by 73%',
        points: 15,
        confidence
      };
    } else {
      return {
        item: this.formatItemName(className),
        category: 'Food Items',
        co2Impact: '150-400g CO₂e',
        impactLevel: 'medium',
        description: 'Processed food with moderate environmental impact',
        ecoTip: 'Choose fresh, local ingredients to reduce packaging and transport emissions',
        points: 20,
        confidence
      };
    }
  }

  private analyzeClothingItem(className: string, confidence: number): EcoAnalysis {
    return {
      item: this.formatItemName(className),
      category: 'Clothing',
      co2Impact: '2.1-8.5kg CO₂e',
      impactLevel: 'medium',
      description: 'Textile product with moderate to high environmental impact',
      ecoTip: 'Look for organic, recycled, or sustainably-made clothing options',
      points: 20,
      confidence
    };
  }

  private analyzePlasticWaste(className: string, confidence: number): EcoAnalysis {
    return {
      item: this.formatItemName(className),
      category: 'Plastic & Waste',
      co2Impact: '82-150g CO₂e',
      impactLevel: 'high',
      description: 'Single-use plastic with high environmental impact',
      ecoTip: 'Switch to reusable alternatives to eliminate single-use plastics',
      points: 15,
      confidence
    };
  }

  private analyzeAppliance(className: string, confidence: number): EcoAnalysis {
    return {
      item: this.formatItemName(className),
      category: 'Appliances',
      co2Impact: '0.5-2.5kWh daily',
      impactLevel: 'medium',
      description: 'Electronic appliance with ongoing energy consumption',
      ecoTip: 'Look for Energy Star certified models to reduce electricity usage by 30%',
      points: 20,
      confidence
    };
  }

  private analyzeTransportation(className: string, confidence: number): EcoAnalysis {
    const isEcoFriendly = ['bicycle'].some(item => className.includes(item));
    
    if (isEcoFriendly) {
      return {
        item: this.formatItemName(className),
        category: 'Transportation',
        co2Impact: '0g CO₂e',
        impactLevel: 'low',
        description: 'Zero-emission transportation method',
        ecoTip: 'Excellent choice! Cycling produces no emissions and improves health',
        points: 30,
        confidence
      };
    } else {
      return {
        item: this.formatItemName(className),
        category: 'Transportation',
        co2Impact: '120-250g CO₂e/km',
        impactLevel: 'high',
        description: 'Fossil fuel-powered vehicle with high emissions',
        ecoTip: 'Consider public transport, cycling, or electric alternatives',
        points: 10,
        confidence
      };
    }
  }

  private getDefaultAnalysis(className: string, confidence: number): EcoAnalysis {
    return {
      item: this.formatItemName(className),
      category: 'General Items',
      co2Impact: '50-200g CO₂e',
      impactLevel: 'medium',
      description: 'Consumer product with moderate environmental impact',
      ecoTip: 'Consider the lifecycle impact: production, use, and disposal',
      points: 15,
      confidence
    };
  }

  private formatItemName(className: string): string {
    return className
      .split(/[\s,]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  dispose(): void {
    if (this.mobilenetModel) {
      // MobileNet does not expose dispose()
      // Clearing reference allows GC to clean up tensors
      this.mobilenetModel = null;
         }

    if (this.cocoModel) {
      // COCO-SSD doesn't have a dispose method, but we can clear the reference
      this.cocoModel = null;
    }
    tf.disposeVariables();
  }
}

// Export singleton instance
export const objectDetectionService = new ObjectDetectionService();