export enum ActionComponentVariant {
  button = "iconButton",
  menu = "menuItem"
}

export interface IActionComponent {
  variant: ActionComponentVariant;
}