import { useCallback } from "react";

import { RSPrefs } from "@/preferences";
import Locale from "../../../resources/locales/en.json";

import { ActionComponentVariant, IActionComponent } from "@/models/actions";
import { DockingKeys } from "@/models/docking";

import readerSharedUI from "../../assets/styles/readerSharedUI.module.css";

import DockToLeft from "../../assets/icons/dock_to_right.svg";

import { ActionIcon } from "@/components/Templates/ActionIcon";
import { OverflowMenuItem } from "@/components/Templates/OverflowMenuItem";

import { useDocking } from "@/hooks/useDocking";

export const DockLeftAction: React.FC<IActionComponent> = ({ variant, associatedKey }) => {
  const docking = useDocking(associatedKey);

  const handlePress = useCallback(() => {
    docking.setStart();
  }, [docking]);
  
  if (variant && variant === ActionComponentVariant.menu) {
    return(
      <>
      <OverflowMenuItem 
        label={ Locale.reader.app.docker.dockToLeft.trigger }
        SVG={ DockToLeft } 
        shortcut={ RSPrefs.docking.keys[DockingKeys.left].shortcut }
        onActionCallback={ handlePress } 
        id={ `${ DockingKeys.left }-${ associatedKey }` }
        isDisabled={ docking.left ? true : false }
      />
      </>
    )
  } else {
    return(
      <>
      <ActionIcon 
        className={ readerSharedUI.dockerButton }  
        ariaLabel={ Locale.reader.app.docker.dockToLeft.trigger }
        SVG={ DockToLeft } 
        placement="bottom" 
        tooltipLabel={ Locale.reader.app.docker.dockToLeft.tooltip } 
        onPressCallback={ handlePress } 
        isDisabled={ docking.left ? true : false }
      />
      </>
    )
  }
}