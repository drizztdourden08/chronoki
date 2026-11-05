/* @layer renderer-components @kind component */
import { Box, Status, Text, formatDate } from '@drizztdourden08/tessera/primitives';
import { formatBytes } from '@drizztdourden08/brock-core';
import { ROMS_TEXT, VERDICT_LABEL, VERDICT_TONE } from '../Roms.constants';
import { AssetsRow } from './AssetsRow';
import type { RomDetailProps } from './RomDetail.type';
import './RomDetail.css';

const RomDetail = ({ rom, detail, loading, busy, status, onRebuild }: RomDetailProps) => {
  if (loading) return <Text>{ROMS_TEXT.loading}</Text>;
  if (!detail) return <Text>{ROMS_TEXT.noInfo}</Text>;
  return (
    <Box>
      <Text as="h3" className="detail-panel__title">{detail.name}</Text>
      <Box className="detail-panel__grid">
        <Text className="detail-panel__label">{ROMS_TEXT.rowCheck}</Text>
        <Text className="detail-panel__value"><Status tone={VERDICT_TONE[detail.verdict]}>{VERDICT_LABEL[detail.verdict]}</Status></Text>

        {detail.identity && <Text className="detail-panel__label">{ROMS_TEXT.rowGame}</Text>}
        {detail.identity && <Text className="detail-panel__value">{detail.identity}</Text>}

        <Text className="detail-panel__label">{ROMS_TEXT.rowSize}</Text>
        <Text className="detail-panel__value">{detail.size === null ? '-' : formatBytes(detail.size)}</Text>

        <Text className="detail-panel__label">{ROMS_TEXT.rowHash}</Text>
        <Text className="detail-panel__value" mono>{detail.hash}</Text>

        <Text className="detail-panel__label">{ROMS_TEXT.rowAdded}</Text>
        <Text className="detail-panel__value">{detail.created ? formatDate(detail.created, 'date') : '-'}</Text>

        <Text className="detail-panel__label">{ROMS_TEXT.rowModified}</Text>
        <Text className="detail-panel__value">{detail.modified ? formatDate(detail.modified, 'date') : '-'}</Text>

        <Text className="detail-panel__label">{ROMS_TEXT.rowAssets}</Text>
        <Box className="detail-panel__value">
          <AssetsRow rom={rom} busy={busy} refused={detail.verdict === 'refused'} onRebuild={onRebuild} />
        </Box>
      </Box>
      {status && <Text>{status.message}</Text>}
    </Box>
  );
};

export { RomDetail };
