import React, { useEffect, useState } from "react";

import Locale from "../resources/locales/en.json";
import progressionStyles from "./assets/styles/progression.module.css";

import parseTemplate from "json-templates";

import { Locator } from "@readium/shared";

export interface IProgression {
  list?: Locator[];
  total?: number;
  currentNumbers?: number[];
  relativeProgression?: number;
  currentChapter?: string;
  totalProgression?: number;
  currentPublication?: string;
}

export const ProgressionOf = ({progression}: {progression: IProgression}) => {
  const jsonTemplate = parseTemplate(Locale.reader.app.progression.of);
  const [current, setCurrent] = useState("");
  const [reference, setReference] = useState("");

  useEffect(() => {
    if (progression.total && progression.currentNumbers) {
      setCurrent(progression.currentNumbers.length === 2 ? `${progression.currentNumbers[0]}–${progression.currentNumbers[1]}` : `${progression.currentNumbers}`);
      setReference(`${progression.total}`);
    } else if (progression.totalProgression !== undefined && progression.currentPublication) {
      setCurrent(`${Math.round(progression.totalProgression * 100)}%`);
      setReference(progression.currentPublication);
    } else if (progression.relativeProgression !== undefined && progression.currentChapter) {
      setCurrent(`${Math.round(progression.relativeProgression * 100)}%`);
      setReference(progression.currentChapter);
    } else {
      setCurrent("");
      setReference("");
    }
  }, [progression])

  return (
    <>
    {(current && reference) && <div id={progressionStyles.current} aria-label={Locale.reader.app.progression.wrapper}>
      {jsonTemplate({ current: current, reference: reference })}
    </div>}
    </>
  )
}