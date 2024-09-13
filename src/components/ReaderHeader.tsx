import React from "react";

export const ReaderHeader = ({title}: {title: string | undefined}) => {
  return (
    <>
      <header id="top-bar" aria-label="Top Bar">
        <h3 aria-label="Publication title">
          {title
            ? title
            : "Loading..."}
        </h3>
      </header>
    </>
  );
}