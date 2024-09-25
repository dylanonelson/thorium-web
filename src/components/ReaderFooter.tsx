import React from "react";

import Locale from "../resources/locales/en.json";

export const ReaderFooter = ({className}: {className: string | undefined}) => {
  return (
    <>
      <footer className={className ? className : ""} id="bottom-bar" aria-label={Locale.reader.app.footer}>
      </footer>
    </>);
}