"use client";

import React from "react";

import { Button, ButtonProps } from "react-aria-components";
import { WithRef } from "../customTypes";

import ArrowBack from "../assets/icons/arrow_back.svg";
import ArrowForward from "../assets/icons/arrow_forward.svg";

export interface ThPaginationLinkProps {
  label: React.ReactNode;
  onPress: () => void;
}

export interface ThPaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.RefObject<HTMLDivElement>;
  direction?: "left" | "right";
  children?: never;
  links?: {
    previous?: ThPaginationLinkProps;
    next?: ThPaginationLinkProps;
  };
  compounds?: {
    listItem?: React.HTMLAttributes<HTMLLIElement>;
    previousButton?: Exclude<WithRef<ButtonProps, HTMLButtonElement>, "type">;
    nextButton?: Exclude<WithRef<ButtonProps, HTMLButtonElement>, "type">;
  };
}

export const ThPagination = ({
  ref,
  direction = "left",
  links,
  compounds,
  ...props
}: ThPaginationProps) => {
  if (!links) {
    return null;
  }

  const { previous, next } = links;

  return (
    <nav
      ref={ ref }
      { ...props }
    >
      { previous && (
        <li { ...compounds?.listItem }>
          <Button
            onPress={ previous.onPress }
            { ...compounds?.previousButton }
            type="button"
          >
            { direction === "left"
              ? <ArrowBack aria-hidden="true" focusable="false" />
              : <ArrowForward aria-hidden="true" focusable="false" />
            }
            { previous.label }
          </Button>
        </li>
      )}
      { next && (
        <li { ...compounds?.listItem }>
          <Button
            onPress={ next.onPress }
            { ...compounds?.nextButton }
            type="button"
          >
            { next.label }
            { direction === "left"
              ? <ArrowForward aria-hidden="true" focusable="false" />
              : <ArrowBack aria-hidden="true" focusable="false" />
            }
          </Button>
        </li>
      )}
    </nav>
  );
};