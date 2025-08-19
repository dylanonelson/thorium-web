"use client";

import React, { CSSProperties, useCallback, useEffect, useRef, useState } from "react";

import { Link } from "@readium/shared";
import { ThActionsKeys, ThDockingKeys, ThSheetTypes, ThLayoutDirection } from "@/preferences/models/enums";
import { StatefulActionContainerProps } from "../models/actions";
import { TocItem } from "@/core/Hooks/useTimeline";

import tocStyles from "./assets/styles/toc.module.css";

import Chevron from "./assets/icons/chevron_right.svg";

import { StatefulSheetWrapper } from "../../Sheets/StatefulSheetWrapper";
import { ThFormSearchField } from "@/core/Components";
import { Button, Collection, Key, Selection, useFilter } from "react-aria-components";
import {
  Tree,
  TreeItem,
  TreeItemContent
} from "react-aria-components";

import { useEpubNavigator } from "@/core/Hooks/Epub/useEpubNavigator";
import { useDocking } from "../../Docking/hooks/useDocking";
import { useI18n } from "@/i18n/useI18n";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setActionOpen } from "@/lib/actionsReducer";
import { setTocEntry } from "@/lib/publicationReducer";
import { setImmersive } from "@/lib/readerReducer";

import { isActiveElement } from "@/core/Helpers/focusUtilities";

export const StatefulTocContainer = ({ triggerRef }: StatefulActionContainerProps) => {
  const { t } = useI18n();

  const treeRef = useRef<HTMLDivElement>(null);
  const [expandedKeys, setExpandedKeys] = useState<Set<Key>>(new Set());

  const unstableTimeline = useAppSelector(state => state.publication.unstableTimeline);
  const tocEntry = unstableTimeline?.toc?.currentEntry;
  const tocTree = unstableTimeline?.toc?.tree;

  const direction = useAppSelector(state => state.reader.direction);
  const isRTL = direction === ThLayoutDirection.rtl;

  const actionState = useAppSelector(state => state.actions.keys[ThActionsKeys.toc]);
  const dispatch = useAppDispatch();

  const { goLink } = useEpubNavigator();

  const docking = useDocking(ThActionsKeys.toc);
  const sheetType = docking.sheetType;

  const { contains } = useFilter({ sensitivity: "base" });
  const [filterValue, setFilterValue] = React.useState("");
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const filterTocTree = (items: TocItem[], filterValue: string): TocItem[] => {
    if (!filterValue) {
      return items;
    }

    const recursiveFilter = (items: TocItem[]): TocItem[] => {
      return items.reduce((acc: TocItem[], item: TocItem) => {
        if (item.title && contains(item.title, filterValue)) {
          acc.push({ ...item, children: undefined });
        }
        if (item.children) {
          acc.push(...recursiveFilter(item.children));
        }
        return acc;
      }, []);
    };

    const result = recursiveFilter(items);
    return result.map((item: TocItem, index: number) => ({ ...item, key: `${item.id}-${index}` }));
  };

  const displayedTocTree = filterTocTree(tocTree || [], filterValue);

  const setOpen = useCallback((value: boolean) => {
    if (!value) setFilterValue("");

    dispatch(setActionOpen({ 
      key: ThActionsKeys.toc,
      isOpen: value 
    }));
  }, [dispatch, setFilterValue]);

  const handleAction = (keys: Selection) => {
    if (keys === "all" || !keys || keys.size === 0) return;

    const key = [...keys][0];
    
    const el = document.querySelector(`[data-key=${key}]`);
    const href = el?.getAttribute("data-href");

    if (!href) return;

    const link: Link = new Link({ href: href });

    const cb = actionState?.isOpen && 
      (sheetType === ThSheetTypes.dockedStart || sheetType === ThSheetTypes.dockedEnd)
        ? () => {
          dispatch(setTocEntry(key));
          dispatch(setImmersive(true));
        } 
        : () => {
          dispatch(setTocEntry(key));
          dispatch(setImmersive(true));
          setOpen(false);
        }

    goLink(link, true, cb);
  };

  // Since React Aria components intercept keys and do not continue propagation
  // we have to handle the escape key in capture phase
  useEffect(() => {
    if (actionState?.isOpen && (!actionState?.docking || actionState?.docking === ThDockingKeys.transient)) {      
      const handleEscape = (event: KeyboardEvent) => {
        if ((!isActiveElement(searchInputRef.current) && !filterValue) && event.key === "Escape" ) {
          setOpen(false);
        }
      };

      document.addEventListener("keydown", handleEscape, true);

      return () => {
        document.removeEventListener("keydown", handleEscape, true);
      };
    }
  }, [actionState, setOpen, filterValue]);

  // Update expanded keys when tocEntry changes
  useEffect(() => {
    if (tocEntry && tocTree) {
      setExpandedKeys(prevExpandedKeys => {
        // Start with the current expanded keys to preserve existing state
        const newExpandedKeys = new Set<Key>(prevExpandedKeys);
        let hasUpdates = false;
        
        // Helper function to find and expand parent items of the current entry
        const updateExpanded = (items: TocItem[]): boolean => {
          return items.some(item => {
            if (item.id === tocEntry) return true;
            if (item.children) {
              const hasChild = updateExpanded(item.children);
              if (hasChild && !newExpandedKeys.has(item.id)) {
                newExpandedKeys.add(item.id);
                hasUpdates = true;
              }
              return hasChild;
            }
            return false;
          });
        };
        
        // Only update state if we actually need to expand anything
        updateExpanded(tocTree);
        return hasUpdates ? newExpandedKeys : prevExpandedKeys;
      });
    }
  }, [tocEntry, tocTree]);

  return(
    <>
    <StatefulSheetWrapper 
      sheetType={ sheetType }
      sheetProps={ {
        id: ThActionsKeys.toc,
        triggerRef: triggerRef, 
        heading: t("reader.toc.heading"),
        className: tocStyles.toc,
        placement: "bottom",
        isOpen: actionState?.isOpen || false,
        onOpenChange: setOpen,
        onClosePress: () => setOpen(false),
        docker: docking.getDocker(),
        focusWithinRef: treeRef
      } }
    >
      { tocTree && tocTree.length > 0 
      ? (<>
        <ThFormSearchField
          aria-label={ t("reader.toc.search.label") }
          value={ filterValue }
          onChange={ setFilterValue }
          onClear={ () => setFilterValue("") }
          className={ tocStyles.tocSearch }
          compounds={{
            label: {
              className: tocStyles.tocSearchLabel
            },
            input: {
              ref: searchInputRef,
              className: tocStyles.tocSearchInput,
              placeholder: t("reader.toc.search.placeholder")
            },
            searchIcon: {
              className: tocStyles.tocSearchIcon,
              hidden: !!filterValue
            },
            clearButton: {
              className: tocStyles.tocClearButton,
              isDisabled: !filterValue
            }
          }}
        />
        <Tree
          ref={ treeRef }
          aria-label={ t("reader.toc.entries") }
          selectionMode="single"
          items={ displayedTocTree }
          className={ tocStyles.tocTree }
          onSelectionChange={ handleAction }
          selectedKeys={ tocEntry ? [tocEntry] : [] }
          expandedKeys={ expandedKeys }
          onExpandedChange={ setExpandedKeys }
        >
          { function renderItem(item) {
            return (
              <TreeItem
                data-href={ item.href }
                className={ tocStyles.tocTreeItem }
                textValue={ item.title || "" }
              >
                <TreeItemContent>
                  {item.children && (
                    <Button
                      slot="chevron"
                      className={tocStyles.tocTreeItemButton}
                      style={{ transform: isRTL ? "scaleX(-1)" : "none" } as CSSProperties}
                    >
                      <Chevron aria-hidden="true" focusable="false" />
                    </Button>
                  )}
                  <div className={ tocStyles.tocTreeItemText }>
                    <div className={ tocStyles.tocTreeItemTextTitle }>{ item.title }</div>
                    { item.position && <div className={ tocStyles.tocTreeItemTextPosition }>{ item.position }</div> }
                  </div>
                </TreeItemContent>
                <Collection items={ item.children }>
                  { renderItem }
                </Collection>
              </TreeItem>
            );
          } }
        </Tree>
      </>) 
      : <div className={ tocStyles.empty }>{ t("reader.toc.empty") }</div>
    }
    </StatefulSheetWrapper>
    </>
  )
}