/* @layer renderer-app @kind logic */
import type { ControllerReportSubmission } from '@drizztdourden08/brock-input/renderer';

const section = (title: string, text: string | undefined): string | null => (text ? `${title}\n${text}` : null);

const buildControllerReportText = (submission: ControllerReportSubmission): string => {
  const { controllerReport: report } = submission;
  return [
    submission.description,
    `Detected: ${report.detectedName} (${report.vendorId}:${report.productId})`,
    `SDL match: ${report.sdlMatch ?? 'none'}`,
    `Input API: ${report.inputApi}`,
    submission.contactEmail ? `Contact: ${submission.contactEmail}` : null,
    section('HID report', report.hidReport),
    section('Calibration map', report.calibrationMap),
    section('Positional capture', report.positionalCapture),
    section('Diagnostics report', report.diagnosticsReport),
    section('Debug info', submission.debugInfo),
  ].filter(Boolean).join('\n\n');
};

export { buildControllerReportText };
