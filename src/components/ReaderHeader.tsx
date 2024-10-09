import React from "react";

import Locale from "../resources/locales/en.json";
import settingsStyles from "./assets/styles/readerSettings.module.css";

import classNames from "classnames";

import { ReaderSettings } from "./ReaderSettings";

export const ReaderHeader = ({ className, title, isFXL }: { className: string, title: string | undefined, isFXL: boolean }) => {
  return (
    <>
      <header className={classNames(settingsStyles.header, className ? className : "")} id="top-bar" aria-label="Top Bar">
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