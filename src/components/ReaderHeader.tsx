import React from "react";

import Locale from "../resources/locales/en.json";

export const ReaderHeader = ({title}: {title: string | undefined}) => {
  return (
    <>
      <header id="top-bar" aria-label="Top Bar">
        <h3 aria-label={Locale.reader.app.header.title}>
          {title
            ? title
            : Locale.reader.app.header.fallback}
        </h3>
      </header>
    </>
  );
}