import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  Loader2,
  Plus,
  Upload,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { ResumeAnalysis } from "../backend";
import { useActor } from "../hooks/useActor";

const SAMPLE_SKILLS_BY_KEYWORD: Record<string, string[]> = {
  frontend: ["React", "TypeScript", "CSS", "HTML", "JavaScript"],
  backend: ["Node.js", "Python", "SQL", "REST APIs", "Docker"],
  data: ["Python", "Pandas", "SQL", "Machine Learning", "Tableau"],
  fullstack: ["React", "Node.js", "MongoDB", "TypeScript", "Docker"],
  ml: ["Python", "TensorFlow", "Scikit-learn", "Deep Learning", "NLP"],
  devops: ["Docker", "Kubernetes", "CI/CD", "AWS", "Linux"],
  default: [
    "Communication",
    "Problem Solving",
    "Team Collaboration",
    "JavaScript",
    "Python",
  ],
};

function extractSkillsFromFilename(filename: string): string[] {
  const lower = filename.toLowerCase();
  for (const [key, skills] of Object.entries(SAMPLE_SKILLS_BY_KEYWORD)) {
    if (key !== "default" && lower.includes(key)) return skills;
  }
  return SAMPLE_SKILLS_BY_KEYWORD.default;
}

export default function ResumeAnalyzer() {
  const { actor } = useActor();
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [expandedQ, setExpandedQ] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    if (!file.name.endsWith(".pdf")) {
      toast.error("Please upload a PDF file.");
      return;
    }
    setFileName(file.name);
    const extracted = extractSkillsFromFilename(file.name);
    setSkills(extracted);
    toast.success("Resume uploaded! Edit skills below and analyze.");
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function addSkill() {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
      setSkillInput("");
    }
  }

  function removeSkill(skill: string) {
    setSkills((prev) => prev.filter((s) => s !== skill));
  }

  async function analyzeResume() {
    if (!actor) {
      toast.error("Actor not ready.");
      return;
    }
    if (skills.length === 0) {
      toast.error("Add at least one skill.");
      return;
    }
    setIsAnalyzing(true);
    try {
      const analysisId = await actor.saveResumeAnalysis(skills);
      const result = await actor.getResumeAnalysis(analysisId);
      const data = result[0];
      if (data) {
        setAnalysis(data);
        toast.success("Analysis complete! Personalized questions generated.");
      }
    } catch {
      toast.error("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-10">
          <h1 className="font-display font-bold text-4xl mb-3">
            Resume <span className="gradient-text">Analyzer</span>
          </h1>
          <p className="text-muted-foreground">
            Upload your resume to get personalized interview questions based on
            your skills.
          </p>
        </div>

        {/* Upload zone */}
        <div
          data-ocid="resume.dropzone"
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ")
              fileInputRef.current?.click();
          }}
          className={`glass-card rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 mb-6 ${
            isDragging
              ? "border-primary shadow-glow scale-[1.02]"
              : "hover:border-primary/40"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFile(e.target.files[0]);
            }}
          />
          <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4 shadow-glow">
            {fileName ? (
              <FileText className="w-8 h-8 text-white" />
            ) : (
              <Upload className="w-8 h-8 text-white" />
            )}
          </div>
          {fileName ? (
            <>
              <p className="font-semibold text-primary">{fileName}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Click to change file
              </p>
            </>
          ) : (
            <>
              <p className="font-semibold mb-1">Drop your PDF resume here</p>
              <p className="text-sm text-muted-foreground">
                or click to browse
              </p>
            </>
          )}
          <Button
            variant="outline"
            size="sm"
            type="button"
            data-ocid="resume.upload_button"
            className="mt-4 rounded-xl pointer-events-none"
          >
            <Upload className="w-3.5 h-3.5 mr-1.5" /> Upload PDF
          </Button>
        </div>

        {/* Skills editor */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          <h3 className="font-display font-semibold mb-4">Your Skills</h3>
          <div className="flex gap-2 mb-4">
            <Input
              id="skill-input"
              data-ocid="resume.skill.input"
              placeholder="Add a skill (e.g. Python, React)"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addSkill();
              }}
              className="rounded-xl flex-1"
            />
            <Button
              type="button"
              onClick={addSkill}
              variant="outline"
              className="rounded-xl"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {skills.map((skill) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Badge
                    variant="secondary"
                    className="pl-3 pr-1 py-1 text-sm flex items-center gap-1.5"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      aria-label={`Remove skill: ${skill}`}
                      className="ml-1 hover:text-destructive transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                </motion.div>
              ))}
            </AnimatePresence>
            {skills.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No skills added yet. Upload a resume or add skills manually.
              </p>
            )}
          </div>
        </div>

        <Button
          data-ocid="resume.analyze.button"
          type="button"
          onClick={analyzeResume}
          disabled={isAnalyzing || skills.length === 0}
          className="w-full gradient-bg text-white rounded-xl mb-8 py-3"
          size="lg"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" /> Analyzing...
            </>
          ) : (
            "Analyze Resume & Generate Questions"
          )}
        </Button>

        {/* Results */}
        <AnimatePresence>
          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="font-display font-semibold text-xl mb-4">
                🎯 Personalized Interview Questions
              </h3>
              <div className="space-y-3">
                {analysis.questions.map((q, i) => (
                  <motion.div
                    // biome-ignore lint/suspicious/noArrayIndexKey: ordered list
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      transition: { delay: i * 0.05 },
                    }}
                    className="glass-card rounded-xl"
                  >
                    <button
                      type="button"
                      className="w-full p-4 text-left flex items-start justify-between gap-3"
                      onClick={() => setExpandedQ(expandedQ === i ? null : i)}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xs font-bold text-primary bg-primary/10 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <p className="text-sm font-medium">{q}</p>
                      </div>
                      {expandedQ === i ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      )}
                    </button>
                    <AnimatePresence>
                      {expandedQ === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 text-sm text-muted-foreground border-t border-border/50 pt-3">
                            Think about your experience with this skill and
                            provide specific examples using the STAR method
                            (Situation, Task, Action, Result).
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
