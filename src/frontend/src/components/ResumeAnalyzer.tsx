import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart2,
  CheckCircle,
  FileText,
  HelpCircle,
  Lightbulb,
  Loader2,
  RefreshCcw,
  Upload,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { atsRecommendations, resumeQuestions, skillsPool } from "../mockData";

type AnalysisState = "idle" | "uploading" | "done";

function getRandomSkills(): string[] {
  const all = [
    ...skillsPool.default,
    ...skillsPool.tech,
    ...skillsPool.data,
    ...skillsPool.ai,
  ];
  const shuffled = all.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 10 + Math.floor(Math.random() * 6));
}

export default function ResumeAnalyzer() {
  const [state, setState] = useState<AnalysisState>("idle");
  const [fileName, setFileName] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [atsScore] = useState(() => 68 + Math.floor(Math.random() * 20));
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setFileName(file.name);
    setState("uploading");
    setTimeout(() => {
      setSkills(getRandomSkills());
      setState("done");
    }, 2200);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleReset = () => {
    setState("idle");
    setFileName("");
    setSkills([]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const recs = atsRecommendations.slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 section-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">
          <span className="gradient-text">Resume Analyzer</span>
        </h1>
        <p className="text-muted-foreground">
          Upload your resume to extract skills and get personalized interview
          questions.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {state === "idle" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div
              data-ocid="resume.upload.dropzone"
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onClick={() => inputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  inputRef.current?.click();
              }}
              className={`relative border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all duration-300 ${
                dragging
                  ? "border-primary bg-primary/10 scale-[1.01]"
                  : "border-border hover:border-primary/50 hover:bg-secondary/50"
              }`}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={handleInputChange}
              />
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-5 shadow-glow">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-display text-xl font-bold mb-2">
                Drop your resume here
              </h3>
              <p className="text-muted-foreground mb-4">
                or click to browse files
              </p>
              <p className="text-xs text-muted-foreground">
                Supports PDF, DOC, DOCX — up to 10MB
              </p>
              <button
                type="button"
                data-ocid="resume.upload.button"
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current?.click();
                }}
                className="mt-6 btn-gradient inline-flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Choose File
              </button>
            </div>
          </motion.div>
        )}

        {state === "uploading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
            <h3 className="font-display text-xl font-bold mb-2">
              Analyzing Resume
            </h3>
            <p className="text-muted-foreground">{fileName}</p>
            <div className="max-w-xs mx-auto mt-6 space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Extracting skills...</span>
                <span>67%</span>
              </div>
              <Progress value={67} className="h-2" />
            </div>
          </motion.div>
        )}

        {state === "done" && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            {/* Uploaded file */}
            <div className="flex items-center justify-between bg-card border border-border rounded-xl px-4 py-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <div className="font-medium text-sm">{fileName}</div>
                  <div className="text-xs text-muted-foreground">
                    Analysis complete
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                New Upload
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {/* Skills card */}
              <div className="bg-card border border-border rounded-2xl p-5 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <h3 className="font-display font-bold">Extracted Skills</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge
                      key={skill}
                      className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* ATS Score */}
              <div className="bg-card border border-border rounded-2xl p-5 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart2 className="w-5 h-5 text-primary" />
                  <h3 className="font-display font-bold">ATS Score</h3>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="font-display text-4xl font-bold gradient-text">
                    {atsScore}/100
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {atsScore >= 80
                      ? "Excellent — ATS-ready"
                      : atsScore >= 65
                        ? "Good — Minor improvements suggested"
                        : "Needs work — See recommendations"}
                  </div>
                </div>
                <Progress value={atsScore} className="h-3 rounded-full" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0</span>
                  <span>100</span>
                </div>
              </div>
            </div>

            {/* Personalized questions */}
            <div className="bg-card border border-border rounded-2xl p-5 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle className="w-5 h-5 text-accent" />
                <h3 className="font-display font-bold">
                  Personalized Interview Questions
                </h3>
              </div>
              <div className="space-y-3">
                {resumeQuestions.map((q, i) => (
                  <div
                    key={q}
                    className="flex gap-3 p-3 rounded-xl bg-secondary/50 border border-border/50"
                  >
                    <span className="font-display font-bold text-primary text-sm w-6 flex-shrink-0">
                      Q{i + 1}
                    </span>
                    <p className="text-sm leading-relaxed">{q}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-card border border-border rounded-2xl p-5 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                <h3 className="font-display font-bold">Recommendations</h3>
              </div>
              <div className="space-y-3">
                {recs.map((rec, i) => (
                  <div key={rec} className="flex gap-3">
                    <div className="w-6 h-6 rounded-full gradient-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">
                        {i + 1}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {rec}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
