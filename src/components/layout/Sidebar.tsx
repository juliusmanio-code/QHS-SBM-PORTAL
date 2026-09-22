import React from 'react';
import {
  LayoutDashboard,
  Layers,
  FileCheck2,
  FolderArchive,
  ClipboardList,
  CheckCircle,
  FileBarChart,
  School,
  FileSpreadsheet,
  Settings,
  ShieldCheck,
  BookOpen,
  Home,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSbmData } from '../../contexts/SbmDataContext';

export type NavigationPage =
  | 'home'
  | 'dashboard'
  | 'dimensions'
  | 'indicators'
  | 'repository'
  | 'assessment'
  | 'reviews'
  | 'reports'
  | 'profile'
  | 'src'
  | 'admin';

interface SidebarProps {
  currentPage: NavigationPage;
  onSelectPage: (page: NavigationPage) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  isOpen,
  onClose
}) => {
  const { isSuperAdmin, isCoordinator, isSchoolHead, isDimensionLeader, isPublicVisitor, role } = useAuth();
  const { progressStats, currentSchoolYear, schoolProfile } = useSbmData();

  const pendingReviewCount =
    progressStats.statusCounts.submitted + progressStats.statusCounts.under_review;

  const navItems = [
    {
      id: 'home' as NavigationPage,
      label: 'Home & Welcome',
      icon: Home,
      publicAllowed: true
    },
    {
      id: 'dashboard' as NavigationPage,
      label: 'SBM Dashboard',
      icon: LayoutDashboard,
      publicAllowed: false
    },
    {
      id: 'dimensions' as NavigationPage,
      label: '6 SBM Dimensions',
      icon: Layers,
      publicAllowed: false,
      badge: '6'
    },
    {
      id: 'indicators' as NavigationPage,
      label: '42 SBM Indicators',
      icon: FileCheck2,
      publicAllowed: false,
      badge: '42'
    },
    {
      id: 'repository' as NavigationPage,
      label: 'MOV Repository',
      icon: FolderArchive,
      publicAllowed: false
    },
    {
      id: 'assessment' as NavigationPage,
      label: 'Assessment Matrix',
      icon: ClipboardList,
      publicAllowed: false
    },
    {
      id: 'reviews' as NavigationPage,
      label: 'Review & Approval',
      icon: CheckCircle,
      publicAllowed: false,
      badgeCount: pendingReviewCount > 0 ? pendingReviewCount : undefined
    },
    {
      id: 'reports' as NavigationPage,
      label: 'Reports & Exports',
      icon: FileBarChart,
      publicAllowed: false
    },
    {
      id: 'profile' as NavigationPage,
      label: 'School Profile',
      icon: School,
      publicAllowed: true
    },
    {
      id: 'src' as NavigationPage,
      label: 'School Report Card',
      icon: FileSpreadsheet,
      publicAllowed: true
    },
    {
      id: 'admin' as NavigationPage,
      label: 'System Admin & Audit',
      icon: Settings,
      publicAllowed: false,
      adminOnly: true
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          id="sidebar-backdrop"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#06140E] text-[#B4D5C5] border-r border-[#D4AF37]/25 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#D4AF37]/20 bg-[#04100A]">
          <div className="flex items-center space-x-3 min-w-0">
            {schoolProfile?.logoUrl || schoolProfile?.schoolLogo ? (
              <img
                src={schoolProfile.logoUrl || schoolProfile.schoolLogo}
                alt="School Logo"
                className="w-9 h-9 rounded-lg object-contain bg-white/10 p-0.5 border border-[#D4AF37]/40 flex-shrink-0 shadow-md"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-[#0E3322] border border-[#D4AF37]/40 flex items-center justify-center text-[#F0D283] font-black text-xs shadow-md flex-shrink-0">
                DEPED
              </div>
            )}
            <div className="min-w-0">
              <span className="font-bold text-[#FFFDF9] text-sm tracking-tight block truncate">QHS SBM PORTAL</span>
            </div>
          </div>
          <button
            id="sidebar-close-btn"
            onClick={onClose}
            className="p-1 rounded-lg text-[#8FBCA7] hover:text-[#FFFDF9] hover:bg-[#0E2F20] lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#8FBCA7]">
            Navigation Menu
          </div>

          {navItems.map((item) => {
            if (item.adminOnly && !isSuperAdmin && !isCoordinator) {
              return null;
            }

            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                type="button"
                onClick={() => {
                  onSelectPage(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#D4AF37]/20 text-[#F0D283] border border-[#D4AF37]/40 shadow-sm font-bold'
                    : 'text-[#E2F0EA] hover:bg-[#0E2F20] hover:text-[#FFFDF9] border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-[#F0D283]' : 'text-[#8FBCA7] group-hover:text-[#FFFDF9]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-[#D4AF37]/30 text-[#F0D283]' : 'bg-[#0E2F20] text-[#8FBCA7]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {item.badgeCount !== undefined && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#D4AF37] text-[#06140E] animate-pulse">
                    {item.badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active School Year & Policy Badge */}
        <div className="p-3 border-t border-[#D4AF37]/20 bg-[#04100A]">
          <div className="p-2.5 rounded-xl bg-[#0B2519] border border-[#D4AF37]/25 space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#8FBCA7] font-medium">Selected S.Y.</span>
              <span className="font-bold text-[#F0D283]">{currentSchoolYear.label}</span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-[#8FBCA7]">
              <span>Overall Evidence:</span>
              <span className="font-semibold text-emerald-400">
                {progressStats.overallEvidenceCompletionPct}%
              </span>
            </div>
            <div className="w-full bg-[#04100A] rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#D4AF37] to-emerald-400 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progressStats.overallEvidenceCompletionPct}%` }}
              />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
