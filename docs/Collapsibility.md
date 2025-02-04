# Collapsibility and Visibility

The concept of collapsibility applies to Action Triggers e.g. Settings, Fullscreen and ToC actions in the top end corner, or docking options in sheets/containers. 

It is relying on a global `collapse` property, and a specific `visibility` property for each of these actions.

## Collapsibility

When using collapsibility, you can configure how actions should be rendered i.e. as an action icon, or a menu item in an overflow menu.

The `collapse` value can be:

- `false` to disable collapsibility entirely – in this case the overflow menu won’t be used;
- `true` to enable collapsibility based on the actions’ `visibility`;
- an object whose properties are `StaticBreakpoints` and values can be:
  - the `number` of icons to ideally display, constrained by the actions’ `visibility`;
  - keyword `all` as an alias for the total number of actions – in this case the overflow menu won’t be used.

Note this object don’t require all `StaticBreakpoints` be configured, only the ones requiring a specific setting.

## Visibility

Each action can set its own `visibility`, with enum `ActionVisibility`:

- `always`: the action should always be displayed as an action icon;
- `collapsible`: the action should be displayed as an action icon or a menu item depending on `collapse` configuration;
- `overflow`: the action should always be displayed as a menu item.