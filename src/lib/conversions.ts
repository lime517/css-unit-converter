/**
 * CSS Unit Conversion Logic
 *
 * Reference: https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Values_and_units
 *
 * All conversions take a pixel value as input and return the equivalent
 * in the target unit. Context values are provided for relative units.
 */

export interface ConversionContext {
  rootFontSize: number;
  elementFontSize: number;
  viewportWidth: number;
  viewportHeight: number;
  lineHeight: number;
  rootLineHeight: number;
  containerWidth: number;
  containerHeight: number;
  percentageBase: number;
}

export const DEFAULT_CONTEXT: ConversionContext = {
  rootFontSize: 16,
  elementFontSize: 16,
  viewportWidth: 400,
  viewportHeight: 300,
  lineHeight: 24,
  rootLineHeight: 24,
  containerWidth: 400,
  containerHeight: 300,
  percentageBase: 400,
};

// Font-metric ratios (relative to element font size)
const CH_RATIO = 0.5;
const EX_RATIO = 0.5;
const CAP_RATIO = 0.7;
const IC_RATIO = 1.0;

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
    description: "1px = 1/96in",
    convert: (px) => px,
    contextDeps: [],
  },
  {
    unit: "cm",
    name: "Centimeters",
    category: "absolute",
    description: "1cm ≈ 37.8px",
    convert: (px) => px / PX_PER_CM,
    contextDeps: [],
  },
  {
    unit: "mm",
    name: "Millimeters",
    category: "absolute",
    description: "1mm ≈ 3.78px",
    convert: (px) => px / PX_PER_MM,
    contextDeps: [],
  },
  {
    unit: "Q",
    name: "Quarter-millimeters",
    category: "absolute",
    description: "1Q ≈ 0.945px",
    convert: (px) => px / PX_PER_Q,
    contextDeps: [],
  },
  {
    unit: "in",
    name: "Inches",
    category: "absolute",
    description: "1in = 96px",
    convert: (px) => px / PX_PER_INCH,
    contextDeps: [],
  },
  {
    unit: "pt",
    name: "Points",
    category: "absolute",
    description: "1pt ≈ 1.33px",
    convert: (px) => px / PX_PER_PT,
    contextDeps: [],
  },
  {
    unit: "pc",
    name: "Picas",
    category: "absolute",
    description: "1pc = 16px",
    convert: (px) => px / PX_PER_PC,
    contextDeps: [],
  },

  // ========== FONT-RELATIVE ==========
  {
    unit: "em",
    name: "Em",
    category: "font-relative",
    description: "1em = element font size",
    convert: (px, ctx) => px / ctx.elementFontSize,
    contextDeps: ["elementFontSize"],
  },
  {
    unit: "rem",
    name: "Root Em",
    category: "font-relative",
    description: "1rem = root font size",
    convert: (px, ctx) => px / ctx.rootFontSize,
    contextDeps: ["rootFontSize"],
  },
  {
    unit: "ex",
    name: "x-height",
    category: "font-relative",
    description: "1ex ≈ 0.5 × font size",
    convert: (px, ctx) => px / (ctx.elementFontSize * EX_RATIO),
    contextDeps: ["elementFontSize"],
  },
  {
    unit: "ch",
    name: "Character width",
    category: "font-relative",
    description: "1ch ≈ 0.5 × font size",
    convert: (px, ctx) => px / (ctx.elementFontSize * CH_RATIO),
    contextDeps: ["elementFontSize"],
  },
  {
    unit: "cap",
    name: "Cap height",
    category: "font-relative",
    description: "1cap ≈ 0.7 × font size",
    convert: (px, ctx) => px / (ctx.elementFontSize * CAP_RATIO),
    contextDeps: ["elementFontSize"],
  },
  {
    unit: "ic",
    name: "Ideographic advance",
    category: "font-relative",
    description: "1ic ≈ 1.0 × font size",
    convert: (px, ctx) => px / (ctx.elementFontSize * IC_RATIO),
    contextDeps: ["elementFontSize"],
  },
  {
    unit: "lh",
    name: "Line height",
    category: "font-relative",
    description: "1lh = element line-height",
    convert: (px, ctx) => px / ctx.lineHeight,
    contextDeps: ["lineHeight"],
  },
  {
    unit: "rlh",
    name: "Root line height",
    category: "font-relative",
    description: "1rlh = root line-height",
    convert: (px, ctx) => px / ctx.rootLineHeight,
    contextDeps: ["rootLineHeight"],
  },

  // ========== VIEWPORT ==========
  {
    unit: "vw",
    name: "Viewport width",
    category: "viewport",
    description: "1vw = 1% of viewport width",
    convert: (px, ctx) => (px / ctx.viewportWidth) * 100,
    contextDeps: ["viewportWidth"],
  },
  {
    unit: "vh",
    name: "Viewport height",
    category: "viewport",
    description: "1vh = 1% of viewport height",
    convert: (px, ctx) => (px / ctx.viewportHeight) * 100,
    contextDeps: ["viewportHeight"],
  },
  {
    unit: "vmin",
    name: "Viewport minimum",
    category: "viewport",
    description: "1vmin = 1% of smaller dimension",
    convert: (px, ctx) =>
      (px / Math.min(ctx.viewportWidth, ctx.viewportHeight)) * 100,
    contextDeps: ["viewportWidth", "viewportHeight"],
  },
  {
    unit: "vmax",
    name: "Viewport maximum",
    category: "viewport",
    description: "1vmax = 1% of larger dimension",
    convert: (px, ctx) =>
      (px / Math.max(ctx.viewportWidth, ctx.viewportHeight)) * 100,
    contextDeps: ["viewportWidth", "viewportHeight"],
  },
  {
    unit: "vi",
    name: "Viewport inline",
    category: "viewport",
    description: "1vi = 1% of inline axis",
    convert: (px, ctx) => (px / ctx.viewportWidth) * 100,
    contextDeps: ["viewportWidth"],
  },
  {
    unit: "vb",
    name: "Viewport block",
    category: "viewport",
    description: "1vb = 1% of block axis",
    convert: (px, ctx) => (px / ctx.viewportHeight) * 100,
    contextDeps: ["viewportHeight"],
  },
  {
    unit: "svw",
    name: "Small viewport width",
    category: "viewport",
    description: "1svw = 1% of small viewport width",
    convert: (px, ctx) => (px / ctx.viewportWidth) * 100,
    contextDeps: ["viewportWidth"],
  },
  {
    unit: "svh",
    name: "Small viewport height",
    category: "viewport",
    description: "1svh = 1% of small viewport height",
    convert: (px, ctx) => (px / ctx.viewportHeight) * 100,
    contextDeps: ["viewportHeight"],
  },
  {
    unit: "lvw",
    name: "Large viewport width",
    category: "viewport",
    description: "1lvw = 1% of large viewport width",
    convert: (px, ctx) => (px / ctx.viewportWidth) * 100,
    contextDeps: ["viewportWidth"],
  },
  {
    unit: "lvh",
    name: "Large viewport height",
    category: "viewport",
    description: "1lvh = 1% of large viewport height",
    convert: (px, ctx) => (px / ctx.viewportHeight) * 100,
    contextDeps: ["viewportHeight"],
  },
  {
    unit: "dvw",
    name: "Dynamic viewport width",
    category: "viewport",
    description: "1dvw = 1% of dynamic viewport width",
    convert: (px, ctx) => (px / ctx.viewportWidth) * 100,
    contextDeps: ["viewportWidth"],
  },
  {
    unit: "dvh",
    name: "Dynamic viewport height",
    category: "viewport",
    description: "1dvh = 1% of dynamic viewport height",
    convert: (px, ctx) => (px / ctx.viewportHeight) * 100,
    contextDeps: ["viewportHeight"],
  },

  // ========== CONTAINER QUERY ==========
  {
    unit: "cqw",
    name: "Container query width",
    category: "container",
    description: "1cqw = 1% of container width",
    convert: (px, ctx) => (px / ctx.containerWidth) * 100,
    contextDeps: ["containerWidth"],
  },
  {
    unit: "cqh",
    name: "Container query height",
    category: "container",
    description: "1cqh = 1% of container height",
    convert: (px, ctx) => (px / ctx.containerHeight) * 100,
    contextDeps: ["containerHeight"],
  },
  {
    unit: "cqi",
    name: "Container query inline",
    category: "container",
    description: "1cqi = 1% of container inline size",
    convert: (px, ctx) => (px / ctx.containerWidth) * 100,
    contextDeps: ["containerWidth"],
  },
  {
    unit: "cqb",
    name: "Container query block",
    category: "container",
    description: "1cqb = 1% of container block size",
    convert: (px, ctx) => (px / ctx.containerHeight) * 100,
    contextDeps: ["containerHeight"],
  },
  {
    unit: "cqmin",
    name: "Container query min",
    category: "container",
    description: "1cqmin = 1% of smaller dimension",
    convert: (px, ctx) =>
      (px / Math.min(ctx.containerWidth, ctx.containerHeight)) * 100,
    contextDeps: ["containerWidth", "containerHeight"],
  },
  {
    unit: "cqmax",
    name: "Container query max",
    category: "container",
    description: "1cqmax = 1% of larger dimension",
    convert: (px, ctx) =>
      (px / Math.max(ctx.containerWidth, ctx.containerHeight)) * 100,
    contextDeps: ["containerWidth", "containerHeight"],
  },

  // ========== OTHER ==========
  {
    unit: "%",
    name: "Percentage",
    category: "other",
    description: "1% = 1/100 of parent value",
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
  if (!isFinite(value)) return "\u2014";
  if (value === 0) return "0";
  if (Math.abs(value) >= 1000) return value.toFixed(2);
  if (Math.abs(value) >= 1) return value.toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
  // For very small values, use enough precision
  const str = value.toPrecision(6).replace(/0+$/, "").replace(/\.$/, "");
  return str;
}
