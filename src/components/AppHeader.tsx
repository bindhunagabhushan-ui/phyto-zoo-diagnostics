import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "./ThemeToggle";

export function AppHeader() {
  return (
    <header className="h-14 border-b border-border bg-card/80 backdrop-blur-sm flex items-center justify-between px-4 sticky top-0 z-40">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="h-8 w-8" />
      </div>
      <ThemeToggle />
    </header>
  );
}
