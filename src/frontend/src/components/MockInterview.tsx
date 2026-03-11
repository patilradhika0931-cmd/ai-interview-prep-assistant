import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Award,
  Bot,
  Brain,
  ChevronRight,
  Code2,
  Database,
  Globe,
  Loader2,
  RotateCcw,
  Send,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { type Role, generateFeedback, interviewQuestions } from "../mockData";

const roles: {
  id: Role;
  icon: typeof Code2;
  description: string;
  color: string;
}[] = [
  {
    id: "Software Developer",
    icon: Code2,
    description: "Algorithms, OOP, System Design",
    color: "from-violet-500 to-purple-600",
  },
  {
    id: "Data Analyst",
    icon: Database,
    description: "SQL, Statistics, Visualization",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "AI Engineer",
    icon: Brain,
    description: "ML, Deep Learning, MLOps",
    color: "from-teal-500 to-green-500",
  },
  {
    id: "Web Developer",
    icon: Globe,
    description: "JavaScript, React, REST APIs",
    color: "from-orange-500 to-amber-400",
  },
];

export default function MockInterview() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<ReturnType<
    typeof generateFeedback
  > | null>(null);
  const [completed, setCompleted] = useState(false);
  const [scores, setScores] = useState<number[]>([]);

  const questions = selectedRole ? interviewQuestions[selectedRole] : [];
  const currentQ = questions[currentQIndex];
  const totalQ = questions.length;

  const handleSubmit = async () => {
    if (!answer.trim() || !currentQ) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    const fb = generateFeedback(answer, currentQ.id);
    setFeedback(fb);
    setScores((prev) => [...prev, fb.score]);
    setSubmitting(false);
  };

  const handleNext = () => {
    if (currentQIndex + 1 >= totalQ) {
      setCompleted(true);
    } else {
      setCurrentQIndex((i) => i + 1);
      setAnswer("");
      setFeedback(null);
    }
  };

  const handleReset = () => {
    setSelectedRole(null);
    setCurrentQIndex(0);
    setAnswer("");
    setFeedback(null);
    setCompleted(false);
    setScores([]);
  };

  const avgScore =
    scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;

  const scoreColor = (s: number) => {
    if (s >= 80) return "text-green-500";
    if (s >= 60) return "text-yellow-500";
    return "text-red-400";
  };

  const scoreBg = (s: number) => {
    if (s >= 80) return "bg-green-500/10 text-green-600 border-green-500/20";
    if (s >= 60) return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
    return "bg-red-500/10 text-red-500 border-red-500/20";
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 section-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">
          <span className="gradient-text">AI Mock Interview</span>
        </h1>
        <p className="text-muted-foreground">
          Simulate a real interview with AI-generated questions and instant
          feedback.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {/* Role Selection */}
        {!selectedRole && (
          <motion.div
            key="role-select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h2 className="font-display text-xl font-semibold mb-4">
              Select your target role
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {roles.map((role) => (
                <button
                  type="button"
                  key={role.id}
                  data-ocid="mock_interview.role.select"
                  onClick={() => setSelectedRole(role.id)}
                  className="card-hover group bg-card border border-border rounded-2xl p-6 text-left shadow-lg hover:border-primary/40 hover:shadow-glow-sm transition-all"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}
                  >
                    <role.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="font-display font-bold text-lg mb-1">
                    {role.id}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {role.description}
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-xs text-primary font-medium">
                    <span>
                      {questions.length > 0
                        ? interviewQuestions[role.id].length
                        : 5}{" "}
                      questions
                    </span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Completed State */}
        {completed && (
          <motion.div
            key="completed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-2xl p-8 text-center shadow-lg"
          >
            <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6 shadow-glow animate-pulse-glow">
              <Award className="w-10 h-10 text-white" />
            </div>
            <h2 className="font-display text-2xl font-bold mb-2">
              Interview Completed!
            </h2>
            <p className="text-muted-foreground mb-6">
              You answered all {totalQ} questions for{" "}
              <strong>{selectedRole}</strong>.
            </p>

            <div className="flex items-center justify-center gap-8 mb-8">
              <div>
                <div
                  className={`font-display text-4xl font-bold ${scoreColor(avgScore)}`}
                >
                  {avgScore}/100
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Average Score
                </div>
              </div>
              <div>
                <div className="font-display text-4xl font-bold text-foreground">
                  {totalQ}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Questions
                </div>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2 mb-8">
              {scores.map((s, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static result list
                <div key={`score-${i}`} className="text-center">
                  <div className={`font-bold text-sm ${scoreColor(s)}`}>
                    Q{i + 1}
                  </div>
                  <div className={`text-xs font-semibold ${scoreColor(s)}`}>
                    {s}
                  </div>
                </div>
              ))}
            </div>

            <Button onClick={handleReset} className="btn-gradient">
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Another Role
            </Button>
          </motion.div>
        )}

        {/* Interview Interface */}
        {selectedRole && !completed && currentQ && (
          <motion.div
            key="interview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-card border border-border rounded-xl px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-sm">
                    {selectedRole} Interview
                  </div>
                  <div className="text-xs text-muted-foreground">
                    AI Interviewer
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  Question {currentQIndex + 1} of {totalQ}
                </span>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Exit
                </button>
              </div>
            </div>

            {/* Progress */}
            <Progress
              value={(currentQIndex / totalQ) * 100}
              className="h-1.5"
            />

            {/* Question bubble */}
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center flex-shrink-0 shadow-glow-sm">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-card border border-border rounded-2xl rounded-tl-none p-4 shadow-lg max-w-2xl">
                <p className="font-medium leading-relaxed">
                  {currentQ.question}
                </p>
                <p className="text-xs text-muted-foreground mt-2 italic">
                  💡 {currentQ.tip}
                </p>
              </div>
            </div>

            {/* Answer area */}
            {!feedback && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="w-9 flex-shrink-0 flex flex-col items-center pt-1">
                  <div className="w-9 h-9 rounded-full bg-secondary border border-border flex items-center justify-center">
                    <User className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="flex-1 space-y-3">
                  <Textarea
                    data-ocid="mock_interview.answer.textarea"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your answer here... Be thorough and use examples where possible."
                    className="min-h-[140px] resize-none rounded-2xl bg-card border-border focus:ring-primary"
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      {answer.trim().split(/\s+/).filter(Boolean).length} words
                    </span>
                    <Button
                      data-ocid="mock_interview.submit.button"
                      onClick={handleSubmit}
                      disabled={!answer.trim() || submitting}
                      className="btn-gradient"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" /> Submit Answer
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Feedback */}
            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card border border-border rounded-2xl p-5 shadow-lg"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-semibold">AI Feedback</span>
                    </div>
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-sm font-bold ${scoreBg(feedback.score)}`}
                    >
                      <Award className="w-3.5 h-3.5" />
                      {feedback.score}/100
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Correctness
                      </div>
                      <p className="text-sm leading-relaxed">
                        {feedback.correctness}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Communication
                      </div>
                      <p className="text-sm leading-relaxed">
                        {feedback.communication}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      Improvement Tips
                    </div>
                    <ul className="space-y-1.5">
                      {feedback.improvements.map((tip) => (
                        <li key={tip} className="text-sm flex gap-2">
                          <span className="text-accent mt-0.5">→</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {feedback.strengths.map((s) => (
                      <Badge key={s} variant="secondary" className="text-xs">
                        {s}
                      </Badge>
                    ))}
                  </div>

                  <Button
                    data-ocid="mock_interview.next_question.button"
                    onClick={handleNext}
                    className="btn-gradient w-full"
                  >
                    {currentQIndex + 1 >= totalQ
                      ? "See Results"
                      : "Next Question"}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
