"use client";

import { ThPagination, ThPaginationProps } from "@/core/Components/Reader/ThPagination";

import readerPaginationStyles from "./assets/styles/readerPagination.module.css";
  
export const StatefulPagination = ({
  ref,
  links,
  compounds,
  ...props
}: ThPaginationProps) => {
  return (
    <ThPagination 
      ref={ ref } 
      className={ readerPaginationStyles.pagination }
      links={ links } 
      compounds={ compounds } 
      { ...props }
    />
  )
}