# Customization

This project has been designed to be highly customizable from the start, with [multiple options configurable in its Preferences](../src/preferences.ts). This should help change a significant amount of features without having to fork and modify components. 

## Direction

The App UI supports both Left-to-Right (LTR) and Right-to-Left (RTL) languages through an optional property `direction`. It will switch the entire layout, including the docking panels, independently of the publication’s reading progression.

Values can be `ltr` or `rtl` and a `LayoutDirection` enum is available as well. 

## Typography

The `typography` object can be used to set the following properties:

- `pageGutter`;
- `optimalLineLength`; 
- `minimalLineLength`.

### Page Gutter

The `padding` to add to `body` in publications, in `px`.

### Optimal Line Length

The optimal line length used for value `auto` when the publication is paginated, in `ch` (number of characters). 

This will be used to switch from one to two columns, taking page gutter into account.

### Minimal Line Length (optional)

The minimal line length a column of text can never go below, even when 2 columns are set by the user, in `ch`. 

If the value is `undefined`, then optimal line length is the minimal line length. The algorithm will also check this value is not higher than the optimal line length and apply the same logic.

If it’s `null` then this means it is disabled entirely, and there is no lower limit. This can be used to enforce 2 columns, even on smaller screens.

## Scroll

The `scroll` preference is used to configure the scroll affordances at the top and bottom of each resource when in scrollable layout.

### Affordances

You can set what top and bottom affordances should display with properties:

- `topAffordance`;
- `bottomAffordance`.

They are using the `ScrollAffordancePref` enum (`none`, `prev`, `next`, `both`).

For instance if you want nothing in the top slot you can set: 

```
scroll: {
  topAffordance: ScrollAffordancePref.none,
  bottomAffordance: ScrollAffordancePref.both,
  ...
}
```

Or if you want a link to the previous resource at the top, and the next at the bottom:

```
scroll: {
  topAffordance: ScrollAffordancePref.prev,
  bottomAffordance: ScrollAffordancePref.next,
  ...
}
```

### Position to scroll back to (WIP)

TBD.

For the previous affordance, you can set the position it should go back to using `backTo` and the `ScrollBackTo` enum (`top`, `bottom`, `untouched`).

## Theming

See the [dedicated Theming doc](./Theming.md).

You can configure `breakpoints`, that are re-used multiple times throughout preferences, in `theming`. 

This document also explains in more depth how you can add your own themes, customize, or remove existing ones. Without having to add or modify any component.

## Shortcuts (WIP)

TBD.

You can set the `representation` of the special keys displayed in the shortcut component with enum `ShortcutRepresentation` (`symbol`, `short`, `long`).

For instance, for key `Option` on Mac, `symbol` is `⌥`, `short` is `alt`, and `long` is `Option`.

You can also configure an optional `joiner` string that will be added between keys.

## Actions

Action Components can be a simple trigger (e.g. fullscreen), or a combination of a trigger and a sheet/container (e.g. Settings, Toc). This should explain why a lot of their properties are optional when configured in `keys`.

### Display Order

You can customize the order of the actions in the `displayOrder` array, and remove them as well if you don’t want to expose some. 

Enum `ActionKeys` is provided to keep things consistent across the entire codebase.

### Collapsibility and Visibility

You can enable collapsibility i.e. an overflow menu will be used based on your configuration, and set the visibility of eact action. More details in the dedicated [Collapsibility doc](Collapsibility.md).

### Keys

The `keys` object contains the configuration for each `action`, with optional properties that can be used when the action’s is not just a trigger, but also has a sheet/container:

- `sheet` to specify the type of sheet the action’s container should use:
  - as a `defaultSheet` (`fullscreen`, `popover`, or `bottomSheet`);
  - as an override of this default for specific breakpoints in a `breakpoints` object (value is a key of `SheetTypes` enum).
- `docked`: the configuration for docking. See the [docking doc](./Docking.md) for further details.
- `snapped`: the configuration for snap points. See the [snap points doc](Snappoints.md) for further details.

### Shortcut (WIP)

Not supported at the moment. TBD.

## Docking

Docking is partly similar to actions in the sense it has its own special docking actions you can configure: display order, collapsibility and visibility.

See the [dedicated Docking doc](./Docking.md) for more details.