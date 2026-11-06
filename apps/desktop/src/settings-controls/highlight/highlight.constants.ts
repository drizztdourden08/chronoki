/* @layer renderer-app @kind constants */
const HIGHLIGHT_KEYS = ['hudHighlightPrimary', 'hudHighlightSecondary'] as const;

const DEFAULT_HIGHLIGHTS = {
  hudHighlightPrimary: '#e8a33d',
  hudHighlightSecondary: '#7fb861',
} as const;

export { DEFAULT_HIGHLIGHTS, HIGHLIGHT_KEYS };
