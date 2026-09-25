import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  SchoolYear,
  SbmDimension,
  SbmIndicator,
  IndicatorYearRecord,
  RequiredMovItem,
  MovRecord,
  MovVersion,
  ReviewLog,
  ThreadComment,
  SchoolProfile,
  SchoolReportCard,
  SystemAnnouncement,
  AppNotification,
  SystemSettings,
  DegreeOfManifestation,
  AuditLog,
  SubmissionStatus
} from '../types';
import {
  INITIAL_SCHOOL_YEARS,
  OFFICIAL_DIMENSIONS,
  OFFICIAL_INDICATORS,
  INITIAL_SCHOOL_PROFILE,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_SCHOOL_REPORT_CARDS,
  DEFAULT_SYSTEM_SETTINGS
} from '../data/sbmMasterData';
import {
  generateIndicatorYearRecords,
  generateRequiredMovItems,
  generateSampleMovRecords
} from '../data/seedGenerator';
import { useAuth } from './AuthContext';
import { recordAuditEvent, getLocalAuditLogs } from '../lib/audit';
import { db, doc, setDoc, getDoc } from '../lib/firebase';

const STORAGE_KEYS = {
  SCHOOL_YEARS: 'qhs_sbm_school_years_v3',
  SELECTED_SY_ID: 'qhs_sbm_selected_sy_id_v3',
  INDICATOR_RECORDS: 'qhs_sbm_indicator_records_v3',
  REQUIRED_MOVS: 'qhs_sbm_required_movs_v3',
  MOV_RECORDS: 'qhs_sbm_mov_records_v3',
  COMMENTS: 'qhs_sbm_comments_v3',
  REVIEWS: 'qhs_sbm_reviews_v3',
  SCHOOL_PROFILE: 'qhs_sbm_school_profile_v3',
  SRC_LIST: 'qhs_sbm_src_list_v3',
  ANNOUNCEMENTS: 'qhs_sbm_announcements_v3',
  NOTIFICATIONS: 'qhs_sbm_notifications_v3',
  SYSTEM_SETTINGS: 'qhs_sbm_system_settings_v3'
};

interface ProgressStats {
  totalIndicators: number;
  applicableIndicators: number;
  nonApplicableIndicators: number;
  completeEvidenceIndicators: number;
  missingEvidenceIndicators: number;
  totalRequiredMovs: number;
  uploadedRequiredMovs: number;
  verifiedRequiredMovs: number;
  approvedRequiredMovs: number;
  missingRequiredMovs: number;
  overallEvidenceCompletionPct: number;
  statusCounts: {
    draft: number;
    submitted: number;
    under_review: number;
    needs_revision: number;
    resubmitted: number;
    verified: number;
    approved: number;
    archived: number;
  };
  degreeDistribution: Record<DegreeOfManifestation, number>;
  dimensionProgress: Array<{
    dimensionId: number;
    name: string;
    totalIndicators: number;
    applicableIndicators: number;
    completedIndicators: number;
    missingMovsCount: number;
    completionPercentage: number;
    degrees: Record<DegreeOfManifestation, number>;
  }>;
}

interface SbmDataContextType {
  schoolYears: SchoolYear[];
  currentSchoolYear: SchoolYear;
  selectSchoolYear: (id: string) => void;
  addSchoolYear: (data: Omit<SchoolYear, 'createdAt'>) => Promise<void>;
  createSchoolYear: (
    id: string,
    label: string,
    startDate?: string,
    endDate?: string,
    copyFromSyId?: string
  ) => Promise<void>;
  archiveSchoolYear: (id: string) => Promise<void>;
  dimensions: SbmDimension[];
  indicators: SbmIndicator[];
  indicatorRecords: IndicatorYearRecord[];
  requiredMovItems: RequiredMovItem[];
  movRecords: MovRecord[];
  comments: ThreadComment[];
  reviews: ReviewLog[];
  schoolProfile: SchoolProfile;
  schoolReportCards: SchoolReportCard[];
  announcements: SystemAnnouncement[];
  notifications: AppNotification[];
  systemSettings: SystemSettings;
  auditLogs: AuditLog[];
  progressStats: ProgressStats;
  updateIndicatorAssessment: (
    indicatorNumber: number,
    updates: Partial<IndicatorYearRecord>,
    reason?: string
  ) => Promise<void>;
  uploadMov: (
    data: Omit<
      MovRecord,
      | 'id'
      | 'createdAt'
      | 'updatedAt'
      | 'version'
      | 'isArchived'
      | 'isLocked'
      | 'sanitizedFilename'
      | 'uploaderId'
      | 'uploaderName'
      | 'uploaderEmail'
      | 'submissionStatus'
    > & {
      sanitizedFilename?: string;
      uploaderId?: string;
      uploaderName?: string;
      uploaderEmail?: string;
      submissionStatus?: SubmissionStatus;
    }
  ) => Promise<MovRecord>;
  replaceMov: (movId: string, fileData: any, changeReason: string) => Promise<void>;
  submitMovForReview: (movId: string) => Promise<void>;
  reviewMov: (
    movId: string,
    action: 'verified' | 'returned' | 'approved' | 'rejected',
    commentsText: string,
    checklist?: any
  ) => Promise<void>;
  verifyMov: (
    movId: string,
    checklist?: any,
    ratings?: { relevance?: number; completeness?: number; authenticity?: number },
    commentsText?: string
  ) => Promise<void>;
  requestMovRevision: (movId: string, reasonText: string) => Promise<void>;
  approveMov: (movId: string, remarks?: string) => Promise<void>;
  unlockMov: (movId: string, reason: string) => Promise<void>;
  archiveMov: (movId: string) => Promise<void>;
  restoreMov: (movId: string) => Promise<void>;
  deleteMov: (movId: string) => Promise<void>;
  addComment: (
    recordType: 'indicator' | 'mov',
    recordId: string,
    indicatorNumber: number,
    text: string,
    isInternal: boolean
  ) => Promise<void>;
  updateSchoolProfile: (updates: Partial<SchoolProfile>) => Promise<void>;
  saveSchoolReportCard: (src: SchoolReportCard) => Promise<void>;
  toggleSrcPublish: (srcId: string, isPublished: boolean) => Promise<void>;
  saveAnnouncement: (ann: SystemAnnouncement) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;
  updateSystemSettings: (settings: Partial<SystemSettings>) => Promise<void>;
  resetToOfficialSeedData: () => void;
  markNotificationRead: (id: string) => void;
}

const SbmDataContext = createContext<SbmDataContextType | undefined>(undefined);

export const SbmDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userProfile, role } = useAuth();

  // 1. School Years
  const [schoolYears, setSchoolYears] = useState<SchoolYear[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SCHOOL_YEARS);
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_SCHOOL_YEARS;
    } catch {
      return INITIAL_SCHOOL_YEARS;
    }
  });

  const [selectedSchoolYearId, setSelectedSchoolYearId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SELECTED_SY_ID);
      return saved || 'SY-2024-2025';
    } catch {
      return 'SY-2024-2025';
    }
  });

  const currentSchoolYear = useMemo(() => {
    const list = Array.isArray(schoolYears) && schoolYears.length > 0 ? schoolYears : INITIAL_SCHOOL_YEARS;
    return list.find((sy) => sy.id === selectedSchoolYearId) || list[0] || INITIAL_SCHOOL_YEARS[0];
  }, [schoolYears, selectedSchoolYearId]);

  // 2. Indicators & Indicator Records
  const dimensions = OFFICIAL_DIMENSIONS || [];
  const indicators = OFFICIAL_INDICATORS || [];

  const [indicatorRecords, setIndicatorRecords] = useState<IndicatorYearRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INDICATOR_RECORDS);
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : generateIndicatorYearRecords('SY-2024-2025');
    } catch {
      return generateIndicatorYearRecords('SY-2024-2025');
    }
  });

  const [requiredMovItems, setRequiredMovItems] = useState<RequiredMovItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REQUIRED_MOVS);
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : generateRequiredMovItems('SY-2024-2025');
    } catch {
      return generateRequiredMovItems('SY-2024-2025');
    }
  });

  const [movRecords, setMovRecords] = useState<MovRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MOV_RECORDS);
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : generateSampleMovRecords('SY-2024-2025');
    } catch {
      return generateSampleMovRecords('SY-2024-2025');
    }
  });

  const [comments, setComments] = useState<ThreadComment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMMENTS);
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [reviews, setReviews] = useState<ReviewLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SCHOOL_PROFILE);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_SCHOOL_PROFILE,
          ...parsed,
          schoolName: parsed.schoolName || parsed.name || INITIAL_SCHOOL_PROFILE.schoolName,
          name: parsed.name || parsed.schoolName || INITIAL_SCHOOL_PROFILE.name,
          schoolHead: parsed.schoolHead || parsed.principalName || INITIAL_SCHOOL_PROFILE.schoolHead,
          principalName: parsed.principalName || parsed.schoolHead || INITIAL_SCHOOL_PROFILE.principalName,
          depEdVision: parsed.depEdVision || parsed.vision || INITIAL_SCHOOL_PROFILE.depEdVision,
          vision: parsed.vision || parsed.depEdVision || INITIAL_SCHOOL_PROFILE.vision,
          depEdMission: parsed.depEdMission || parsed.mission || INITIAL_SCHOOL_PROFILE.depEdMission,
          mission: parsed.mission || parsed.depEdMission || INITIAL_SCHOOL_PROFILE.mission,
          depEdCoreValues: parsed.depEdCoreValues || parsed.coreValues || INITIAL_SCHOOL_PROFILE.depEdCoreValues,
          coreValues: parsed.coreValues || parsed.depEdCoreValues || INITIAL_SCHOOL_PROFILE.coreValues,
          depEdMandate: parsed.depEdMandate || parsed.mandate || INITIAL_SCHOOL_PROFILE.depEdMandate,
          mandate: parsed.mandate || parsed.depEdMandate || INITIAL_SCHOOL_PROFILE.mandate,
          curricularOfferings: parsed.curricularOfferings || INITIAL_SCHOOL_PROFILE.curricularOfferings,
          totalLearners: parsed.totalLearners ?? parsed.enrollmentSummary?.total ?? INITIAL_SCHOOL_PROFILE.totalLearners,
          teachingPersonnel: parsed.teachingPersonnel ?? parsed.personnelSummary?.teachingPersonnel ?? INITIAL_SCHOOL_PROFILE.teachingPersonnel,
          nonTeachingPersonnel: parsed.nonTeachingPersonnel ?? parsed.personnelSummary?.nonTeachingPersonnel ?? INITIAL_SCHOOL_PROFILE.nonTeachingPersonnel,
          classrooms: parsed.classrooms ?? parsed.facilitiesSummary?.instructionalClassrooms ?? INITIAL_SCHOOL_PROFILE.classrooms,
          scienceLaboratories: parsed.scienceLaboratories ?? parsed.facilitiesSummary?.scienceLaboratories ?? INITIAL_SCHOOL_PROFILE.scienceLaboratories,
          computerLaboratories: parsed.computerLaboratories ?? parsed.facilitiesSummary?.computerLaboratories ?? INITIAL_SCHOOL_PROFILE.computerLaboratories,
          telephone: parsed.telephone || parsed.contactNumber || INITIAL_SCHOOL_PROFILE.telephone,
          sbmCoordinator: parsed.sbmCoordinator || INITIAL_SCHOOL_PROFILE.sbmCoordinator,
          sbmCoordinatorTitle: parsed.sbmCoordinatorTitle || INITIAL_SCHOOL_PROFILE.sbmCoordinatorTitle,
          schoolHeadTitle: parsed.schoolHeadTitle !== undefined ? parsed.schoolHeadTitle : INITIAL_SCHOOL_PROFILE.schoolHeadTitle,
          assistantPrincipal: parsed.assistantPrincipal !== undefined ? parsed.assistantPrincipal : INITIAL_SCHOOL_PROFILE.assistantPrincipal,
          assistantPrincipalTitle: parsed.assistantPrincipalTitle !== undefined ? parsed.assistantPrincipalTitle : INITIAL_SCHOOL_PROFILE.assistantPrincipalTitle,
          divisionValidator: parsed.divisionValidator !== undefined ? parsed.divisionValidator : INITIAL_SCHOOL_PROFILE.divisionValidator,
          divisionValidatorTitle: parsed.divisionValidatorTitle !== undefined ? parsed.divisionValidatorTitle : INITIAL_SCHOOL_PROFILE.divisionValidatorTitle,
          divisionSuperintendent: parsed.divisionSuperintendent !== undefined ? parsed.divisionSuperintendent : INITIAL_SCHOOL_PROFILE.divisionSuperintendent,
          divisionSuperintendentTitle: parsed.divisionSuperintendentTitle !== undefined ? parsed.divisionSuperintendentTitle : INITIAL_SCHOOL_PROFILE.divisionSuperintendentTitle,
          dimensionCoordinators: parsed.dimensionCoordinators !== undefined
            ? parsed.dimensionCoordinators
            : INITIAL_SCHOOL_PROFILE.dimensionCoordinators,
          customSignatories: parsed.customSignatories !== undefined ? parsed.customSignatories : (INITIAL_SCHOOL_PROFILE.customSignatories || []),
          dashboardBanner: parsed.dashboardBanner !== undefined ? parsed.dashboardBanner : INITIAL_SCHOOL_PROFILE.dashboardBanner,
          enrollmentSummary: {
            ...INITIAL_SCHOOL_PROFILE.enrollmentSummary,
            ...(parsed.enrollmentSummary || {})
          },
          personnelSummary: {
            ...INITIAL_SCHOOL_PROFILE.personnelSummary,
            ...(parsed.personnelSummary || {})
          },
          facilitiesSummary: {
            ...INITIAL_SCHOOL_PROFILE.facilitiesSummary,
            ...(parsed.facilitiesSummary || {})
          },
          programs: {
            ...INITIAL_SCHOOL_PROFILE.programs,
            ...(parsed.programs || {})
          }
        };
      }
    } catch {
      // ignore JSON parse error and fallback
    }
    return INITIAL_SCHOOL_PROFILE;
  });

  const [schoolReportCards, setSchoolReportCards] = useState<SchoolReportCard[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SRC_LIST);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((src: Partial<SchoolReportCard>, idx: number) => {
            const fallback = INITIAL_SCHOOL_REPORT_CARDS[idx] || INITIAL_SCHOOL_REPORT_CARDS[0];
            const enrollmentVal = src.enrollmentTotal ?? src.enrollment ?? fallback.enrollmentTotal ?? 5392;
            const isPub = src.isPublished ?? (src.status === 'published');
            return {
              ...fallback,
              ...src,
              title: src.title || src.schoolYearLabel || fallback.title || `School Report Card ${src.schoolYearId}`,
              status: isPub ? 'published' : 'draft',
              isPublished: isPub,
              enrollmentTotal: enrollmentVal,
              enrollment: enrollmentVal,
              natProficiencyAverage: src.natProficiencyAverage ?? src.natRating ?? fallback.natProficiencyAverage ?? 75,
              natRating: src.natRating ?? src.natProficiencyAverage ?? fallback.natRating ?? 75,
              summary: src.summary || fallback.summary || 'Quirino High School official transparency document.',
              accomplishments: src.accomplishments || src.keyAccomplishments || fallback.accomplishments || [],
              keyAccomplishments: src.keyAccomplishments || src.accomplishments || fallback.keyAccomplishments || [],
              priorityAreas: src.priorityAreas || src.priorityImprovementAreas || fallback.priorityAreas || [],
              priorityImprovementAreas: src.priorityImprovementAreas || src.priorityAreas || fallback.priorityImprovementAreas || [],
              publishedDate: src.publishedDate || src.publishedAt || fallback.publishedDate || new Date().toISOString(),
              publishedAt: src.publishedAt || src.publishedDate || fallback.publishedAt || new Date().toISOString()
            } as SchoolReportCard;
          });
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_SCHOOL_REPORT_CARDS;
  });

  const [announcements, setAnnouncements] = useState<SystemAnnouncement[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) && parsed.length > 0
        ? parsed
        : [
            {
              id: 'notif-welcome',
              recipientUserId: 'all',
              title: 'Welcome to QHS SBM PORTAL',
              message: 'Aligned with DepEd Order No. 007, s. 2024 (6 Dimensions, 42 Indicators).',
              link: '/sbm',
              type: 'system',
              isRead: false,
              createdAt: new Date().toISOString()
            }
          ];
    } catch {
      return [
        {
          id: 'notif-welcome',
          recipientUserId: 'all',
          title: 'Welcome to QHS SBM PORTAL',
          message: 'Aligned with DepEd Order No. 007, s. 2024 (6 Dimensions, 42 Indicators).',
          link: '/sbm',
          type: 'system',
          isRead: false,
          createdAt: new Date().toISOString()
        }
      ];
    }
  });

  const [systemSettings, setSystemSettings] = useState<SystemSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SYSTEM_SETTINGS);
      return saved ? JSON.parse(saved) : DEFAULT_SYSTEM_SETTINGS;
    } catch {
      return DEFAULT_SYSTEM_SETTINGS;
    }
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const logs = getLocalAuditLogs();
      return Array.isArray(logs) ? logs : [];
    } catch {
      return [];
    }
  });

  const logAuditEvent = async (
    action: string,
    affectedRecordType: string,
    affectedRecordId: string,
    details?: { previousValue?: string; newValue?: string; reason?: string }
  ) => {
    try {
      const newLog = await recordAuditEvent(userProfile, action, affectedRecordType, affectedRecordId, details);
      setAuditLogs((prev) => [newLog, ...(prev || [])]);
    } catch (e) {
      console.warn('Failed to record audit event:', e);
    }
  };

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SCHOOL_YEARS, JSON.stringify(schoolYears));
  }, [schoolYears]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SELECTED_SY_ID, selectedSchoolYearId);
  }, [selectedSchoolYearId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INDICATOR_RECORDS, JSON.stringify(indicatorRecords));
  }, [indicatorRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REQUIRED_MOVS, JSON.stringify(requiredMovItems));
  }, [requiredMovItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MOV_RECORDS, JSON.stringify(movRecords));
  }, [movRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SCHOOL_PROFILE, JSON.stringify(schoolProfile));
  }, [schoolProfile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SRC_LIST, JSON.stringify(schoolReportCards));
  }, [schoolReportCards]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SYSTEM_SETTINGS, JSON.stringify(systemSettings));
  }, [systemSettings]);

  // When changing school year, make sure records exist for it
  const selectSchoolYear = (id: string) => {
    setSelectedSchoolYearId(id);
    const hasRecords = indicatorRecords.some((r) => r.schoolYearId === id);
    if (!hasRecords) {
      const newRecs = generateIndicatorYearRecords(id);
      const newReqs = generateRequiredMovItems(id);
      setIndicatorRecords((prev) => [...prev, ...newRecs]);
      setRequiredMovItems((prev) => [...prev, ...newReqs]);
    }
  };

  const addSchoolYear = async (data: Omit<SchoolYear, 'createdAt'>) => {
    const newYear: SchoolYear = {
      ...data,
      createdAt: new Date().toISOString()
    };
    setSchoolYears((prev) => [...(prev || []), newYear]);
    // Generate records for new year
    const newRecs = generateIndicatorYearRecords(newYear.id);
    const newReqs = generateRequiredMovItems(newYear.id);
    setIndicatorRecords((prev) => [...(prev || []), ...newRecs]);
    setRequiredMovItems((prev) => [...(prev || []), ...newReqs]);

    await logAuditEvent('CREATE_SCHOOL_YEAR', 'SchoolYear', newYear.id, {
      newValue: newYear.label
    });
  };

  const createSchoolYear = async (
    id: string,
    label: string,
    startDate: string = new Date().toISOString().split('T')[0],
    endDate: string = new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
    copyFromSyId?: string
  ) => {
    const newYear: SchoolYear = {
      id,
      label,
      startDate,
      endDate,
      isCurrent: false,
      isArchived: false,
      createdAt: new Date().toISOString()
    };
    setSchoolYears((prev) => [...(prev || []), newYear]);
    const newRecs = generateIndicatorYearRecords(id);
    const newReqs = generateRequiredMovItems(id);
    setIndicatorRecords((prev) => [...(prev || []), ...newRecs]);
    setRequiredMovItems((prev) => [...(prev || []), ...newReqs]);

    await logAuditEvent('CREATE_SCHOOL_YEAR', 'SchoolYear', id, {
      newValue: label,
      reason: copyFromSyId ? `Initialized workspace copied from ${copyFromSyId}` : 'Initialized fresh workspace'
    });
  };

  const archiveSchoolYear = async (id: string) => {
    setSchoolYears((prev) =>
      (prev || []).map((sy) => (sy.id === id ? { ...sy, isArchived: true, isCurrent: false } : sy))
    );
    await logAuditEvent('ARCHIVE_SCHOOL_YEAR', 'SchoolYear', id);
  };

  // Progress Calculations (Active School Year)
  const currentRecords = useMemo(() => {
    const recs = Array.isArray(indicatorRecords) ? indicatorRecords : [];
    const syId = currentSchoolYear?.id || 'SY-2024-2025';
    return recs.filter((r) => r && r.schoolYearId === syId);
  }, [indicatorRecords, currentSchoolYear?.id]);

  const currentReqMovs = useMemo(() => {
    const reqs = Array.isArray(requiredMovItems) ? requiredMovItems : [];
    const syId = currentSchoolYear?.id || 'SY-2024-2025';
    return reqs.filter((i) => i && i.schoolYearId === syId);
  }, [requiredMovItems, currentSchoolYear?.id]);

  const currentMovs = useMemo(() => {
    const movs = Array.isArray(movRecords) ? movRecords : [];
    const syId = currentSchoolYear?.id || 'SY-2024-2025';
    return movs.filter((m) => m && m.schoolYearId === syId && !m.isArchived);
  }, [movRecords, currentSchoolYear?.id]);

  const progressStats = useMemo<ProgressStats>(() => {
    const totalIndicators = 42;
    const applicable = (currentRecords || []).filter((r) => r && r.isApplicable !== false);
    const applicableCount = applicable.length;
    const nonApplicableCount = totalIndicators - applicableCount;

    const totalReq = (currentReqMovs || []).length;
    const uploadedReq = (currentReqMovs || []).filter((i) => i && i.status === 'uploaded').length;
    const verifiedReq = (currentReqMovs || []).filter((i) => i && i.status === 'verified').length;
    const approvedReq = (currentReqMovs || []).filter((i) => i && i.status === 'approved').length;
    const missingReq = (currentReqMovs || []).filter((i) => i && i.status === 'missing').length;

    const overallEvidencePct = totalReq > 0 ? Math.round(((verifiedReq + approvedReq) / totalReq) * 100) : 0;

    const allMovs = Array.isArray(movRecords) ? movRecords : [];
    const syId = currentSchoolYear?.id || 'SY-2024-2025';

    const statusCounts = {
      draft: (currentMovs || []).filter((m) => m && m.submissionStatus === 'draft').length,
      submitted: (currentMovs || []).filter((m) => m && m.submissionStatus === 'submitted').length,
      under_review: (currentMovs || []).filter((m) => m && m.submissionStatus === 'under_review').length,
      needs_revision: (currentMovs || []).filter((m) => m && m.submissionStatus === 'needs_revision').length,
      resubmitted: (currentMovs || []).filter((m) => m && m.submissionStatus === 'resubmitted').length,
      verified: (currentMovs || []).filter((m) => m && m.submissionStatus === 'verified').length,
      approved: (currentMovs || []).filter((m) => m && m.submissionStatus === 'approved').length,
      archived: allMovs.filter((m) => m && m.schoolYearId === syId && m.isArchived).length
    };

    const degreeDistribution: Record<DegreeOfManifestation, number> = {
      'Not Yet Manifested': 0,
      'Rarely Manifested': 0,
      'Frequently Manifested': 0,
      'Always Manifested': 0
    };

    (currentRecords || []).forEach((r) => {
      if (r && r.degreeOfManifestation && r.isApplicable !== false) {
        degreeDistribution[r.degreeOfManifestation] = (degreeDistribution[r.degreeOfManifestation] || 0) + 1;
      }
    });

    let completeInds = 0;
    let missingInds = 0;

    const allDims = Array.isArray(dimensions) ? dimensions : OFFICIAL_DIMENSIONS;
    const allInds = Array.isArray(indicators) ? indicators : OFFICIAL_INDICATORS;

    const dimensionProgress = allDims.map((dim) => {
      const dimIndicators = allInds.filter((i) => i && i.dimensionId === dim.id);
      const dimRecords = (currentRecords || []).filter((r) => r && r.dimensionId === dim.id);
      const applicableDimRecs = dimRecords.filter((r) => r && r.isApplicable !== false);
      const dimReqMovs = (currentReqMovs || []).filter((r) => r && r.dimensionId === dim.id);

      const dimMissingMovs = dimReqMovs.filter((i) => i && i.status === 'missing').length;
      const dimVerifiedOrApproved = dimReqMovs.filter(
        (i) => i && (i.status === 'verified' || i.status === 'approved')
      ).length;

      const dimCompletionPct =
        dimReqMovs.length > 0 ? Math.round((dimVerifiedOrApproved / dimReqMovs.length) * 100) : 0;

      const dimDegrees: Record<DegreeOfManifestation, number> = {
        'Not Yet Manifested': 0,
        'Rarely Manifested': 0,
        'Frequently Manifested': 0,
        'Always Manifested': 0
      };

      dimRecords.forEach((r) => {
        if (r && r.degreeOfManifestation && r.isApplicable !== false) {
          dimDegrees[r.degreeOfManifestation] = (dimDegrees[r.degreeOfManifestation] || 0) + 1;
        }
      });

      // Indicator completeness
      dimIndicators.forEach((ind) => {
        const indReqs = dimReqMovs.filter((r) => r && r.indicatorNumber === ind.id);
        const indMissing = indReqs.filter((r) => r && r.status === 'missing').length;
        if (indReqs.length > 0 && indMissing === 0) {
          completeInds++;
        } else {
          missingInds++;
        }
      });

      return {
        dimensionId: dim.id,
        name: dim.name,
        totalIndicators: dimIndicators.length,
        applicableIndicators: applicableDimRecs.length,
        completedIndicators: dimRecords.filter((r) => r && r.reviewStatus === 'approved').length,
        missingMovsCount: dimMissingMovs,
        completionPercentage: dimCompletionPct,
        degrees: dimDegrees
      };
    });

    return {
      totalIndicators,
      applicableIndicators: applicableCount,
      nonApplicableIndicators: nonApplicableCount,
      completeEvidenceIndicators: completeInds,
      missingEvidenceIndicators: missingInds,
      totalRequiredMovs: totalReq,
      uploadedRequiredMovs: uploadedReq,
      verifiedRequiredMovs: verifiedReq,
      approvedRequiredMovs: approvedReq,
      missingRequiredMovs: missingReq,
      overallEvidenceCompletionPct: overallEvidencePct,
      statusCounts,
      degreeDistribution,
      dimensionProgress
    };
  }, [currentRecords, currentReqMovs, currentMovs, dimensions, indicators, movRecords, currentSchoolYear?.id]);

  const updateIndicatorAssessment = async (
    indicatorNumber: number,
    updates: Partial<IndicatorYearRecord>,
    reason?: string
  ) => {
    const recId = `${currentSchoolYear.id}_ind_${indicatorNumber}`;
    let updatedRecord: IndicatorYearRecord | null = null;

    setIndicatorRecords((prev) => {
      const exists = prev.some(
        (r) => r.schoolYearId === currentSchoolYear.id && r.indicatorNumber === indicatorNumber
      );
      let nextList: IndicatorYearRecord[];

      if (exists) {
        nextList = prev.map((r) => {
          if (r.schoolYearId === currentSchoolYear.id && r.indicatorNumber === indicatorNumber) {
            const merged = {
              ...r,
              ...updates,
              updatedAt: new Date().toISOString()
            };
            updatedRecord = merged;
            return merged;
          }
          return r;
        });
      } else {
        const ind = indicators.find((i) => i.id === indicatorNumber);
        const newRecord: IndicatorYearRecord = {
          id: recId,
          schoolYearId: currentSchoolYear.id,
          indicatorNumber,
          dimensionId: ind?.dimensionId || 1,
          isApplicable: updates.isApplicable !== undefined ? updates.isApplicable : true,
          applicabilityJustification: updates.applicabilityJustification || '',
          degreeOfManifestation: updates.degreeOfManifestation || 'Frequently Manifested',
          evidenceBasis: updates.evidenceBasis || '',
          remarks: updates.remarks || '',
          improvementAction: updates.improvementAction || '',
          personResponsible: updates.personResponsible || ind?.suggestedLeadOffice || '',
          targetDate: updates.targetDate || '2025-05-15',
          reviewStatus: updates.reviewStatus || 'under_review',
          ...updates,
          updatedAt: new Date().toISOString()
        };
        updatedRecord = newRecord;
        nextList = [...prev, newRecord];
      }

      try {
        localStorage.setItem(STORAGE_KEYS.INDICATOR_RECORDS, JSON.stringify(nextList));
      } catch (err) {
        console.warn('LocalStorage indicator records write error:', err);
      }

      return nextList;
    });

    // Also persist to Firestore if available
    if (updatedRecord) {
      try {
        await setDoc(doc(db, 'indicatorRecords', recId), updatedRecord, { merge: true });
      } catch (e) {
        // Firestore offline or rules fallback
        console.info('Indicator record saved to local cache:', e);
      }
    }

    try {
      await recordAuditEvent(
        userProfile,
        'UPDATE_INDICATOR_ASSESSMENT',
        'IndicatorYearRecord',
        recId,
        {
          newValue: JSON.stringify(updates),
          reason
        }
      );
    } catch (auditErr) {
      console.warn('Audit record warning:', auditErr);
    }
  };

  const uploadMov = async (
    data: any
  ): Promise<MovRecord> => {
    const newId = `mov-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newRecord: MovRecord = {
      sanitizedFilename: data.originalFilename ? data.originalFilename.replace(/[^a-zA-Z0-9._-]/g, '_') : 'document.pdf',
      uploaderId: userProfile?.id || 'anonymous',
      uploaderName: userProfile?.displayName || 'DepEd Contributor',
      uploaderEmail: userProfile?.email || 'contributor@depedqc.ph',
      submissionStatus: 'submitted',
      ...data,
      id: newId,
      version: 1,
      isArchived: false,
      isLocked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setMovRecords((prev) => [newRecord, ...prev]);

    // Update required MOV status if matched
    if (data.requiredMovItemId) {
      setRequiredMovItems((prev) =>
        prev.map((item) =>
          item.id === data.requiredMovItemId
            ? { ...item, status: 'uploaded', matchedMovId: newId }
            : item
        )
      );
    }

    await recordAuditEvent(
      userProfile,
      'UPLOAD_MOV',
      'MovRecord',
      newId,
      { newValue: newRecord.title }
    );

    return newRecord;
  };

  const replaceMov = async (movId: string, fileData: any, changeReason: string) => {
    setMovRecords((prev) =>
      prev.map((m) => {
        if (m.id === movId) {
          return {
            ...m,
            ...fileData,
            version: m.version + 1,
            submissionStatus: 'resubmitted',
            updatedAt: new Date().toISOString()
          };
        }
        return m;
      })
    );

    await recordAuditEvent(
      userProfile,
      'REPLACE_MOV_VERSION',
      'MovRecord',
      movId,
      { reason: changeReason }
    );
  };

  const submitMovForReview = async (movId: string) => {
    setMovRecords((prev) =>
      prev.map((m) =>
        m.id === movId
          ? {
              ...m,
              submissionStatus: 'submitted',
              submittedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          : m
      )
    );

    await recordAuditEvent(userProfile, 'SUBMIT_MOV', 'MovRecord', movId);
  };

  const reviewMov = async (
    movId: string,
    action: 'verified' | 'returned' | 'approved' | 'rejected',
    commentsText: string,
    checklist?: any
  ) => {
    const targetMov = movRecords.find((m) => m.id === movId);
    const newStatus = action === 'verified' ? 'verified' : action === 'returned' ? 'needs_revision' : action === 'approved' ? 'approved' : 'draft';

    setMovRecords((prev) =>
      prev.map((m) => {
        if (m.id === movId) {
          return {
            ...m,
            submissionStatus: newStatus,
            reviewerComments: commentsText,
            verifiedAt: action === 'verified' ? new Date().toISOString() : m.verifiedAt,
            verifiedBy: action === 'verified' ? userProfile?.displayName : m.verifiedBy,
            returnedAt: action === 'returned' ? new Date().toISOString() : undefined,
            returnedBy: action === 'returned' ? userProfile?.displayName : undefined,
            returnReason: action === 'returned' ? commentsText : undefined,
            approvedAt: action === 'approved' ? new Date().toISOString() : m.approvedAt,
            approvedBy: action === 'approved' ? userProfile?.displayName : m.approvedBy,
            isLocked: action === 'approved',
            updatedAt: new Date().toISOString()
          };
        }
        return m;
      })
    );

    // Update matching required MOV item status
    if (targetMov?.requiredMovItemId) {
      setRequiredMovItems((prev) =>
        prev.map((req) =>
          req.id === targetMov.requiredMovItemId
            ? { ...req, status: action === 'verified' ? 'verified' : action === 'approved' ? 'approved' : 'uploaded' }
            : req
        )
      );
    }

    const reviewItem: ReviewLog = {
      id: `rev-${Date.now()}`,
      movId,
      indicatorNumber: targetMov?.indicatorNumber || 0,
      schoolYearId: targetMov?.schoolYearId || currentSchoolYear.id,
      reviewerId: userProfile?.id || '',
      reviewerName: userProfile?.displayName || 'Reviewer',
      reviewerRole: role,
      action,
      comments: commentsText,
      checklist,
      createdAt: new Date().toISOString()
    };

    setReviews((prev) => [reviewItem, ...prev]);

    await recordAuditEvent(userProfile, `REVIEW_MOV_${action.toUpperCase()}`, 'MovRecord', movId, {
      reason: commentsText
    });
  };

  const verifyMov = async (
    movId: string,
    checklist?: any,
    ratings?: { relevance?: number; completeness?: number; authenticity?: number },
    commentsText?: string
  ) => {
    setMovRecords((prev) =>
      prev.map((m) => {
        if (m.id === movId) {
          return {
            ...m,
            relevanceRating: ratings?.relevance ?? m.relevanceRating,
            completenessRating: ratings?.completeness ?? m.completenessRating,
            authenticityRating: ratings?.authenticity ?? m.authenticityRating
          };
        }
        return m;
      })
    );
    await reviewMov(movId, 'verified', commentsText || 'Verified by Dimension Evaluator', checklist);
  };

  const requestMovRevision = async (movId: string, reasonText: string) => {
    await reviewMov(movId, 'returned', reasonText);
  };

  const approveMov = async (movId: string, remarks?: string) => {
    const targetMov = movRecords.find((m) => m.id === movId);
    setMovRecords((prev) =>
      prev.map((m) =>
        m.id === movId
          ? {
              ...m,
              submissionStatus: 'approved',
              isLocked: true,
              approvedAt: new Date().toISOString(),
              approvedBy: userProfile?.displayName || 'School Head',
              reviewerComments: remarks || m.reviewerComments,
              updatedAt: new Date().toISOString()
            }
          : m
      )
    );

    if (targetMov?.requiredMovItemId) {
      setRequiredMovItems((prev) =>
        prev.map((req) => (req.id === targetMov.requiredMovItemId ? { ...req, status: 'approved' } : req))
      );
    }

    await recordAuditEvent(userProfile, 'APPROVE_MOV', 'MovRecord', movId, {
      reason: remarks
    });
  };

  const unlockMov = async (movId: string, reason: string) => {
    setMovRecords((prev) =>
      prev.map((m) =>
        m.id === movId
          ? {
              ...m,
              isLocked: false,
              submissionStatus: 'under_review',
              updatedAt: new Date().toISOString()
            }
          : m
      )
    );

    await recordAuditEvent(userProfile, 'UNLOCK_APPROVED_MOV', 'MovRecord', movId, { reason });
  };

  const archiveMov = async (movId: string) => {
    setMovRecords((prev) =>
      prev.map((m) => (m.id === movId ? { ...m, isArchived: true, updatedAt: new Date().toISOString() } : m))
    );
    await recordAuditEvent(userProfile, 'ARCHIVE_MOV', 'MovRecord', movId);
  };

  const restoreMov = async (movId: string) => {
    setMovRecords((prev) =>
      prev.map((m) => (m.id === movId ? { ...m, isArchived: false, updatedAt: new Date().toISOString() } : m))
    );
    await recordAuditEvent(userProfile, 'RESTORE_MOV', 'MovRecord', movId);
  };

  const deleteMov = async (movId: string) => {
    const targetMov = movRecords.find((m) => m.id === movId);
    setMovRecords((prev) => prev.filter((m) => m.id !== movId));

    if (targetMov?.requiredMovItemId) {
      const otherMovsForReq = movRecords.filter(
        (m) => m.id !== movId && m.requiredMovItemId === targetMov.requiredMovItemId && !m.isArchived
      );
      if (otherMovsForReq.length === 0) {
        setRequiredMovItems((prev) =>
          prev.map((req) =>
            req.id === targetMov.requiredMovItemId ? { ...req, status: 'missing' } : req
          )
        );
      }
    }

    await recordAuditEvent(userProfile, 'DELETE_MOV', 'MovRecord', movId, {
      previousValue: targetMov?.title,
      reason: `Deleted MOV file: ${targetMov?.originalFilename || movId}`
    });
  };

  const addComment = async (
    recordType: 'indicator' | 'mov',
    recordId: string,
    indicatorNumber: number,
    text: string,
    isInternal: boolean
  ) => {
    const newComment: ThreadComment = {
      id: `comm-${Date.now()}`,
      recordType,
      recordId,
      indicatorNumber,
      authorId: userProfile?.id || '',
      authorName: userProfile?.displayName || 'Educator',
      authorRole: role,
      text,
      isInternal,
      createdAt: new Date().toISOString()
    };
    setComments((prev) => [newComment, ...prev]);
    await recordAuditEvent(userProfile, 'ADD_THREAD_COMMENT', recordType === 'mov' ? 'MovRecord' : 'IndicatorYearRecord', recordId, {
      newValue: text
    });
  };

  const updateSchoolProfile = async (updates: Partial<SchoolProfile>) => {
    setSchoolProfile((prev) => ({
      ...prev,
      ...updates,
      lastUpdated: new Date().toISOString()
    }));
    await recordAuditEvent(userProfile, 'UPDATE_SCHOOL_PROFILE', 'SchoolProfile', schoolProfile.id);
  };

  const saveSchoolReportCard = async (src: SchoolReportCard) => {
    setSchoolReportCards((prev) => {
      const idx = prev.findIndex((s) => s.id === src.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...src, updatedAt: new Date().toISOString() };
        return copy;
      }
      return [...prev, { ...src, updatedAt: new Date().toISOString() }];
    });
    await recordAuditEvent(userProfile, 'SAVE_SCHOOL_REPORT_CARD', 'SchoolReportCard', src.id);
  };

  const toggleSrcPublish = async (srcId: string, isPublished: boolean) => {
    setSchoolReportCards((prev) =>
      prev.map((s) =>
        s.id === srcId
          ? {
              ...s,
              status: isPublished ? 'published' : 'draft',
              isPublished: isPublished,
              publishedAt: isPublished ? (s.publishedAt || new Date().toISOString()) : s.publishedAt,
              publishedDate: isPublished ? (s.publishedDate || new Date().toISOString()) : s.publishedDate,
              updatedAt: new Date().toISOString()
            }
          : s
      )
    );
    await recordAuditEvent(userProfile, isPublished ? 'PUBLISH_SRC' : 'UNPUBLISH_SRC', 'SchoolReportCard', srcId);
  };

  const saveAnnouncement = async (ann: SystemAnnouncement) => {
    setAnnouncements((prev) => {
      const idx = prev.findIndex((a) => a.id === ann.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = ann;
        return copy;
      }
      return [ann, ...prev];
    });
    await recordAuditEvent(userProfile, 'SAVE_ANNOUNCEMENT', 'SystemAnnouncement', ann.id);
  };

  const deleteAnnouncement = async (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    await recordAuditEvent(userProfile, 'DELETE_ANNOUNCEMENT', 'SystemAnnouncement', id);
  };

  const updateSystemSettings = async (settings: Partial<SystemSettings>) => {
    setSystemSettings((prev) => ({ ...prev, ...settings }));
    await recordAuditEvent(userProfile, 'UPDATE_SYSTEM_SETTINGS', 'SystemSettings', systemSettings.id);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const resetToOfficialSeedData = () => {
    setSchoolYears(INITIAL_SCHOOL_YEARS);
    setSelectedSchoolYearId('SY-2024-2025');
    setIndicatorRecords(generateIndicatorYearRecords('SY-2024-2025'));
    setRequiredMovItems(generateRequiredMovItems('SY-2024-2025'));
    setMovRecords(generateSampleMovRecords('SY-2024-2025'));
    setSchoolProfile(INITIAL_SCHOOL_PROFILE);
    setSchoolReportCards(INITIAL_SCHOOL_REPORT_CARDS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setSystemSettings(DEFAULT_SYSTEM_SETTINGS);
    logAuditEvent('RESET_TO_OFFICIAL_SEED_DATA', 'System', 'all');
  };

  const contextValue = useMemo<SbmDataContextType>(
    () => ({
      schoolYears,
      currentSchoolYear,
      selectSchoolYear,
      addSchoolYear,
      createSchoolYear,
      archiveSchoolYear,
      dimensions,
      indicators,
      indicatorRecords,
      requiredMovItems,
      movRecords,
      comments,
      reviews,
      schoolProfile,
      schoolReportCards,
      announcements,
      notifications,
      systemSettings,
      auditLogs,
      progressStats,
      updateIndicatorAssessment,
      uploadMov,
      replaceMov,
      submitMovForReview,
      reviewMov,
      verifyMov,
      requestMovRevision,
      approveMov,
      unlockMov,
      archiveMov,
      restoreMov,
      deleteMov,
      addComment,
      updateSchoolProfile,
      saveSchoolReportCard,
      toggleSrcPublish,
      saveAnnouncement,
      deleteAnnouncement,
      updateSystemSettings,
      resetToOfficialSeedData,
      markNotificationRead
    }),
    [
      schoolYears,
      currentSchoolYear,
      indicatorRecords,
      requiredMovItems,
      movRecords,
      comments,
      reviews,
      schoolProfile,
      schoolReportCards,
      announcements,
      notifications,
      systemSettings,
      auditLogs,
      progressStats
    ]
  );

  return <SbmDataContext.Provider value={contextValue}>{children}</SbmDataContext.Provider>;
};

export const useSbmData = () => {
  const context = useContext(SbmDataContext);
  if (!context) {
    throw new Error('useSbmData must be used within a SbmDataProvider');
  }
  return context;
};
