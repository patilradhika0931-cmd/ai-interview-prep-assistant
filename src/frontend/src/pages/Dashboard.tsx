import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Clock, Loader2, Plus, Target, TrendingUp, Trophy } from "lucide-react";
import { motion } from "motion/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { InterviewSession } from "../backend";
import { useActor } from "../hooks/useActor";

function formatDate(nanoseconds: bigint) {
  const ms = Number(nanoseconds) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function Dashboard() {
  const { actor, isFetching } = useActor();

  const { data: sessions, isLoading } = useQuery<InterviewSession[]>({
    queryKey: ["performance-history"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPerformanceHistory();
    },
    enabled: !!actor && !isFetching,
  });

  const completed = (sessions ?? []).filter((s) => s.status === "completed");
  const scores = completed.map((s) => Number(s.overallScore[0] ?? 0));
  const avgScore = scores.length
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0;
  const bestScore = scores.length ? Math.max(...scores) : 0;
  const latest = completed[completed.length - 1];

  const chartData = completed.map((s, i) => ({
    name: `#${i + 1} ${s.role.split(" ")[0]}`,
    score: Number(s.overallScore[0] ?? 0),
    date: formatDate(s.createdAt),
  }));

  const stats = [
    {
      label: "Total Interviews",
      value: (sessions ?? []).length,
      icon: Clock,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Average Score",
      value: `${avgScore}%`,
      icon: Target,
      color: "from-violet-500 to-blue-500",
    },
    {
      label: "Best Score",
      value: `${bestScore}%`,
      icon: Trophy,
      color: "from-orange-500 to-yellow-500",
    },
    {
      label: "Completed",
      value: completed.length,
      icon: TrendingUp,
      color: "from-teal-500 to-green-500",
    },
  ];

  if (isLoading) {
    return (
      <div
        data-ocid="dashboard.loading_state"
        className="flex items-center justify-center py-32"
      >
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-display font-bold text-4xl mb-1">
              Your <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-muted-foreground">
              Track your interview preparation progress.
            </p>
          </div>
          <Button
            asChild
            data-ocid="dashboard.new_interview.primary_button"
            className="gradient-bg text-white rounded-xl shadow-glow"
          >
            <Link to="/mock-interview">
              <Plus className="w-4 h-4 mr-2" /> New Interview
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: i * 0.08 } }}
              className="glass-card rounded-2xl p-5"
            >
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}
              >
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-display font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {completed.length === 0 ? (
          <motion.div
            data-ocid="dashboard.empty_state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card rounded-2xl p-16 text-center"
          >
            <div className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center mx-auto mb-6 shadow-glow opacity-60">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
            <h3 className="font-display font-bold text-2xl mb-3">
              No interviews yet
            </h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Complete your first mock interview to see your performance
              analytics here. You&apos;ve got this!
            </p>
            <Button
              asChild
              className="gradient-bg text-white rounded-xl shadow-glow"
            >
              <Link to="/mock-interview">Start Your First Interview</Link>
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
              className="lg:col-span-2 glass-card rounded-2xl p-6"
            >
              <h3 className="font-display font-semibold mb-6">Score History</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={chartData}
                  margin={{ top: 4, right: 4, left: -20, bottom: 4 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.5 0 0 / 0.1)"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11 }}
                    stroke="oklch(0.5 0 0 / 0.3)"
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
                    stroke="oklch(0.5 0 0 / 0.3)"
                  />
                  <Tooltip
                    contentStyle={{
                      background: "oklch(0.13 0.025 265)",
                      border: "1px solid oklch(0.25 0.04 265)",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar
                    dataKey="score"
                    fill="oklch(0.65 0.25 265)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Latest session details */}
            {latest && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
                className="glass-card rounded-2xl p-6"
              >
                <h3 className="font-display font-semibold mb-4">
                  Latest Session
                </h3>
                <Badge variant="secondary" className="mb-3">
                  {latest.role}
                </Badge>

                {latest.overallScore[0] !== undefined && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">
                        Score
                      </span>
                      <span className="text-sm font-bold">
                        {Number(latest.overallScore[0])}%
                      </span>
                    </div>
                    <Progress
                      value={Number(latest.overallScore[0])}
                      className="h-2"
                    />
                  </div>
                )}

                {latest.strengths.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-green-500 mb-1.5">
                      Strengths
                    </p>
                    {latest.strengths.slice(0, 2).map((s) => (
                      <p
                        key={`strength-${s}`}
                        className="text-xs text-muted-foreground flex items-start gap-1.5 mb-1"
                      >
                        <span className="text-green-500">•</span> {s}
                      </p>
                    ))}
                  </div>
                )}

                {latest.weaknesses.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-orange-400 mb-1.5">
                      To Improve
                    </p>
                    {latest.weaknesses.slice(0, 2).map((w) => (
                      <p
                        key={`weakness-${w}`}
                        className="text-xs text-muted-foreground flex items-start gap-1.5 mb-1"
                      >
                        <span className="text-orange-400">•</span> {w}
                      </p>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Session history */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
              className="lg:col-span-3 glass-card rounded-2xl p-6"
            >
              <h3 className="font-display font-semibold mb-4">
                Session History
              </h3>
              <div className="space-y-3">
                {completed.map((s, i) => (
                  <div key={String(s.id)} className="flex items-center gap-4">
                    <div className="text-xs text-muted-foreground w-8 flex-shrink-0">
                      #{i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium truncate">
                          {s.role}
                        </span>
                        <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                          {formatDate(s.createdAt)}
                        </span>
                      </div>
                      <Progress
                        value={Number(s.overallScore[0] ?? 0)}
                        className="h-1.5"
                      />
                    </div>
                    <div className="text-sm font-bold w-10 text-right flex-shrink-0">
                      {Number(s.overallScore[0] ?? 0)}%
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
