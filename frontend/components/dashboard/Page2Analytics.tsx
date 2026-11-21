import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Flame,
  TrendingUp,
  Cpu,
  Layers,
  Activity,
  CheckCircle2,
  Calendar,
  ChevronDown,
  BookOpen,
  ArrowUpRight
} from 'lucide-react';
import { ExamResult } from '../../types';

interface Page2AnalyticsProps {
  history: ExamResult[];
}

interface CognitiveAttribute {
  id: string;
  label: string;
  current: number;   // 0 - 100
  benchmark: number; // 0 - 100
  delta: string;
  status: string;
  description: string;
}

const COGNITIVE_ATTRIBUTES: CognitiveAttribute[] = [
  {
    id: 'velocity',
    label: 'Think Velocity',
    current: 97,
    benchmark: 88,
    delta: '+9% vs Benchmark',
    status: '[Optimal]',
    description: 'Rapid recall retrieval and high-speed deliberation under rigorous time constraints.'
  },
  {
    id: 'precision',
    label: 'Precision & Logic',
    current: 92,
    benchmark: 90,
    delta: '+2% vs Benchmark',
    status: '[Mastered]',
    description: 'Deductive accuracy and minimal variance on multi-step reasoning problems.'
  },
  {
    id: 'retention',
    label: 'Concept Retention',
    current: 90,
    benchmark: 57,
    delta: '+33% vs Benchmark',
    status: '[Superior]',
    description: 'Longitudinal decay resistance and strong spaced-repetition durability.'
  },
  {
    id: 'reasoning',
    label: 'Critical Reasoning',
    current: 96,
    benchmark: 89,
    delta: '+7% vs Benchmark',
    status: '[Advanced]',
    description: 'Counterfactual analysis and fallacy detection across complex academic literature.'
  },
  {
    id: 'depth',
    label: 'Analytical Depth',
    current: 60,
    benchmark: 85,
    delta: '-25% Focus Area',
    status: '[Review Needed]',
    description: 'Multi-layered proofs and edge-case evaluation requiring supplemental practice.'
  },
  {
    id: 'synthesis',
    label: 'Systems Synthesis',
    current: 86,
    benchmark: 96,
    delta: '-10% Growth Target',
    status: '[In Progress]',
    description: 'Interdisciplinary domain bridging and cross-paradigm knowledge application.'
  }
];

export const Page2Analytics: React.FC<Page2AnalyticsProps> = ({ history }) => {
  const [selectedAttributeId, setSelectedAttributeId] = useState<string>('velocity');
  const [selectedYear, setSelectedYear] = useState<'2024' | '2023'>('2024');

  const selectedAttribute = useMemo(() => {
    return (
      COGNITIVE_ATTRIBUTES.find((attr) => attr.id === selectedAttributeId) ||
      COGNITIVE_ATTRIBUTES[0]
    );
  }, [selectedAttributeId]);

  // Aggregate stats
  const stats = useMemo(() => {
    if (history.length === 0) {
      return {
        totalExams: 6,
        averageScore: 84,
        totalTimeMinutes: 142,
        currentStreak: 7,
        bestScore: 95,
        totalQuestions: 60,
      };
    }

    const totalExams = history.length;
    const averageScore = Math.round(
      history.reduce((acc, curr) => acc + (curr.score || 0), 0) / totalExams
    );
    const totalTimeMinutes = Math.round(
      history.reduce((acc, curr) => acc + (curr.timeTaken || 0), 0) / 60
    );
    const bestScore = Math.max(...history.map((e) => e.score || 0));
    const totalQuestions = history.reduce((acc, curr) => acc + (curr.totalQuestions || 10), 0);

    return {
      totalExams,
      averageScore,
      totalTimeMinutes,
      currentStreak: 7,
      bestScore,
      totalQuestions,
    };
  }, [history]);

  // Trend data for Line Chart: Think Time vs Accuracy
  const trendData = useMemo(() => {
    if (history.length >= 3) {
      return history.slice(0, 10).reverse().map((exam, i) => {
        const dateStr = exam.date
          ? new Date(exam.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
          : `Session ${i + 1}`;
        const avgSecondsPerQ = exam.totalQuestions
          ? Math.round(exam.timeTaken / exam.totalQuestions)
          : Math.round(exam.timeTaken / 10);
        return {
          session: dateStr,
          accuracy: exam.score,
          thinkTime: avgSecondsPerQ,
        };
      });
    }

    // Baseline synthetic trajectory
    return [
      { session: 'Nov 12', accuracy: 68, thinkTime: 62 },
      { session: 'Nov 14', accuracy: 74, thinkTime: 55 },
      { session: 'Nov 16', accuracy: 82, thinkTime: 48 },
      { session: 'Nov 18', accuracy: 79, thinkTime: 50 },
      { session: 'Nov 19', accuracy: 88, thinkTime: 42 },
      { session: 'Nov 21', accuracy: 94, thinkTime: 38 },
    ];
  }, [history]);

  // Topic Performance Bar Data
  const topicData = [
    { subject: 'Data Structures', accuracy: 92 },
    { subject: 'Cognitive Science', accuracy: 86 },
    { subject: 'Macroeconomics', accuracy: 80 },
    { subject: 'Neurobiology', accuracy: 76 },
    { subject: 'Constitutional Law', accuracy: 72 },
  ];

  // Mastery Distribution Data for Donut Chart
  const masteryData = [
    { name: 'Mastered (>80%)', value: 58, color: '#ffffff' },
    { name: 'Proficient (60-80%)', value: 28, color: '#a1a1aa' },
    { name: 'Developing (<60%)', value: 14, color: '#3f3f46' },
  ];

  // 52-week Authentic GitHub Heatmap Generation (Mirroring 2026-11-21_23-08.png)
  const heatmapWeeks = useMemo(() => {
    // 52 columns, each having 7 days
    const weeks: { date: string; count: number; level: number }[][] = [];
    const seedValues = [
      0, 1, 0, 2, 0, 3, 4, 1, 0, 2, 3, 4, 2, 1, 0, 0, 2, 3, 1, 4,
      0, 1, 2, 3, 2, 4, 1, 0, 3, 4, 2, 1, 0, 2, 3, 4, 3, 2, 1, 0,
      1, 2, 3, 4, 2, 3, 4, 1, 2, 3, 4, 4
    ];

    for (let w = 0; w < 52; w++) {
      const days = [];
      const baseLevel = seedValues[w % seedValues.length];
      for (let d = 0; d < 7; d++) {
        // Skew weekends slightly lower, weekdays higher
        const isWeekend = d === 0 || d === 6;
        let lvl = isWeekend ? Math.max(0, baseLevel - 1) : (baseLevel + (d % 3)) % 5;
        // Last 4 weeks (recent study sprint)
        if (w >= 48) {
          lvl = Math.min(4, Math.max(1, lvl + 1));
        }
        const count = lvl === 0 ? 0 : lvl === 1 ? 2 : lvl === 2 ? 6 : lvl === 3 ? 12 : 24;
        days.push({
          date: `Week ${w + 1}, Day ${d + 1}`,
          count,
          level: lvl
        });
      }
      weeks.push(days);
    }
    return weeks;
  }, []);

  const MONTH_HEADERS = [
    'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'
  ];

  // Radar chart mathematical geometry (Mirroring 2026-11-21_23-18.png)
  const radarGeometry = useMemo(() => {
    const cx = 220;
    const cy = 185;
    const r = 115;
    const count = COGNITIVE_ATTRIBUTES.length; // 6 vertices

    // Ring levels: 20%, 40%, 60%, 80%, 100%
    const rings = [0.2, 0.4, 0.6, 0.8, 1.0].map((scale) => {
      const points = COGNITIVE_ATTRIBUTES.map((_, i) => {
        const angle = -Math.PI / 2 + (i * 2 * Math.PI) / count;
        const x = cx + scale * r * Math.cos(angle);
        const y = cy + scale * r * Math.sin(angle);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      }).join(' ');
      return points;
    });

    // Spoke axes
    const spokes = COGNITIVE_ATTRIBUTES.map((_, i) => {
      const angle = -Math.PI / 2 + (i * 2 * Math.PI) / count;
      return {
        x1: cx,
        y1: cy,
        x2: cx + r * Math.cos(angle),
        y2: cy + r * Math.sin(angle),
      };
    });

    // Current Learner Polygon
    const learnerCoords = COGNITIVE_ATTRIBUTES.map((attr, i) => {
      const angle = -Math.PI / 2 + (i * 2 * Math.PI) / count;
      const dist = (attr.current / 100) * r;
      return {
        x: cx + dist * Math.cos(angle),
        y: cy + dist * Math.sin(angle),
        attr,
      };
    });
    const learnerPoints = learnerCoords.map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ');

    // Target Benchmark Polygon
    const benchmarkCoords = COGNITIVE_ATTRIBUTES.map((attr, i) => {
      const angle = -Math.PI / 2 + (i * 2 * Math.PI) / count;
      const dist = (attr.benchmark / 100) * r;
      return {
        x: cx + dist * Math.cos(angle),
        y: cy + dist * Math.sin(angle),
        attr,
      };
    });
    const benchmarkPoints = benchmarkCoords.map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ');

    // Vertex Label positions (radius * 1.32 for outer margin)
    const labelPositions = COGNITIVE_ATTRIBUTES.map((attr, i) => {
      const angle = -Math.PI / 2 + (i * 2 * Math.PI) / count;
      const x = cx + (r + 34) * Math.cos(angle);
      const y = cy + (r + 30) * Math.sin(angle);
      let textAnchor: 'middle' | 'start' | 'end' = 'middle';
      if (Math.abs(Math.cos(angle)) > 0.3) {
        textAnchor = Math.cos(angle) > 0 ? 'start' : 'end';
      }
      return {
        attr,
        x,
        y,
        textAnchor,
      };
    });

    return {
      cx,
      cy,
      rings,
      spokes,
      learnerPoints,
      learnerCoords,
      benchmarkPoints,
      benchmarkCoords,
      labelPositions,
    };
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 py-4 px-4 sm:px-6">
      {/* Top Header & Streak Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 bg-surface-1 border border-border">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs font-mono text-text-3 uppercase tracking-wider">
            <Activity className="size-3.5 text-text-1" />
            <span>Learning Intelligence & Performance Trends</span>
          </div>
          <h2
            className="text-2xl sm:text-3xl font-medium tracking-tight text-text-1 font-serif"
            style={{ fontFamily: "'ITC Garamond Std', Georgia, serif" }}
          >
            Cognitive Diagnostics
          </h2>
        </div>

        {/* Streak Counter Pill */}
        <div className="flex items-center gap-3 px-4 py-2 bg-surface-2 border border-border">
          <div className="size-8 rounded-none bg-white text-black flex items-center justify-center font-bold">
            <Flame className="size-4 text-black" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-text-1">
              {stats.currentStreak} Day Active Streak
            </span>
            <span className="text-[10px] font-mono text-text-3 uppercase">
              Consistent Learner Tier
            </span>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 bg-surface-1 border border-border flex flex-col gap-1">
          <span className="text-[11px] font-mono text-text-3 uppercase">Average Accuracy</span>
          <span className="text-2xl sm:text-3xl font-semibold font-mono text-text-1">
            {stats.averageScore}%
          </span>
          <span className="text-[10px] text-text-2 flex items-center gap-1">
            <TrendingUp className="size-3 text-white" /> +5.4% improvement
          </span>
        </div>

        <div className="p-4 bg-surface-1 border border-border flex flex-col gap-1">
          <span className="text-[11px] font-mono text-text-3 uppercase">Questions Answered</span>
          <span className="text-2xl sm:text-3xl font-semibold font-mono text-text-1">
            {stats.totalQuestions}
          </span>
          <span className="text-[10px] text-text-2">Across all assessments</span>
        </div>

        <div className="p-4 bg-surface-1 border border-border flex flex-col gap-1">
          <span className="text-[11px] font-mono text-text-3 uppercase">Total Deliberation</span>
          <span className="text-2xl sm:text-3xl font-semibold font-mono text-text-1">
            {stats.totalTimeMinutes}m
          </span>
          <span className="text-[10px] text-text-2">Active cognitive effort</span>
        </div>

        <div className="p-4 bg-surface-1 border border-border flex flex-col gap-1">
          <span className="text-[11px] font-mono text-text-3 uppercase">Peak Benchmark</span>
          <span className="text-2xl sm:text-3xl font-semibold font-mono text-text-1">
            {stats.bestScore}%
          </span>
          <span className="text-[10px] text-text-2">Best recorded score</span>
        </div>
      </div>

      {/* 52-Week Authentic Contribution Heatmap & Study Stream (Mirroring 2026-11-21_23-08.png) */}
      <div className="p-5 bg-surface-1 border border-border flex flex-col gap-5">
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-text-1">
            2,731 study checkpoints completed in the last year
          </h3>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="text-xs text-text-2 hover:text-text-1 flex items-center gap-1 transition-colors"
            >
              <span>Study settings</span>
              <ChevronDown className="size-3" />
            </button>
          </div>
        </div>

        {/* Heatmap Outer Canvas */}
        <div className="p-4 bg-surface-2/60 border border-border overflow-x-auto">
          <div className="min-w-[760px] flex flex-col gap-2">
            {/* Months Header Row */}
            <div className="flex items-center pl-7 text-[10px] font-mono text-text-3 justify-between pr-2">
              {MONTH_HEADERS.map((m, idx) => (
                <span key={`${m}-${idx}`}>{m}</span>
              ))}
            </div>

            {/* Grid Container with Day Labels */}
            <div className="flex items-start gap-2">
              {/* Day Labels (Mon, Wed, Fri) */}
              <div className="flex flex-col justify-between h-[84px] text-[9px] font-mono text-text-3 pr-1 pt-0.5">
                <span className="leading-none">Mon</span>
                <span className="leading-none">Wed</span>
                <span className="leading-none">Fri</span>
              </div>

              {/* 52 Columns Grid */}
              <div className="flex-1 grid grid-flow-col grid-cols-52 gap-[3px]">
                {heatmapWeeks.map((week, wIdx) => (
                  <div key={wIdx} className="grid grid-rows-7 gap-[3px]">
                    {week.map((day, dIdx) => {
                      const bgColors = [
                        '#161b22', // Level 0 (inactive)
                        '#0e4429', // Level 1
                        '#006d32', // Level 2
                        '#26a641', // Level 3
                        '#39d353', // Level 4
                      ];
                      const borderColors = [
                        '#27272a',
                        '#0e4429',
                        '#006d32',
                        '#26a641',
                        '#39d353',
                      ];

                      return (
                        <div
                          key={dIdx}
                          className="size-[10px] rounded-[2px] transition-transform hover:scale-125 cursor-pointer"
                          style={{
                            backgroundColor: bgColors[day.level],
                            border: `1px solid ${borderColors[day.level]}`,
                          }}
                          title={`${day.count} checkpoints on ${day.date}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Heatmap Legend & Footer */}
            <div className="flex items-center justify-between text-xs pt-2 text-text-3">
              <a
                href="#learn-more"
                onClick={(e) => e.preventDefault()}
                className="text-text-2 hover:text-text-1 text-[11px] underline underline-offset-2 transition-colors"
              >
                Learn how we track study streaks
              </a>

              <div className="flex items-center gap-1.5 text-[10px] font-mono">
                <span>Less</span>
                <span className="size-[10px] rounded-[2px] bg-[#161b22] border border-[#27272a]" />
                <span className="size-[10px] rounded-[2px] bg-[#0e4429] border border-[#0e4429]" />
                <span className="size-[10px] rounded-[2px] bg-[#006d32] border border-[#006d32]" />
                <span className="size-[10px] rounded-[2px] bg-[#26a641] border border-[#26a641]" />
                <span className="size-[10px] rounded-[2px] bg-[#39d353] border border-[#39d353]" />
                <span>More</span>
              </div>
            </div>
          </div>
        </div>

        {/* Study Activity Timeline Section (Mirroring bottom of 2026-11-21_23-08.png) */}
        <div className="flex flex-col gap-3 pt-2">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-text-1">
              Study Activity
            </h4>
            <div className="flex items-center gap-1 text-xs">
              <button
                type="button"
                onClick={() => setSelectedYear('2024')}
                className={`px-2 py-0.5 font-mono text-[11px] transition-colors ${
                  selectedYear === '2024'
                    ? 'bg-white text-black font-semibold'
                    : 'text-text-2 hover:text-text-1 hover:bg-surface-2'
                }`}
              >
                2024
              </button>
              <button
                type="button"
                onClick={() => setSelectedYear('2023')}
                className={`px-2 py-0.5 font-mono text-[11px] transition-colors ${
                  selectedYear === '2023'
                    ? 'bg-white text-black font-semibold'
                    : 'text-text-2 hover:text-text-1 hover:bg-surface-2'
                }`}
              >
                2023
              </button>
            </div>
          </div>

          {/* Activity Timeline List */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[11px] font-mono text-text-3 uppercase">November 2024</span>

            <div className="flex items-start gap-3 p-2.5 bg-surface-2/40 border border-border/60">
              <div className="p-1.5 bg-surface-3 text-text-1 shrink-0">
                <BookOpen className="size-3.5" />
              </div>
              <div className="flex flex-col gap-0.5 text-xs flex-1">
                <span className="text-text-1 font-medium">
                  Completed 14 exam review checkpoints in 3 subjects
                </span>
                <span className="text-text-3 font-mono text-[10px]">
                  Data Structures, Cognitive Science, Macroeconomics · Nov 18 - Nov 21
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald px-1.5 py-0.5 bg-emerald/10 border border-emerald/20">
                [Completed]
              </span>
            </div>

            <div className="flex items-start gap-3 p-2.5 bg-surface-2/40 border border-border/60">
              <div className="p-1.5 bg-surface-3 text-text-1 shrink-0">
                <CheckCircle2 className="size-3.5 text-white" />
              </div>
              <div className="flex flex-col gap-0.5 text-xs flex-1">
                <span className="text-text-1 font-medium">
                  Generated and mastered 8 specialized study modules
                </span>
                <span className="text-text-3 font-mono text-[10px]">
                  Synthesized from 4 attached reference materials · Nov 12 - Nov 16
                </span>
              </div>
              <span className="text-[10px] font-mono text-white px-1.5 py-0.5 bg-white/10 border border-white/20">
                [Mastered]
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Columns: Line Chart (Think Time vs Accuracy) & Pie Chart (Mastery Distribution) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart: Think Time vs Accuracy (Spans 2 cols) */}
        <div className="lg:col-span-2 p-5 bg-surface-1 border border-border flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-text-1 font-mono uppercase tracking-wide">
                Deliberation vs. Accuracy Trajectory
              </h3>
              <p className="text-xs text-text-2">
                Think time per question (seconds) versus scoring accuracy (%) across recent sessions.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-white">
                <span className="size-2 bg-white" /> Accuracy (%)
              </span>
              <span className="flex items-center gap-1.5 text-zinc-400">
                <span className="size-2 bg-zinc-400" /> Think Time (s)
              </span>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <XAxis dataKey="session" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis
                  yAxisId="left"
                  stroke="#71717a"
                  fontSize={11}
                  domain={[40, 100]}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#71717a"
                  fontSize={11}
                  domain={[20, 80]}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#121215',
                    borderColor: '#27272a',
                    borderRadius: '0px',
                    fontSize: '12px',
                    color: '#f4f4f5',
                  }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#ffffff"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#ffffff' }}
                  name="Accuracy (%)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="thinkTime"
                  stroke="#71717a"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 3, fill: '#71717a' }}
                  name="Think Time (s)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart: Cognitive Score Distribution */}
        <div className="p-5 bg-surface-1 border border-border flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-semibold text-text-1 font-mono uppercase tracking-wide">
              Mastery Tier Distribution
            </h3>
            <p className="text-xs text-text-2">Question bank performance tiers.</p>
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={masteryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {masteryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#121215',
                    borderColor: '#27272a',
                    borderRadius: '0px',
                    fontSize: '12px',
                    color: '#f4f4f5',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-col gap-2 pt-2 border-t border-border text-xs">
            {masteryData.map((tier) => (
              <div key={tier.name} className="flex items-center justify-between text-text-2">
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-none" style={{ backgroundColor: tier.color }} />
                  <span>{tier.name}</span>
                </div>
                <span className="font-mono text-text-1">{tier.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two Columns: Hexagonal Multi-Layered Cognitive Spider/Radar Chart & Discipline Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hexagonal Cognitive Radar System (Mirroring 2026-11-21_23-18.png) */}
        <div className="p-5 bg-surface-1 border border-border flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Cpu className="size-4 text-text-1" />
              <h3 className="text-sm font-semibold text-text-1 font-mono uppercase tracking-wide">
                Cognitive Competency Radar
              </h3>
            </div>
            {/* Dual Legend: Learner (Blue) vs Target Benchmark (Green/Emerald) */}
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="flex items-center gap-1.5 text-sky-400">
                <span className="size-2 rounded-full bg-sky-400" /> Learner (Active)
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="size-2 rounded-full bg-emerald-400" /> Target Benchmark
              </span>
            </div>
          </div>

          <p className="text-xs text-text-2">
            Multi-axis diagnostic geometry comparing active learner performance against target domain mastery benchmarks.
          </p>

          {/* Hexagonal Radar Canvas */}
          <div className="relative w-full h-[360px] bg-surface-2/50 border border-border flex items-center justify-center p-2 select-none overflow-hidden">
            <svg
              className="w-full h-full max-w-[480px] max-h-[350px]"
              viewBox="0 0 440 370"
            >
              {/* Concentric Hexagon Grid Rings */}
              {radarGeometry.rings.map((ringPoints, idx) => (
                <polygon
                  key={idx}
                  points={ringPoints}
                  fill="none"
                  stroke="#27272a"
                  strokeWidth="1"
                  strokeDasharray={idx === 4 ? 'none' : '2 2'}
                />
              ))}

              {/* Radial Spokes from Center */}
              {radarGeometry.spokes.map((spoke, idx) => (
                <line
                  key={idx}
                  x1={spoke.x1}
                  y1={spoke.y1}
                  x2={spoke.x2}
                  y2={spoke.y2}
                  stroke="#3f3f46"
                  strokeWidth="1"
                />
              ))}

              {/* Polygon 2: Target Benchmark (Green/Emerald) */}
              <polygon
                points={radarGeometry.benchmarkPoints}
                fill="rgba(52, 211, 153, 0.12)"
                stroke="#34d399"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
              {radarGeometry.benchmarkCoords.map((coord, idx) => (
                <circle
                  key={`bm-${idx}`}
                  cx={coord.x}
                  cy={coord.y}
                  r="3"
                  fill="#34d399"
                />
              ))}

              {/* Polygon 1: Current Learner Diagnostic (Blue/Sky) */}
              <polygon
                points={radarGeometry.learnerPoints}
                fill="rgba(56, 189, 248, 0.22)"
                stroke="#38bdf8"
                strokeWidth="2"
              />
              {radarGeometry.learnerCoords.map((coord, idx) => (
                <circle
                  key={`ln-${idx}`}
                  cx={coord.x}
                  cy={coord.y}
                  r="4"
                  fill="#38bdf8"
                  className="cursor-pointer hover:scale-125 transition-transform"
                  onClick={() => setSelectedAttributeId(coord.attr.id)}
                />
              ))}

              {/* Outer Vertex Labels and Dual Scores (e.g., 97 / 88) */}
              {radarGeometry.labelPositions.map((pos) => {
                const isSelected = selectedAttributeId === pos.attr.id;
                return (
                  <g
                    key={pos.attr.id}
                    onClick={() => setSelectedAttributeId(pos.attr.id)}
                    className="cursor-pointer transition-opacity hover:opacity-100"
                    style={{ opacity: isSelected ? 1 : 0.85 }}
                  >
                    <text
                      x={pos.x}
                      y={pos.y - 6}
                      fill={isSelected ? '#ffffff' : '#e4e4e7'}
                      fontSize="11"
                      fontFamily="sans-serif"
                      fontWeight={isSelected ? '600' : '500'}
                      textAnchor={pos.textAnchor}
                    >
                      {pos.attr.label}
                    </text>
                    <text
                      x={pos.x}
                      y={pos.y + 9}
                      fontSize="10"
                      fontFamily="monospace"
                      textAnchor={pos.textAnchor}
                    >
                      <tspan fill="#38bdf8" fontWeight="600">{pos.attr.current}</tspan>
                      <tspan fill="#71717a"> / </tspan>
                      <tspan fill="#34d399">{pos.attr.benchmark}</tspan>
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Selected Attribute Detail Card */}
          <div className="p-3 bg-surface-2 border border-border flex flex-col gap-1.5 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-text-1 font-mono uppercase">
                  {selectedAttribute.label}
                </span>
                <span className="text-[10px] font-mono text-emerald px-1.5 py-0.5 bg-emerald/10 border border-emerald/20">
                  {selectedAttribute.status}
                </span>
              </div>
              <span className="font-mono text-xs font-semibold text-text-1">
                {selectedAttribute.delta}
              </span>
            </div>
            <p className="text-[11px] text-text-2">
              {selectedAttribute.description}
            </p>
          </div>
        </div>

        {/* Topic Accuracy Breakdown Bar Chart */}
        <div className="p-5 bg-surface-1 border border-border flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="size-4 text-text-1" />
              <h3 className="text-sm font-semibold text-text-1 font-mono uppercase tracking-wide">
                Discipline Mastery Breakdown
              </h3>
            </div>
            <span className="text-[10px] font-mono text-text-3 uppercase">Accuracy %</span>
          </div>

          <p className="text-xs text-text-2">
            Cumulative accuracy rates evaluated across core subject domains.
          </p>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicData} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" stroke="#71717a" domain={[0, 100]} fontSize={11} tickLine={false} />
                <YAxis dataKey="subject" type="category" stroke="#a1a1aa" fontSize={11} tickLine={false} width={120} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#121215',
                    borderColor: '#27272a',
                    borderRadius: '0px',
                    fontSize: '12px',
                    color: '#f4f4f5',
                  }}
                />
                <Bar dataKey="accuracy" fill="#ffffff" radius={0} barSize={14} name="Accuracy (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page2Analytics;