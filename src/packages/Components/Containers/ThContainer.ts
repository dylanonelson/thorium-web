"use client";

import React from "react";

import { UseFirstFocusableProps } from "./hooks";

export enum ThContainerHeaderVariant {
  close = "close",
  docker = "docker",
  previous = "previous"
}

export interface ThContainerProps {
  ref?: React.RefObject<HTMLDivElement | null>;
  focusOptions?: UseFirstFocusableProps
  children: React.ReactNode;
}