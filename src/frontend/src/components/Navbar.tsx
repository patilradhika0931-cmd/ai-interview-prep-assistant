import { Button } from "@/components/ui/button";
import { Menu, Moon, Sun, X, Zap } from "lucide-react";
import { useState } from "react";

type Section =
  | "home"
  | "mock-interview"
  | "resume-analyzer"
  | "practice-questions"
  | "dashboard";

interface NavbarProps {
  activeSection: Section;
  onNavigate: (section: Section) => void;
  darkMode: boolean;
  onToggleDark: () => void;
}

const navLinks: { label: string; section: Section; ocid: string }[] = [
  { label: "Home", section: "home", ocid: "nav.home.link" },
  {
    label: "Mock Interview",
    section: "mock-interview",
    ocid: "nav.mock_interview.link",
  },
  {
    label: "Resume Analyzer",
    section: "resume-analyzer",
    ocid: "nav.resume_analyzer.link",
  },
  {
    label: "Practice Questions",
    section: "practice-questions",
    ocid: "nav.practice_questions.link",
  },
  { label: "Dashboard", section: "dashboard", ocid: "nav.dashboard.link" },
];

export default function Navbar({
  activeSection,
  onNavigate,
  darkMode,
  onToggleDark,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="glass border-b border-border/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              type="button"
              onClick={() => onNavigate("home")}
              className="flex items-center gap-2.5 group"
            >
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-glow-sm group-hover:scale-110 transition-transform">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg">
                <span className="gradient-text">Interview</span>
                <span className="text-foreground">AI</span>
              </span>
            </button>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  type="button"
                  key={link.section}
                  data-ocid={link.ocid}
                  onClick={() => onNavigate(link.section)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeSection === link.section
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                data-ocid="nav.dark_mode.toggle"
                onClick={onToggleDark}
                className="rounded-lg"
              >
                {darkMode ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>

              {/* Mobile menu toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden rounded-lg"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Menu className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border/50 py-3 px-4">
            {navLinks.map((link) => (
              <button
                type="button"
                key={link.section}
                data-ocid={link.ocid}
                onClick={() => {
                  onNavigate(link.section);
                  setMobileOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeSection === link.section
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
