/* @layer renderer-components @kind component */
import { useRef } from 'react';
import { Box, Image } from '@drizztdourden08/tessera/primitives';
import { usePendulumScale } from './behavior/usePendulumScale';
import type { TitlePendulumProps } from './TitlePendulum.type';
import './TitlePendulum.css';

const TitlePendulum = (props: TitlePendulumProps) => {
  const { src, width, height, onError } = props;
  const frameRef = useRef<HTMLElement | null>(null);
  const scale = usePendulumScale(frameRef, height);

  return (
    <Box ref={frameRef} className="title-pendulum" aria-hidden="true">
      <Box className="title-pendulum__arm">
        <Image
          className="title-pendulum__bob"
          src={src}
          alt=""
          width={width * scale}
          height={height * scale}
          pixelated
          placeholder="none"
          onError={onError}
        />
      </Box>
    </Box>
  );
};

export { TitlePendulum };
