import React, { useState } from 'react';
import {
  Search,
  Bell,
  User,
  LogOut,
  LogIn,
  Calendar,
  Shield,
  ChevronDown,
  Layers,
  Sparkles,
  Menu
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSbmData } from '../../contexts/SbmDataContext';
import { UserRole } from '../../types';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenAuth: () => void;
  onToggleSidebar: () => void;
  onNavigateToNotifications?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenAuth,
  onToggleSidebar
}) => {
  const {
    userProfile,
    role,
    isPublicVisitor,
    switchDemoRole,
    logoutUser
  } = useAuth();

  const {
    schoolYears,
    currentSchoolYear,
    selectSchoolYear,
    notifications,
    markNotificationRead,
    schoolProfile
  } = useSbmData();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.isRead);

  const rolesList: { role: UserRole; label: string; desc: string }[] = [
    { role: 'super_admin', label: 'System Administrator', desc: 'Full System Control, Settings & Audit Logs' },
    { role: 'school_head', label: 'School Head (Principal)', desc: 'Final Approval & School Oversight' },
    { role: 'sbm_coordinator', label: 'SBM Coordinator', desc: 'Annual Workspace & Indicator Assignments' },
    { role: 'dimension_leader', label: 'Dimension Leader', desc: 'Dimension Oversight & Review Queue' },
    { role: 'contributor', label: 'Indicator Contributor', desc: 'MOV Upload, Revisions & Submissions' },
    { role: 'validator', label: 'SDO QC Validator', desc: 'Read-Only External SBM Validation' },
    { role: 'public_visitor', label: 'Public Visitor', desc: 'Public School Profile & Published SRC' }
  ];

  return (
    <header
      id="main-app-header"
      className="sticky top-0 z-30 bg-[#081A12] border-b border-[#D4AF37]/25 shadow-lg h-16 flex items-center justify-between px-4 sm:px-6"
    >
      {/* Left: Brand / Sidebar Toggle / School Year Selector */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <button
          id="mobile-sidebar-toggle-btn"
          type="button"
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-[#8FBCA7] hover:text-[#FFFDF9] hover:bg-[#0E2F20] lg:hidden focus:outline-none transition-colors"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* School Name & Division Branding */}
        <div className="flex items-center space-x-3">
          {schoolProfile?.logoUrl || schoolProfile?.schoolLogo ? (
            <img
              src={schoolProfile.logoUrl || schoolProfile.schoolLogo}
              alt="School Logo"
              className="w-9 h-9 rounded-lg object-contain bg-white/10 p-0.5 border border-[#D4AF37]/40 shadow-inner flex-shrink-0"
            />
          ) : (
            <div className="w-9 h-9 rounded-lg bg-[#0E3322] flex items-center justify-center text-[#F0D283] font-black text-sm tracking-wider shadow-inner border border-[#D4AF37]/40">
              QHS
            </div>
          )}
          <div className="hidden md:block">
            <h1 className="text-sm font-bold text-[#FFFDF9] tracking-tight leading-none flex items-center gap-1.5">
              {schoolProfile?.schoolName || 'Quirino High School'}
              <span className="text-[10px] font-semibold text-[#F0D283] bg-[#D4AF37]/15 px-1.5 py-0.5 rounded border border-[#D4AF37]/30">
                SBM PORTAL
              </span>
            </h1>
          </div>
        </div>

        {/* School Year Dropdown */}
        <div className="relative">
          <div className="flex items-center bg-[#0B2519] hover:bg-[#0E3322] transition-colors rounded-lg px-2.5 py-1.5 border border-[#D4AF37]/30 text-xs font-semibold text-[#FFFDF9]">
            <Calendar className="w-3.5 h-3.5 text-[#D4AF37] mr-1.5" />
            <select
              id="global-school-year-selector"
              value={currentSchoolYear.id}
              onChange={(e) => selectSchoolYear(e.target.value)}
              className="bg-transparent border-none text-xs font-bold text-[#FFFDF9] cursor-pointer focus:outline-none pr-4"
            >
              {schoolYears.map((sy) => (
                <option key={sy.id} value={sy.id} className="bg-[#0B2519] text-[#FFFDF9]">
                  {sy.label} {sy.isArchived ? '(Archived)' : sy.isCurrent ? '(Current)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Right: Search, Notifications, Demo Role Switcher, Profile */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Global Search Shortcut */}
        <button
          id="open-global-search-btn"
          type="button"
          onClick={onOpenSearch}
          className="flex items-center space-x-2 px-3 py-1.5 text-xs text-[#E2F0EA] bg-[#0B2519] hover:bg-[#0E3322] hover:text-[#FFFDF9] rounded-lg border border-[#D4AF37]/25 transition-colors"
        >
          <Search className="w-3.5 h-3.5 text-[#8FBCA7]" />
          <span className="hidden sm:inline">Search SBM indicators & MOVs...</span>
          <kbd className="hidden sm:inline-block text-[10px] bg-[#06140E] text-[#B4D5C5] px-1.5 py-0.5 rounded font-mono border border-[#D4AF37]/20">
            ⌘K
          </kbd>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            id="notifications-dropdown-btn"
            type="button"
            onClick={() => {
              setShowNotifMenu(!showNotifMenu);
              setShowRoleMenu(false);
              setShowProfileMenu(false);
            }}
            className="relative p-2 text-[#E2F0EA] hover:text-[#FFFDF9] hover:bg-[#0E3322] rounded-lg transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D4AF37] ring-2 ring-[#06140E]"></span>
            )}
          </button>

          {showNotifMenu && (
            <div
              id="notifications-menu"
              className="absolute right-0 mt-2 w-80 bg-[#0B2519] rounded-xl shadow-2xl border border-[#D4AF37]/30 py-2 z-50"
            >
              <div className="px-4 py-2 border-b border-[#D4AF37]/20 flex items-center justify-between">
                <span className="text-xs font-bold text-[#FFFDF9]">Notifications</span>
                <span className="text-[10px] text-[#F0D283]">{unreadNotifs.length} unread</span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-[#D4AF37]/15">
                {notifications.length === 0 ? (
                  <p className="text-xs text-[#8FBCA7] p-4 text-center">No notifications at this time.</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-3 text-xs hover:bg-[#0E3322] cursor-pointer ${
                        !n.isRead ? 'bg-[#D4AF37]/10' : ''
                      }`}
                    >
                      <p className="font-semibold text-[#FFFDF9]">{n.title}</p>
                      <p className="text-[#E2F0EA] text-[11px] mt-0.5">{n.message}</p>
                      <p className="text-[10px] text-[#8FBCA7] mt-1">
                        {new Date(n.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Demo Role Switcher */}
        <div className="relative">
          <button
            id="demo-role-switcher-btn"
            type="button"
            onClick={() => {
              setShowRoleMenu(!showRoleMenu);
              setShowNotifMenu(false);
              setShowProfileMenu(false);
            }}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 border border-[#D4AF37]/40 rounded-lg text-xs font-semibold text-[#F0D283] transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="hidden sm:inline capitalize font-bold">
              {role === 'super_admin' ? 'Systems Admin' : role.replace('_', ' ')}
            </span>
            <ChevronDown className="w-3 h-3 text-[#D4AF37]" />
          </button>

          {showRoleMenu && (
            <div
              id="demo-role-menu"
              className="absolute right-0 mt-2 w-72 bg-[#0B2519] rounded-xl shadow-2xl border border-[#D4AF37]/30 py-2 z-50"
            >
              <div className="px-3 py-1.5 border-b border-[#D4AF37]/20 bg-[#06140E] text-[10px] font-bold uppercase tracking-wider text-[#8FBCA7]">
                Switch Role for QA / Preview
              </div>
              <div className="divide-y divide-[#D4AF37]/15">
                {rolesList.map((r) => (
                  <button
                    key={r.role}
                    id={`switch-role-to-${r.role}`}
                    type="button"
                    onClick={() => {
                      switchDemoRole(r.role);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-[#0E3322] transition-colors flex items-start justify-between ${
                      role === r.role ? 'bg-[#D4AF37]/20 font-bold text-[#F0D283]' : 'text-[#E2F0EA]'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-[#FFFDF9]">{r.label}</div>
                      <div className="text-[10px] text-[#8FBCA7] font-normal">{r.desc}</div>
                    </div>
                    {role === r.role && (
                      <span className="w-2 h-2 rounded-full bg-[#D4AF37] mt-1.5 flex-shrink-0"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Account / Profile */}
        <div className="relative">
          {isPublicVisitor && !userProfile ? (
            <button
              id="login-trigger-btn"
              type="button"
              onClick={onOpenAuth}
              className="gold-btn flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-md transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          ) : (
            <>
              <button
                id="user-profile-menu-btn"
                type="button"
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowRoleMenu(false);
                  setShowNotifMenu(false);
                }}
                className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-[#0E3322] text-[#E2F0EA] transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-[#0E3322] border border-[#D4AF37]/40 text-[#F0D283] flex items-center justify-center font-bold text-xs">
                  {userProfile?.displayName ? userProfile.displayName.charAt(0).toUpperCase() : 'U'}
                </div>
                <ChevronDown className="w-3 h-3 text-[#8FBCA7] hidden sm:block" />
              </button>

              {showProfileMenu && (
                <div
                  id="user-profile-dropdown"
                  className="absolute right-0 mt-2 w-64 bg-[#0B2519] rounded-xl shadow-2xl border border-[#D4AF37]/30 py-2 z-50"
                >
                  <div className="px-4 py-2 border-b border-[#D4AF37]/20">
                    <p className="text-xs font-bold text-[#FFFDF9] truncate">
                      {userProfile?.displayName}
                    </p>
                    <p className="text-[11px] text-[#E2F0EA] truncate">{userProfile?.email}</p>
                    <p className="text-[10px] text-[#F0D283] font-semibold mt-1">
                      Role: {userProfile?.role === 'super_admin' ? 'System Administrator' : userProfile?.role.replace('_', ' ')}
                    </p>
                  </div>

                  <div className="py-1">
                    <button
                      id="header-sign-in-another-btn"
                      type="button"
                      onClick={() => {
                        setShowProfileMenu(false);
                        onOpenAuth();
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-[#E2F0EA] hover:bg-[#0E3322] flex items-center space-x-2"
                    >
                      <User className="w-3.5 h-3.5 text-[#8FBCA7]" />
                      <span>Account Credentials / Sign In</span>
                    </button>
                    <button
                      id="header-logout-btn"
                      type="button"
                      onClick={() => {
                        setShowProfileMenu(false);
                        logoutUser();
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-300 hover:bg-rose-950/40 flex items-center space-x-2 font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-400" />
                      <span>Sign Out (Public View)</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};
