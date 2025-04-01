import Locale from "../resources/locales/en.json";

import { IBackButton } from "@/models/actions";

import readerSharedUI from "./assets/styles/readerSharedUI.module.css";

import { Button } from "react-aria-components";

import classNames from "classnames";

export const BackButton = ({
  ref,
  className,
  label,
  onPressCallback
}: IBackButton) => {
  
  return (
    <>
    <Button 
      ref={ ref }
      className={ classNames(className, readerSharedUI.backButton) } 
      aria-label={ label || Locale.reader.app.back.trigger } 
      onPress={ onPressCallback }
    >
      { Locale.reader.app.back.trigger }
    </Button>
    </>
  )
}