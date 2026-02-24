// ── Job / JD ──────────────────────────────────────────────────
import type { Skill } from './candidate';

export type JobType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Remote';

export interface Job {
    id: string;
    companyName: string;
    companyLogoUrl?: string;
    jobTitle: string;
    location: string;
    jobType: JobType;
    industry: string;
    salaryMin?: number;
    salaryMax?: number;
    minYearsExperience: number;
    requiredSkills: Skill[];
    niceToHaveSkills: Skill[];
    description: string;
    jdVector?: Record<string, number>; // TF-IDF vector from backend
    createdAt: string;
}

export type JdDraft = Omit<Job, 'id' | 'jdVector' | 'createdAt'>;
