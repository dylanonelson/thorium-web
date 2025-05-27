# Store API Reference

This document details the Redux store implementation and state management system.

## Core Components

### ThStoreProvider

Context provider component for the Redux store.

**Props:**
- `children`: Child components
- `initialState`: Optional initial state

**Features:**
- Global state management
- State persistence
- Action dispatching
- State selectors

## Reducers

### Actions Reducer

Manages state for action-related features.

**State Interface:**
```typescript
interface ActionsReducerState {
  keys: {
    [key in ActionsStateKeys]: {
      isOpen: boolean | null;
      docking: ThDockingKeys | null;
      dockedWidth?: number;
    };
  };
  dock: {
    [ThDockingKeys.start]: {
      actionKey: ActionsStateKeys | null;
      active: boolean;
      collapsed: boolean;
      width?: number;
    };
    [ThDockingKeys.end]: {
      actionKey: ActionsStateKeys | null;
      active: boolean;
      collapsed: boolean;
      width?: number;
    };
  };
  overflow: {
    [key in OverflowStateKeys]: {
      isOpen: boolean;
    };
  };
}
```

**Actions:**
- `setActionOpen`: Set action state open/closed
- `setActionDock`: Set action docking state
- `toggleAction`: Toggle action state
- `setActionSlot`: Set action slot
- `setActionDocked`: Set action docked state
- `setOverflowOpen`: Set overflow state open/closed

### Publication Reducer

Manages state for EPUB publication data.

**State Interface:**
```typescript
interface PublicationReducerState {
  runningHead?: string;
  isFXL: boolean;
  isRTL: boolean;
  progression: UnstableProgressionObject;
  atPublicationStart: boolean;
  atPublicationEnd: boolean;
  tocTree?: TocItem[];
  tocEntry?: string;
}
```

**Actions:**
- `setRunningHead`: Set running head text
- `setFXL`: Set fixed layout state
- `setRTL`: Set right-to-left state
- `setProgression`: Update progression state
- `setPublicationStart`: Set at publication start state
- `setPublicationEnd`: Set at publication end state
- `setTocTree`: Set table of contents tree
- `setTocEntry`: Set current TOC entry

### Reader Reducer

Manages state for reader functionality.

**State Interface:**
```typescript
interface ReaderReducerState {
  direction: ThLayoutDirection;
  isLoading: boolean;
  isImmersive: boolean;
  isHovering: boolean;
  hasArrows: boolean;
  isFullscreen: boolean;
  settingsContainer: ThSettingsContainerKeys;
  platformModifier: UnstablePlatformModifier;
}
```

**Actions:**
- `setDirection`: Set layout direction
- `setLoading`: Set loading state
- `setPlatformModifier`: Set platform modifier
- `setImmersive`: Set immersive mode
- `toggleImmersive`: Toggle immersive mode
- `setHovering`: Set hovering state
- `setArrows`: Set arrows visibility
- `setFullscreen`: Set fullscreen mode
- `setSettingsContainer`: Set settings container

### Settings Reducer

Manages state for reader settings.

**State Interface:**
```typescript
interface SettingsReducerState {
  columnCount: string;
  fontFamily: keyof typeof defaultFontFamilyOptions;
  fontSize: number;
  fontWeight: number;
  hyphens: boolean | null;
  layoutStrategy: ThLayoutStrategy;
  letterSpacing: number | null;
  lineHeight: ThLineHeightOptions;
  lineLength: number | null;
  tmpLineLengths: number[];
  tmpMaxChars: boolean;
  tmpMinChars: boolean;
  paragraphIndent: number | null;
  paragraphSpacing: number | null;
  publisherStyles: boolean;
  scroll: boolean;
  textAlign: ThTextAlignOptions;
  textNormalization: boolean;
  wordSpacing: number | null;
}
```

**Actions:**
- `setColumnCount`: Set column count
- `setFontFamily`: Set font family
- `setFontSize`: Set font size
- `setFontWeight`: Set font weight
- `setHyphens`: Set hyphenation
- `setLayoutStrategy`: Set layout strategy
- `setLetterSpacing`: Set letter spacing
- `setLineHeight`: Set line height
- `setLineLength`: Set line length
- `setTmpLineLengths`: Set temporary line lengths
- `setTmpMaxChars`: Set temporary max chars
- `setTmpMinChars`: Set temporary min chars
- `setParagraphIndent`: Set paragraph indent
- `setParagraphSpacing`: Set paragraph spacing
- `setPublisherStyles`: Set publisher styles
- `setScroll`: Set scroll mode
- `setTextAlign`: Set text alignment
- `setTextNormalization`: Set text normalization
- `setWordSpacing`: Set word spacing

### Theme Reducer

Manages state for theme settings.

**State Interface:**
```typescript
interface ThemeReducerState {
  monochrome: boolean;
  colorScheme: ThColorScheme;
  theme: string;
  prefersReducedMotion: boolean;
  prefersReducedTransparency: boolean;
  prefersContrast: ThContrast;
  forcedColors: boolean;
  breakpoint?: ThBreakpoints;
}
```

**Actions:**
- `setMonochrome`: Set monochrome mode
- `setColorScheme`: Set color scheme
- `setTheme`: Set current theme
- `setPrefersReducedMotion`: Set reduced motion preference
- `setPrefersReducedTransparency`: Set reduced transparency preference
- `setPrefersContrast`: Set contrast preference
- `setForcedColors`: Set forced colors mode
- `setBreakpoint`: Set current breakpoint