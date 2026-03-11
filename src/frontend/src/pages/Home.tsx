import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  FileText,
  Lightbulb,
  MessageSquare,
  Sparkles,
  ThumbsUp,
} from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    icon: MessageSquare,
    title: "AI Mock Interview",
    description:
      "Engage in realistic interview simulations with AI-powered questions tailored to your target role.",
    gradient: "from-blue-500 to-violet-500",
  },
  {
    icon: ThumbsUp,
    title: "Answer Feedback",
    description:
      "Get instant, detailed feedback on your answers including correctness, communication quality, and improvement tips.",
    gradient: "from-violet-500 to-pink-500",
  },
  {
    icon: FileText,
    title: "Resume Analyzer",
    description:
      "Upload your resume and get personalized interview questions based on your skills and experience.",
    gradient: "from-pink-500 to-orange-500",
  },
  {
    icon: Lightbulb,
    title: "Smart Questions",
    description:
      "Generate targeted practice questions by role, topic, and difficulty to sharpen your weak areas.",
    gradient: "from-orange-500 to-yellow-500",
  },
  {
    icon: BarChart3,
    title: "Performance Dashboard",
    description:
      "Track your progress over time with detailed analytics, score trends, and personalized improvement plans.",
    gradient: "from-teal-500 to-blue-500",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="blob absolute w-96 h-96 top-10 left-1/4"
            style={{ background: "oklch(0.65 0.25 265)" }}
          />
          <div
            className="blob absolute w-80 h-80 top-32 right-1/4"
            style={{ background: "oklch(0.70 0.20 310)", animationDelay: "4s" }}
          />
          <div
            className="blob absolute w-64 h-64 bottom-20 left-1/3"
            style={{ background: "oklch(0.65 0.20 200)", animationDelay: "8s" }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Powered by Generative AI
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl leading-tight mb-6"
          >
            Practice Interviews with <span className="gradient-text">AI</span>{" "}
            and Improve
            <br />
            Your Skills
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Prepare smarter with AI-powered mock interviews, instant feedback,
            resume analysis, and personalized question banks — all designed to
            help you land your dream job.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              asChild
              size="lg"
              data-ocid="hero.start_interview.primary_button"
              className="gradient-bg text-white shadow-glow hover:shadow-glow-accent hover:scale-105 transition-all duration-300 rounded-xl px-8 text-base font-semibold"
            >
              <Link to="/mock-interview">
                Start Mock Interview
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              data-ocid="hero.upload_resume.secondary_button"
              className="border-primary/40 text-primary hover:bg-primary/10 hover:scale-105 transition-all duration-300 rounded-xl px-8 text-base"
            >
              <Link to="/resume-analyzer">Upload Resume</Link>
            </Button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 flex flex-wrap justify-center gap-12"
          >
            {[
              { value: "50+", label: "Interview Roles" },
              { value: "500+", label: "Practice Questions" },
              { value: "AI", label: "Powered Feedback" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display font-bold text-3xl gradient-text">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="font-display font-bold text-4xl sm:text-5xl mb-4">
              Everything you need to{" "}
              <span className="gradient-text">ace your interview</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              From AI-powered practice sessions to detailed performance
              analytics — we&apos;ve got you covered.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="glass-card rounded-2xl p-6 cursor-default"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">
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

      {/* CTA section */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto rounded-3xl p-px"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.65 0.25 265), oklch(0.70 0.20 310))",
          }}
        >
          <div className="bg-background rounded-3xl p-12 text-center">
            <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
              Ready to land your dream job?
            </h2>
            <p className="text-muted-foreground mb-8">
              Start practicing today with AI-powered mock interviews and
              detailed feedback.
            </p>
            <Button
              asChild
              size="lg"
              className="gradient-bg text-white shadow-glow hover:scale-105 transition-all duration-300 rounded-xl px-10"
            >
              <Link to="/mock-interview">
                Get Started Free
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
