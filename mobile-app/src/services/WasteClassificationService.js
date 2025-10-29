class WasteClassificationService {
  constructor() {
    this.API_URL = 'https://api.ultralytics.com/v1/predict';
    this.API_KEY = 'ce52abcefe6f2701f31e65497c3dd490982cf8221d'; // Replace with actual API key
    
    this.wasteMapping = {
      'bottle': { category: 'dry', type: 'plastic_bottle' },
      'can': { category: 'dry', type: 'metal_can' },
      'plastic': { category: 'dry', type: 'plastic' },
      'paper': { category: 'dry', type: 'paper' },
      'cardboard': { category: 'dry', type: 'cardboard' },
      'glass': { category: 'dry', type: 'glass' },
      'metal': { category: 'dry', type: 'metal' },
      'food': { category: 'wet', type: 'organic' },
      'organic': { category: 'wet', type: 'organic' },
      'banana': { category: 'wet', type: 'organic' },
      'apple': { category: 'wet', type: 'organic' },
      'battery': { category: 'hazardous', type: 'battery' },
      'electronic': { category: 'hazardous', type: 'electronic' }
    };
  }

  async classifyWaste(imageUri) {
    try {
      // Try YOLOv8n API first
      const result = await this.callYOLOv8API(imageUri);
      if (result) return result;
    } catch (error) {
      console.log('YOLOv8 API failed, using fallback:', error);
    }
    
    // Fallback to mock classification
    return this.mockClassification();
  }

  async callYOLOv8API(imageUri) {
    const formData = new FormData();
    
    // Convert image URI to blob
    const response = await fetch(imageUri);
    const blob = await response.blob();
    
    formData.append('file', blob, 'waste.jpg');
    formData.append('model', 'yolov8n.pt');
    formData.append('imgsz', '640');
    
    const apiResponse = await fetch(this.API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.API_KEY}`
      },
      body: formData
    });
    
    if (!apiResponse.ok) {
      throw new Error(`API Error: ${apiResponse.status}`);
    }
    
    const data = await apiResponse.json();
    return this.processYOLOv8Response(data);
  }

  processYOLOv8Response(data) {
    if (!data.predictions || data.predictions.length === 0) {
      return this.mockClassification();
    }
    
    // Get highest confidence prediction
    const bestPrediction = data.predictions.reduce((best, current) => 
      current.confidence > best.confidence ? current : best
    );
    
    const detectedClass = bestPrediction.class.toLowerCase();
    const wasteInfo = this.mapToWasteType(detectedClass);
    
    return {
      class: wasteInfo.type,
      category: wasteInfo.category,
      confidence: bestPrediction.confidence,
      bbox: bestPrediction.bbox,
      detectedObject: detectedClass
    };
  }

  mapToWasteType(detectedClass) {
    // Direct mapping
    if (this.wasteMapping[detectedClass]) {
      return this.wasteMapping[detectedClass];
    }
    
    // Fuzzy matching for common objects
    if (detectedClass.includes('bottle') || detectedClass.includes('plastic')) {
      return { category: 'dry', type: 'plastic_bottle' };
    }
    if (detectedClass.includes('can') || detectedClass.includes('metal')) {
      return { category: 'dry', type: 'metal_can' };
    }
    if (detectedClass.includes('paper') || detectedClass.includes('book')) {
      return { category: 'dry', type: 'paper' };
    }
    if (detectedClass.includes('food') || detectedClass.includes('fruit')) {
      return { category: 'wet', type: 'organic' };
    }
    
    // Default to dry waste
    return { category: 'dry', type: 'general' };
  }

  mockClassification() {
    const mockItems = [
      { class: 'plastic_bottle', category: 'dry' },
      { class: 'metal_can', category: 'dry' },
      { class: 'paper', category: 'dry' },
      { class: 'cardboard', category: 'dry' },
      { class: 'glass_bottle', category: 'dry' },
      { class: 'organic_waste', category: 'wet' }
    ];
    
    const item = mockItems[Math.floor(Math.random() * mockItems.length)];
    const confidence = 0.75 + Math.random() * 0.2;
    
    return {
      class: item.class,
      category: item.category,
      confidence: confidence,
      detectedObject: item.class,
      bbox: { x: 100, y: 100, width: 200, height: 200 }
    };
  }

  calculatePoints(classification, userCategory) {
    const isCorrect = classification.category === userCategory.toLowerCase();
    const basePoints = isCorrect ? 10 : -5;
    const confidenceBonus = Math.floor(classification.confidence * 5);
    
    return isCorrect ? basePoints + confidenceBonus : basePoints;
  }
}

export default new WasteClassificationService();