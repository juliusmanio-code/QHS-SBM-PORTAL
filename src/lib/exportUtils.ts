import {
  IndicatorYearRecord,
  RequiredMovItem,
  MovRecord,
  SchoolYear,
  SchoolProfile
} from '../types';
import { OFFICIAL_INDICATORS, OFFICIAL_DIMENSIONS } from '../data/sbmMasterData';

export function exportToCsv(filename: string, rows: (string | number)[][]) {
  const processRow = (row: (string | number)[]) => {
    return row
      .map((val) => {
        const text = String(val ?? '').replace(/"/g, '""');
        return `"${text}"`;
      })
      .join(',');
  };

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + rows.map(processRow).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function generate42IndicatorMatrixCsv(
  schoolYear: SchoolYear,
  records: IndicatorYearRecord[]
) {
  const header = [
    'Indicator #',
    'Dimension #',
    'Dimension Name',
    'Official Indicator Text (DO 007, s. 2024)',
    'Applicability',
    'Non-Applicability Justification',
    'Degree of Manifestation',
    'Evidence Basis',
    'Improvement Action Plan',
    'Person Responsible',
    'Target Due Date',
    'Review & Validation Status',
    'Approved By'
  ];

  const rows = OFFICIAL_INDICATORS.map((ind) => {
    const rec = records.find((r) => r.indicatorNumber === ind.id);
    const dim = OFFICIAL_DIMENSIONS.find((d) => d.id === ind.dimensionId);

    return [
      ind.id,
      ind.dimensionId,
      dim?.name || `Dimension ${ind.dimensionId}`,
      ind.officialWording,
      rec?.isApplicable !== false ? 'Applicable' : 'Non-Applicable',
      rec?.applicabilityJustification || '',
      rec?.degreeOfManifestation || 'Not Evaluated',
      rec?.evidenceBasis || '',
      rec?.improvementAction || '',
      rec?.personResponsible || '',
      rec?.targetDate || '',
      rec?.reviewStatus?.toUpperCase() || 'DRAFT',
      rec?.approvedBy || ''
    ];
  });

  exportToCsv(`QHS_SBM_42_Indicator_Matrix_${schoolYear.label.replace(/\s+/g, '_')}.csv`, [
    ['QUIRINO HIGH SCHOOL — QHS SBM PORTAL'],
    ['42-Indicator SBM Compliance Matrix (DepEd Order No. 007, s. 2024)'],
    [`School Year: ${schoolYear.label}`, `Generated on: ${new Date().toLocaleDateString()}`],
    [],
    header,
    ...rows
  ]);
}

export function generateMovMasterIndexCsv(
  schoolYear: SchoolYear,
  movList: MovRecord[]
) {
  const header = [
    'MOV ID',
    'Dim #',
    'Ind #',
    'MOV Title',
    'File Name',
    'File Type',
    'File Size (KB)',
    'Version',
    'Originating Office',
    'Uploader',
    'Submission Status',
    'Confidentiality Level',
    'Document Date',
    'Verified By',
    'Approved By',
    'Reviewer Remarks'
  ];

  const rows = movList.map((mov) => [
    mov.id,
    mov.dimensionId,
    mov.indicatorNumber,
    mov.title,
    mov.originalFilename,
    mov.fileType.toUpperCase(),
    Math.round(mov.fileSize / 1024),
    `v${mov.version}`,
    mov.originatingOffice || '—',
    mov.uploaderName,
    mov.submissionStatus.toUpperCase(),
    mov.confidentialityLevel.toUpperCase(),
    mov.documentDate || '—',
    mov.verifiedBy || '—',
    mov.approvedBy || '—',
    mov.reviewerComments || '—'
  ]);

  exportToCsv(`QHS_MOV_Master_Index_${schoolYear.label.replace(/\s+/g, '_')}.csv`, [
    ['QUIRINO HIGH SCHOOL — QHS SBM PORTAL'],
    ['Master Means of Verification (MOV) Repository Index'],
    [`School Year: ${schoolYear.label}`, `Generated on: ${new Date().toLocaleDateString()}`],
    [],
    header,
    ...rows
  ]);
}

export function generateMissingMovGapReportCsv(
  schoolYear: SchoolYear,
  reqItems: RequiredMovItem[]
) {
  const missingItems = reqItems.filter((i) => i.status === 'missing' || i.status === 'uploaded');

  const header = [
    'Requirement Code',
    'Dimension #',
    'Indicator #',
    'Required MOV Checklist Title',
    'Description / Mandate',
    'Mandatory Status',
    'Current Status'
  ];

  const rows = missingItems.map((item) => [
    item.code,
    item.dimensionId,
    item.indicatorNumber,
    item.title,
    item.description,
    item.isMandatory ? 'Mandatory' : 'Optional / Supplementary',
    item.status === 'missing' ? 'CRITICAL: MISSING EVIDENCE' : 'PENDING REVIEW/APPROVAL'
  ]);

  exportToCsv(`QHS_SBM_Missing_MOV_Gap_Report_${schoolYear.label.replace(/\s+/g, '_')}.csv`, [
    ['QUIRINO HIGH SCHOOL — QHS SBM PORTAL'],
    ['SBM Gap Analysis & Missing Means of Verification Report'],
    [`School Year: ${schoolYear.label}`, `Generated on: ${new Date().toLocaleDateString()}`],
    [],
    header,
    ...rows
  ]);
}

export function exportMatrixToCSV(
  indicators: typeof OFFICIAL_INDICATORS,
  records: IndicatorYearRecord[],
  schoolYearId: string
) {
  const dummySy: SchoolYear = {
    id: schoolYearId,
    label: schoolYearId.replace('SY-', 'S.Y. '),
    startDate: '2024-08-01',
    endDate: '2025-06-30',
    isCurrent: true,
    isArchived: false,
    createdAt: new Date().toISOString()
  };
  generate42IndicatorMatrixCsv(dummySy, records);
}

export function exportMovIndexToCSV(
  movList: MovRecord[],
  schoolYearId: string
) {
  const dummySy: SchoolYear = {
    id: schoolYearId,
    label: schoolYearId.replace('SY-', 'S.Y. '),
    startDate: '2024-08-01',
    endDate: '2025-06-30',
    isCurrent: true,
    isArchived: false,
    createdAt: new Date().toISOString()
  };
  generateMovMasterIndexCsv(dummySy, movList);
}

export function exportGapAnalysisToCSV(
  reqItems: RequiredMovItem[],
  schoolYearId: string
) {
  const dummySy: SchoolYear = {
    id: schoolYearId,
    label: schoolYearId.replace('SY-', 'S.Y. '),
    startDate: '2024-08-01',
    endDate: '2025-06-30',
    isCurrent: true,
    isArchived: false,
    createdAt: new Date().toISOString()
  };
  generateMissingMovGapReportCsv(dummySy, reqItems);
}
