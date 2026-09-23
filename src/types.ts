/**
 * Quirino High School — SBM-MART Portal
 * Core TypeScript Definitions
 * Aligned with DepEd Order No. 007, s. 2024 (Revised SBM System)
 */

export type UserRole =
  | 'super_admin'
  | 'school_head'
  | 'sbm_coordinator'
  | 'dimension_leader'
  | 'contributor'
  | 'validator'
  | 'public_visitor';

export type UserStatus = 'approved' | 'pending' | 'rejected' | 'inactive';

export type DegreeOfManifestation =
  | 'Not Yet Manifested'
  | 'Rarely Manifested'
  | 'Frequently Manifested'
  | 'Always Manifested';

export type SubmissionStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'needs_revision'
  | 'resubmitted'
  | 'verified'
  | 'approved'
  | 'archived';

export type ConfidentialityLevel = 'public' | 'internal' | 'restricted' | 'confidential';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  department?: string;
  designation?: string;
  assignedDimensions?: number[]; // e.g., [1, 2]
  assignedIndicators?: number[]; // e.g., [1, 2, 3]
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface SchoolYear {
  id: string; // e.g., "SY-2024-2025"
  label: string; // e.g., "S.Y. 2024–2025"
  isCurrent: boolean;
  isArchived: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface SbmDimension {
  id: number; // 1 to 6
  name: string;
  officialDescription: string;
  leadUserId?: string;
  leadUserName?: string;
}

export interface SbmIndicator {
  id: number; // 1 to 42
  dimensionId: number; // 1 to 6
  officialWording: string;
  defaultRequiredMovs: string[];
  isIncidentRelated?: boolean;
  isPersonnelRelated?: boolean;
  isFinancialRelated?: boolean;
  defaultConfidentiality: ConfidentialityLevel;
  suggestedLeadOffice?: string;
  localGuidanceNotes?: string;
}

export interface IndicatorYearRecord {
  id: string; // `${schoolYearId}_ind_${indicatorNumber}`
  schoolYearId: string;
  indicatorNumber: number;
  dimensionId: number;
  isApplicable: boolean;
  applicabilityJustification?: string;
  degreeOfManifestation?: DegreeOfManifestation;
  evidenceBasis?: string;
  remarks?: string;
  improvementAction?: string;
  personResponsible?: string;
  targetDate?: string;
  reviewStatus: SubmissionStatus;
  assignedOwnerId?: string;
  assignedOwnerName?: string;
  assignedContributorIds?: string[];
  reviewerId?: string;
  reviewerName?: string;
  dueDate?: string;
  approvedAt?: string;
  approvedBy?: string;
  unlockedAt?: string;
  unlockedBy?: string;
  unlockReason?: string;
  updatedAt: string;
}

export interface RequiredMovItem {
  id: string;
  schoolYearId: string;
  indicatorNumber: number;
  dimensionId: number;
  code: string;
  title: string;
  description: string;
  isMandatory: boolean;
  status: 'missing' | 'uploaded' | 'verified' | 'approved';
  matchedMovId?: string;
}

export interface MovRecord {
  id: string;
  schoolYearId: string;
  dimensionId: number;
  indicatorNumber: number;
  requiredMovItemId?: string;
  title: string;
  description?: string;
  storagePath: string;
  fileUrl: string;
  fileData?: string; // base64 or blob URL cache
  originalFilename: string;
  sanitizedFilename: string;
  fileType: string;
  mimeType: string;
  fileSize: number;
  checksum?: string;
  version: number;
  documentDate?: string;
  coveragePeriod?: string;
  originatingOffice?: string;
  uploaderId: string;
  uploaderName: string;
  uploaderEmail: string;
  assignedReviewerId?: string;
  submissionStatus: SubmissionStatus;
  relevanceRating?: number; // 1-5
  completenessRating?: number; // 1-5
  authenticityRating?: number; // 1-5
  reviewerComments?: string;
  confidentialityLevel: ConfidentialityLevel;
  tags: string[];
  isArchived: boolean;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  approvedAt?: string;
  approvedBy?: string;
  returnedAt?: string;
  returnedBy?: string;
  returnReason?: string;
}

export interface MovVersion {
  id: string;
  movId: string;
  versionNumber: number;
  storagePath: string;
  fileUrl: string;
  originalFilename: string;
  fileSize: number;
  uploadedBy: string;
  uploadedByName: string;
  uploadedAt: string;
  reasonForChange?: string;
  reviewerNotes?: string;
}

export interface ReviewChecklist {
  relevanceVerified: boolean;
  completenessVerified: boolean;
  authenticityVerified: boolean;
  datesVerified: boolean;
  signaturesVerified: boolean;
  readabilityVerified: boolean;
}

export interface ReviewLog {
  id: string;
  movId: string;
  indicatorNumber: number;
  schoolYearId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerRole: string;
  action: 'verified' | 'returned' | 'approved' | 'rejected' | 'commented';
  comments: string;
  checklist?: ReviewChecklist;
  createdAt: string;
}

export interface ThreadComment {
  id: string;
  recordType: 'indicator' | 'mov';
  recordId: string;
  indicatorNumber: number;
  authorId: string;
  authorName: string;
  authorRole: string;
  text: string;
  isInternal: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorEmail: string;
  actorRole: string;
  action: string;
  affectedRecordType: string;
  affectedRecordId: string;
  previousValue?: string;
  newValue?: string;
  reason?: string;
}

export interface DimensionCoordinator {
  dimensionId: number;
  dimensionName: string;
  leadName: string;
  designation: string;
  email?: string;
}

export interface CustomSignatory {
  id: string;
  roleLabel: string;
  name: string;
  title: string;
  office?: string;
}

export interface DashboardBannerConfig {
  badgeText?: string;
  title?: string;
  description?: string;
  showAnnouncement?: boolean;
  announcementText?: string;
  announcementType?: 'gold' | 'emerald' | 'blue' | 'amber';
  theme?: 'emerald_gold' | 'forest_classic' | 'midnight_jade' | 'royal_pine';
  quickUploadVisible?: boolean;
  quickAssessVisible?: boolean;
  quickReportsVisible?: boolean;
}

export interface DimensionProgress {
  dimensionId: number;
  name: string;
  totalIndicators: number;
  applicableIndicators: number;
  completedIndicators: number;
  missingMovsCount: number;
  completionPercentage: number;
  degrees?: Record<DegreeOfManifestation, number>;
}

export interface SchoolProfile {
  id: string;
  schoolName: string;
  name?: string;
  logoUrl?: string;
  schoolLogo?: string;
  schoolId: string;
  division: string;
  region: string;
  district: string;
  address: string;
  contactNumber: string;
  telephone?: string;
  email: string;
  schoolHead: string;
  principalName?: string;
  schoolHeadTitle: string;
  sbmCoordinator: string;
  sbmCoordinatorTitle?: string;
  assistantPrincipal?: string;
  assistantPrincipalTitle?: string;
  divisionValidator?: string;
  divisionValidatorTitle?: string;
  divisionSuperintendent?: string;
  divisionSuperintendentTitle?: string;
  dimensionCoordinators?: DimensionCoordinator[];
  customSignatories?: CustomSignatory[];
  dashboardBanner?: DashboardBannerConfig;
  history: string;
  vision: string;
  depEdVision?: string;
  mission: string;
  depEdMission?: string;
  coreValues: string[];
  depEdCoreValues?: string[];
  mandate: string;
  depEdMandate?: string;
  programs: {
    jhs: string[];
    shsTracks: string[];
    specialPrograms: string[];
  };
  curricularOfferings?: string[];
  enrollmentSummary: {
    jhsMale: number;
    jhsFemale: number;
    shsMale: number;
    shsFemale: number;
    total: number;
  };
  totalLearners?: number;
  personnelSummary: {
    teachingPersonnel: number;
    nonTeachingPersonnel: number;
    masterTeachers: number;
    headTeachers: number;
  };
  teachingPersonnel?: number;
  nonTeachingPersonnel?: number;
  facilitiesSummary: {
    instructionalClassrooms: number;
    computerLaboratories: number;
    scienceLaboratories: number;
    library: number;
    clinic: number;
    gymnasiumAuditorium: number;
  };
  classrooms?: number;
  scienceLaboratories?: number;
  computerLaboratories?: number;
  lastUpdated: string;
}

export interface SchoolReportCard {
  id: string;
  schoolYearId: string;
  schoolYearLabel: string;
  title?: string;
  schoolId?: string;
  status: 'draft' | 'published';
  isPublished?: boolean;
  enrollmentTotal: number;
  enrollment?: number;
  promotionRate: number;
  completionRate: number;
  dropoutRate: number;
  natProficiencyAverage: number;
  natRating?: number;
  summary?: string;
  keyAccomplishments: string[];
  accomplishments?: string[];
  priorityImprovementAreas: string[];
  priorityAreas?: string[];
  stakeholderHighlights: string[];
  attestedByName?: string;
  attestedByTitle?: string;
  preparedByName?: string;
  preparedByTitle?: string;
  validatedByName?: string;
  validatedByTitle?: string;
  pdfUrl?: string;
  publishedAt?: string;
  publishedDate?: string;
  publishedBy?: string;
  updatedAt: string;
}

export interface SystemAnnouncement {
  id: string;
  title: string;
  content: string;
  priority: 'normal' | 'important' | 'urgent';
  audience: 'all' | 'staff' | 'public';
  isPublished: boolean;
  authorName: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  recipientUserId: string;
  title: string;
  message: string;
  link?: string;
  type: 'assignment' | 'review' | 'approval' | 'return' | 'deadline' | 'system';
  isRead: boolean;
  createdAt: string;
}

export interface SystemSettings {
  id: string;
  maxUploadSizeMb: number;
  allowedFileExtensions: string[];
  allowAiFeatures: boolean;
  allowedDomain: string; // e.g. "depedqc.ph"
  currentSchoolYearId: string;
  schoolLogoUrl: string;
  portalSubtitle: string;
}
