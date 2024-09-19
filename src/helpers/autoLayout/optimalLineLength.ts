export interface customFont {
  name: string;
  url: string;
}

export interface LineLengthTypography {
  chars: number;
  pageGutter?: number;
  fontFace?: string | customFont;
  letterSpacing?: number;
  wordSpacing?: number;
}

// We’re “embracing” design limitations of the ch length
// See https://developer.mozilla.org/en-US/docs/Web/CSS/length#ch

export const getOptimalLineLength = (typo: LineLengthTypography): number => {
  const defaultFontSize = 16;
  const letterSpacing = typo.letterSpacing || 0;
  const padding = typo.pageGutter ? typo.pageGutter * 2 : 0;

  const getApproximation = () => {
    return Math.round((typo.chars * ((defaultFontSize * 0.5) + letterSpacing)) + padding) / defaultFontSize;
  }

  const getMeasureText = (canvas: HTMLCanvasElement, fontFace: string) => {
    const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
    if (ctx) {
      // ch based on 0
      const txt = "0".repeat(typo.chars);
      ctx.font = `${defaultFontSize}px ${fontFace}`;
      // Not supported in Safari
      if (Object.hasOwn(ctx, "letterSpacing")) {
        ctx.letterSpacing = letterSpacing.toString() + "px";
      }
      return Math.round(ctx.measureText(txt).width + padding) / defaultFontSize;
    }
    return getApproximation();
  }

  if (typo.fontFace) {
    // We know the font and can use canvas as a proxy
    // to get the optimal width for the number of characters
    const canvas = document.createElement("canvas");
    if (typeof typo.fontFace === "string") {
      return getMeasureText(canvas, typo.fontFace);
    } else {
      const customFont = new FontFace(typo.fontFace.name, `url(${typo.fontFace.url})`);
      customFont.load().then(
        () => {
          document.fonts.add(customFont);
          return getMeasureText(canvas, customFont.family)
        },
        (_err) => {
          return getApproximation();
        });
    }
  }

  // It’s impractical or impossible to get the font in canvas 
  // so we assume it’s 0.5em wide by 1em tall
  return getApproximation();
}