/* @layer renderer-widgets @kind hook */
import { useState } from 'react';

const useWriteNotice = (): { refused: boolean; settle: (applied: boolean) => void } => {
  const [refused, setRefused] = useState(false);
  return { refused, settle: (applied) => setRefused(!applied) };
};

export { useWriteNotice };
