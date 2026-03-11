import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import {
  Link,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  useRouterState,
} from "@tanstack/react-router";
import { Brain, Moon, Sun } from "lucide-react";
import { ThemeProvider, useTheme } from "next-themes";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import MockInterview from "./pages/MockInterview";
import PracticeQuestions from "./pages/PracticeQuestions";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";

const navLinks = [
  { path: "/" as const, label: "Home", ocid: "nav.home.link" },
  {
    path: "/mock-interview" as const,
    label: "Mock Interview",
    ocid: "nav.mock_interview.link",
  },
  {
    path: "/resume-analyzer" as const,
    label: "Resume Analyzer",
    ocid: "nav.resume_analyzer.link",
  },
  {
    path: "/practice-questions" as const,
    label: "Practice",
    ocid: "nav.practice_questions.link",
  },
  {
    path: "/dashboard" as const,
    label: "Dashboard",
    ocid: "nav.dashboard.link",
  },
];

function NavbarContent() {
  const { theme, setTheme } = useTheme();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

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

function RootLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavbarContent />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border/50 py-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          caffeine.ai
        </a>
      </footer>
      <Toaster />
    </div>
  );
}

const rootRoute = createRootRoute({ component: RootLayout });
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});
const mockRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/mock-interview",
  component: MockInterview,
});
const resumeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/resume-analyzer",
  component: ResumeAnalyzer,
});
const practiceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/practice-questions",
  component: PracticeQuestions,
});
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: Dashboard,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  mockRoute,
  resumeRoute,
  practiceRoute,
  dashboardRoute,
]);

const router = createRouter({ routeTree, defaultPreload: "intent" });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
