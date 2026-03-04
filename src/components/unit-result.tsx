import { useState } from "react";
import type { UnitDefinition, ConversionContext } from "@/lib/conversions";
import { formatValue } from "@/lib/conversions";
import { Check, Copy } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UnitResultProps {
  unit: UnitDefinition;
  pxValue: number;
  context: ConversionContext;
}

export function UnitResult({ unit, pxValue, context }: UnitResultProps) {
  const [copied, setCopied] = useState(false);
  const converted = unit.convert(pxValue, context);
  const formatted = formatValue(converted);
  const copyText = `${formatted}${unit.unit}`;
  const isInteger = converted !== 0 && Number.isInteger(converted);

  async function handleCopy() {
    await navigator.clipboard.writeText(copyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={handleCopy}
          className={`group flex items-center justify-between rounded-lg border px-3 py-2.5 transition-colors text-left cursor-pointer w-full ${
            isInteger
              ? "bg-accent border-accent-foreground/30 hover:bg-accent/80"
              : "hover:bg-accent/30"
          }`}
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2">
              <span
                className={`font-mono text-sm font-semibold tabular-nums truncate ${
                  isInteger ? "text-accent-foreground" : ""
                }`}
              >
                {formatted}
              </span>
              <span className="font-mono text-sm text-muted-foreground">
                {unit.unit}
              </span>
            </div>
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {unit.name}
            </p>
          </div>
          <div className="ml-2 flex-shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
            {copied ? (
              <Check className="h-3.5 w-3.5 text-accent-foreground" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </div>
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <span className="font-mono text-xs">{unit.description}</span>
      </TooltipContent>
    </Tooltip>
  );
}
