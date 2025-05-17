"use client";

import { ThSettingsKeys, ThSpacingSettingsKeys, ThTextSettingsKeys } from "@/preferences/models/enums";
import { StatefulSettingsMapObject } from "./models/settings";
import { StatefulColumns } from "./StatefulColumns";
import { StatefulFontFamily } from "./StatefulFontFamily";
import { StatefulFontWeight } from "./StatefulFontWeight";
import { StatefulHyphens } from "./StatefulHyphens";
import { StatefulLayout } from "./StatefulLayout";
import { StatefulLetterSpacing } from "./StatefulLetterSpacing";
import { StatefulLineHeight } from "./StatefulLineHeight";
import { StatefulParagraphIndent } from "./StatefulParagraphIndent";
import { StatefulParagraphSpacing } from "./StatefulParagraphSpacing";
import { StatefulPublisherStyles } from "./StatefulPublisherStyles";
import { StatefulSpacingGroup } from "./StatefulSpacingGroup";
import { StatefulTextAlign } from "./StatefulTextAlign";
import { StatefulTextGroup } from "./StatefulTextGroup";
import { StatefulTextNormalize } from "./StatefulTextNormalize";
import { StatefulTheme } from "./StatefulTheme";
import { StatefulWordSpacing } from "./StatefulWordSpacing";
import { StatefulZoom } from "./StatefulZoom";

export const spacingComponentsMap: Record<ThSpacingSettingsKeys, StatefulSettingsMapObject> = {
  [ThSpacingSettingsKeys.letterSpacing]: {
    Comp: StatefulLetterSpacing
  },
  [ThSpacingSettingsKeys.lineHeight]: {
    Comp: StatefulLineHeight
  },
  [ThSpacingSettingsKeys.paragraphIndent]: {
    Comp: StatefulParagraphIndent
  },
  [ThSpacingSettingsKeys.paragraphSpacing]: {
    Comp: StatefulParagraphSpacing
  },
  [ThSpacingSettingsKeys.publisherStyles]: {
    Comp: StatefulPublisherStyles
  },
  [ThSpacingSettingsKeys.wordSpacing]: {
    Comp: StatefulWordSpacing
  }
}

export const textComponentsMap: Record<ThTextSettingsKeys, StatefulSettingsMapObject> = {
  [ThTextSettingsKeys.fontFamily]: {
    Comp: StatefulFontFamily
  },
  [ThTextSettingsKeys.fontWeight]: {
    Comp: StatefulFontWeight
  },
  [ThTextSettingsKeys.hyphens]: {
    Comp: StatefulHyphens
  },
  [ThTextSettingsKeys.textAlign]: {
    Comp: StatefulTextAlign
  },
  [ThTextSettingsKeys.textNormalize]: {
    Comp: StatefulTextNormalize
  }
}

export const settingsComponentsMap: Record<ThSettingsKeys, StatefulSettingsMapObject> = {
  [ThSettingsKeys.columns]: {
    Comp: StatefulColumns
  },
  [ThSettingsKeys.fontFamily]: {
    Comp: StatefulFontFamily
  },
  [ThSettingsKeys.fontWeight]: {
    Comp: StatefulFontWeight
  },
  [ThSettingsKeys.hyphens]: {
    Comp: StatefulHyphens
  },
  [ThSettingsKeys.layout]: {
    Comp: StatefulLayout
  },
  [ThSettingsKeys.letterSpacing]: {
    Comp: StatefulLetterSpacing
  },
  [ThSettingsKeys.lineHeight]: {
    Comp: StatefulLineHeight
  },
  [ThSettingsKeys.paragraphIndent]: {
    Comp: StatefulParagraphIndent
  },
  [ThSettingsKeys.paragraphSpacing]: {
    Comp: StatefulParagraphSpacing
  },
  [ThSettingsKeys.publisherStyles]: {
    Comp: StatefulPublisherStyles
  },
  [ThSettingsKeys.spacingGroup]: {
    Comp: StatefulSpacingGroup,
    props: {
      componentsMap: spacingComponentsMap
    }
  },
  [ThSettingsKeys.textAlign]: {
    Comp: StatefulTextAlign
  },
  [ThSettingsKeys.textGroup]: {
    Comp: StatefulTextGroup,
    props: {
      componentsMap: textComponentsMap
    }
  },
  [ThSettingsKeys.textNormalize]: {
    Comp: StatefulTextNormalize
  },
  [ThSettingsKeys.theme]: {
    Comp: StatefulTheme,
    props: {
      mapArrowNav: 2
    }
  },
  [ThSettingsKeys.wordSpacing]: {
    Comp: StatefulWordSpacing
  },
  [ThSettingsKeys.zoom]: {
    Comp: StatefulZoom
  }
}