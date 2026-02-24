import { useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import type { SwipeCardData } from '../../types/match';

// ─── Constants ────────────────────────────────────────────────
const SWIPE_THRESHOLD = 100; // px offset required to trigger a swipe

interface SwipeCardProps {
    card: SwipeCardData;
    /** z-index layer; top card (index 0) is draggable */
    stackIndex: number;
    onSwipeLeft: () => void;
    onSwipeRight: () => void;
}

/** Returns CSS color class for the matching score */
function getScoreColor(score: number): string {
    if (score >= 70) return '#34d399'; // green
    if (score >= 40) return '#f59e0b'; // amber
    return '#f43f5e';                  // rose
}

/** Formats score into the Vietnamese badge label */
function scoreBadgeLabel(score: number) {
    return `ĐỘ TƯƠNG THÍCH: ${score}%`;
}

export default function SwipeCard({ card, stackIndex, onSwipeLeft, onSwipeRight }: SwipeCardProps) {
    const isTop = stackIndex === 0;

    // Track horizontal drag progress for visual feedback
    const x = useMotionValue(0);

    // Rotate slightly as the card is dragged
    const rotate = useTransform(x, [-200, 200], [-18, 18]);

    // Fade-in "PASS" indicator on left drag
    const passOpacity = useTransform(x, [-150, -20], [1, 0]);
    // Fade-in "APPLY" indicator on right drag
    const applyOpacity = useTransform(x, [20, 150], [0, 1]);

    // Scale & translate for stacked cards behind the top
    const scale = 1 - stackIndex * 0.04;
    const yOffset = stackIndex * 14;

    const constraintsRef = useRef(null);

    function handleDragEnd(_: unknown, info: { offset: { x: number } }) {
        if (info.offset.x > SWIPE_THRESHOLD) {
            onSwipeRight();
        } else if (info.offset.x < -SWIPE_THRESHOLD) {
            onSwipeLeft();
        }
    }

    return (
        <motion.div
            ref={constraintsRef}
            className="swipe-card-wrapper"
            style={{
                position: 'absolute',
                width: '100%',
                zIndex: 10 - stackIndex,
                scale,
                y: yOffset,
                rotate: isTop ? rotate : 0,
                x: isTop ? x : 0,
                cursor: isTop ? 'grab' : 'default',
            }}
            drag={isTop ? 'x' : false}
            dragConstraints={{ left: -500, right: 500 }}
            dragElastic={0.8}
            onDragEnd={isTop ? handleDragEnd : undefined}
            whileDrag={{ cursor: 'grabbing' }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: yOffset }}
            exit={{
                x: 0,
                opacity: 0,
                transition: { duration: 0.25 },
            }}
        >
            {/* ── Glass Card ─────────────────────────────── */}
            <div
                style={{
                    background: 'rgba(20, 80, 75, 0.6)',
                    backdropFilter: 'blur(18px)',
                    WebkitBackdropFilter: 'blur(18px)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    borderRadius: '1.5rem',
                    padding: '2rem',
                    width: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 8px 40px rgba(0, 0, 0, 0.45)',
                    userSelect: 'none',
                }}
            >
                {/* Subtle glow ring behind the card */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'radial-gradient(ellipse at 50% 0%, rgba(0,255,255,0.08) 0%, transparent 70%)',
                        borderRadius: 'inherit',
                        pointerEvents: 'none',
                    }}
                />

                {/* ── Score Badge ─────────────────────── */}
                {isTop && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '1.25rem',
                            right: '1.25rem',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '999px',
                            background: 'rgba(0, 0, 0, 0.45)',
                            border: `1.5px solid ${getScoreColor(card.score)}`,
                            color: getScoreColor(card.score),
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            letterSpacing: '0.05em',
                        }}
                    >
                        {scoreBadgeLabel(card.score)}
                    </div>
                )}

                {/* ── Avatar ─────────────────────────── */}
                <div className="flex justify-center mb-5">
                    {card.avatarUrl ? (
                        <img
                            src={card.avatarUrl}
                            alt={card.title}
                            style={{
                                width: '88px',
                                height: '88px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: '2.5px solid rgba(0,255,255,0.5)',
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                width: '88px',
                                height: '88px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #00ffff 0%, #0d9488 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2rem',
                                fontWeight: 800,
                                color: '#0a2e2b',
                                border: '2.5px solid rgba(0,255,255,0.5)',
                            }}
                        >
                            {card.title.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>

                {/* ── Title & Subtitle ───────────────── */}
                <h2
                    style={{
                        fontSize: '1.2rem',
                        fontWeight: 800,
                        letterSpacing: '-0.03em',
                        color: '#ffffff',
                        textAlign: 'center',
                        marginBottom: '0.35rem',
                    }}
                >
                    {card.title}
                </h2>
                <p
                    style={{
                        fontSize: '0.875rem',
                        color: '#e0ffff',
                        textAlign: 'center',
                        marginBottom: '1.25rem',
                        opacity: 0.8,
                    }}
                >
                    {card.subtitle}
                </p>

                {/* ── Description (optional, truncated) ─ */}
                {card.description && (
                    <p
                        style={{
                            fontSize: '0.8rem',
                            color: 'rgba(224,255,255,0.7)',
                            textAlign: 'center',
                            marginBottom: '1.25rem',
                            lineHeight: 1.6,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {card.description}
                    </p>
                )}

                {/* ── Skill Tags ─────────────────────── */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                    {card.skills.slice(0, 6).map((skill) => (
                        <span
                            key={skill}
                            style={{
                                padding: '0.25rem 0.75rem',
                                borderRadius: '999px',
                                background: 'rgba(0, 255, 255, 0.1)',
                                border: '1px solid rgba(0, 255, 255, 0.3)',
                                color: '#00ffff',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                letterSpacing: '0.05em',
                                textTransform: 'uppercase',
                            }}
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

            {/* ── Swipe direction overlays (only on top card) ── */}
            {isTop && (
                <>
                    {/* Left — PASS */}
                    <motion.div
                        style={{
                            opacity: passOpacity,
                            position: 'absolute',
                            top: '1.5rem',
                            left: '1.5rem',
                            padding: '0.3rem 0.9rem',
                            border: '3px solid #f43f5e',
                            borderRadius: '8px',
                            color: '#f43f5e',
                            fontSize: '1.1rem',
                            fontWeight: 900,
                            letterSpacing: '0.08em',
                            rotate: '-15deg',
                            pointerEvents: 'none',
                        }}
                    >
                        BỎ QUA
                    </motion.div>

                    {/* Right — APPLY */}
                    <motion.div
                        style={{
                            opacity: applyOpacity,
                            position: 'absolute',
                            top: '1.5rem',
                            right: '1.5rem',
                            padding: '0.3rem 0.9rem',
                            border: '3px solid #00ffff',
                            borderRadius: '8px',
                            color: '#00ffff',
                            fontSize: '1.1rem',
                            fontWeight: 900,
                            letterSpacing: '0.08em',
                            rotate: '15deg',
                            pointerEvents: 'none',
                        }}
                    >
                        ỨNG TUYỂN
                    </motion.div>
                </>
            )}
        </motion.div>
    );
}
