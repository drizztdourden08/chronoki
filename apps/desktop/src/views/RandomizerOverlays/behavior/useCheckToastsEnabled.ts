/* @layer renderer-components @kind hook */
import { useWidgetLayoutStore, useWidgetPref } from '@drizztdourden08/brock-react';
import { isWidgetOpen } from '@drizztdourden08/tessera/composites';
import {
  CHECKS_PREF_KEY, CHECKS_WIDGET_ID, NOTIFY_PREF, NOTIFY_WHEN_CLOSED_PREF,
} from '@app/game/randomizer/checks-widget/checks-notify.constants';

const useCheckToastsEnabled = (): boolean => {
  const [notify] = useWidgetPref<boolean>(CHECKS_PREF_KEY, NOTIFY_PREF, true);
  const [notifyWhenClosed] = useWidgetPref<boolean>(CHECKS_PREF_KEY, NOTIFY_WHEN_CLOSED_PREF, true);
  const trackerOpen = useWidgetLayoutStore((state) => isWidgetOpen(state.layout, CHECKS_WIDGET_ID));
  return notify && (trackerOpen || notifyWhenClosed);
};

export { useCheckToastsEnabled };
