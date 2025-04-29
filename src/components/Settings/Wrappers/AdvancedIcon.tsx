import React, { useRef } from "react";

import { RSPrefs } from "@/preferences";

import { ActionIconProps } from "@/components/ActionTriggers/ActionIcon";

import readerSharedUI from "../../assets/styles/readerSharedUI.module.css";

import SettingIcon from "../../assets/icons/settings.svg";

import { ActionButton } from "@/packages/Components/Buttons/ActionButton";

import { isActiveElement } from "@/helpers/focus";

import classNames from "classnames";

export const AdvancedIcon = ({
  placement,
  tooltipLabel,
  ...props
  }: Omit<ActionIconProps, "visibility">) => {
  const triggerRef = useRef<HTMLButtonElement>(null);

  const blurOnEsc = (event: React.KeyboardEvent) => {
  // TODO: handle Tooltip cos first time you press esc, it’s the tooltip that is closed.
    if (triggerRef.current && isActiveElement(triggerRef.current) && event.code === "Escape") {
      triggerRef.current.blur();
    }
  };

  return (
    <ActionButton
      ref={ triggerRef }
      className={ classNames(readerSharedUI.icon, props.className) } 
      onKeyDown={ blurOnEsc } 
      tooltip={ tooltipLabel ? {
        trigger: { 
          delay: RSPrefs.theming.icon.tooltipDelay, 
          closeDelay: RSPrefs.theming.icon.tooltipDelay 
        },
        tooltip: {
          className: readerSharedUI.tooltip,
          placement: placement,
          offset: RSPrefs.theming.icon.tooltipOffset || 0
        },
        label: tooltipLabel
      } : undefined }
      { ...Object.fromEntries(Object.entries(props).filter(([key]) => key !== "className")) }
    >
      <SettingIcon aria-hidden="true" focusable="false" />  
    </ActionButton>
  )
};