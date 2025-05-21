import { ThPlugin } from "../PluginRegistry";
import { ThActionsKeys, ThSettingsKeys } from "@/preferences/models/enums";

import { StatefulFullscreenTrigger } from "../../Actions/Fullscreen/StatefulFullscreenTrigger";
import { StatefulJumpToPositionTrigger } from "../../Actions/JumpToPosition/StatefulJumpToPositionTrigger";
import { StatefulLayoutStrategyTrigger } from "../../Actions/LayoutStrategy/StatefulLayoutStrategyTrigger";
import { StatefulLayoutStrategyContainer } from "../../Actions/LayoutStrategy/StatefulLayoutStrategyContainer";
import { StatefulSettingsTrigger } from "../../Actions/Settings/StatefulSettingsTrigger";
import { StatefulSettingsContainer } from "../../Actions/Settings/StatefulSettingsContainer";
import { StatefulTocTrigger } from "../../Actions/Toc/StatefulTocTrigger";
import { StatefulTocContainer } from "../../Actions/Toc/StatefulTocContainer";

import { StatefulColumns } from "../../Settings/StatefulColumns";
import { StatefulFontFamily } from "../../Settings/StatefulFontFamily";
import { StatefulFontWeight } from "../../Settings/StatefulFontWeight";
import { StatefulHyphens } from "../../Settings/StatefulHyphens";
import { StatefulLayout } from "../../Settings/StatefulLayout";
import { StatefulLetterSpacing } from "../../Settings/StatefulLetterSpacing";
import { StatefulLineHeight } from "../../Settings/StatefulLineHeight";
import { StatefulParagraphIndent } from "../../Settings/StatefulParagraphIndent";
import { StatefulParagraphSpacing } from "../../Settings/StatefulParagraphSpacing";
import { StatefulPublisherStyles } from "../../Settings/StatefulPublisherStyles";
import { StatefulSpacingGroup } from "../../Settings/StatefulSpacingGroup";
import { StatefulTextAlign } from "../../Settings/StatefulTextAlign";
import { StatefulTextGroup } from "../../Settings/StatefulTextGroup";
import { StatefulTextNormalize } from "../../Settings/StatefulTextNormalize";
import { StatefulTheme } from "../../Settings/StatefulTheme";
import { StatefulWordSpacing } from "../../Settings/StatefulWordSpacing";
import { StatefulZoom } from "../../Settings/StatefulZoom";

export const createDefaultPlugin = (): ThPlugin => {
  return {
    id: "core",
    name: "Core Components",
    description: "Default components for Thorium Web StatefulReader",
    version: "0.10.0",
    components: {
      actions: {
        [ThActionsKeys.fullscreen]: {
          Trigger: StatefulFullscreenTrigger
        },
        [ThActionsKeys.jumpToPosition]: {
          Trigger: StatefulJumpToPositionTrigger
        },
        [ThActionsKeys.layoutStrategy]: {
          Trigger: StatefulLayoutStrategyTrigger,
          Target: StatefulLayoutStrategyContainer
        },
        [ThActionsKeys.settings]: {
          Trigger: StatefulSettingsTrigger,
          Target: StatefulSettingsContainer
        },
        [ThActionsKeys.toc]: {
          Trigger: StatefulTocTrigger,
          Target: StatefulTocContainer
        }
      },
      settings: {
        [ThSettingsKeys.columns]: {
          Comp: StatefulColumns
        },
        [ThSettingsKeys.fontFamily]: {
          Comp: StatefulFontFamily,
          type: "text"
        },
        [ThSettingsKeys.fontWeight]: {
          Comp: StatefulFontWeight,
          type: "text"
        },
        [ThSettingsKeys.hyphens]: {
          Comp: StatefulHyphens,
          type: "text"
        },
        [ThSettingsKeys.layout]: {
          Comp: StatefulLayout
        },
        [ThSettingsKeys.letterSpacing]: {
          Comp: StatefulLetterSpacing,
          type: "spacing"
        },
        [ThSettingsKeys.lineHeight]: {
          Comp: StatefulLineHeight,
          type: "spacing"
        },
        [ThSettingsKeys.paragraphIndent]: {
          Comp: StatefulParagraphIndent,
          type: "spacing"
        },
        [ThSettingsKeys.paragraphSpacing]: {
          Comp: StatefulParagraphSpacing,
          type: "spacing"
        },
        [ThSettingsKeys.publisherStyles]: {
          Comp: StatefulPublisherStyles,
          type: "spacing"
        },
        [ThSettingsKeys.spacingGroup]: {
          Comp: StatefulSpacingGroup,
        },
        [ThSettingsKeys.textAlign]: {
          Comp: StatefulTextAlign,
          type: "text"
        },
        [ThSettingsKeys.textGroup]: {
          Comp: StatefulTextGroup
        },
        [ThSettingsKeys.textNormalize]: {
          Comp: StatefulTextNormalize,
          type: "text"
        },
        [ThSettingsKeys.theme]: {
          Comp: StatefulTheme
        },
        [ThSettingsKeys.wordSpacing]: {
          Comp: StatefulWordSpacing,
          type: "spacing"
        },
        [ThSettingsKeys.zoom]: {
          Comp: StatefulZoom
        }
      }
    }
  };
};