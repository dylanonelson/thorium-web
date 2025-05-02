import { Label, Slider, SliderOutput, SliderProps, SliderThumb, SliderTrack } from "react-aria-components";

export interface ThSliderProps extends Omit<SliderProps, "minValue" | "maxValue"> {
  label?: string;
  range: number[];
  classNames?: {
    label?: string;
    output?: string;
    track?: string;
    thumb?: string;
  };
}

export const ThSlider = ({
  label,
  range,
  classNames,
  ...props
}: ThSliderProps) => {
  return(
    <>
    <Slider 
      minValue={ Math.min(...range) }
      maxValue={ Math.max(...range) }
      { ...props }
    >
      { label && <Label className={ classNames?.label }>{ label }</Label> }
      <SliderOutput className={ classNames?.output } />
      <SliderTrack className={ classNames?.track }>
        <SliderThumb className={ classNames?.thumb } />
      </SliderTrack>
    </Slider>
    </>
  )
}