import { Zap, CheckCircle, XCircle } from 'lucide-react';
import type { MatchResult } from '../../types/match';

interface SimilarityRadarProps {
    result: MatchResult;
}

function AnimatedBar({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div>
            <div className="flex justify-between text-sm mb-1">
                <span className="text-[var(--color-text-muted)]">{label}</span>
                <span className="font-mono font-semibold" style={{ color }}>{value}%</span>
            </div>
            <div className="h-2 rounded-full bg-[var(--color-border)] overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${value}%`, backgroundColor: color }}
                />
            </div>
        </div>
    );
}

/**
 * SimilarityRadar — Visualises the Cosine Similarity output from the backend.
 * Shows overall score, per-dimension breakdown, matched/missing skill terms,
 * and an expandable formula explainer for DSA presentation.
 */
export function SimilarityRadar({ result }: SimilarityRadarProps) {
    const { overallScore, breakdown, matchedSkills, missingSkills } = result;

    const ringColor =
        overallScore >= 80 ? '#34d399' : overallScore >= 50 ? '#f59e0b' : '#f43f5e';

    const r = 54;
    const circumference = 2 * Math.PI * r;
    const dash = (overallScore / 100) * circumference;

    return (
        <div className="glass-card p-6 flex flex-col gap-6 animate-fade-in">
            {/* Overall score */}
            <div className="flex items-center gap-6">
                <svg width="128" height="128" className="-rotate-90 shrink-0">
                    <circle cx="64" cy="64" r={r} fill="none" stroke="#1f4240" strokeWidth="8" />
                    <circle
                        cx="64" cy="64" r={r} fill="none"
                        stroke={ringColor} strokeWidth="8"
                        strokeDasharray={`${dash} ${circumference}`}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dasharray 1.2s ease-out' }}
                    />
                </svg>
                <div>
                    <p className="text-[var(--color-text-muted)] text-sm">Overall Match Score</p>
                    <p
                        className="text-5xl font-bold font-mono leading-none mt-1"
                        style={{ color: ringColor }}
                    >
                        {overallScore}%
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-2 flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-teal-400" />
                        via Cosine Similarity
                    </p>
                </div>
            </div>

            {/* Breakdown bars */}
            <div className="flex flex-col gap-3">
                <AnimatedBar label="Skills Match" value={breakdown.skillsMatch} color="#2dd4bf" />
                <AnimatedBar label="Experience" value={breakdown.experienceMatch} color="#0d9488" />
                <AnimatedBar label="Education" value={breakdown.educationMatch} color="#0891b2" />
            </div>

            {/* Matched / Missing skills */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-xs text-[var(--color-text-muted)] mb-2">Matched</p>
                    <div className="flex flex-wrap gap-1.5">
                        {matchedSkills.map((s) => (
                            <span key={s} className="skill-badge text-success border-success/30 bg-success/10">
                                <CheckCircle className="w-3 h-3" /> {s}
                            </span>
                        ))}
                    </div>
                </div>
                <div>
                    <p className="text-xs text-[var(--color-text-muted)] mb-2">Missing</p>
                    <div className="flex flex-wrap gap-1.5">
                        {missingSkills.map((s) => (
                            <span key={s} className="skill-badge text-[var(--color-accent-rose)] border-rose/30 bg-rose/10">
                                <XCircle className="w-3 h-3" /> {s}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Formula explainer — ideal for DSA demo */}
            <details className="text-xs text-[var(--color-text-muted)] border-t border-[var(--color-border)] pt-4">
                <summary className="cursor-pointer hover:text-teal-400 transition-colors font-medium">
                    How was this calculated? ▾
                </summary>
                <pre className="mt-3 font-mono text-[11px] bg-[var(--color-bg-base)] rounded-lg p-3 overflow-x-auto leading-relaxed">
                    {`// Cosine Similarity formula
similarity = dot(cvVec, jdVec) / (|cvVec| × |jdVec|)

CV  vector: ${JSON.stringify(result.cvVector ?? {}, null, 0).slice(0, 80)}...
JD  vector: ${JSON.stringify(result.jdVector ?? {}, null, 0).slice(0, 80)}...

Score: ${overallScore / 100} → ${overallScore}%`}
                </pre>
            </details>
        </div>
    );
}
