// ── Candidate / CV ────────────────────────────────────────────
export interface Skill {
    name: string;
    level?: 1 | 2 | 3; // 1=Beginner, 2=Intermediate, 3=Expert
}

export interface WorkExperience {
    company: string;
    role: string;
    startDate: string;
    endDate: string | 'Present';
    description: string;
}

export interface Education {
    school: string;
    degree: string;
    year: number;
    gpa?: number;
}

export interface Candidate {
    id: string;
    fullName: string;
    jobTitle: string;
    location: string;
    email: string;
    yearsOfExperience: number;
    skills: Skill[];
    workExperience: WorkExperience[];
    education: Education[];
    cvVector?: Record<string, number>; // TF-IDF vector from backend
}

export type CvDraft = Omit<Candidate, 'id' | 'cvVector'>;
