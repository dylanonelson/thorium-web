import React from "react";

import Locale from "../resources/locales/en.json";
import progressionStyles from "./assets/styles/progression.module.css";

import parseTemplate from "json-templates";

export const ProgressionOf = ({current, reference}: {current: number[] | string | undefined, reference: number | string | undefined}) => {
  const jsonTemplate = parseTemplate(Locale.reader.app.progression.of);

  return (
    <>
    <div id={progressionStyles.current} aria-label={Locale.reader.app.progression.wrapper}>
      {jsonTemplate({ current: current?.length === 2 ? `${current[0]}–${current[1]}` : current || "...", reference:  reference || "..." })}
    </div>
    </>
  )
}