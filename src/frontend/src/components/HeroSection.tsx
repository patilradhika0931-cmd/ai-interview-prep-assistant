import {
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle,
  Code2,
  Database,
  Globe,
  Star,
  Upload,
  Users,
} from "lucide-react";
import { motion } from "motion/react";

type Section =
  | "home"
  | "mock-interview"
  | "resume-analyzer"
  | "practice-questions"
  | "dashboard";

interface HeroSectionProps {
  onNavigate: (section: Section) => void;
}

const features = [
  {
    icon: Code2,
    title: "AI Mock Interviews",
    description:
      "Practice with role-specific questions and receive instant AI-powered feedback on every answer.",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    icon: Upload,
    title: "Resume Analyzer",
    description:
      "Upload your resume to extract skills and receive personalized interview questions tailored to your profile.",
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    icon: Brain,
    title: "Smart Questions",
    description:
      "Generate questions by role, topic, and difficulty. Each comes with a detailed model answer to study.",
    gradient: "from-teal-500 to-green-400",
  },
  {
    icon: BarChart3,
    title: "Performance Dashboard",
    description:
      "Track your progress across sessions with visual charts, scores, and personalized improvement insights.",
    gradient: "from-pink-500 to-rose-400",
  },
];

const stats = [
  { value: "10,000+", label: "Practice Questions", icon: Database },
  { value: "500+", label: "Companies Covered", icon: Globe },
  { value: "AI-Powered", label: "Real-time Feedback", icon: Brain },
  { value: "4 Roles", label: "Specialized Tracks", icon: Users },
];

const testimonials = [
  {
    name: "Aryan Sharma",
    role: "SWE @ Google",
    text: "Helped me ace my L5 interview. The AI feedback is surprisingly accurate!",
    stars: 5,
  },
  {
    name: "Priya Mehta",
    role: "Data Scientist @ Meta",
    text: "The resume analyzer picked up skills I didn't even know to highlight.",
    stars: 5,
  },
  {
    name: "Karan Patel",
    role: "AI Engineer @ OpenAI",
    text: "Practice questions for AI/ML roles are spot-on. 10/10 would recommend.",
    stars: 5,
  },
];

export default function HeroSection({ onNavigate }: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="/assets/generated/hero-bg.dim_1920x1080.jpg"
            alt=""
            className="w-full h-full object-cover opacity-30 dark:opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
          {/* Gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/20 blur-3xl animate-float" />
          <div
            className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-accent/15 blur-3xl animate-float"
            style={{ animationDelay: "2s" }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-primary/10 animate-spin-slow" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8">
              <Star className="w-3.5 h-3.5" />
              <span>AI-Powered Interview Preparation</span>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Practice Interviews with <span className="gradient-text">AI</span>{" "}
              and <br className="hidden sm:block" />
              Improve Your <span className="gradient-text">Skills</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Get real-time AI feedback, analyze your resume, and master
              interview techniques with personalized practice sessions tailored
              to your target role.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <button
                type="button"
                data-ocid="hero.start_mock_interview.primary_button"
                onClick={() => onNavigate("mock-interview")}
                className="btn-gradient flex items-center gap-2 text-base shadow-glow animate-pulse-glow"
              >
                Start Mock Interview
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                data-ocid="hero.upload_resume.secondary_button"
                onClick={() => onNavigate("resume-analyzer")}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-primary/40 text-foreground font-semibold text-base transition-all duration-300 hover:border-primary hover:bg-primary/10 hover:-translate-y-0.5"
              >
                <Upload className="w-4 h-4" />
                Upload Resume
              </button>
            </div>

            {/* Floating achievement badges */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {["No signup required", "Instant AI feedback", "Free to use"].map(
                (badge) => (
                  <div
                    key={badge}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground"
                  >
                    <CheckCircle className="w-4 h-4 text-accent" />
                    {badge}
                  </div>
                ),
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="py-12 border-y border-border/50 bg-secondary/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="space-y-1"
              >
                <div className="font-display text-2xl sm:text-3xl font-bold gradient-text">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Everything you need to{" "}
              <span className="gradient-text">ace your interview</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              A complete toolkit designed to simulate real interview scenarios
              and build genuine confidence.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-hover bg-card border border-border rounded-2xl p-6 shadow-lg group cursor-pointer"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 bg-secondary/20">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-display text-2xl sm:text-3xl font-bold text-center mb-10"
          >
            Trusted by <span className="gradient-text">top performers</span>
          </motion.h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6 shadow-lg"
              >
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].slice(0, t.stars).map((n) => (
                    <Star
                      key={`star-${n}`}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
