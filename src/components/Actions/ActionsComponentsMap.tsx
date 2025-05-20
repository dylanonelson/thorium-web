"use client";

import { ActionKeyType, ThActionsKeys } from "@/preferences";
import { StatefulActionsMapObject } from "./models/actions";
import { StatefulFullscreenTrigger } from "./Fullscreen/StatefulFullscreenTrigger";
import { StatefulLayoutStrategyTrigger } from "./LayoutStrategy/StatefulLayoutStrategyTrigger";
import { StatefulLayoutStrategyContainer } from "./LayoutStrategy/StatefulLayoutStrategyContainer";
import { StatefulSettingsTrigger } from "./Settings/StatefulSettingsTrigger";
import { StatefulSettingsContainer } from "./Settings/StatefulSettingsContainer";
import { StatefulTocTrigger } from "./Toc/StatefulTocTrigger";
import { StatefulTocContainer } from "./Toc/StatefulTocContainer";

export const fullscreenMapping = {
  [ThActionsKeys.fullscreen]: {
    trigger: StatefulFullscreenTrigger
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
    target: StatefulSettingsContainer
  }
};

export const tocMapping = {
  [ThActionsKeys.toc]: {
    trigger: StatefulTocTrigger,
    target: StatefulTocContainer
  }
};

// Combine maps as needed
export const actionsComponentsMap: Record<ActionKeyType, StatefulActionsMapObject> = {
  ...fullscreenMapping,
  ...layoutStrategyMapping,
  ...settingsMapping,
  ...tocMapping
};