import React, { useState, useMemo } from 'react';
import {
  UserCheck,
  Shield,
  Edit,
  Trash2,
  Plus,
  Search,
  LayoutGrid,
  Table,
  RotateCcw,
  Check,
  X,
  Award,
  Mail,
  Building2,
  Users,
  AlertCircle,
  Undo2,
  Sparkles,
  ArrowUpDown,
  UserPlus
} from 'lucide-react';
import { useSbmData } from '../../contexts/SbmDataContext';
import { useAuth } from '../../contexts/AuthContext';
import { DimensionCoordinator, CustomSignatory } from '../../types';

export interface UnifiedSignatory {
  id: string;
  roleKey: 'principal' | 'sbmCoordinator' | 'assistantPrincipal' | 'divisionValidator' | 'divisionSuperintendent' | 'custom';
  roleLabel: string;
  name: string;
  title: string;
  office: string;
  category: 'executive' | 'division' | 'stakeholder' | 'committee' | 'custom';
}

export const STANDARD_SIGNATORY_DEFAULTS = {
  principal: {
    roleLabel: 'School Principal / Head',
    name: 'Dr. Lourdes R. Sese',
    title: 'Secondary School Principal IV',
    office: 'Office of the Principal',
    category: 'executive' as const
  },
  sbmCoordinator: {
    roleLabel: 'School SBM Coordinator',
    name: 'Dr. Marilou C. Alcantara',
    title: 'School SBM Coordinator / Master Teacher II',
    office: 'SBM Secretariat / Academics',
    category: 'executive' as const
  },
  assistantPrincipal: {
    roleLabel: 'Assistant Principal',
    name: 'Dr. Marilou C. Alcantara',
    title: 'Assistant Principal for Academics',
    office: 'Office of the Assistant Principal',
    category: 'executive' as const
  },
  divisionValidator: {
    roleLabel: 'SDO SBM Validator',
    name: 'Dr. Maria Elena V. Gonzales',
    title: 'Division SBM Validator / EPS - SDO QC',
    office: 'Schools Division Office - Quezon City',
    category: 'division' as const
  },
  divisionSuperintendent: {
    roleLabel: 'Schools Division Superintendent',
    name: 'Carleen S. Sedilla, CESO V',
    title: 'Schools Division Superintendent',
    office: 'Office of the Schools Division Superintendent',
    category: 'division' as const
  }
};

const SIGNATORY_ROLE_PRESETS = [
  { label: 'Assistant Principal', defaultTitle: 'Assistant Principal for Academics / Operations', defaultOffice: 'School Executive Office', category: 'executive' },
  { label: 'SDO SBM Validator', defaultTitle: 'Division SBM Validator / EPS - SDO QC', defaultOffice: 'Schools Division Office', category: 'division' },
  { label: 'Schools Division Superintendent', defaultTitle: 'Schools Division Superintendent', defaultOffice: 'Office of the SDS', category: 'division' },
  { label: 'PTA President / Officer', defaultTitle: 'General PTA President / Community Partner', defaultOffice: 'Parent-Teacher Association', category: 'stakeholder' },
  { label: 'Faculty Club President', defaultTitle: 'Faculty Club President / Teacher Representative', defaultOffice: 'Faculty & Personnel Association', category: 'stakeholder' },
  { label: 'Barangay / LGU Representative', defaultTitle: 'Barangay Chairperson / Education Committee Lead', defaultOffice: 'Local Government Unit / Barangay Council', category: 'stakeholder' },
  { label: 'SSG / Student Council President', defaultTitle: 'Supreme Secondary Learner Government President', defaultOffice: 'Student Governance Office', category: 'stakeholder' },
  { label: 'School QA / QAT Lead', defaultTitle: 'School Quality Assurance Team Leader', defaultOffice: 'Quality Assurance Committee', category: 'committee' },
  { label: 'Disaster Risk Reduction Focal', defaultTitle: 'SDRRM Coordinator / Safety Officer', defaultOffice: 'Disaster Risk Reduction Office', category: 'committee' },
  { label: 'Guidance Counselor / Head', defaultTitle: 'Registered Guidance Counselor / Section Head', defaultOffice: 'Guidance & Counseling Center', category: 'committee' },
  { label: 'Custom Official / Signatory', defaultTitle: 'Designated Authority / Signatory', defaultOffice: 'School Administration', category: 'custom' }
];

interface SignatoriesRosterManagerProps {
  canEdit: boolean;
  onOpenEditProfile?: (tab: 'general' | 'signatories' | 'coordinators' | 'facilities') => void;
}

export const SignatoriesRosterManager: React.FC<SignatoriesRosterManagerProps> = ({
  canEdit,
  onOpenEditProfile
}) => {
  const { schoolProfile, updateSchoolProfile } = useSbmData();
  const { isSuperAdmin, isCoordinator, isSchoolHead, userProfile } = useAuth();

  // Allow editing if user has permission or is logged in personnel
  const hasEditAccess = canEdit || isSuperAdmin || isCoordinator || isSchoolHead || Boolean(userProfile);

  // View state
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'executive' | 'division' | 'stakeholder' | 'committee' | 'custom'>('all');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; signatory: UnifiedSignatory | null }>({
    isOpen: false,
    signatory: null
  });

  // Undo Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [undoSnapshot, setUndoSnapshot] = useState<{
    message: string;
    restore: () => Promise<void>;
  } | null>(null);

  // Signatory Form State
  const [formData, setFormData] = useState<{
    id: string;
    roleKey: UnifiedSignatory['roleKey'];
    roleLabel: string;
    name: string;
    title: string;
    office: string;
    category: UnifiedSignatory['category'];
  }>({
    id: '',
    roleKey: 'custom',
    roleLabel: '',
    name: '',
    title: '',
    office: '',
    category: 'custom'
  });

  // Collect all active unified signatories
  const activeSignatories = useMemo<UnifiedSignatory[]>(() => {
    const list: UnifiedSignatory[] = [];

    // 1. Principal
    const principalName = schoolProfile?.principalName || schoolProfile?.schoolHead;
    if (principalName && principalName.trim() !== '') {
      list.push({
        id: 'principal',
        roleKey: 'principal',
        roleLabel: 'School Principal / Head',
        name: principalName,
        title: schoolProfile?.schoolHeadTitle || STANDARD_SIGNATORY_DEFAULTS.principal.title,
        office: 'Office of the Principal',
        category: 'executive'
      });
    }

    // 2. SBM Coordinator
    const sbmCoord = schoolProfile?.sbmCoordinator;
    if (sbmCoord && sbmCoord.trim() !== '') {
      list.push({
        id: 'sbmCoordinator',
        roleKey: 'sbmCoordinator',
        roleLabel: 'School SBM Coordinator',
        name: sbmCoord,
        title: schoolProfile?.sbmCoordinatorTitle || STANDARD_SIGNATORY_DEFAULTS.sbmCoordinator.title,
        office: 'SBM Secretariat / Academics',
        category: 'executive'
      });
    }

    // 3. Assistant Principal
    const asstPrin = schoolProfile?.assistantPrincipal;
    if (asstPrin && asstPrin.trim() !== '') {
      list.push({
        id: 'assistantPrincipal',
        roleKey: 'assistantPrincipal',
        roleLabel: 'Assistant Principal',
        name: asstPrin,
        title: schoolProfile?.assistantPrincipalTitle || STANDARD_SIGNATORY_DEFAULTS.assistantPrincipal.title,
        office: 'Office of the Assistant Principal',
        category: 'executive'
      });
    }

    // 4. Division SBM Validator
    const divVal = schoolProfile?.divisionValidator;
    if (divVal && divVal.trim() !== '') {
      list.push({
        id: 'divisionValidator',
        roleKey: 'divisionValidator',
        roleLabel: 'SDO SBM Validator',
        name: divVal,
        title: schoolProfile?.divisionValidatorTitle || STANDARD_SIGNATORY_DEFAULTS.divisionValidator.title,
        office: 'Schools Division Office - Quezon City',
        category: 'division'
      });
    }

    // 5. Schools Division Superintendent
    const divSupt = schoolProfile?.divisionSuperintendent;
    if (divSupt && divSupt.trim() !== '') {
      list.push({
        id: 'divisionSuperintendent',
        roleKey: 'divisionSuperintendent',
        roleLabel: 'Schools Division Superintendent',
        name: divSupt,
        title: schoolProfile?.divisionSuperintendentTitle || STANDARD_SIGNATORY_DEFAULTS.divisionSuperintendent.title,
        office: 'Office of the Schools Division Superintendent',
        category: 'division'
      });
    }

    // 6. Custom Signatories
    if (schoolProfile?.customSignatories && Array.isArray(schoolProfile.customSignatories)) {
      schoolProfile.customSignatories.forEach((sig) => {
        if (sig && sig.name && sig.name.trim() !== '') {
          list.push({
            id: sig.id,
            roleKey: 'custom',
            roleLabel: sig.roleLabel || 'Additional Signatory',
            name: sig.name,
            title: sig.title || 'Official Signatory',
            office: sig.office || 'Designated Office',
            category: 'stakeholder'
          });
        }
      });
    }

    return list;
  }, [schoolProfile]);

  // Missing standard signatories for quick restore
  const missingStandards = useMemo(() => {
    const list: { key: 'principal' | 'sbmCoordinator' | 'assistantPrincipal' | 'divisionValidator' | 'divisionSuperintendent'; label: string; name: string }[] = [];
    if (!schoolProfile?.principalName || schoolProfile.principalName.trim() === '') {
      list.push({ key: 'principal', label: 'School Principal', name: STANDARD_SIGNATORY_DEFAULTS.principal.name });
    }
    if (!schoolProfile?.sbmCoordinator || schoolProfile.sbmCoordinator.trim() === '') {
      list.push({ key: 'sbmCoordinator', label: 'SBM Coordinator', name: STANDARD_SIGNATORY_DEFAULTS.sbmCoordinator.name });
    }
    if (!schoolProfile?.assistantPrincipal || schoolProfile.assistantPrincipal.trim() === '') {
      list.push({ key: 'assistantPrincipal', label: 'Assistant Principal', name: STANDARD_SIGNATORY_DEFAULTS.assistantPrincipal.name });
    }
    if (!schoolProfile?.divisionValidator || schoolProfile.divisionValidator.trim() === '') {
      list.push({ key: 'divisionValidator', label: 'SDO SBM Validator', name: STANDARD_SIGNATORY_DEFAULTS.divisionValidator.name });
    }
    if (!schoolProfile?.divisionSuperintendent || schoolProfile.divisionSuperintendent.trim() === '') {
      list.push({ key: 'divisionSuperintendent', label: 'Division Superintendent', name: STANDARD_SIGNATORY_DEFAULTS.divisionSuperintendent.name });
    }
    return list;
  }, [schoolProfile]);

  // Filtered signatories
  const filteredSignatories = useMemo(() => {
    return activeSignatories.filter((sig) => {
      const matchSearch =
        searchTerm === '' ||
        sig.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sig.roleLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sig.office.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchCategory =
        categoryFilter === 'all' || sig.category === categoryFilter;

      return matchSearch && matchCategory;
    });
  }, [activeSignatories, searchTerm, categoryFilter]);

  // Handlers
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleOpenAdd = () => {
    setFormData({
      id: `sig-${Date.now()}`,
      roleKey: 'custom',
      roleLabel: 'PTA President / Officer',
      name: '',
      title: 'General PTA President / Community Partner',
      office: 'Parent-Teacher Association',
      category: 'stakeholder'
    });
    setIsAddModalOpen(true);
  };

  const handleApplyPreset = (presetLabel: string) => {
    const found = SIGNATORY_ROLE_PRESETS.find((p) => p.label === presetLabel);
    if (!found) return;

    if (presetLabel === 'Assistant Principal') {
      setFormData((prev) => ({
        ...prev,
        roleKey: 'assistantPrincipal',
        roleLabel: found.label,
        name: prev.name || STANDARD_SIGNATORY_DEFAULTS.assistantPrincipal.name,
        title: found.defaultTitle,
        office: found.defaultOffice,
        category: 'executive'
      }));
    } else if (presetLabel === 'SDO SBM Validator') {
      setFormData((prev) => ({
        ...prev,
        roleKey: 'divisionValidator',
        roleLabel: found.label,
        name: prev.name || STANDARD_SIGNATORY_DEFAULTS.divisionValidator.name,
        title: found.defaultTitle,
        office: found.defaultOffice,
        category: 'division'
      }));
    } else if (presetLabel === 'Schools Division Superintendent') {
      setFormData((prev) => ({
        ...prev,
        roleKey: 'divisionSuperintendent',
        roleLabel: found.label,
        name: prev.name || STANDARD_SIGNATORY_DEFAULTS.divisionSuperintendent.name,
        title: found.defaultTitle,
        office: found.defaultOffice,
        category: 'division'
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        roleKey: 'custom',
        roleLabel: found.label,
        title: found.defaultTitle,
        office: found.defaultOffice,
        category: found.category as UnifiedSignatory['category']
      }));
    }
  };

  const handleOpenEdit = (sig: UnifiedSignatory) => {
    setFormData({
      id: sig.id,
      roleKey: sig.roleKey,
      roleLabel: sig.roleLabel,
      name: sig.name,
      title: sig.title,
      office: sig.office,
      category: sig.category
    });
    setIsEditModalOpen(true);
  };

  const handleSaveSignatory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      if (formData.roleKey === 'principal') {
        await updateSchoolProfile({
          principalName: formData.name.trim(),
          schoolHead: formData.name.trim(),
          schoolHeadTitle: formData.title.trim()
        });
      } else if (formData.roleKey === 'sbmCoordinator') {
        await updateSchoolProfile({
          sbmCoordinator: formData.name.trim(),
          sbmCoordinatorTitle: formData.title.trim()
        });
      } else if (formData.roleKey === 'assistantPrincipal') {
        await updateSchoolProfile({
          assistantPrincipal: formData.name.trim(),
          assistantPrincipalTitle: formData.title.trim()
        });
      } else if (formData.roleKey === 'divisionValidator') {
        await updateSchoolProfile({
          divisionValidator: formData.name.trim(),
          divisionValidatorTitle: formData.title.trim()
        });
      } else if (formData.roleKey === 'divisionSuperintendent') {
        await updateSchoolProfile({
          divisionSuperintendent: formData.name.trim(),
          divisionSuperintendentTitle: formData.title.trim()
        });
      } else {
        // Custom Signatory
        const existingCustom = [...(schoolProfile?.customSignatories || [])];
        const index = existingCustom.findIndex((c) => c.id === formData.id);

        if (index >= 0) {
          existingCustom[index] = {
            id: formData.id,
            roleLabel: formData.roleLabel.trim(),
            name: formData.name.trim(),
            title: formData.title.trim(),
            office: formData.office.trim()
          };
        } else {
          existingCustom.push({
            id: formData.id || `sig-${Date.now()}`,
            roleLabel: formData.roleLabel.trim(),
            name: formData.name.trim(),
            title: formData.title.trim(),
            office: formData.office.trim()
          });
        }

        await updateSchoolProfile({
          customSignatories: existingCustom
        });
      }

      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
      showToast(`Signatory "${formData.name.trim()}" saved successfully!`);
    } catch (err) {
      console.error('Error saving signatory:', err);
      alert('Failed to save signatory changes. Please try again.');
    }
  };

  const handleRequestDelete = (sig: UnifiedSignatory) => {
    setDeleteConfirm({
      isOpen: true,
      signatory: sig
    });
  };

  const handleExecuteDelete = async () => {
    const sig = deleteConfirm.signatory;
    if (!sig) return;

    // Snapshot for Undo
    const previousProfile = { ...schoolProfile };

    try {
      if (sig.roleKey === 'principal') {
        await updateSchoolProfile({
          principalName: '',
          schoolHead: '',
          schoolHeadTitle: ''
        });
      } else if (sig.roleKey === 'sbmCoordinator') {
        await updateSchoolProfile({
          sbmCoordinator: '',
          sbmCoordinatorTitle: ''
        });
      } else if (sig.roleKey === 'assistantPrincipal') {
        await updateSchoolProfile({
          assistantPrincipal: '',
          assistantPrincipalTitle: ''
        });
      } else if (sig.roleKey === 'divisionValidator') {
        await updateSchoolProfile({
          divisionValidator: '',
          divisionValidatorTitle: ''
        });
      } else if (sig.roleKey === 'divisionSuperintendent') {
        await updateSchoolProfile({
          divisionSuperintendent: '',
          divisionSuperintendentTitle: ''
        });
      } else {
        const updatedCustom = (schoolProfile?.customSignatories || []).filter(
          (c) => c.id !== sig.id
        );
        await updateSchoolProfile({
          customSignatories: updatedCustom
        });
      }

      setDeleteConfirm({ isOpen: false, signatory: null });

      // Setup Undo
      setUndoSnapshot({
        message: `Removed "${sig.name}" (${sig.roleLabel})`,
        restore: async () => {
          await updateSchoolProfile(previousProfile);
          showToast(`Restored "${sig.name}" to signatories roster.`);
          setUndoSnapshot(null);
        }
      });

      showToast(`Removed "${sig.name}" from official signatories.`);
    } catch (err) {
      console.error('Error removing signatory:', err);
      alert('Failed to remove signatory. Please try again.');
    }
  };

  const handleRestoreStandard = async (
    roleKey: 'principal' | 'sbmCoordinator' | 'assistantPrincipal' | 'divisionValidator' | 'divisionSuperintendent'
  ) => {
    const defaults = STANDARD_SIGNATORY_DEFAULTS[roleKey];
    try {
      if (roleKey === 'principal') {
        await updateSchoolProfile({
          principalName: defaults.name,
          schoolHead: defaults.name,
          schoolHeadTitle: defaults.title
        });
      } else if (roleKey === 'sbmCoordinator') {
        await updateSchoolProfile({
          sbmCoordinator: defaults.name,
          sbmCoordinatorTitle: defaults.title
        });
      } else if (roleKey === 'assistantPrincipal') {
        await updateSchoolProfile({
          assistantPrincipal: defaults.name,
          assistantPrincipalTitle: defaults.title
        });
      } else if (roleKey === 'divisionValidator') {
        await updateSchoolProfile({
          divisionValidator: defaults.name,
          divisionValidatorTitle: defaults.title
        });
      } else if (roleKey === 'divisionSuperintendent') {
        await updateSchoolProfile({
          divisionSuperintendent: defaults.name,
          divisionSuperintendentTitle: defaults.title
        });
      }
      showToast(`Restored ${defaults.roleLabel} (${defaults.name})`);
    } catch (err) {
      console.error('Error restoring signatory:', err);
    }
  };

  const handleRestoreAllDefaults = async () => {
    if (!window.confirm('Restore all standard DepEd official signatories (Principal, SBM Coordinator, Assistant Principal, SDO Validator, SDS) to default settings?')) {
      return;
    }
    try {
      await updateSchoolProfile({
        principalName: STANDARD_SIGNATORY_DEFAULTS.principal.name,
        schoolHead: STANDARD_SIGNATORY_DEFAULTS.principal.name,
        schoolHeadTitle: STANDARD_SIGNATORY_DEFAULTS.principal.title,
        sbmCoordinator: STANDARD_SIGNATORY_DEFAULTS.sbmCoordinator.name,
        sbmCoordinatorTitle: STANDARD_SIGNATORY_DEFAULTS.sbmCoordinator.title,
        assistantPrincipal: STANDARD_SIGNATORY_DEFAULTS.assistantPrincipal.name,
        assistantPrincipalTitle: STANDARD_SIGNATORY_DEFAULTS.assistantPrincipal.title,
        divisionValidator: STANDARD_SIGNATORY_DEFAULTS.divisionValidator.name,
        divisionValidatorTitle: STANDARD_SIGNATORY_DEFAULTS.divisionValidator.title,
        divisionSuperintendent: STANDARD_SIGNATORY_DEFAULTS.divisionSuperintendent.name,
        divisionSuperintendentTitle: STANDARD_SIGNATORY_DEFAULTS.divisionSuperintendent.title
      });
      showToast('All standard DepEd signatories successfully restored!');
    } catch (err) {
      console.error('Failed to restore defaults:', err);
    }
  };

  const getCategoryBadge = (cat: UnifiedSignatory['category']) => {
    switch (cat) {
      case 'executive':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D4AF37]/20 text-[#F0D283] border border-[#D4AF37]/40">
            Executive Leadership
          </span>
        );
      case 'division':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950/60 text-blue-300 border border-blue-500/40">
            Division Level
          </span>
        );
      case 'stakeholder':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-500/40">
            Stakeholder / Partner
          </span>
        );
      case 'committee':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950/60 text-purple-300 border border-purple-500/40">
            School Committee
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#061810] text-[#D1E7DD] border border-[#D4AF37]/25">
            Designated Signatory
          </span>
        );
    }
  };

  return (
    <div id="signatories-roster-manager" className="bg-[#0D2E1F]/90 rounded-2xl p-6 border border-[#D4AF37]/35 shadow-xl space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center space-x-3 px-4 py-3 bg-[#061810] border-2 border-[#D4AF37] rounded-xl text-[#FFFDF9] shadow-2xl text-xs animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
          {undoSnapshot && (
            <button
              type="button"
              onClick={undoSnapshot.restore}
              className="ml-2 px-2.5 py-1 rounded bg-[#D4AF37] hover:bg-[#F0D283] text-[#061810] font-black flex items-center space-x-1"
            >
              <Undo2 className="w-3 h-3" />
              <span>Undo</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-[#8FBCA7] hover:text-[#FFFDF9] p-0.5 ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#D4AF37]/25 pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#F0D283]">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-[#FFFDF9]">
                  Official School Leadership, SBM Coordinators & DepEd Signatories Roster
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F0D283] text-[10px] font-black">
                  {activeSignatories.length} Active
                </span>
              </div>
              <p className="text-xs text-[#8FBCA7]">
                Editable roster of designated school authorities and committee leads whose names and titles automatically populate official SBM transmittals, certificates, and validation sheets.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-[#061810] rounded-xl border border-[#D4AF37]/30 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                viewMode === 'cards'
                  ? 'bg-[#D4AF37] text-[#061810] shadow-sm'
                  : 'text-[#8FBCA7] hover:text-[#FFFDF9]'
              }`}
              title="Cards Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                viewMode === 'table'
                  ? 'bg-[#D4AF37] text-[#061810] shadow-sm'
                  : 'text-[#8FBCA7] hover:text-[#FFFDF9]'
              }`}
              title="Editable DepEd Table View"
            >
              <Table className="w-3.5 h-3.5" />
              <span>Editable Table</span>
            </button>
          </div>

          {/* Add Signatory Button */}
          {hasEditAccess && (
            <button
              id="add-signatory-btn"
              type="button"
              onClick={handleOpenAdd}
              className="gold-btn inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-md hover:scale-102 transition-transform"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Add Signatory</span>
            </button>
          )}

          {/* Quick Restore Defaults */}
          {hasEditAccess && (
            <button
              type="button"
              onClick={handleRestoreAllDefaults}
              title="Restore standard DepEd official signatories"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#061810]/70 hover:bg-[#0E3322] border border-[#D4AF37]/35 text-xs text-[#F0D283] font-semibold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Defaults</span>
            </button>
          )}

          {/* Edit Dimension Leads */}
          {hasEditAccess && onOpenEditProfile && (
            <button
              type="button"
              onClick={() => onOpenEditProfile('coordinators')}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#061810]/70 hover:bg-[#0E3322] border border-[#D4AF37]/35 text-xs text-[#F0D283] font-semibold transition-colors"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Dimension Leads</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#8FBCA7] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search signatories by name, position, or office..."
            className="w-full pl-9 pr-8 py-2 bg-[#061810]/80 border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] placeholder-[#8FBCA7]/70 focus:outline-none focus:border-[#D4AF37]"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8FBCA7] hover:text-[#FFFDF9]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
          <span className="text-[11px] text-[#8FBCA7] mr-1 hidden md:inline">Category:</span>
          {(['all', 'executive', 'division', 'stakeholder', 'committee'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors capitalize ${
                categoryFilter === cat
                  ? 'bg-[#D4AF37] text-[#061810] font-bold shadow-xs'
                  : 'bg-[#061810]/60 text-[#8FBCA7] hover:text-[#FFFDF9] border border-[#D4AF37]/20'
              }`}
            >
              {cat === 'all' ? 'All Roles' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Restore Missing Standard Presets Warning/Prompt */}
      {missingStandards.length > 0 && hasEditAccess && (
        <div className="p-3 bg-amber-950/30 rounded-xl border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-amber-200">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-[#F0D283] flex-shrink-0" />
            <span>
              <strong>Optional Signatory Inactive:</strong> {missingStandards.map((m) => m.label).join(', ')} currently excluded.
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {missingStandards.map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => handleRestoreStandard(m.key)}
                className="px-2.5 py-1 rounded-md bg-amber-900/40 hover:bg-amber-800/60 border border-amber-400/40 text-[11px] font-semibold text-amber-100 flex items-center space-x-1 transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>Restore {m.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 1: CARDS GRID VIEW */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 text-xs">
          {filteredSignatories.map((sig) => (
            <div
              key={sig.id}
              className="p-4 bg-[#092217]/95 rounded-xl border border-[#D4AF37]/35 shadow-sm space-y-2 hover:border-[#D4AF37]/60 transition-all relative group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  {getCategoryBadge(sig.category)}
                  {hasEditAccess && (
                    <div className="flex items-center space-x-1 opacity-90 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(sig)}
                        title={`Edit ${sig.name}`}
                        className="p-1.5 rounded-lg bg-[#061810]/70 hover:bg-[#D4AF37] text-[#F0D283] hover:text-[#061810] border border-[#D4AF37]/30 transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRequestDelete(sig)}
                        title={`Delete / Remove ${sig.name}`}
                        className="p-1.5 rounded-lg bg-[#061810]/70 hover:bg-rose-900 text-rose-300 hover:text-white border border-rose-500/30 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <span className="text-[10px] font-bold text-[#F0D283] uppercase tracking-wider block">
                  {sig.roleLabel}
                </span>
                <p className="text-sm font-black text-[#FFFDF9] leading-snug mt-0.5">
                  {sig.name}
                </p>
                <p className="text-[11px] text-[#A7D7C1] font-medium mt-0.5">
                  {sig.title}
                </p>
              </div>

              <div className="pt-2 border-t border-[#D4AF37]/15 flex items-center justify-between text-[10px] text-[#8FBCA7]">
                <span className="truncate" title={sig.office}>
                  {sig.office}
                </span>
                {hasEditAccess && (
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(sig)}
                    className="text-[#F0D283] hover:text-[#FFFDF9] underline flex items-center space-x-0.5 flex-shrink-0 ml-1"
                  >
                    <span>Edit</span>
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Add New Signatory Interactive Card */}
          {hasEditAccess && (
            <button
              type="button"
              onClick={handleOpenAdd}
              className="p-4 rounded-xl border-2 border-dashed border-[#D4AF37]/45 hover:border-[#D4AF37] hover:bg-[#0E3322]/50 text-[#A7D7C1] hover:text-[#FFFDF9] flex flex-col items-center justify-center text-center space-y-2 transition-all min-h-[140px] group"
            >
              <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#F0D283] group-hover:scale-110 transition-transform">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#F0D283] block">
                  + Add New Signatory
                </span>
                <span className="text-[10px] text-[#8FBCA7]">
                  Executive, Validator, PTA or Committee Lead
                </span>
              </div>
            </button>
          )}
        </div>
      )}

      {/* VIEW 2: EDITABLE TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="space-y-3">
          <div className="overflow-x-auto rounded-xl border border-[#D4AF37]/35 shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#061810] text-[#F0D283] font-bold border-b border-[#D4AF37]/30 uppercase tracking-wider text-[10px]">
                  <th className="p-3 w-12 text-center">#</th>
                  <th className="p-3">Role / Capacity</th>
                  <th className="p-3">Official Signatory Name</th>
                  <th className="p-3">Designation / Position Title</th>
                  <th className="p-3">Office / Agency</th>
                  <th className="p-3">Category</th>
                  {hasEditAccess && <th className="p-3 text-center w-28">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D4AF37]/20 bg-[#092217]/90 text-[#FFFDF9]">
                {filteredSignatories.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-[#8FBCA7]">
                      No signatories found matching your query. Click "+ Add Signatory" to create one.
                    </td>
                  </tr>
                ) : (
                  filteredSignatories.map((sig, idx) => (
                    <tr
                      key={sig.id}
                      className="hover:bg-[#0E3322]/60 transition-colors group"
                    >
                      <td className="p-3 text-center text-[#8FBCA7] font-mono text-[11px]">
                        {idx + 1}
                      </td>
                      <td className="p-3 font-semibold text-[#F0D283]">
                        {sig.roleLabel}
                      </td>
                      <td className="p-3 font-black text-white">
                        {sig.name}
                      </td>
                      <td className="p-3 text-[#A7D7C1]">
                        {sig.title}
                      </td>
                      <td className="p-3 text-[#8FBCA7]">
                        {sig.office}
                      </td>
                      <td className="p-3">
                        {getCategoryBadge(sig.category)}
                      </td>
                      {hasEditAccess && (
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center space-x-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(sig)}
                              title={`Edit ${sig.name}`}
                              className="px-2.5 py-1 rounded-md bg-[#061810] hover:bg-[#D4AF37] text-[#F0D283] hover:text-[#061810] border border-[#D4AF37]/40 font-semibold text-[11px] flex items-center space-x-1 transition-colors"
                            >
                              <Edit className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRequestDelete(sig)}
                              title={`Delete ${sig.name}`}
                              className="p-1 rounded-md bg-rose-950/40 hover:bg-rose-900 border border-rose-500/40 text-rose-300 hover:text-white transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Bottom Add Action */}
          {hasEditAccess && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-[#8FBCA7]">
                Showing {filteredSignatories.length} of {activeSignatories.length} active signatories
              </span>
              <button
                type="button"
                onClick={handleOpenAdd}
                className="gold-btn inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Signatory Row</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ADD SIGNATORY MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="bg-[#0B2519] border-2 border-[#D4AF37]/60 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 text-[#FFFDF9] my-8">
            <div className="flex items-center justify-between border-b border-[#D4AF37]/25 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-[#D4AF37]/20 text-[#F0D283]">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#FFFDF9]">Add Official Signatory</h3>
                  <p className="text-xs text-[#8FBCA7]">
                    Add a designated school authority, division validator, or community stakeholder
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-[#8FBCA7] hover:text-[#FFFDF9] hover:bg-[#0E3322]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Role Preset Picker */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-[#F0D283] uppercase tracking-wider">
                Select Signatory Role Preset (Or Customize Below)
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1 bg-[#061810]/70 rounded-xl border border-[#D4AF37]/25">
                {SIGNATORY_ROLE_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleApplyPreset(preset.label)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] transition-all flex items-center space-x-1 ${
                      formData.roleLabel === preset.label
                        ? 'bg-[#D4AF37] text-[#061810] font-bold shadow-xs'
                        : 'bg-[#092217] text-[#D1E7DD] hover:bg-[#0E3824] border border-[#D4AF37]/20'
                    }`}
                  >
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSaveSignatory} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#E2F0EA] mb-1 font-semibold">
                    Signatory Role / Capacity *
                  </label>
                  <input
                    type="text"
                    value={formData.roleLabel}
                    onChange={(e) => setFormData({ ...formData, roleLabel: e.target.value })}
                    required
                    placeholder="e.g. PTA President"
                    className="w-full p-2.5 bg-[#092217] border border-[#D4AF37]/35 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[#E2F0EA] mb-1 font-semibold">
                    Role Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as UnifiedSignatory['category'] })}
                    className="w-full p-2.5 bg-[#092217] border border-[#D4AF37]/35 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="executive">Executive Leadership</option>
                    <option value="division">Division Authority</option>
                    <option value="stakeholder">Stakeholder / Community</option>
                    <option value="committee">School Committee</option>
                    <option value="custom">Custom Designated</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#E2F0EA] mb-1 font-semibold">
                  Official Full Name (with Prefix/Suffix) *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g. Dr. Maria Elena V. Gonzales, CESO VI"
                  className="w-full p-2.5 bg-[#092217] border border-[#D4AF37]/35 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37] font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#E2F0EA] mb-1 font-semibold">
                    Position Title / Designation *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="e.g. Secondary School Principal IV"
                    className="w-full p-2.5 bg-[#092217] border border-[#D4AF37]/35 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[#E2F0EA] mb-1 font-semibold">
                    Office / Department / Agency
                  </label>
                  <input
                    type="text"
                    value={formData.office}
                    onChange={(e) => setFormData({ ...formData, office: e.target.value })}
                    placeholder="e.g. Schools Division Office - QC"
                    className="w-full p-2.5 bg-[#092217] border border-[#D4AF37]/35 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#D4AF37]/25 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#061810] hover:bg-[#0E3322] border border-[#D4AF37]/30 text-[#8FBCA7] hover:text-[#FFFDF9] font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gold-btn px-5 py-2 rounded-xl font-bold flex items-center space-x-1.5 shadow-md"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Signatory</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT SIGNATORY MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="bg-[#0B2519] border-2 border-[#D4AF37]/60 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 text-[#FFFDF9] my-8">
            <div className="flex items-center justify-between border-b border-[#D4AF37]/25 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-[#D4AF37]/20 text-[#F0D283]">
                  <Edit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#FFFDF9]">Edit Signatory Details</h3>
                  <p className="text-xs text-[#8FBCA7]">
                    Update official name, title, and designation for {formData.roleLabel}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-[#8FBCA7] hover:text-[#FFFDF9] hover:bg-[#0E3322]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSignatory} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#E2F0EA] mb-1 font-semibold">
                    Signatory Role / Capacity *
                  </label>
                  <input
                    type="text"
                    value={formData.roleLabel}
                    onChange={(e) => setFormData({ ...formData, roleLabel: e.target.value })}
                    required
                    className="w-full p-2.5 bg-[#092217] border border-[#D4AF37]/35 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[#E2F0EA] mb-1 font-semibold">
                    Role Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as UnifiedSignatory['category'] })}
                    className="w-full p-2.5 bg-[#092217] border border-[#D4AF37]/35 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="executive">Executive Leadership</option>
                    <option value="division">Division Authority</option>
                    <option value="stakeholder">Stakeholder / Partner</option>
                    <option value="committee">School Committee</option>
                    <option value="custom">Custom Designated</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#E2F0EA] mb-1 font-semibold">
                  Official Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g. Dr. Lourdes R. Sese"
                  className="w-full p-2.5 bg-[#092217] border border-[#D4AF37]/35 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37] font-semibold text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#E2F0EA] mb-1 font-semibold">
                    Position Title / Designation *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="e.g. Secondary School Principal IV"
                    className="w-full p-2.5 bg-[#092217] border border-[#D4AF37]/35 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[#E2F0EA] mb-1 font-semibold">
                    Office / Department / Agency
                  </label>
                  <input
                    type="text"
                    value={formData.office}
                    onChange={(e) => setFormData({ ...formData, office: e.target.value })}
                    placeholder="e.g. Office of the Principal"
                    className="w-full p-2.5 bg-[#092217] border border-[#D4AF37]/35 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#D4AF37]/25 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    const sig = activeSignatories.find((s) => s.id === formData.id);
                    if (sig) handleRequestDelete(sig);
                  }}
                  className="px-3 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900 border border-rose-500/40 text-rose-300 hover:text-white font-semibold flex items-center space-x-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Signatory</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-[#061810] hover:bg-[#0E3322] border border-[#D4AF37]/30 text-[#8FBCA7] hover:text-[#FFFDF9] font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="gold-btn px-5 py-2 rounded-xl font-bold flex items-center space-x-1.5 shadow-md"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirm.isOpen && deleteConfirm.signatory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="bg-[#0B2519] border-2 border-rose-500/50 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-[#FFFDF9] my-8">
            <div className="flex items-center space-x-3 text-rose-400">
              <div className="p-2.5 rounded-full bg-rose-950/60 border border-rose-500/40">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Remove Signatory?</h4>
                <p className="text-xs text-rose-200">This action can be undone immediately.</p>
              </div>
            </div>

            <div className="p-3.5 bg-[#061810] rounded-xl border border-[#D4AF37]/20 text-xs space-y-1">
              <span className="text-[10px] text-[#F0D283] uppercase font-bold block">
                {deleteConfirm.signatory.roleLabel}
              </span>
              <p className="text-sm font-black text-white">{deleteConfirm.signatory.name}</p>
              <p className="text-[#A7D7C1] text-[11px]">{deleteConfirm.signatory.title}</p>
            </div>

            <p className="text-xs text-[#D1E7DD]">
              Removing this signatory will exclude their name and endorsement block from upcoming SBM transmittals, validation certificates, and official summary printouts.
            </p>

            <div className="pt-2 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setDeleteConfirm({ isOpen: false, signatory: null })}
                className="px-4 py-2 rounded-xl bg-[#061810] hover:bg-[#0E3322] border border-[#D4AF37]/30 text-[#8FBCA7] hover:text-[#FFFDF9] font-semibold transition-colors text-xs"
              >
                Keep Signatory
              </button>
              <button
                type="button"
                onClick={handleExecuteDelete}
                className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-600 text-white font-bold flex items-center space-x-1.5 shadow-md transition-colors text-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Remove</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
