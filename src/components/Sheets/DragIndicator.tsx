import sheetStyles from "../assets/styles/sheet.module.css";

import Indicator from "../assets/icons/horizontal_rule.svg";

// TODO: button that cycles through snapoints + keyboard usable
export const DragIndicator = () => {
  return (
    <>
    <div className={ sheetStyles.dragIndicator }>
      <Indicator aria-hidden="true" focusable="false" />
    </div>
    </>
  )
}