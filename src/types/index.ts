// ─────────────────────────────────────────────────────────────────────────────
// P06 – Placement Skill Matcher & Readiness Analyser
// Core TypeScript Types – All domain models
// ─────────────────────────────────────────────────────────────────────────────

// ── M1: Skill Taxonomy ────────────────────────────────────────────────────────
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface Skill {
  id: string;
  name: string;
  cluster: string;        // e.g. "frontend", "backend", "data", "soft"
  description: string;
  levels: SkillLevel[];
  synonyms: string[];     // M1 synonym expansion
  parentId?: string;      // taxonomy hierarchy
}

export interface SkillCluster {
  id: string;
  name: string;
  description: string;
  color: string;          // for UI
}

// ── M2: Evidence Ingestion ────────────────────────────────────────────────────
export type EvidenceType =
  | 'academic_result'
  | 'project'
  | 'certification'
  | 'assessment'
  | 'mock_interview'
  | 'external_course'
  | 'hackathon';

export type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'unverified';

export interface EvidenceItem {
  id: string;
  studentId: string;
  skillId: string;
  type: EvidenceType;
  title: string;
  description: string;
  level: SkillLevel;
  score?: number;          // 0–100 if applicable
  verificationStatus: VerificationStatus;
  verifiedBy?: string;     // faculty userId
  verifiedAt?: string;     // ISO date
  submittedAt: string;
  externalUrl?: string;
  metadata?: Record<string, unknown>;
}

// ── M3: Evidence Verification ─────────────────────────────────────────────────
export interface Verification {
  id: string;
  evidenceId: string;
  facultyId: string;
  status: VerificationStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// ── M4: Student Skill Profile ─────────────────────────────────────────────────
export interface SkillClaim {
  skillId: string;
  level: SkillLevel;
  verifiedLevel?: SkillLevel;
  evidenceCount: number;
  verifiedEvidenceCount: number;
  confidence: number;     // 0–1
}

export interface SkillProfile {
  studentId: string;
  claims: SkillClaim[];
  lastUpdated: string;
}

// ── M5: Assessment & Mock Interview ───────────────────────────────────────────
export type AssessmentType = 'aptitude' | 'coding' | 'technical' | 'communication' | 'group_discussion';

export interface Assessment {
  id: string;
  studentId: string;
  type: AssessmentType;
  title: string;
  score: number;          // 0–100
  maxScore: number;
  skillIds: string[];
  conductedAt: string;
  assessorId?: string;
  notes?: string;
  rubric?: RubricEntry[];
}

export interface RubricEntry {
  criterion: string;
  score: number;
  maxScore: number;
  feedback: string;
}

export interface MockInterview {
  id: string;
  studentId: string;
  conductedBy: string;    // faculty/officer userId
  date: string;
  overallScore: number;   // 0–10
  dimensions: {
    technical: number;
    communication: number;
    problemSolving: number;
    confidence: number;
    domainKnowledge: number;
  };
  feedback: string;
  skillsEvaluated: string[];
}

// ── M6: Readiness Engine ──────────────────────────────────────────────────────
export interface ReadinessDimension {
  name: string;
  score: number;          // 0–100
  weight: number;
  explanation: string;
}

export interface ReadinessSnapshot {
  id: string;
  studentId: string;
  driveId?: string;       // if computed for a specific drive
  overallScore: number;   // 0–100
  dimensions: {
    technical: ReadinessDimension;
    aptitude: ReadinessDimension;
    communication: ReadinessDimension;
    projectDepth: ReadinessDimension;
    domainFit: ReadinessDimension;
  };
  computedAt: string;
  explanation: string;
}

// ── M7: Drive & Eligibility Management ────────────────────────────────────────
export type DriveStatus = 'draft' | 'published' | 'registration_open' | 'closed' | 'completed';

export interface Drive {
  id: string;
  company: string;
  role: string;
  description: string;
  package: string;        // e.g. "12–18 LPA"
  status: DriveStatus;
  registrationDeadline: string;
  driveDate: string;
  eligibilityCriteria: EligibilityCriteria;
  requiredSkills: DriveRequirement[];
  targetDepartments: string[];
  totalSeats?: number;
  createdBy: string;
  createdAt: string;
}

export interface EligibilityCriteria {
  minCGPA: number;
  maxBacklogs: number;
  allowedBranches: string[];
  minYear?: number;
  additionalConditions?: string[];
}

export interface DriveRequirement {
  skillId: string;
  minLevel: SkillLevel;
  weight: number;         // importance 0–1
  mandatory: boolean;
}

// ── M7b: Registration ────────────────────────────────────────────────────────
export type RegistrationStatus = 'applied' | 'shortlisted' | 'rejected' | 'selected' | 'withdrawn';

export interface Registration {
  id: string;
  studentId: string;
  driveId: string;
  status: RegistrationStatus;
  isEligible: boolean;
  eligibilityReason: string;
  registeredAt: string;
  updatedAt: string;
}

// ── M8: Match & Gap Analysis ──────────────────────────────────────────────────
export type GapSeverity = 'critical' | 'high' | 'medium' | 'low';

export interface SkillGap {
  skillId: string;
  skillName: string;
  required: SkillLevel;
  current?: SkillLevel;
  gap: number;            // levels difference 0–3
  severity: GapSeverity;
  impact: number;         // 0–100 (for ranking)
  mandatory: boolean;
}

export interface GapAnalysis {
  id: string;
  studentId: string;
  driveId: string;
  matchScore: number;     // 0–100 (readiness for this drive)
  gaps: SkillGap[];
  strengths: string[];    // skillIds where student meets/exceeds requirement
  computedAt: string;
}

// ── M9: Preparation Planning ──────────────────────────────────────────────────
export type ResourceType = 'course' | 'book' | 'practice_problem' | 'video' | 'mock_test';

export interface PrepResource {
  title: string;
  url?: string;
  type: ResourceType;
  estimatedHours: number;
}

export interface PrepCheckpoint {
  id: string;
  skillId: string;
  skillName: string;
  targetLevel: SkillLevel;
  dueDate: string;
  completed: boolean;
  resources: PrepResource[];
  estimatedHours: number;
}

export interface PreparationPlan {
  id: string;
  studentId: string;
  driveId: string;
  gapAnalysisId: string;
  checkpoints: PrepCheckpoint[];
  totalEstimatedHours: number;
  startDate: string;
  targetDate: string;
  createdAt: string;
}

// ── M10: Recruiter & Access Control ───────────────────────────────────────────
export interface RecruiterAccessGrant {
  id: string;
  recruiterId: string;
  driveId: string;
  grantedBy: string;      // placement head userId
  grantedAt: string;
  expiresAt: string;
  releasedFields: string[];   // field-level control
  isRevoked: boolean;
}

export interface AccessLog {
  id: string;
  userId: string;
  role: UserRole;
  action: string;
  resource: string;
  resourceId: string;
  ipAddress: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// ── Users ─────────────────────────────────────────────────────────────────────
export type UserRole = 'student' | 'faculty' | 'placement_officer' | 'placement_head' | 'recruiter' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarInitials: string;
  department?: string;
  designation?: string;
  company?: string;       // for recruiters
}

export interface Student extends User {
  role: 'student';
  rollNumber: string;
  cgpa: number;
  branch: string;
  year: number;
  backlogs: number;
  batch: string;
  phone: string;
  linkedInUrl?: string;
  githubUrl?: string;
  skills: string[];
}

// ── API Response Wrappers ─────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ── Dashboard / Analytics ─────────────────────────────────────────────────────
export interface BatchReadiness {
  driveId: string;
  totalStudents: number;
  eligibleCount: number;
  readyCount: number;      // readiness ≥ 70
  averageReadiness: number;
  skillSupplyDemand: SkillSupplyDemand[];
  departmentBreakdown: DeptBreakdown[];
}

export interface SkillSupplyDemand {
  skillId: string;
  skillName: string;
  demand: number;          // how many drives require it
  supply: number;          // how many students have it
  gap: number;             // demand - supply
}

export interface DeptBreakdown {
  department: string;
  count: number;
  avgReadiness: number;
  eligibleCount: number;
}
