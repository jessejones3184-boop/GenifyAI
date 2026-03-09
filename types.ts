
export interface AnalysisResult {
  isAI: boolean; // True if counterfeit/fake
  confidence: number;
  detections: {
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
  }[];
  verdict: string;
  forensicReport: string;
}

export enum DetectionMethod {
  PIXEL_CONSISTENCY = 'Pixel Consistency',
  GEOMETRIC_FORENSICS = 'Geometric Forensics',
  SYNTH_ID = 'SynthID Recognition',
  HALLUCINATION_CHECK = 'Hallucination Engine',
  STITCHING_ANALYSIS = 'Stitching Analysis'
}
