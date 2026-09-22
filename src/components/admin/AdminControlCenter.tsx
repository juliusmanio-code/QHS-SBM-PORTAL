import React, { useState } from 'react';
import {
  Settings,
  Users,
  Shield,
  Calendar,
  Layers,
  FileCheck2,
  Database,
  History,
  Download,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Search,
  UserPlus,
  Edit2,
  Trash2,
  Save,
  X,
  RotateCcw,
  Check,
  AlertCircle,
  Filter,
  School,
  Building,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Compass,
  Heart
} from 'lucide-react';
import { useSbmData } from '../../contexts/SbmDataContext';
import { useAuth } from '../../contexts/AuthContext';
import { UserProfile, UserRole, UserStatus } from '../../types';

export const AdminControlCenter: React.FC = () => {
  const {
    schoolYears,
    currentSchoolYear,
    createSchoolYear,
    auditLogs,
    dimensions,
    indicators,
    requiredMovItems,
    schoolProfile,
    updateSchoolProfile
  } = useSbmData();

  const {
    isSuperAdmin,
    isCoordinator,
    userProfile,
    allUsers,
    updateUserAccount,
    createUserAccount,
    deleteUserAccount,
    resetUsersToDefault
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'users' | 'school_profile' | 'workspaces' | 'checklists' | 'audit'>(
    'users'
  );

  // Search & Filters for Users
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Inline editing state: userId -> boolean
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<{
    displayName: string;
    email: string;
    role: UserRole;
    department: string;
    designation: string;
    dimensionId: string;
    status: UserStatus;
  }>({
    displayName: '',
    email: '',
    role: 'contributor',
    department: '',
    designation: '',
    dimensionId: 'all',
    status: 'approved'
  });

  // Modal for Add New Personnel
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserData, setNewUserData] = useState<{
    displayName: string;
    email: string;
    role: UserRole;
    department: string;
    designation: string;
    dimensionId: string;
    status: UserStatus;
  }>({
    displayName: '',
    email: '',
    role: 'contributor',
    department: 'Academics & Teaching',
    designation: 'Teacher III',
    dimensionId: '1',
    status: 'approved'
  });

  // School Profile & DepEd Settings form state
  const [schoolSettingsForm, setSchoolSettingsForm] = useState({
    schoolName: schoolProfile?.schoolName || schoolProfile?.name || 'Quirino High School',
    schoolId: schoolProfile?.schoolId || '300539',
    principalName: schoolProfile?.principalName || schoolProfile?.schoolHead || 'Dr. Lourdes R. Sese',
    schoolHeadTitle: schoolProfile?.schoolHeadTitle || 'Secondary School Principal IV',
    sbmCoordinator: schoolProfile?.sbmCoordinator || 'Dr. Marilou C. Alcantara',
    sbmCoordinatorTitle: schoolProfile?.sbmCoordinatorTitle || 'Head Teacher VI / SBM Coordinator',
    assistantPrincipal: schoolProfile?.assistantPrincipal || 'Dr. Roberto D. Reyes',
    assistantPrincipalTitle: schoolProfile?.assistantPrincipalTitle || 'Assistant Principal II - Academics',
    divisionValidator: schoolProfile?.divisionValidator || 'Dr. Manuel A. Gomez',
    divisionValidatorTitle: schoolProfile?.divisionValidatorTitle || 'Division SBM Focal Person / EPS',
    divisionSuperintendent: schoolProfile?.divisionSuperintendent || 'Dr. Carleen S. Sedilla, CESO V',
    divisionSuperintendentTitle: schoolProfile?.divisionSuperintendentTitle || 'Schools Division Superintendent',
    dimensionCoordinators: schoolProfile?.dimensionCoordinators || [
      { dimensionId: 1, name: 'Mrs. Cynthia M. Santos', title: 'Head Teacher III - Social Studies' },
      { dimensionId: 2, name: 'Dr. Evelyn P. Ramos', title: 'Master Teacher II - English' },
      { dimensionId: 3, name: 'Mr. Ferdinand G. Cruz', title: 'Administrative Officer IV' },
      { dimensionId: 4, name: 'Mrs. Angela T. Bautista', title: 'Master Teacher I - Science' },
      { dimensionId: 5, name: 'Mr. Rolando S. Mendoza', title: 'Head Teacher II - Mathematics' },
      { dimensionId: 6, name: 'Mrs. Maria Elena K. Dizon', title: 'Master Teacher II - Filipino' },
    ],
    address: schoolProfile?.address || 'Molave St., Project 3, Quezon City, Metro Manila, Philippines',
    division: schoolProfile?.division || 'Division of City Schools - Quezon City',
    region: schoolProfile?.region || 'National Capital Region (NCR)',
    district: schoolProfile?.district || 'District III',
    email: schoolProfile?.email || 'quirinohs.qc@deped.gov.ph',
    telephone: schoolProfile?.telephone || schoolProfile?.contactNumber || '(02) 8921-4320 / (02) 8928-1145',
    totalLearners: Number(schoolProfile?.totalLearners ?? schoolProfile?.enrollmentSummary?.total ?? 5392),
    teachingPersonnel: Number(schoolProfile?.teachingPersonnel ?? schoolProfile?.personnelSummary?.teachingPersonnel ?? 188),
    nonTeachingPersonnel: Number(schoolProfile?.nonTeachingPersonnel ?? schoolProfile?.personnelSummary?.nonTeachingPersonnel ?? 24),
    classrooms: Number(schoolProfile?.classrooms ?? schoolProfile?.facilitiesSummary?.instructionalClassrooms ?? 78),
    scienceLaboratories: Number(schoolProfile?.scienceLaboratories ?? schoolProfile?.facilitiesSummary?.scienceLaboratories ?? 3),
    computerLaboratories: Number(schoolProfile?.computerLaboratories ?? schoolProfile?.facilitiesSummary?.computerLaboratories ?? 4),
    depEdVision: schoolProfile?.depEdVision || schoolProfile?.vision || 'We dream of Filipinos who passionately love their country...',
    depEdMission: schoolProfile?.depEdMission || schoolProfile?.mission || 'To protect and promote the right of every Filipino...',
    depEdMandate: schoolProfile?.depEdMandate || schoolProfile?.mandate || 'The Department of Education was established under Executive Order No. 94...',
    dashboardBannerBadge: schoolProfile?.dashboardBanner?.badgeText ?? 'Official Policy DepEd Order No. 007, s. 2024',
    dashboardBannerTitle: schoolProfile?.dashboardBanner?.title ?? 'SBM Performance & Evidence Tracking — {SY}',
    dashboardBannerDescription: schoolProfile?.dashboardBanner?.description ?? 'Monitor all 6 SBM dimensions, verify Means of Verification (MOVs), and calibrate official degrees of manifestation under DepEd Order No. 007, s. 2024.',
    dashboardBannerShowAnnouncement: schoolProfile?.dashboardBanner?.showAnnouncement ?? false,
    dashboardBannerAnnouncementText: schoolProfile?.dashboardBanner?.announcementText ?? 'Reminder: Please ensure all SBM MOV files and documentary artifacts are submitted on time.',
    dashboardBannerAnnouncementType: (schoolProfile?.dashboardBanner?.announcementType || 'gold') as 'gold' | 'emerald' | 'blue' | 'amber',
    dashboardBannerTheme: (schoolProfile?.dashboardBanner?.theme || 'emerald_gold') as 'emerald_gold' | 'forest_classic' | 'midnight_jade' | 'royal_pine',
    dashboardBannerQuickUpload: schoolProfile?.dashboardBanner?.quickUploadVisible ?? true,
    dashboardBannerQuickAssess: schoolProfile?.dashboardBanner?.quickAssessVisible ?? true,
    dashboardBannerQuickReports: schoolProfile?.dashboardBanner?.quickReportsVisible ?? true,
  });

  const [savingSettings, setSavingSettings] = useState(false);

  // Notification / Feedback toast
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  // New School Year form
  const [newSyLabel, setNewSyLabel] = useState('S.Y. 2027-2028');
  const [newSyStart, setNewSyStart] = useState('2027-08-01');
  const [newSyEnd, setNewSyEnd] = useState('2028-06-30');
  const [copyPreviousWorkspace, setCopyPreviousWorkspace] = useState(true);
  const [creatingSy, setCreatingSy] = useState(false);
  const [sySuccess, setSySuccess] = useState(false);

  const [auditSearch, setAuditSearch] = useState('');

  // Start editing a user row
  const startEditing = (user: UserProfile) => {
    setEditingUserId(user.id);
    setEditFormData({
      displayName: user.displayName,
      email: user.email,
      role: user.role,
      department: user.department || '',
      designation: user.designation || '',
      dimensionId:
        user.assignedDimensions && user.assignedDimensions.length === 1
          ? String(user.assignedDimensions[0])
          : 'all',
      status: user.status
    });
  };

  const cancelEditing = () => {
    setEditingUserId(null);
  };

  const saveEditing = async (userId: string) => {
    try {
      const assignedDimensions =
        editFormData.dimensionId === 'all'
          ? [1, 2, 3, 4, 5, 6]
          : [parseInt(editFormData.dimensionId, 10)];

      await updateUserAccount(
        userId,
        {
          displayName: editFormData.displayName.trim(),
          email: editFormData.email.trim(),
          role: editFormData.role,
          department: editFormData.department.trim(),
          designation: editFormData.designation.trim(),
          assignedDimensions,
          status: editFormData.status
        },
        'Admin updated personnel profile and RBAC assignment'
      );
      setEditingUserId(null);
      showNotification(`Successfully updated personnel details for "${editFormData.displayName}"`);
    } catch (err: any) {
      showNotification('Failed to update personnel: ' + err.message, 'error');
    }
  };

  // Direct quick changes
  const handleQuickRoleChange = async (user: UserProfile, newRole: UserRole) => {
    try {
      await updateUserAccount(
        user.id,
        { role: newRole },
        `Admin modified role to ${newRole}`
      );
      showNotification(`Updated role for ${user.displayName} to ${getRoleDisplay(newRole)}`);
    } catch (err: any) {
      showNotification('Failed to change role: ' + err.message, 'error');
    }
  };

  const handleQuickDimensionChange = async (user: UserProfile, dimValue: string) => {
    try {
      const assignedDimensions =
        dimValue === 'all' ? [1, 2, 3, 4, 5, 6] : [parseInt(dimValue, 10)];
      await updateUserAccount(
        user.id,
        { assignedDimensions },
        `Admin assigned dimension focus to ${dimValue}`
      );
      showNotification(`Updated dimension focus for ${user.displayName}`);
    } catch (err: any) {
      showNotification('Failed to change dimension: ' + err.message, 'error');
    }
  };

  const handleQuickStatusChange = async (user: UserProfile, newStatus: UserStatus) => {
    try {
      await updateUserAccount(
        user.id,
        { status: newStatus },
        `Admin updated status to ${newStatus}`
      );
      showNotification(`Updated status for ${user.displayName} to ${newStatus}`);
    } catch (err: any) {
      showNotification('Failed to change status: ' + err.message, 'error');
    }
  };

  const handleDeleteUser = async (user: UserProfile) => {
    if (confirm(`Are you sure you want to remove personnel record "${user.displayName}"?`)) {
      try {
        await deleteUserAccount(user.id);
        showNotification(`Removed personnel account "${user.displayName}"`);
      } catch (err: any) {
        showNotification('Failed to delete user: ' + err.message, 'error');
      }
    }
  };

  const handleAddPersonnel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserData.displayName.trim() || !newUserData.email.trim()) {
      showNotification('Please provide both full name and email address.', 'error');
      return;
    }

    try {
      const assignedDimensions =
        newUserData.dimensionId === 'all'
          ? [1, 2, 3, 4, 5, 6]
          : [parseInt(newUserData.dimensionId, 10)];

      const newId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      await createUserAccount({
        id: newId,
        displayName: newUserData.displayName.trim(),
        email: newUserData.email.trim(),
        role: newUserData.role,
        department: newUserData.department.trim(),
        designation: newUserData.designation.trim(),
        assignedDimensions,
        status: newUserData.status
      });

      setShowAddModal(false);
      setNewUserData({
        displayName: '',
        email: '',
        role: 'contributor',
        department: 'Academics & Teaching',
        designation: 'Teacher III',
        dimensionId: '1',
        status: 'approved'
      });
      showNotification(`Successfully registered and assigned new personnel "${newUserData.displayName}"`);
    } catch (err: any) {
      showNotification('Failed to add personnel: ' + err.message, 'error');
    }
  };

  const handleResetDefaults = () => {
    if (confirm('Reset personnel list to official default QHS school roster?')) {
      resetUsersToDefault();
      showNotification('Personnel list reset to official default roster.');
    }
  };

  const handleSaveSchoolSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await updateSchoolProfile({
        schoolName: schoolSettingsForm.schoolName,
        name: schoolSettingsForm.schoolName,
        schoolId: schoolSettingsForm.schoolId,
        principalName: schoolSettingsForm.principalName,
        schoolHead: schoolSettingsForm.principalName,
        schoolHeadTitle: schoolSettingsForm.schoolHeadTitle,
        sbmCoordinator: schoolSettingsForm.sbmCoordinator,
        sbmCoordinatorTitle: schoolSettingsForm.sbmCoordinatorTitle,
        assistantPrincipal: schoolSettingsForm.assistantPrincipal,
        assistantPrincipalTitle: schoolSettingsForm.assistantPrincipalTitle,
        divisionValidator: schoolSettingsForm.divisionValidator,
        divisionValidatorTitle: schoolSettingsForm.divisionValidatorTitle,
        divisionSuperintendent: schoolSettingsForm.divisionSuperintendent,
        divisionSuperintendentTitle: schoolSettingsForm.divisionSuperintendentTitle,
        dimensionCoordinators: schoolSettingsForm.dimensionCoordinators,
        address: schoolSettingsForm.address,
        division: schoolSettingsForm.division,
        region: schoolSettingsForm.region,
        district: schoolSettingsForm.district,
        email: schoolSettingsForm.email,
        telephone: schoolSettingsForm.telephone,
        contactNumber: schoolSettingsForm.telephone,
        totalLearners: Number(schoolSettingsForm.totalLearners),
        teachingPersonnel: Number(schoolSettingsForm.teachingPersonnel),
        nonTeachingPersonnel: Number(schoolSettingsForm.nonTeachingPersonnel),
        classrooms: Number(schoolSettingsForm.classrooms),
        scienceLaboratories: Number(schoolSettingsForm.scienceLaboratories),
        computerLaboratories: Number(schoolSettingsForm.computerLaboratories),
        depEdVision: schoolSettingsForm.depEdVision,
        depEdMission: schoolSettingsForm.depEdMission,
        depEdMandate: schoolSettingsForm.depEdMandate,
        dashboardBanner: {
          badgeText: schoolSettingsForm.dashboardBannerBadge,
          title: schoolSettingsForm.dashboardBannerTitle,
          description: schoolSettingsForm.dashboardBannerDescription,
          showAnnouncement: schoolSettingsForm.dashboardBannerShowAnnouncement,
          announcementText: schoolSettingsForm.dashboardBannerAnnouncementText,
          announcementType: schoolSettingsForm.dashboardBannerAnnouncementType,
          theme: schoolSettingsForm.dashboardBannerTheme,
          quickUploadVisible: schoolSettingsForm.dashboardBannerQuickUpload,
          quickAssessVisible: schoolSettingsForm.dashboardBannerQuickAssess,
          quickReportsVisible: schoolSettingsForm.dashboardBannerQuickReports,
        }
      });
      showNotification('School Profile & Contact Settings updated successfully!');
    } catch (err: any) {
      showNotification('Failed to save settings: ' + err.message, 'error');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleCreateSy = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingSy(true);
    try {
      const newId = `SY-${newSyLabel.replace(/[^0-9-]/g, '')}`;
      await createSchoolYear(
        newId,
        newSyLabel,
        newSyStart,
        newSyEnd,
        copyPreviousWorkspace ? currentSchoolYear.id : undefined
      );
      setSySuccess(true);
      showNotification('Annual Workspace successfully created and initialized!');
      setTimeout(() => setSySuccess(false), 3000);
    } catch (err: any) {
      showNotification('Failed to initialize school year workspace: ' + err.message, 'error');
    } finally {
      setCreatingSy(false);
    }
  };

  const getRoleDisplay = (r: UserRole): string => {
    switch (r) {
      case 'super_admin':
        return 'System Administrator';
      case 'school_head':
        return 'School Head (Principal)';
      case 'sbm_coordinator':
        return 'SBM Coordinator';
      case 'dimension_leader':
        return 'Dimension Leader';
      case 'contributor':
        return 'Indicator Contributor';
      case 'validator':
        return 'SDO QC Validator';
      case 'public_visitor':
        return 'Public Visitor';
      default:
        return String(r);
    }
  };

  // Filtered list of users
  const filteredUsers = (allUsers || []).filter((u) => {
    if (!u) return false;
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (statusFilter !== 'all' && u.status !== statusFilter) return false;
    if (!userSearch.trim()) return true;
    const q = userSearch.toLowerCase();
    const name = (u.displayName || '').toLowerCase();
    const email = (u.email || '').toLowerCase();
    const dept = (u.department || '').toLowerCase();
    const desig = (u.designation || '').toLowerCase();
    const roleLabel = getRoleDisplay(u.role).toLowerCase();
    return name.includes(q) || email.includes(q) || dept.includes(q) || desig.includes(q) || roleLabel.includes(q);
  });

  const filteredLogs = (auditLogs || []).filter((log) => {
    if (!log) return false;
    if (!auditSearch.trim()) return true;
    const q = auditSearch.toLowerCase();
    const action = log.action ? String(log.action).toLowerCase() : '';
    const userName = (log as any).userName || (log as any).actorName ? String((log as any).userName || (log as any).actorName).toLowerCase() : '';
    const userRole = (log as any).userRole || (log as any).actorRole ? String((log as any).userRole || (log as any).actorRole).toLowerCase() : '';
    const targetId = (log as any).targetId || (log as any).affectedRecordId ? String((log as any).targetId || (log as any).affectedRecordId).toLowerCase() : '';
    return action.includes(q) || userName.includes(q) || userRole.includes(q) || targetId.includes(q);
  });

  return (
    <div id="admin-control-center-view" className="space-y-6">
      {/* Feedback Toast */}
      {feedbackMsg && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-2xl flex items-center space-x-3 text-xs font-semibold border ${
            feedbackMsg.type === 'success'
              ? 'bg-[#082417] text-emerald-300 border-emerald-500/50 shadow-emerald-950/50'
              : 'bg-[#2A080C] text-rose-300 border-rose-500/50 shadow-rose-950/50'
          }`}
        >
          {feedbackMsg.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-[#0D2E1F]/90 p-6 rounded-2xl border border-[#D4AF37]/35 shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F0D283] font-bold text-xs">
              System Administration & Security
            </span>
            <span className="text-xs text-[#8FBCA7] font-medium">{currentSchoolYear?.label}</span>
          </div>
          <h2 className="text-xl font-bold text-[#FFFDF9] mt-1">
            QHS SBM PORTAL Admin & Settings Control Center
          </h2>
          <p className="text-xs text-[#A7D7C1] mt-0.5">
            Configure School Profile, Principal details, Personnel designations, annual workspace lifecycles, and audit logs.
          </p>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#D4AF37]/20 pb-2">
        {[
          { id: 'users', label: 'Personnel & Role Management', icon: Users },
          { id: 'school_profile', label: 'School Profile & Principal Settings', icon: School },
          { id: 'workspaces', label: 'Annual SY Workspaces', icon: Calendar },
          { id: 'checklists', label: 'Checklist Templates', icon: FileCheck2 },
          { id: 'audit', label: 'System Audit Logs', icon: History }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'gold-btn shadow-md'
                  : 'bg-[#092217]/90 text-[#8FBCA7] hover:text-[#FFFDF9] hover:bg-[#0E3322] border border-[#D4AF37]/25'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: User Roles & Assignments */}
      {activeTab === 'users' && (
        <div className="bg-[#0D2E1F]/90 rounded-2xl border border-[#D4AF37]/30 shadow-md overflow-hidden space-y-4">
          {/* Header & Controls Bar */}
          <div className="p-5 border-b border-[#D4AF37]/20 bg-[#092217]/90 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-[#FFFDF9] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#F0D283]" />
                <span>Personnel & Role Management</span>
                <span className="bg-[#D4AF37]/20 text-[#F0D283] border border-[#D4AF37]/30 text-[11px] font-bold px-2 py-0.5 rounded-full">
                  {filteredUsers.length} Personnel
                </span>
              </h3>
              <p className="text-xs text-[#8FBCA7] mt-0.5">
                Edit personnel names, DepEd positions, contact emails, SBM roles, and dimension assignments.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="gold-btn px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Add Personnel</span>
              </button>
              <button
                type="button"
                onClick={handleResetDefaults}
                title="Reset personnel list to default demo roster"
                className="px-3 py-1.5 bg-[#061810] border border-[#D4AF37]/30 text-[#8FBCA7] hover:text-[#FFFDF9] hover:bg-[#0E3322] text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#F0D283]" />
                <span>Reset Roster</span>
              </button>
            </div>
          </div>

          {/* Filter / Search Bar */}
          <div className="px-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#8FBCA7] absolute left-3 top-3" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search name, position, email, department..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#092217] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] placeholder-[#8FBCA7]/70 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full py-2 px-3 text-xs bg-[#092217] border border-[#D4AF37]/30 rounded-xl font-semibold text-[#E2F0EA] focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="all">Filter: All Roles</option>
                <option value="super_admin">System Administrator</option>
                <option value="school_head">School Head (Principal)</option>
                <option value="sbm_coordinator">SBM Coordinator</option>
                <option value="dimension_leader">Dimension Leader</option>
                <option value="contributor">Indicator Contributor</option>
                <option value="validator">SDO QC Validator</option>
                <option value="public_visitor">Public Visitor</option>
              </select>
            </div>

            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full py-2 px-3 text-xs bg-[#092217] border border-[#D4AF37]/30 rounded-xl font-semibold text-[#E2F0EA] focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="all">Filter: All Statuses</option>
                <option value="approved">Active / Approved</option>
                <option value="pending">Pending Approval</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Personnel Table */}
          <div className="overflow-x-auto pb-2">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#092217] text-[#F0D283] font-bold uppercase border-y border-[#D4AF37]/20">
                <tr>
                  <th className="p-3.5">Personnel Name & Position</th>
                  <th className="p-3.5">Assigned SBM Role</th>
                  <th className="p-3.5">Dimension Focus</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D4AF37]/15">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-[#8FBCA7]">
                      No personnel records match the current filters.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const isEditingThis = editingUserId === u.id;
                    const dimFocusValue =
                      u.assignedDimensions && u.assignedDimensions.length === 1
                        ? String(u.assignedDimensions[0])
                        : 'all';

                    if (isEditingThis) {
                      return (
                        <tr key={u.id} className="bg-[#0B2519] border-y-2 border-[#D4AF37]">
                          {/* Editing Name & Details */}
                          <td className="p-3.5 space-y-1.5 min-w-[240px]">
                            <div>
                              <label className="text-[10px] font-bold text-[#F0D283] block">Full Name:</label>
                              <input
                                type="text"
                                value={editFormData.displayName}
                                onChange={(e) =>
                                  setEditFormData({ ...editFormData, displayName: e.target.value })
                                }
                                className="w-full p-1.5 text-xs bg-[#061810] border border-[#D4AF37]/50 rounded-lg font-bold text-[#FFFDF9]"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-[#F0D283] block">DepEd Position / Designation:</label>
                              <input
                                type="text"
                                value={editFormData.designation}
                                onChange={(e) =>
                                  setEditFormData({ ...editFormData, designation: e.target.value })
                                }
                                placeholder="e.g. Master Teacher I / Teacher III"
                                className="w-full p-1.5 text-xs bg-[#061810] border border-[#D4AF37]/50 rounded-lg text-[#E2F0EA]"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-[#F0D283] block">Email:</label>
                              <input
                                type="email"
                                value={editFormData.email}
                                onChange={(e) =>
                                  setEditFormData({ ...editFormData, email: e.target.value })
                                }
                                className="w-full p-1.5 text-xs bg-[#061810] border border-[#D4AF37]/50 rounded-lg text-[#8FBCA7]"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-[#F0D283] block">Department / Learning Area:</label>
                              <input
                                type="text"
                                value={editFormData.department}
                                onChange={(e) =>
                                  setEditFormData({ ...editFormData, department: e.target.value })
                                }
                                placeholder="e.g. Science Department"
                                className="w-full p-1.5 text-[11px] bg-[#061810] border border-[#D4AF37]/50 rounded-lg text-[#E2F0EA]"
                              />
                            </div>
                          </td>

                          {/* Editing Role */}
                          <td className="p-3.5 align-top">
                            <label className="text-[10px] font-bold text-[#F0D283] block mb-1">Role:</label>
                            <select
                              value={editFormData.role}
                              onChange={(e) =>
                                setEditFormData({ ...editFormData, role: e.target.value as UserRole })
                              }
                              className="w-full py-1.5 px-2 text-xs border border-[#D4AF37]/50 rounded-lg font-bold text-[#FFFDF9] bg-[#061810]"
                            >
                              <option value="super_admin">System Administrator</option>
                              <option value="school_head">School Head (Principal)</option>
                              <option value="sbm_coordinator">SBM Coordinator</option>
                              <option value="dimension_leader">Dimension Leader</option>
                              <option value="contributor">Indicator Contributor</option>
                              <option value="validator">SDO QC Validator</option>
                              <option value="public_visitor">Public Visitor</option>
                            </select>
                          </td>

                          {/* Editing Dimension */}
                          <td className="p-3.5 align-top">
                            <label className="text-[10px] font-bold text-[#F0D283] block mb-1">Dimension Focus:</label>
                            <select
                              value={editFormData.dimensionId}
                              onChange={(e) =>
                                setEditFormData({ ...editFormData, dimensionId: e.target.value })
                              }
                              className="w-full py-1.5 px-2 text-xs border border-[#D4AF37]/50 rounded-lg font-semibold text-[#FFFDF9] bg-[#061810]"
                            >
                              <option value="all">All Dimensions (1 to 6)</option>
                              <option value="1">Dimension 1: Curriculum & Instruction</option>
                              <option value="2">Dimension 2: Learning Environment</option>
                              <option value="3">Dimension 3: Resource Management</option>
                              <option value="4">Dimension 4: Human Resource Development</option>
                              <option value="5">Dimension 5: Leadership & Governance</option>
                              <option value="6">Dimension 6: School-Community Partnerships</option>
                            </select>
                          </td>

                          {/* Editing Status */}
                          <td className="p-3.5 align-top">
                            <label className="text-[10px] font-bold text-[#F0D283] block mb-1">Status:</label>
                            <select
                              value={editFormData.status}
                              onChange={(e) =>
                                setEditFormData({ ...editFormData, status: e.target.value as UserStatus })
                              }
                              className="w-full py-1.5 px-2 text-xs border border-[#D4AF37]/50 rounded-lg font-bold text-[#FFFDF9] bg-[#061810]"
                            >
                              <option value="approved">Active / Approved</option>
                              <option value="pending">Pending Approval</option>
                              <option value="inactive">Inactive</option>
                            </select>
                          </td>

                          {/* Save / Cancel Actions */}
                          <td className="p-3.5 text-right align-top space-x-1">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => saveEditing(u.id)}
                                className="px-3 py-1.5 gold-btn rounded-lg font-bold text-xs flex items-center space-x-1 shadow-xs"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Save</span>
                              </button>
                              <button
                                type="button"
                                onClick={cancelEditing}
                                className="px-2.5 py-1.5 bg-[#061810] border border-[#D4AF37]/30 hover:bg-[#0E3322] text-[#8FBCA7] rounded-lg font-semibold text-xs flex items-center space-x-1"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Cancel</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }

                    return (
                      <tr key={u.id} className="hover:bg-[#092217]/50 transition-colors">
                        {/* User Name, Position, Email */}
                        <td className="p-3.5">
                          <div className="font-bold text-[#FFFDF9] flex items-center gap-1.5">
                            <span>{u.displayName}</span>
                            {u.role === 'super_admin' && (
                              <span className="px-1.5 py-0.2 bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F0D283] rounded font-bold text-[9px]">
                                Sys Admin
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#F0D283] font-semibold">
                            {u.designation || 'Teacher / Personnel'}
                          </div>
                          <div className="text-[11px] text-[#8FBCA7]">{u.email}</div>
                          {u.department && (
                            <div className="text-[10px] text-[#A7D7C1] mt-0.5">{u.department}</div>
                          )}
                        </td>

                        {/* Interactive Role Select */}
                        <td className="p-3.5">
                          <select
                            value={u.role}
                            onChange={(e) => handleQuickRoleChange(u, e.target.value as UserRole)}
                            className="py-1 px-2.5 text-xs border border-[#D4AF37]/30 rounded-lg font-semibold text-[#FFFDF9] bg-[#092217] hover:border-[#D4AF37] focus:outline-none"
                          >
                            <option value="super_admin">System Administrator</option>
                            <option value="school_head">School Head (Principal)</option>
                            <option value="sbm_coordinator">SBM Coordinator</option>
                            <option value="dimension_leader">Dimension Leader</option>
                            <option value="contributor">Indicator Contributor</option>
                            <option value="validator">SDO QC Validator</option>
                            <option value="public_visitor">Public Visitor</option>
                          </select>
                        </td>

                        {/* Interactive Dimension Focus */}
                        <td className="p-3.5">
                          <select
                            value={dimFocusValue}
                            onChange={(e) => handleQuickDimensionChange(u, e.target.value)}
                            className="py-1 px-2 text-xs border border-[#D4AF37]/30 rounded-lg text-[#E2F0EA] bg-[#092217] hover:border-[#D4AF37] focus:outline-none max-w-[160px]"
                          >
                            <option value="all">All Dimensions</option>
                            <option value="1">Dimension 1 (Curriculum)</option>
                            <option value="2">Dimension 2 (Environment)</option>
                            <option value="3">Dimension 3 (Resources)</option>
                            <option value="4">Dimension 4 (HR / Staff)</option>
                            <option value="5">Dimension 5 (Governance)</option>
                            <option value="6">Dimension 6 (Partnerships)</option>
                          </select>
                        </td>

                        {/* Interactive Status Select */}
                        <td className="p-3.5">
                          <select
                            value={u.status}
                            onChange={(e) => handleQuickStatusChange(u, e.target.value as UserStatus)}
                            className={`py-0.5 px-2 text-[11px] font-bold rounded-lg border bg-[#061810] ${
                              u.status === 'approved'
                                ? 'text-emerald-400 border-emerald-500/40'
                                : u.status === 'pending'
                                ? 'text-amber-400 border-amber-500/40'
                                : 'text-slate-400 border-slate-500/40'
                            }`}
                          >
                            <option value="approved">Active</option>
                            <option value="pending">Pending</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              type="button"
                              onClick={() => startEditing(u)}
                              title="Edit all fields of this personnel"
                              className="p-1.5 text-[#F0D283] hover:text-[#FFFDF9] hover:bg-[#061810] rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(u)}
                              title="Remove personnel"
                              className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-[#2A080C] rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: School Profile & Settings */}
      {activeTab === 'school_profile' && (
        <div className="bg-[#0D2E1F]/90 rounded-2xl border border-[#D4AF37]/30 shadow-md p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-4">
            <div>
              <h3 className="text-base font-bold text-[#FFFDF9] flex items-center space-x-2">
                <School className="w-5 h-5 text-[#F0D283]" />
                <span>School Profile, Principal & Contact Settings</span>
              </h3>
              <p className="text-xs text-[#8FBCA7] mt-0.5">
                Customize official school credentials, Principal name & title, contact telephone, address, and metrics.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveSchoolSettings} className="space-y-5 text-xs">
            {/* Section 1: Official School Identity */}
            <div className="p-5 bg-[#092217]/90 rounded-2xl border border-[#D4AF37]/20 space-y-4">
              <span className="font-bold text-[#F0D283] block uppercase tracking-wider text-[11px]">
                1. Official School Identity
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#E2F0EA] mb-1 font-semibold">School Name</label>
                  <input
                    type="text"
                    value={schoolSettingsForm.schoolName}
                    onChange={(e) => setSchoolSettingsForm({ ...schoolSettingsForm, schoolName: e.target.value })}
                    required
                    className="w-full p-2.5 bg-[#061810] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[#E2F0EA] mb-1 font-semibold">DepEd School ID</label>
                  <input
                    type="text"
                    value={schoolSettingsForm.schoolId}
                    onChange={(e) => setSchoolSettingsForm({ ...schoolSettingsForm, schoolId: e.target.value })}
                    required
                    className="w-full p-2.5 bg-[#061810] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Leadership & SBM Officials */}
            <div className="p-5 bg-[#092217]/90 rounded-2xl border border-[#D4AF37]/20 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#F0D283] block uppercase tracking-wider text-[11px]">
                  2. Principal & Official Signatories / Leadership
                </span>
                <span className="text-[11px] text-[#A7D7C1]">
                  Manage, add, or remove signatories as needed
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#E2F0EA] mb-1 font-semibold">Principal / School Head Name *</label>
                  <input
                    type="text"
                    value={schoolSettingsForm.principalName}
                    onChange={(e) => setSchoolSettingsForm({ ...schoolSettingsForm, principalName: e.target.value })}
                    required
                    className="w-full p-2.5 bg-[#061810] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[#E2F0EA] mb-1 font-semibold">Principal Position Title / Designation</label>
                  <input
                    type="text"
                    value={schoolSettingsForm.schoolHeadTitle}
                    onChange={(e) => setSchoolSettingsForm({ ...schoolSettingsForm, schoolHeadTitle: e.target.value })}
                    required
                    placeholder="e.g. Secondary School Principal IV"
                    className="w-full p-2.5 bg-[#061810] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[#E2F0EA] mb-1 font-semibold">SBM Coordinator Name *</label>
                  <input
                    type="text"
                    value={schoolSettingsForm.sbmCoordinator}
                    onChange={(e) => setSchoolSettingsForm({ ...schoolSettingsForm, sbmCoordinator: e.target.value })}
                    required
                    className="w-full p-2.5 bg-[#061810] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[#E2F0EA] mb-1 font-semibold">SBM Coordinator Position / Title</label>
                  <input
                    type="text"
                    value={schoolSettingsForm.sbmCoordinatorTitle}
                    onChange={(e) => setSchoolSettingsForm({ ...schoolSettingsForm, sbmCoordinatorTitle: e.target.value })}
                    placeholder="e.g. Head Teacher VI / SBM Coordinator"
                    className="w-full p-2.5 bg-[#061810] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {/* Assistant Principal with Delete Option */}
                <div className="sm:col-span-2 p-3.5 bg-[#040D08] border border-[#D4AF37]/20 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#E2F0EA]">Assistant Principal (Optional)</span>
                    {schoolSettingsForm.assistantPrincipal ? (
                      <button
                        type="button"
                        onClick={() => setSchoolSettingsForm({ ...schoolSettingsForm, assistantPrincipal: '', assistantPrincipalTitle: '' })}
                        className="text-xs text-rose-400 hover:text-rose-300 flex items-center space-x-1 px-2 py-0.5 rounded hover:bg-rose-950/40 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Signatory</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSchoolSettingsForm({ ...schoolSettingsForm, assistantPrincipal: 'Dr. Roberto D. Reyes', assistantPrincipalTitle: 'Assistant Principal II - Academics' })}
                        className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 px-2 py-0.5 rounded hover:bg-emerald-950/40 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add / Restore Signatory</span>
                      </button>
                    )}
                  </div>
                  {schoolSettingsForm.assistantPrincipal ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[#8FBCA7] mb-1 text-xs">Assistant Principal Name</label>
                        <input
                          type="text"
                          value={schoolSettingsForm.assistantPrincipal}
                          onChange={(e) => setSchoolSettingsForm({ ...schoolSettingsForm, assistantPrincipal: e.target.value })}
                          className="w-full p-2 bg-[#061810] border border-[#D4AF37]/30 rounded-lg text-xs text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#8FBCA7] mb-1 text-xs">Assistant Principal Title</label>
                        <input
                          type="text"
                          value={schoolSettingsForm.assistantPrincipalTitle}
                          onChange={(e) => setSchoolSettingsForm({ ...schoolSettingsForm, assistantPrincipalTitle: e.target.value })}
                          className="w-full p-2 bg-[#061810] border border-[#D4AF37]/30 rounded-lg text-xs text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-[#8FBCA7] italic">Assistant Principal is excluded from official signatories.</p>
                  )}
                </div>

                {/* Division SBM Validator with Delete Option */}
                <div className="sm:col-span-2 p-3.5 bg-[#040D08] border border-[#D4AF37]/20 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#E2F0EA]">Division SBM Validator (SDO Level)</span>
                    {schoolSettingsForm.divisionValidator ? (
                      <button
                        type="button"
                        onClick={() => setSchoolSettingsForm({ ...schoolSettingsForm, divisionValidator: '', divisionValidatorTitle: '' })}
                        className="text-xs text-rose-400 hover:text-rose-300 flex items-center space-x-1 px-2 py-0.5 rounded hover:bg-rose-950/40 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Signatory</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSchoolSettingsForm({ ...schoolSettingsForm, divisionValidator: 'Dr. Manuel A. Gomez', divisionValidatorTitle: 'Division SBM Focal Person / EPS' })}
                        className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 px-2 py-0.5 rounded hover:bg-emerald-950/40 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add / Restore Signatory</span>
                      </button>
                    )}
                  </div>
                  {schoolSettingsForm.divisionValidator ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[#8FBCA7] mb-1 text-xs">Division Validator Name</label>
                        <input
                          type="text"
                          value={schoolSettingsForm.divisionValidator}
                          onChange={(e) => setSchoolSettingsForm({ ...schoolSettingsForm, divisionValidator: e.target.value })}
                          className="w-full p-2 bg-[#061810] border border-[#D4AF37]/30 rounded-lg text-xs text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#8FBCA7] mb-1 text-xs">Division Validator Title</label>
                        <input
                          type="text"
                          value={schoolSettingsForm.divisionValidatorTitle}
                          onChange={(e) => setSchoolSettingsForm({ ...schoolSettingsForm, divisionValidatorTitle: e.target.value })}
                          className="w-full p-2 bg-[#061810] border border-[#D4AF37]/30 rounded-lg text-xs text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-[#8FBCA7] italic">Division SBM Validator is excluded from official signatories.</p>
                  )}
                </div>

                {/* Schools Division Superintendent with Delete Option */}
                <div className="sm:col-span-2 p-3.5 bg-[#040D08] border border-[#D4AF37]/20 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#E2F0EA]">Schools Division Superintendent (SDS)</span>
                    {schoolSettingsForm.divisionSuperintendent ? (
                      <button
                        type="button"
                        onClick={() => setSchoolSettingsForm({ ...schoolSettingsForm, divisionSuperintendent: '', divisionSuperintendentTitle: '' })}
                        className="text-xs text-rose-400 hover:text-rose-300 flex items-center space-x-1 px-2 py-0.5 rounded hover:bg-rose-950/40 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Signatory</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSchoolSettingsForm({ ...schoolSettingsForm, divisionSuperintendent: 'Dr. Carleen S. Sedilla, CESO V', divisionSuperintendentTitle: 'Schools Division Superintendent' })}
                        className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 px-2 py-0.5 rounded hover:bg-emerald-950/40 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add / Restore Signatory</span>
                      </button>
                    )}
                  </div>
                  {schoolSettingsForm.divisionSuperintendent ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[#8FBCA7] mb-1 text-xs">Superintendent Name</label>
                        <input
                          type="text"
                          value={schoolSettingsForm.divisionSuperintendent}
                          onChange={(e) => setSchoolSettingsForm({ ...schoolSettingsForm, divisionSuperintendent: e.target.value })}
                          className="w-full p-2 bg-[#061810] border border-[#D4AF37]/30 rounded-lg text-xs text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#8FBCA7] mb-1 text-xs">Superintendent Title</label>
                        <input
                          type="text"
                          value={schoolSettingsForm.divisionSuperintendentTitle}
                          onChange={(e) => setSchoolSettingsForm({ ...schoolSettingsForm, divisionSuperintendentTitle: e.target.value })}
                          className="w-full p-2 bg-[#061810] border border-[#D4AF37]/30 rounded-lg text-xs text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-[#8FBCA7] italic">Schools Division Superintendent is excluded from official signatories.</p>
                  )}
                </div>
              </div>

              {/* SBM Dimension Coordinators Sub-section */}
              <div className="mt-4 pt-4 border-t border-[#D4AF37]/20">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-[#D4AF37] block">
                    SBM Dimension Coordinators (6 Dimensions)
                  </span>
                  <span className="text-[11px] text-[#8FBCA7]">Clear or reassign coordinator fields as needed</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {schoolSettingsForm.dimensionCoordinators?.map((coord, idx) => {
                    const dimNames: Record<number, string> = {
                      1: 'Dim 1: Leadership & Governance',
                      2: 'Dim 2: Curriculum & Instruction',
                      3: 'Dim 3: Accountability & Cont. Imprv.',
                      4: 'Dim 4: Management of Resources',
                      5: 'Dim 5: Human Resources',
                      6: 'Dim 6: Quality Management'
                    };
                    const hasCoord = (coord.name || (coord as any).leadName);
                    return (
                      <div key={coord.dimensionId || idx} className="p-3 bg-[#061810] border border-[#D4AF37]/20 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-[#E2F0EA]">
                            {dimNames[coord.dimensionId] || `Dimension ${coord.dimensionId}`}
                          </span>
                          {hasCoord && (
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...(schoolSettingsForm.dimensionCoordinators || [])];
                                updated[idx] = { ...updated[idx], name: '', leadName: '', title: '', designation: '' };
                                setSchoolSettingsForm({ ...schoolSettingsForm, dimensionCoordinators: updated });
                              }}
                              title="Clear Coordinator"
                              className="text-rose-400 hover:text-rose-300 p-1 rounded hover:bg-rose-950/40 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          value={coord.name || (coord as any).leadName || ''}
                          onChange={(e) => {
                            const updated = [...(schoolSettingsForm.dimensionCoordinators || [])];
                            updated[idx] = { ...updated[idx], name: e.target.value, leadName: e.target.value };
                            setSchoolSettingsForm({ ...schoolSettingsForm, dimensionCoordinators: updated });
                          }}
                          placeholder="Coordinator Name"
                          className="w-full p-2 bg-[#040D08] border border-[#D4AF37]/20 rounded-lg text-xs text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                        />
                        <input
                          type="text"
                          value={coord.title || (coord as any).designation || ''}
                          onChange={(e) => {
                            const updated = [...(schoolSettingsForm.dimensionCoordinators || [])];
                            updated[idx] = { ...updated[idx], title: e.target.value, designation: e.target.value };
                            setSchoolSettingsForm({ ...schoolSettingsForm, dimensionCoordinators: updated });
                          }}
                          placeholder="Designation / Title"
                          className="w-full p-2 bg-[#040D08] border border-[#D4AF37]/20 rounded-lg text-xs text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Section 3: School Address & Contact */}
            <div className="p-5 bg-[#092217]/90 rounded-2xl border border-[#D4AF37]/20 space-y-4">
              <span className="font-bold text-[#F0D283] block uppercase tracking-wider text-[11px]">
                3. Address & Official Contact Info
              </span>
              <div className="space-y-3">
                <div>
                  <label className="block text-[#E2F0EA] mb-1 font-semibold">Complete School Address</label>
                  <input
                    type="text"
                    value={schoolSettingsForm.address}
                    onChange={(e) => setSchoolSettingsForm({ ...schoolSettingsForm, address: e.target.value })}
                    required
                    className="w-full p-2.5 bg-[#061810] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#E2F0EA] mb-1 font-semibold">Contact / Telephone Number</label>
                    <input
                      type="text"
                      value={schoolSettingsForm.telephone}
                      onChange={(e) => setSchoolSettingsForm({ ...schoolSettingsForm, telephone: e.target.value })}
                      required
                      className="w-full p-2.5 bg-[#061810] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#E2F0EA] mb-1 font-semibold">Official School Email</label>
                    <input
                      type="email"
                      value={schoolSettingsForm.email}
                      onChange={(e) => setSchoolSettingsForm({ ...schoolSettingsForm, email: e.target.value })}
                      required
                      className="w-full p-2.5 bg-[#061810] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[#E2F0EA] mb-1 font-semibold">Schools Division Office (SDO)</label>
                    <input
                      type="text"
                      value={schoolSettingsForm.division}
                      onChange={(e) => setSchoolSettingsForm({ ...schoolSettingsForm, division: e.target.value })}
                      className="w-full p-2.5 bg-[#061810] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#E2F0EA] mb-1 font-semibold">DepEd Region</label>
                    <input
                      type="text"
                      value={schoolSettingsForm.region}
                      onChange={(e) => setSchoolSettingsForm({ ...schoolSettingsForm, region: e.target.value })}
                      className="w-full p-2.5 bg-[#061810] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#E2F0EA] mb-1 font-semibold">District / Cluster</label>
                    <input
                      type="text"
                      value={schoolSettingsForm.district}
                      onChange={(e) => setSchoolSettingsForm({ ...schoolSettingsForm, district: e.target.value })}
                      className="w-full p-2.5 bg-[#061810] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Figures & Statistics */}
            <div className="p-5 bg-[#092217]/90 rounded-2xl border border-[#D4AF37]/20 space-y-4">
              <span className="font-bold text-[#F0D283] block uppercase tracking-wider text-[11px]">
                4. School Facilities & Personnel Statistics
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[#E2F0EA] mb-1 font-semibold">Total Learners</label>
                  <input
                    type="number"
                    value={schoolSettingsForm.totalLearners}
                    onChange={(e) => setSchoolSettingsForm({ ...schoolSettingsForm, totalLearners: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#061810] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[#E2F0EA] mb-1 font-semibold">Teaching Staff</label>
                  <input
                    type="number"
                    value={schoolSettingsForm.teachingPersonnel}
                    onChange={(e) => setSchoolSettingsForm({ ...schoolSettingsForm, teachingPersonnel: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#061810] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[#E2F0EA] mb-1 font-semibold">Non-Teaching Staff</label>
                  <input
                    type="number"
                    value={schoolSettingsForm.nonTeachingPersonnel}
                    onChange={(e) => setSchoolSettingsForm({ ...schoolSettingsForm, nonTeachingPersonnel: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#061810] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[#E2F0EA] mb-1 font-semibold">Classrooms</label>
                  <input
                    type="number"
                    value={schoolSettingsForm.classrooms}
                    onChange={(e) => setSchoolSettingsForm({ ...schoolSettingsForm, classrooms: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#061810] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[#E2F0EA] mb-1 font-semibold">Science Laboratories</label>
                  <input
                    type="number"
                    value={schoolSettingsForm.scienceLaboratories}
                    onChange={(e) => setSchoolSettingsForm({ ...schoolSettingsForm, scienceLaboratories: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#061810] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[#E2F0EA] mb-1 font-semibold">Computer Laboratories</label>
                  <input
                    type="number"
                    value={schoolSettingsForm.computerLaboratories}
                    onChange={(e) => setSchoolSettingsForm({ ...schoolSettingsForm, computerLaboratories: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#061810] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>
            </div>

            {/* Section 5: Dashboard Top Banner Customization */}
            <div className="p-5 bg-[#092217]/90 rounded-2xl border border-[#D4AF37]/20 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#F0D283] block uppercase tracking-wider text-[11px]">
                    5. Dashboard Top Banner Customization
                  </span>
                  <p className="text-[11px] text-[#8FBCA7] mt-0.5">
                    Customize the welcome headline, policy badge, narrative description, broadcast memo, and theme on the SBM Dashboard.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {/* Badge Text */}
                <div>
                  <label className="block text-[#E2F0EA] mb-1 font-semibold">
                    Banner Policy Badge Text
                  </label>
                  <input
                    type="text"
                    value={schoolSettingsForm.dashboardBannerBadge}
                    onChange={(e) => setSchoolSettingsForm({ ...schoolSettingsForm, dashboardBannerBadge: e.target.value })}
                    placeholder="e.g. Official Policy DepEd Order No. 007, s. 2024"
                    className="w-full p-2.5 bg-[#061810] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                  />
                  <span className="text-[10px] text-[#8FBCA7] mt-1 block">
                    Small rounded pill badge shown above the main dashboard headline.
                  </span>
                </div>

                {/* Headline / Title */}
                <div>
                  <label className="block text-[#E2F0EA] mb-1 font-semibold">
                    Banner Main Headline / Title
                  </label>
                  <input
                    type="text"
                    value={schoolSettingsForm.dashboardBannerTitle}
                    onChange={(e) => setSchoolSettingsForm({ ...schoolSettingsForm, dashboardBannerTitle: e.target.value })}
                    placeholder="e.g. SBM Performance & Evidence Tracking — {SY}"
                    className="w-full p-2.5 bg-[#061810] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                  />
                  <span className="text-[10px] text-[#8FBCA7] mt-1 block">
                    Use <code className="text-[#F0D283] font-mono">{'{SY}'}</code> to automatically insert the current school year label (e.g. S.Y. 2024-2025).
                  </span>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[#E2F0EA] mb-1 font-semibold">
                    Banner Subtitle & Welcome Narrative
                  </label>
                  <textarea
                    rows={2}
                    value={schoolSettingsForm.dashboardBannerDescription}
                    onChange={(e) => setSchoolSettingsForm({ ...schoolSettingsForm, dashboardBannerDescription: e.target.value })}
                    placeholder="e.g. Monitor all 6 SBM dimensions, verify Means of Verification (MOVs), and calibrate official degrees of manifestation under DepEd Order No. 007, s. 2024."
                    className="w-full p-2.5 bg-[#061810] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {/* Color Theme Selection */}
                <div>
                  <label className="block text-[#E2F0EA] mb-1.5 font-semibold">
                    Banner Visual Theme
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { id: 'emerald_gold', name: 'Emerald & Gold', desc: 'DepEd Official Classic', preview: 'from-[#0C301F] to-[#072015] border-[#D4AF37]/40' },
                      { id: 'forest_classic', name: 'Forest Green', desc: 'Deep Evergreen', preview: 'from-[#072316] to-[#05180F] border-emerald-500/40' },
                      { id: 'midnight_jade', name: 'Midnight Jade', desc: 'Modern Teal Accent', preview: 'from-[#041B1B] to-[#031313] border-teal-500/40' },
                      { id: 'royal_pine', name: 'Royal Pine', desc: 'Warm Amber Trim', preview: 'from-[#092217] to-[#061910] border-amber-500/40' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSchoolSettingsForm({ ...schoolSettingsForm, dashboardBannerTheme: t.id as any })}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          schoolSettingsForm.dashboardBannerTheme === t.id
                            ? 'bg-[#0E3824] border-[#D4AF37] ring-1 ring-[#D4AF37]'
                            : 'bg-[#061810] border-[#D4AF37]/20 hover:border-[#D4AF37]/40'
                        }`}
                      >
                        <div className={`h-6 rounded-lg bg-gradient-to-r ${t.preview} mb-2 border`} />
                        <span className="font-bold text-[#FFFDF9] block text-xs">{t.name}</span>
                        <span className="text-[10px] text-[#8FBCA7] block">{t.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Announcement Notice in Banner */}
                <div className="pt-3 border-t border-[#D4AF37]/15 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-[#E2F0EA]">Broadcast Announcement Strip</span>
                      <p className="text-[10px] text-[#8FBCA7]">Display a high-priority memo bar inside the dashboard banner.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={schoolSettingsForm.dashboardBannerShowAnnouncement}
                        onChange={(e) => setSchoolSettingsForm({ ...schoolSettingsForm, dashboardBannerShowAnnouncement: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                    </label>
                  </div>

                  {schoolSettingsForm.dashboardBannerShowAnnouncement && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      <div className="sm:col-span-2">
                        <label className="block text-[#E2F0EA] mb-1 font-semibold">Announcement Text</label>
                        <input
                          type="text"
                          value={schoolSettingsForm.dashboardBannerAnnouncementText}
                          onChange={(e) => setSchoolSettingsForm({ ...schoolSettingsForm, dashboardBannerAnnouncementText: e.target.value })}
                          placeholder="e.g. SBM Validation scheduled on Friday. Please review all Dimension indicators."
                          className="w-full p-2.5 bg-[#061810] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#E2F0EA] mb-1 font-semibold">Notice Color Accent</label>
                        <select
                          value={schoolSettingsForm.dashboardBannerAnnouncementType}
                          onChange={(e) => setSchoolSettingsForm({ ...schoolSettingsForm, dashboardBannerAnnouncementType: e.target.value as any })}
                          className="w-full p-2.5 bg-[#061810] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                        >
                          <option value="gold">Gold (Highlight)</option>
                          <option value="emerald">Emerald (Success / Normal)</option>
                          <option value="blue">Blue (Informational)</option>
                          <option value="amber">Amber (Urgent Reminder)</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Action Button Toggles */}
                <div className="pt-3 border-t border-[#D4AF37]/15">
                  <span className="font-semibold text-[#E2F0EA] block mb-2">Visible Banner Action Buttons</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label className="flex items-center space-x-2 p-2.5 rounded-xl bg-[#061810] border border-[#D4AF37]/20 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={schoolSettingsForm.dashboardBannerQuickUpload}
                        onChange={(e) => setSchoolSettingsForm({ ...schoolSettingsForm, dashboardBannerQuickUpload: e.target.checked })}
                        className="rounded accent-[#D4AF37]"
                      />
                      <span className="text-[#FFFDF9] font-medium">Upload MOV Button</span>
                    </label>
                    <label className="flex items-center space-x-2 p-2.5 rounded-xl bg-[#061810] border border-[#D4AF37]/20 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={schoolSettingsForm.dashboardBannerQuickAssess}
                        onChange={(e) => setSchoolSettingsForm({ ...schoolSettingsForm, dashboardBannerQuickAssess: e.target.checked })}
                        className="rounded accent-[#D4AF37]"
                      />
                      <span className="text-[#FFFDF9] font-medium">Assessment Matrix Button</span>
                    </label>
                    <label className="flex items-center space-x-2 p-2.5 rounded-xl bg-[#061810] border border-[#D4AF37]/20 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={schoolSettingsForm.dashboardBannerQuickReports}
                        onChange={(e) => setSchoolSettingsForm({ ...schoolSettingsForm, dashboardBannerQuickReports: e.target.checked })}
                        className="rounded accent-[#D4AF37]"
                      />
                      <span className="text-[#FFFDF9] font-medium">Generate Reports Button</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={savingSettings}
                className="gold-btn px-6 py-2.5 rounded-xl font-bold shadow-lg flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{savingSettings ? 'Saving Settings...' : 'Save School Settings'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Add New Personnel */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0B2519] rounded-2xl max-w-lg w-full shadow-2xl border border-[#D4AF37]/40 overflow-hidden text-[#FFFDF9]">
            <div className="px-6 py-4 bg-[#061810] text-[#FFFDF9] flex items-center justify-between border-b border-[#D4AF37]/20">
              <div className="flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-[#F0D283]" />
                <h3 className="text-sm font-bold text-[#FFFDF9]">Register & Assign New Personnel</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-[#8FBCA7] hover:text-[#FFFDF9] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPersonnel} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#E2F0EA] block mb-1">Full Name:</label>
                  <input
                    type="text"
                    required
                    value={newUserData.displayName}
                    onChange={(e) =>
                      setNewUserData({ ...newUserData, displayName: e.target.value })
                    }
                    placeholder="e.g. Maria Santos"
                    className="w-full p-2 bg-[#092217] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#E2F0EA] block mb-1">Email Address:</label>
                  <input
                    type="email"
                    required
                    value={newUserData.email}
                    onChange={(e) =>
                      setNewUserData({ ...newUserData, email: e.target.value })
                    }
                    placeholder="e.g. maria.santos@deped.gov.ph"
                    className="w-full p-2 bg-[#092217] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#E2F0EA] block mb-1">Position / Designation:</label>
                  <input
                    type="text"
                    value={newUserData.designation}
                    onChange={(e) =>
                      setNewUserData({ ...newUserData, designation: e.target.value })
                    }
                    placeholder="e.g. Master Teacher I / Head Teacher III"
                    className="w-full p-2 bg-[#092217] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#E2F0EA] block mb-1">Assigned SBM Role:</label>
                  <select
                    value={newUserData.role}
                    onChange={(e) =>
                      setNewUserData({ ...newUserData, role: e.target.value as UserRole })
                    }
                    className="w-full p-2 bg-[#092217] border border-[#D4AF37]/30 rounded-xl font-semibold text-[#FFFDF9]"
                  >
                    <option value="super_admin">System Administrator</option>
                    <option value="school_head">School Head (Principal)</option>
                    <option value="sbm_coordinator">SBM Coordinator</option>
                    <option value="dimension_leader">Dimension Leader</option>
                    <option value="contributor">Indicator Contributor</option>
                    <option value="validator">SDO QC Validator</option>
                    <option value="public_visitor">Public Visitor</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#E2F0EA] block mb-1">Dimension Focus:</label>
                  <select
                    value={newUserData.dimensionId}
                    onChange={(e) =>
                      setNewUserData({ ...newUserData, dimensionId: e.target.value })
                    }
                    className="w-full p-2 bg-[#092217] border border-[#D4AF37]/30 rounded-xl font-semibold text-[#FFFDF9]"
                  >
                    <option value="all">All Dimensions (1 to 6)</option>
                    <option value="1">Dimension 1: Curriculum & Instruction</option>
                    <option value="2">Dimension 2: Learning Environment</option>
                    <option value="3">Dimension 3: Resource Management</option>
                    <option value="4">Dimension 4: Human Resource</option>
                    <option value="5">Dimension 5: Leadership & Governance</option>
                    <option value="6">Dimension 6: Community Partnerships</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#E2F0EA] block mb-1">Department / Subject:</label>
                  <input
                    type="text"
                    value={newUserData.department}
                    onChange={(e) =>
                      setNewUserData({ ...newUserData, department: e.target.value })
                    }
                    placeholder="e.g. Science & Math Department"
                    className="w-full p-2 bg-[#092217] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-[#D4AF37]/20">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-[#061810] hover:bg-[#0E3322] text-[#8FBCA7] font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gold-btn px-5 py-2 font-bold rounded-xl shadow-md"
                >
                  Save & Register Personnel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab 3: School Year Workspaces */}
      {activeTab === 'workspaces' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Create School Year Form */}
          <div className="bg-[#0D2E1F]/90 rounded-2xl p-6 border border-[#D4AF37]/30 shadow-md space-y-4">
            <h3 className="text-sm font-bold text-[#FFFDF9] flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-[#F0D283]" />
              <span>Initialize New Annual SBM Workspace</span>
            </h3>

            {sySuccess && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Annual Workspace successfully created and initialized!</span>
              </div>
            )}

            <form onSubmit={handleCreateSy} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#E2F0EA] block mb-1">
                  School Year Label:
                </label>
                <input
                  type="text"
                  required
                  value={newSyLabel}
                  onChange={(e) => setNewSyLabel(e.target.value)}
                  placeholder="e.g. S.Y. 2027-2028"
                  className="w-full p-2 bg-[#061810] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-[#E2F0EA] block mb-1">Start Date:</label>
                  <input
                    type="date"
                    required
                    value={newSyStart}
                    onChange={(e) => setNewSyStart(e.target.value)}
                    className="w-full p-2 bg-[#061810] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#E2F0EA] block mb-1">End Date:</label>
                  <input
                    type="date"
                    required
                    value={newSyEnd}
                    onChange={(e) => setNewSyEnd(e.target.value)}
                    className="w-full p-2 bg-[#061810] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9]"
                  />
                </div>
              </div>

              <label className="flex items-center space-x-2 p-3 bg-[#061810] rounded-xl border border-[#D4AF37]/20 cursor-pointer">
                <input
                  type="checkbox"
                  checked={copyPreviousWorkspace}
                  onChange={(e) => setCopyPreviousWorkspace(e.target.checked)}
                  className="rounded text-[#D4AF37]"
                />
                <span className="text-[#E2F0EA] font-medium text-xs">
                  Copy 42 indicator master structures & checklist templates from {currentSchoolYear?.label}
                </span>
              </label>

              <button
                type="submit"
                disabled={creatingSy}
                className="gold-btn w-full py-2.5 font-bold rounded-xl shadow-md"
              >
                {creatingSy ? 'Creating Workspace...' : 'Initialize School Year Workspace'}
              </button>
            </form>
          </div>

          {/* Existing Workspaces List */}
          <div className="bg-[#0D2E1F]/90 rounded-2xl p-6 border border-[#D4AF37]/30 shadow-md space-y-3">
            <h3 className="text-sm font-bold text-[#FFFDF9]">Existing SBM School Year Workspaces</h3>
            <div className="divide-y divide-[#D4AF37]/15">
              {(schoolYears || []).map((sy) => (
                <div key={sy.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[#FFFDF9] text-xs">{sy.label}</div>
                    <div className="text-[11px] text-[#8FBCA7]">
                      {sy.startDate} to {sy.endDate}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {sy.isCurrent && (
                      <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F0D283] text-[10px] font-bold">
                        Active Workspace
                      </span>
                    )}
                    {sy.isArchived && (
                      <span className="px-2 py-0.5 rounded-full bg-[#061810] text-[#8FBCA7] text-[10px] font-bold">
                        Archived
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Checklist Templates */}
      {activeTab === 'checklists' && (
        <div className="bg-[#0D2E1F]/90 rounded-2xl border border-[#D4AF37]/30 shadow-md p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#FFFDF9]">
                Official Required MOV Checklist Definitions
              </h3>
              <p className="text-xs text-[#8FBCA7]">
                Checklist items configured for {currentSchoolYear?.label} ({(requiredMovItems || []).length} total items)
              </p>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto divide-y divide-[#D4AF37]/15 border border-[#D4AF37]/20 rounded-xl bg-[#092217]">
            {(requiredMovItems || []).slice(0, 20).map((req) => (
              <div key={req.id} className="p-3 text-xs flex justify-between items-center">
                <div>
                  <span className="font-mono font-bold bg-[#061810] text-[#F0D283] border border-[#D4AF37]/30 px-1.5 py-0.5 rounded mr-2">
                    {req.code}
                  </span>
                  <strong className="text-[#FFFDF9]">{req.title}</strong>
                  <div className="text-[11px] text-[#8FBCA7] mt-0.5">
                    Dimension {req.dimensionId} • Indicator {req.indicatorNumber} • {req.description}
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#F0D283] uppercase px-2 py-0.5 rounded bg-[#D4AF37]/15">
                  {req.isMandatory ? 'Mandatory' : 'Optional'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: System Audit Logs */}
      {activeTab === 'audit' && (
        <div className="bg-[#0D2E1F]/90 rounded-2xl border border-[#D4AF37]/30 shadow-md p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-[#FFFDF9]">
                Comprehensive System Audit Trail ({(auditLogs || []).length} Records)
              </h3>
              <p className="text-xs text-[#8FBCA7]">
                Cryptographically tracked compliance logs under Data Privacy Act and DepEd policies.
              </p>
            </div>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#8FBCA7] absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                placeholder="Search audit trail..."
                className="pl-8 pr-3 py-1.5 text-xs bg-[#061810] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9]"
              />
            </div>
          </div>

          <div className="overflow-x-auto border border-[#D4AF37]/20 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#092217] font-bold border-b border-[#D4AF37]/20 text-[#F0D283]">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">User & Role</th>
                  <th className="p-3">Target Entity</th>
                  <th className="p-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D4AF37]/15">
                {filteredLogs.map((log) => {
                  let formattedDate = 'N/A';
                  try {
                    formattedDate = log.timestamp ? new Date(log.timestamp).toLocaleString() : 'N/A';
                  } catch {
                    formattedDate = 'N/A';
                  }
                  const userName = (log as any).userName || (log as any).actorName || 'User';
                  const userRole = (log as any).userRole || (log as any).actorRole || 'Personnel';
                  const targetType = (log as any).targetType || (log as any).affectedRecordType || 'Record';
                  const targetId = (log as any).targetId || (log as any).affectedRecordId || '';
                  const detailsText = (log as any).details?.newValue || (log as any).details?.reason || (log as any).reason || (log as any).newValue || '';

                  return (
                    <tr key={log.id} className="hover:bg-[#092217]">
                      <td className="p-3 text-[#8FBCA7] whitespace-nowrap">
                        {formattedDate}
                      </td>
                      <td className="p-3 font-bold text-[#FFFDF9]">{log.action}</td>
                      <td className="p-3 text-[#E2F0EA]">
                        {userName} ({userRole})
                      </td>
                      <td className="p-3 font-mono text-[11px] text-[#F0D283]">
                        {targetType}:{targetId}
                      </td>
                      <td className="p-3 text-[#8FBCA7] text-[11px] max-w-xs truncate">
                        {detailsText}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
