import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ContextPanel } from "@/components/context-panel";
import { UnitResult } from "@/components/unit-result";
import {
  DEFAULT_CONTEXT,
  unitsByCategory,
  categoryLabels,
  type ConversionContext,
} from "@/lib/conversions";
import { Settings2, ChevronDown, ChevronUp } from "lucide-react";

export function Converter() {
  const [pxValue, setPxValue] = useState<string>("16");
  const [context, setContext] = useState<ConversionContext>({
    ...DEFAULT_CONTEXT,
  });
  const [showContext, setShowContext] = useState(false);

  const numericPx = parseFloat(pxValue) || 0;

  const categories = Object.entries(unitsByCategory) as [
    string,
    (typeof unitsByCategory)[keyof typeof unitsByCategory],
  ][];

  return (
    <div className="min-h-screen bg-muted">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            CSS Unit Converter
          </h1>
          <p className="text-muted-foreground">
            Enter a pixel value to see conversions for all CSS length units.
          </p>
          <p className="text-muted-foreground text-xs">
            Conversions based on{" "}
            <a
              href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Values_and_units"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              MDN CSS Values and Units
            </a>
            . Relative units use configurable context values. Click any result
            to copy.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* Main content */}
          <div className="space-y-6">
            {/* Input */}
            <Card className="dark">
              <CardContent className="pt-0">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Input
                      type="number"
                      value={pxValue}
                      onChange={(e) => setPxValue(e.target.value)}
                      placeholder="Enter pixel value"
                      className="h-14 text-2xl font-bold font-mono pr-12"
                      autoFocus
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-muted-foreground font-mono pointer-events-none">
                      px
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results by category */}
            {categories.map(([category, categoryUnits]) => (
              <Card key={category}>
                <CardHeader className="pb-0">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">
                      {categoryLabels[category]}
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {categoryUnits.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {categoryUnits
                      .filter((u) => u.unit !== "px")
                      .map((unit) => (
                        <UnitResult
                          key={unit.unit}
                          unit={unit}
                          pxValue={numericPx}
                          context={context}
                        />
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Context sidebar - desktop */}
          <div className="hidden lg:block">
            <div className="sticky top-8">
              <Card>
                <CardContent>
                  <ContextPanel context={context} onChange={setContext} />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Context panel - mobile */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
            <div className="bg-card border-t shadow-lg">
              <button
                onClick={() => setShowContext(!showContext)}
                className="flex w-full items-center justify-between px-4 py-3 cursor-pointer"
              >
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Settings2 className="h-4 w-4" />
                  Context Values
                </div>
                {showContext ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
              </button>
              {showContext && (
                <>
                  <Separator />
                  <div className="max-h-[60vh] overflow-y-auto px-4 py-4">
                    <ContextPanel context={context} onChange={setContext} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-xs text-muted-foreground lg:mb-0 mb-16">
        </div>
      </div>
    </div>
  );
}
