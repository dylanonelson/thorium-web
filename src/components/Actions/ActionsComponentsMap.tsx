"use client";

import { ThActionsKeys } from "@/preferences";
import { StatefulActionContainerProps, StatefulActionsMapObject } from "./models/actions";
import { StatefulSwitchFullscreen } from "./StatefulSwitchFullscreen";
import { StatefulLayoutStrategyContainer, StatefulLayoutStrategyTrigger } from "./StatefulLayoutStrategy";
import { StatefulSettingsContainer, StatefulSettingsTrigger } from "./StatefulSettings";
import { StatefulTocContainer, StatefulTocTrigger } from "./StatefulToc";
import { settingsComponentsMap } from "../Settings/SettingsComponentsMap";

export const fullscreenMapping = {
  [ThActionsKeys.fullscreen]: {
    trigger: StatefulSwitchFullscreen
  }
};

export const layoutStrategyMapping = {
  [ThActionsKeys.layoutStrategy]: {
    trigger: StatefulLayoutStrategyTrigger,
    target: StatefulLayoutStrategyContainer
  }
};

export const settingsMapping = {
  [ThActionsKeys.settings]: {
    trigger: StatefulSettingsTrigger,
    target: (props: StatefulActionContainerProps) => <StatefulSettingsContainer {...props} componentsMap={settingsComponentsMap} />
  }
};

export const tocMapping = {
  [ThActionsKeys.toc]: {
    trigger: StatefulTocTrigger,
    target: StatefulTocContainer
  }
};

// Combine maps as needed
export const actionsComponentsMap: Record<ThActionsKeys, StatefulActionsMapObject> = {
  ...fullscreenMapping,
  ...layoutStrategyMapping,
  ...settingsMapping,
  ...tocMapping
};