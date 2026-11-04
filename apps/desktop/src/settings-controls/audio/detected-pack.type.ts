/* @layer renderer-app @kind types */
interface DetectedPack {
  name: string;
  format: string;
  trackCount: number;
  loopCount: number;
}

interface DetectedPackSummaryProps {
  pack: DetectedPack | null;
  onOpenProfiles: () => void;
}

export type { DetectedPack, DetectedPackSummaryProps };
