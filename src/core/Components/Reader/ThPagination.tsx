"use client";

import { Button, ButtonProps } from "react-aria-components";
import { WithRef } from "../customTypes";

export interface ThPaginationLinkProps {
  label: React.ReactNode;
  onPress: () => void;
}

export interface ThPaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.RefObject<HTMLDivElement>;
  children?: never;
  links?: {
    previous?: ThPaginationLinkProps;
    next?: ThPaginationLinkProps;
  };
  compounds?: {
    listItem?: React.HTMLAttributes<HTMLLIElement>;
    previousButton?: Exclude<WithRef<ButtonProps, HTMLButtonElement>, "type"> | React.ReactElement<typeof Button>;
    nextButton?: Exclude<WithRef<ButtonProps, HTMLButtonElement>, "type"> | React.ReactElement<typeof Button>;
  };
}

export const ThPagination = ({
  ref,
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
          </Button>
        </li>
      )}
    </nav>
  );
};