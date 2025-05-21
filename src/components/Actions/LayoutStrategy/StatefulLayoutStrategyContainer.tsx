"use client";

import Locale from "../../../resources/locales/en.json";

import { ThActionsKeys } from "@/preferences/models/enums";
import { StatefulActionContainerProps } from "../models/actions";

import settingsStyles from "../../Settings/assets/styles/settings.module.css";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setActionOpen } from "@/lib/actionsReducer";
import { setHovering } from "@/lib/readerReducer";

import { useDocking } from "../../Docking/hooks/useDocking";
import { StatefulSheetWrapper } from "../../Sheets/StatefulSheetWrapper";
import { StatefulLayoutStrategyGroup } from "../../Settings/LayoutStrategy/StatefulLayoutStrategyGroup";

/*
export const StatefulLayoutStrategyContainer = ({ triggerRef }: StatefulActionContainerProps) => {
  const actionState = useAppSelector(state => state.actions.keys[ThActionsKeys.layoutStrategy]);
  const dispatch = useAppDispatch();
  
  const docking = useDocking(ThActionsKeys.layoutStrategy);
  const sheetType = docking.sheetType;

  const setOpen = (value: boolean) => {    
    dispatch(setActionOpen({
      key: ThActionsKeys.layoutStrategy,
      isOpen: value
    }));

    // hover false otherwise it tends to stay on close button press…
    if (!value) dispatch(setHovering(false));
  }

  return(
    <>
    <StatefulSheetWrapper 
      sheetType={ sheetType }
      sheetProps={ {
        id: ThActionsKeys.layoutStrategy,
        triggerRef: triggerRef,
        heading: Locale.reader.layoutStrategy.heading,
        className: settingsStyles.readerSettings,
        placement: "bottom", 
        isOpen: actionState.isOpen || false,
        onOpenChange: setOpen, 
        onPressClose: () => setOpen(false),
        docker: docking.getDocker()
      } }
    >
      <StatefulLayoutStrategyGroup />
    </StatefulSheetWrapper>
    </>
  )
}
  */