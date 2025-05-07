"use client";

export interface HTMLAttributesWithRef<T> extends React.HTMLAttributes<T> {
  ref?: React.ForwardedRef<T>;
}