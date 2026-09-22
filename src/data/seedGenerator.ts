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

export function generateSampleMovRecords(_schoolYearId: string): MovRecord[] {
  return [];
}
