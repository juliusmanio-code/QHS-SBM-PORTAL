import React, { useState, useRef } from 'react';
import {
  School,
  Building,
  Users,
  GraduationCap,
  Award,
  BookOpen,
  MapPin,
  Mail,
  Phone,
  Compass,
  CheckCircle2,
  Heart,
  Upload,
  Camera,
  Edit,
  Save,
  X,
  Image as ImageIcon,
  UserCheck,
  Shield,
  FileSpreadsheet,
  AlertCircle,
  Trash2,
  Plus,
  RotateCcw,
  Check
} from 'lucide-react';
import { useSbmData } from '../../contexts/SbmDataContext';
import { useAuth } from '../../contexts/AuthContext';
import { DimensionCoordinator, CustomSignatory } from '../../types';

export const SchoolProfileView: React.FC = () => {
  const { schoolProfile, updateSchoolProfile } = useSbmData();
  const { isSuperAdmin, isCoordinator, isSchoolHead, allUsers } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Logo Editing Modal State
  const [isEditingLogo, setIsEditingLogo] = useState(false);
  const [logoInputUrl, setLogoInputUrl] = useState(schoolProfile?.logoUrl || schoolProfile?.schoolLogo || '');
  const [logoPreview, setLogoPreview] = useState(schoolProfile?.logoUrl || schoolProfile?.schoolLogo || '');
  
  // Full Profile & Settings Modal State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<'general' | 'signatories' | 'coordinators' | 'facilities'>('general');

  const defaultDimensionCoordinators: DimensionCoordinator[] = [
    {
      dimensionId: 1,
      dimensionName: 'Curriculum, Instruction & Assessment',
      leadName: 'Dr. Angela T. Bautista',
      designation: 'Head Teacher III / MT-II (Curriculum Lead)',
      email: 'angela.bautista@depedqc.ph'
    },
    {
      dimensionId: 2,
      dimensionName: 'Learning Environment',
      leadName: 'Engr. Roberto M. Reyes',
      designation: 'Physical Facilities Coordinator / MT-I',
      email: 'roberto.reyes@depedqc.ph'
    },
    {
      dimensionId: 3,
      dimensionName: 'Leadership & Governance',
      leadName: 'Ma. Theresa P. Dizon',
      designation: 'Department Head - Araling Panlipunan',
      email: 'theresa.dizon@depedqc.ph'
    },
    {
      dimensionId: 4,
      dimensionName: 'Community Partnerships & Resource Management',
      leadName: 'Ferdinand L. Villanueva',
      designation: 'Senior High School Focal Person / MT-I',
      email: 'ferdinand.villanueva@depedqc.ph'
    }
  ];

  const [profileForm, setProfileForm] = useState<{
    schoolName: string;
    schoolId: string;
    principalName: string;
    schoolHeadTitle: string;
    sbmCoordinator: string;
    sbmCoordinatorTitle: string;
    assistantPrincipal: string;
    assistantPrincipalTitle: string;
    divisionValidator: string;
    divisionValidatorTitle: string;
    divisionSuperintendent: string;
    divisionSuperintendentTitle: string;
    dimensionCoordinators: DimensionCoordinator[];
    customSignatories: CustomSignatory[];
    address: string;
    division: string;
    region: string;
    district: string;
    email: string;
    telephone: string;
    totalLearners: number;
    teachingPersonnel: number;
    nonTeachingPersonnel: number;
    classrooms: number;
    scienceLaboratories: number;
    computerLaboratories: number;
    depEdVision: string;
    depEdMission: string;
    depEdMandate: string;
  }>({
    schoolName: schoolProfile?.schoolName || schoolProfile?.name || 'Quirino High School',
    schoolId: schoolProfile?.schoolId || '300539',
    principalName: schoolProfile?.principalName || schoolProfile?.schoolHead || 'Dr. Lourdes R. Sese',
    schoolHeadTitle: schoolProfile?.schoolHeadTitle || 'Secondary School Principal IV',
    sbmCoordinator: schoolProfile?.sbmCoordinator || 'Dr. Marilou C. Alcantara',
    sbmCoordinatorTitle: schoolProfile?.sbmCoordinatorTitle || 'School SBM Coordinator / Master Teacher II',
    assistantPrincipal: schoolProfile?.assistantPrincipal !== undefined ? schoolProfile.assistantPrincipal : 'Dr. Marilou C. Alcantara',
    assistantPrincipalTitle: schoolProfile?.assistantPrincipalTitle !== undefined ? schoolProfile.assistantPrincipalTitle : 'Assistant Principal for Academics',
    divisionValidator: schoolProfile?.divisionValidator !== undefined ? schoolProfile.divisionValidator : 'Dr. Maria Elena V. Gonzales',
    divisionValidatorTitle: schoolProfile?.divisionValidatorTitle !== undefined ? schoolProfile.divisionValidatorTitle : 'Division SBM Validator / EPS - SDO QC',
    divisionSuperintendent: schoolProfile?.divisionSuperintendent !== undefined ? schoolProfile.divisionSuperintendent : 'Carleen S. Sedilla, CESO V',
    divisionSuperintendentTitle: schoolProfile?.divisionSuperintendentTitle !== undefined ? schoolProfile.divisionSuperintendentTitle : 'Schools Division Superintendent',
    dimensionCoordinators: schoolProfile?.dimensionCoordinators !== undefined ? schoolProfile.dimensionCoordinators : defaultDimensionCoordinators,
    customSignatories: schoolProfile?.customSignatories || [],
    address: schoolProfile?.address || 'Molave St., Project 3, Quezon City, Metro Manila, Philippines',
    division: schoolProfile?.division || 'Division of City Schools - Quezon City',
    region: schoolProfile?.region || 'National Capital Region (NCR)',
    district: schoolProfile?.district || 'District III',
    email: schoolProfile?.email || 'quirinohs.qc@deped.gov.ph',
    telephone: schoolProfile?.telephone || schoolProfile?.contactNumber || '(02) 8921-4320 / (02) 8928-1145',
    totalLearners: schoolProfile?.totalLearners ?? schoolProfile?.enrollmentSummary?.total ?? 5392,
    teachingPersonnel: schoolProfile?.teachingPersonnel ?? schoolProfile?.personnelSummary?.teachingPersonnel ?? 188,
    nonTeachingPersonnel: schoolProfile?.nonTeachingPersonnel ?? schoolProfile?.personnelSummary?.nonTeachingPersonnel ?? 24,
    classrooms: schoolProfile?.classrooms ?? schoolProfile?.facilitiesSummary?.instructionalClassrooms ?? 78,
    scienceLaboratories: schoolProfile?.scienceLaboratories ?? schoolProfile?.facilitiesSummary?.scienceLaboratories ?? 3,
    computerLaboratories: schoolProfile?.computerLaboratories ?? schoolProfile?.facilitiesSummary?.computerLaboratories ?? 4,
    depEdVision: schoolProfile?.depEdVision || schoolProfile?.vision || 'We dream of Filipinos who passionately love their country and whose values and competencies enable them to realize their full potential and contribute meaningfully to building the nation.',
    depEdMission: schoolProfile?.depEdMission || schoolProfile?.mission || 'To protect and promote the right of every Filipino to quality, equitable, culture-based, and complete basic education where students learn in a child-friendly, gender-sensitive, safe, and motivating environment.',
    depEdMandate: schoolProfile?.depEdMandate || schoolProfile?.mandate || 'The Department of Education was established under Executive Order No. 94, as amended by Republic Act No. 9155 (Governance of Basic Education Act of 2001) to protect and promote basic education governance across schools.',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const canEdit = isSuperAdmin || isCoordinator || isSchoolHead;

  const schoolName = schoolProfile?.schoolName || schoolProfile?.name || 'Quirino High School';
  const schoolId = schoolProfile?.schoolId || '300539';
  const principalName = schoolProfile?.principalName || schoolProfile?.schoolHead || 'Dr. Lourdes R. Sese';
  const schoolHeadTitle = schoolProfile?.schoolHeadTitle || 'Secondary School Principal IV';
  const sbmCoordinator = schoolProfile?.sbmCoordinator || 'Dr. Marilou C. Alcantara';
  const sbmCoordinatorTitle = schoolProfile?.sbmCoordinatorTitle || 'School SBM Coordinator / Master Teacher II';
  const assistantPrincipal = schoolProfile?.assistantPrincipal !== undefined ? schoolProfile.assistantPrincipal : 'Dr. Marilou C. Alcantara';
  const assistantPrincipalTitle = schoolProfile?.assistantPrincipalTitle !== undefined ? schoolProfile.assistantPrincipalTitle : 'Assistant Principal for Academics';
  const divisionValidator = schoolProfile?.divisionValidator !== undefined ? schoolProfile.divisionValidator : 'Dr. Maria Elena V. Gonzales';
  const divisionValidatorTitle = schoolProfile?.divisionValidatorTitle !== undefined ? schoolProfile.divisionValidatorTitle : 'Division SBM Validator / EPS - SDO QC';
  const divisionSuperintendent = schoolProfile?.divisionSuperintendent !== undefined ? schoolProfile.divisionSuperintendent : 'Carleen S. Sedilla, CESO V';
  const divisionSuperintendentTitle = schoolProfile?.divisionSuperintendentTitle !== undefined ? schoolProfile.divisionSuperintendentTitle : 'Schools Division Superintendent';
  const dimensionCoordinators = schoolProfile?.dimensionCoordinators !== undefined ? schoolProfile.dimensionCoordinators : defaultDimensionCoordinators;
  const customSignatories = schoolProfile?.customSignatories || [];
  const totalLearners = schoolProfile?.totalLearners ?? schoolProfile?.enrollmentSummary?.total ?? 5392;
  const teachingPersonnel = schoolProfile?.teachingPersonnel ?? schoolProfile?.personnelSummary?.teachingPersonnel ?? 188;
  const nonTeachingPersonnel = schoolProfile?.nonTeachingPersonnel ?? schoolProfile?.personnelSummary?.nonTeachingPersonnel ?? 24;
  const classrooms = schoolProfile?.classrooms ?? schoolProfile?.facilitiesSummary?.instructionalClassrooms ?? 78;
  const sciLabs = schoolProfile?.scienceLaboratories ?? schoolProfile?.facilitiesSummary?.scienceLaboratories ?? 3;
  const compLabs = schoolProfile?.computerLaboratories ?? schoolProfile?.facilitiesSummary?.computerLaboratories ?? 4;
  const depEdVision = schoolProfile?.depEdVision || schoolProfile?.vision || 'We dream of Filipinos who passionately love their country...';
  const depEdMission = schoolProfile?.depEdMission || schoolProfile?.mission || 'To protect and promote the right of every Filipino to quality...';
  const depEdCoreValues = schoolProfile?.depEdCoreValues || schoolProfile?.coreValues || ['Maka-Diyos', 'Maka-tao', 'Makakalikasan', 'Makabansa'];
  const depEdMandate = schoolProfile?.depEdMandate || schoolProfile?.mandate || 'The Department of Education was established...';
  const curricularOfferings = schoolProfile?.curricularOfferings || [
    'Regular Junior High School Curriculum (Grades 7 to 10)',
    'Special Program in Journalism (SPJ)',
    'Special Program in the Arts (SPA)',
    'Special Science Class (STE)',
    'SHS STEM / ABM / HUMSS / GAS Tracks',
    'TVL ICT & Home Economics Strands',
    'School-Based ALS (Alternative Learning System)',
    'SPED Inclusion & Open High School Program'
  ];
  const address = schoolProfile?.address || 'Molave St., Project 3, Quezon City, Metro Manila, Philippines';
  const division = schoolProfile?.division || 'Division of City Schools - Quezon City';
  const region = schoolProfile?.region || 'National Capital Region (NCR)';
  const email = schoolProfile?.email || 'quirinohs.qc@deped.gov.ph';
  const telephone = schoolProfile?.telephone || schoolProfile?.contactNumber || '(02) 8921-4320 / (02) 8928-1145';

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setLogoPreview(result);
        setLogoInputUrl(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveLogo = async () => {
    setIsSaving(true);
    try {
      await updateSchoolProfile({
        logoUrl: logoPreview,
        schoolLogo: logoPreview
      });
      setSaveMessage('School Logo successfully updated!');
      setTimeout(() => {
        setSaveMessage('');
        setIsEditingLogo(false);
      }, 1200);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenEditProfile = (initialTab: 'general' | 'signatories' | 'coordinators' | 'facilities' = 'general') => {
    setActiveModalTab(initialTab);
    setProfileForm({
      schoolName: schoolProfile?.schoolName || schoolProfile?.name || 'Quirino High School',
      schoolId: schoolProfile?.schoolId || '300539',
      principalName: schoolProfile?.principalName || schoolProfile?.schoolHead || 'Dr. Lourdes R. Sese',
      schoolHeadTitle: schoolProfile?.schoolHeadTitle || 'Secondary School Principal IV',
      sbmCoordinator: schoolProfile?.sbmCoordinator || 'Dr. Marilou C. Alcantara',
      sbmCoordinatorTitle: schoolProfile?.sbmCoordinatorTitle || 'School SBM Coordinator / Master Teacher II',
      assistantPrincipal: schoolProfile?.assistantPrincipal !== undefined ? schoolProfile.assistantPrincipal : 'Dr. Marilou C. Alcantara',
      assistantPrincipalTitle: schoolProfile?.assistantPrincipalTitle !== undefined ? schoolProfile.assistantPrincipalTitle : 'Assistant Principal for Academics',
      divisionValidator: schoolProfile?.divisionValidator !== undefined ? schoolProfile.divisionValidator : 'Dr. Maria Elena V. Gonzales',
      divisionValidatorTitle: schoolProfile?.divisionValidatorTitle !== undefined ? schoolProfile.divisionValidatorTitle : 'Division SBM Validator / EPS - SDO QC',
      divisionSuperintendent: schoolProfile?.divisionSuperintendent !== undefined ? schoolProfile.divisionSuperintendent : 'Carleen S. Sedilla, CESO V',
      divisionSuperintendentTitle: schoolProfile?.divisionSuperintendentTitle !== undefined ? schoolProfile.divisionSuperintendentTitle : 'Schools Division Superintendent',
      dimensionCoordinators: schoolProfile?.dimensionCoordinators !== undefined && schoolProfile.dimensionCoordinators.length > 0 
        ? schoolProfile.dimensionCoordinators 
        : defaultDimensionCoordinators,
      customSignatories: schoolProfile?.customSignatories || [],
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
      depEdVision: schoolProfile?.depEdVision || schoolProfile?.vision || '',
      depEdMission: schoolProfile?.depEdMission || schoolProfile?.mission || '',
      depEdMandate: schoolProfile?.depEdMandate || schoolProfile?.mandate || '',
    });
    setIsEditingProfile(true);
  };

  // Delete an official executive signatory in the modal form
  const handleDeleteSignatory = (roleKey: 'assistantPrincipal' | 'divisionValidator' | 'divisionSuperintendent') => {
    const roleLabels = {
      assistantPrincipal: 'Assistant Principal',
      divisionValidator: 'Division SBM Validator',
      divisionSuperintendent: 'Schools Division Superintendent'
    };
    if (window.confirm(`Remove ${roleLabels[roleKey]} from the official signatories list?`)) {
      setProfileForm((prev) => ({
        ...prev,
        [roleKey]: '',
        [`${roleKey}Title`]: ''
      }));
    }
  };

  // Restore/Re-add an official executive signatory in the modal form
  const handleRestoreSignatory = (roleKey: 'assistantPrincipal' | 'divisionValidator' | 'divisionSuperintendent') => {
    const defaults = {
      assistantPrincipal: { name: 'Dr. Marilou C. Alcantara', title: 'Assistant Principal for Academics' },
      divisionValidator: { name: 'Dr. Maria Elena V. Gonzales', title: 'Division SBM Validator / EPS - SDO QC' },
      divisionSuperintendent: { name: 'Carleen S. Sedilla, CESO V', title: 'Schools Division Superintendent' }
    };
    setProfileForm((prev) => ({
      ...prev,
      [roleKey]: defaults[roleKey].name,
      [`${roleKey}Title`]: defaults[roleKey].title
    }));
  };

  // Direct delete from the main page roster card
  const handleDirectDeleteSignatory = async (roleKey: 'assistantPrincipal' | 'divisionValidator' | 'divisionSuperintendent') => {
    const roleLabels = {
      assistantPrincipal: 'Assistant Principal',
      divisionValidator: 'Division SBM Validator',
      divisionSuperintendent: 'Schools Division Superintendent'
    };
    if (window.confirm(`Remove ${roleLabels[roleKey]} from official signatories and reporting documents?`)) {
      await updateSchoolProfile({
        [roleKey]: '',
        [`${roleKey}Title`]: ''
      });
    }
  };

  // Delete a dimension coordinator in the modal
  const handleDeleteCoordinator = (index: number) => {
    const coord = profileForm.dimensionCoordinators[index];
    const name = coord?.leadName || `Dimension ${coord?.dimensionId} Coordinator`;
    if (window.confirm(`Remove ${name} from Dimension Coordinators?`)) {
      const updated = profileForm.dimensionCoordinators.filter((_, i) => i !== index);
      setProfileForm((prev) => ({
        ...prev,
        dimensionCoordinators: updated
      }));
    }
  };

  // Direct delete a dimension coordinator from the main page roster card
  const handleDirectDeleteCoordinator = async (dimensionId: number, name: string) => {
    if (window.confirm(`Remove ${name} as coordinator for Dimension ${dimensionId}?`)) {
      const updated = (schoolProfile?.dimensionCoordinators || defaultDimensionCoordinators).filter(
        (c) => c.dimensionId !== dimensionId
      );
      await updateSchoolProfile({
        dimensionCoordinators: updated
      });
    }
  };

  // Add a new dimension coordinator in the modal
  const handleAddCoordinator = () => {
    const currentList = profileForm.dimensionCoordinators || [];
    const nextDimId = currentList.length > 0 ? Math.max(...currentList.map((c) => c.dimensionId || 0)) + 1 : 1;
    const newCoord: DimensionCoordinator = {
      dimensionId: nextDimId,
      dimensionName: `Dimension ${nextDimId}: Committee`,
      leadName: '',
      designation: 'Master Teacher / Committee Focal Person',
      email: ''
    };
    setProfileForm((prev) => ({
      ...prev,
      dimensionCoordinators: [...currentList, newCoord]
    }));
  };

  // Custom Signatories helpers
  const handleAddCustomSignatory = () => {
    const newSig: CustomSignatory = {
      id: `sig-${Date.now()}`,
      roleLabel: 'Additional Signatory (e.g. PTA President)',
      name: '',
      title: 'Designation / Office'
    };
    setProfileForm((prev) => ({
      ...prev,
      customSignatories: [...(prev.customSignatories || []), newSig]
    }));
  };

  const handleDeleteCustomSignatory = (id: string) => {
    setProfileForm((prev) => ({
      ...prev,
      customSignatories: (prev.customSignatories || []).filter((s) => s.id !== id)
    }));
  };

  const handleUpdateCustomSignatory = (id: string, field: keyof CustomSignatory, value: string) => {
    setProfileForm((prev) => ({
      ...prev,
      customSignatories: (prev.customSignatories || []).map((s) => (s.id === id ? { ...s, [field]: value } : s))
    }));
  };

  const handleDirectDeleteCustomSignatory = async (id: string, name: string) => {
    if (window.confirm(`Remove signatory "${name || 'entry'}" from official signatories list?`)) {
      const updated = (schoolProfile?.customSignatories || []).filter((s) => s.id !== id);
      await updateSchoolProfile({
        customSignatories: updated
      });
    }
  };

  const handleUpdateCoordinator = (index: number, field: string, value: string) => {
    const updated = [...profileForm.dimensionCoordinators];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    setProfileForm({
      ...profileForm,
      dimensionCoordinators: updated
    });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSchoolProfile({
        schoolName: profileForm.schoolName,
        name: profileForm.schoolName,
        schoolId: profileForm.schoolId,
        principalName: profileForm.principalName,
        schoolHead: profileForm.principalName,
        schoolHeadTitle: profileForm.schoolHeadTitle,
        sbmCoordinator: profileForm.sbmCoordinator,
        sbmCoordinatorTitle: profileForm.sbmCoordinatorTitle,
        assistantPrincipal: profileForm.assistantPrincipal,
        assistantPrincipalTitle: profileForm.assistantPrincipalTitle,
        divisionValidator: profileForm.divisionValidator,
        divisionValidatorTitle: profileForm.divisionValidatorTitle,
        divisionSuperintendent: profileForm.divisionSuperintendent,
        divisionSuperintendentTitle: profileForm.divisionSuperintendentTitle,
        dimensionCoordinators: profileForm.dimensionCoordinators,
        customSignatories: profileForm.customSignatories,
        address: profileForm.address,
        division: profileForm.division,
        region: profileForm.region,
        district: profileForm.district,
        email: profileForm.email,
        telephone: profileForm.telephone,
        contactNumber: profileForm.telephone,
        totalLearners: Number(profileForm.totalLearners),
        teachingPersonnel: Number(profileForm.teachingPersonnel),
        nonTeachingPersonnel: Number(profileForm.nonTeachingPersonnel),
        classrooms: Number(profileForm.classrooms),
        scienceLaboratories: Number(profileForm.scienceLaboratories),
        computerLaboratories: Number(profileForm.computerLaboratories),
        depEdVision: profileForm.depEdVision,
        depEdMission: profileForm.depEdMission,
        depEdMandate: profileForm.depEdMandate
      });
      setSaveMessage('School Profile, Signatories & Coordinators successfully saved!');
      setTimeout(() => {
        setSaveMessage('');
        setIsEditingProfile(false);
      }, 1200);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div id="school-profile-view" className="space-y-6">
      {/* Header Banner with Soothing Dark Forest Green & Heritage Gold */}
      <div className="bg-gradient-to-r from-[#0A291A] via-[#0E3824] to-[#081F14] rounded-2xl p-6 sm:p-8 text-[#FFFDF9] shadow-xl border border-[#D4AF37]/35 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {/* School Logo Section */}
            <div className="relative group">
              {schoolProfile?.logoUrl || schoolProfile?.schoolLogo ? (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#061810] border-2 border-[#D4AF37] p-1.5 shadow-2xl flex items-center justify-center overflow-hidden">
                  <img
                    src={schoolProfile.logoUrl || schoolProfile.schoolLogo}
                    alt="Official School Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#061810] border-2 border-[#D4AF37] p-2 shadow-2xl flex flex-col items-center justify-center text-[#F0D283]">
                  <School className="w-10 h-10 mb-1 text-[#D4AF37]" />
                  <span className="font-black text-xs">QHS LOGO</span>
                </div>
              )}

              {canEdit && (
                <button
                  id="edit-school-logo-btn"
                  type="button"
                  onClick={() => {
                    setLogoPreview(schoolProfile?.logoUrl || schoolProfile?.schoolLogo || '');
                    setLogoInputUrl(schoolProfile?.logoUrl || schoolProfile?.schoolLogo || '');
                    setIsEditingLogo(true);
                  }}
                  className="absolute -bottom-2 -right-2 p-2 bg-[#D4AF37] hover:bg-[#F0D283] text-[#061810] rounded-xl shadow-lg transition-transform hover:scale-105"
                  title="Upload / Change School Logo"
                >
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* School Title & Details */}
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F0D283] text-xs font-semibold">
                <span>{division} • {region}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#FFFDF9]">
                {schoolName}
              </h2>
              <p className="text-xs sm:text-sm text-[#D1E7DD] font-medium">
                Official School ID: <strong className="text-[#F0D283]">{schoolId}</strong> • Classification: Pure Public Secondary High School
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {canEdit && (
                  <button
                    id="open-profile-settings-btn"
                    onClick={handleOpenEditProfile}
                    className="gold-btn inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-md transition-transform"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit School Details & Personnel</span>
                  </button>
                )}
                {canEdit && (
                  <button
                    id="open-logo-modal-link-btn"
                    onClick={() => {
                      setLogoPreview(schoolProfile?.logoUrl || schoolProfile?.schoolLogo || '');
                      setLogoInputUrl(schoolProfile?.logoUrl || schoolProfile?.schoolLogo || '');
                      setIsEditingLogo(true);
                    }}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#061810]/70 hover:bg-[#0E3322] border border-[#D4AF37]/35 text-xs text-[#F0D283] font-semibold transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{schoolProfile?.logoUrl ? 'Update School Logo' : 'Upload School Logo'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Principal Badge */}
          <div className="p-4 bg-[#061810]/90 backdrop-blur-xs rounded-2xl border border-[#D4AF37]/35 text-center flex-shrink-0 min-w-[220px] shadow-lg">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#F0D283] block">
              School Principal
            </span>
            <span className="text-sm font-black text-[#FFFDF9] block mt-0.5">
              {principalName}
            </span>
            <span className="text-[11px] text-[#A7D7C1] block mt-0.5 font-medium">{schoolHeadTitle}</span>
            <div className="mt-2 pt-2 border-t border-[#D4AF37]/20 text-[10px] text-[#8FBCA7]">
              SBM Lead: <strong className="text-[#FFFDF9]">{sbmCoordinator}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#0D2E1F]/90 p-5 rounded-2xl border border-[#D4AF37]/30 shadow-md space-y-1">
          <div className="flex items-center space-x-2 text-[#8FBCA7]">
            <Users className="w-4 h-4 text-[#F0D283]" />
            <span className="text-xs font-bold uppercase text-[#F0D283]">Total Learners</span>
          </div>
          <p className="text-2xl font-black text-[#FFFDF9]">{(totalLearners || 0).toLocaleString()}</p>
          <span className="text-[11px] text-[#8FBCA7]">JHS & SHS Enrollees</span>
        </div>

        <div className="bg-[#0D2E1F]/90 p-5 rounded-2xl border border-[#D4AF37]/30 shadow-md space-y-1">
          <div className="flex items-center space-x-2 text-[#8FBCA7]">
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase text-emerald-400">Faculty & Staff</span>
          </div>
          <p className="text-2xl font-black text-emerald-400">
            {teachingPersonnel + nonTeachingPersonnel}
          </p>
          <span className="text-[11px] text-[#8FBCA7]">
            {teachingPersonnel} Teachers • {nonTeachingPersonnel} Non-Teaching
          </span>
        </div>

        <div className="bg-[#0D2E1F]/90 p-5 rounded-2xl border border-[#D4AF37]/30 shadow-md space-y-1">
          <div className="flex items-center space-x-2 text-[#8FBCA7]">
            <Building className="w-4 h-4 text-[#F0D283]" />
            <span className="text-xs font-bold uppercase text-[#F0D283]">Classrooms</span>
          </div>
          <p className="text-2xl font-black text-[#FFFDF9]">{classrooms}</p>
          <span className="text-[11px] text-[#8FBCA7]">Instructional Classrooms</span>
        </div>

        <div className="bg-[#0D2E1F]/90 p-5 rounded-2xl border border-[#D4AF37]/30 shadow-md space-y-1">
          <div className="flex items-center space-x-2 text-[#8FBCA7]">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase text-amber-400">Special Labs</span>
          </div>
          <p className="text-2xl font-black text-amber-400">
            {sciLabs + compLabs}
          </p>
          <span className="text-[11px] text-[#8FBCA7]">Sci & Comp Tech Labs</span>
        </div>
      </div>

      {/* DepEd Mission, Vision, Core Values & Mandate */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* DepEd Vision & Mission */}
        <div className="bg-[#0D2E1F]/90 rounded-2xl p-6 border border-[#D4AF37]/30 shadow-md space-y-4">
          <div className="flex items-center space-x-2">
            <Compass className="w-5 h-5 text-[#F0D283]" />
            <h3 className="text-base font-bold text-[#FFFDF9]">
              Department of Education Vision & Mission
            </h3>
          </div>

          <div className="space-y-3 text-xs text-[#E2F0EA] leading-relaxed">
            <div className="p-4 bg-[#092217]/90 rounded-xl border border-[#D4AF37]/25 space-y-1">
              <span className="font-bold text-[#F0D283] block text-xs uppercase tracking-wider">
                The DepEd Vision
              </span>
              <p>"{depEdVision}"</p>
            </div>

            <div className="p-4 bg-[#092217]/90 rounded-xl border border-[#D4AF37]/25 space-y-1">
              <span className="font-bold text-[#F0D283] block text-xs uppercase tracking-wider">
                The DepEd Mission
              </span>
              <p>"{depEdMission}"</p>
            </div>
          </div>
        </div>

        {/* DepEd Core Values & Mandate */}
        <div className="bg-[#0D2E1F]/90 rounded-2xl p-6 border border-[#D4AF37]/30 shadow-md space-y-4">
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-[#FFFDF9]">
              DepEd Core Values & Legal Mandate
            </h3>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              {depEdCoreValues.map((val) => (
                <div
                  key={val}
                  className="p-3 bg-[#092217]/90 rounded-xl border border-[#D4AF37]/30 font-bold text-[#F0D283] shadow-2xs"
                >
                  {val}
                </div>
              ))}
            </div>

            <div className="p-4 bg-[#092217]/90 rounded-xl border border-[#D4AF37]/25 text-xs text-[#E2F0EA] space-y-1">
              <span className="font-bold text-[#F0D283] block text-xs uppercase tracking-wider">
                Constitutional & Legal Mandate
              </span>
              <p className="leading-relaxed">"{depEdMandate}"</p>
            </div>
          </div>
        </div>
      </div>

      {/* Curricular Offerings & Facilities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Curricular Offerings */}
        <div className="bg-[#0D2E1F]/90 rounded-2xl p-6 border border-[#D4AF37]/30 shadow-md space-y-3">
          <h3 className="text-sm font-bold text-[#FFFDF9] flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-[#F0D283]" />
            <span>Curricular Offerings & Special Programs</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {curricularOfferings.map((prog) => (
              <div
                key={prog}
                className="p-2.5 bg-[#092217]/90 border border-[#D4AF37]/20 rounded-xl flex items-center space-x-2 text-[#E2F0EA] font-medium"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{prog}</span>
              </div>
            ))}
          </div>
        </div>

        {/* School Facilities & Contact Info */}
        <div className="bg-[#0D2E1F]/90 rounded-2xl p-6 border border-[#D4AF37]/30 shadow-md space-y-3">
          <h3 className="text-sm font-bold text-[#FFFDF9] flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-[#F0D283]" />
            <span>Official School Location & Contact Details</span>
          </h3>

          <div className="space-y-2 text-xs text-[#E2F0EA]">
            <div className="p-3 bg-[#092217]/90 rounded-xl border border-[#D4AF37]/25 space-y-1">
              <div className="flex items-center space-x-2 font-semibold text-[#FFFDF9]">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0" />
                <span>{address}</span>
              </div>
              <div className="text-[#8FBCA7] text-[11px]">
                Schools Division Office: {division} • Region: {region}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-2.5 bg-[#092217]/90 rounded-xl border border-[#D4AF37]/20 flex items-center space-x-2 text-[11px]">
                <Mail className="w-3.5 h-3.5 text-[#F0D283] flex-shrink-0" />
                <span className="truncate">{email}</span>
              </div>
              <div className="p-2.5 bg-[#092217]/90 rounded-xl border border-[#D4AF37]/20 flex items-center space-x-2 text-[11px]">
                <Phone className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>{telephone}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DepEd Leadership, SBM Coordinators & Official Signatories Roster */}
      <div className="bg-[#0D2E1F]/90 rounded-2xl p-6 border border-[#D4AF37]/35 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D4AF37]/25 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-[#F0D283]" />
              <h3 className="text-base font-bold text-[#FFFDF9]">
                Official School Leadership, SBM Coordinators & DepEd Signatories Roster
              </h3>
            </div>
            <p className="text-xs text-[#8FBCA7]">
              Designated school authorities and dimension committee leads who prepare, certify, and validate official SBM reports and scorecards.
            </p>
          </div>
          {canEdit && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleOpenEditProfile('signatories')}
                className="gold-btn inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-md"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Signatories</span>
              </button>
              <button
                type="button"
                onClick={() => handleOpenEditProfile('coordinators')}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#061810]/70 hover:bg-[#0E3322] border border-[#D4AF37]/35 text-xs text-[#F0D283] font-semibold transition-colors"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Edit Dimension Leads</span>
              </button>
            </div>
          )}
        </div>

        {/* Executive Signatories Grid */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F0D283] flex items-center space-x-2">
              <Shield className="w-4 h-4 text-[#D4AF37]" />
              <span>School Executive & Division Signatories</span>
              <span className="ml-2 px-2 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#F0D283] border border-[#D4AF37]/30 text-[10px] font-semibold">
                {[
                  principalName,
                  sbmCoordinator,
                  assistantPrincipal,
                  divisionValidator,
                  divisionSuperintendent,
                  ...(customSignatories || []).map((s) => s.name)
                ].filter((n) => n && n.trim() !== '').length} Active Signatories
              </span>
            </h4>
            {canEdit && (
              <button
                type="button"
                onClick={() => handleOpenEditProfile('signatories')}
                className="text-[11px] text-[#F0D283] hover:text-[#FFFDF9] underline flex items-center space-x-1"
              >
                <span>Manage Signatories</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5 text-xs">
            {/* Principal */}
            <div className="p-4 bg-[#092217]/90 rounded-xl border-2 border-[#D4AF37]/40 shadow-sm space-y-1 relative">
              <span className="text-[10px] font-bold text-[#F0D283] uppercase tracking-wider block">
                School Principal / Head
              </span>
              <p className="text-sm font-black text-[#FFFDF9] leading-tight">{principalName}</p>
              <p className="text-[11px] text-[#A7D7C1] font-medium">{schoolHeadTitle}</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] bg-[#D4AF37]/15 text-[#F0D283] border border-[#D4AF37]/30">
                School ID: {schoolId}
              </span>
            </div>

            {/* SBM Coordinator */}
            <div className="p-4 bg-[#092217]/90 rounded-xl border border-[#D4AF37]/30 shadow-sm space-y-1 relative">
              <span className="text-[10px] font-bold text-[#F0D283] uppercase tracking-wider block">
                School SBM Coordinator
              </span>
              <p className="text-sm font-black text-[#FFFDF9] leading-tight">{sbmCoordinator}</p>
              <p className="text-[11px] text-[#A7D7C1] font-medium">{sbmCoordinatorTitle}</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                Focal Lead
              </span>
            </div>

            {/* Assistant Principal - only displayed if not deleted */}
            {assistantPrincipal && assistantPrincipal.trim() !== '' && (
              <div className="p-4 bg-[#092217]/90 rounded-xl border border-[#D4AF37]/30 shadow-sm space-y-1 relative group">
                {canEdit && (
                  <button
                    type="button"
                    onClick={() => handleDirectDeleteSignatory('assistantPrincipal')}
                    title="Remove Assistant Principal from signatories"
                    className="absolute top-2.5 right-2.5 p-1 rounded-md text-[#8FBCA7] hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                <span className="text-[10px] font-bold text-[#F0D283] uppercase tracking-wider block pr-6">
                  Assistant Principal
                </span>
                <p className="text-sm font-black text-[#FFFDF9] leading-tight">{assistantPrincipal}</p>
                <p className="text-[11px] text-[#A7D7C1] font-medium">{assistantPrincipalTitle}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] bg-[#061810] text-[#8FBCA7] border border-[#D4AF37]/20">
                  Academics / Ops
                </span>
              </div>
            )}

            {/* Division SBM Validator - only displayed if not deleted */}
            {divisionValidator && divisionValidator.trim() !== '' && (
              <div className="p-4 bg-[#092217]/90 rounded-xl border border-[#D4AF37]/30 shadow-sm space-y-1 relative group">
                {canEdit && (
                  <button
                    type="button"
                    onClick={() => handleDirectDeleteSignatory('divisionValidator')}
                    title="Remove Division Validator from signatories"
                    className="absolute top-2.5 right-2.5 p-1 rounded-md text-[#8FBCA7] hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                <span className="text-[10px] font-bold text-[#F0D283] uppercase tracking-wider block pr-6">
                  SDO SBM Validator
                </span>
                <p className="text-sm font-black text-[#FFFDF9] leading-tight">{divisionValidator}</p>
                <p className="text-[11px] text-[#A7D7C1] font-medium">{divisionValidatorTitle}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] bg-blue-950/50 text-blue-300 border border-blue-500/30">
                  Division Level
                </span>
              </div>
            )}

            {/* Schools Division Superintendent - only displayed if not deleted */}
            {divisionSuperintendent && divisionSuperintendent.trim() !== '' && (
              <div className="p-4 bg-[#092217]/90 rounded-xl border border-[#D4AF37]/30 shadow-sm space-y-1 relative group">
                {canEdit && (
                  <button
                    type="button"
                    onClick={() => handleDirectDeleteSignatory('divisionSuperintendent')}
                    title="Remove Superintendent from signatories"
                    className="absolute top-2.5 right-2.5 p-1 rounded-md text-[#8FBCA7] hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                <span className="text-[10px] font-bold text-[#F0D283] uppercase tracking-wider block pr-6">
                  Schools Division Superintendent
                </span>
                <p className="text-sm font-black text-[#FFFDF9] leading-tight">{divisionSuperintendent}</p>
                <p className="text-[11px] text-[#A7D7C1] font-medium">{divisionSuperintendentTitle}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] bg-[#061810] text-[#F0D283] border border-[#D4AF37]/30">
                  Approving Authority
                </span>
              </div>
            )}

            {/* Custom Signatories */}
            {(customSignatories || []).map((sig) => (
              <div key={sig.id} className="p-4 bg-[#092217]/90 rounded-xl border border-[#D4AF37]/30 shadow-sm space-y-1 relative group">
                {canEdit && (
                  <button
                    type="button"
                    onClick={() => handleDirectDeleteCustomSignatory(sig.id, sig.name)}
                    title={`Remove ${sig.name || 'Signatory'}`}
                    className="absolute top-2.5 right-2.5 p-1 rounded-md text-[#8FBCA7] hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                <span className="text-[10px] font-bold text-[#F0D283] uppercase tracking-wider block pr-6">
                  {sig.roleLabel || 'Additional Signatory'}
                </span>
                <p className="text-sm font-black text-[#FFFDF9] leading-tight">{sig.name || '(No Name Provided)'}</p>
                <p className="text-[11px] text-[#A7D7C1] font-medium">{sig.title || sig.office || '-'}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] bg-[#061810] text-[#D1E7DD] border border-[#D4AF37]/20">
                  Custom
                </span>
              </div>
            ))}

            {/* Add / Manage Signatories Shortcut card if fewer than 5 */}
            {canEdit && (
              <button
                type="button"
                onClick={() => handleOpenEditProfile('signatories')}
                className="p-4 rounded-xl border border-dashed border-[#D4AF37]/40 hover:border-[#D4AF37] hover:bg-[#0E3322]/40 text-[#A7D7C1] hover:text-[#FFFDF9] flex flex-col items-center justify-center text-center space-y-1.5 transition-colors min-h-[105px]"
              >
                <Plus className="w-5 h-5 text-[#F0D283]" />
                <span className="text-xs font-semibold text-[#F0D283]">Add / Restore Signatories</span>
                <span className="text-[10px] text-[#8FBCA7]">Add, edit, or remove signatories</span>
              </button>
            )}
          </div>
        </div>

        {/* Dimension Coordinators Grid */}
        <div className="space-y-3 pt-2 border-t border-[#D4AF37]/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F0D283] flex items-center space-x-2">
              <Award className="w-4 h-4 text-[#D4AF37]" />
              <span>SBM Dimension Committee Coordinators</span>
              <span className="ml-2 px-2 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#F0D283] border border-[#D4AF37]/30 text-[10px] font-semibold">
                {dimensionCoordinators.length} Leads
              </span>
            </h4>
            {canEdit && (
              <button
                type="button"
                onClick={() => handleOpenEditProfile('coordinators')}
                className="text-[11px] text-[#F0D283] hover:text-[#FFFDF9] underline flex items-center space-x-1"
              >
                <span>Manage Dimension Leads</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
            {dimensionCoordinators.map((coord, idx) => (
              <div
                key={coord.dimensionId || idx}
                className="p-4 bg-[#092217]/90 rounded-xl border border-[#D4AF37]/25 shadow-sm space-y-2 hover:border-[#D4AF37]/50 transition-colors relative group"
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F0D283] font-black text-[10px]">
                    Dimension {coord.dimensionId}
                  </span>
                  {canEdit && (
                    <button
                      type="button"
                      onClick={() => handleDirectDeleteCoordinator(coord.dimensionId, coord.leadName)}
                      title={`Remove ${coord.leadName} as coordinator`}
                      className="p-1 rounded-md text-[#8FBCA7] hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div>
                  <h5 className="font-bold text-[#FFFDF9] text-xs leading-snug line-clamp-1" title={coord.dimensionName}>
                    {coord.dimensionName}
                  </h5>
                  <p className="text-sm font-black text-[#F0D283] mt-1">{coord.leadName || '(Unassigned)'}</p>
                  <p className="text-[11px] text-[#A7D7C1]">{coord.designation || '-'}</p>
                  {coord.email && (
                    <p className="text-[10px] text-[#8FBCA7] truncate mt-1 flex items-center space-x-1">
                      <Mail className="w-3 h-3 text-[#D4AF37]" />
                      <span>{coord.email}</span>
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* Quick Add Coordinator if less than 6 */}
            {canEdit && (
              <button
                type="button"
                onClick={() => handleOpenEditProfile('coordinators')}
                className="p-4 rounded-xl border border-dashed border-[#D4AF37]/40 hover:border-[#D4AF37] hover:bg-[#0E3322]/40 text-[#A7D7C1] hover:text-[#FFFDF9] flex flex-col items-center justify-center text-center space-y-1.5 transition-colors min-h-[105px]"
              >
                <Plus className="w-5 h-5 text-[#F0D283]" />
                <span className="text-xs font-semibold text-[#F0D283]">Manage Dimension Leads</span>
                <span className="text-[10px] text-[#8FBCA7]">Add, remove, or adjust coordinators</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* FULL SCHOOL PROFILE, SIGNATORIES & SETTINGS EDIT MODAL */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#0B2519] border border-[#D4AF37]/40 rounded-2xl max-w-4xl w-full p-6 shadow-2xl space-y-5 text-[#FFFDF9] my-8 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#D4AF37]/25 pb-3">
              <div className="flex items-center space-x-2">
                <Edit className="w-5 h-5 text-[#F0D283]" />
                <div>
                  <h3 className="text-base font-bold text-[#FFFDF9]">Edit School Profile, Signatories & Coordinators</h3>
                  <p className="text-xs text-[#8FBCA7]">Manage School ID, Principal, coordinators, leadership signatories, and facilities</p>
                </div>
              </div>
              <button
                id="close-profile-modal-btn"
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="p-1.5 rounded-lg text-[#8FBCA7] hover:text-[#FFFDF9] hover:bg-[#0E3322]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex border-b border-[#D4AF37]/20 pb-1 space-x-2 text-xs overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveModalTab('general')}
                className={`px-3 py-2 rounded-xl font-bold transition-colors ${
                  activeModalTab === 'general'
                    ? 'bg-[#D4AF37] text-[#061810]'
                    : 'text-[#D1E7DD] hover:bg-[#0E3322]'
                }`}
              >
                1. School Info & Address
              </button>
              <button
                type="button"
                onClick={() => setActiveModalTab('signatories')}
                className={`px-3 py-2 rounded-xl font-bold transition-colors ${
                  activeModalTab === 'signatories'
                    ? 'bg-[#D4AF37] text-[#061810]'
                    : 'text-[#D1E7DD] hover:bg-[#0E3322]'
                }`}
              >
                2. Principal & Signatories
              </button>
              <button
                type="button"
                onClick={() => setActiveModalTab('coordinators')}
                className={`px-3 py-2 rounded-xl font-bold transition-colors ${
                  activeModalTab === 'coordinators'
                    ? 'bg-[#D4AF37] text-[#061810]'
                    : 'text-[#D1E7DD] hover:bg-[#0E3322]'
                }`}
              >
                3. SBM Dimension Coordinators
              </button>
              <button
                type="button"
                onClick={() => setActiveModalTab('facilities')}
                className={`px-3 py-2 rounded-xl font-bold transition-colors ${
                  activeModalTab === 'facilities'
                    ? 'bg-[#D4AF37] text-[#061810]'
                    : 'text-[#D1E7DD] hover:bg-[#0E3322]'
                }`}
              >
                4. Figures & Facilities
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              {/* Tab 1: General School Info */}
              {activeModalTab === 'general' && (
                <div className="space-y-4">
                  <div className="p-4 bg-[#061810]/80 rounded-xl border border-[#D4AF37]/20 space-y-3">
                    <span className="font-bold text-[#F0D283] block uppercase tracking-wider text-[11px]">
                      DepEd Identification
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[#E2F0EA] mb-1 font-semibold">Official School Name</label>
                        <input
                          type="text"
                          value={profileForm.schoolName}
                          onChange={(e) => setProfileForm({ ...profileForm, schoolName: e.target.value })}
                          required
                          className="w-full p-2.5 bg-[#092217] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#E2F0EA] mb-1 font-semibold">DepEd School ID</label>
                        <input
                          type="text"
                          value={profileForm.schoolId}
                          onChange={(e) => setProfileForm({ ...profileForm, schoolId: e.target.value })}
                          required
                          className="w-full p-2.5 bg-[#092217] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-[#061810]/80 rounded-xl border border-[#D4AF37]/20 space-y-3">
                    <span className="font-bold text-[#F0D283] block uppercase tracking-wider text-[11px]">
                      Location & Contact Details
                    </span>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[#E2F0EA] mb-1 font-semibold">Complete School Address</label>
                        <input
                          type="text"
                          value={profileForm.address}
                          onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                          required
                          className="w-full p-2.5 bg-[#092217] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[#E2F0EA] mb-1 font-semibold">Official School Email</label>
                          <input
                            type="email"
                            value={profileForm.email}
                            onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                            required
                            className="w-full p-2.5 bg-[#092217] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>
                        <div>
                          <label className="block text-[#E2F0EA] mb-1 font-semibold">Contact / Telephone Number</label>
                          <input
                            type="text"
                            value={profileForm.telephone}
                            onChange={(e) => setProfileForm({ ...profileForm, telephone: e.target.value })}
                            required
                            className="w-full p-2.5 bg-[#092217] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[#E2F0EA] mb-1 font-semibold">Schools Division Office (SDO)</label>
                          <input
                            type="text"
                            value={profileForm.division}
                            onChange={(e) => setProfileForm({ ...profileForm, division: e.target.value })}
                            className="w-full p-2.5 bg-[#092217] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>
                        <div>
                          <label className="block text-[#E2F0EA] mb-1 font-semibold">DepEd Region</label>
                          <input
                            type="text"
                            value={profileForm.region}
                            onChange={(e) => setProfileForm({ ...profileForm, region: e.target.value })}
                            className="w-full p-2.5 bg-[#092217] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>
                        <div>
                          <label className="block text-[#E2F0EA] mb-1 font-semibold">Congressional / School District</label>
                          <input
                            type="text"
                            value={profileForm.district}
                            onChange={(e) => setProfileForm({ ...profileForm, district: e.target.value })}
                            className="w-full p-2.5 bg-[#092217] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Leadership & Signatories */}
              {activeModalTab === 'signatories' && (
                <div className="space-y-4">
                  <div className="p-3 bg-emerald-950/30 rounded-xl border border-emerald-500/30 text-[#D1E7DD] text-xs flex items-start space-x-2">
                    <Shield className="w-4 h-4 text-[#F0D283] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#F0D283]">Signatories Management:</span> You have full flexibility to exclude optional signatories (such as Assistant Principal, Division SBM Validator, or SDS) to streamline the endorsement sheet. You can restore them anytime.
                    </div>
                  </div>

                  <div className="p-4 bg-[#061810]/80 rounded-xl border border-[#D4AF37]/20 space-y-3">
                    <span className="font-bold text-[#F0D283] block uppercase tracking-wider text-[11px]">
                      School Executive Leadership (Core)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[#E2F0EA] mb-1 font-semibold">School Principal / Head Name *</label>
                        <input
                          type="text"
                          value={profileForm.principalName}
                          onChange={(e) => setProfileForm({ ...profileForm, principalName: e.target.value })}
                          required
                          className="w-full p-2.5 bg-[#092217] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#E2F0EA] mb-1 font-semibold">Principal Position / Designation Title</label>
                        <input
                          type="text"
                          value={profileForm.schoolHeadTitle}
                          onChange={(e) => setProfileForm({ ...profileForm, schoolHeadTitle: e.target.value })}
                          required
                          className="w-full p-2.5 bg-[#092217] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#E2F0EA] mb-1 font-semibold">School SBM Coordinator Name *</label>
                        <input
                          type="text"
                          value={profileForm.sbmCoordinator}
                          onChange={(e) => setProfileForm({ ...profileForm, sbmCoordinator: e.target.value })}
                          required
                          className="w-full p-2.5 bg-[#092217] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#E2F0EA] mb-1 font-semibold">SBM Coordinator Title / Designation</label>
                        <input
                          type="text"
                          value={profileForm.sbmCoordinatorTitle}
                          onChange={(e) => setProfileForm({ ...profileForm, sbmCoordinatorTitle: e.target.value })}
                          className="w-full p-2.5 bg-[#092217] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                    </div>

                    {/* Assistant Principal Section with Delete / Restore */}
                    <div className="pt-3 border-t border-[#D4AF37]/15">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-[#A7D7C1] text-xs">Assistant Principal (Optional)</span>
                        {profileForm.assistantPrincipal ? (
                          <button
                            type="button"
                            onClick={() => handleDeleteSignatory('assistantPrincipal')}
                            className="px-2.5 py-1 text-xs rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 hover:bg-rose-900/60 hover:text-white flex items-center space-x-1 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                            <span>Remove Signatory</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleRestoreSignatory('assistantPrincipal')}
                            className="px-2.5 py-1 text-xs rounded-lg bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 flex items-center space-x-1 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add / Restore</span>
                          </button>
                        )}
                      </div>

                      {profileForm.assistantPrincipal ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[#E2F0EA] mb-1 text-xs font-medium">Assistant Principal Name</label>
                            <input
                              type="text"
                              value={profileForm.assistantPrincipal}
                              onChange={(e) => setProfileForm({ ...profileForm, assistantPrincipal: e.target.value })}
                              placeholder="e.g. Dr. Marilou C. Alcantara"
                              className="w-full p-2.5 bg-[#092217] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                            />
                          </div>
                          <div>
                            <label className="block text-[#E2F0EA] mb-1 text-xs font-medium">Assistant Principal Title</label>
                            <input
                              type="text"
                              value={profileForm.assistantPrincipalTitle}
                              onChange={(e) => setProfileForm({ ...profileForm, assistantPrincipalTitle: e.target.value })}
                              placeholder="e.g. Assistant Principal for Academics"
                              className="w-full p-2.5 bg-[#092217] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-[#061810] border border-dashed border-[#D4AF37]/25 rounded-xl text-xs text-[#8FBCA7] flex items-center justify-between">
                          <span>Assistant Principal is excluded from official signatories.</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Division Level Authorities Section with Delete / Restore */}
                  <div className="p-4 bg-[#061810]/80 rounded-xl border border-[#D4AF37]/20 space-y-4">
                    <span className="font-bold text-[#F0D283] block uppercase tracking-wider text-[11px]">
                      Division Level Authorities & Validators (Optional)
                    </span>

                    {/* SDO Validator */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#A7D7C1] text-xs">Division SBM Validator</span>
                        {profileForm.divisionValidator ? (
                          <button
                            type="button"
                            onClick={() => handleDeleteSignatory('divisionValidator')}
                            className="px-2.5 py-1 text-xs rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 hover:bg-rose-900/60 hover:text-white flex items-center space-x-1 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                            <span>Remove Signatory</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleRestoreSignatory('divisionValidator')}
                            className="px-2.5 py-1 text-xs rounded-lg bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 flex items-center space-x-1 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add / Restore</span>
                          </button>
                        )}
                      </div>

                      {profileForm.divisionValidator ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[#E2F0EA] mb-1 text-xs font-medium">SDO SBM Validator Name</label>
                            <input
                              type="text"
                              value={profileForm.divisionValidator}
                              onChange={(e) => setProfileForm({ ...profileForm, divisionValidator: e.target.value })}
                              placeholder="e.g. Dr. Maria Elena V. Gonzales"
                              className="w-full p-2.5 bg-[#092217] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                            />
                          </div>
                          <div>
                            <label className="block text-[#E2F0EA] mb-1 text-xs font-medium">SDO SBM Validator Title / Office</label>
                            <input
                              type="text"
                              value={profileForm.divisionValidatorTitle}
                              onChange={(e) => setProfileForm({ ...profileForm, divisionValidatorTitle: e.target.value })}
                              placeholder="e.g. Division SBM Validator / EPS - SDO QC"
                              className="w-full p-2.5 bg-[#092217] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-[#061810] border border-dashed border-[#D4AF37]/25 rounded-xl text-xs text-[#8FBCA7]">
                          Division SBM Validator is excluded from official signatories.
                        </div>
                      )}
                    </div>

                    {/* Schools Division Superintendent */}
                    <div className="space-y-2 pt-3 border-t border-[#D4AF37]/15">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#A7D7C1] text-xs">Schools Division Superintendent</span>
                        {profileForm.divisionSuperintendent ? (
                          <button
                            type="button"
                            onClick={() => handleDeleteSignatory('divisionSuperintendent')}
                            className="px-2.5 py-1 text-xs rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 hover:bg-rose-900/60 hover:text-white flex items-center space-x-1 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                            <span>Remove Signatory</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleRestoreSignatory('divisionSuperintendent')}
                            className="px-2.5 py-1 text-xs rounded-lg bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 flex items-center space-x-1 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add / Restore</span>
                          </button>
                        )}
                      </div>

                      {profileForm.divisionSuperintendent ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[#E2F0EA] mb-1 text-xs font-medium">Schools Division Superintendent Name</label>
                            <input
                              type="text"
                              value={profileForm.divisionSuperintendent}
                              onChange={(e) => setProfileForm({ ...profileForm, divisionSuperintendent: e.target.value })}
                              placeholder="e.g. Carleen S. Sedilla, CESO V"
                              className="w-full p-2.5 bg-[#092217] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                            />
                          </div>
                          <div>
                            <label className="block text-[#E2F0EA] mb-1 text-xs font-medium">Superintendent Title / Designation</label>
                            <input
                              type="text"
                              value={profileForm.divisionSuperintendentTitle}
                              onChange={(e) => setProfileForm({ ...profileForm, divisionSuperintendentTitle: e.target.value })}
                              placeholder="e.g. Schools Division Superintendent"
                              className="w-full p-2.5 bg-[#092217] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-[#061810] border border-dashed border-[#D4AF37]/25 rounded-xl text-xs text-[#8FBCA7]">
                          Superintendent is excluded from official signatories.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Additional / Custom Signatories Section */}
                  <div className="p-4 bg-[#061810]/80 rounded-xl border border-[#D4AF37]/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[#F0D283] block uppercase tracking-wider text-[11px]">
                          Additional Custom Signatories (Optional)
                        </span>
                        <p className="text-[11px] text-[#8FBCA7]">e.g. PTA President, Faculty Club President, Barangay Captain</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddCustomSignatory}
                        className="px-3 py-1.5 rounded-lg bg-[#0E3824] hover:bg-[#12452D] border border-[#D4AF37]/40 text-[#F0D283] text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Signatory</span>
                      </button>
                    </div>

                    {(profileForm.customSignatories || []).length === 0 ? (
                      <div className="p-3 bg-[#061810] border border-dashed border-[#D4AF37]/20 rounded-xl text-xs text-[#8FBCA7] text-center">
                        No additional signatories. Click the button above to add custom signatories.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {profileForm.customSignatories.map((sig) => (
                          <div key={sig.id} className="p-3 bg-[#092217] border border-[#D4AF37]/25 rounded-xl space-y-2 relative">
                            <div className="flex items-center justify-between border-b border-[#D4AF37]/15 pb-1.5">
                              <span className="text-xs font-bold text-[#F0D283]">{sig.roleLabel || 'Custom Signatory'}</span>
                              <button
                                type="button"
                                onClick={() => handleDeleteCustomSignatory(sig.id)}
                                className="text-rose-400 hover:text-rose-300 flex items-center space-x-1 text-xs"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Remove</span>
                              </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                              <div>
                                <label className="block text-[#E2F0EA] mb-0.5">Role / Capacity</label>
                                <input
                                  type="text"
                                  value={sig.roleLabel}
                                  onChange={(e) => handleUpdateCustomSignatory(sig.id, 'roleLabel', e.target.value)}
                                  placeholder="e.g. PTA President"
                                  className="w-full p-2 bg-[#061810] border border-[#D4AF37]/30 rounded-lg text-[#FFFDF9]"
                                />
                              </div>
                              <div>
                                <label className="block text-[#E2F0EA] mb-0.5">Full Name</label>
                                <input
                                  type="text"
                                  value={sig.name}
                                  onChange={(e) => handleUpdateCustomSignatory(sig.id, 'name', e.target.value)}
                                  placeholder="e.g. Juan Dela Cruz"
                                  className="w-full p-2 bg-[#061810] border border-[#D4AF37]/30 rounded-lg text-[#FFFDF9]"
                                />
                              </div>
                              <div>
                                <label className="block text-[#E2F0EA] mb-0.5">Designation / Office</label>
                                <input
                                  type="text"
                                  value={sig.title}
                                  onChange={(e) => handleUpdateCustomSignatory(sig.id, 'title', e.target.value)}
                                  placeholder="e.g. General PTA President"
                                  className="w-full p-2 bg-[#061810] border border-[#D4AF37]/30 rounded-lg text-[#FFFDF9]"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 3: SBM Dimension Coordinators */}
              {activeModalTab === 'coordinators' && (
                <div className="space-y-4">
                  <div className="p-3 bg-[#061810]/70 rounded-xl border border-[#D4AF37]/20 text-[#D1E7DD] text-xs flex items-center justify-between">
                    <div>
                      Specify the assigned Lead Person and designation for the SBM Dimensions. You can remove or add coordinators as needed.
                    </div>
                    <button
                      type="button"
                      onClick={handleAddCoordinator}
                      className="px-3 py-1.5 rounded-lg bg-[#0E3824] hover:bg-[#12452D] border border-[#D4AF37]/40 text-[#F0D283] text-xs font-semibold flex items-center space-x-1.5 flex-shrink-0 ml-3 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Lead</span>
                    </button>
                  </div>
                  <div className="space-y-3">
                    {profileForm.dimensionCoordinators.map((coord, idx) => (
                      <div
                        key={coord.dimensionId || idx}
                        className="p-4 bg-[#061810]/80 rounded-xl border border-[#D4AF37]/25 space-y-2.5"
                      >
                        <div className="flex items-center justify-between border-b border-[#D4AF37]/15 pb-2">
                          <span className="font-bold text-[#F0D283] text-xs">
                            Dimension {coord.dimensionId}: {coord.dimensionName}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteCoordinator(idx)}
                            className="text-rose-400 hover:text-rose-300 flex items-center space-x-1 text-xs px-2 py-0.5 rounded hover:bg-rose-950/30 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[#E2F0EA] mb-1 font-semibold">Committee Lead / Coordinator</label>
                            <input
                              type="text"
                              value={coord.leadName}
                              onChange={(e) => handleUpdateCoordinator(idx, 'leadName', e.target.value)}
                              required
                              className="w-full p-2 bg-[#092217] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                            />
                          </div>
                          <div>
                            <label className="block text-[#E2F0EA] mb-1 font-semibold">Designation / Role Title</label>
                            <input
                              type="text"
                              value={coord.designation}
                              onChange={(e) => handleUpdateCoordinator(idx, 'designation', e.target.value)}
                              required
                              className="w-full p-2 bg-[#092217] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                            />
                          </div>
                          <div>
                            <label className="block text-[#E2F0EA] mb-1 font-semibold">Official Email</label>
                            <input
                              type="email"
                              value={coord.email || ''}
                              onChange={(e) => handleUpdateCoordinator(idx, 'email', e.target.value)}
                              className="w-full p-2 bg-[#092217] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: Facilities & Statistics */}
              {activeModalTab === 'facilities' && (
                <div className="space-y-4">
                  <div className="p-4 bg-[#061810]/80 rounded-xl border border-[#D4AF37]/20 space-y-3">
                    <span className="font-bold text-[#F0D283] block uppercase tracking-wider text-[11px]">
                      School Resources, Enrollees & Facilities
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[#E2F0EA] mb-1 font-semibold">Total Learners</label>
                        <input
                          type="number"
                          value={profileForm.totalLearners}
                          onChange={(e) => setProfileForm({ ...profileForm, totalLearners: Number(e.target.value) })}
                          className="w-full p-2.5 bg-[#092217] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#E2F0EA] mb-1 font-semibold">Teaching Staff</label>
                        <input
                          type="number"
                          value={profileForm.teachingPersonnel}
                          onChange={(e) => setProfileForm({ ...profileForm, teachingPersonnel: Number(e.target.value) })}
                          className="w-full p-2.5 bg-[#092217] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#E2F0EA] mb-1 font-semibold">Non-Teaching Staff</label>
                        <input
                          type="number"
                          value={profileForm.nonTeachingPersonnel}
                          onChange={(e) => setProfileForm({ ...profileForm, nonTeachingPersonnel: Number(e.target.value) })}
                          className="w-full p-2.5 bg-[#092217] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#E2F0EA] mb-1 font-semibold">Instructional Classrooms</label>
                        <input
                          type="number"
                          value={profileForm.classrooms}
                          onChange={(e) => setProfileForm({ ...profileForm, classrooms: Number(e.target.value) })}
                          className="w-full p-2.5 bg-[#092217] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#E2F0EA] mb-1 font-semibold">Science Laboratories</label>
                        <input
                          type="number"
                          value={profileForm.scienceLaboratories}
                          onChange={(e) => setProfileForm({ ...profileForm, scienceLaboratories: Number(e.target.value) })}
                          className="w-full p-2.5 bg-[#092217] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#E2F0EA] mb-1 font-semibold">Computer Laboratories</label>
                        <input
                          type="number"
                          value={profileForm.computerLaboratories}
                          onChange={(e) => setProfileForm({ ...profileForm, computerLaboratories: Number(e.target.value) })}
                          className="w-full p-2.5 bg-[#092217] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {saveMessage && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 font-semibold text-center flex items-center justify-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{saveMessage}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#D4AF37]/25">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-[#8FBCA7] hover:text-[#FFFDF9] hover:bg-[#0E3322] rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="gold-btn px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg flex items-center space-x-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving Changes...' : 'Save Settings'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* School Logo Upload / Management Modal */}
      {isEditingLogo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#0B2519] border border-[#D4AF37]/40 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 text-[#FFFDF9]">
            <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-3">
              <div className="flex items-center space-x-2">
                <ImageIcon className="w-5 h-5 text-[#F0D283]" />
                <h3 className="text-base font-bold text-[#FFFDF9]">Upload Official School Logo</h3>
              </div>
              <button
                id="close-logo-modal-btn"
                type="button"
                onClick={() => setIsEditingLogo(false)}
                className="p-1 rounded-lg text-[#8FBCA7] hover:text-[#FFFDF9] hover:bg-[#0E3322]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Logo Preview */}
            <div className="flex flex-col items-center justify-center p-4 bg-[#061810] rounded-xl border border-[#D4AF37]/20">
              {logoPreview ? (
                <div className="w-32 h-32 rounded-2xl bg-white/10 border-2 border-[#D4AF37] p-2 flex items-center justify-center overflow-hidden shadow-inner">
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 rounded-2xl bg-[#061810] border-2 border-dashed border-[#D4AF37]/40 flex flex-col items-center justify-center text-[#8FBCA7]">
                  <School className="w-10 h-10 text-[#D4AF37]/60 mb-1" />
                  <span className="text-xs">No logo chosen</span>
                </div>
              )}
            </div>

            {/* File Upload Option */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#F0D283]">
                Option 1: Upload Image File (PNG / JPG / SVG)
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                id="select-logo-file-btn"
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-4 bg-[#0E3322] hover:bg-[#15462E] border border-[#D4AF37]/40 rounded-xl text-xs font-bold text-[#F0D283] flex items-center justify-center space-x-2 transition-colors shadow-md"
              >
                <Upload className="w-4 h-4" />
                <span>Choose Image from Computer</span>
              </button>
            </div>

            {/* URL Input Option */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#F0D283]">
                Option 2: Or Paste Image URL
              </label>
              <input
                id="logo-url-input"
                type="text"
                value={logoInputUrl}
                onChange={(e) => {
                  setLogoInputUrl(e.target.value);
                  setLogoPreview(e.target.value);
                }}
                placeholder="https://example.com/logo.png"
                className="w-full p-2.5 text-xs bg-[#061810] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            {saveMessage && (
              <div className="p-2.5 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 font-semibold text-center flex items-center justify-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{saveMessage}</span>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-[#D4AF37]/20">
              {logoPreview && (
                <button
                  type="button"
                  onClick={() => {
                    setLogoPreview('');
                    setLogoInputUrl('');
                  }}
                  className="text-xs text-rose-400 hover:underline font-semibold"
                >
                  Remove Logo
                </button>
              )}
              <div className="flex items-center space-x-2 ml-auto">
                <button
                  id="cancel-logo-modal-btn"
                  type="button"
                  onClick={() => setIsEditingLogo(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#8FBCA7] hover:bg-[#0E3322] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  id="save-school-logo-btn"
                  type="button"
                  onClick={handleSaveLogo}
                  disabled={isSaving}
                  className="gold-btn px-5 py-2 rounded-xl text-xs font-bold shadow-md flex items-center space-x-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Saving...' : 'Apply Logo'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
