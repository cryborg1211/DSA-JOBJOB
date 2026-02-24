import { useEffect, useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, RefreshCw } from 'lucide-react';
import { useMatchStore } from '../../store/matchStore';
import { useAuthStore } from '../../store/authStore';
import { useMatchEngine } from '../../hooks/useMatchEngine';
import SwipeCard from './SwipeCard';
import type { SwipeCardData } from '../../types/match';

// ─── Mock data ────────────────────────────────────────────────
// Replace these with real API calls once the backend is wired up.

const MOCK_JOB_CARDS: SwipeCardData[] = [
    {
        id: 'j-001',
        type: 'JOB',
        title: 'Senior Java Engineer',
        subtitle: 'FPT Software · Hà Nội',
        skills: ['Java', 'Spring Boot', 'Microservices', 'MySQL', 'Docker'],
        score: 82,
        description: 'Build and maintain high-throughput backend services for our enterprise SaaS platform. You will own features end-to-end from design to production.',
    },
    {
        id: 'j-002',
        type: 'JOB',
        title: 'Frontend React Developer',
        subtitle: 'VNG Corporation · TP. HCM',
        skills: ['React', 'TypeScript', 'Tailwind', 'Framer Motion'],
        score: 67,
        description: 'Join our product team to craft pixel-perfect UIs for millions of Vietnamese users across web and mobile.',
    },
    {
        id: 'j-003',
        type: 'JOB',
        title: 'Full-Stack Engineer',
        subtitle: 'Tiki · Remote',
        skills: ['Node.js', 'React', 'PostgreSQL', 'GraphQL', 'AWS'],
        score: 45,
        description: 'Own the full feature lifecycle: API design, React front-end, CI/CD pipelines, and cloud deployment.',
    },
    {
        id: 'j-004',
        type: 'JOB',
        title: 'DevOps / SRE',
        subtitle: 'Momo · Hà Nội',
        skills: ['Kubernetes', 'Terraform', 'Prometheus', 'Linux'],
        score: 31,
    },
];

const MOCK_CANDIDATE_CARDS: SwipeCardData[] = [
    {
        id: 'c-001',
        type: 'CANDIDATE',
        title: 'Nguyễn Minh Tuấn',
        subtitle: 'Software Engineer · 3 years exp.',
        skills: ['Java', 'Spring Boot', 'React', 'MySQL', 'DSA'],
        score: 88,
        description: 'Passionate backend developer with deep interest in data structures and algorithm optimization.',
    },
    {
        id: 'c-002',
        type: 'CANDIDATE',
        title: 'Trần Thị Lan',
        subtitle: 'Frontend Lead · 5 years exp.',
        skills: ['React', 'TypeScript', 'Next.js', 'CSS', 'Figma'],
        score: 72,
        description: 'Design-minded engineer who bridges the gap between UX mockups and production code.',
    },
    {
        id: 'c-003',
        type: 'CANDIDATE',
        title: 'Lê Văn Hoàng',
        subtitle: 'Junior Dev · 1 year exp.',
        skills: ['Python', 'Django', 'SQL', 'Git'],
        score: 48,
    },
    {
        id: 'c-004',
        type: 'CANDIDATE',
        title: 'Phạm Anh Khoa',
        subtitle: 'Mobile Developer · 2 years exp.',
        skills: ['Flutter', 'Dart', 'Firebase', 'REST'],
        score: 29,
    },
];

// ─── Main Component ───────────────────────────────────────────

/**
 * MatchDashboard — Tinder-style swipe interface.
 * Candidates swipe Jobs (left = pass, right = apply).
 * Recruiters swipe Resumes (left = pass, right = interested).
 */
export default function MatchDashboard() {
    const { role } = useAuthStore();
    const { swipeCards, setSwipeCards, removeTopCard } = useMatchStore();
    const { rankJobsForCandidate, isLoading } = useMatchEngine();

    const MOCK_CANDIDATE_ID = 'c-001';

    // Initialise the deck based on role
    useEffect(() => {
        const deck = role === 'RECRUITER' ? MOCK_CANDIDATE_CARDS : MOCK_JOB_CARDS;
        setSwipeCards(deck);
        if (role === 'CANDIDATE') {
            rankJobsForCandidate(MOCK_CANDIDATE_ID);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [role]);

    // Track the current top card ID so AnimatePresence can key it
    const [lastSwipeDir, setLastSwipeDir] = useState<'left' | 'right' | null>(null);

    const handleSwipe = useCallback(
        (direction: 'left' | 'right') => {
            setLastSwipeDir(direction);
            removeTopCard();
        },
        [removeTopCard]
    );

    const handleReset = () => {
        const deck = role === 'RECRUITER' ? MOCK_CANDIDATE_CARDS : MOCK_JOB_CARDS;
        setSwipeCards(deck);
    };

    const titleLabel = role === 'RECRUITER' ? 'Tìm ứng viên' : 'Tìm việc phù hợp';
    const subtitleLabel =
        role === 'RECRUITER'
            ? 'Vuốt phải → Quan tâm · Vuốt trái → Bỏ qua'
            : 'Vuốt phải → Ứng tuyển · Vuốt trái → Bỏ qua';

    const topCard = swipeCards[0];

    return (
        <main
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: 'linear-gradient(160deg, #0a2e2b 0%, #061a18 60%, #030f0e 100%)',
                paddingBottom: '3rem',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Background ambient glow */}
            <div
                style={{
                    position: 'absolute',
                    top: '-10%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '700px',
                    height: '400px',
                    background: 'radial-gradient(ellipse, rgba(0,255,255,0.07) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }}
            />

            {/* ── Page Header ─────────────────────────────── */}
            <div
                style={{
                    width: '100%',
                    maxWidth: '480px',
                    padding: '5.5rem 1.5rem 0',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                }}
            >
                <div>
                    <h1
                        style={{
                            fontSize: '1.75rem',
                            fontWeight: 800,
                            letterSpacing: '-0.04em',
                            color: '#ffffff',
                            lineHeight: 1.15,
                        }}
                    >
                        {titleLabel}
                    </h1>
                    <p
                        style={{
                            fontSize: '0.8125rem',
                            color: 'rgba(224, 255, 255, 0.55)',
                            marginTop: '0.4rem',
                            letterSpacing: '0.01em',
                        }}
                    >
                        {subtitleLabel}
                    </p>
                </div>

                {/* Filter icon */}
                <button
                    title="Bộ lọc tìm kiếm"
                    style={{
                        background: 'rgba(0, 255, 255, 0.1)',
                        border: '1.5px solid rgba(0, 255, 255, 0.3)',
                        borderRadius: '12px',
                        padding: '0.6rem',
                        cursor: 'pointer',
                        color: '#00ffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background 0.2s, box-shadow 0.2s',
                        flexShrink: 0,
                        marginTop: '0.25rem',
                    }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,255,255,0.18)';
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 16px rgba(0,255,255,0.2)';
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,255,255,0.1)';
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                    }}
                >
                    <SlidersHorizontal size={18} />
                </button>
            </div>

            {/* ── Card Counter ─────────────────────────────── */}
            <div
                style={{
                    width: '100%',
                    maxWidth: '480px',
                    padding: '1.25rem 1.5rem 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <span style={{ fontSize: '0.78rem', color: 'rgba(224,255,255,0.45)', letterSpacing: '0.05em' }}>
                    {swipeCards.length > 0
                        ? `${swipeCards.length} kết quả còn lại`
                        : 'Đã hết kết quả'}
                </span>
                <button
                    onClick={handleReset}
                    disabled={isLoading}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'rgba(0,255,255,0.6)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        fontSize: '0.75rem',
                        padding: '0.25rem 0.5rem',
                    }}
                >
                    <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
                    Làm mới
                </button>
            </div>

            {/* ── Swipe Card Stack ─────────────────────────── */}
            <div
                style={{
                    width: '100%',
                    maxWidth: '400px',
                    padding: '2.5rem 1.5rem 0',
                    position: 'relative',
                    // Fixed height so the stack doesn't collapse when last card removed
                    height: '480px',
                    flexShrink: 0,
                }}
            >
                {swipeCards.length > 0 ? (
                    <AnimatePresence>
                        {swipeCards.slice(0, 3).map((card, index) => (
                            <SwipeCard
                                key={card.id}
                                card={card}
                                stackIndex={index}
                                onSwipeLeft={() => handleSwipe('left')}
                                onSwipeRight={() => handleSwipe('right')}
                            />
                        ))}
                    </AnimatePresence>
                ) : (
                    /* Empty state */
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '1rem',
                            color: 'rgba(224,255,255,0.45)',
                            textAlign: 'center',
                        }}
                    >
                        <div style={{ fontSize: '3rem' }}>🎯</div>
                        <p style={{ fontWeight: 700, fontSize: '1.05rem', color: '#e0ffff' }}>
                            Đã xem hết!
                        </p>
                        <p style={{ fontSize: '0.85rem' }}>
                            Nhấn <strong style={{ color: '#00ffff' }}>Làm mới</strong> để xem lại
                        </p>
                    </div>
                )}
            </div>

            {/* ── Action Buttons ───────────────────────────── */}
            {/* 64px gap (mt-16) between card stack bottom and button row */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2.5rem',
                    marginTop: '4rem', // 64px
                }}
            >
                {/* Pass / Bỏ qua */}
                <button
                    disabled={!topCard}
                    onClick={() => handleSwipe('left')}
                    className="btn-ghost"
                    style={{
                        padding: '0.75rem 2rem',
                        fontSize: '0.875rem',
                        letterSpacing: '0.06em',
                        opacity: topCard ? 1 : 0.35,
                        transition: 'opacity 0.2s',
                    }}
                >
                    Bỏ qua
                </button>

                {/* Apply / Ứng tuyển */}
                <button
                    disabled={!topCard}
                    onClick={() => handleSwipe('right')}
                    className="btn-primary"
                    style={{
                        padding: '0.75rem 2rem',
                        fontSize: '0.875rem',
                        letterSpacing: '0.06em',
                        background: topCard ? '#00ffff' : 'rgba(0,255,255,0.3)',
                        color: topCard ? '#0a2e2b' : 'rgba(255,255,255,0.4)',
                        cursor: topCard ? 'pointer' : 'not-allowed',
                        transition: 'background 0.2s, color 0.2s',
                    }}
                >
                    {role === 'RECRUITER' ? 'Quan tâm' : 'Ứng tuyển'}
                </button>
            </div>

            {/* ── Swipe feedback hint ─────────────────────── */}
            {lastSwipeDir && (
                <p
                    style={{
                        marginTop: '1.25rem',
                        fontSize: '0.78rem',
                        color: lastSwipeDir === 'right' ? '#34d399' : 'rgba(224,255,255,0.4)',
                        letterSpacing: '0.04em',
                    }}
                >
                    {lastSwipeDir === 'right'
                        ? '✓ Đã ghi nhận — chờ phản hồi!'
                        : 'Bỏ qua. Hồ sơ tiếp theo →'}
                </p>
            )}
        </main>
    );
}
