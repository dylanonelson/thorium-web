import { ReactNode } from "react";

import Locale from "../resources/locales/en.json";

import readerLoaderStyles from "./assets/styles/readerLoader.module.css";

import { ThLoader } from "@/packages/Components/Reader/ThLoader";

export const StatefulLoader = ({ isLoading, children }: { isLoading: boolean, children: ReactNode }) => {
  return (
    <>
    <ThLoader 
      isLoading={ isLoading } 
      loader={ <div className={ readerLoaderStyles.readerLoader}>{ Locale.reader.app.loading }</div> } 
      className={ readerLoaderStyles.readerLoaderWrapper } 
    >
      { children }
    </ThLoader>
    </>
  )
}