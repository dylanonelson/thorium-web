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

// Export individual component mappings
export const letterSpacingMapping = {
  [ThSpacingSettingsKeys.letterSpacing]: {
    Comp: StatefulLetterSpacing
  }
};

export const lineHeightMapping = {
  [ThSpacingSettingsKeys.lineHeight]: {
    Comp: StatefulLineHeight
  }
};

export const paragraphIndentMapping = {
  [ThSpacingSettingsKeys.paragraphIndent]: {
    Comp: StatefulParagraphIndent
  }
};

export const paragraphSpacingMapping = {
  [ThSpacingSettingsKeys.paragraphSpacing]: {
    Comp: StatefulParagraphSpacing
  }
};

export const publisherStylesMapping = {
  [ThSpacingSettingsKeys.publisherStyles]: {
    Comp: StatefulPublisherStyles
  }
};

export const wordSpacingMapping = {
  [ThSpacingSettingsKeys.wordSpacing]: {
    Comp: StatefulWordSpacing
  }
};

export const fontFamilyMapping = {
  [ThTextSettingsKeys.fontFamily]: {
    Comp: StatefulFontFamily
  }
};

export const fontWeightMapping = {
  [ThTextSettingsKeys.fontWeight]: {
    Comp: StatefulFontWeight
  }
};

export const hyphensMapping = {
  [ThTextSettingsKeys.hyphens]: {
    Comp: StatefulHyphens
  }
};

export const textAlignMapping = {
  [ThTextSettingsKeys.textAlign]: {
    Comp: StatefulTextAlign
  }
};

export const textNormalizeMapping = {
  [ThTextSettingsKeys.textNormalize]: {
    Comp: StatefulTextNormalize
  }
};

export const columnsMapping = {
  [ThSettingsKeys.columns]: {
    Comp: StatefulColumns
  }
};

export const layoutMapping = {
  [ThSettingsKeys.layout]: {
    Comp: StatefulLayout
  }
};

export const themeMapping = {
  [ThSettingsKeys.theme]: {
    Comp: StatefulTheme,
    props: {
      mapArrowNav: 2
    }
  }
};

export const zoomMapping = {
  [ThSettingsKeys.zoom]: {
    Comp: StatefulZoom
  }
};

// Combine maps as needed
export const spacingComponentsMap: Record<ThSpacingSettingsKeys, StatefulSettingsMapObject> = {
  ...letterSpacingMapping,
  ...lineHeightMapping,
  ...paragraphIndentMapping,
  ...paragraphSpacingMapping,
  ...publisherStylesMapping,
  ...wordSpacingMapping
};

export const textComponentsMap: Record<ThTextSettingsKeys, StatefulSettingsMapObject> = {
  ...fontFamilyMapping,
  ...fontWeightMapping,
  ...hyphensMapping,
  ...textAlignMapping,
  ...textNormalizeMapping
};

export const spacingGroupMapping = {
  [ThSettingsKeys.spacingGroup]: {
    Comp: StatefulSpacingGroup,
    props: {
      componentsMap: spacingComponentsMap
    }
  }
};

export const textGroupMapping = {
  [ThSettingsKeys.textGroup]: {
    Comp: StatefulTextGroup,
    props: {
      componentsMap: textComponentsMap
    }
  }
};

export const settingsComponentsMap: Record<ThSettingsKeys, StatefulSettingsMapObject> = {
  ...columnsMapping,
  ...fontFamilyMapping,
  ...fontWeightMapping,
  ...hyphensMapping,
  ...layoutMapping,
  ...letterSpacingMapping,
  ...lineHeightMapping,
  ...paragraphIndentMapping,
  ...paragraphSpacingMapping,
  ...publisherStylesMapping,
  ...spacingGroupMapping,
  ...textAlignMapping,
  ...textGroupMapping,
  ...textNormalizeMapping,
  ...themeMapping,
  ...wordSpacingMapping,
  ...zoomMapping
};