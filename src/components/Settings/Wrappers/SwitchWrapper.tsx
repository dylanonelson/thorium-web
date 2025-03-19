import settingsStyles from "../../assets/styles/readerSettings.module.css";

import { ISettingsSwitchProps } from "@/models/settings";

import { Heading, Switch, SwitchProps } from "react-aria-components";

import classNames from "classnames";

export const SwitchWrapper: React.FC<SwitchProps & ISettingsSwitchProps> = ({
  name,
  className,
  heading, 
  label,
  onChangeCallback,
  isSelected,
  isDisabled,
  isReadOnly,
  ...props
}) => {
  return(
    <>
    <div className={ settingsStyles.readerSettingsGroup }>
      { heading && <Heading className={ settingsStyles.readerSettingsLabel }>{ heading }</Heading> }
      <Switch 
        name={ name }
        className={ classNames(settingsStyles.readerSettingsSwitch, className) }
        isSelected={ isSelected }
        onChange={ onChangeCallback }
        isDisabled={ isDisabled }
        isReadOnly={ isReadOnly }
        { ...props }
      >
        <div className={ settingsStyles.readerSettingsSwitchIndicator } />
        { label }
      </Switch>
    </div>
    </>
  )
}