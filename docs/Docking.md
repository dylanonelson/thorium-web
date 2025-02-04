# Docking

The docking system can be configured entirely, and actions’ container be even set docked as default, or given specific docking options to display to users.

Note this docking support Left-to-right and Right-to-left languages, which should explain the use of logical properties for the docking panels and their configuration.

## Docking

The overarching property `docking` is used to configure the `dock` configuration, the `displayOrder` of docking actions (`transient`, `start`, and `end`), as well as their collapsibility and visibility.

### Dock

You can configure the dock panels using `dock`. The value can be:

- `false`: disables docking entirely;
- `true`: enables docking and exposes two panels;
- an object whose properties are `StaticBreakpoints` and value is of enum `DockTypes` (`none`, `start`, `end`, `both`).

Note this object don’t require all `StaticBreakpoints` be configured, only the ones requiring a specific setting.

This means you can disable docking on smaller screens for instance, or only expose a single panel on larger screens.

### Display Order

Property `displayOrder` accepts an array of `DockingKeys` (`transient`, `start`, `end`).

### Collapsibility and visibility

See [dedicated doc](./Collapsibility.md).

## Docking Preferences/Options

Each action with a sheet/container can have an optional `docked` configuration with the following properties:

- `dockable`: the docking options (`DockingKeys` enum) to display to the user for this specific action (required);
- `dragIndicator`: enable/disable the drag indicator if the actions’ container is resizable (default is `false`);
- `width`: the initial/default width of the container when docked in `px`;
- `minWidth`: the minimum width of the container when docked in `px`;
- `maxWidth`: the maximum width of the container when docked in `px`.

Resizability is inferred from `width`, `minWidth`, and `maxWidth` and their values have to meet the requirement of an ascending range of values. 

If no width-related property is set at all, then the `default` set in `theming` will be used.

Note the panels are also collapsible, and will try to keep the width the user has previously set on open/expand.

## Docked Sheets

You can set the action’s container as docked using `SheetTypes.dockedStart` and `SheetTypes.dockedEnd` in the action’s `sheet` object, but it can’t be a `defaultSheet`, it can only be used in `breakpoints`. 

This preference must also meet the following requirements:

- be compatible with `docking.dock` for its breakpoint;
- be compatible with `docked.dockable` in its own configuration.

This should dock and open the container on load if applicable. 

Note the user’s customization will override this preference.