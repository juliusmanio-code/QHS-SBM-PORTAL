import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SbmDataProvider, useSbmData } from './contexts/SbmDataContext';
import { Header } from './components/layout/Header';
import { Sidebar, NavigationPage } from './components/layout/Sidebar';
import { GlobalSearchModal } from './components/layout/GlobalSearchModal';
import { PrivacyNoticeBanner } from './components/common/PrivacyNoticeBanner';
import { FilePreviewModal } from './components/common/FilePreviewModal';

import { PublicPortalView } from './components/public/PublicPortalView';
import { SbmDashboardView } from './components/dashboard/SbmDashboardView';
import { DimensionsListView } from './components/dimensions/DimensionsListView';
import { DimensionDetailView } from './components/dimensions/DimensionDetailView';
import { IndicatorsListView } from './components/indicators/IndicatorsListView';
import { IndicatorDetailView } from './components/indicators/IndicatorDetailView';
import { MovRepositoryView } from './components/repository/MovRepositoryView';
import { UploadMovModal } from './components/repository/UploadMovModal';
import { ReplaceMovModal } from './components/repository/ReplaceMovModal';
import { SelfAssessmentMatrixView } from './components/assessment/SelfAssessmentMatrixView';
import { ReviewApprovalQueueView } from './components/reviews/ReviewApprovalQueueView';
import { ReviewDialog } from './components/reviews/ReviewDialog';
import { UnlockDialog } from './components/reviews/UnlockDialog';
import { ReportsCenterView } from './components/reports/ReportsCenterView';
import { SchoolProfileView } from './components/profile/SchoolProfileView';
import { SchoolReportCardView } from './components/src/SchoolReportCardView';
import { AdminControlCenter } from './components/admin/AdminControlCenter';
import { AuthModal } from './components/auth/AuthModal';
import { MovRecord } from './types';

const MainAppContent: React.FC = () => {
  const { isPublicVisitor, role } = useAuth();
  const { movRecords } = useSbmData();

  // Navigation State
  const [currentPage, setCurrentPage] = useState<NavigationPage>(
    isPublicVisitor ? 'home' : 'dashboard'
  );
  const [selectedDimensionId, setSelectedDimensionId] = useState<number | null>(null);
  const [selectedIndicatorNumber, setSelectedIndicatorNumber] = useState<number | null>(null);

  // Sidebar mobile toggle
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadDefaultIndicator, setUploadDefaultIndicator] = useState<number | undefined>(
    undefined
  );

  const [previewMov, setPreviewMov] = useState<MovRecord | null>(null);
  const [replaceMov, setReplaceMov] = useState<MovRecord | null>(null);
  const [reviewingMov, setReviewingMov] = useState<MovRecord | null>(null);
  const [unlockingMov, setUnlockingMov] = useState<MovRecord | null>(null);

  // Global Keyboard listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigateToIndicator = (indicatorNumber: number) => {
    setSelectedIndicatorNumber(indicatorNumber);
    setCurrentPage('indicators');
  };

  const handleNavigateToDimension = (dimensionId: number) => {
    setSelectedDimensionId(dimensionId);
    setCurrentPage('dimensions');
  };

  const handleOpenUploadForIndicator = (indicatorNumber: number) => {
    setUploadDefaultIndicator(indicatorNumber);
    setIsUploadOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#081A12] text-[#FFFDF9] flex flex-col font-sans antialiased selection:bg-[#D4AF37]/30 selection:text-[#FFFDF9]">
      {/* Main Layout Shell */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          currentPage={currentPage}
          onSelectPage={(page) => {
            setCurrentPage(page);
            if (page === 'dimensions') setSelectedDimensionId(null);
            if (page === 'indicators') setSelectedIndicatorNumber(null);
          }}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#081A12]">
          {/* Header */}
          <Header
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenAuth={() => setIsAuthOpen(true)}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />

          {/* Main Body Stage */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {/* Router Views */}
            {currentPage === 'home' && (
              <PublicPortalView
                onOpenAuth={() => setIsAuthOpen(true)}
                onNavigateToProfile={() => setCurrentPage('profile')}
                onNavigateToSrc={() => setCurrentPage('src')}
                onNavigateToDashboard={() => setCurrentPage('dashboard')}
              />
            )}

            {currentPage === 'dashboard' && (
              <SbmDashboardView
                onNavigateToDimension={handleNavigateToDimension}
                onNavigateToIndicator={handleNavigateToIndicator}
                onNavigateToRepository={() => setCurrentPage('repository')}
                onNavigateToAssessment={() => setCurrentPage('assessment')}
                onNavigateToReviews={() => setCurrentPage('reviews')}
                onNavigateToReports={() => setCurrentPage('reports')}
                onOpenUpload={() => {
                  setUploadDefaultIndicator(undefined);
                  setIsUploadOpen(true);
                }}
                onPreviewMov={(mov) => setPreviewMov(mov)}
              />
            )}

            {currentPage === 'dimensions' && (
              <>
                {selectedDimensionId ? (
                  <DimensionDetailView
                    dimensionId={selectedDimensionId}
                    onBack={() => setSelectedDimensionId(null)}
                    onSelectIndicator={handleNavigateToIndicator}
                  />
                ) : (
                  <DimensionsListView onSelectDimension={handleNavigateToDimension} />
                )}
              </>
            )}

            {currentPage === 'indicators' && (
              <>
                {selectedIndicatorNumber ? (
                  <IndicatorDetailView
                    indicatorNumber={selectedIndicatorNumber}
                    onBack={() => setSelectedIndicatorNumber(null)}
                    onOpenUploadForIndicator={handleOpenUploadForIndicator}
                    onPreviewMov={(mov) => setPreviewMov(mov)}
                    onReplaceMov={(mov) => setReplaceMov(mov)}
                    onReviewMov={(mov) => setReviewingMov(mov)}
                  />
                ) : (
                  <IndicatorsListView onSelectIndicator={handleNavigateToIndicator} />
                )}
              </>
            )}

            {currentPage === 'repository' && (
              <MovRepositoryView
                onOpenUpload={() => {
                  setUploadDefaultIndicator(undefined);
                  setIsUploadOpen(true);
                }}
                onPreviewMov={(mov) => setPreviewMov(mov)}
                onReplaceMov={(mov) => setReplaceMov(mov)}
                onReviewMov={(mov) => setReviewingMov(mov)}
                onNavigateToIndicator={handleNavigateToIndicator}
              />
            )}

            {currentPage === 'assessment' && (
              <SelfAssessmentMatrixView onSelectIndicator={handleNavigateToIndicator} />
            )}

            {currentPage === 'reviews' && (
              <ReviewApprovalQueueView
                onReviewMov={(mov) => setReviewingMov(mov)}
                onPreviewMov={(mov) => setPreviewMov(mov)}
                onUnlockMov={(mov) => setUnlockingMov(mov)}
                onNavigateToIndicator={handleNavigateToIndicator}
              />
            )}

            {currentPage === 'reports' && <ReportsCenterView />}

            {currentPage === 'profile' && <SchoolProfileView />}

            {currentPage === 'src' && <SchoolReportCardView />}

            {currentPage === 'admin' && <AdminControlCenter />}
          </main>
        </div>
      </div>

      {/* Global Modals */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectIndicator={handleNavigateToIndicator}
        onSelectMov={(movId) => {
          const found = movRecords.find((m) => m.id === movId);
          if (found) {
            setPreviewMov(found);
            setIsSearchOpen(false);
          }
        }}
      />

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      <UploadMovModal
        isOpen={isUploadOpen}
        defaultIndicatorNumber={uploadDefaultIndicator}
        onClose={() => setIsUploadOpen(false)}
      />

      <ReplaceMovModal
        mov={replaceMov}
        isOpen={!!replaceMov}
        onClose={() => setReplaceMov(null)}
      />

      <ReviewDialog
        mov={reviewingMov}
        isOpen={!!reviewingMov}
        onClose={() => setReviewingMov(null)}
        onPreviewMov={(mov) => setPreviewMov(mov)}
      />

      <UnlockDialog
        mov={unlockingMov}
        isOpen={!!unlockingMov}
        onClose={() => setUnlockingMov(null)}
      />

      <FilePreviewModal
        mov={previewMov}
        isOpen={!!previewMov}
        onClose={() => setPreviewMov(null)}
        onReplace={(mov) => setReplaceMov(mov)}
      />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <SbmDataProvider>
        <MainAppContent />
      </SbmDataProvider>
    </AuthProvider>
  );
}

export default App;
