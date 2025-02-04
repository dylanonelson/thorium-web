# Theming

The `theming` property is responsible for the look and feel of the app, as it allows to specify a large amount of properties:

- breakpoints;
- layout defaults and constraints;
- arrows and icons; 
- themes.

## Breakpoints

Object `breakpoints` can be used to customize the media queries that will be used to target different widths. It is taking inspiration from [Material Design’s Window-size classes](https://m3.material.io/foundations/layout/applying-layout/window-size-classes). 

The property is of enum `StaticBreakpoints` and the value a `number` (in `px`). 

These static breakpoints will be reused for docking, collapsibility, sheets/containers, etc.

If the value is set to `null` then the breakpoint is simply ignored and the next one (if any) will be used.

## Layout

Object `layout` allows to configure:

- the border `radius` of button icons and sheets/containers (in `px`);
- the `spacing` of components (in `px`) when applicable e.g. padding and spacing of sheets/containers;
- `defaults` for:
  - `dockingWidth` or the size of dock panels by default (in `px`);
  - `scrim` or the CSS-valid string value for the bottom sheet’s underlay `background` – is overridable in each action’s `snapped` preference.
- `constraints` for some components:
  - the `max-width` of the bottom sheet component – is overridable in each action’s `snapped` preference;
  - the `max-width` of the popover sheet component.

## Arrows and icons

Object `arrow` allows to configure the `size` and `offset` (in `px`) of the left and right `arrow` used to progress through paged resources.

Object `icon` allows to configure the `size` and `tooltipOffset` (in `px`) of icon buttons throughout the UI.

## Themes

Object `themes` allows to customize the themes used and provided to users in Settings. 

As a matter of fact, this user setting is created dynamically from these preferences, which means creating a theme takes 4 steps:

- add it to the `ThemeKeys` enum in [models/theme](../src/models/theme.ts);
- add their display string to `settings.themes` in [resources/locales](../src//resources/locales/en.json);
- add it to `reflowOrder` and/or `fxlOrder`;
- add and configure them in `themes.keys`.

Your custom theme is now available without having to create or modify a component. 

### Display Order

You can set the display order of themes for formats/renditions the Reader supports:

- `reflowOrder` for reflowable EPUB;
- `fxlOrder` for Fixed-Layout EPUB.

Note `ThemeKeys.auto` is a special case that maps the theme to the OS’ preference (light or dark), it’s not a theme *per se.*

### Keys and Tokens

The `keys` object contains the themes (key of `ThemeKeys` enum as a property) and their tokens, whose value is a CSS-valid string:

- `background`: the color of the background
- `text`: the color of the text
- `link`: the color of links
- `visited`: the color of visited links
- `subdue`: the color of subdued elements such as borders
- `disable`: the color on `:disabled`
- `hover`: the color of the background on `:hover`
- `onHover`: the color of the text on `:hover`
- `select`: the color of the background on `::selection`
- `onSelect`: the color of the text on `::selection`
- `focus`: the color of the outline on `:focus-visible`
- `elevate`: the drop shadow of containers
- `immerse`: the opacity of immersive mode (value in the range `[0...1]` as a string)