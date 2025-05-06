"use client";

import React, { Fragment } from "react";

import { ThActionsBar, ThActionsBarProps } from "./ThActionsBar";
import { ThActionsTriggerVariant } from "./ThActionsTriggerVariant";
import { ThMenu, THMenuProps } from "../Menu/ThMenu";

import { useObjectRef } from "react-aria";
import { CollapsiblePref, useCollapsibility } from "./hooks/useCollapsibility";

export interface ThActionEntry<T> {
  key: T;
  associatedKey?: string;
  Trigger: React.ComponentType<any>;
  Target?: React.ComponentType<any>;
}

export interface ThCollapsibleActionsBarProps extends ThActionsBarProps {
  id: string;
  items: ThActionEntry<string>[];
  prefs: CollapsiblePref;
  breakpoint?: string;
  children?: never;
  overflowMenu?: THMenuProps<string> | React.ReactElement<typeof ThMenu>;
}

export const ThCollapsibleActionsBar = ({
  ref,
  id,
  items,
  prefs,
  breakpoint,
  overflowMenu,
  ...props
}: ThCollapsibleActionsBarProps) => {
  const resolvedRef = useObjectRef(ref);
  const Actions = useCollapsibility(items, prefs, breakpoint);
  console.log(overflowMenu);

  return (
    <>
    <ThActionsBar 
      ref={ resolvedRef }
      { ...props }
    >
      { Actions.ActionIcons.map(({ Trigger, Target, key, associatedKey }) => 
          <Fragment key={ key }>
            <Trigger 
              key={ `${ key }-trigger` } 
              variant={ ThActionsTriggerVariant.button }
              { ...(associatedKey ? { associatedKey: associatedKey } : {}) } 
              { ...props }
            />
            { Target && <Target key={ `${ key }-container` } triggerRef={ resolvedRef } /> }
          </Fragment>
        ) 
      }

      { React.isValidElement(overflowMenu) 
        ? (React.cloneElement(overflowMenu, {
          ...overflowMenu.props,
          id: id,
          triggerRef: resolvedRef,
          items: Actions.MenuItems,
          dependencies: ["Trigger"],
        } as THMenuProps<string>)) 
        : (<ThMenu 
          id={ id } 
          triggerRef={ resolvedRef }
          items={ Actions.MenuItems }
          dependencies={ ["Trigger"] }
          { ...overflowMenu }
        />
      )}
    </ThActionsBar>
    </>
  )
}
