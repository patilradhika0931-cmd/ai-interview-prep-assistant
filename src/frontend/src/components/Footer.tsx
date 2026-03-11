import { Github, Zap } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer className="border-t border-border/50 py-10 px-4 sm:px-6 bg-secondary/20 mt-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-display font-bold">
              <span className="gradient-text">Interview</span>AI
            </span>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            © {year}. Built with ❤️ using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>

          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>AI-Powered · No Signup Required</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">
              <Github className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
