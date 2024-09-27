export const isInteractiveElement = (element: Element | null) => {
  let interactive = false;

  const iElements = ["A", "AREA", "BUTTON", "INPUT", "SELECT", "TEXTAREA"];

  if (element) {
    if (iElements.includes(element.tagName)) interactive = true;
    if (element.hasAttribute("disabled")) interactive = false;
    if (element.getAttribute("tabindex") === "-1") interactive = false;
    if (element.getAttribute("tabindex") === "0") interactive = true;
  }

  return interactive;
}