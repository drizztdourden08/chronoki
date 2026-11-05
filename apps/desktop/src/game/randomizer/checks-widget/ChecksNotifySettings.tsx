/* @layer renderer-components @kind component */
import { Toggle } from '@drizztdourden08/tessera/primitives';
import { ControlMenuRow } from '@drizztdourden08/tessera/composites';
import { useWidgetPref } from '@drizztdourden08/brock-react';
import {
  CHECKS_PREF_KEY, NOTIFY_HINT, NOTIFY_PREF, NOTIFY_WHEN_CLOSED_HINT, NOTIFY_WHEN_CLOSED_PREF,
} from './checks-notify.constants';

const ChecksNotifySettings = () => {
  const [notify, setNotify] = useWidgetPref<boolean>(CHECKS_PREF_KEY, NOTIFY_PREF, true);
  const [notifyWhenClosed, setNotifyWhenClosed] = useWidgetPref<boolean>(CHECKS_PREF_KEY, NOTIFY_WHEN_CLOSED_PREF, true);

  return (
    <>
      <ControlMenuRow label="Notifications" hint={NOTIFY_HINT}>
        <Toggle checked={notify} onChange={setNotify} />
      </ControlMenuRow>
      <ControlMenuRow label="While closed" hint={NOTIFY_WHEN_CLOSED_HINT}>
        <Toggle checked={notifyWhenClosed} onChange={setNotifyWhenClosed} disabled={!notify} />
      </ControlMenuRow>
    </>
  );
};

export { ChecksNotifySettings };
