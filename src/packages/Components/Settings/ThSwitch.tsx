import { Heading, Switch, SwitchProps } from "react-aria-components";

export interface ThSwitchProps extends SwitchProps {
  ref?: React.ForwardedRef<HTMLLabelElement>;
  label: string;
  heading?: string;
  classNames?: {
    wrapper?: string;
    heading?: string;
    indicator?: string;
  }
}

export const ThSwitch = ({
  ref,
  label,
  classNames,
  heading, 
  ...props
}: ThSwitchProps) => {
  return(
    <>
    <div className={ classNames?.wrapper }>
      { heading && <Heading className={ classNames?.heading }>
          { heading }
        </Heading> 
      }
      <Switch 
        ref={ ref }
        { ...props }
      >
        <div className={ classNames?.indicator } />
        { label }
      </Switch>
    </div>
    </>
  )
}