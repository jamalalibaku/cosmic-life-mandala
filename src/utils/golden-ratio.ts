// Golden ratio calculations for harmonic design
export const PHI = 1.618033988749;

export const goldenRatio = {
  // Calculate golden ratio proportions
  smaller: (value: number) => value / PHI,
  larger: (value: number) => value * PHI,
  
  // Create a sequence of golden ratio values
  sequence: (base: number, count: number) => {
    const sequence = [base];
    for (let i = 1; i < count; i++) {
      sequence.push(sequence[i - 1] * PHI);
    }
    return sequence;
  },
  
  // Calculate ring radii using golden ratio
  ringRadii: (innerRadius: number, ringCount: number) => {
    const ratios = [];
    for (let i = 0; i < ringCount; i++) {
      ratios.push(innerRadius * Math.pow(PHI, i * 0.5));
    }
    return ratios;
  },
  
  // Convert time to angle (0-360 degrees)
  timeToAngle: (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    // 0 degrees = 12:00 (top), rotating clockwise
    return ((totalMinutes / (24 * 60)) * 360 - 90) % 360;
  },
  
  // Convert angle to radians
  toRadians: (degrees: number) => (degrees * Math.PI) / 180,
  
  // Create smooth curves using golden ratio
  breathingScale: (time: number, period: number = 4000) => {
    return 1 + Math.sin(time * (2 * Math.PI) / period) * 0.1 / PHI;
  }
};