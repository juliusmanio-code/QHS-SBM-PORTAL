import React, { useState } from 'react';
import {
  X,
  Save,
  RotateCcw,
  Sparkles,
  Edit3,
  Megaphone,
  Upload,
  ArrowRight,
  Palette,
  CheckCircle2
} from 'lucide-react';
import { DashboardBannerConfig } from '../../types';

interface BannerEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialConfig?: DashboardBannerConfig;
  currentSchoolYearLabel: string;
  userDisplayName?: string;
  userRole?: string;
  onSave: (config: DashboardBannerConfig) => Promise<void>;
}

const DEFAULT_BANNER: DashboardBannerConfig = {
  badgeText: 'Official Policy DepEd Order No. 007, s. 2024',
  title: 'SBM Performance & Evidence Tracking — {SY}',
  description: 'Monitor all 6 SBM dimensions, verify Means of Verification (MOVs), and calibrate official degrees of manifestation.',
  showAnnouncement: false,
  announcementText: 'Reminder: Please ensure all SBM MOV files and documentary artifacts are submitted on time.',
  announcementType: 'gold',
  theme: 'emerald_gold',
  quickUploadVisible: true,
  quickAssessVisible: true,
  quickReportsVisible: true
};

export const BannerEditorModal: React.FC<BannerEditorModalProps> = ({
  isOpen,
  onClose,
  initialConfig,
  currentSchoolYearLabel,
  userDisplayName = 'Authorized DepEd User',
  userRole = 'School Administrator',
  onSave
}) => {
  const [formData, setFormData] = useState<DashboardBannerConfig>(() => ({
    badgeText: initialConfig?.badgeText ?? DEFAULT_BANNER.badgeText,
    title: initialConfig?.title ?? DEFAULT_BANNER.title,
    description: initialConfig?.description ?? DEFAULT_BANNER.description,
    showAnnouncement: initialConfig?.showAnnouncement ?? DEFAULT_BANNER.showAnnouncement,
    announcementText: initialConfig?.announcementText ?? DEFAULT_BANNER.announcementText,
    announcementType: initialConfig?.announcementType ?? DEFAULT_BANNER.announcementType,
    theme: initialConfig?.theme ?? DEFAULT_BANNER.theme,
    quickUploadVisible: initialConfig?.quickUploadVisible ?? DEFAULT_BANNER.quickUploadVisible,
    quickAssessVisible: initialConfig?.quickAssessVisible ?? DEFAULT_BANNER.quickAssessVisible,
    quickReportsVisible: initialConfig?.quickReportsVisible ?? DEFAULT_BANNER.quickReportsVisible
  }));

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const handleReset = () => {
    setFormData({ ...DEFAULT_BANNER });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(formData);
      setSuccessMsg(true);
      setTimeout(() => {
        setSuccessMsg(false);
        onClose();
      }, 700);
    } catch (err: any) {
      alert('Failed to save banner settings: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const getThemeClasses = (theme?: string) => {
    switch (theme) {
      case 'forest_classic':
        return 'bg-gradient-to-r from-[#072316] via-[#0D3823] to-[#05180F] border-emerald-500/40';
      case 'midnight_jade':
        return 'bg-gradient-to-r from-[#041B1B] via-[#0A2E2C] to-[#031313] border-teal-500/40';
      case 'royal_pine':
        return 'bg-gradient-to-r from-[#092217] via-[#133F2C] to-[#061910] border-amber-500/45';
      case 'emerald_gold':
      default:
        return 'bg-gradient-to-r from-[#0C301F] via-[#103D28] to-[#072015] border-[#D4AF37]/35';
    }
  };

  const previewTitle = (formData.title || DEFAULT_BANNER.title!).replace('{SY}', currentSchoolYearLabel);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0B2519] rounded-2xl max-w-2xl w-full shadow-2xl border border-[#D4AF37]/40 overflow-hidden text-[#FFFDF9] my-6">
        {/* Header */}
        <div className="px-6 py-4 bg-[#061810] flex items-center justify-between border-b border-[#D4AF37]/20">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-[#0E3824] border border-[#D4AF37]/30 text-[#F0D283]">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#FFFDF9]">Customize Dashboard Banner</h3>
              <p className="text-xs text-[#8FBCA7]">
                Edit title, badge, subtitle, broadcast announcements, and visual styles
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8FBCA7] hover:text-[#FFFDF9] hover:bg-[#0E3824]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Preview Bar */}
        <div className="p-6 bg-[#04120B] border-b border-[#D4AF37]/15">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#F0D283] block mb-2 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#F0D283]" />
            <span>Live Banner Preview</span>
          </span>

          <div className={`rounded-xl p-5 shadow-lg border relative overflow-hidden transition-all ${getThemeClasses(formData.theme)}`}>
            <div className="relative z-10 space-y-2">
              {formData.badgeText && (
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F0D283] text-[11px] font-semibold">
                  <span>{formData.badgeText}</span>
                </div>
              )}

              <h4 className="text-lg font-black tracking-tight text-[#FFFDF9]">
                {previewTitle}
              </h4>

              <p className="text-xs text-[#D1E7DD] leading-relaxed line-clamp-2">
                Welcome, <strong className="text-[#FFFDF9]">{userDisplayName}</strong> ({userRole}). {formData.description}
              </p>

              {formData.showAnnouncement && formData.announcementText && (
                <div className={`p-2 rounded-lg border text-xs flex items-center space-x-2 mt-2 ${
                  formData.announcementType === 'amber'
                    ? 'bg-amber-950/60 border-amber-500/40 text-amber-200'
                    : formData.announcementType === 'emerald'
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                    : formData.announcementType === 'blue'
                    ? 'bg-sky-950/60 border-sky-500/40 text-sky-200'
                    : 'bg-[#0E3824] border-[#D4AF37]/40 text-[#F0D283]'
                }`}>
                  <Megaphone className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{formData.announcementText}</span>
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-2">
                {formData.quickUploadVisible && (
                  <span className="gold-btn px-3 py-1 text-[11px] rounded-lg flex items-center space-x-1">
                    <Upload className="w-3 h-3" />
                    <span>Upload Evidence</span>
                  </span>
                )}
                {formData.quickAssessVisible && (
                  <span className="px-3 py-1 bg-[#061B12]/80 text-[#F0D283] text-[11px] font-semibold rounded-lg border border-[#D4AF37]/40 flex items-center space-x-1">
                    <span>Assessment Matrix</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                )}
                {formData.quickReportsVisible && (
                  <span className="px-3 py-1 bg-[#061B12]/80 text-[#FFFDF9] text-[11px] font-semibold rounded-lg border border-[#D4AF37]/30">
                    <span>Generate Reports</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Editor Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs max-h-[50vh] overflow-y-auto">
          {/* Badge Text */}
          <div>
            <label className="block text-[#E2F0EA] mb-1 font-semibold">
              Policy Badge Label
            </label>
            <input
              type="text"
              value={formData.badgeText || ''}
              onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
              placeholder="e.g. Official Policy DepEd Order No. 007, s. 2024"
              className="w-full p-2.5 bg-[#061810] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* Title */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[#E2F0EA] font-semibold">
                Main Banner Title
              </label>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, title: 'SBM Performance & Evidence Tracking — {SY}' })}
                className="text-[10px] text-[#F0D283] hover:underline"
              >
                Insert {'{SY}'} tag
              </button>
            </div>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. SBM Performance & Evidence Tracking — {SY}"
              required
              className="w-full p-2.5 bg-[#061810] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
            />
            <p className="text-[10px] text-[#8FBCA7] mt-1">
              Tip: The tag <span className="text-[#F0D283] font-mono">{'{SY}'}</span> will automatically be replaced with "{currentSchoolYearLabel}".
            </p>
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-[#E2F0EA] mb-1 font-semibold">
              Subtitle & Welcome Narrative
            </label>
            <textarea
              rows={2}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g. Monitor all 6 SBM dimensions, verify Means of Verification (MOVs), and calibrate official degrees of manifestation."
              className="w-full p-2.5 bg-[#061810] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* Theme Selector */}
          <div>
            <label className="block text-[#E2F0EA] mb-1.5 font-semibold flex items-center space-x-1.5">
              <Palette className="w-3.5 h-3.5 text-[#F0D283]" />
              <span>Banner Background Theme</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'emerald_gold', name: 'Emerald & Gold', preview: 'from-[#0C301F] to-[#072015]' },
                { id: 'forest_classic', name: 'Forest Green', preview: 'from-[#072316] to-[#05180F]' },
                { id: 'midnight_jade', name: 'Midnight Jade', preview: 'from-[#041B1B] to-[#031313]' },
                { id: 'royal_pine', name: 'Royal Pine', preview: 'from-[#092217] to-[#061910]' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, theme: t.id as any })}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    formData.theme === t.id
                      ? 'bg-[#0E3824] border-[#D4AF37] ring-1 ring-[#D4AF37]'
                      : 'bg-[#061810] border-[#D4AF37]/20 hover:border-[#D4AF37]/40'
                  }`}
                >
                  <div className={`h-4 rounded-md bg-gradient-to-r ${t.preview} mb-1.5 border border-[#D4AF37]/20`} />
                  <span className="font-semibold text-[#FFFDF9] block text-[11px]">{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Announcement Toggle */}
          <div className="pt-2 border-t border-[#D4AF37]/15 space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-[#E2F0EA]">Broadcast Announcement Strip</span>
                <p className="text-[10px] text-[#8FBCA7]">Display an urgent alert or reminder within the banner.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.showAnnouncement}
                  onChange={(e) => setFormData({ ...formData, showAnnouncement: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-8 h-4 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>

            {formData.showAnnouncement && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    value={formData.announcementText || ''}
                    onChange={(e) => setFormData({ ...formData, announcementText: e.target.value })}
                    placeholder="e.g. SBM Validation scheduled on Friday."
                    className="w-full p-2 bg-[#061810] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <select
                    value={formData.announcementType || 'gold'}
                    onChange={(e) => setFormData({ ...formData, announcementType: e.target.value as any })}
                    className="w-full p-2 bg-[#061810] border border-[#D4AF37]/30 rounded-xl text-[#FFFDF9] focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="gold">Gold Alert</option>
                    <option value="emerald">Emerald Notice</option>
                    <option value="blue">Blue Info</option>
                    <option value="amber">Amber Urgent</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Button Toggles */}
          <div className="pt-2 border-t border-[#D4AF37]/15">
            <span className="font-semibold text-[#E2F0EA] block mb-1.5">Action Buttons Visibility</span>
            <div className="grid grid-cols-3 gap-2">
              <label className="flex items-center space-x-2 p-2 rounded-xl bg-[#061810] border border-[#D4AF37]/20 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.quickUploadVisible}
                  onChange={(e) => setFormData({ ...formData, quickUploadVisible: e.target.checked })}
                  className="rounded accent-[#D4AF37]"
                />
                <span className="text-[#FFFDF9] text-[11px]">Upload MOV</span>
              </label>
              <label className="flex items-center space-x-2 p-2 rounded-xl bg-[#061810] border border-[#D4AF37]/20 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.quickAssessVisible}
                  onChange={(e) => setFormData({ ...formData, quickAssessVisible: e.target.checked })}
                  className="rounded accent-[#D4AF37]"
                />
                <span className="text-[#FFFDF9] text-[11px]">Assessment</span>
              </label>
              <label className="flex items-center space-x-2 p-2 rounded-xl bg-[#061810] border border-[#D4AF37]/20 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.quickReportsVisible}
                  onChange={(e) => setFormData({ ...formData, quickReportsVisible: e.target.checked })}
                  className="rounded accent-[#D4AF37]"
                />
                <span className="text-[#FFFDF9] text-[11px]">Reports</span>
              </label>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-[#D4AF37]/20">
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-2 text-xs font-semibold text-[#8FBCA7] hover:text-[#FFFDF9] flex items-center space-x-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Defaults</span>
            </button>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#8FBCA7] hover:text-[#FFFDF9] hover:bg-[#0E3322] rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="gold-btn px-5 py-2 rounded-xl text-xs font-bold shadow-lg flex items-center space-x-1.5"
              >
                {successMsg ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>Applied!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Saving...' : 'Apply Banner'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
