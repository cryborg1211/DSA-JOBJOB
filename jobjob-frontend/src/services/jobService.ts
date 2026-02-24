import api from './api';
import type { Job, JdDraft } from '../types/job';

export const jobService = {
    /** Trie-based prefix search — powers TrieSearchInput */
    searchSuggestions: (prefix: string) =>
        api.get<string[]>('/jobs/suggest', { params: { prefix } }),

    getAllJobs: () => api.get<Job[]>('/jobs'),

    getJobById: (id: string) => api.get<Job>(`/jobs/${id}`),

    createJob: (draft: JdDraft) => api.post<Job>('/jobs', draft),

    updateJob: (id: string, draft: Partial<JdDraft>) =>
        api.put<Job>(`/jobs/${id}`, draft),

    deleteJob: (id: string) => api.delete(`/jobs/${id}`),
};
