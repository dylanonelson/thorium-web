# Reader UI Components API Reference

This document details the Reader UI components that provide the core reading interface in the EPUB reader.

## Core Component

### StatefulReader

Main reader component that manages the EPUB reading experience.

```typescript
interface StatefulReaderProps {
  rawManifest: object;      // EPUB manifest data
  selfHref: string;         // Reference to the reader location
  plugins?: ThPlugin[];     // Optional reader plugins
}
```

Features:
- EPUB rendering and navigation
- Theme and layout management
- Plugin system integration
- Keyboard and touch navigation

## Navigation Components

### StatefulReaderArrowButton

Navigation arrow button component for page navigation.

```typescript
interface StatefulReaderArrowButtonProps extends ThNavigationButtonProps {
  direction: "left" | "right";  // Navigation direction
  occupySpace: boolean;         // Whether to maintain space when hidden
}
```

Features:
- RTL/LTR support
- Immersive mode integration
- Keyboard navigation
- Responsive visibility

### StatefulReaderProgression

Reading progress indicator component.

```typescript
interface UnstableProgressionObject {
  totalPositions?: number;
  currentPositions?: number[];
  totalProgression?: number;
  currentPublication?: string;
  relativeProgression?: number;
  currentChapter?: string;
}
```

Features:
- Multiple progression formats (positions, percentages)
- Chapter and publication progress
- Localized display
- Accessibility support

## Layout Components

### StatefulReaderHeader

Reader header component that manages the top UI bar.

Features:
- Running head display
- Action buttons integration
- Immersive mode support
- RTL/LTR layout support

### StatefulReaderFooter

Reader footer component that manages the bottom UI bar.

Features:
- Progress display integration
- Immersive mode support
- Hover state management
- Responsive layout

## Utility Components

### StatefulLoader

Loading indicator component for reader states.

```typescript
interface StatefulLoaderProps {
  isLoading: boolean;     // Loading state
  children: ReactNode;    // Content to show when loaded
}
```

Features:
- Loading state management
- Localized loading message
- Accessible loading indicators