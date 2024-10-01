import React, { useEffect } from "react";

import Locale from "../resources/locales/en.json";
import progressionStyles from "./assets/styles/progression.module.css";

import parseTemplate from "json-templates";

export const Progression = ({positionNumbers, totalPositions}: {positionNumbers: number[] | undefined, totalPositions: number | undefined}) => {
  const jsonTemplate = parseTemplate(Locale.reader.app.progression.numbers);

  return (
    <>
    <div id={progressionStyles.current} aria-label={Locale.reader.app.progression.wrapper}>
      {jsonTemplate({ current: positionNumbers?.length === 2 ? `${positionNumbers[0]}–${positionNumbers[1]}` : positionNumbers || "...", total:  totalPositions || "..." })}
    </div>;
    </>
  )
}