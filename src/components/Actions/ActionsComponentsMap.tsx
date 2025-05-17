"use client";

import { ThActionsKeys } from "@/preferences";
import { StatefulActionContainerProps, StatefulActionsMapObject } from "./models/actions";
import { StatefulSwitchFullscreen } from "./StatefulSwitchFullscreen";
import { StatefulLayoutStrategyContainer, StatefulLayoutStrategyTrigger } from "./StatefulLayoutStrategy";
import { StatefulSettingsContainer, StatefulSettingsTrigger } from "./StatefulSettings";
import { StatefulTocContainer, StatefulTocTrigger } from "./StatefulToc";
import { settingsComponentsMap } from "../Settings/SettingsComponentsMap";

export const actionsComponentsMap: Record<ThActionsKeys, StatefulActionsMapObject> = {
  [ThActionsKeys.fullscreen]: {
    trigger: StatefulSwitchFullscreen
  },
  /* [ThActionsKeys.jumpToPosition]: {
    trigger: StatefulJumpToPosition
  }, */
  [ThActionsKeys.layoutStrategy]: {
    trigger: StatefulLayoutStrategyTrigger,
    target: StatefulLayoutStrategyContainer
  },
  [ThActionsKeys.settings]: {
    trigger: StatefulSettingsTrigger,
    target: (props: StatefulActionContainerProps) => <StatefulSettingsContainer { ...props } componentsMap={ settingsComponentsMap } />
  },
  [ThActionsKeys.toc]: {
    trigger: StatefulTocTrigger,
    target: StatefulTocContainer
  }
}