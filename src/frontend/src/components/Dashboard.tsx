import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  Award,
  Calendar,
  CheckCircle,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { sessionHistory } from "../mockData";

const sessionChartData = sessionHistory
  .map((s) => ({
    name: s.date.split(",")[0],
    score: s.score,
    role: s.role.split(" ")[0],
  }))
  .reverse();

const radarData = [
  { subject: "Correctness", score: 82 },
  { subject: "Communication", score: 75 },
  { subject: "Confidence", score: 68 },
  { subject: "Tech Knowledge", score: 88 },
  { subject: "Problem Solving", score: 79 },
];

const strengths = [
  {
    label: "Technical Knowledge",
    detail: "Strong grasp of CS fundamentals and algorithms",
    score: 88,
  },
  {
    label: "Code Correctness",
    detail: "Accurate and logically sound implementations",
    score: 85,
  },
  {
    label: "Structured Thinking",
    detail: "Systematic breakdown of complex problems",
    score: 82,
  },
];

const weaknesses = [
  {
    label: "Confidence",
    detail: "Tendency to hedge answers — practice stating clearly and directly",
    score: 68,
  },
  {
    label: "Communication Clarity",
    detail: "Answers can be verbose — work on concise, structured responses",
    score: 75,
  },
  {
    label: "System Design",
    detail: "Focus on scalability trade-offs and estimation techniques",
    score: 65,
  },
];

const statusColor: Record<string, string> = {
  Completed: "bg-green-500/10 text-green-600 border-green-500/20",
  "In Progress": "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
};

export default function Dashboard() {
  const scores = sessionHistory.map((s) => s.score);
  const avgScore = Math.round(
    scores.reduce((a, b) => a + b, 0) / scores.length,
  );
  const bestScore = Math.max(...scores);
  const improvement = scores[0] - scores[scores.length - 1];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 section-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">
          <span className="gradient-text">Performance Dashboard</span>
        </h1>
        <p className="text-muted-foreground">
          Track your interview readiness and improvement over time.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Overall Score",
            value: `${avgScore}/100`,
            icon: Award,
            color: "from-violet-500 to-purple-600",
          },
          {
            label: "Sessions Done",
            value: sessionHistory.length.toString(),
            icon: Target,
            color: "from-blue-500 to-cyan-500",
          },
          {
            label: "Best Score",
            value: `${bestScore}/100`,
            icon: TrendingUp,
            color: "from-teal-500 to-green-500",
          },
          {
            label: "Improvement",
            value: `+${Math.abs(improvement)} pts`,
            icon: Zap,
            color: "from-orange-500 to-amber-400",
          },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-card border border-border rounded-2xl p-4 shadow-lg"
          >
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3 shadow-md`}
            >
              <card.icon className="w-5 h-5 text-white" />
            </div>
            <div className="font-display text-2xl font-bold">{card.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {card.label}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Bar chart */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-lg">
          <h3 className="font-display font-bold mb-4">Session Score History</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={sessionChartData}
              margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.5 0 0 / 0.1)"
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11 }}
                stroke="oklch(0.5 0 0 / 0.4)"
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 11 }}
                stroke="oklch(0.5 0 0 / 0.4)"
              />
              <Tooltip
                contentStyle={{
                  background: "oklch(0.17 0.03 280)",
                  border: "1px solid oklch(0.3 0.04 280)",
                  borderRadius: "12px",
                  fontSize: 12,
                }}
              />
              <Bar
                dataKey="score"
                fill="oklch(0.60 0.22 278)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar chart */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-lg">
          <h3 className="font-display font-bold mb-4">Skill Breakdown</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="oklch(0.5 0 0 / 0.15)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
              <Radar
                name="Score"
                dataKey="score"
                stroke="oklch(0.60 0.22 278)"
                fill="oklch(0.60 0.22 278)"
                fillOpacity={0.25}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Strengths */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <h3 className="font-display font-bold">Top Strengths</h3>
          </div>
          <div className="space-y-4">
            {strengths.map((s) => (
              <div key={s.label}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">{s.label}</span>
                  <span className="text-sm font-bold text-green-500">
                    {s.score}%
                  </span>
                </div>
                <Progress value={s.score} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">{s.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Weaknesses */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <h3 className="font-display font-bold">Areas to Improve</h3>
          </div>
          <div className="space-y-4">
            {weaknesses.map((w) => (
              <div key={w.label}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">{w.label}</span>
                  <span className="text-sm font-bold text-yellow-500">
                    {w.score}%
                  </span>
                </div>
                <Progress value={w.score} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">{w.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Session History */}
      <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="font-display font-bold">Session History</h3>
          </div>
        </div>
        <div className="divide-y divide-border">
          {sessionHistory.map((session, i) => (
            <div
              key={session.id}
              data-ocid={`dashboard.session.item.${i + 1}`}
              className="flex items-center justify-between px-5 py-4 hover:bg-secondary/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{i + 1}</span>
                </div>
                <div>
                  <div className="font-medium text-sm">{session.role}</div>
                  <div className="text-xs text-muted-foreground">
                    {session.date} · {session.questionsAnswered} questions
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`font-display font-bold text-lg ${
                    session.score >= 85
                      ? "text-green-500"
                      : session.score >= 70
                        ? "text-yellow-500"
                        : "text-red-400"
                  }`}
                >
                  {session.score}
                </div>
                <Badge
                  className={`text-xs border ${statusColor[session.status]}`}
                >
                  {session.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
