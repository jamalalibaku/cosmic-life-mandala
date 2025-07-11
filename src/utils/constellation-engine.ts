interface SliceMatch {
  sliceId1: string;
  sliceId2: string;
  correlationScore: number;
  dataContext: string;
  narrativeLabel: string;
  layerType: string;
  timeDifference: number; // days apart
}

interface ConstellationConfig {
  dataLayer?: 'mood' | 'sleep' | 'mobility' | 'all';
  matchThreshold?: number;
  compareAcross?: 'weeks' | 'months' | 'all';
  maxDistance?: number; // max days apart to consider
}

export function findRecurringSlices(
  timeSlices: any[],
  config: ConstellationConfig = {}
): SliceMatch[] {
  const {
    dataLayer = 'all',
    matchThreshold = 0.8,
    compareAcross = 'all',
    maxDistance = 365
  } = config;

  const matches: SliceMatch[] = [];
  
  // Filter slices based on time range
  const filteredSlices = filterSlicesByTimeRange(timeSlices, compareAcross);
  
  for (let i = 0; i < filteredSlices.length; i++) {
    for (let j = i + 1; j < filteredSlices.length; j++) {
      const slice1 = filteredSlices[i];
      const slice2 = filteredSlices[j];
      
      const timeDiff = Math.abs(
        new Date(slice2.timestamp).getTime() - new Date(slice1.timestamp).getTime()
      ) / (1000 * 60 * 60 * 24);
      
      if (timeDiff > maxDistance) continue;
      
      const match = compareSlices(slice1, slice2, dataLayer, matchThreshold);
      if (match) {
        matches.push({
          sliceId1: slice1.id,
          sliceId2: slice2.id,
          correlationScore: match.correlationScore || 0,
          dataContext: match.dataContext || '',
          narrativeLabel: match.narrativeLabel || '',
          layerType: match.layerType || 'all',
          timeDifference: timeDiff
        });
      }
    }
  }
  
  return matches.sort((a, b) => b.correlationScore - a.correlationScore);
}

function filterSlicesByTimeRange(slices: any[], range: string): any[] {
  const now = new Date();
  const cutoff = new Date();
  
  switch (range) {
    case 'weeks':
      cutoff.setDate(now.getDate() - 28); // 4 weeks
      break;
    case 'months':
      cutoff.setMonth(now.getMonth() - 6); // 6 months
      break;
    default:
      cutoff.setFullYear(now.getFullYear() - 2); // 2 years
  }
  
  return slices.filter(slice => new Date(slice.timestamp) >= cutoff);
}

function compareSlices(
  slice1: any,
  slice2: any,
  targetLayer: string,
  threshold: number
): Partial<SliceMatch> | null {
  const comparisons: Array<{ layer: string; score: number; context: string; label: string }> = [];
  
  // Mood comparison
  if (targetLayer === 'all' || targetLayer === 'mood') {
    const moodScore = compareMoodData(slice1.mood, slice2.mood);
    if (moodScore >= threshold) {
      comparisons.push({
        layer: 'mood',
        score: moodScore,
        context: `Similar emotional tone (${moodScore.toFixed(2)})`,
        label: generateMoodLabel(slice1.mood, slice2.mood)
      });
    }
  }
  
  // Sleep comparison
  if (targetLayer === 'all' || targetLayer === 'sleep') {
    const sleepScore = compareSleepData(slice1.sleep, slice2.sleep);
    if (sleepScore >= threshold) {
      comparisons.push({
        layer: 'sleep',
        score: sleepScore,
        context: `Matching sleep pattern (${sleepScore.toFixed(2)})`,
        label: generateSleepLabel(slice1.sleep, slice2.sleep)
      });
    }
  }
  
  // Mobility comparison
  if (targetLayer === 'all' || targetLayer === 'mobility') {
    const mobilityScore = compareMobilityData(slice1.mobility, slice2.mobility);
    if (mobilityScore >= threshold) {
      comparisons.push({
        layer: 'mobility',
        score: mobilityScore,
        context: `Similar movement rhythm (${mobilityScore.toFixed(2)})`,
        label: generateMobilityLabel(slice1.mobility, slice2.mobility)
      });
    }
  }
  
  if (comparisons.length === 0) return null;
  
  // Return the strongest match
  const bestMatch = comparisons.reduce((best, current) => 
    current.score > best.score ? current : best
  );
  
  return {
    correlationScore: bestMatch.score,
    dataContext: bestMatch.context,
    narrativeLabel: bestMatch.label,
    layerType: bestMatch.layer
  };
}

function compareMoodData(mood1: any, mood2: any): number {
  if (!mood1 || !mood2) return 0;
  
  const valenceDiff = Math.abs((mood1.valence || 0) - (mood2.valence || 0));
  const energyDiff = Math.abs((mood1.energy || 0) - (mood2.energy || 0));
  
  // Similar mood if both valence and energy are close
  const similarity = 1 - Math.max(valenceDiff, energyDiff);
  return Math.max(0, similarity);
}

function compareSleepData(sleep1: any, sleep2: any): number {
  if (!sleep1 || !sleep2) return 0;
  
  const qualityDiff = Math.abs((sleep1.quality || 0) - (sleep2.quality || 0));
  const durationDiff = Math.abs((sleep1.duration || 0) - (sleep2.duration || 0)) / 12; // normalize to 0-1
  
  const similarity = 1 - Math.max(qualityDiff, Math.min(durationDiff, 1));
  return Math.max(0, similarity);
}

function compareMobilityData(mobility1: any, mobility2: any): number {
  if (!mobility1 || !mobility2) return 0;
  
  const intensityDiff = Math.abs((mobility1.intensity || 0) - (mobility2.intensity || 0));
  const durationDiff = Math.abs((mobility1.duration || 0) - (mobility2.duration || 0)) / 10; // normalize
  
  const similarity = 1 - Math.max(intensityDiff, Math.min(durationDiff, 1));
  return Math.max(0, similarity);
}

function generateMoodLabel(mood1: any, mood2: any): string {
  const avgValence = ((mood1?.valence || 0) + (mood2?.valence || 0)) / 2;
  const avgEnergy = ((mood1?.energy || 0) + (mood2?.energy || 0)) / 2;
  
  if (avgValence > 0.7 && avgEnergy > 0.7) return "Moments of bright energy";
  if (avgValence > 0.7 && avgEnergy < 0.3) return "Peaceful contentment";
  if (avgValence < 0.3 && avgEnergy < 0.3) return "Quiet reflection";
  if (avgValence < 0.3 && avgEnergy > 0.7) return "Restless periods";
  return "Emotional echoes";
}

function generateSleepLabel(sleep1: any, sleep2: any): string {
  const avgQuality = ((sleep1?.quality || 0) + (sleep2?.quality || 0)) / 2;
  const avgDuration = ((sleep1?.duration || 0) + (sleep2?.duration || 0)) / 2;
  
  if (avgQuality > 0.8) return "Deep rest patterns";
  if (avgQuality < 0.3) return "Restless nights";
  if (avgDuration > 9) return "Extended sleep cycles";
  if (avgDuration < 6) return "Brief rest periods";
  return "Sleep rhythms";
}

function generateMobilityLabel(mobility1: any, mobility2: any): string {
  const avgIntensity = ((mobility1?.intensity || 0) + (mobility2?.intensity || 0)) / 2;
  
  if (avgIntensity > 0.8) return "High energy movement";
  if (avgIntensity < 0.3) return "Gentle flow";
  return "Movement patterns";
}

export function getConstellationColors(): Record<string, string> {
  return {
    mood: 'hsl(var(--violet-500))',
    sleep: 'hsl(var(--indigo-500))',
    mobility: 'hsl(var(--emerald-500))',
    all: 'hsl(var(--primary))'
  };
}