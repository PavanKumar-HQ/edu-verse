
export const SectorType = {
    TECHNOLOGY: 'Technology',
    FINANCE: 'Finance',
    PROFESSIONAL: 'Professional'
};

export const COURSES = [
    {
        course_id: 'tech_ai_basics',
        title: 'Artificial Intelligence (AI) — Basics',
        sector: SectorType.TECHNOLOGY,
    },
    {
        course_id: 'tech_blockchain',
        title: 'Blockchain Fundamentals',
        sector: SectorType.TECHNOLOGY,
    },
    {
        course_id: 'tech_cyber',
        title: 'Cybersecurity Essentials',
        sector: SectorType.TECHNOLOGY,
    }
];

export const EDUCATIONAL_RESOURCES = [
    { id: 'vid_01', title: 'Ram Mandir Boosts Indian Economy?', type: 'video', category: SectorType.FINANCE },
    { id: 'vid_02', title: 'Career Choices and Financial Impact', type: 'video', category: SectorType.PROFESSIONAL },
    { id: 'vid_17', title: 'Cybersecurity Basics', type: 'video', category: SectorType.TECHNOLOGY },
    { id: 'blog_01', title: 'Quantum Computing Advancements', type: 'blog', category: SectorType.TECHNOLOGY }
];
