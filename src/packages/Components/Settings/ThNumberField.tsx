import { ComponentType, SVGProps } from "react";

import AddIcon from "./assets/icons/add.svg";
import RemoveIcon from "./assets/icons/remove.svg";

import { Button, Group, Input, Label, NumberField, NumberFieldProps } from "react-aria-components";

export interface ThNumberFieldProps extends Omit<NumberFieldProps, "minValue" | "maxValue" | "decrementAriaLabel" | "incrementAriaLabel"> {
  ref?: React.ForwardedRef<HTMLInputElement>;
  label?: string;
  range: number[];
  isVirtualKeyboardDisabled?: boolean;
  steppers: {
    decrementIcon?: ComponentType<SVGProps<SVGElement>> | null;
    decrementLabel: string;
    incrementIcon?: ComponentType<SVGProps<SVGElement>> | null;
    incrementLabel: string;
  };
  classNames?: {
    group?: string;
    input?: string;
    label?: string;
    stepper?: string;
  };
}

export const ThNumberField = ({
  ref,
  label,
  range,
  isVirtualKeyboardDisabled,
  steppers,
  classNames,
  ...props
}: ThNumberFieldProps) => {

  return (
    <NumberField 
      ref={ ref }
      minValue={ Math.min(...range) }
      maxValue={ Math.max(...range) }
      decrementAriaLabel={ steppers.decrementLabel }
      incrementAriaLabel={ steppers.incrementLabel }
      { ...props }
    >
      { label && <Label className={ classNames?.label }>
          { label }
        </Label>
      }

      <Group className={ classNames?.group }>
        <Button 
          slot="decrement" 
          className={ classNames?.stepper }
        >
          { steppers.decrementIcon 
            ? <steppers.decrementIcon aria-hidden="true" focusable="false" /> 
            : <AddIcon aria-hidden="true" focusable="false" /> }
        </Button>

        <Input 
          className={ classNames?.input } 
          { ...(isVirtualKeyboardDisabled ? { inputMode: "none" } : {}) } 
        />

        <Button 
          slot="increment" 
          className={ classNames?.stepper }
        >
          { steppers.incrementIcon 
            ? <steppers.incrementIcon aria-hidden="true" focusable="false" /> 
            : <RemoveIcon aria-hidden="true" focusable="false" /> }
        </Button>
      </Group>
    </NumberField>
  );
};