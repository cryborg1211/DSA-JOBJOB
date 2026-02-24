import { create } from 'zustand';
import type { MatchResult, RankedJob, SwipeCardData } from '../types/match';

interface MatchState {
    matchResult: MatchResult | null;
    rankedJobs: RankedJob[];
    swipeCards: SwipeCardData[];
    isLoading: boolean;
    setMatchResult: (result: MatchResult) => void;
    setRankedJobs: (jobs: RankedJob[]) => void;
    setSwipeCards: (cards: SwipeCardData[]) => void;
    removeTopCard: () => void;
    setLoading: (v: boolean) => void;
    reset: () => void;
}

export const useMatchStore = create<MatchState>((set) => ({
    matchResult: null,
    rankedJobs: [],
    swipeCards: [],
    isLoading: false,
    setMatchResult: (result) => set({ matchResult: result }),
    setRankedJobs: (jobs) => set({ rankedJobs: jobs }),
    setSwipeCards: (cards) => set({ swipeCards: cards }),
    removeTopCard: () => set((state) => ({ swipeCards: state.swipeCards.slice(1) })),
    setLoading: (v) => set({ isLoading: v }),
    reset: () => set({ matchResult: null, rankedJobs: [], swipeCards: [], isLoading: false }),
}));
