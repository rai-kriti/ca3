// ─────────────────────────────────────────────────────────────────────────────
// P06 – In-Memory Mock Database
// All seed data for development/demo – no external DB required
// ─────────────────────────────────────────────────────────────────────────────
import type {
  Skill, SkillCluster, Student, User, EvidenceItem, Verification,
  Assessment, MockInterview, SkillProfile, ReadinessSnapshot,
  Drive, Registration, GapAnalysis, PreparationPlan,
  RecruiterAccessGrant, AccessLog, BatchReadiness
} from '@/types';

// ── M1: Skill Taxonomy ────────────────────────────────────────────────────────
export const skillClusters: SkillCluster[] = [
  { id: 'c1', name: 'Frontend', description: 'UI/UX & web frontend technologies', color: '#6366f1' },
  { id: 'c2', name: 'Backend', description: 'Server-side & API development', color: '#0ea5e9' },
  { id: 'c3', name: 'Data & ML', description: 'Data science, analytics & ML', color: '#f59e0b' },
  { id: 'c4', name: 'DevOps', description: 'Infrastructure, CI/CD, cloud', color: '#10b981' },
  { id: 'c5', name: 'Testing & QA', description: 'Testing frameworks & QA practices', color: '#ef4444' },
  { id: 'c6', name: 'Soft Skills', description: 'Communication, leadership & teamwork', color: '#8b5cf6' },
  { id: 'c7', name: 'Database', description: 'SQL, NoSQL & data modelling', color: '#ec4899' },
];

export const skills: Skill[] = [
  // Frontend
  { id: 's1', name: 'React', cluster: 'c1', description: 'React.js UI library', levels: ['beginner','intermediate','advanced','expert'], synonyms: ['ReactJS','React.js','frontend framework'] },
  { id: 's2', name: 'TypeScript', cluster: 'c1', description: 'Typed JavaScript', levels: ['beginner','intermediate','advanced','expert'], synonyms: ['TS','typed JS'] },
  { id: 's3', name: 'Next.js', cluster: 'c1', description: 'React SSR framework', levels: ['beginner','intermediate','advanced','expert'], synonyms: ['NextJS','Next js'] },
  { id: 's4', name: 'CSS/Tailwind', cluster: 'c1', description: 'Styling & design systems', levels: ['beginner','intermediate','advanced','expert'], synonyms: ['CSS','TailwindCSS','Tailwind','styling'] },
  // Backend
  { id: 's5', name: 'Node.js', cluster: 'c2', description: 'Node.js runtime & APIs', levels: ['beginner','intermediate','advanced','expert'], synonyms: ['NodeJS','Node js','Express'] },
  { id: 's6', name: 'NestJS', cluster: 'c2', description: 'Enterprise Node.js framework', levels: ['beginner','intermediate','advanced','expert'], synonyms: ['Nest','NestJS framework'] },
  { id: 's7', name: 'Python', cluster: 'c2', description: 'Python programming language', levels: ['beginner','intermediate','advanced','expert'], synonyms: ['python3','py'] },
  { id: 's8', name: 'Django', cluster: 'c2', description: 'Python web framework', levels: ['beginner','intermediate','advanced','expert'], synonyms: ['Django REST','DRF'] },
  { id: 's9', name: 'REST API Design', cluster: 'c2', description: 'RESTful API design principles', levels: ['beginner','intermediate','advanced','expert'], synonyms: ['REST','RESTful','API design','API development'] },
  { id: 's10', name: 'GraphQL', cluster: 'c2', description: 'GraphQL query language', levels: ['beginner','intermediate','advanced','expert'], synonyms: ['gql'] },
  // Data & ML
  { id: 's11', name: 'Python for Data Science', cluster: 'c3', description: 'Pandas, NumPy, data manipulation', levels: ['beginner','intermediate','advanced','expert'], synonyms: ['pandas','numpy','data analysis'] },
  { id: 's12', name: 'Machine Learning', cluster: 'c3', description: 'ML algorithms & model building', levels: ['beginner','intermediate','advanced','expert'], synonyms: ['ML','scikit-learn','sklearn'] },
  { id: 's13', name: 'SQL', cluster: 'c7', description: 'Structured Query Language', levels: ['beginner','intermediate','advanced','expert'], synonyms: ['MySQL','PostgreSQL','database queries','RDBMS'] },
  { id: 's14', name: 'MongoDB', cluster: 'c7', description: 'NoSQL document database', levels: ['beginner','intermediate','advanced','expert'], synonyms: ['Mongo','NoSQL','document DB'] },
  // DevOps
  { id: 's15', name: 'Docker', cluster: 'c4', description: 'Containerisation', levels: ['beginner','intermediate','advanced','expert'], synonyms: ['containers','containerisation'] },
  { id: 's16', name: 'Git & Version Control', cluster: 'c4', description: 'Git workflows & collaboration', levels: ['beginner','intermediate','advanced','expert'], synonyms: ['Git','GitHub','GitLab','version control'] },
  { id: 's17', name: 'Cloud (AWS/GCP)', cluster: 'c4', description: 'Cloud platforms & services', levels: ['beginner','intermediate','advanced','expert'], synonyms: ['AWS','GCP','Azure','cloud computing','cloud'] },
  // Testing
  { id: 's18', name: 'Jest/Testing', cluster: 'c5', description: 'Unit & integration testing', levels: ['beginner','intermediate','advanced','expert'], synonyms: ['Jest','Mocha','unit testing','testing'] },
  { id: 's19', name: 'Cypress/E2E', cluster: 'c5', description: 'End-to-end testing', levels: ['beginner','intermediate','advanced','expert'], synonyms: ['Cypress','Playwright','E2E','end to end'] },
  // Soft
  { id: 's20', name: 'Communication', cluster: 'c6', description: 'Verbal & written communication', levels: ['beginner','intermediate','advanced','expert'], synonyms: ['verbal communication','presentation'] },
  { id: 's21', name: 'Problem Solving', cluster: 'c6', description: 'Analytical & problem solving', levels: ['beginner','intermediate','advanced','expert'], synonyms: ['analytical thinking','critical thinking'] },
  { id: 's22', name: 'DSA', cluster: 'c2', description: 'Data Structures & Algorithms', levels: ['beginner','intermediate','advanced','expert'], synonyms: ['Data Structures','Algorithms','competitive programming','LeetCode'] },
  { id: 's23', name: 'System Design', cluster: 'c2', description: 'Large-scale system architecture', levels: ['beginner','intermediate','advanced','expert'], synonyms: ['architecture','HLD','LLD','system architecture'] },
  { id: 's24', name: 'Data Visualisation', cluster: 'c3', description: 'Charts, dashboards, D3.js, Tableau', levels: ['beginner','intermediate','advanced','expert'], synonyms: ['charts','dashboards','Tableau','PowerBI','D3'] },
  { id: 's25', name: 'Statistics', cluster: 'c3', description: 'Statistical analysis & probability', levels: ['beginner','intermediate','advanced','expert'], synonyms: ['stats','probability','statistical modelling'] },
];

// ── Users ─────────────────────────────────────────────────────────────────────
export const users: User[] = [
  { id: 'u1', name: 'Dr. Priya Mehta', email: 'priya.mehta@college.edu', role: 'faculty', avatarInitials: 'PM', department: 'CSE', designation: 'Associate Professor' },
  { id: 'u2', name: 'Rajesh Kumar', email: 'rajesh.kumar@college.edu', role: 'placement_officer', avatarInitials: 'RK', department: 'Placement Cell', designation: 'Placement Officer' },
  { id: 'u3', name: 'Dr. Sunita Sharma', email: 'sunita.sharma@college.edu', role: 'placement_head', avatarInitials: 'SS', department: 'Placement Cell', designation: 'Head of Placement' },
  { id: 'u4', name: 'Ankit Verma', email: 'ankit.verma@techcorp.com', role: 'recruiter', avatarInitials: 'AV', company: 'TechCorp Solutions' },
  { id: 'u5', name: 'Meera Nair', email: 'meera.nair@datainc.com', role: 'recruiter', avatarInitials: 'MN', company: 'DataInc Analytics' },
  { id: 'u6', name: 'Admin User', email: 'admin@college.edu', role: 'admin', avatarInitials: 'AU' },
];

export const students: Student[] = [
  {
    id: 'st1', name: 'Arjun Patel', email: 'arjun.patel@student.edu',
    role: 'student', avatarInitials: 'AP', rollNumber: 'CSE2021001',
    cgpa: 8.7, branch: 'CSE', year: 4, backlogs: 0, batch: '2021–2025',
    phone: '+91-9876543210', department: 'CSE',
    linkedInUrl: 'https://linkedin.com/in/arjunpatel',
    githubUrl: 'https://github.com/arjunpatel',
    skills: ['s1','s2','s3','s5','s9','s13','s16','s22'],
  },
  {
    id: 'st2', name: 'Sneha Reddy', email: 'sneha.reddy@student.edu',
    role: 'student', avatarInitials: 'SR', rollNumber: 'CSE2021002',
    cgpa: 9.1, branch: 'CSE', year: 4, backlogs: 0, batch: '2021–2025',
    phone: '+91-9876543211', department: 'CSE',
    linkedInUrl: 'https://linkedin.com/in/snehareddy',
    githubUrl: 'https://github.com/snehareddy',
    skills: ['s7','s8','s11','s12','s13','s24','s25','s16'],
  },
  {
    id: 'st3', name: 'Kiran Bose', email: 'kiran.bose@student.edu',
    role: 'student', avatarInitials: 'KB', rollNumber: 'CSE2021003',
    cgpa: 7.8, branch: 'CSE', year: 4, backlogs: 1, batch: '2021–2025',
    phone: '+91-9876543212', department: 'CSE',
    githubUrl: 'https://github.com/kiranbose',
    skills: ['s1','s5','s13','s16','s18'],
  },
  {
    id: 'st4', name: 'Divya Singh', email: 'divya.singh@student.edu',
    role: 'student', avatarInitials: 'DS', rollNumber: 'ECE2021001',
    cgpa: 8.3, branch: 'ECE', year: 4, backlogs: 0, batch: '2021–2025',
    phone: '+91-9876543213', department: 'ECE',
    skills: ['s7','s11','s12','s25','s16'],
  },
  {
    id: 'st5', name: 'Rahul Gupta', email: 'rahul.gupta@student.edu',
    role: 'student', avatarInitials: 'RG', rollNumber: 'CSE2021004',
    cgpa: 8.9, branch: 'CSE', year: 4, backlogs: 0, batch: '2021–2025',
    phone: '+91-9876543214', department: 'CSE',
    skills: ['s1','s2','s3','s4','s9','s14','s15','s16','s23'],
  },
  {
    id: 'st6', name: 'Priya Kapoor', email: 'priya.kapoor@student.edu',
    role: 'student', avatarInitials: 'PK', rollNumber: 'CSE2021005',
    cgpa: 7.5, branch: 'CSE', year: 4, backlogs: 2, batch: '2021–2025',
    phone: '+91-9876543215', department: 'CSE',
    skills: ['s5','s13','s16','s22'],
  },
  {
    id: 'st7', name: 'Vikram Malhotra', email: 'vikram.malhotra@student.edu',
    role: 'student', avatarInitials: 'VM', rollNumber: 'CSE2021006',
    cgpa: 9.4, branch: 'CSE', year: 4, backlogs: 0, batch: '2021–2025',
    phone: '+91-9876543216', department: 'CSE',
    skills: ['s1','s2','s3','s5','s6','s9','s14','s15','s16','s22','s23'],
  },
  {
    id: 'st8', name: 'Anjali Tripathi', email: 'anjali.tripathi@student.edu',
    role: 'student', avatarInitials: 'AT', rollNumber: 'IT2021001',
    cgpa: 8.0, branch: 'IT', year: 4, backlogs: 0, batch: '2021–2025',
    phone: '+91-9876543217', department: 'IT',
    skills: ['s7','s11','s13','s24','s16','s18','s19'],
  },
];

// ── M2 & M3: Evidence Items ────────────────────────────────────────────────────
export const evidenceItems: EvidenceItem[] = [
  { id: 'ev1', studentId: 'st1', skillId: 's1', type: 'project', title: 'E-commerce React App', description: 'Full-stack e-commerce with React + Node.js', level: 'advanced', score: 88, verificationStatus: 'verified', verifiedBy: 'u1', verifiedAt: '2024-03-15', submittedAt: '2024-03-10', externalUrl: 'https://github.com/arjunpatel/ecommerce' },
  { id: 'ev2', studentId: 'st1', skillId: 's22', type: 'assessment', title: 'DSA Assessment – HackerRank', description: 'Completed 120/150 problems, Gold badge', level: 'intermediate', score: 78, verificationStatus: 'verified', verifiedBy: 'u1', verifiedAt: '2024-04-01', submittedAt: '2024-03-28', externalUrl: 'https://hackerrank.com/arjunpatel' },
  { id: 'ev3', studentId: 'st1', skillId: 's13', type: 'academic_result', title: 'DBMS Course – A Grade', description: 'Scored 91/100 in DBMS course', level: 'advanced', score: 91, verificationStatus: 'verified', verifiedBy: 'u1', verifiedAt: '2024-02-10', submittedAt: '2024-02-08' },
  { id: 'ev4', studentId: 'st1', skillId: 's9', type: 'project', title: 'REST API for Library System', description: 'Built complete REST API with JWT auth, pagination', level: 'intermediate', score: 82, verificationStatus: 'verified', verifiedBy: 'u1', verifiedAt: '2024-04-20', submittedAt: '2024-04-15' },
  { id: 'ev5', studentId: 'st1', skillId: 's23', type: 'mock_interview', title: 'System Design Mock – Round 1', description: 'Designed URL shortener system, evaluated by Dr. Mehta', level: 'beginner', score: 55, verificationStatus: 'verified', verifiedBy: 'u1', verifiedAt: '2024-05-01', submittedAt: '2024-04-30' },
  { id: 'ev6', studentId: 'st2', skillId: 's12', type: 'certification', title: 'Google ML Crash Course Certificate', description: 'Completed Google ML course with distinction', level: 'intermediate', score: 88, verificationStatus: 'verified', verifiedBy: 'u1', verifiedAt: '2024-03-01', submittedAt: '2024-02-25', externalUrl: 'https://coursera.org/cert/ml-crash' },
  { id: 'ev7', studentId: 'st2', skillId: 's11', type: 'project', title: 'Customer Churn Prediction', description: 'ML model with 89% accuracy using ensemble methods', level: 'advanced', score: 91, verificationStatus: 'verified', verifiedBy: 'u1', verifiedAt: '2024-04-10', submittedAt: '2024-04-05' },
  { id: 'ev8', studentId: 'st2', skillId: 's25', type: 'academic_result', title: 'Statistics & Probability – A+', description: 'Scored 96/100, top of class', level: 'expert', score: 96, verificationStatus: 'verified', verifiedBy: 'u1', verifiedAt: '2024-02-01', submittedAt: '2024-01-30' },
  { id: 'ev9', studentId: 'st3', skillId: 's1', type: 'project', title: 'Blog Platform React', description: 'Basic blog with CRUD operations', level: 'intermediate', score: 70, verificationStatus: 'pending', submittedAt: '2024-05-01' },
  { id: 'ev10', studentId: 'st5', skillId: 's3', type: 'project', title: 'Portfolio with Next.js', description: 'Personal portfolio with SSR, analytics', level: 'advanced', score: 85, verificationStatus: 'verified', verifiedBy: 'u1', verifiedAt: '2024-04-25', submittedAt: '2024-04-20' },
  { id: 'ev11', studentId: 'st5', skillId: 's23', type: 'mock_interview', title: 'System Design Mock – Microservices', description: 'Designed scalable microservices architecture', level: 'intermediate', score: 78, verificationStatus: 'verified', verifiedBy: 'u1', verifiedAt: '2024-05-05', submittedAt: '2024-05-04' },
  { id: 'ev12', studentId: 'st7', skillId: 's6', type: 'project', title: 'NestJS Enterprise API', description: 'Production-grade API with auth, caching, monitoring', level: 'expert', score: 95, verificationStatus: 'verified', verifiedBy: 'u1', verifiedAt: '2024-05-10', submittedAt: '2024-05-08' },
  { id: 'ev13', studentId: 'st7', skillId: 's22', type: 'assessment', title: 'DSA – LeetCode 300+ problems', description: 'LeetCode premium, solved 300+ with 80% medium-hard', level: 'advanced', score: 92, verificationStatus: 'verified', verifiedBy: 'u1', verifiedAt: '2024-04-15', submittedAt: '2024-04-10' },
  { id: 'ev14', studentId: 'st4', skillId: 's12', type: 'certification', title: 'Coursera ML Specialization', description: 'Andrew Ng ML Specialization – 3 courses', level: 'advanced', score: 87, verificationStatus: 'pending', submittedAt: '2024-05-15' },
  { id: 'ev15', studentId: 'st8', skillId: 's19', type: 'certification', title: 'ISTQB Foundation Level', description: 'ISTQB certified software tester', level: 'intermediate', score: 80, verificationStatus: 'verified', verifiedBy: 'u1', verifiedAt: '2024-04-30', submittedAt: '2024-04-28' },
];

export const verifications: Verification[] = [
  { id: 'ver1', evidenceId: 'ev1', facultyId: 'u1', status: 'verified', notes: 'Reviewed GitHub repo, code quality is excellent', createdAt: '2024-03-15', updatedAt: '2024-03-15' },
  { id: 'ver2', evidenceId: 'ev2', facultyId: 'u1', status: 'verified', notes: 'Score verified via HackerRank API', createdAt: '2024-04-01', updatedAt: '2024-04-01' },
];

// ── M5: Assessments & Mock Interviews ─────────────────────────────────────────
export const assessments: Assessment[] = [
  { id: 'ass1', studentId: 'st1', type: 'aptitude', title: 'Quantitative Aptitude – Mock 1', score: 72, maxScore: 100, skillIds: ['s21'], conductedAt: '2024-04-15', assessorId: 'u2', notes: 'Average performance in speed maths', rubric: [{ criterion: 'Speed', score: 68, maxScore: 100, feedback: 'Needs improvement' }, { criterion: 'Accuracy', score: 78, maxScore: 100, feedback: 'Good' }] },
  { id: 'ass2', studentId: 'st1', type: 'coding', title: 'Coding Assessment – HackerRank', score: 78, maxScore: 100, skillIds: ['s22'], conductedAt: '2024-04-20', notes: 'Solved 3/5 problems' },
  { id: 'ass3', studentId: 'st2', type: 'aptitude', title: 'Quantitative Aptitude – Mock 1', score: 88, maxScore: 100, skillIds: ['s21'], conductedAt: '2024-04-15', assessorId: 'u2' },
  { id: 'ass4', studentId: 'st5', type: 'technical', title: 'Frontend Technical Quiz', score: 85, maxScore: 100, skillIds: ['s1','s2','s3'], conductedAt: '2024-04-18', assessorId: 'u1' },
  { id: 'ass5', studentId: 'st7', type: 'coding', title: 'Advanced DSA – Codility', score: 94, maxScore: 100, skillIds: ['s22'], conductedAt: '2024-04-22' },
  { id: 'ass6', studentId: 'st3', type: 'aptitude', title: 'Quantitative Aptitude – Mock 1', score: 58, maxScore: 100, skillIds: ['s21'], conductedAt: '2024-04-15', assessorId: 'u2' },
];

export const mockInterviews: MockInterview[] = [
  { id: 'mi1', studentId: 'st1', conductedBy: 'u1', date: '2024-05-01', overallScore: 7.2, dimensions: { technical: 7.5, communication: 7.0, problemSolving: 7.8, confidence: 6.5, domainKnowledge: 7.2 }, feedback: 'Good problem solving, needs work on system design depth and confidence', skillsEvaluated: ['s22','s23','s9'] },
  { id: 'mi2', studentId: 'st2', conductedBy: 'u1', date: '2024-05-02', overallScore: 8.5, dimensions: { technical: 8.8, communication: 8.5, problemSolving: 8.2, confidence: 8.0, domainKnowledge: 9.0 }, feedback: 'Excellent data science knowledge, very confident. Communication could be more concise', skillsEvaluated: ['s12','s11','s25'] },
  { id: 'mi3', studentId: 'st5', conductedBy: 'u1', date: '2024-05-03', overallScore: 8.1, dimensions: { technical: 8.5, communication: 7.5, problemSolving: 8.0, confidence: 8.2, domainKnowledge: 8.3 }, feedback: 'Strong frontend skills, good system design fundamentals', skillsEvaluated: ['s1','s3','s23'] },
  { id: 'mi4', studentId: 'st7', conductedBy: 'u1', date: '2024-05-04', overallScore: 9.2, dimensions: { technical: 9.5, communication: 8.8, problemSolving: 9.4, confidence: 9.0, domainKnowledge: 9.3 }, feedback: 'Outstanding. Near production-ready skill set', skillsEvaluated: ['s6','s22','s23','s9'] },
  { id: 'mi5', studentId: 'st3', conductedBy: 'u1', date: '2024-05-01', overallScore: 5.8, dimensions: { technical: 5.5, communication: 6.5, problemSolving: 5.8, confidence: 5.2, domainKnowledge: 6.0 }, feedback: 'Needs more practice with DSA and project depth. Communication is a strength', skillsEvaluated: ['s22','s9','s1'] },
];

// ── M4: Skill Profiles (pre-computed) ────────────────────────────────────────
export const skillProfiles: SkillProfile[] = [
  {
    studentId: 'st1',
    lastUpdated: '2024-05-01',
    claims: [
      { skillId: 's1', level: 'advanced', verifiedLevel: 'advanced', evidenceCount: 1, verifiedEvidenceCount: 1, confidence: 0.88 },
      { skillId: 's22', level: 'intermediate', verifiedLevel: 'intermediate', evidenceCount: 2, verifiedEvidenceCount: 2, confidence: 0.78 },
      { skillId: 's13', level: 'advanced', verifiedLevel: 'advanced', evidenceCount: 1, verifiedEvidenceCount: 1, confidence: 0.91 },
      { skillId: 's9', level: 'intermediate', verifiedLevel: 'intermediate', evidenceCount: 1, verifiedEvidenceCount: 1, confidence: 0.82 },
      { skillId: 's23', level: 'beginner', verifiedLevel: 'beginner', evidenceCount: 1, verifiedEvidenceCount: 1, confidence: 0.55 },
      { skillId: 's16', level: 'intermediate', verifiedLevel: undefined, evidenceCount: 1, verifiedEvidenceCount: 0, confidence: 0.60 },
      { skillId: 's5', level: 'intermediate', verifiedLevel: undefined, evidenceCount: 1, verifiedEvidenceCount: 0, confidence: 0.65 },
      { skillId: 's2', level: 'intermediate', verifiedLevel: undefined, evidenceCount: 1, verifiedEvidenceCount: 0, confidence: 0.70 },
      { skillId: 's3', level: 'beginner', verifiedLevel: undefined, evidenceCount: 1, verifiedEvidenceCount: 0, confidence: 0.50 },
    ],
  },
  {
    studentId: 'st2',
    lastUpdated: '2024-05-02',
    claims: [
      { skillId: 's12', level: 'advanced', verifiedLevel: 'advanced', evidenceCount: 2, verifiedEvidenceCount: 2, confidence: 0.90 },
      { skillId: 's11', level: 'advanced', verifiedLevel: 'advanced', evidenceCount: 1, verifiedEvidenceCount: 1, confidence: 0.91 },
      { skillId: 's25', level: 'expert', verifiedLevel: 'expert', evidenceCount: 1, verifiedEvidenceCount: 1, confidence: 0.96 },
      { skillId: 's13', level: 'intermediate', verifiedLevel: undefined, evidenceCount: 1, verifiedEvidenceCount: 0, confidence: 0.75 },
      { skillId: 's24', level: 'intermediate', verifiedLevel: undefined, evidenceCount: 1, verifiedEvidenceCount: 0, confidence: 0.70 },
      { skillId: 's7', level: 'intermediate', verifiedLevel: undefined, evidenceCount: 1, verifiedEvidenceCount: 0, confidence: 0.75 },
      { skillId: 's16', level: 'intermediate', verifiedLevel: undefined, evidenceCount: 1, verifiedEvidenceCount: 0, confidence: 0.65 },
    ],
  },
  {
    studentId: 'st5',
    lastUpdated: '2024-05-03',
    claims: [
      { skillId: 's1', level: 'advanced', verifiedLevel: 'advanced', evidenceCount: 1, verifiedEvidenceCount: 1, confidence: 0.85 },
      { skillId: 's3', level: 'advanced', verifiedLevel: 'advanced', evidenceCount: 1, verifiedEvidenceCount: 1, confidence: 0.85 },
      { skillId: 's23', level: 'intermediate', verifiedLevel: 'intermediate', evidenceCount: 1, verifiedEvidenceCount: 1, confidence: 0.78 },
      { skillId: 's2', level: 'advanced', verifiedLevel: undefined, evidenceCount: 1, verifiedEvidenceCount: 0, confidence: 0.80 },
      { skillId: 's14', level: 'intermediate', verifiedLevel: undefined, evidenceCount: 1, verifiedEvidenceCount: 0, confidence: 0.72 },
      { skillId: 's15', level: 'beginner', verifiedLevel: undefined, evidenceCount: 1, verifiedEvidenceCount: 0, confidence: 0.55 },
      { skillId: 's9', level: 'intermediate', verifiedLevel: undefined, evidenceCount: 1, verifiedEvidenceCount: 0, confidence: 0.70 },
      { skillId: 's16', level: 'advanced', verifiedLevel: undefined, evidenceCount: 1, verifiedEvidenceCount: 0, confidence: 0.80 },
    ],
  },
  {
    studentId: 'st7',
    lastUpdated: '2024-05-04',
    claims: [
      { skillId: 's6', level: 'expert', verifiedLevel: 'expert', evidenceCount: 1, verifiedEvidenceCount: 1, confidence: 0.95 },
      { skillId: 's22', level: 'advanced', verifiedLevel: 'advanced', evidenceCount: 2, verifiedEvidenceCount: 2, confidence: 0.92 },
      { skillId: 's1', level: 'advanced', verifiedLevel: undefined, evidenceCount: 1, verifiedEvidenceCount: 0, confidence: 0.85 },
      { skillId: 's2', level: 'advanced', verifiedLevel: undefined, evidenceCount: 1, verifiedEvidenceCount: 0, confidence: 0.85 },
      { skillId: 's3', level: 'advanced', verifiedLevel: undefined, evidenceCount: 1, verifiedEvidenceCount: 0, confidence: 0.82 },
      { skillId: 's5', level: 'advanced', verifiedLevel: undefined, evidenceCount: 1, verifiedEvidenceCount: 0, confidence: 0.88 },
      { skillId: 's9', level: 'advanced', verifiedLevel: undefined, evidenceCount: 1, verifiedEvidenceCount: 0, confidence: 0.88 },
      { skillId: 's14', level: 'advanced', verifiedLevel: undefined, evidenceCount: 1, verifiedEvidenceCount: 0, confidence: 0.80 },
      { skillId: 's15', level: 'intermediate', verifiedLevel: undefined, evidenceCount: 1, verifiedEvidenceCount: 0, confidence: 0.70 },
      { skillId: 's16', level: 'advanced', verifiedLevel: undefined, evidenceCount: 1, verifiedEvidenceCount: 0, confidence: 0.88 },
      { skillId: 's23', level: 'intermediate', verifiedLevel: undefined, evidenceCount: 1, verifiedEvidenceCount: 0, confidence: 0.75 },
    ],
  },
];

// ── M6: Readiness Snapshots ────────────────────────────────────────────────────
export const readinessSnapshots: ReadinessSnapshot[] = [
  {
    id: 'rs1', studentId: 'st1',
    overallScore: 72,
    dimensions: {
      technical: { name: 'Technical', score: 75, weight: 0.35, explanation: 'Strong React & SQL, moderate DSA' },
      aptitude: { name: 'Aptitude', score: 72, weight: 0.20, explanation: 'Average aptitude test scores' },
      communication: { name: 'Communication', score: 70, weight: 0.20, explanation: 'Decent in mock interviews, needs clarity' },
      projectDepth: { name: 'Project Depth', score: 82, weight: 0.15, explanation: 'Solid e-commerce project with full-stack' },
      domainFit: { name: 'Domain Fit', score: 60, weight: 0.10, explanation: 'Partial skill match to current drive requirements' },
    },
    computedAt: '2024-05-05',
    explanation: 'Student is generally ready but has gaps in system design and DSA depth.',
  },
  {
    id: 'rs2', studentId: 'st2',
    overallScore: 88,
    dimensions: {
      technical: { name: 'Technical', score: 91, weight: 0.35, explanation: 'Expert-level data science & ML skills' },
      aptitude: { name: 'Aptitude', score: 88, weight: 0.20, explanation: 'Above-average aptitude scores' },
      communication: { name: 'Communication', score: 85, weight: 0.20, explanation: 'Clear and articulate in mock interviews' },
      projectDepth: { name: 'Project Depth', score: 91, weight: 0.15, explanation: 'Production-quality ML project with measurable outcomes' },
      domainFit: { name: 'Domain Fit', score: 78, weight: 0.10, explanation: 'Good fit for data roles' },
    },
    computedAt: '2024-05-05',
    explanation: 'Highly ready for data science roles. Minor gap in cloud and deployment skills.',
  },
  {
    id: 'rs3', studentId: 'st3',
    overallScore: 54,
    dimensions: {
      technical: { name: 'Technical', score: 52, weight: 0.35, explanation: 'Basic frontend skills, weak DSA' },
      aptitude: { name: 'Aptitude', score: 58, weight: 0.20, explanation: 'Below-average aptitude' },
      communication: { name: 'Communication', score: 65, weight: 0.20, explanation: 'Good communication but technical weakness shows' },
      projectDepth: { name: 'Project Depth', score: 50, weight: 0.15, explanation: 'Basic blog project, lacks complexity' },
      domainFit: { name: 'Domain Fit', score: 40, weight: 0.10, explanation: 'Poor fit for current drive requirements' },
    },
    computedAt: '2024-05-05',
    explanation: 'Student needs significant preparation, especially in DSA and project depth.',
  },
  {
    id: 'rs4', studentId: 'st5',
    overallScore: 82,
    dimensions: {
      technical: { name: 'Technical', score: 85, weight: 0.35, explanation: 'Strong Next.js and system design skills' },
      aptitude: { name: 'Aptitude', score: 80, weight: 0.20, explanation: 'Good aptitude performance' },
      communication: { name: 'Communication', score: 75, weight: 0.20, explanation: 'Comfortable in technical discussions' },
      projectDepth: { name: 'Project Depth', score: 85, weight: 0.15, explanation: 'Next.js portfolio shows depth' },
      domainFit: { name: 'Domain Fit', score: 88, weight: 0.10, explanation: 'Excellent fit for frontend/fullstack role' },
    },
    computedAt: '2024-05-05',
    explanation: 'Well-prepared for frontend and full-stack roles. Minor gap in Docker.',
  },
  {
    id: 'rs5', studentId: 'st7',
    overallScore: 94,
    dimensions: {
      technical: { name: 'Technical', score: 96, weight: 0.35, explanation: 'Expert NestJS, advanced DSA and system design' },
      aptitude: { name: 'Aptitude', score: 94, weight: 0.20, explanation: 'Excellent aptitude scores' },
      communication: { name: 'Communication', score: 88, weight: 0.20, explanation: 'Very clear and technical communicator' },
      projectDepth: { name: 'Project Depth', score: 95, weight: 0.15, explanation: 'Enterprise-grade production projects' },
      domainFit: { name: 'Domain Fit', score: 96, weight: 0.10, explanation: 'Near-perfect match for SDE roles' },
    },
    computedAt: '2024-05-05',
    explanation: 'Exceptional candidate, top of cohort. Ready for senior SDE roles.',
  },
];

// ── M7: Drives ─────────────────────────────────────────────────────────────────
export const drives: Drive[] = [
  {
    id: 'd1', company: 'TechCorp Solutions', role: 'Software Development Engineer – Frontend',
    description: 'Building scalable React applications for enterprise clients. Work on design systems, performance optimisation and real-time features.',
    package: '12–18 LPA', status: 'registration_open',
    registrationDeadline: '2024-06-15', driveDate: '2024-06-30',
    targetDepartments: ['CSE','IT','ECE'], totalSeats: 15, createdBy: 'u2', createdAt: '2024-05-01',
    eligibilityCriteria: { minCGPA: 7.5, maxBacklogs: 1, allowedBranches: ['CSE','IT','ECE'] },
    requiredSkills: [
      { skillId: 's1', minLevel: 'intermediate', weight: 0.30, mandatory: true },
      { skillId: 's2', minLevel: 'intermediate', weight: 0.20, mandatory: true },
      { skillId: 's22', minLevel: 'intermediate', weight: 0.25, mandatory: true },
      { skillId: 's23', minLevel: 'beginner', weight: 0.15, mandatory: false },
      { skillId: 's16', minLevel: 'beginner', weight: 0.10, mandatory: false },
    ],
  },
  {
    id: 'd2', company: 'DataInc Analytics', role: 'Data Scientist',
    description: 'Building predictive models and data pipelines for Fortune 500 clients. Heavy Python, ML and statistics focus.',
    package: '14–20 LPA', status: 'published',
    registrationDeadline: '2024-07-01', driveDate: '2024-07-15',
    targetDepartments: ['CSE','IT','ECE','MCA'], totalSeats: 8, createdBy: 'u2', createdAt: '2024-05-10',
    eligibilityCriteria: { minCGPA: 8.0, maxBacklogs: 0, allowedBranches: ['CSE','IT','ECE','MCA'] },
    requiredSkills: [
      { skillId: 's12', minLevel: 'intermediate', weight: 0.30, mandatory: true },
      { skillId: 's11', minLevel: 'intermediate', weight: 0.25, mandatory: true },
      { skillId: 's25', minLevel: 'intermediate', weight: 0.20, mandatory: true },
      { skillId: 's13', minLevel: 'beginner', weight: 0.15, mandatory: false },
      { skillId: 's24', minLevel: 'beginner', weight: 0.10, mandatory: false },
    ],
  },
  {
    id: 'd3', company: 'QualityFirst Technologies', role: 'QA Engineer',
    description: 'Building test automation frameworks for cloud products. Focus on API testing and E2E automation.',
    package: '8–12 LPA', status: 'registration_open',
    registrationDeadline: '2024-06-20', driveDate: '2024-07-05',
    targetDepartments: ['CSE','IT'], totalSeats: 20, createdBy: 'u2', createdAt: '2024-05-05',
    eligibilityCriteria: { minCGPA: 7.0, maxBacklogs: 2, allowedBranches: ['CSE','IT'] },
    requiredSkills: [
      { skillId: 's18', minLevel: 'intermediate', weight: 0.35, mandatory: true },
      { skillId: 's19', minLevel: 'beginner', weight: 0.25, mandatory: true },
      { skillId: 's9', minLevel: 'beginner', weight: 0.20, mandatory: false },
      { skillId: 's7', minLevel: 'beginner', weight: 0.10, mandatory: false },
      { skillId: 's21', minLevel: 'beginner', weight: 0.10, mandatory: false },
    ],
  },
  {
    id: 'd4', company: 'CloudNative Inc.', role: 'Backend Engineer – Node.js',
    description: 'Microservices architecture, REST and GraphQL APIs, cloud deployment on AWS.',
    package: '15–22 LPA', status: 'draft',
    registrationDeadline: '2024-07-10', driveDate: '2024-07-25',
    targetDepartments: ['CSE'], totalSeats: 10, createdBy: 'u2', createdAt: '2024-05-15',
    eligibilityCriteria: { minCGPA: 8.0, maxBacklogs: 0, allowedBranches: ['CSE'] },
    requiredSkills: [
      { skillId: 's5', minLevel: 'advanced', weight: 0.25, mandatory: true },
      { skillId: 's9', minLevel: 'intermediate', weight: 0.20, mandatory: true },
      { skillId: 's22', minLevel: 'advanced', weight: 0.25, mandatory: true },
      { skillId: 's23', minLevel: 'intermediate', weight: 0.15, mandatory: true },
      { skillId: 's15', minLevel: 'beginner', weight: 0.10, mandatory: false },
      { skillId: 's17', minLevel: 'beginner', weight: 0.05, mandatory: false },
    ],
  },
];

// ── M7b: Registrations ────────────────────────────────────────────────────────
export const registrations: Registration[] = [
  { id: 'reg1', studentId: 'st1', driveId: 'd1', status: 'applied', isEligible: true, eligibilityReason: 'CGPA 8.7 ≥ 7.5, Branch CSE ✓, Backlogs 0 ≤ 1', registeredAt: '2024-05-20', updatedAt: '2024-05-20' },
  { id: 'reg2', studentId: 'st3', driveId: 'd1', status: 'applied', isEligible: true, eligibilityReason: 'CGPA 7.8 ≥ 7.5, Branch CSE ✓, Backlogs 1 ≤ 1', registeredAt: '2024-05-21', updatedAt: '2024-05-21' },
  { id: 'reg3', studentId: 'st5', driveId: 'd1', status: 'shortlisted', isEligible: true, eligibilityReason: 'CGPA 8.9 ≥ 7.5, Branch CSE ✓, Backlogs 0 ≤ 1', registeredAt: '2024-05-19', updatedAt: '2024-05-25' },
  { id: 'reg4', studentId: 'st7', driveId: 'd1', status: 'shortlisted', isEligible: true, eligibilityReason: 'CGPA 9.4 ≥ 7.5, Branch CSE ✓, Backlogs 0 ≤ 1', registeredAt: '2024-05-18', updatedAt: '2024-05-25' },
  { id: 'reg5', studentId: 'st2', driveId: 'd2', status: 'applied', isEligible: true, eligibilityReason: 'CGPA 9.1 ≥ 8.0, Branch CSE ✓, Backlogs 0', registeredAt: '2024-05-22', updatedAt: '2024-05-22' },
  { id: 'reg6', studentId: 'st4', driveId: 'd2', status: 'applied', isEligible: true, eligibilityReason: 'CGPA 8.3 ≥ 8.0, Branch ECE ✓, Backlogs 0', registeredAt: '2024-05-23', updatedAt: '2024-05-23' },
  { id: 'reg7', studentId: 'st6', driveId: 'd1', status: 'applied', isEligible: false, eligibilityReason: 'Backlogs 2 > 1 – Ineligible', registeredAt: '2024-05-20', updatedAt: '2024-05-20' },
  { id: 'reg8', studentId: 'st8', driveId: 'd3', status: 'applied', isEligible: true, eligibilityReason: 'CGPA 8.0 ≥ 7.0, Branch IT ✓, Backlogs 0', registeredAt: '2024-05-21', updatedAt: '2024-05-21' },
];

// ── M8: Gap Analysis ──────────────────────────────────────────────────────────
export const gapAnalyses: GapAnalysis[] = [
  {
    id: 'ga1', studentId: 'st1', driveId: 'd1', matchScore: 65, computedAt: '2024-05-20',
    gaps: [
      { skillId: 's22', skillName: 'DSA', required: 'intermediate', current: 'intermediate', gap: 0, severity: 'medium', impact: 50, mandatory: true },
      { skillId: 's23', skillName: 'System Design', required: 'beginner', current: 'beginner', gap: 0, severity: 'low', impact: 20, mandatory: false },
      { skillId: 's2', skillName: 'TypeScript', required: 'intermediate', current: 'intermediate', gap: 0, severity: 'low', impact: 30, mandatory: true },
    ],
    strengths: ['s1','s13','s9'],
  },
  {
    id: 'ga2', studentId: 'st3', driveId: 'd1', matchScore: 38, computedAt: '2024-05-21',
    gaps: [
      { skillId: 's22', skillName: 'DSA', required: 'intermediate', current: 'beginner', gap: 1, severity: 'critical', impact: 90, mandatory: true },
      { skillId: 's2', skillName: 'TypeScript', required: 'intermediate', current: undefined, gap: 2, severity: 'critical', impact: 85, mandatory: true },
      { skillId: 's23', skillName: 'System Design', required: 'beginner', current: undefined, gap: 1, severity: 'high', impact: 60, mandatory: false },
      { skillId: 's1', skillName: 'React', required: 'intermediate', current: 'intermediate', gap: 0, severity: 'low', impact: 15, mandatory: true },
    ],
    strengths: ['s1'],
  },
  {
    id: 'ga3', studentId: 'st5', driveId: 'd1', matchScore: 88, computedAt: '2024-05-20',
    gaps: [
      { skillId: 's22', skillName: 'DSA', required: 'intermediate', current: 'intermediate', gap: 0, severity: 'low', impact: 20, mandatory: true },
    ],
    strengths: ['s1','s2','s3','s9','s23'],
  },
  {
    id: 'ga4', studentId: 'st2', driveId: 'd2', matchScore: 92, computedAt: '2024-05-22',
    gaps: [
      { skillId: 's24', skillName: 'Data Visualisation', required: 'beginner', current: 'intermediate', gap: 0, severity: 'low', impact: 10, mandatory: false },
    ],
    strengths: ['s12','s11','s25','s13'],
  },
];

// ── M9: Preparation Plans ─────────────────────────────────────────────────────
export const preparationPlans: PreparationPlan[] = [
  {
    id: 'pp1', studentId: 'st3', driveId: 'd1', gapAnalysisId: 'ga2',
    totalEstimatedHours: 120,
    startDate: '2024-05-22', targetDate: '2024-06-14', createdAt: '2024-05-22',
    checkpoints: [
      {
        id: 'cp1', skillId: 's22', skillName: 'DSA', targetLevel: 'intermediate',
        dueDate: '2024-06-01', completed: false, estimatedHours: 60,
        resources: [
          { title: 'LeetCode DSA Study Plan', url: 'https://leetcode.com', type: 'practice_problem', estimatedHours: 40 },
          { title: 'Abdul Bari DSA Course', url: 'https://udemy.com/course/datastructurescncpp', type: 'video', estimatedHours: 20 },
        ],
      },
      {
        id: 'cp2', skillId: 's2', skillName: 'TypeScript', targetLevel: 'intermediate',
        dueDate: '2024-06-08', completed: false, estimatedHours: 30,
        resources: [
          { title: 'TypeScript Official Docs', url: 'https://typescriptlang.org/docs', type: 'course', estimatedHours: 15 },
          { title: 'TypeScript Deep Dive (Book)', url: 'https://basarat.gitbook.io/typescript', type: 'book', estimatedHours: 15 },
        ],
      },
      {
        id: 'cp3', skillId: 's23', skillName: 'System Design', targetLevel: 'beginner',
        dueDate: '2024-06-14', completed: false, estimatedHours: 30,
        resources: [
          { title: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', type: 'course', estimatedHours: 20 },
          { title: 'Grokking System Design', url: 'https://educative.io', type: 'course', estimatedHours: 10 },
        ],
      },
    ],
  },
];

// ── M10: Recruiter Access Grants ───────────────────────────────────────────────
export const recruiterAccessGrants: RecruiterAccessGrant[] = [
  {
    id: 'rag1', recruiterId: 'u4', driveId: 'd1',
    grantedBy: 'u3', grantedAt: '2024-05-25', expiresAt: '2024-07-01',
    releasedFields: ['name','email','phone','cgpa','branch','skills'],
    isRevoked: false,
  },
  {
    id: 'rag2', recruiterId: 'u5', driveId: 'd2',
    grantedBy: 'u3', grantedAt: '2024-05-28', expiresAt: '2024-07-15',
    releasedFields: ['name','email','cgpa','branch','skills'],
    isRevoked: false,
  },
];

export const accessLogs: AccessLog[] = [
  { id: 'al1', userId: 'u4', role: 'recruiter', action: 'VIEW_STUDENT_LIST', resource: 'students', resourceId: 'd1', ipAddress: '203.0.113.1', timestamp: '2024-05-26T10:30:00Z' },
  { id: 'al2', userId: 'u4', role: 'recruiter', action: 'VIEW_STUDENT_PROFILE', resource: 'student', resourceId: 'st5', ipAddress: '203.0.113.1', timestamp: '2024-05-26T10:32:00Z' },
  { id: 'al3', userId: 'u4', role: 'recruiter', action: 'VIEW_STUDENT_PROFILE', resource: 'student', resourceId: 'st7', ipAddress: '203.0.113.1', timestamp: '2024-05-26T10:35:00Z' },
  { id: 'al4', userId: 'u5', role: 'recruiter', action: 'VIEW_STUDENT_LIST', resource: 'students', resourceId: 'd2', ipAddress: '203.0.113.2', timestamp: '2024-05-29T14:20:00Z' },
];

// ── Batch Readiness ────────────────────────────────────────────────────────────
export const batchReadiness: BatchReadiness = {
  driveId: 'd1',
  totalStudents: 8,
  eligibleCount: 6,
  readyCount: 3,
  averageReadiness: 68,
  skillSupplyDemand: [
    { skillId: 's1', skillName: 'React', demand: 3, supply: 5, gap: -2 },
    { skillId: 's22', skillName: 'DSA', demand: 3, supply: 4, gap: -1 },
    { skillId: 's2', skillName: 'TypeScript', demand: 3, supply: 4, gap: -1 },
    { skillId: 's23', skillName: 'System Design', demand: 2, supply: 3, gap: -1 },
    { skillId: 's12', skillName: 'Machine Learning', demand: 2, supply: 3, gap: -1 },
    { skillId: 's15', skillName: 'Docker', demand: 1, supply: 2, gap: -1 },
    { skillId: 's18', skillName: 'Jest/Testing', demand: 2, supply: 2, gap: 0 },
    { skillId: 's19', skillName: 'Cypress/E2E', demand: 2, supply: 1, gap: 1 },
    { skillId: 's17', skillName: 'Cloud (AWS/GCP)', demand: 1, supply: 1, gap: 0 },
  ],
  departmentBreakdown: [
    { department: 'CSE', count: 6, avgReadiness: 72, eligibleCount: 5 },
    { department: 'IT', count: 1, avgReadiness: 65, eligibleCount: 1 },
    { department: 'ECE', count: 1, avgReadiness: 78, eligibleCount: 1 },
  ],
};

// ── Helper utilities ───────────────────────────────────────────────────────────
export function getSkillById(id: string): Skill | undefined {
  return skills.find(s => s.id === id);
}

export function getStudentById(id: string): Student | undefined {
  return students.find(s => s.id === id);
}

export function getDriveById(id: string): Drive | undefined {
  return drives.find(d => d.id === id);
}

export function getGapAnalysisForStudent(studentId: string, driveId: string): GapAnalysis | undefined {
  return gapAnalyses.find(g => g.studentId === studentId && g.driveId === driveId);
}

export function getReadinessForStudent(studentId: string): ReadinessSnapshot | undefined {
  return readinessSnapshots.find(r => r.studentId === studentId);
}

export function getProfileForStudent(studentId: string): SkillProfile | undefined {
  return skillProfiles.find(p => p.studentId === studentId);
}

export function getEvidenceForStudent(studentId: string): EvidenceItem[] {
  return evidenceItems.filter(e => e.studentId === studentId);
}

export function getRegistrationsForStudent(studentId: string): Registration[] {
  return registrations.filter(r => r.studentId === studentId);
}

export function getRegistrationsForDrive(driveId: string): Registration[] {
  return registrations.filter(r => r.driveId === driveId);
}

export function getAssessmentsForStudent(studentId: string): Assessment[] {
  return assessments.filter(a => a.studentId === studentId);
}

export function getMockInterviewsForStudent(studentId: string): MockInterview[] {
  return mockInterviews.filter(m => m.studentId === studentId);
}

export function getPrepPlanForStudent(studentId: string, driveId: string): PreparationPlan | undefined {
  return preparationPlans.find(p => p.studentId === studentId && p.driveId === driveId);
}

export function checkRecruiterAccess(recruiterId: string, driveId: string): RecruiterAccessGrant | null {
  const grant = recruiterAccessGrants.find(
    g => g.recruiterId === recruiterId && g.driveId === driveId && !g.isRevoked
  );
  if (!grant) return null;
  if (new Date(grant.expiresAt) < new Date()) return null; // expired
  return grant;
}

export const LEVEL_ORDER: Record<string, number> = {
  beginner: 1, intermediate: 2, advanced: 3, expert: 4,
};

export function computeEligibility(student: Student, drive: Drive): { eligible: boolean; reason: string } {
  const c = drive.eligibilityCriteria;
  if (student.cgpa < c.minCGPA) return { eligible: false, reason: `CGPA ${student.cgpa} < required ${c.minCGPA}` };
  if (student.backlogs > c.maxBacklogs) return { eligible: false, reason: `Backlogs ${student.backlogs} > allowed ${c.maxBacklogs}` };
  if (!c.allowedBranches.includes(student.branch)) return { eligible: false, reason: `Branch ${student.branch} not in allowed list` };
  return { eligible: true, reason: `CGPA ${student.cgpa} ✓, Branch ${student.branch} ✓, Backlogs ${student.backlogs} ✓` };
}
