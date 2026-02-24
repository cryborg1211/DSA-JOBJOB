// ── Match Result ─────────────────────────────────────────────
export interface SkillMatchDetail {
    skill: string;
    inCv: boolean;
    inJd: boolean;
}

export interface MatchBreakdown {
    skillsMatch: number;      // 0-100
    experienceMatch: number;  // 0-100
    educationMatch: number;   // 0-100
}

export interface MatchResult {
    jobId: string;
    candidateId: string;
    overallScore: number;       // 0-100, from CosineSimilarity
    breakdown: MatchBreakdown;
    matchedSkills: string[];
    missingSkills: string[];    // In JD but not in CV
    extraSkills: string[];      // In CV but not in JD
    cvVector: Record<string, number>;
    jdVector: Record<string, number>;
    rankedJobs?: RankedJob[];   // Populated for candidate view
}

export interface RankedJob {
    rank: number;
    jobId: string;
    jobTitle: string;
    companyName: string;
    score: number;
}

// ── Swipe Card ────────────────────────────────────────────────
/** Unified card shown in the swipe deck.
 *  type='JOB'       → shown to CANDIDATE (they swipe jobs)
 *  type='CANDIDATE' → shown to RECRUITER (they swipe resumes)
 */
export interface SwipeCardData {
    id: string;
    type: 'JOB' | 'CANDIDATE';
    avatarUrl?: string;
    title: string;       // Job title OR Candidate name
    subtitle: string;    // Company name OR Latest role / location
    skills: string[];
    score: number;       // 0-100, from DSA Cosine engine
    description?: string;
}
