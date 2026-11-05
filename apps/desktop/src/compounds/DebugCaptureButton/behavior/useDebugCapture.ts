/* @layer renderer-components @kind hook */
import { useCallback, useState } from 'react';
import { toolsApi } from '@drizztdourden08/brock-tools/renderer';
import { FFMPEG_TOOL_ID } from '@app/ffmpeg-tool';
import { useDebugCaptureStore } from '@app/bug-report/debug-capture/useDebugCaptureStore';

const useDebugCapture = (profileId: string) => {
  const [showFfmpegPrompt, setShowFfmpegPrompt] = useState(false);

  const handleClick = useCallback(async () => {
    const store = useDebugCaptureStore.getState();
    if (store.isCapturing) {
      store.stop();
      return;
    }
    const ffmpeg = await toolsApi()?.state(FFMPEG_TOOL_ID).catch(() => null);
    if (ffmpeg?.status === 'ready') store.start(profileId);
    else setShowFfmpegPrompt(true);
  }, [profileId]);

  const resolveFfmpegPrompt = useCallback(() => {
    setShowFfmpegPrompt(false);
    useDebugCaptureStore.getState().start(profileId);
  }, [profileId]);

  return { handleClick, showFfmpegPrompt, resolveFfmpegPrompt };
};

export { useDebugCapture };
