/**
 * Moon Phase Calendar System for 2025
 * Uses astronomical lunar cycle: 29.53059 days
 */

interface MoonPhaseData {
  date: Date;
  phase: number; // 0-1, where 0 = new moon, 0.5 = full moon
  illumination: number; // 0-100 percentage
  phaseName: string;
  angleFromNorth: number; // Position on radial timeline (0-360 degrees)
}

// Reference new moon: January 29, 2025 (known astronomical date)
const REFERENCE_NEW_MOON = new Date('2025-01-29T12:36:00Z');
const LUNAR_CYCLE_DAYS = 29.53059;

// Moon phase names
const PHASE_NAMES = {
  0: 'New Moon',
  0.125: 'Waxing Crescent',
  0.25: 'First Quarter',
  0.375: 'Waxing Gibbous',
  0.5: 'Full Moon',
  0.625: 'Waning Gibbous',
  0.75: 'Last Quarter',
  0.875: 'Waning Crescent'
};

/**
 * Calculate moon phase for any given date
 */
export function calculateMoonPhase(date: Date): MoonPhaseData {
  // Calculate days since reference new moon
  const daysSinceReference = (date.getTime() - REFERENCE_NEW_MOON.getTime()) / (1000 * 60 * 60 * 24);
  
  // Calculate lunar cycles elapsed
  const cyclesElapsed = daysSinceReference / LUNAR_CYCLE_DAYS;
  
  // Get fractional part (position within current cycle)
  const phasePosition = cyclesElapsed - Math.floor(cyclesElapsed);
  
  // Ensure positive value
  const normalizedPhase = phasePosition < 0 ? phasePosition + 1 : phasePosition;
  
  // Calculate illumination percentage
  const illumination = Math.round(50 * (1 + Math.cos(normalizedPhase * 2 * Math.PI)));
  
  // Get closest phase name
  const phaseName = getClosestPhaseName(normalizedPhase);
  
  // Calculate position on radial timeline (based on day of year)
  const dayOfYear = getDayOfYear(date);
  const angleFromNorth = (dayOfYear / 365) * 360;
  
  return {
    date,
    phase: normalizedPhase,
    illumination,
    phaseName,
    angleFromNorth
  };
}

/**
 * Get closest phase name for a given phase value
 */
function getClosestPhaseName(phase: number): string {
  const phaseKeys = Object.keys(PHASE_NAMES).map(Number).sort((a, b) => a - b);
  
  let closestPhase = phaseKeys[0];
  let minDistance = Math.abs(phase - closestPhase);
  
  for (const phaseKey of phaseKeys) {
    const distance = Math.min(
      Math.abs(phase - phaseKey),
      Math.abs(phase - phaseKey + 1),
      Math.abs(phase - phaseKey - 1)
    );
    
    if (distance < minDistance) {
      minDistance = distance;
      closestPhase = phaseKey;
    }
  }
  
  return PHASE_NAMES[closestPhase as keyof typeof PHASE_NAMES];
}

/**
 * Get day of year (1-365)
 */
function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/**
 * Generate moon phase data for entire year 2025
 */
export function generateMoonCalendar2025(): MoonPhaseData[] {
  const calendar: MoonPhaseData[] = [];
  const year = 2025;
  
  // Generate data for each day of 2025
  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const moonData = calculateMoonPhase(date);
      calendar.push(moonData);
    }
  }
  
  return calendar;
}

/**
 * Get moon phase for current date (July 11, 2025)
 */
export function getCurrentMoonPhase(): MoonPhaseData {
  return calculateMoonPhase(new Date());
}

/**
 * Get moon phases for a specific month
 */
export function getMoonPhasesForMonth(year: number, month: number): MoonPhaseData[] {
  const phases: MoonPhaseData[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    phases.push(calculateMoonPhase(date));
  }
  
  return phases;
}

/**
 * Find major moon phases (new, first quarter, full, last quarter) for a month
 */
export function getMajorMoonPhases(year: number, month: number): MoonPhaseData[] {
  const allPhases = getMoonPhasesForMonth(year, month);
  const majorPhases: MoonPhaseData[] = [];
  
  // Look for transitions near major phase points
  const targetPhases = [0, 0.25, 0.5, 0.75];
  
  for (const target of targetPhases) {
    let closest = allPhases[0];
    let minDistance = Math.abs(closest.phase - target);
    
    for (const phase of allPhases) {
      const distance = Math.min(
        Math.abs(phase.phase - target),
        Math.abs(phase.phase - target + 1),
        Math.abs(phase.phase - target - 1)
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        closest = phase;
      }
    }
    
    if (minDistance < 0.05) { // Within 5% of major phase
      majorPhases.push(closest);
    }
  }
  
  return majorPhases;
}