import { useCallback } from 'react';
import { matchService } from '../services/matchService';
import { useMatchStore } from '../store/matchStore';

/**
 * useMatchEngine — triggers CV→JD comparison via backend MatchingService
 * which uses CosineSimilarity + RankingHeap internally.
 */
export function useMatchEngine() {
    const { setMatchResult, setRankedJobs, setLoading, isLoading } = useMatchStore();

    const compare = useCallback(async (candidateId: string, jobId: string) => {
        setLoading(true);
        try {
            const { data } = await matchService.matchCvToJd(candidateId, jobId);
            setMatchResult(data);
        } finally {
            setLoading(false);
        }
    }, [setLoading, setMatchResult]);

    const rankJobsForCandidate = useCallback(async (candidateId: string) => {
        setLoading(true);
        try {
            const { data } = await matchService.getRankedJobsForCandidate(candidateId);
            setRankedJobs(data);
        } finally {
            setLoading(false);
        }
    }, [setLoading, setRankedJobs]);

    return { compare, rankJobsForCandidate, isLoading };
}
