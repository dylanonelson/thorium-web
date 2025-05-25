# Core Helpers API Documentation

The Core package provides utility functions for common tasks in building reading applications. These helpers are designed to be efficient, type-safe, and easy to use.

## Focus Utilities

A collection of utilities for managing focus and interactive elements.

```typescript
import { focusUtilities } from "@edrlab/thorium-web/core/helpers";
```

### `isActiveElement`

Checks if an element is currently focused.

```typescript
function isActiveElement(el: Element | undefined | null): boolean
```

### `isKeyboardTriggered`

Determines if an element was focused via keyboard (matches :focus-visible).

```typescript
function isKeyboardTriggered(el: Element | undefined | null): boolean
```

### `isInteractiveElement`

Checks if an element is interactive (can receive focus and user input).

```typescript
function isInteractiveElement(element: Element | null): boolean
```

## Keyboard Utilities

TBD. Work in progress with disruptive changes coming.

## Platform Detection

Utilities for detecting the user's platform and operating system.

```typescript
import { getPlatform, isMacish, isIpadOS } from "@edrlab/thorium-web/core/helpers";
```

### `getPlatform`

Returns the current platform identifier.

```typescript
function getPlatform(): string
```

### `isMacish`

Checks if the current platform is macOS or iOS-based.

```typescript
function isMacish(): boolean
```

### `isIpadOS`

Detects if the current platform is iPadOS.

```typescript
function isIpadOS(): boolean
```

## Breakpoints Map

Utility for creating responsive breakpoint maps.

```typescript
import { makeBreakpointsMap } from "@edrlab/thorium-web/core/helpers";
```

### `makeBreakpointsMap`

Creates a map of breakpoints with specified values.

Breakpoints are defined as an object with breakpoint names as keys and their corresponding values. The keys are:
- `ThBreakpoints.small`
- `ThBreakpoints.medium`
- `ThBreakpoints.expanded`
- `ThBreakpoints.large`
- `ThBreakpoints.xlarge`

This is useful when using [Preferences](../Preferences.md) as it will return the value for all breakpoints e.g. type of sheet in the vanilla Reader, even if they are not defined in preferences.

```typescript
function makeBreakpointsMap<T>({
  defaultValue,
  fromEnum,
  pref,
  disabledValue,
}: {
  defaultValue: T;
  fromEnum: any;
  pref?: BreakpointsMap<T> | boolean;
  disabledValue?: T;
}): Required<BreakpointsMap<T>>
```

## Props to CSS Variables

Utility for converting object properties to CSS custom properties.

```typescript
import { propsToCSSVars } from "@edrlab/thorium-web/core/helpers";
```

### `propsToCSSVars`

Converts object properties to CSS custom properties recursively.

```typescript
function propsToCSSVars(
  props: { [x: string]: any },
  prefix?: string
): { [key: string]: any }
```

**Example:**
```typescript
const props = {
  color: "blue",
  spacing: {
    padding: 16,
    margin: 8
  }
};

const cssVars = propsToCSSVars(props, "theme");
// Result:
// {
//   "--theme-color": "blue",
//   "--spacing-padding": "16px",
//   "--spacing-margin": "8px"
// }
```
> [!Note]
> The prefix will not be applied to children in the object you pass.