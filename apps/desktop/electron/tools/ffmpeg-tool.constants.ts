/* @layer electron-main @kind constants */
const FFMPEG_VERSION = '9.0';

const FFMPEG_RELEASE_TAG = 'latest';

const FFMPEG_WINDOWS_ASSET = 'ffmpeg-n9.0-latest-win64-lgpl-9.0.zip';

const FFMPEG_RELEASE_API = 'https://api.github.com/repos/BtbN/FFmpeg-Builds/releases/tags';

const SHA256_PREFIX = 'sha256:';

const FFMPEG_LINUX_HINT = 'No ffmpeg on PATH. Install the "ffmpeg" package with your package manager, then reopen this dialog.';

const FFMPEG_OTHER_HINT = 'ffmpeg is not available on this platform.';

export {
  FFMPEG_LINUX_HINT, FFMPEG_OTHER_HINT, FFMPEG_RELEASE_API, FFMPEG_RELEASE_TAG, FFMPEG_VERSION,
  FFMPEG_WINDOWS_ASSET, SHA256_PREFIX,
};
