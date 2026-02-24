import api from './api';
import type { MatchResult, RankedJob } from '../types/match';

export const matchService = {
    /** Compare a saved CV against a saved JD — returns full MatchResult */
    matchCvToJd: (candidateId: string, jobId: string) =>
        api.post<MatchResult>('/match/compare', { candidateId, jobId }),

    /** Get ranked list of jobs for a candidate (uses RankingHeap on backend) */
    getRankedJobsForCandidate: (candidateId: string) =>
        api.get<RankedJob[]>('/match/rank', { params: { candidateId } }),

    /** Get ranked list of candidates for a job posting */
    getRankedCandidatesForJob: (jobId: string) =>
        api.get<RankedJob[]>('/match/rank', { params: { jobId } }),
};
