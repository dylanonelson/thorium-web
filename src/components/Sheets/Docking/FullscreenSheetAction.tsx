import { useCallback } from "react";

import { RSPrefs } from "@/preferences";
import Locale from "../../../resources/locales/en.json";

import { ActionComponentVariant, IActionComponent } from "@/models/actions";
import { DockingKeys } from "@/models/docking";

import readerSharedUI from "../../assets/styles/readerSharedUI.module.css";

import Dialog from "../../assets/icons/dialogs.svg";

import { ActionIcon } from "@/components/Templates/ActionIcon";
import { OverflowMenuItem } from "@/components/Templates/OverflowMenuItem";

import { useDocking } from "@/hooks/useDocking";

export const FullscreenSheetAction: React.FC<IActionComponent> = ({ variant, associatedKey }) => {
  const docking = useDocking(associatedKey);

  const handlePress = useCallback(() => {
    docking.undock()
  }, [docking]);
  
  if (variant && variant === ActionComponentVariant.menu) {
    return(
      <>
      <OverflowMenuItem 
        label={ Locale.reader.app.docker.fullscreen.trigger }
        SVG={ Dialog } 
        shortcut={ RSPrefs.docking.keys[DockingKeys.transient].shortcut }
        onActionCallback={ handlePress } 
        id={ `${ DockingKeys.transient }-${ associatedKey }` } 
        isDisabled={ docking.isUndocked() }
      />
      </>
    )
  } else {
    return(
      <>
      <ActionIcon 
        className={ readerSharedUI.dockerButton }  
        ariaLabel={ Locale.reader.app.docker.fullscreen.trigger }
        SVG={ Dialog } 
        placement="bottom" 
        tooltipLabel={ Locale.reader.app.docker.fullscreen.tooltip } 
        onPressCallback={ handlePress } 
        isDisabled={ docking.isUndocked() }
      />
      </>
    )
  }
}