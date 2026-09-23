import {
  IndicatorYearRecord,
  RequiredMovItem,
  MovRecord,
  DegreeOfManifestation,
  SubmissionStatus
} from '../types';
import { OFFICIAL_INDICATORS } from './sbmMasterData';

export function generateIndicatorYearRecords(schoolYearId: string): IndicatorYearRecord[] {
  return OFFICIAL_INDICATORS.map((ind) => {
    let defaultDegree: DegreeOfManifestation = 'Not Yet Manifested';
    let status: SubmissionStatus = 'draft';
    let isApplicable = true;
    let applicabilityJustification = '';
    let evidenceBasis = '';
    let improvementAction = '';
    let personResponsible = ind.suggestedLeadOffice || 'Department Head';
    let targetDate = '2027-05-15';

    if (ind.id === 1) {
      // Indicator 1 in JHS/SHS secondary setting
      isApplicable = false;
      applicabilityJustification =
        'Quirino High School is a secondary school (JHS/SHS). Early literacy & numeracy (Grade 3 ELLNA) is handled by feeder elementary schools. Non-applicability officially justified under SDO Quezon City guidelines.';
      defaultDegree = 'Not Yet Manifested';
      status = 'draft';
      evidenceBasis = 'Feeder Elementary Literacy Transition Profiles & SDO QC Guidance Memo.';
    }

    return {
      id: `${schoolYearId}_ind_${ind.id}`,
      schoolYearId,
      indicatorNumber: ind.id,
      dimensionId: ind.dimensionId,
      isApplicable,
      applicabilityJustification,
      degreeOfManifestation: defaultDegree,
      evidenceBasis,
      remarks: `SBM Committee evaluation for ${schoolYearId}`,
      improvementAction,
      personResponsible,
      targetDate,
      reviewStatus: status,
      assignedOwnerId: 'user-dim1-lead-01',
      assignedOwnerName: ind.suggestedLeadOffice || 'Assigned Lead Office',
      reviewerId: 'user-sbm-coord-01',
      reviewerName: 'Jonathan C. Santos (SBM Coordinator)',
      dueDate: '2027-04-30',
      updatedAt: new Date().toISOString()
    };
  });
}

export function generateRequiredMovItems(schoolYearId: string): RequiredMovItem[] {
  const items: RequiredMovItem[] = [];

  OFFICIAL_INDICATORS.forEach((ind) => {
    ind.defaultRequiredMovs.forEach((movTitle, idx) => {
      const code = `MOV-D${ind.dimensionId}-I${ind.id}-${idx + 1}`;
      const status: 'missing' | 'uploaded' | 'verified' | 'approved' = 'missing';

      items.push({
        id: `${schoolYearId}_req_ind${ind.id}_${idx + 1}`,
        schoolYearId,
        indicatorNumber: ind.id,
        dimensionId: ind.dimensionId,
        code,
        title: movTitle,
        description: `Official DepEd Order No. 007, s. 2024 compliance requirement for Indicator ${ind.id}`,
        isMandatory: idx === 0,
        status,
        matchedMovId: undefined
      });
    });
  });

  return items;
}

export function generateSampleMovRecords(schoolYearId: string): MovRecord[] {
  // Sample valid PDF base64
  const samplePdfBase64 =
    'data:application/pdf;base64,' +
    btoa(
      `%PDF-1.4\n1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj\n3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj\n4 0 obj << /Length 235 >> stream\nBT\n/F1 18 Tf\n50 720 Td\n(REPUBLIC OF THE PHILIPPINES) Tj\n0 -25 Td\n/F1 14 Tf\n(DEPARTMENT OF EDUCATION - DIVISION OF QUEZON CITY) Tj\n0 -25 Td\n/F1 12 Tf\n(QUIRINO HIGH SCHOOL - SCHOOL-BASED MANAGEMENT PORTAL) Tj\n0 -30 Td\n(Means of Verification: School Improvement Plan 2024-2027 Resolution) Tj\n0 -20 Td\n(Status: Certified Authentic & Approved for Dimension 1) Tj\nET\nendstream\nendobj\n5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj\nxref\n0 6\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000244 00000 n \n0000000532 00000 n \ntrailer << /Size 6 /Root 1 0 R >>\nstartxref\n601\n%%EOF`
    );

  // Sample SVG Image base64
  const sampleSvgImageBase64 =
    'data:image/svg+xml;base64,' +
    btoa(
      `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
        <rect width="800" height="500" fill="#0D2E1F" rx="16"/>
        <circle cx="400" cy="180" r="80" fill="#123E2A" stroke="#D4AF37" stroke-width="4"/>
        <path d="M400 130 L440 210 L360 210 Z" fill="#D4AF37"/>
        <text x="400" y="310" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#FFFDF9" text-anchor="middle">QUIRINO HIGH SCHOOL — SBM EVIDENCE</text>
        <text x="400" y="345" font-family="Arial, sans-serif" font-size="16" fill="#F0D283" text-anchor="middle">School Learning Action Cell (SLAC) Faculty Training Session</text>
        <text x="400" y="380" font-family="Arial, sans-serif" font-size="13" fill="#8FBCA7" text-anchor="middle">DepEd SDO Quezon City • Certified Means of Verification (Photo Documentation)</text>
        <rect x="250" y="415" width="300" height="35" rx="8" fill="#D4AF37" opacity="0.9"/>
        <text x="400" y="438" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#061810" text-anchor="middle">OFFICIALLY VERIFIED &amp; COMPLIANT</text>
      </svg>`
    );

  // Sample CSV base64
  const sampleCsvBase64 =
    'data:text/csv;base64,' +
    btoa(
      `School Year,Enrollment Total,Promotion Rate,Drop-out Incidence,SBM Rating Level\n2021-2022,3280,97.5%,0.8%,Level 2 (Maturing)\n2022-2023,3420,98.2%,0.6%,Level 2 (Maturing)\n2023-2024,3510,98.8%,0.4%,Level 3 (Advanced Candidate)\n2024-2025,3580,99.2%,0.2%,Level 3 (Advanced Candidate)`
    );

  return [
    {
      id: `${schoolYearId}_mov_sample_1`,
      schoolYearId,
      dimensionId: 1,
      indicatorNumber: 2,
      requiredMovItemId: `${schoolYearId}_req_ind2_1`,
      title: 'School Improvement Plan (SIP 2024–2027) General Assembly Resolution',
      description:
        'Official signed resolution endorsing the three-year School Improvement Plan with full stakeholder concurrence (PTA, LGU, and Alumni).',
      originalFilename: 'QHS_SIP_2024_2027_Signed_Resolution.pdf',
      sanitizedFilename: 'qhs_sip_2024_2027_signed_resolution.pdf',
      fileType: 'pdf',
      mimeType: 'application/pdf',
      fileSize: 425600,
      fileUrl: samplePdfBase64,
      fileData: samplePdfBase64,
      storagePath: `sbm_movs/${schoolYearId}/ind_2/qhs_sip_2024_2027_signed_resolution.pdf`,
      version: 1,
      submissionStatus: 'approved',
      confidentialityLevel: 'public',
      isLocked: true,
      originatingOffice: 'School Governance and Operations (SGOD)',
      documentDate: '2024-09-18',
      uploaderId: 'user-sbm-coord-01',
      uploaderName: 'Jonathan C. Santos',
      uploaderEmail: 'jonathan.santos@depedqc.ph',
      tags: ['SIP', 'Governance', 'Stakeholder Resolution', 'Level 3'],
      relevanceRating: 5,
      completenessRating: 5,
      authenticityRating: 5,
      verifiedBy: 'Dr. Maria Elena Bautista (SDO QC Monitor)',
      verifiedAt: '2024-10-02T10:15:00Z',
      approvedBy: 'Julius Manio (School Principal IV)',
      approvedAt: '2024-10-05T14:30:00Z',
      reviewerComments:
        'Complete, highly authenticated MOV with explicit signatories from the School Governing Council and Barangay Officials. Meets Level 3 Advanced standard.',
      isArchived: false,
      createdAt: '2024-09-20T08:30:00Z',
      updatedAt: '2024-10-05T14:30:00Z'
    },
    {
      id: `${schoolYearId}_mov_sample_2`,
      schoolYearId,
      dimensionId: 3,
      indicatorNumber: 15,
      requiredMovItemId: `${schoolYearId}_req_ind15_1`,
      title: 'Mid-Year School Learning Action Cell (SLAC) Documentation & Attendance Log',
      description:
        'Complete photo portfolio and signed attendance log sheets for the INSET/SLAC session on Differentiated Instruction & AI Tools.',
      originalFilename: 'QHS_SLAC_Photo_Portfolio_2024.png',
      sanitizedFilename: 'qhs_slac_photo_portfolio_2024.png',
      fileType: 'png',
      mimeType: 'image/png',
      fileSize: 685000,
      fileUrl: sampleSvgImageBase64,
      fileData: sampleSvgImageBase64,
      storagePath: `sbm_movs/${schoolYearId}/ind_15/qhs_slac_photo_portfolio_2024.png`,
      version: 1,
      submissionStatus: 'verified',
      confidentialityLevel: 'internal',
      isLocked: false,
      originatingOffice: 'Faculty Club / INSET Coordinator',
      documentDate: '2024-10-22',
      uploaderId: 'user-teach-01',
      uploaderName: 'Patricia Reyes (Head Teacher III)',
      uploaderEmail: 'patricia.reyes@depedqc.ph',
      tags: ['SLAC', 'Faculty Development', 'INSET', 'Instruction'],
      relevanceRating: 5,
      completenessRating: 4,
      authenticityRating: 5,
      verifiedBy: 'Jonathan C. Santos (SBM Coordinator)',
      verifiedAt: '2024-10-25T11:00:00Z',
      reviewerComments:
        'Photo evidence clearly shows faculty engagement with attendance logs attached. Awaiting final principal approval signature.',
      isArchived: false,
      createdAt: '2024-10-23T09:15:00Z',
      updatedAt: '2024-10-25T11:00:00Z'
    },
    {
      id: `${schoolYearId}_mov_sample_3`,
      schoolYearId,
      dimensionId: 2,
      indicatorNumber: 11,
      requiredMovItemId: `${schoolYearId}_req_ind11_1`,
      title: 'School Dropout Rate Comparative Trend (School Form 2 & 4 Multi-Year Analysis)',
      description:
        'Statistical comparative tracking of student retention, drop-out reduction interventions, and project SARDO results.',
      originalFilename: 'QHS_Dropout_Trend_SF2_SF4_Analysis.csv',
      sanitizedFilename: 'qhs_dropout_trend_sf2_sf4_analysis.csv',
      fileType: 'csv',
      mimeType: 'text/csv',
      fileSize: 18400,
      fileUrl: sampleCsvBase64,
      fileData: sampleCsvBase64,
      storagePath: `sbm_movs/${schoolYearId}/ind_11/qhs_dropout_trend_sf2_sf4_analysis.csv`,
      version: 1,
      submissionStatus: 'under_review',
      confidentialityLevel: 'internal',
      isLocked: false,
      originatingOffice: 'Guidance Office / Registrar',
      documentDate: '2024-11-04',
      uploaderId: 'user-guidance-01',
      uploaderName: 'Marilou Gomez (Guidance Counselor)',
      uploaderEmail: 'marilou.gomez@depedqc.ph',
      tags: ['Dropout Reduction', 'SARDO', 'SF2', 'SF4', 'Guidance'],
      relevanceRating: 4,
      completenessRating: 4,
      authenticityRating: 5,
      reviewerComments: 'Document currently under queue evaluation by Dimension 2 Lead Office.',
      isArchived: false,
      createdAt: '2024-11-05T13:45:00Z',
      updatedAt: '2024-11-05T13:45:00Z'
    }
  ];
}
