export enum ScrollAffordancePref {
  none = "none",
  prev = "previous",
  next = "next",
  both = "both"
}

export enum ScrollBackTo {
  top = "top",
  bottom = "bottom",
  untouched = "untouched"
}

export const RSPrefs = {
  breakpoint: 1024, // width in pixels
  typography: {
    minimalLineLength: 35, // number of characters. If 2 cols will switch to 1 based on this
    optimalLineLength: 75, // number of characters. If auto layout, picks colCount based on this
    pageGutter: 20 // body padding in px
  },
  scroll: {
    topAffordance: ScrollAffordancePref.none,
    bottomAffordance: ScrollAffordancePref.both,
    backTo: ScrollBackTo.top
  },
  theming: {
    arrow: {
      size: 40, // Size of the left and right arrows in px
      offset: 5 // offset of the arrows from the edges in px
    },
    color: {
      primary: "#4d4d4d",
      secondary: "white",
      disabled: "#767676",
      subdued: "#999999"
    },
    icon: {
      size: 32, // Size of icons in px
    }
  }
}