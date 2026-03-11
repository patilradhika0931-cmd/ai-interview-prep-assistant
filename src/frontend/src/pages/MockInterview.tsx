import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  BarChart2,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  Code2,
  Loader2,
  Package,
  Server,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { AnswerFeedback, InterviewSession } from "../backend";
import { useActor } from "../hooks/useActor";

const ROLES = [
  {
    id: "Software Developer",
    label: "Software Developer",
    icon: Code2,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "Data Analyst",
    label: "Data Analyst",
    icon: BarChart2,
    color: "from-violet-500 to-blue-500",
  },
  {
    id: "AI Engineer",
    label: "AI Engineer",
    icon: BrainCircuit,
    color: "from-pink-500 to-violet-500",
  },
  {
    id: "Product Manager",
    label: "Product Manager",
    icon: Package,
    color: "from-orange-500 to-pink-500",
  },
  {
    id: "DevOps Engineer",
    label: "DevOps Engineer",
    icon: Server,
    color: "from-teal-500 to-blue-500",
  },
];

type Stage = "role-select" | "interview" | "complete";

function ScoreRing({ score }: { score: number }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 70
      ? "oklch(0.70 0.18 140)"
      : score >= 40
        ? "oklch(0.75 0.22 30)"
        : "oklch(0.577 0.245 27.325)";

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg
        className="w-24 h-24 -rotate-90"
        viewBox="0 0 88 88"
        aria-label={`Score: ${score}`}
      >
        <title>Score Ring</title>
        <circle
          cx="44"
          cy="44"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-muted/30"
        />
        <circle
          cx="44"
          cy="44"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="score-ring"
        />
      </svg>
      <span className="absolute font-display font-bold text-xl">{score}</span>
    </div>
  );
}

export default function MockInterview() {
  const { actor, isFetching } = useActor();
  const [stage, setStage] = useState<Stage>("role-select");
  const [selectedRole, setSelectedRole] = useState("");
  const [sessionId, setSessionId] = useState<bigint | null>(null);
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<AnswerFeedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [completedSession, setCompletedSession] =
    useState<InterviewSession | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  async function startInterview(role: string) {
    if (!actor) {
      toast.error("Actor not ready");
      return;
    }
    setIsLoading(true);
    setSelectedRole(role);
    try {
      const id = await actor.createInterviewSession(role);
      const result = await actor.getSession(id);
      const sess = result[0];
      if (!sess) throw new Error("Session not found");
      setSessionId(id);
      setSession(sess);
      setCurrentIndex(0);
      setStage("interview");
    } catch {
      toast.error("Failed to start interview. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function submitAnswer() {
    if (!actor || sessionId === null || !answer.trim()) return;
    setIsLoading(true);
    try {
      const result = await actor.submitAnswer(
        sessionId,
        BigInt(currentIndex),
        answer,
      );
      const fb = result[0];
      if (fb) setFeedback(fb);
      setShowFeedback(true);
    } catch {
      toast.error("Failed to submit answer.");
    } finally {
      setIsLoading(false);
    }
  }

  function nextQuestion() {
    setAnswer("");
    setFeedback(null);
    setShowFeedback(false);
    setCurrentIndex((prev) => prev + 1);
  }

  async function completeInterview() {
    if (!actor || sessionId === null) return;
    setIsLoading(true);
    try {
      const result = await actor.completeSession(sessionId);
      const sess = result[0];
      if (sess) setCompletedSession(sess);
      setStage("complete");
    } catch {
      toast.error("Failed to complete interview.");
    } finally {
      setIsLoading(false);
    }
  }

  function resetInterview() {
    setStage("role-select");
    setSession(null);
    setSessionId(null);
    setCurrentIndex(0);
    setAnswer("");
    setFeedback(null);
    setShowFeedback(false);
    setCompletedSession(null);
  }

  const totalQuestions = session?.questions.length ?? 0;
  const isLastQuestion = currentIndex >= totalQuestions - 1;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <AnimatePresence mode="wait">
        {stage === "role-select" && (
          <motion.div
            key="role-select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="text-center mb-12">
              <h1 className="font-display font-bold text-4xl mb-3">
                Select Your{" "}
                <span className="gradient-text">Interview Role</span>
              </h1>
              <p className="text-muted-foreground">
                Choose the position you&apos;re preparing for to get tailored
                questions.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {ROLES.map((role, i) => (
                <motion.button
                  key={role.id}
                  type="button"
                  data-ocid={`mock_interview.role.card.${i + 1}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: i * 0.08 },
                  }}
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => startInterview(role.id)}
                  disabled={isLoading || isFetching}
                  className="glass-card rounded-2xl p-6 text-left hover:border-primary/40 transition-all duration-300 group disabled:opacity-50"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-4`}
                  >
                    <role.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-display font-semibold text-base mb-1 group-hover:text-primary transition-colors">
                    {role.label}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Tap to start interview
                  </p>
                  {isLoading && selectedRole === role.id && (
                    <Loader2 className="w-4 h-4 animate-spin mt-2 text-primary" />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {stage === "interview" && session && (
          <motion.div
            key="interview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="mb-8 flex items-center justify-between">
              <div>
                <Badge variant="secondary" className="mb-2">
                  {selectedRole}
                </Badge>
                <h2 className="font-display font-bold text-2xl">
                  Question {currentIndex + 1} of {totalQuestions}
                </h2>
              </div>
              <div className="text-right">
                <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full gradient-bg rounded-full transition-all duration-500"
                    style={{
                      width: `${((currentIndex + (showFeedback ? 1 : 0)) / totalQuestions) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round(
                    ((currentIndex + (showFeedback ? 1 : 0)) / totalQuestions) *
                      100,
                  )}
                  % complete
                </p>
              </div>
            </div>

            <motion.div
              key={`question-${currentIndex}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card rounded-2xl p-6 mb-6"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <BrainCircuit className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    AI Interviewer
                  </p>
                  <p className="text-base leading-relaxed">
                    {session.questions[currentIndex]}
                  </p>
                </div>
              </div>
            </motion.div>

            <AnimatePresence>
              {showFeedback && feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="glass-card rounded-2xl p-6 mb-6 border-primary/20"
                >
                  <div className="flex items-start gap-6">
                    <ScoreRing score={Number(feedback.score)} />
                    <div className="flex-1">
                      <h4 className="font-display font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" /> AI
                        Feedback
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                        {feedback.feedback}
                      </p>
                      {feedback.suggestions && (
                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-3">
                          <p className="text-xs font-medium text-primary mb-1">
                            💡 Suggestions
                          </p>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {feedback.suggestions}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex gap-3">
                    {!isLastQuestion ? (
                      <Button
                        data-ocid="mock_interview.next_question.button"
                        onClick={nextQuestion}
                        className="gradient-bg text-white rounded-xl"
                      >
                        Next Question <ChevronRight className="ml-1 w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        data-ocid="mock_interview.complete.button"
                        onClick={completeInterview}
                        disabled={isLoading}
                        className="gradient-bg text-white rounded-xl"
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : null}
                        Complete Interview
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Textarea
                  data-ocid="mock_interview.answer.textarea"
                  placeholder="Type your answer here..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  rows={5}
                  className="mb-4 rounded-xl resize-none"
                />
                <Button
                  data-ocid="mock_interview.submit_answer.button"
                  onClick={submitAnswer}
                  disabled={isLoading || !answer.trim()}
                  className="gradient-bg text-white rounded-xl w-full"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  Submit Answer
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}

        {stage === "complete" && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center mx-auto mb-6 shadow-glow">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="font-display font-bold text-3xl mb-2">
              Interview Complete!
            </h2>
            <p className="text-muted-foreground mb-8">
              Here&apos;s your performance summary
            </p>

            {completedSession && (
              <div className="glass-card rounded-2xl p-8 text-left max-w-xl mx-auto mb-8">
                {completedSession.overallScore[0] !== undefined && (
                  <div className="flex items-center justify-center mb-6">
                    <ScoreRing
                      score={Number(completedSession.overallScore[0])}
                    />
                    <div className="ml-4">
                      <p className="text-2xl font-display font-bold">
                        {Number(completedSession.overallScore[0])}/100
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Overall Score
                      </p>
                    </div>
                  </div>
                )}

                {completedSession.strengths.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-sm mb-2 text-green-500">
                      ✅ Strengths
                    </h4>
                    <ul className="space-y-1">
                      {completedSession.strengths.map((s) => (
                        <li
                          key={s}
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
                          <span className="text-green-500 mt-0.5">•</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {completedSession.weaknesses.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-sm mb-2 text-orange-400">
                      ⚠️ Areas to Improve
                    </h4>
                    <ul className="space-y-1">
                      {completedSession.weaknesses.map((w) => (
                        <li
                          key={w}
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
                          <span className="text-orange-400 mt-0.5">•</span> {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {completedSession.suggestions.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-primary">
                      💡 Suggestions
                    </h4>
                    <ul className="space-y-1">
                      {completedSession.suggestions.map((s) => (
                        <li
                          key={s}
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
                          <span className="text-primary mt-0.5">•</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <Button
                onClick={resetInterview}
                className="gradient-bg text-white rounded-xl"
              >
                Take Another Interview
              </Button>
              <Button variant="outline" asChild className="rounded-xl">
                <a href="#/dashboard">View Dashboard</a>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
