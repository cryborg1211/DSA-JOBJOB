import { useEffect, useRef } from 'react';
import { Zap, Building2, ExternalLink } from 'lucide-react';
import type { RankedJob } from '../../types/match';

interface RankingListProps {
    jobs: RankedJob[];
    onView?: (jobId: string) => void;
    onApply?: (jobId: string) => void;
}

function ScoreRing({ score }: { score: number }) {
    const r = 22;
    const circumference = 2 * Math.PI * r;
    const dash = (score / 100) * circumference;
    const color = score >= 80 ? '#34d399' : score >= 50 ? '#f59e0b' : '#f43f5e';

    return (
        <svg width="56" height="56" className="shrink-0 -rotate-90">
            <circle cx="28" cy="28" r={r} fill="none" stroke="#1f4240" strokeWidth="4" />
            <circle
                cx="28" cy="28" r={r} fill="none"
                stroke={color} strokeWidth="4"
                strokeDasharray={`${dash} ${circumference}`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 0.8s ease-out' }}
            />
            <text
                x="28" y="28" textAnchor="middle" dominantBaseline="central"
                className="rotate-90" fill={color}
                fontSize="11" fontWeight="600" fontFamily="JetBrains Mono, monospace"
                transform="rotate(90, 28, 28)"
            >
                {score}%
            </text>
        </svg>
    );
}

/**
 * RankingList — displays results of the backend RankingHeap (Max-Heap DSA).
 * Items animate into position; re-ranking triggers a flash highlight.
 */
export function RankingList({ jobs, onView, onApply }: RankingListProps) {
    const prevIdsRef = useRef<string[]>([]);

    useEffect(() => {
        prevIdsRef.current = jobs.map((j) => j.jobId);
    }, [jobs]);

    const rankLabel = (rank: number) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return `#${rank}`;
    };

    return (
        <div className="flex flex-col gap-3">
            {/* Header */}
            <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] px-1">
                <Zap className="w-3.5 h-3.5 text-teal-400" />
                <span>Ranked by Max-Heap Algorithm</span>
            </div>

            {jobs.length === 0 && (
                <div className="glass-card p-8 text-center text-[var(--color-text-muted)] animate-fade-in">
                    No results yet — run a comparison to see rankings.
                </div>
            )}

            {jobs.map((job) => (
                <div
                    key={job.jobId}
                    className="glass-card p-4 flex items-center gap-4 animate-rank-update"
                >
                    {/* Rank */}
                    <span className="text-lg font-bold w-8 text-center shrink-0 font-mono">
                        {rankLabel(job.rank)}
                    </span>

                    {/* Score ring */}
                    <ScoreRing score={job.score} />

                    {/* Job info */}
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[var(--color-text-primary)] truncate">
                            {job.jobTitle}
                        </p>
                        <p className="text-sm text-[var(--color-text-muted)] flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3.5 h-3.5" />
                            {job.companyName}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 shrink-0">
                        <button className="btn-ghost text-sm py-1.5 px-3" onClick={() => onView?.(job.jobId)}>
                            View
                        </button>
                        {job.score >= 50 && (
                            <button className="btn-primary text-sm py-1.5 px-3" onClick={() => onApply?.(job.jobId)}>
                                Apply <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
