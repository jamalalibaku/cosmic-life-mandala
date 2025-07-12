/**
 * (c) 2025 Cosmic Life Mandala – Mark This Moment Feature
 * Capture canvas snapshots for life's visual peaks and emotional pulses
 */

export interface MomentSnapshot {
  id: string;
  timestamp: Date;
  imageData: string; // base64 encoded
  title: string;
  reflection?: string;
  emotionalState?: {
    mood: string;
    energy: number;
    valence: number;
  };
  contextData?: {
    zoomLevel: string;
    activeDate: Date;
    visibleLayers: string[];
  };
}

export class CaptureCanvasSnapshot {
  private static instances: MomentSnapshot[] = [];
  
  /**
   * Capture the current mandala state as a high-resolution snapshot
   */
  static async captureCurrentMoment(
    svgElement: SVGElement,
    options: {
      title?: string;
      reflection?: string;
      emotionalState?: MomentSnapshot['emotionalState'];
      contextData?: MomentSnapshot['contextData'];
    } = {}
  ): Promise<MomentSnapshot> {
    const timestamp = new Date();
    const id = `moment-${timestamp.getTime()}`;
    
    try {
      // Convert SVG to high-resolution image
      const imageData = await this.svgToHighResImage(svgElement);
      
      const snapshot: MomentSnapshot = {
        id,
        timestamp,
        imageData,
        title: options.title || `Moment captured at ${timestamp.toLocaleTimeString()}`,
        reflection: options.reflection,
        emotionalState: options.emotionalState,
        contextData: options.contextData
      };
      
      // Store in memory (later can be persisted)
      this.instances.push(snapshot);
      
      // Trigger storage event for other components
      window.dispatchEvent(new CustomEvent('momentCaptured', { 
        detail: snapshot 
      }));
      
      return snapshot;
    } catch (error) {
      console.error('Failed to capture moment:', error);
      throw new Error('Could not capture this moment');
    }
  }
  
  /**
   * Convert SVG element to high-resolution base64 image
   */
  private static async svgToHighResImage(
    svgElement: SVGElement,
    scale: number = 2
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        // Get SVG dimensions
        const svgRect = svgElement.getBoundingClientRect();
        const width = svgRect.width * scale;
        const height = svgRect.height * scale;
        
        // Clone SVG for high-res rendering
        const svgClone = svgElement.cloneNode(true) as SVGElement;
        svgClone.setAttribute('width', width.toString());
        svgClone.setAttribute('height', height.toString());
        
        // Create canvas for rendering
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not create canvas context'));
          return;
        }
        
        // Set high-quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Convert SVG to data URL
        const svgData = new XMLSerializer().serializeToString(svgClone);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        
        // Load and draw image
        const img = new Image();
        img.onload = () => {
          // Fill background with cosmic gradient
          const gradient = ctx.createRadialGradient(
            width / 2, height / 2, 0,
            width / 2, height / 2, Math.max(width, height) / 2
          );
          gradient.addColorStop(0, 'rgba(15, 23, 42, 0.95)');
          gradient.addColorStop(1, 'rgba(2, 6, 23, 1)');
          
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, width, height);
          
          // Draw SVG
          ctx.drawImage(img, 0, 0);
          
          // Add timestamp watermark
          ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.font = `${12 * scale}px monospace`;
          ctx.fillText(
            new Date().toLocaleString(),
            10 * scale,
            height - (10 * scale)
          );
          
          // Convert to base64
          const imageData = canvas.toDataURL('image/png', 0.95);
          URL.revokeObjectURL(url);
          resolve(imageData);
        };
        
        img.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error('Failed to load SVG image'));
        };
        
        img.src = url;
      } catch (error) {
        reject(error);
      }
    });
  }
  
  /**
   * Get all captured moments
   */
  static getAllMoments(): MomentSnapshot[] {
    return [...this.instances];
  }
  
  /**
   * Get moments from a specific date range
   */
  static getMomentsInRange(startDate: Date, endDate: Date): MomentSnapshot[] {
    return this.instances.filter(moment => 
      moment.timestamp >= startDate && moment.timestamp <= endDate
    );
  }
  
  /**
   * Delete a captured moment
   */
  static deleteMoment(id: string): boolean {
    const index = this.instances.findIndex(moment => moment.id === id);
    if (index !== -1) {
      this.instances.splice(index, 1);
      return true;
    }
    return false;
  }
  
  /**
   * Export moment as downloadable file
   */
  static downloadMoment(snapshot: MomentSnapshot): void {
    const link = document.createElement('a');
    link.href = snapshot.imageData;
    link.download = `cosmic-moment-${snapshot.timestamp.toISOString().slice(0, 10)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  /**
   * Create a poetic title based on current context
   */
  static generatePoeticTitle(contextData?: MomentSnapshot['contextData']): string {
    const timeOfDay = new Date().getHours();
    const season = this.getCurrentSeason();
    
    const templates = [
      `${season} whispers at ${this.getTimePoetry(timeOfDay)}`,
      `Cosmic dance captured in ${contextData?.zoomLevel || 'time'}`,
      `Life's rhythm frozen in light`,
      `A moment's constellation`,
      `${this.getTimePoetry(timeOfDay)} meditation`,
      `Sacred geometry of now`
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
  }
  
  private static getCurrentSeason(): string {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'Spring';
    if (month >= 5 && month <= 7) return 'Summer';
    if (month >= 8 && month <= 10) return 'Autumn';
    return 'Winter';
  }
  
  private static getTimePoetry(hour: number): string {
    if (hour >= 5 && hour < 9) return 'dawn';
    if (hour >= 9 && hour < 12) return 'morning light';
    if (hour >= 12 && hour < 17) return 'golden afternoon';
    if (hour >= 17 && hour < 21) return 'twilight';
    return 'midnight stars';
  }
}