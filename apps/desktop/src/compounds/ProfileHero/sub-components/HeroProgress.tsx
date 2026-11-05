/* @layer renderer-components @kind component */
import { Box, Text } from '@drizztdourden08/tessera/primitives';
import { NO_SAVES_LABEL } from '../ProfileHero.constants';
import type { HeroProgressProps } from '../ProfileHero.type';
import { HeroChecksLine } from './HeroChecksLine';
import './HeroProgress.css';

const HeroProgress = ({ files, checks }: HeroProgressProps) => {
  return (
    <Box className="hero-progress">
      <Box className="hero-progress__head">
        <Text className="hero__eyebrow hero-progress__eyebrow">Progress</Text>
        <Box className="hero-progress__legend" aria-hidden="true">
          <Text as="span" className="hero-progress__key hero-progress__key--taken">Taken</Text>
          <Text as="span" className="hero-progress__key hero-progress__key--available">Available</Text>
          <Text as="span" className="hero-progress__key">Left</Text>
        </Box>
      </Box>
      {checks && <HeroChecksLine checks={checks} label="Checks" />}
      {files.length === 0 && <Text className="hero-progress__empty">{NO_SAVES_LABEL}</Text>}
      {files.map((file) => (
        <Box key={file.slot} className="hero-progress__row" title={`Save slot ${file.slot + 1}, save #${file.saveNumber}`}>
          <Text className="hero-progress__file">File {file.slot + 1}</Text>
          <Text className="hero-progress__lead">{file.lead}</Text>
          <Text className="hero-progress__stat">Lv {file.level}</Text>
          <Text className="hero-progress__stat">{file.playTime}</Text>
          {file.checks && <HeroChecksLine checks={file.checks} label={`File ${file.slot + 1}`} />}
        </Box>
      ))}
    </Box>
  );
};

export { HeroProgress };
