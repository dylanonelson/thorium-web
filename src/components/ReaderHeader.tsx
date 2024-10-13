import React from "react";

import Locale from "../resources/locales/en.json";
import settingsStyles from "./assets/styles/readerSettings.module.css";
import readerStateStyles from "./assets/styles/readerStates.module.css";
import { useAppSelector } from "@/lib/hooks";

import classNames from "classnames";

import { ReaderSettings } from "./ReaderSettings";

export const ReaderHeader = ({ title }: { title: string | undefined }) => {
  const isImmersive = useAppSelector(state => state.reader.isImmersive);
  const isFXL = useAppSelector(state => state.reader.isFXL) || false;

  return (
    <>
      <header className={classNames(settingsStyles.header, isImmersive ? readerStateStyles.immersive : "")} id="top-bar" aria-label="Top Bar">
        <h1 aria-label={Locale.reader.app.header.title}>
          {title
            ? title
            : Locale.reader.app.header.fallback}
        </h1>
        <ReaderSettings isFXL={isFXL} />
      </header>
    </>
  );
}