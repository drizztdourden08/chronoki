/* @layer renderer-app @kind entry */
import '@drizztdourden08/tessera/tokens.css';
import '../.brock/palette.css';
import './theme.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrockApp } from '@drizztdourden08/brock-react';
import { rendererModules } from '../.brock/modules.renderer';
import { rendererBootTasks } from '../.brock/boot.renderer';
import { screenTree } from '../.brock/screens';
import { withOwnRowTabs } from './settings-controls/own-row-tabs';
import { appWidgetLayout, appWidgets } from '../.brock/widgets';
import { appWidgetKits } from '../.brock/widget-kits';
import { appReview } from '../.brock/review';
import { appTitleBar } from '../.brock/title-bar';
import { appStartupPrompts } from '../.brock/startup';
import { appTours } from '../.brock/tours';
import { appToolbars } from '../.brock/toolbars';
import { chronokiProfileHooks } from './profiles/chronoki-profile-hooks';
import { chronokiBugReport } from './bug-report/chronoki-bug-report';
import { chronokiShellModule } from './shell/chronoki-shell-module';
import { DEVELOPER_TOOLS, SETTINGS, VOLUME } from './main.constants';
import { LEGAL_TEXT } from './legal.constants';
import { CHRONOKI_DATA_DOMAINS } from './storage/data-domains.constants';
import { APP_PROFILE_MODES } from './profile-modes';
import { product } from './product';
import { useWidgetDisabled } from './widget-gates/useWidgetDisabled';
import type { AppSettings } from './settings.type';

const ownRowTree = withOwnRowTabs(screenTree);

const root = document.getElementById('root');
if (!root) throw new Error('index.html has no #root element');

createRoot(root).render(
  <StrictMode>
    <BrockApp<AppSettings>
      product={product}
      legalText={LEGAL_TEXT}
      settings={SETTINGS}
      restoreNavigation={false}
      volume={VOLUME}
      developerTools={DEVELOPER_TOOLS}
      dataDomains={CHRONOKI_DATA_DOMAINS}
      bugReport={chronokiBugReport}
      screenTree={ownRowTree}
      modules={[...rendererModules, chronokiShellModule]}
      bootTasks={rendererBootTasks}
      widgets={appWidgets}
      widgetLayout={appWidgetLayout}
      widgetKits={appWidgetKits}
      widgetDisabled={useWidgetDisabled}
      review={appReview}
      titleBar={appTitleBar}
      tours={appTours}
      startupPrompts={appStartupPrompts}
      toolbars={appToolbars}
      profileHooks={chronokiProfileHooks}
      profileModes={APP_PROFILE_MODES}
    />
  </StrictMode>,
);
