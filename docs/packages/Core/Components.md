# Core Components

Core Components are the building blocks of Thorium Web and its stateful components. 

They are designed around [React Aria Components](https://react-spectrum.adobe.com/react-aria/components.html) to provide good accessibility out of the box and are designed to be as less disruptive as possible. 

In other words, you can follow the React Aria Components documentation to use them (props, events, styling…), Thorium Web only wraps them to provide ready-to-use components.

All components in the Core package start with the `Th` prefix.

## Usage

Core components only extend the React Aria Components props when needed, they do not override them.

Some components are made of several components, but provide with a `compounds` property that can be used to pass additional properties e.g. `ref`, `className`, etc. to the React Aria Components they are using.

For instance, if you want to add a ClassName to the indicator of a Switch component, you can do it like this:

```tsx
import { ThSwitch } from "@edrlab/thorium-web/core/components";

const MySwitch = () => {
  const switchRef = useRef<HTMLDivElement>(null);
  const [isSelected, setIsSelected] = useState(false);

  return (
    <ThSwitch 
      ref={ switchRef }
      isSelected={ isSelected }
      onChange={ (isSelected) => setIsSelected(isSelected) }
      label="My Switch Label"
      className="my-switch"
      compounds={{
        indicator: {
          className: "my-switch-indicator"
        }
      }}
    />
  )
}
```

[Stateful components](../../src/components/) are making extensive use of this property if you need more complex examples.

## Categories

The Core package provides various UI components organized into categories:

- `Actions`: Components that are used for actions (collapsible toolbar).
- `Buttons`: Components that are used for buttons, with default icons.
- `Containers`: Components that are used for modals, popovers, etc.
- `Forms`: Components that are used for collecting user input.
- `Menu`: Components for creating menus and menus items.
- `Reader`: Components for the general interface of the reader.
- `Settings`: Components for settings (switche, slider, numberfield, etc.).


## Actions Components

Components for creating action bars, with or without collapsibility.

```tsx
import { 
  ThActionsBar, 
  ThCollapsibleActionsBar 
} from "@edrlab/thorium-web/core/components";
```

These come with 2 specific hooks:

- `useActions`: A hook for managing actions (requires use of `lib` a.k.a. Redux state management).
- `useCollapsibility`: A hook for managing collapsibility a.k.a. distribution of action buttons and menu items based on preferences (requires use of `preferences`).

TBD.

## Buttons Components

Various button components for different use cases:

```tsx
import { 
  ThActionButton, 
  ThCloseButton,
  ThNavigationButton,
} from "@edrlab/thorium-web/core/components";
```

The `ThActionButton` is a button that can be used for actions, like opening a menu, opening a modal, etc. It is the base component for all other buttons of Thorium Web.

TBD.

## Container Components

Components for creating modals, popovers, bottom sheets, etc.:

```tsx
import { 
  ThBottomSheet, 
  ThDockedPanel, 
  ThModal, 
  ThPopover
} from "@edrlab/thorium-web/core/components";
```

These components are designed to accept restricted children components:
- `ThContainerHeader`: A header for the container.
- `ThContainerBody`: The main content of the container.

For instance if you wanted to create a popover, you would do it like this:

```tsx
import { RefObject } from "react";
import {
  ThPopover,
  ThContainerHeader,
  ThContainerBody
} from "@edrlab/thorium-web/core/components";

const MyPopover = (triggerRef: RefObject<HTMLButtonElement>) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ThPopover
      triggerRef={ triggerRef }
      isOpen={ isOpen }
      onOpenChange={ (open: boolean) => setIsOpen(open) }
    >
      <ThContainerHeader label="My Popover heading">
        <ThCloseButton
          onPress={ () => setIsOpen(false) }
        />
      </ThContainerHeader>
      <ThContainerBody>
        <p>My Popover Content</p>
      </ThContainerBody>
    </ThPopover>
  )
}
```

The package ships with a specific hook: `useFirstFocusable`, which can be used to focus the first focusable element of a container on open.

TBD.

This package also contains a higher-order component that can be used to switch between containers, `<ThTypedComponentRenderer>`. It requires a type parameter to specify the `type` of container to render, as well as a `componentsMap`.

TBD.

## Form Components

Components for building forms and collecting user input:

```tsx
import { 
  ThForm, 
  ThFormNumberField, 
  ThFormTextField
} from "@edrlab/thorium-web/core/components";
```

`<ThForm>` is a component that can be used to wrap `ThFormTextField` and `ThFormNumberField` components. It provides a `Button` component that can be used to submit the form.

TBD.

## Menu Components

Components for creating menus and menu items:

```tsx
import {
  ThMenu,
  ThMenuButton,
  ThMenuItem
} from "@edrlab/thorium-web/core/components";
```

`<ThMenu>` is a complete solution for creating a menu with a popover. It accepts a `items` prop to build entries of the menu list dynamically, and distribute their associated container outside of the Menu component if needed.

TBD.

## Reader Components

These are general components for the interface of the reader:

```tsx
import { 
  ThFooter, 
  ThHeader, 
  ThLoader, 
  ThProgression, 
  ThRunningHead 
} from "@edrlab/thorium-web/core/components";
```

TBD.

## Settings Components

These components are used for creating settings:

```tsx
import {
  ThDropdown,
  ThNumberField,
  ThRadioGroup,
  ThSlider,
  ThSwitch
}
```

They are the building blocks for creating settings, and stateful settings components are all build on top of them. 

TBD.

The package also contains a wrapper component that can be used to create a group/collection of settings, `<ThSettingsWrapper>`. It accepts an `items` prop to build entries of the settings list dynamically.

TBD.

## Misc Components

Miscellaneous components:

```tsx
import { ThGrid } from "@edrlab/thorium-web/core/components";
```

`ThGrid` is a component that can be used to create a grid of items. 