export interface ISettingsMapObject {
  Comp: React.FC<IAdvancedDisplayProps> | React.ComponentType<any>;
  props?: any;
}

export interface IAdvancedDisplayProps {
  standalone?: boolean;
}