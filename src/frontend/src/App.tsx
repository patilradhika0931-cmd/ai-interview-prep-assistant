import { Toaster } from "@/components/ui/sonner";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import Dashboard from "./components/Dashboard";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import MockInterview from "./components/MockInterview";
import Navbar from "./components/Navbar";
import PracticeQuestions from "./components/PracticeQuestions";
import ResumeAnalyzer from "./components/ResumeAnalyzer";

type Section =
  | "home"
  | "mock-interview"
  | "resume-analyzer"
  | "practice-questions"
  | "dashboard";

const sectionComponents: Record<
  Section,
  React.ComponentType<Record<string, never>>
> = {
  home: () => null, // rendered separately
  "mock-interview": MockInterview,
  "resume-analyzer": ResumeAnalyzer,
  "practice-questions": PracticeQuestions,
  dashboard: Dashboard,
};

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>("home");
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleNavigate = (section: Section) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const ActiveComponent =
    activeSection !== "home" ? sectionComponents[activeSection] : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        darkMode={darkMode}
        onToggleDark={() => setDarkMode((d) => !d)}
      />

      <main>
        <AnimatePresence mode="wait">
          {activeSection === "home" ? (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <HeroSection onNavigate={handleNavigate} />
            </motion.div>
          ) : (
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="pt-16 min-h-screen"
            >
              {ActiveComponent && <ActiveComponent />}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
      <Toaster />
    </div>
  );
}
