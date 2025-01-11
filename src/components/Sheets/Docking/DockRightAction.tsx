import { useCallback } from "react";

import { RSPrefs } from "@/preferences";
import Locale from "../../../resources/locales/en.json";

import { ActionComponentVariant, IActionComponent } from "@/models/actions";
import { DockingKeys } from "@/models/docking";

import readerSharedUI from "../../assets/styles/readerSharedUI.module.css";

import DocktoRight from "../../assets/icons/dock_to_left.svg";

import { ActionIcon } from "@/components/Templates/ActionIcon";
import { OverflowMenuItem } from "@/components/Templates/OverflowMenuItem";

import { useDocking } from "@/hooks/useDocking";

export const DockRightAction: React.FC<IActionComponent> = ({ variant, associatedKey }) => {
  const docking = useDocking(associatedKey);
  
  const handlePress = useCallback(() => {
    docking.setEnd();
  }, [docking]);
  
  if (variant && variant === ActionComponentVariant.menu) {
    return(
      <>
      <OverflowMenuItem 
        label={ Locale.reader.app.docker.dockToRight.trigger }
        SVG={ DocktoRight } 
        shortcut={ RSPrefs.docking.keys[DockingKeys.right].shortcut }
        onActionCallback={ handlePress } 
        id={ `${ DockingKeys.right }-${ associatedKey }` }
        isDisabled={ docking.right ? true : false }
      />
      </>
    )
  } else {
    return(
      <>
      <ActionIcon 
        className={ readerSharedUI.dockerButton }  
        ariaLabel={ Locale.reader.app.docker.dockToRight.trigger }
        SVG={ DocktoRight } 
        placement="bottom" 
        tooltipLabel={ Locale.reader.app.docker.dockToRight.tooltip } 
        onPressCallback={ handlePress } 
        isDisabled={ docking.right ? true : false }
      />
      </>
    )
  }
}