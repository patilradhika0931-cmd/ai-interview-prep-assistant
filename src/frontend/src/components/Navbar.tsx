import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import { Brain, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const navLinks = [
  { path: "/", label: "Home", ocid: "nav.home.link" },
  {
    path: "/mock-interview",
    label: "Mock Interview",
    ocid: "nav.mock_interview.link",
  },
  {
    path: "/resume-analyzer",
    label: "Resume Analyzer",
    ocid: "nav.resume_analyzer.link",
  },
  {
    path: "/practice-questions",
    label: "Practice",
    ocid: "nav.practice_questions.link",
  },
  { path: "/dashboard", label: "Dashboard", ocid: "nav.dashboard.link" },
] as const;

export default function Navbar() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center shadow-glow">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-lg gradient-text hidden sm:block">
            AI Interview Prep
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              data-ocid={link.ocid}
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                currentPath === link.path
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Button
          variant="ghost"
          size="icon"
          data-ocid="nav.dark_mode.toggle"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-lg"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden border-t border-border/30 px-4 py-2 flex gap-1 overflow-x-auto">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            data-ocid={link.ocid}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all",
              currentPath === link.path
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
