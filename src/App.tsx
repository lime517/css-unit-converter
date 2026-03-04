import { Converter } from "@/components/converter";
import { useSystemTheme } from "@/hooks/use-system-theme";
import { TooltipProvider } from "@/components/ui/tooltip";

function App() {
  useSystemTheme();
  return (
    <TooltipProvider>
      <Converter />
    </TooltipProvider>
  );
}

export default App;
