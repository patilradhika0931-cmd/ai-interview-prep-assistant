import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, Loader2, RefreshCw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Question } from "../backend";
import { useActor } from "../hooks/useActor";

const ROLES = [
  { value: "", label: "All Roles" },
  { value: "Software Developer", label: "Software Developer" },
  { value: "Data Analyst", label: "Data Analyst" },
  { value: "AI Engineer", label: "AI Engineer" },
  { value: "Product Manager", label: "Product Manager" },
  { value: "DevOps Engineer", label: "DevOps Engineer" },
];

const TOPICS = [
  { value: "", label: "All Topics" },
  { value: "Python", label: "Python" },
  { value: "DSA", label: "Data Structures & Algorithms" },
  { value: "Web Development", label: "Web Development" },
  { value: "AI/ML", label: "AI / Machine Learning" },
  { value: "System Design", label: "System Design" },
  { value: "HR/Behavioral", label: "HR / Behavioral" },
];

const DIFFICULTIES = [
  { value: "", label: "All Levels" },
  { value: "Easy", label: "Easy" },
  { value: "Medium", label: "Medium" },
  { value: "Hard", label: "Hard" },
];

const FALLBACK_QUESTIONS: Question[] = [
  {
    id: 1n,
    role: "Software Developer",
    topic: "DSA",
    difficulty: "Medium",
    text: "Explain the difference between BFS and DFS. When would you use each?",
  },
  {
    id: 2n,
    role: "Software Developer",
    topic: "Web Development",
    difficulty: "Easy",
    text: "What is the virtual DOM in React and why is it useful?",
  },
  {
    id: 3n,
    role: "Software Developer",
    topic: "System Design",
    difficulty: "Hard",
    text: "Design a URL shortening service like bit.ly. Walk through the architecture.",
  },
  {
    id: 4n,
    role: "AI Engineer",
    topic: "AI/ML",
    difficulty: "Medium",
    text: "Explain the difference between supervised, unsupervised, and reinforcement learning.",
  },
  {
    id: 5n,
    role: "Data Analyst",
    topic: "Python",
    difficulty: "Easy",
    text: "How would you handle missing values in a Pandas DataFrame?",
  },
  {
    id: 6n,
    role: "Software Developer",
    topic: "DSA",
    difficulty: "Hard",
    text: "Implement a LRU (Least Recently Used) cache with O(1) time complexity for both get and put operations.",
  },
  {
    id: 7n,
    role: "AI Engineer",
    topic: "AI/ML",
    difficulty: "Hard",
    text: "Explain the transformer architecture and how attention mechanisms work.",
  },
  {
    id: 8n,
    role: "Product Manager",
    topic: "HR/Behavioral",
    difficulty: "Medium",
    text: "Tell me about a time you had to prioritize competing features. How did you decide what to build first?",
  },
  {
    id: 9n,
    role: "DevOps Engineer",
    topic: "System Design",
    difficulty: "Medium",
    text: "What is the difference between blue-green deployments and canary releases?",
  },
  {
    id: 10n,
    role: "Software Developer",
    topic: "Python",
    difficulty: "Easy",
    text: "What are Python decorators and how do they work? Give a practical example.",
  },
];

const SAMPLE_ANSWERS: Record<string, string> = {
  "1": "BFS uses a queue and explores level by level — ideal for shortest path in unweighted graphs. DFS uses a stack (or recursion) and goes deep first — better for detecting cycles, topological sorting, or exploring all paths.",
  "2": "The virtual DOM is a lightweight JS representation of the real DOM. React diffs the virtual DOM against the previous version and only updates the changed parts in the real DOM, minimizing expensive DOM operations.",
  "3": "Key components: Hash generation (MD5/SHA256 of URL + base62 encode), distributed storage (Cassandra), caching (Redis), analytics pipeline, and a load balancer. Handle collisions with retry logic or user-defined aliases.",
  "4": "Supervised: labeled data, predicts output (classification/regression). Unsupervised: no labels, finds patterns (clustering/dimensionality reduction). Reinforcement: agent learns via rewards/penalties through environment interaction.",
  "5": "Use df.isnull().sum() to find nulls. Options: df.dropna() to remove rows, df.fillna(value) to fill with constant, df.fillna(df.mean()) for mean imputation, or use sklearn SimpleImputer for ML pipelines.",
};

const difficultyColor: Record<string, string> = {
  Easy: "bg-green-500/10 text-green-500 border-green-500/20",
  Medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  Hard: "bg-red-500/10 text-red-500 border-red-500/20",
};

export default function PracticeQuestions() {
  const { actor, isFetching } = useActor();
  const [role, setRole] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [expandedId, setExpandedId] = useState<bigint | null>(null);

  const {
    data: questions,
    isLoading,
    refetch,
  } = useQuery<Question[]>({
    queryKey: ["questions", role, topic, difficulty],
    queryFn: async () => {
      if (!actor) return FALLBACK_QUESTIONS;
      const result = await actor.getQuestions(role, topic, difficulty);
      return result.length > 0 ? result : FALLBACK_QUESTIONS;
    },
    enabled: !!actor && !isFetching,
    placeholderData: FALLBACK_QUESTIONS,
  });

  const displayed = questions ?? FALLBACK_QUESTIONS;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-10">
          <h1 className="font-display font-bold text-4xl mb-3">
            Practice <span className="gradient-text">Questions</span>
          </h1>
          <p className="text-muted-foreground">
            Filter by role, topic, and difficulty to practice targeted
            questions.
          </p>
        </div>

        {/* Filters */}
        <div className="glass-card rounded-2xl p-5 mb-8 flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-36">
            <p className="text-xs font-medium text-muted-foreground mb-1.5">
              Role
            </p>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger
                data-ocid="questions.role.select"
                className="rounded-xl"
              >
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 min-w-36">
            <p className="text-xs font-medium text-muted-foreground mb-1.5">
              Topic
            </p>
            <Select value={topic} onValueChange={setTopic}>
              <SelectTrigger
                data-ocid="questions.topic.select"
                className="rounded-xl"
              >
                <SelectValue placeholder="All Topics" />
              </SelectTrigger>
              <SelectContent>
                {TOPICS.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 min-w-36">
            <p className="text-xs font-medium text-muted-foreground mb-1.5">
              Difficulty
            </p>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger
                data-ocid="questions.difficulty.select"
                className="rounded-xl"
              >
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                {DIFFICULTIES.map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="outline"
            type="button"
            onClick={() => refetch()}
            className="rounded-xl"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-4">
          Showing{" "}
          <span className="text-foreground font-medium">
            {displayed.length}
          </span>{" "}
          questions
        </p>

        {/* Questions */}
        {isLoading ? (
          <div
            data-ocid="questions.loading_state"
            className="text-center py-20"
          >
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            {displayed.map((q, i) => (
              <motion.div
                key={String(q.id)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, transition: { delay: i * 0.04 } }}
                className="glass-card rounded-2xl overflow-hidden"
              >
                <button
                  type="button"
                  className="w-full p-5 text-left flex items-start justify-between gap-4"
                  onClick={() =>
                    setExpandedId(expandedId === q.id ? null : q.id)
                  }
                >
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-xs font-bold text-muted-foreground w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-2">{q.text}</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">
                          {q.role}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {q.topic}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-xs ${difficultyColor[q.difficulty] ?? ""}`}
                        >
                          {q.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {expandedId === q.id ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                  )}
                </button>
                <AnimatePresence>
                  {expandedId === q.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-border/50 pt-4">
                        <p className="text-xs font-semibold text-primary mb-2">
                          💡 Sample Answer
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {SAMPLE_ANSWERS[String(q.id)] ??
                            "Focus on specific examples from your experience. Use the STAR method (Situation, Task, Action, Result) to structure your answer clearly."}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
