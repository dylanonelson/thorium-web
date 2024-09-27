export const isInteractiveElement = (element: Element | null) => {
  let interactive = false;

  const iElements = ["A", "AREA", "BUTTON", "DETAILS", "INPUT", "SELECT", "TEXTAREA"];

  if (element) {
    if (iElements.includes(element.tagName)) interactive = true;
    if (element.hasAttribute("disabled")) interactive = false;
    if (element.hasAttribute("tabindex")) {
      interactive = Number(element.getAttribute("tabindex")) >= 0; 
    };
  }

  return interactive;
}