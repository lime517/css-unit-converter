/**
 * CSS Unit Conversion Logic
 *
 * Reference: https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Values_and_units
 *
 * All conversions take a pixel value as input and return the equivalent
 * in the target unit. Context values are provided for relative units.
 */

export interface ConversionContext {
  /** Root element (<html>) font size in px. Default: 16 */
  rootFontSize: number;
  /** Current element's font size in px. Default: 16 */
  elementFontSize: number;
  /** Viewport width in px. Default: 1920 */
  viewportWidth: number;
  /** Viewport height in px. Default: 1080 */
  viewportHeight: number;
  /** Element line-height in px. Default: 24 (1.5 * 16) */
  lineHeight: number;
  /** Root line-height in px. Default: 24 (1.5 * 16) */
  rootLineHeight: number;
  /** Width of '0' character in the element's font, in px. Default: ~8.9 */
  chWidth: number;
  /** x-height of the element's font in px. Default: ~8 (roughly half font size) */
  exHeight: number;
  /** Cap height of the element's font in px. Default: ~11.2 (roughly 70% font size) */
  capHeight: number;
  /** Advance measure of "水" (CJK water ideograph) in px. Default: ~16 (matches font size) */
  icWidth: number;
  /** Container width in px. Default: 1920 */
  containerWidth: number;
  /** Container height in px. Default: 1080 */
  containerHeight: number;
  /** Parent element size for percentage calc, in px. Default: 1920 */
  percentageBase: number;
}

export const DEFAULT_CONTEXT: ConversionContext = {
  rootFontSize: 16,
  elementFontSize: 16,
  viewportWidth: 1920,
  viewportHeight: 1080,
  lineHeight: 24,
  rootLineHeight: 24,
  chWidth: 8.9,
  exHeight: 8,
  capHeight: 11.2,
  icWidth: 16,
  containerWidth: 1920,
  containerHeight: 1080,
  percentageBase: 1920,
};

export interface UnitDefinition {
  unit: string;
  name: string;
  category: "absolute" | "font-relative" | "viewport" | "container" | "other";
  description: string;
  convert: (px: number, ctx: ConversionContext) => number;
  /** Which context fields affect this unit */
  contextDeps: (keyof ConversionContext)[];
}

// --- Absolute units ---
// 1in = 96px, 1cm = 96/2.54px, 1mm = 96/25.4px, 1Q = 96/101.6px
// 1pt = 96/72px = 4/3px, 1pc = 96/6px = 16px

const PX_PER_INCH = 96;
const PX_PER_CM = PX_PER_INCH / 2.54;
const PX_PER_MM = PX_PER_CM / 10;
const PX_PER_Q = PX_PER_CM / 40;
const PX_PER_PT = PX_PER_INCH / 72;
const PX_PER_PC = PX_PER_INCH / 6;

export const units: UnitDefinition[] = [
  // ========== ABSOLUTE ==========
  {
    unit: "px",
    name: "Pixels",
    category: "absolute",
    description: "1px = 1/96th of 1in",
    convert: (px) => px,
    contextDeps: [],
  },
  {
    unit: "cm",
    name: "Centimeters",
    category: "absolute",
    description: "1cm = 96/2.54px ≈ 37.8px",
    convert: (px) => px / PX_PER_CM,
    contextDeps: [],
  },
  {
    unit: "mm",
    name: "Millimeters",
    category: "absolute",
    description: "1mm = 1/10th of 1cm",
    convert: (px) => px / PX_PER_MM,
    contextDeps: [],
  },
  {
    unit: "Q",
    name: "Quarter-millimeters",
    category: "absolute",
    description: "1Q = 1/40th of 1cm",
    convert: (px) => px / PX_PER_Q,
    contextDeps: [],
  },
  {
    unit: "in",
    name: "Inches",
    category: "absolute",
    description: "1in = 96px = 2.54cm",
    convert: (px) => px / PX_PER_INCH,
    contextDeps: [],
  },
  {
    unit: "pt",
    name: "Points",
    category: "absolute",
    description: "1pt = 1/72nd of 1in",
    convert: (px) => px / PX_PER_PT,
    contextDeps: [],
  },
  {
    unit: "pc",
    name: "Picas",
    category: "absolute",
    description: "1pc = 1/6th of 1in = 12pt",
    convert: (px) => px / PX_PER_PC,
    contextDeps: [],
  },

  // ========== FONT-RELATIVE ==========
  {
    unit: "em",
    name: "Em",
    category: "font-relative",
    description: "Relative to the element's font size",
    convert: (px, ctx) => px / ctx.elementFontSize,
    contextDeps: ["elementFontSize"],
  },
  {
    unit: "rem",
    name: "Root Em",
    category: "font-relative",
    description: "Relative to the root element's font size",
    convert: (px, ctx) => px / ctx.rootFontSize,
    contextDeps: ["rootFontSize"],
  },
  {
    unit: "ex",
    name: "x-height",
    category: "font-relative",
    description: "Relative to the x-height of the element's font",
    convert: (px, ctx) => px / ctx.exHeight,
    contextDeps: ["exHeight"],
  },
  {
    unit: "ch",
    name: "Character width",
    category: "font-relative",
    description: 'Relative to the width of the "0" (zero) glyph',
    convert: (px, ctx) => px / ctx.chWidth,
    contextDeps: ["chWidth"],
  },
  {
    unit: "cap",
    name: "Cap height",
    category: "font-relative",
    description: "Relative to the cap height of the element's font",
    convert: (px, ctx) => px / ctx.capHeight,
    contextDeps: ["capHeight"],
  },
  {
    unit: "ic",
    name: "Ideographic advance",
    category: "font-relative",
    description: 'Relative to the advance measure of the "水" glyph',
    convert: (px, ctx) => px / ctx.icWidth,
    contextDeps: ["icWidth"],
  },
  {
    unit: "lh",
    name: "Line height",
    category: "font-relative",
    description: "Relative to the element's line-height",
    convert: (px, ctx) => px / ctx.lineHeight,
    contextDeps: ["lineHeight"],
  },
  {
    unit: "rlh",
    name: "Root line height",
    category: "font-relative",
    description: "Relative to the root element's line-height",
    convert: (px, ctx) => px / ctx.rootLineHeight,
    contextDeps: ["rootLineHeight"],
  },

  // ========== VIEWPORT ==========
  {
    unit: "vw",
    name: "Viewport width",
    category: "viewport",
    description: "1vw = 1% of the viewport's width",
    convert: (px, ctx) => (px / ctx.viewportWidth) * 100,
    contextDeps: ["viewportWidth"],
  },
  {
    unit: "vh",
    name: "Viewport height",
    category: "viewport",
    description: "1vh = 1% of the viewport's height",
    convert: (px, ctx) => (px / ctx.viewportHeight) * 100,
    contextDeps: ["viewportHeight"],
  },
  {
    unit: "vmin",
    name: "Viewport minimum",
    category: "viewport",
    description: "1vmin = 1% of the viewport's smaller dimension",
    convert: (px, ctx) =>
      (px / Math.min(ctx.viewportWidth, ctx.viewportHeight)) * 100,
    contextDeps: ["viewportWidth", "viewportHeight"],
  },
  {
    unit: "vmax",
    name: "Viewport maximum",
    category: "viewport",
    description: "1vmax = 1% of the viewport's larger dimension",
    convert: (px, ctx) =>
      (px / Math.max(ctx.viewportWidth, ctx.viewportHeight)) * 100,
    contextDeps: ["viewportWidth", "viewportHeight"],
  },
  {
    unit: "vi",
    name: "Viewport inline",
    category: "viewport",
    description: "1vi = 1% of viewport in the inline axis (width in LTR)",
    convert: (px, ctx) => (px / ctx.viewportWidth) * 100,
    contextDeps: ["viewportWidth"],
  },
  {
    unit: "vb",
    name: "Viewport block",
    category: "viewport",
    description: "1vb = 1% of viewport in the block axis (height in LTR)",
    convert: (px, ctx) => (px / ctx.viewportHeight) * 100,
    contextDeps: ["viewportHeight"],
  },
  {
    unit: "svw",
    name: "Small viewport width",
    category: "viewport",
    description: "1svw = 1% of the small viewport's width",
    convert: (px, ctx) => (px / ctx.viewportWidth) * 100,
    contextDeps: ["viewportWidth"],
  },
  {
    unit: "svh",
    name: "Small viewport height",
    category: "viewport",
    description: "1svh = 1% of the small viewport's height",
    convert: (px, ctx) => (px / ctx.viewportHeight) * 100,
    contextDeps: ["viewportHeight"],
  },
  {
    unit: "lvw",
    name: "Large viewport width",
    category: "viewport",
    description: "1lvw = 1% of the large viewport's width",
    convert: (px, ctx) => (px / ctx.viewportWidth) * 100,
    contextDeps: ["viewportWidth"],
  },
  {
    unit: "lvh",
    name: "Large viewport height",
    category: "viewport",
    description: "1lvh = 1% of the large viewport's height",
    convert: (px, ctx) => (px / ctx.viewportHeight) * 100,
    contextDeps: ["viewportHeight"],
  },
  {
    unit: "dvw",
    name: "Dynamic viewport width",
    category: "viewport",
    description: "1dvw = 1% of the dynamic viewport's width",
    convert: (px, ctx) => (px / ctx.viewportWidth) * 100,
    contextDeps: ["viewportWidth"],
  },
  {
    unit: "dvh",
    name: "Dynamic viewport height",
    category: "viewport",
    description: "1dvh = 1% of the dynamic viewport's height",
    convert: (px, ctx) => (px / ctx.viewportHeight) * 100,
    contextDeps: ["viewportHeight"],
  },

  // ========== CONTAINER QUERY ==========
  {
    unit: "cqw",
    name: "Container query width",
    category: "container",
    description: "1cqw = 1% of the query container's width",
    convert: (px, ctx) => (px / ctx.containerWidth) * 100,
    contextDeps: ["containerWidth"],
  },
  {
    unit: "cqh",
    name: "Container query height",
    category: "container",
    description: "1cqh = 1% of the query container's height",
    convert: (px, ctx) => (px / ctx.containerHeight) * 100,
    contextDeps: ["containerHeight"],
  },
  {
    unit: "cqi",
    name: "Container query inline",
    category: "container",
    description: "1cqi = 1% of the query container's inline size",
    convert: (px, ctx) => (px / ctx.containerWidth) * 100,
    contextDeps: ["containerWidth"],
  },
  {
    unit: "cqb",
    name: "Container query block",
    category: "container",
    description: "1cqb = 1% of the query container's block size",
    convert: (px, ctx) => (px / ctx.containerHeight) * 100,
    contextDeps: ["containerHeight"],
  },
  {
    unit: "cqmin",
    name: "Container query min",
    category: "container",
    description: "1cqmin = 1% of the container's smaller dimension",
    convert: (px, ctx) =>
      (px / Math.min(ctx.containerWidth, ctx.containerHeight)) * 100,
    contextDeps: ["containerWidth", "containerHeight"],
  },
  {
    unit: "cqmax",
    name: "Container query max",
    category: "container",
    description: "1cqmax = 1% of the container's larger dimension",
    convert: (px, ctx) =>
      (px / Math.max(ctx.containerWidth, ctx.containerHeight)) * 100,
    contextDeps: ["containerWidth", "containerHeight"],
  },

  // ========== OTHER ==========
  {
    unit: "%",
    name: "Percentage",
    category: "other",
    description: "Relative to the parent element's value",
    convert: (px, ctx) => (px / ctx.percentageBase) * 100,
    contextDeps: ["percentageBase"],
  },
];

export const unitsByCategory = {
  absolute: units.filter((u) => u.category === "absolute"),
  "font-relative": units.filter((u) => u.category === "font-relative"),
  viewport: units.filter((u) => u.category === "viewport"),
  container: units.filter((u) => u.category === "container"),
  other: units.filter((u) => u.category === "other"),
};

export const categoryLabels: Record<string, string> = {
  absolute: "Absolute",
  "font-relative": "Font-Relative",
  viewport: "Viewport",
  container: "Container Query",
  other: "Other",
};

export function formatValue(value: number): string {
  if (value === 0) return "0";
  if (Math.abs(value) >= 1000) return value.toFixed(2);
  if (Math.abs(value) >= 1) return value.toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
  // For very small values, use enough precision
  const str = value.toPrecision(6).replace(/0+$/, "").replace(/\.$/, "");
  return str;
}
