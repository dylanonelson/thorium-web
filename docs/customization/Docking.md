# Docking

The docking system can be configured entirely, and actions’ container be even set docked as default, or given specific docking options to display to users.

Note this docking system supports Left-to-right and Right-to-left languages, which should explain the use of logical properties for its panels and their configuration.

## Docking

The overarching property `docking` is used to configure the `dock` configuration, the `displayOrder` of docking actions (`transient`, `start`, and `end`), as well as their collapsibility and visibility.

### Dock

You can configure the dock panels using `dock`. The value can be:

- `false`: disables docking entirely;
- `true`: enables docking and exposes two panels;
- an object whose properties are in enum `StaticBreakpoints` and value is in enum `DockTypes` (`none`, `start`, `end`, `both`).

Note this object don’t require all `StaticBreakpoints` to be configured, only the ones requiring a specific setting.

This means you can disable docking on smaller screens for instance, or only expose a single panel on larger screens:

```
dock: {
  [StaticBreakpoints.compact]: DockTypes.none,
  [StaticBreakpoints.medium]: DockTypes.none,
  [StaticBreakpoints.expanded]: DockTypes.none,
  [StaticBreakpoints.large]: DockTypes.start,
  [StaticBreakpoints.xLarge]: DockTypes.start
}
```

### Display Order

Property `displayOrder` accepts an array of `DockingKeys` (`transient`, `start`, `end`).

```
displayOrder: [
  DockingKeys.transient,
  DockingKeys.start,
  DockingKeys.end
]
```

### Collapsibility and visibility

See [dedicated doc](./Collapsibility.md).

## Docking Preferences/Options

Each action with a sheet/container can have an optional `docked` configuration with the following properties:

- `dockable`: the docking options (in `DockingKeys` enum) to display to the user for this specific action (required);
- `dragIndicator`: enable/disable the drag indicator if the actions’ container is resizable (default is `false`);
- `width`: the initial/default width of the container when docked in `px`;
- `minWidth`: the minimum width of the container when docked in `px`;
- `maxWidth`: the maximum width of the container when docked in `px`.

For instance, if you want to Table of Contents to be dockable in both panels, with a drag handle, and make it resizable, you would configure:

```
[ActionKeys.toc]: {
  ...
  docked: {
    dockable: DockTypes.both,
    dragIndicator: true,
    width: 360,
    minWidth: 320,
    maxWidth: 450
  }
}
```

Resizability is inferred from `width`, `minWidth`, and `maxWidth` and their values have to meet the requirement of an ascending range of values. 

If no width-related property is set at all, then the `default` set in `theming` will be used.

Note the panels are also collapsible, and will try to keep the width the user has previously set on open/expand.

## Docked Sheets

You can set the action’s container as docked using `SheetTypes.dockedStart` and `SheetTypes.dockedEnd` in the action’s `sheet` object, but it can’t be a `defaultSheet`, it can only be used in `breakpoints`. 

For instance, if you want to have the Table of Contents docked by default on larger screens but as a popover otherwise:

```
[ActionKeys.toc]: {
  ...
  sheet: {
    defaultSheet: SheetTypes.popover,
    breakpoints: {
      [StaticBreakpoints.large]: SheetTypes.dockedStart,
      [StaticBreakpoints.xLarge]: SheetTypes.dockedStart
    }
}
```

This preference must also meet the following requirements:

- be compatible with `docking.dock` for its breakpoint;
- be compatible with `docked.dockable` in its own configuration.

This should dock and open the container on load if applicable. 

Note the user’s customization will override this preference.