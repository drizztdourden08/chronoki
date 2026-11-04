/* @layer renderer-components @kind component */
import { Box, Text } from '@drizztdourden08/tessera/primitives';
import { NO_SAVES_LABEL } from '../ProfileHero.constants';
import type { HeroProgressFile } from '../ProfileHero.type';
import './HeroProgress.css';

const HeroProgress = (props: { files: HeroProgressFile[] }) => {
  const { files } = props;
  return (
    <Box className="hero-progress">
      <Text className="hero__eyebrow hero-progress__eyebrow">Progress</Text>
      {files.length === 0 && <Text className="hero-progress__empty">{NO_SAVES_LABEL}</Text>}
      {files.map((file) => (
        <Box key={file.slot} className="hero-progress__row" title={`Save slot ${file.slot + 1}, save #${file.saveNumber}`}>
          <Text className="hero-progress__file">File {file.slot + 1}</Text>
          <Text className="hero-progress__lead">{file.lead}</Text>
          <Text className="hero-progress__stat">Lv {file.level}</Text>
          <Text className="hero-progress__stat">{file.playTime}</Text>
        </Box>
      ))}
    </Box>
  );
};

export { HeroProgress };
