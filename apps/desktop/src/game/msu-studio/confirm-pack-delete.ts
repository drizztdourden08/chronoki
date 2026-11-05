/* @layer bridge-wasm @kind logic */
import { confirmAction } from '@drizztdourden08/brock-react';

const confirmPackDelete = (title: string, message: string, onConfirm: () => void): void => {
  void confirmAction({ title, message, confirmLabel: 'Delete', variant: 'danger' }).then((confirmed) => {
    if (confirmed) onConfirm();
  });
};

export { confirmPackDelete };
