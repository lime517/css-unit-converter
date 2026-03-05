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
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              📐 All the Units
            </h1>
            <a
              href="https://github.com/lime517"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Built by Joe Greve
            </a>
          </div>
          <p className="text-muted-foreground">
            Every single CSS unit in one place. Enter a pixel value to see conversions.
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
                      className="h-14 md:text-lg font-mono pr-12"
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

        {/* Footer spacer for mobile */}
        <div className="mt-12 lg:mb-0 mb-16" />
      </div>
    </div>
  );
}
