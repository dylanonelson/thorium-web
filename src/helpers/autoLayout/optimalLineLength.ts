export interface LineLengthTypography {
  chars: number;
  pageGutter?: number;
  fontFace?: string;
  fontSize?: number;
  letterSpacing?: number;
  wordSpacing?: number;
}

// We’re “embracing” design limitations of the ch length
// See https://developer.mozilla.org/en-US/docs/Web/CSS/length#ch

export const getOptimalLineLength = (typo: LineLengthTypography): number => {
  const fontSize = typo.fontSize || 16;
  const letterSpacing = typo.letterSpacing || 0;
  const padding = typo.pageGutter ? typo.pageGutter * 2 : 0;

  if (typo.fontFace) {
    // We know the font and can use canvas as a proxy
    // to get the optimal width for the number of characters

    const canvas = document.createElement("canvas");
    const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");

    if (ctx) {
      // ch based on 0
      const txt = "0".repeat(typo.chars);

      // Needs loading of fonts
      // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/font#loading_fonts_with_the_css_font_loading_api
      ctx.font = `${fontSize}px ${typo.fontFace}`;

      // Not supported in Safari
      if (Object.hasOwn(ctx, "letterSpacing")) {
        ctx.letterSpacing = letterSpacing.toString() + "px";
      }

      return Math.round(ctx.measureText(txt).width + padding);
    }
  }

  // It’s impractical or impossible to get the font in canvas 
  // so we assume it’s 0.5em wide by 1em tall

  return Math.round((typo.chars * ((fontSize * 0.5) + letterSpacing)) + padding);
}