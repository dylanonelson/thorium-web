import { Heading, Switch, SwitchProps } from "react-aria-components";

export interface ThSwitchProps extends SwitchProps {
  label: string;
  heading?: string;
  classNames?: {
    wrapper?: string;
    heading?: string;
    indicator?: string;
  }
}

export const ThSwitch = ({
  label,
  classNames,
  heading, 
  ...props
}: ThSwitchProps) => {
  return(
    <>
    <div className={ classNames?.wrapper }>
      { heading && <Heading className={ classNames?.heading }>{ heading }</Heading> }
      <Switch 
        { ...props }
      >
        <div className={ classNames?.indicator } />
        { label }
      </Switch>
    </div>
    </>
  )
}