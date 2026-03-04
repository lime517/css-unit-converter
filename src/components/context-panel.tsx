import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ConversionContext } from "@/lib/conversions";
import { DEFAULT_CONTEXT } from "@/lib/conversions";
import { RotateCcw } from "lucide-react";

interface ContextField {
  key: keyof ConversionContext;
  label: string;
  suffix: string;
}

const contextFields: ContextField[] = [
  { key: "rootFontSize", label: "Root font size", suffix: "px" },
  { key: "elementFontSize", label: "Element font size", suffix: "px" },
  { key: "lineHeight", label: "Line height", suffix: "px" },
  { key: "rootLineHeight", label: "Root line height", suffix: "px" },

  { key: "viewportWidth", label: "Viewport width", suffix: "px" },
  { key: "viewportHeight", label: "Viewport height", suffix: "px" },
  { key: "containerWidth", label: "Container width", suffix: "px" },
  { key: "containerHeight", label: "Container height", suffix: "px" },
  { key: "percentageBase", label: "% base (parent)", suffix: "px" },
];

interface ContextPanelProps {
  context: ConversionContext;
  onChange: (ctx: ConversionContext) => void;
}

export function ContextPanel({ context, onChange }: ContextPanelProps) {
  function handleChange(key: keyof ConversionContext, value: string) {
    const num = parseFloat(value);
    onChange({ ...context, [key]: isNaN(num) ? 0 : num });
  }

  function handleReset() {
    onChange({ ...DEFAULT_CONTEXT });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Context Values
        </h3>
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>
      <p className="text-xs text-muted-foreground">
        These values are used for relative unit conversions. Adjust them to
        match your use case.
      </p>
      <div className="grid gap-3">
        {contextFields.map((field) => (
          <div key={field.key} className="grid grid-cols-2 items-center gap-2">
            <Label htmlFor={field.key} className="text-xs">
              {field.label}
            </Label>
            <div className="relative">
              <Input
                id={field.key}
                type="number"
                step="any"
                value={context[field.key] || ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className="h-8 text-xs pr-8"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                {field.suffix}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
