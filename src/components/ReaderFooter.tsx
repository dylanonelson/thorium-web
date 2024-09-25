import React from "react";

export const ReaderFooter = ({className}: {className: string | undefined}) => {
  return (
    <>
      <footer className={className ? className : ""} id="bottom-bar" aria-label="Bottom Bar">
      </footer>
    </>);
}