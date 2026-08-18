import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SiGithub } from 'react-icons/si';
import { GitCommit, Flame, Calendar, ExternalLink, Sparkles, Loader2, AlertCircle } from 'lucide-react';

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ContributionGraphProps {
  username?: string;
  year?: number;
  className?: string;
}

type FetchState = 'idle' | 'loading' | 'success' | 'error';

/* ------------------------------------------------------------------ */
/* GitHub GraphQL contribution calendar fetcher                         */
/* ------------------------------------------------------------------ */
async function fetchGitHubContributions(
  username: string,
  year: number,
  token?: string
): Promise<{ weeks: ContributionDay[][]; total: number; maxStreak: number; currentStreak: number }> {
  if (!token) throw new Error('No GitHub token configured');

  const startDate = `${year}-01-01`;
  const endDate = `${year}-12-31`;

  const query = `
    query ($login: String!, $startDate: DateTime!, $endDate: DateTime!) {
      user(login: $login) {
        contributionsCollection(from: $startDate, to: $endDate) {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `;

  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, variables: { login: username, startDate, endDate } }),
  });

  if (!res.ok) throw new Error(`GitHub API ${res.status}`);

  const json = await res.json();
  const cal = json?.data?.user?.contributionsCollection?.contributionCalendar;
  if (!cal) throw new Error('No contribution data');

  const allDays: ContributionDay[] = [];
  let total = 0;
  let tempStreak = 0;
  let maxStrk = 0;
  let currStrk = 0;

  for (const week of cal.weeks) {
    for (const day of week.contributionDays) {
      const count = day.contributionCount;
      const d = new Date(day.date);
      const dateStr = d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (count >= 7) level = 4;
      else if (count >= 4) level = 3;
      else if (count >= 2) level = 2;
      else if (count >= 1) level = 1;

      if (count > 0) {
        total += count;
        tempStreak++;
        if (tempStreak > maxStrk) maxStrk = tempStreak;
        currStrk = tempStreak;
      } else {
        tempStreak = 0;
      }

      allDays.push({ date: dateStr, count, level });
    }
  }

  // Pad to 52 weeks (364 days) if needed
  while (allDays.length < 364) {
    allDays.push({ date: '', count: 0, level: 0 });
  }

  const weekChunks: ContributionDay[][] = [];
  for (let w = 0; w < 52; w++) {
    weekChunks.push(allDays.slice(w * 7, (w + 1) * 7));
  }

  return {
    weeks: weekChunks,
    total: cal.totalContributions ?? total,
    maxStreak: maxStrk,
    currentStreak: currStrk,
  };
}

/* ------------------------------------------------------------------ */
/* ContributionGraph Component                                         */
/* ------------------------------------------------------------------ */
export default function ContributionGraph({
  username = 'Jxck007',
  year = 2025,
  className = '',
}: ContributionGraphProps) {
  const [hoveredDay, setHoveredDay] = useState<{
    day: ContributionDay;
    x: number;
    y: number;
  } | null>(null);

  const [fetchState, setFetchState] = useState<FetchState>('idle');
  const [graphData, setGraphData] = useState<{
    weeks: ContributionDay[][];
    total: number;
    maxStreak: number;
    currentStreak: number;
  } | null>(null);

  const token = import.meta.env.VITE_GITHUB_TOKEN as string | undefined;

  const loadData = useCallback(async () => {
    setFetchState('loading');
    try {
      const data = await fetchGitHubContributions(username, year, token);
      setGraphData(data);
      setFetchState('success');
    } catch {
      setFetchState('error');
    }
  }, [username, year, token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const weeks = graphData?.weeks ?? [];
  const totalContributions = graphData?.total ?? 0;
  const maxStreak = graphData?.maxStreak ?? 0;
  const currentStreak = graphData?.currentStreak ?? 0;

  const monthLabels = [
    { name: 'Jan', col: 0 },
    { name: 'Feb', col: 4 },
    { name: 'Mar', col: 8 },
    { name: 'Apr', col: 13 },
    { name: 'May', col: 17 },
    { name: 'Jun', col: 21 },
    { name: 'Jul', col: 26 },
    { name: 'Aug', col: 30 },
    { name: 'Sep', col: 35 },
    { name: 'Oct', col: 39 },
    { name: 'Nov', col: 43 },
    { name: 'Dec', col: 48 },
  ];

  const getColorClass = (level: 0 | 1 | 2 | 3 | 4) => {
    switch (level) {
      case 0:
        return 'bg-zinc-900 border-zinc-800/80 hover:border-zinc-500';
      case 1:
        return 'bg-zinc-700 border-zinc-600 hover:border-zinc-400';
      case 2:
        return 'bg-zinc-500 border-zinc-400 hover:border-white';
      case 3:
        return 'bg-zinc-300 border-white hover:border-white shadow-[0_0_6px_rgba(255,255,255,0.4)]';
      case 4:
        return 'bg-white border-white hover:scale-110 shadow-[0_0_8px_rgba(255,255,255,0.8)]';
      default:
        return 'bg-zinc-900 border-zinc-800';
    }
  };

  /* ── Loading State ─────────────────────────────────────────────── */
  if (fetchState === 'loading') {
    return (
      <div
        className={`relative w-full rounded-2xl bg-zinc-950/95 border border-zinc-700/80 p-5 sm:p-6 shadow-2xl space-y-5 text-left font-sans ${className}`}
        id="github-contribution-graph"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white text-xl shadow-inner">
              <SiGithub />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-white tracking-tight">
                  @{username}
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono">
                Loading contribution data...
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center py-12 gap-2 text-zinc-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-xs font-mono">Fetching GitHub activity</span>
        </div>
      </div>
    );
  }

  /* ── Error / Fallback State ────────────────────────────────────── */
  if (fetchState === 'error') {
    return (
      <div
        className={`relative w-full rounded-2xl bg-zinc-950/95 border border-zinc-700/80 p-5 sm:p-6 shadow-2xl space-y-5 text-left font-sans ${className}`}
        id="github-contribution-graph"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white text-xl shadow-inner">
              <SiGithub />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-white tracking-tight">
                  @{username}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-500 border border-zinc-800">
                  Offline
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono">
                GitHub Production & System Archives
              </p>
            </div>
          </div>

          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-target inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-500 text-xs font-mono text-white transition-all w-fit group"
          >
            <span>View GitHub Profile</span>
            <ExternalLink className="w-3 h-3 text-zinc-400 group-hover:text-white transition-colors" />
          </a>
        </div>

        <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
          <AlertCircle className="w-8 h-8 text-zinc-600" />
          <div className="space-y-1">
            <p className="font-mono text-sm font-bold text-zinc-300">
              Unable to load live contribution data
            </p>
            <p className="text-xs text-zinc-500 font-mono max-w-sm">
              GitHub contribution data requires API authentication.
              Visit the profile directly for live activity.
            </p>
          </div>
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-target inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-zinc-200 transition-colors mt-2"
          >
            View Profile
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    );
  }

  /* ── Success State ─────────────────────────────────────────────── */
  return (
    <div
      className={`relative w-full rounded-2xl bg-zinc-950/95 border border-zinc-700/80 p-5 sm:p-6 shadow-2xl space-y-5 text-left font-sans ${className}`}
      id="github-contribution-graph"
    >
      {/* Header bar with GitHub profile telemetry */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white text-xl shadow-inner">
            <SiGithub />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-white tracking-tight">
                @{username}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-300 border border-zinc-700">
                Active Builder
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono">
              GitHub Production & System Archives
            </p>
          </div>
        </div>

        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-target inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-500 text-xs font-mono text-white transition-all w-fit group"
        >
          <span>View GitHub Profile</span>
          <ExternalLink className="w-3 h-3 text-zinc-400 group-hover:text-white transition-colors" />
        </a>
      </div>

      {/* Metric telemetry counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80 space-y-0.5">
          <span className="text-[10px] font-mono uppercase text-zinc-400 flex items-center gap-1">
            <GitCommit className="w-3 h-3 text-zinc-300" />
            Total Commits
          </span>
          <p className="text-lg sm:text-xl font-mono font-bold text-white tracking-tight">
            {totalContributions.toLocaleString()}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80 space-y-0.5">
          <span className="text-[10px] font-mono uppercase text-zinc-400 flex items-center gap-1">
            <Flame className="w-3 h-3 text-zinc-300" />
            Longest Streak
          </span>
          <p className="text-lg sm:text-xl font-mono font-bold text-white tracking-tight">
            {maxStreak} Days
          </p>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80 space-y-0.5">
          <span className="text-[10px] font-mono uppercase text-zinc-400 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-zinc-300" />
            Current Streak
          </span>
          <p className="text-lg sm:text-xl font-mono font-bold text-white tracking-tight">
            {currentStreak} Days
          </p>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80 space-y-0.5">
          <span className="text-[10px] font-mono uppercase text-zinc-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-zinc-300" />
            Primary Stack
          </span>
          <p className="text-lg sm:text-xl font-mono font-bold text-white tracking-tight truncate">
            Python & SQL
          </p>
        </div>
      </div>

      {/* Semantic Accessible Contribution Table / Heatmap */}
      <div className="relative overflow-x-auto pb-2 pt-1 select-none">
        <table
          className="border-collapse mx-auto sm:mx-0"
          aria-label={`Contribution Graph for ${year}`}
        >
          <caption className="sr-only">
            Contribution Graph for {year} by @{username}
          </caption>

          <thead>
            <tr className="h-4">
              <td className="w-7 text-[9px] font-mono text-zinc-500 pr-1 text-right" />
              {Array.from({ length: 52 }).map((_, weekIdx) => {
                const month = monthLabels.find((m) => m.col === weekIdx);
                return (
                  <th
                    key={weekIdx}
                    className="w-3 text-[9px] font-mono text-zinc-400 text-left font-normal"
                    scope="col"
                  >
                    {month ? month.name : ''}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {[
              { label: '', dayIdx: 0 },
              { label: 'Mon', dayIdx: 1 },
              { label: '', dayIdx: 2 },
              { label: 'Wed', dayIdx: 3 },
              { label: '', dayIdx: 4 },
              { label: 'Fri', dayIdx: 5 },
              { label: '', dayIdx: 6 },
            ].map(({ label, dayIdx }) => (
              <tr key={dayIdx} className="h-3">
                <th
                  scope="row"
                  className="w-7 text-[9px] font-mono text-zinc-500 pr-1.5 text-right font-normal leading-none"
                >
                  {label}
                </th>

                {weeks.map((week, weekIdx) => {
                  const day = week[dayIdx];
                  if (!day) return <td key={weekIdx} className="p-0.5" />;

                  const isCountZero = day.count === 0;
                  const title = isCountZero
                    ? `No contributions on ${day.date}`
                    : `${day.count} contribution${day.count > 1 ? 's' : ''} on ${day.date}`;

                  return (
                    <td
                      key={weekIdx}
                      className="p-[1.5px]"
                      title={title}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setHoveredDay({
                          day,
                          x: rect.left + rect.width / 2,
                          y: rect.top - 8,
                        });
                      }}
                      onMouseLeave={() => setHoveredDay(null)}
                    >
                      <div
                        className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-[3px] border transition-all duration-150 cursor-pointer ${getColorClass(
                          day.level
                        )}`}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Floating Custom Tooltip */}
        <AnimatePresence>
          {hoveredDay && (
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 2, scale: 0.96 }}
              transition={{ duration: 0.12 }}
              className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-full px-2.5 py-1.5 rounded-lg bg-zinc-900 text-white text-[11px] font-mono border border-zinc-600 shadow-2xl backdrop-blur-md"
              style={{
                left: hoveredDay.x,
                top: hoveredDay.y,
              }}
            >
              <div className="font-bold">
                {hoveredDay.day.count === 0
                  ? 'No contributions'
                  : `${hoveredDay.day.count} contribution${
                      hoveredDay.day.count > 1 ? 's' : ''
                    }`}
              </div>
              <div className="text-[10px] text-zinc-400">{hoveredDay.day.date}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Legend Scale */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-zinc-800/80 text-[10px] font-mono text-zinc-400">
        <span className="flex items-center gap-1.5">
          <span>Continuous code telemetry synced to GitHub</span>
        </span>

        <div className="flex items-center gap-1.5">
          <span>Less</span>
          <div className="w-2.5 h-2.5 rounded-[2px] bg-zinc-900 border border-zinc-800" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-zinc-700 border border-zinc-600" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-zinc-500 border border-zinc-400" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-zinc-300 border border-white" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-white border border-white" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
