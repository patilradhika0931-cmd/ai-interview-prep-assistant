import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Loader2,
  Sparkles,
  Tag,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
  type Difficulty,
  type Role,
  type Topic,
  questionBank,
} from "../mockData";

const roles: Role[] = [
  "Software Developer",
  "Data Analyst",
  "AI Engineer",
  "Web Developer",
];
const topics: Topic[] = [
  "Python",
  "DSA",
  "Web Development",
  "AI/ML",
  "System Design",
  "Behavioral",
];
const difficulties: Difficulty[] = ["Easy", "Medium", "Hard"];

const topicToCategory: Record<Topic, string> = {
  Python: "Python",
  DSA: "DSA",
  "Web Development": "Web Development",
  "AI/ML": "AI/ML",
  "System Design": "System Design",
  Behavioral: "Behavioral",
};

const difficultyColor: Record<Difficulty, string> = {
  Easy: "bg-green-500/10 text-green-600 border-green-500/20",
  Medium: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  Hard: "bg-red-500/10 text-red-500 border-red-500/20",
};

export default function PracticeQuestions() {
  const [role, setRole] = useState<Role | "">("");
  const [topic, setTopic] = useState<Topic | "">("");
  const [difficulty, setDifficulty] = useState<Difficulty | "">("");
  const [generating, setGenerating] = useState(false);
  const [questions, setQuestions] = useState<typeof questionBank | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleGenerate = async () => {
    setGenerating(true);
    setQuestions(null);
    await new Promise((r) => setTimeout(r, 1600));

    let filtered = questionBank;
    if (topic)
      filtered = filtered.filter(
        (q) => q.category === topicToCategory[topic as Topic],
      );
    if (difficulty)
      filtered = filtered.filter((q) => q.difficulty === difficulty);

    // If no match, show random selection
    if (filtered.length === 0) filtered = questionBank;

    // Pick up to 8
    const shuffled = [...filtered].sort(() => Math.random() - 0.5).slice(0, 8);
    setQuestions(shuffled);
    setGenerating(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 section-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">
          <span className="gradient-text">Smart Question Generator</span>
        </h1>
        <p className="text-muted-foreground">
          Generate targeted interview questions with model answers by role,
          topic, and difficulty.
        </p>
      </div>

      {/* Filter form */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-lg mb-6">
        <h2 className="font-display font-semibold mb-4">
          Configure Your Question Set
        </h2>
        <div className="grid sm:grid-cols-3 gap-4 mb-5">
          <div className="space-y-2">
            <label htmlFor="role-select" className="text-sm font-medium">
              Role
            </label>
            <Select value={role} onValueChange={(v) => setRole(v as Role)}>
              <SelectTrigger
                id="role-select"
                data-ocid="questions.role.select"
                className="rounded-xl"
              >
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="topic-select" className="text-sm font-medium">
              Topic
            </label>
            <Select value={topic} onValueChange={(v) => setTopic(v as Topic)}>
              <SelectTrigger
                id="topic-select"
                data-ocid="questions.topic.select"
                className="rounded-xl"
              >
                <SelectValue placeholder="Select topic" />
              </SelectTrigger>
              <SelectContent>
                {topics.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="difficulty-select" className="text-sm font-medium">
              Difficulty
            </label>
            <Select
              value={difficulty}
              onValueChange={(v) => setDifficulty(v as Difficulty)}
            >
              <SelectTrigger
                id="difficulty-select"
                data-ocid="questions.difficulty.select"
                className="rounded-xl"
              >
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button
          data-ocid="questions.generate.button"
          onClick={handleGenerate}
          disabled={generating}
          className="btn-gradient w-full sm:w-auto"
        >
          {generating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" /> Generate Questions
            </>
          )}
        </Button>
      </div>

      <AnimatePresence>
        {questions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                {questions.length} questions generated
              </span>
              {topic && (
                <Badge variant="outline" className="text-xs">
                  {topic}
                </Badge>
              )}
            </div>

            {questions.map((q, i) => {
              const ocidIndex = i + 1;
              const isOpen = expandedId === q.id;
              return (
                <motion.div
                  key={q.id}
                  data-ocid={`questions.item.${ocidIndex}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-card border border-border rounded-2xl shadow-md overflow-hidden"
                >
                  <button
                    type="button"
                    className="w-full text-left px-5 py-4 flex items-start gap-3"
                    onClick={() => setExpandedId(isOpen ? null : q.id)}
                  >
                    <span className="font-display font-bold text-primary text-sm w-7 flex-shrink-0 mt-0.5">
                      Q{i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium leading-relaxed text-sm">
                        {q.question}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${difficultyColor[q.difficulty]}`}
                        >
                          {q.difficulty}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Tag className="w-3 h-3" />
                          {q.category}
                        </span>
                      </div>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                    )}
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5">
                          <div className="border-t border-border pt-4">
                            <div className="flex items-center gap-2 mb-2">
                              <BookOpen className="w-4 h-4 text-accent" />
                              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                Model Answer
                              </span>
                            </div>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                              {q.modelAnswer}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {!questions && !generating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            data-ocid="questions.empty_state"
            className="text-center py-16 text-muted-foreground"
          >
            <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="font-display font-semibold text-lg mb-1">
              Ready to generate
            </p>
            <p className="text-sm">
              Select your preferences above and click &ldquo;Generate
              Questions&rdquo;
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
