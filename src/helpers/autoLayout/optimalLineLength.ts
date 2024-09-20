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

  // It’s impractical or impossible to get the font in canvas 
  // so we assume it’s 0.5em wide by 1em tall
  let optimalLineLength = Math.round((typo.chars * ((defaultFontSize * 0.5) + letterSpacing)) + padding) / defaultFontSize;

  const measureText = (canvas: HTMLCanvasElement, fontFace: string) => {
    const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
    if (ctx) {
      // ch based on 0
      const txt = "0".repeat(typo.chars);
      ctx.font = `${defaultFontSize}px ${fontFace}`;

      // Not supported in Safari
      if (Object.hasOwn(ctx, "letterSpacing")) {
        ctx.letterSpacing = letterSpacing.toString() + "px";
        optimalLineLength = Math.round(ctx.measureText(txt).width + padding) / defaultFontSize;
      } else {
        // Instead of filling text with an offset for each character
        // We simply add it to the measured width
        optimalLineLength = Math.round(ctx.measureText(txt).width + (letterSpacing * (typo.chars - 1)) + padding) / defaultFontSize;
      }
    }
  }

  if (typo.fontFace) {
    // We know the font and can use canvas as a proxy
    // to get the optimal width for the number of characters
    const canvas = document.createElement("canvas");
    if (typeof typo.fontFace === "string") {
      measureText(canvas, typo.fontFace);
    } else {
      const customFont = new FontFace(typo.fontFace.name, `url(${typo.fontFace.url})`);
      customFont.load().then(
        () => {
          document.fonts.add(customFont);
          measureText(canvas, customFont.family)
        },
        (_err) => {});
    }
  }

  return optimalLineLength;
}