"use client";

import { WithRef } from "../customTypes";

import { 
  Label, 
  LabelProps, 
  Slider, 
  SliderOutput, 
  SliderOutputProps, 
  SliderProps, 
  SliderThumb, 
  SliderThumbProps, 
  SliderTrack, 
  SliderTrackProps 
} from "react-aria-components";

export interface ThSliderProps extends Omit<SliderProps, "minValue" | "maxValue"> {
  ref?: React.ForwardedRef<HTMLDivElement>;
  label?: string;
  range: number[];
  compounds?: {
    /**
     * Props for the label component. See `LabelProps` for more information.
     */
    label?: WithRef<LabelProps, HTMLLabelElement>;
    /**
     * Props for the slider output component. See `SliderOutputProps` for more information.
     */
    output?: WithRef<SliderOutputProps, HTMLOutputElement>;
    /**
     * Props for the slider track component. See `SliderTrackProps` for more information.
     */
    track?: WithRef<SliderTrackProps, HTMLDivElement>;
    /**
     * Props for the slider thumb component. See `SliderThumbProps` for more information.
     */
    thumb?: WithRef<SliderThumbProps, HTMLDivElement>;
  };
}

export const ThSlider = ({
  ref,
  label,
  range,
  compounds,
  ...props
}: ThSliderProps) => {
  return(
    <>
    <Slider 
      ref={ ref }
      minValue={ Math.min(...range) }
      maxValue={ Math.max(...range) }
      { ...props }
    >
      { label && <Label { ...compounds?.label }>
          { label }
        </Label> 
      }
      <SliderOutput { ...compounds?.output } />
      <SliderTrack { ...compounds?.track }>
        <SliderThumb { ...compounds?.thumb } />
      </SliderTrack>
    </Slider>
    </>
  )
}