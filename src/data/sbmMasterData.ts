import {
  SbmDimension,
  SbmIndicator,
  SchoolYear,
  SchoolProfile,
  UserProfile,
  SchoolReportCard,
  SystemAnnouncement,
  SystemSettings
} from '../types';

export const INITIAL_SCHOOL_YEARS: SchoolYear[] = [
  {
    id: 'SY-2024-2025',
    label: 'S.Y. 2024–2025',
    isCurrent: true,
    isArchived: false,
    startDate: '2024-07-29',
    endDate: '2025-05-30',
    createdAt: '2024-07-01T08:00:00Z'
  },
  {
    id: 'SY-2025-2026',
    label: 'S.Y. 2025–2026',
    isCurrent: false,
    isArchived: false,
    startDate: '2025-07-28',
    endDate: '2026-05-29',
    createdAt: '2025-07-01T08:00:00Z'
  },
  {
    id: 'SY-2026-2027',
    label: 'S.Y. 2026–2027',
    isCurrent: false,
    isArchived: false,
    startDate: '2026-07-27',
    endDate: '2027-05-28',
    createdAt: '2026-07-01T08:00:00Z'
  }
];

export const OFFICIAL_DIMENSIONS: SbmDimension[] = [
  {
    id: 1,
    name: 'Curriculum and Teaching',
    officialDescription:
      'School personnel and stakeholders work collaboratively to enhance learning standards to continually build a relevant and inclusive learning community and achieve improved learning outcomes.'
  },
  {
    id: 2,
    name: 'Learning Environment',
    officialDescription:
      'The school and its community work collaboratively to ensure equitable access to a learner-centered, motivating, healthy, safe, secure, inclusive, resilient, and enabling learning environment and to achieve improved learning outcomes.'
  },
  {
    id: 3,
    name: 'Leadership',
    officialDescription:
      'School personnel and stakeholders are empowered and actively engaged in taking on appropriate leadership roles and responsibilities to continuously improve the school for improved learning outcomes.'
  },
  {
    id: 4,
    name: 'Governance and Accountability',
    officialDescription:
      'The school and its community come together to take responsibility for ensuring participation, transparency, and accountability, as well as the implementation of a plan to continuously improve the delivery of basic education services, organizational health, and performance for improved learning outcomes.'
  },
  {
    id: 5,
    name: 'Human Resource and Team Development',
    officialDescription:
      'School personnel collaborate to continuously improve individual capabilities and team capacity to create an environment that shall yield high performance for improved learning outcomes.'
  },
  {
    id: 6,
    name: 'Finance and Resource Management and Mobilization',
    officialDescription:
      'The school judiciously manages and mobilizes resources to support programs, projects, and activities that contribute to the improvement of learning outcomes.'
  }
];

export const OFFICIAL_INDICATORS: SbmIndicator[] = [
  // Dimension 1: Curriculum and Teaching (1 - 8)
  {
    id: 1,
    dimensionId: 1,
    officialWording:
      'Grade 3 learners achieve the proficiency level for each cluster of early language, literacy, and numeracy skills.',
    defaultRequiredMovs: [
      'Early Language, Literacy, and Numeracy Assessment (ELLNA) Results Summary',
      'Consolidated Reading Assessment Tool (CRAT) / CRLA Proficiency Profile',
      'Remediation & Intervention Plan for Non-Proficient Early Learners',
      'Teacher Accomplishment Report on Literacy and Numeracy Skills'
    ],
    defaultConfidentiality: 'internal',
    suggestedLeadOffice: 'Curriculum Implementation Division / Early Grade Focal',
    localGuidanceNotes:
      'For secondary schools like QHS, this indicator may be configured as Non-Applicable with SDO Quezon City justified resolution, or verified via feeder school literacy transition tracking.'
  },
  {
    id: 2,
    dimensionId: 1,
    officialWording:
      'Grade 6, 10, and 12 learners achieve the proficiency level in all 21st-century skills and core learning areas in the National Achievement Test (NAT).',
    defaultRequiredMovs: [
      'National Achievement Test (NAT G10 & G12) Consolidated Performance Report',
      'MPS and Proficiency Level Analysis across Core Learning Areas',
      'Subject Area Intervention Matrix for NAT Priority Competencies',
      'Mock NAT / Diagnostic Test Administration Records & Analysis'
    ],
    defaultConfidentiality: 'internal',
    suggestedLeadOffice: 'Academic Department Heads / Testing Coordinator'
  },
  {
    id: 3,
    dimensionId: 1,
    officialWording:
      'School-based ALS learners attain certification as elementary and junior high school completers.',
    defaultRequiredMovs: [
      'ALS Accreditation and Equivalency (A&E) Test Results & Passers Roster',
      'School-Based ALS Enrollment and Completion Summary Report',
      'Portfolio Assessment Sheets and ALS Learning Facilitator Certifications'
    ],
    defaultConfidentiality: 'internal',
    suggestedLeadOffice: 'ALS School Coordinator / Community Learning Facilitator'
  },
  {
    id: 4,
    dimensionId: 1,
    officialWording:
      'Teachers prepare contextualized learning materials responsive to the needs of learners.',
    defaultRequiredMovs: [
      'Division/School Quality Assured Contextualized & Localized Learning Modules (SLMs/LAS)',
      'LRMDS Inventory & Quality Assurance Evaluation Sheets (Form 1 & 2)',
      'Sample Lesson Exemplars featuring Contextualized Learning Activities'
    ],
    defaultConfidentiality: 'internal',
    suggestedLeadOffice: 'Learning Resource Management Section (LRMS)'
  },
  {
    id: 5,
    dimensionId: 1,
    officialWording:
      'Teachers conduct remediation activities to address learning gaps in reading and comprehension, science and technology, and mathematics.',
    defaultRequiredMovs: [
      'Reading Intervention Program Records (Phil-IRI Pre & Post Test Summaries)',
      'Math & Science Remediation Attendance Sheets and Logbooks',
      'Learners Progress Monitoring Cards and Post-Remediation Assessment MPS',
      'Approved Catch-Up Friday and After-Class Remediation Schedule'
    ],
    defaultConfidentiality: 'internal',
    suggestedLeadOffice: 'English, Filipino, Math & Science Departments'
  },
  {
    id: 6,
    dimensionId: 1,
    officialWording:
      'Teachers integrate topics promoting peace and DepEd core values.',
    defaultRequiredMovs: [
      'Sample Daily Lesson Logs (DLL) / Daily Lesson Plans (DLP) highlighting Peace Education',
      'Values Education and EsP Culminating Activity Reports and Photo Documentation',
      'Classroom Observation Tool (COT) Rating Sheets with Core Values Integration'
    ],
    defaultConfidentiality: 'public',
    suggestedLeadOffice: 'Edukasyon sa Pagpapakatao (EsP) Department'
  },
  {
    id: 7,
    dimensionId: 1,
    officialWording:
      'The school conducts test item analysis to inform its teaching and learning process.',
    defaultRequiredMovs: [
      'Quarterly Periodic Examination Test Item Analysis Summaries per Subject Area',
      'Table of Specifications (TOS) aligned with Most Essential Learning Competencies',
      'Action Plans & Adjustments Formulated Based on Item Analysis Findings',
      'Department Minutes of Meeting discussing Least Mastered Competencies'
    ],
    defaultConfidentiality: 'internal',
    suggestedLeadOffice: 'Department Heads / Assessment Committee'
  },
  {
    id: 8,
    dimensionId: 1,
    officialWording:
      'The school engages local industries to strengthen its TLE-TVL course offerings.',
    defaultRequiredMovs: [
      'Memorandum of Agreement / Understanding (MOA/MOU) with Industry Partners',
      'Work Immersion Implementation Plan, Placement Roster, and Partner Feedback',
      'Joint Industry-School Curriculum Enhancement Workshop Documentation',
      'NC I/II Assessment and Certification Passers Summary from TESDA'
    ],
    defaultConfidentiality: 'internal',
    suggestedLeadOffice: 'TLE/TVL Department & Senior High School Coordinator'
  },

  // Dimension 2: Learning Environment (9 - 18)
  {
    id: 9,
    dimensionId: 2,
    officialWording: 'The school has zero bullying incidence.',
    defaultRequiredMovs: [
      'Consolidated Annual School Bullying Incident Summary Report (Form 14 / CPC)',
      'School Anti-Bullying Campaign and Orientation Documentation',
      'Intake and Referral Mechanism Logbook (Redacted / Anonymized)',
      'Guidance Office Prevention and Psycho-Social Wellness Interventions'
    ],
    isIncidentRelated: true,
    defaultConfidentiality: 'confidential',
    suggestedLeadOffice: 'Child Protection Committee & Guidance Services Office',
    localGuidanceNotes:
      'Protected under Republic Act 10627 and Data Privacy Act. Never upload identifiable names or student case files. Upload only anonymized statistical certifications.'
  },
  {
    id: 10,
    dimensionId: 2,
    officialWording: 'The school has zero child abuse incidence.',
    defaultRequiredMovs: [
      'Annual DepEd Child Protection Policy Compliance Report & Zero-Incident Certification',
      'Positive Discipline in Everyday Teaching Training Certificates and Photos',
      'Guidance Office Child Rights and Protection Case Statistics (Anonymized)'
    ],
    isIncidentRelated: true,
    defaultConfidentiality: 'confidential',
    suggestedLeadOffice: 'Child Protection Committee / School Head'
  },
  {
    id: 11,
    dimensionId: 2,
    officialWording: 'The school has reduced its dropout incidence.',
    defaultRequiredMovs: [
      'School Dropout Rate Comparative Trend (School Form 2 & 4 Summaries)',
      'Drop-Out Reduction Program (DORP) / Open High School / Project SARDO Records',
      'Home Visitation Logbooks and Intervention Tracking Summaries'
    ],
    defaultConfidentiality: 'internal',
    suggestedLeadOffice: 'Guidance Office / School Registrar / Year Level Coordinators'
  },
  {
    id: 12,
    dimensionId: 2,
    officialWording: 'The school conducts culture-sensitive activities.',
    defaultRequiredMovs: [
      'Buwan ng Wika, Indigenous Peoples (IP) Month, and Cultural Festival Reports',
      'Inclusive and Gender & Development (GAD) Sensitive Activity Documentation',
      'Narrative Accomplishment Reports with Photo Evidence of Multicultural Events'
    ],
    defaultConfidentiality: 'public',
    suggestedLeadOffice: 'Araling Panlipunan / MAPEH / GAD Focal Person'
  },
  {
    id: 13,
    dimensionId: 2,
    officialWording:
      'The school provides access to learning experiences for the disadvantaged, out-of-school youth, and adult learners.',
    defaultRequiredMovs: [
      'Special Education (SPED) / Inclusive Education Inclusion Registry',
      'Community Mapping Survey Results and OSY Outreach Campaign Records',
      'Modified In-School Off-School Approach (MISOSA) & Distance Learning Logs'
    ],
    defaultConfidentiality: 'internal',
    suggestedLeadOffice: 'Inclusive Education / ALS Committee'
  },
  {
    id: 14,
    dimensionId: 2,
    officialWording: 'The school has a functional school-based ALS program.',
    defaultRequiredMovs: [
      'ALS Community Learning Center (CLC) Registration & Functionality Inventory',
      'ALS Instructional Schedule and Class Registry',
      'ALS Monitoring & Evaluation Tool Completed by SDO Division Supervisors'
    ],
    defaultConfidentiality: 'internal',
    suggestedLeadOffice: 'ALS Program Implementers'
  },
  {
    id: 15,
    dimensionId: 2,
    officialWording: 'The school has a functional Child Protection Committee.',
    defaultRequiredMovs: [
      'School Memorandum on the Composition & Designation of CPC Members',
      'Approved Child Protection Committee Annual Action Plan',
      'Minutes of Quarterly CPC Meetings with Attendance Sheets',
      'School Child Protection Policy Information-Education-Communication (IEC) Materials'
    ],
    isIncidentRelated: true,
    defaultConfidentiality: 'restricted',
    suggestedLeadOffice: 'Child Protection Committee'
  },
  {
    id: 16,
    dimensionId: 2,
    officialWording: 'The school has a functional DRRM plan.',
    defaultRequiredMovs: [
      'Comprehensive School Disaster Risk Reduction and Management (SDRRM) Plan',
      'Nationwide Simultaneous Earthquake Drill (NSED) Documentation & Evacuation Maps',
      'Hazard Mapping, Structural Assessment, and Emergency Response Team Roster',
      'Emergency First Aid & DRRM Equipment Inventory and Inspection Logs'
    ],
    defaultConfidentiality: 'internal',
    suggestedLeadOffice: 'SDRRM Coordinator'
  },
  {
    id: 17,
    dimensionId: 2,
    officialWording:
      'The school has a functional support mechanism for mental wellness.',
    defaultRequiredMovs: [
      'School Mental Health and Psychosocial Support Program (MHPSS) Action Plan',
      'Peer Facilitators / Youth Advocates Group Formation & Training Reports',
      'Mental Health Awareness Month Activities and Wellness Session Records',
      'Guidance Counseling and Referral Protocol Guidelines'
    ],
    defaultConfidentiality: 'restricted',
    suggestedLeadOffice: 'Guidance Services & Health/Nutrition Section'
  },
  {
    id: 18,
    dimensionId: 2,
    officialWording:
      'The school has special education- and PWD-friendly facilities.',
    defaultRequiredMovs: [
      'Accessibility Audit Checklist for PWD-Friendly Infrastructure (Ramps, Handrails, Toilets)',
      'Photographic Evidence of SPED Classrooms, Tactile Markers, and Signages',
      'School Facilities Improvement Plan allocating PWD Enhancements'
    ],
    defaultConfidentiality: 'public',
    suggestedLeadOffice: 'Physical Facilities Coordinator / SPED Focal'
  },

  // Dimension 3: Leadership (19 - 22)
  {
    id: 19,
    dimensionId: 3,
    officialWording: 'The school develops a strategic plan.',
    defaultRequiredMovs: [
      'Approved 3-Year School Improvement Plan (SIP) with Quality Assurance Certificate',
      'Transmittal Letter and SDO Acceptance of Current SIP Cycle',
      'Situational Analysis, Voice of Stakeholders, and Gap Identification Records'
    ],
    defaultConfidentiality: 'internal',
    suggestedLeadOffice: 'School Planning Team / School Head'
  },
  {
    id: 20,
    dimensionId: 3,
    officialWording:
      'The school has a functional school-community planning team.',
    defaultRequiredMovs: [
      'Designation Order for School Planning Team (SPT) Composition (DepEd Format)',
      'Minutes of Meetings, Attendance Sheets, and Photo Documentation of SPT Sessions',
      'Consultative Assembly Documentation with Barangay and Community Stakeholders'
    ],
    defaultConfidentiality: 'internal',
    suggestedLeadOffice: 'School Head / SBM Coordinator'
  },
  {
    id: 21,
    dimensionId: 3,
    officialWording:
      'The school has a functional Supreme Student Government/Supreme Pupil Government.',
    defaultRequiredMovs: [
      'Supreme Secondary Learner Government (SSLG) Election Results & Commission on Elections Resolution',
      'Constitution and By-Laws (CBL) Oath of Office and Leadership Training Report',
      'Approved SSLG Annual Plan of Activities (APA) and Financial Report',
      'Project Accomplishment Reports Led by Learner Government Officers'
    ],
    defaultConfidentiality: 'public',
    suggestedLeadOffice: 'Youth Formation Coordinator / SSLG Teacher Adviser',
    localGuidanceNotes:
      'Indicator 21 official policy wording preserves Supreme Student Government; current local nomenclature is Supreme Secondary Learner Government (SSLG).'
  },
  {
    id: 22,
    dimensionId: 3,
    officialWording:
      'The school innovates in its provision of frontline services to stakeholders.',
    defaultRequiredMovs: [
      'Citizen’s Charter Updated Signages and Public Feedback Mechanism Summary',
      'Digital Document Tracking / Automated Enrollment / Online Helpdesk Innovation Records',
      'Customer Satisfaction Survey (CSS) Analysis and Client Commendations'
    ],
    defaultConfidentiality: 'public',
    suggestedLeadOffice: 'Administrative Section / ICT Coordinator'
  },

  // Dimension 4: Governance and Accountability (23 - 28)
  {
    id: 23,
    dimensionId: 4,
    officialWording:
      'The school’s strategic plan is operationalized through an implementation plan.',
    defaultRequiredMovs: [
      'Annual Implementation Plan (AIP) Aligned with Current Fiscal Year Budget',
      'Work and Financial Plan (WFP) with Milestone Timetable',
      'Project Procurement Management Plan (PPMP) Supporting AIP Programs'
    ],
    defaultConfidentiality: 'internal',
    suggestedLeadOffice: 'School Planning Team / SBM Coordinator'
  },
  {
    id: 24,
    dimensionId: 4,
    officialWording: 'The school has a functional School Governance Council (SGC).',
    defaultRequiredMovs: [
      'SGC Induction Resolution, Charter, and SDO Recognition Certificate',
      'SGC Composition Directory across Internal and External Co-Chairpersons',
      'Minutes of Quarterly SGC Meetings and Resolution Tracking Log',
      'SGC Functionality Assessment Tool (FAT) Evaluation Sheet'
    ],
    defaultConfidentiality: 'internal',
    suggestedLeadOffice: 'School Governance Council Secretariat / School Head'
  },
  {
    id: 25,
    dimensionId: 4,
    officialWording:
      'The school has a functional Parent-Teacher Association (PTA).',
    defaultRequiredMovs: [
      'School Parent-Teacher Association (SPTA) Recognition Certificate & Omnibus Guidelines Compliance',
      'General PTA Assembly Minutes, Financial Liquidation Reports, and Project Turnovers',
      'Homeroom PTA Projects Documentation and Collaboration Minutes'
    ],
    defaultConfidentiality: 'public',
    suggestedLeadOffice: 'SPTA Board of Directors / SPTA Teacher Representative'
  },
  {
    id: 26,
    dimensionId: 4,
    officialWording:
      'The school collaborates with stakeholders and other schools in strengthening partnerships.',
    defaultRequiredMovs: [
      'Brigada Eskwela and National Schools Press Conference / Sports Partnership Accomplishments',
      'Stakeholder Partnership Inventory with Total Resource Value Generated (DPDS/BMIS)',
      'Letters of Appreciation, Recognition Rites for Donors & Local Government Units'
    ],
    defaultConfidentiality: 'public',
    suggestedLeadOffice: 'Partnerships & Linkages / Adopt-a-School Focal'
  },
  {
    id: 27,
    dimensionId: 4,
    officialWording:
      'The school monitors and evaluates its programs, projects, and activities.',
    defaultRequiredMovs: [
      'School Monitoring, Evaluation, and Adjustment (SMEA) Quarterly Presentation Decks & Minutes',
      'SMEA Dashboard and Key Performance Indicator (KPI) Variance Analysis',
      'Post-Activity Evaluation Reports (PMCF) for Major School Programs'
    ],
    defaultConfidentiality: 'internal',
    suggestedLeadOffice: 'School Quality Assurance & M&E Team (QAME)'
  },
  {
    id: 28,
    dimensionId: 4,
    officialWording:
      'The school maintains an average rating of satisfactory from its internal and external stakeholders.',
    defaultRequiredMovs: [
      'Consolidated Stakeholder Satisfaction Survey Results and Frequency Distribution',
      'Client Feedback Form Analysis on Public Frontline and Administrative Services',
      'Clientele Feedback Action Plan & Resolution Matrix'
    ],
    defaultConfidentiality: 'public',
    suggestedLeadOffice: 'Public Information / Quality Management Team'
  },

  // Dimension 5: Human Resource and Team Development (29 - 35)
  {
    id: 29,
    dimensionId: 5,
    officialWording:
      'School personnel achieve an average rating of very satisfactory in the individual performance commitment and review.',
    defaultRequiredMovs: [
      'Consolidated IPCRF Summary of Ratings Approved by the Schools Division Superintendent',
      'Distribution Table of Individual Performance Ratings (Without Individual Raw Files)',
      'Certificate of Performance Management System (PMS) Calibration & Completion'
    ],
    isPersonnelRelated: true,
    defaultConfidentiality: 'restricted',
    suggestedLeadOffice: 'School Performance Management Team (PMT)',
    localGuidanceNotes:
      'Strictly confidential. Never upload raw individual IPCRF files or individual employee names. Upload only certified summary rating distributions.'
  },
  {
    id: 30,
    dimensionId: 5,
    officialWording:
      'The school achieves an average rating of very satisfactory in the office performance commitment and review.',
    defaultRequiredMovs: [
      'Approved Office Performance Commitment and Review Form (OPCRF) with SDO Validation',
      'OPCRF Means of Verification Compilation Portfolio',
      'Division Performance Review Committee (DPRC) Formal Rating Certification'
    ],
    isPersonnelRelated: true,
    defaultConfidentiality: 'internal',
    suggestedLeadOffice: 'School Head / Assistant Principal'
  },
  {
    id: 31,
    dimensionId: 5,
    officialWording:
      'The school conducts needs-based Learning Action Cells and Learning and Development activities.',
    defaultRequiredMovs: [
      'School Learning Action Cell (SLAC) Annual Plan based on Electronic Self-Assessment Tool (e-SAT)',
      'Approved SLAC Proposals, Session Activity Sheets, and QAME Evaluation Summaries',
      'Teacher Attendance Sheets, Certificates, and Photo Documentation of LAC Sessions'
    ],
    defaultConfidentiality: 'internal',
    suggestedLeadOffice: 'Professional Development Coordinator / Master Teachers'
  },
  {
    id: 32,
    dimensionId: 5,
    officialWording:
      'The school facilitates the promotion and continuous professional development of its personnel.',
    defaultRequiredMovs: [
      'Inventory of Personnel Pursuing Postgraduate Studies (Masteral/Doctoral Tracking)',
      'Endorsements for Scholarships, INSET, and Division/Regional Training Invitations',
      'Comparative Assessment Result for Promotion / Reclassification Transmittals'
    ],
    isPersonnelRelated: true,
    defaultConfidentiality: 'restricted',
    suggestedLeadOffice: 'Administrative Officer II / Human Resource Desk'
  },
  {
    id: 33,
    dimensionId: 5,
    officialWording:
      'The school recognizes and rewards milestone achievements of its personnel.',
    defaultRequiredMovs: [
      'School Program on Awards and Incentives for Service Excellence (PRAISE) Guidelines',
      'World Teachers’ Day and Loyalty Awarding Ceremony Documentation and Certificates',
      'PRAISE Committee Resolutions and Master List of Awardees'
    ],
    defaultConfidentiality: 'public',
    suggestedLeadOffice: 'School PRAISE Committee'
  },
  {
    id: 34,
    dimensionId: 5,
    officialWording:
      'The school facilitates receipt of correct salaries, allowances, and other additional compensation in a timely manner.',
    defaultRequiredMovs: [
      'Administrative Certification on Timely Submission of Payroll Transmittals (Form 7)',
      'Summary of Special Hardship / Step Increment / Loyalty Pay Processing Logs (Redacted)',
      'Division Finance Payroll Transmittal Acknowledgement Receipts'
    ],
    isPersonnelRelated: true,
    isFinancialRelated: true,
    defaultConfidentiality: 'restricted',
    suggestedLeadOffice: 'Administrative Officer II / School Bookkeeper'
  },
  {
    id: 35,
    dimensionId: 5,
    officialWording: 'Teacher workload is distributed fairly and equitably.',
    defaultRequiredMovs: [
      'Approved Teacher Program / Class Schedules compliant with Magna Carta for Public School Teachers',
      'Consolidated Summary of Teaching and Ancillary Assignment Loading Matrix',
      'Division Approval of Teacher Workload Distribution'
    ],
    defaultConfidentiality: 'internal',
    suggestedLeadOffice: 'Assistant Principal for Academics / Department Heads'
  },

  // Dimension 6: Finance and Resource Management and Mobilization (36 - 42)
  {
    id: 36,
    dimensionId: 6,
    officialWording: 'The school inspects its infrastructure and facilities.',
    defaultRequiredMovs: [
      'School Facilities Inspection Committee (SFIC) Quarterly Inspection Reports',
      'Electrical, Structural, and Fire Safety Inspection Certificates from LGU QC',
      'Inventory of Damaged Equipment, Condemnation Forms, and Repair Requests'
    ],
    defaultConfidentiality: 'internal',
    suggestedLeadOffice: 'Physical Facilities Coordinator / School Inspectorate Team'
  },
  {
    id: 37,
    dimensionId: 6,
    officialWording:
      'The school initiates improvement of its infrastructure and facilities.',
    defaultRequiredMovs: [
      'Facilities Repair & Minor Improvement Accomplishment Reports with Before-and-After Photos',
      'MOOE and LGU SEF Work Orders for Classroom Renovation & Repainting',
      'Stakeholder-Donated Facility Improvement Turnover Certificates'
    ],
    defaultConfidentiality: 'public',
    suggestedLeadOffice: 'School Head / Physical Facilities Team'
  },
  {
    id: 38,
    dimensionId: 6,
    officialWording: 'The school has a functional library.',
    defaultRequiredMovs: [
      'Library Inventory of Book Titles, References, and DepEd LR Holdings',
      'Daily Library Visitor and Borrower Logbook Statistics',
      'Library Development Plan and Multimedia Resource Corner Documentation'
    ],
    defaultConfidentiality: 'public',
    suggestedLeadOffice: 'School Librarian / Learning Resource Focal'
  },
  {
    id: 39,
    dimensionId: 6,
    officialWording:
      'The school has functional water, electric, and internet facilities.',
    defaultRequiredMovs: [
      'Utility Functionality Verification Logs (Meralco, Manila Water/Maynilad & ISP)',
      'Water Potability Lab Test Results and Sanitized Handwashing Facility Photos',
      'Campus Wi-Fi Connectivity and School LAN Distribution Map'
    ],
    defaultConfidentiality: 'internal',
    suggestedLeadOffice: 'Administrative Unit / Property Custodian'
  },
  {
    id: 40,
    dimensionId: 6,
    officialWording:
      'The school has a functional computer laboratory/classroom.',
    defaultRequiredMovs: [
      'DepEd Computerization Program (DCP) Package Inventory and Inspection Tool',
      'Computer Laboratory Utilization Schedules across JHS and SHS Classes',
      'Preventive Maintenance and Equipment Servicing Records'
    ],
    defaultConfidentiality: 'internal',
    suggestedLeadOffice: 'School ICT Coordinator / DCP Custodian'
  },
  {
    id: 41,
    dimensionId: 6,
    officialWording:
      'The school achieves a 75–100% utilization rate of its Maintenance and Other Operating Expenses (MOOE).',
    defaultRequiredMovs: [
      'Annual MOOE Cash Advance and Disbursement Registry',
      'Monthly Transmittal of Expenses with SDO Accounting Division Validation',
      'Quarterly Transparency Board MOOE Financial Report Postings'
    ],
    isFinancialRelated: true,
    defaultConfidentiality: 'restricted',
    suggestedLeadOffice: 'School Head / Disbursing Officer / Bookkeeper'
  },
  {
    id: 42,
    dimensionId: 6,
    officialWording: 'The school liquidates 100% of its utilized MOOE.',
    defaultRequiredMovs: [
      'Certificates of Complete Liquidation issued by the Division Accounting Office',
      'Monthly Liquidation Report Summaries and SDO Acknowledgement Slips',
      'Transparency Board Liquidation Postings and Stakeholder Reporting'
    ],
    isFinancialRelated: true,
    defaultConfidentiality: 'restricted',
    suggestedLeadOffice: 'School Bookkeeper / Disbursing Officer'
  }
];

export const INITIAL_SCHOOL_PROFILE: SchoolProfile = {
  id: 'qhs-profile-main',
  schoolName: 'Quirino High School',
  name: 'Quirino High School',
  schoolId: '300539',
  division: 'Division of City Schools - Quezon City',
  region: 'National Capital Region (NCR)',
  district: 'District III',
  address: 'Molave St., Project 3, Quezon City, Metro Manila, Philippines',
  contactNumber: '(02) 8921-4320 / (02) 8928-1145',
  telephone: '(02) 8921-4320 / (02) 8928-1145',
  email: 'quirinohs.qc@deped.gov.ph',
  schoolHead: 'Dr. Lourdes R. Sese',
  principalName: 'Dr. Lourdes R. Sese',
  schoolHeadTitle: 'Secondary School Principal IV',
  sbmCoordinator: 'Mr. Jonathan C. Santos',
  sbmCoordinatorTitle: 'School SBM Coordinator / Master Teacher II',
  assistantPrincipal: 'Dr. Marilou C. Alcantara',
  assistantPrincipalTitle: 'Assistant Principal for Academics',
  divisionValidator: 'Dr. Maria Elena V. Gonzales',
  divisionValidatorTitle: 'Division SBM Validator / EPS - SDO QC',
  divisionSuperintendent: 'Carleen S. Sedilla, CESO V',
  divisionSuperintendentTitle: 'Schools Division Superintendent',
  dimensionCoordinators: [
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
      dimensionName: 'School Leadership & Governance',
      leadName: 'Mr. Jonathan C. Santos',
      designation: 'Master Teacher II / SBM Coordinator',
      email: 'jonathan.santos@depedqc.ph'
    },
    {
      dimensionId: 4,
      dimensionName: 'Human Resource & Professional Development',
      leadName: 'Mrs. Carmela E. Dizon',
      designation: 'Master Teacher I / Faculty Club President',
      email: 'carmela.dizon@depedqc.ph'
    },
    {
      dimensionId: 5,
      dimensionName: 'Finance, Resource Mobilization & Accountability',
      leadName: 'Ms. Maria Teresa L. Ramos',
      designation: 'Administrative Officer IV / School Budget Officer',
      email: 'mariateresa.ramos@depedqc.ph'
    },
    {
      dimensionId: 6,
      dimensionName: 'Community Partnerships & Stakeholder Engagement',
      leadName: 'Atty. Fernando G. Castro',
      designation: 'School Governance Council (SGC) Co-Chair',
      email: 'fernando.castro@depedqc.ph'
    }
  ],
  customSignatories: [
    {
      id: 'sig-pta',
      roleLabel: 'General PTA President',
      name: 'Engr. Danilo S. Macaraeg',
      title: 'GPTA Executive President',
      office: 'General Parents-Teachers Association'
    },
    {
      id: 'sig-sgc',
      roleLabel: 'SGC Community Representative',
      name: 'Hon. Ma. Victoria C. Gomez',
      title: 'Barangay Committee on Education Lead',
      office: 'School Governance Council'
    }
  ],
  history:
    'Quirino High School was founded in 1968 in Project 3, Quezon City, named in honor of the sixth President of the Republic of the Philippines, Elpidio R. Quirino. Through decades of educational excellence, QHS has nurtured leaders, scholars, and innovators while continually striving for holistic learner development, high SBM governance standards, and strong community partnerships.',
  vision:
    'We dream of Filipinos who passionately love their country and whose values and competencies enable them to realize their full potential and contribute meaningfully to building the nation. As a learner-centered public institution, the Department of Education continuously improves itself to better serve its stakeholders.',
  depEdVision:
    'We dream of Filipinos who passionately love their country and whose values and competencies enable them to realize their full potential and contribute meaningfully to building the nation. As a learner-centered public institution, the Department of Education continuously improves itself to better serve its stakeholders.',
  mission:
    'To protect and promote the right of every Filipino to quality, equitable, culture-based, and complete basic education where: Students learn in a child-friendly, gender-sensitive, safe, and motivating environment. Teachers facilitate learning and constantly nurture every learner. Administrators and staff, as stewards of the institution, ensure an enabling and supportive environment for effective learning to happen. Family, community, and other stakeholders are actively engaged and share responsibility for developing life-long learners.',
  depEdMission:
    'To protect and promote the right of every Filipino to quality, equitable, culture-based, and complete basic education where: Students learn in a child-friendly, gender-sensitive, safe, and motivating environment. Teachers facilitate learning and constantly nurture every learner. Administrators and staff, as stewards of the institution, ensure an enabling and supportive environment for effective learning to happen. Family, community, and other stakeholders are actively engaged and share responsibility for developing life-long learners.',
  coreValues: ['Maka-Diyos', 'Maka-tao', 'Makakalikasan', 'Makabansa'],
  depEdCoreValues: ['Maka-Diyos', 'Maka-tao', 'Makakalikasan', 'Makabansa'],
  mandate:
    'The Department of Education was established through the Education Decree of 1863 and re-established by Republic Act No. 9155 (Governance of Basic Education Act of 2001). It is the primary government agency responsible for formulating, implementing, and coordinating policies, plans, programs, and projects in the areas of formal and non-formal basic education.',
  depEdMandate:
    'The Department of Education was established through the Education Decree of 1863 and re-established by Republic Act No. 9155 (Governance of Basic Education Act of 2001). It is the primary government agency responsible for formulating, implementing, and coordinating policies, plans, programs, and projects in the areas of formal and non-formal basic education.',
  programs: {
    jhs: [
      'Regular Junior High School Curriculum (Grades 7 to 10)',
      'Special Program in Journalism (SPJ)',
      'Special Program in the Arts (SPA)',
      'Special Science Class / Science, Technology, and Engineering (STE)'
    ],
    shsTracks: [
      'Academic Track: Science, Technology, Engineering, and Mathematics (STEM)',
      'Academic Track: Accountancy, Business, and Management (ABM)',
      'Academic Track: Humanities and Social Sciences (HUMSS)',
      'Academic Track: General Academic Strand (GAS)',
      'TVL Track: Information and Communications Technology (ICT - Computer Systems Servicing & Animation)',
      'TVL Track: Home Economics (Cookery, Bread & Pastry, Food & Beverage Services)'
    ],
    specialPrograms: [
      'Alternative Learning System (School-Based ALS)',
      'Inclusive & Special Education (SPED Integration)',
      'Open High School Program (OHSP)'
    ]
  },
  curricularOfferings: [
    'Regular Junior High School Curriculum (Grades 7 to 10)',
    'Special Program in Journalism (SPJ)',
    'Special Program in the Arts (SPA)',
    'Special Science Class (STE)',
    'SHS STEM / ABM / HUMSS / GAS Tracks',
    'TVL ICT & Home Economics Strands',
    'School-Based ALS (Alternative Learning System)',
    'SPED Inclusion & Open High School Program'
  ],
  enrollmentSummary: {
    jhsMale: 1845,
    jhsFemale: 1792,
    shsMale: 840,
    shsFemale: 915,
    total: 5392
  },
  totalLearners: 5392,
  personnelSummary: {
    teachingPersonnel: 188,
    nonTeachingPersonnel: 24,
    masterTeachers: 26,
    headTeachers: 14
  },
  teachingPersonnel: 188,
  nonTeachingPersonnel: 24,
  facilitiesSummary: {
    instructionalClassrooms: 78,
    computerLaboratories: 4,
    scienceLaboratories: 3,
    library: 1,
    clinic: 1,
    gymnasiumAuditorium: 1
  },
  classrooms: 78,
  scienceLaboratories: 3,
  computerLaboratories: 4,
  lastUpdated: '2025-08-20T08:00:00Z'
};

export const DEMO_USERS: UserProfile[] = [
  {
    id: 'user-super-admin-01',
    email: 'julius.manio@depedqc.ph',
    displayName: 'Julius Manio (System Admin)',
    role: 'super_admin',
    department: 'ICT & Systems Administration',
    designation: 'IT Officer / System Administrator',
    status: 'approved',
    assignedDimensions: [1, 2, 3, 4, 5, 6],
    assignedIndicators: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42],
    createdAt: '2024-07-01T00:00:00Z',
    updatedAt: '2025-08-20T00:00:00Z'
  },
  {
    id: 'user-school-head-01',
    email: 'lourdes.sese@depedqc.ph',
    displayName: 'Dr. Lourdes R. Sese',
    role: 'school_head',
    department: 'Office of the Principal',
    designation: 'Secondary School Principal IV',
    status: 'approved',
    assignedDimensions: [1, 2, 3, 4, 5, 6],
    createdAt: '2024-07-01T00:00:00Z',
    updatedAt: '2025-08-20T00:00:00Z'
  },
  {
    id: 'user-sbm-coord-01',
    email: 'jonathan.santos@depedqc.ph',
    displayName: 'Jonathan C. Santos',
    role: 'sbm_coordinator',
    department: 'SBM Secretariat / Planning',
    designation: 'Master Teacher II / SBM Coordinator',
    status: 'approved',
    assignedDimensions: [1, 2, 3, 4, 5, 6],
    createdAt: '2024-07-01T00:00:00Z',
    updatedAt: '2025-08-20T00:00:00Z'
  },
  {
    id: 'user-dim1-lead-01',
    email: 'elena.roces@depedqc.ph',
    displayName: 'Elena M. Roces (D1 Leader)',
    role: 'dimension_leader',
    department: 'Curriculum & Instruction',
    designation: 'Head Teacher VI - English / D1 Lead',
    status: 'approved',
    assignedDimensions: [1],
    assignedIndicators: [1, 2, 3, 4, 5, 6, 7, 8],
    createdAt: '2024-07-01T00:00:00Z',
    updatedAt: '2025-08-20T00:00:00Z'
  },
  {
    id: 'user-dim2-lead-01',
    email: 'marivic.delacruz@depedqc.ph',
    displayName: 'Marivic Dela Cruz (D2 Leader)',
    role: 'dimension_leader',
    department: 'Guidance & Child Protection',
    designation: 'Master Teacher I / D2 Lead',
    status: 'approved',
    assignedDimensions: [2],
    assignedIndicators: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    createdAt: '2024-07-01T00:00:00Z',
    updatedAt: '2025-08-20T00:00:00Z'
  },
  {
    id: 'user-contributor-01',
    email: 'ricardo.torres@depedqc.ph',
    displayName: 'Ricardo Torres (Teacher / Contributor)',
    role: 'contributor',
    department: 'Mathematics & Science Dept.',
    designation: 'Teacher III / Remediation Focal',
    status: 'approved',
    assignedDimensions: [1, 2],
    assignedIndicators: [2, 5, 7, 16],
    createdAt: '2024-07-01T00:00:00Z',
    updatedAt: '2025-08-20T00:00:00Z'
  },
  {
    id: 'user-validator-01',
    email: 'sdo.validator@depedqc.ph',
    displayName: 'EPS Ramon Bautista (SDO Validator)',
    role: 'validator',
    department: 'SDO QC - School Governance & Operations Division',
    designation: 'Education Program Supervisor / SBM Division Validator',
    status: 'approved',
    assignedDimensions: [1, 2, 3, 4, 5, 6],
    createdAt: '2024-07-01T00:00:00Z',
    updatedAt: '2025-08-20T00:00:00Z'
  },
  {
    id: 'user-visitor-01',
    email: 'parent.stakeholder@gmail.com',
    displayName: 'Public Guest / Stakeholder',
    role: 'public_visitor',
    department: 'General Public',
    status: 'approved',
    createdAt: '2024-07-01T00:00:00Z',
    updatedAt: '2025-08-20T00:00:00Z'
  }
];

export const INITIAL_ANNOUNCEMENTS: SystemAnnouncement[] = [
  {
    id: 'ann-01',
    title: 'Submission Deadline for S.Y. 2024–2025 SBM MOV Verification Portfolio',
    content:
      'All Dimension Leaders and Indicator Contributors are reminded to complete and submit all required Means of Verification (MOVs) for School Year 2024–2025 on or before the division validation preparatory review. Please ensure evidence compliance with DepEd Order No. 007, s. 2024.',
    priority: 'important',
    audience: 'staff',
    isPublished: true,
    authorName: 'Jonathan C. Santos (SBM Coordinator)',
    createdAt: '2025-08-15T09:00:00Z'
  },
  {
    id: 'ann-02',
    title: 'Data Privacy Compliance Reminder on Restricted & Confidential Records',
    content:
      'In strict compliance with RA 10173 (Data Privacy Act of 2012) and DepEd Child Protection guidelines, never upload unredacted incident logs, individual learner names in protected case files, or raw individual IPCRF files. Only upload authorized consolidated statistical summaries.',
    priority: 'urgent',
    audience: 'all',
    isPublished: true,
    authorName: 'Julius Manio (System Admin)',
    createdAt: '2025-08-18T10:30:00Z'
  },
  {
    id: 'ann-03',
    title: 'Quirino High School Annual School Report Card (SRC) Released',
    content:
      'We proudly share with our parents, alumni, and community partners the official School Report Card showcasing our academic achievements, infrastructure improvements, and stakeholder initiatives.',
    priority: 'normal',
    audience: 'public',
    isPublished: true,
    authorName: 'Dr. Lourdes R. Sese (Principal IV)',
    createdAt: '2025-08-20T14:00:00Z'
  }
];

export const INITIAL_SCHOOL_REPORT_CARDS: SchoolReportCard[] = [
  {
    id: 'src-2024-2025',
    schoolYearId: 'SY-2024-2025',
    schoolYearLabel: 'S.Y. 2024–2025',
    title: 'School Report Card S.Y. 2024–2025',
    schoolId: '300539',
    status: 'published',
    isPublished: true,
    enrollmentTotal: 5392,
    enrollment: 5392,
    promotionRate: 98.4,
    completionRate: 97.8,
    dropoutRate: 0.6,
    natProficiencyAverage: 79.2,
    natRating: 79.2,
    attestedByName: 'Dr. Lourdes R. Sese',
    attestedByTitle: 'Secondary School Principal IV',
    preparedByName: 'Mr. Jonathan C. Santos',
    preparedByTitle: 'School SBM Coordinator / Master Teacher II',
    validatedByName: 'Dr. Maria Elena V. Gonzales',
    validatedByTitle: 'Division SBM Validator / EPS - SDO QC',
    summary: 'Quirino High School sustained exceptional performance across learning outcomes, school-community governance, and financial accountability with full MOOE liquidation and high NAT proficiency.',
    keyAccomplishments: [
      'Ranked in the top 5 high schools in SDO Quezon City for National Achievement Test (NAT G10 & G12).',
      '100% functionality certification for School Governance Council (SGC) and Child Protection Committee.',
      'Constructed two new state-of-the-art TVL Computer Graphics and Robotics laboratories.',
      'Achieved 100% MOOE utilization and timely complete liquidation with zero audit disallowance.'
    ],
    accomplishments: [
      'Ranked in the top 5 high schools in SDO Quezon City for National Achievement Test (NAT G10 & G12).',
      '100% functionality certification for School Governance Council (SGC) and Child Protection Committee.',
      'Constructed two new state-of-the-art TVL Computer Graphics and Robotics laboratories.',
      'Achieved 100% MOOE utilization and timely complete liquidation with zero audit disallowance.'
    ],
    priorityImprovementAreas: [
      'Intensify Catch-Up Friday reading and numeracy interventions in Junior High School.',
      'Expand Industry MOA partnerships for Senior High School TVL Cookery and ICT immersion.',
      'Enhance campus-wide PWD tactile pathways and accessibility ramps.'
    ],
    priorityAreas: [
      'Intensify Catch-Up Friday reading and numeracy interventions in Junior High School.',
      'Expand Industry MOA partnerships for Senior High School TVL Cookery and ICT immersion.',
      'Enhance campus-wide PWD tactile pathways and accessibility ramps.'
    ],
    stakeholderHighlights: [
      'Generated ₱1.85M worth of resource contributions during Brigada Eskwela 2024.',
      'Active partnership with Quezon City LGU for student mental wellness clinics and scholarships.',
      'Strong SPTA engagement across 100% homerooms.'
    ],
    publishedAt: '2025-08-01T08:00:00Z',
    publishedDate: '2025-08-01T08:00:00Z',
    publishedBy: 'Dr. Lourdes R. Sese',
    updatedAt: '2025-08-20T08:00:00Z'
  },
  {
    id: 'src-2025-2026',
    schoolYearId: 'SY-2025-2026',
    schoolYearLabel: 'S.Y. 2025–2026',
    title: 'School Report Card S.Y. 2025–2026 (Draft)',
    status: 'draft',
    isPublished: false,
    enrollmentTotal: 5520,
    enrollment: 5520,
    promotionRate: 98.9,
    completionRate: 98.2,
    dropoutRate: 0.4,
    natProficiencyAverage: 81.5,
    natRating: 81.5,
    summary: 'Mid-term evaluation shows steady gains in higher-order thinking competencies, expanded teacher quality circles, and improved campus facilities.',
    keyAccomplishments: [
      'Integration of AI and Digital Literacy in Junior High School Special Science curriculum.',
      'Zero bullying and zero child abuse certification sustained.'
    ],
    accomplishments: [
      'Integration of AI and Digital Literacy in Junior High School Special Science curriculum.',
      'Zero bullying and zero child abuse certification sustained.'
    ],
    priorityImprovementAreas: [
      'Continuous teacher upskilling in higher-order thinking assessment item creation.',
      'Expansion of ALS Community Learning Center capacity.'
    ],
    priorityAreas: [
      'Continuous teacher upskilling in higher-order thinking assessment item creation.',
      'Expansion of ALS Community Learning Center capacity.'
    ],
    stakeholderHighlights: [
      'Alumni Association laboratory equipment donation campaign.'
    ],
    publishedAt: '2026-08-01T08:00:00Z',
    publishedDate: '2026-08-01T08:00:00Z',
    updatedAt: '2025-08-25T08:00:00Z'
  },
  {
    id: 'src-2026-2027',
    schoolYearId: 'SY-2026-2027',
    schoolYearLabel: 'S.Y. 2026–2027',
    title: 'School Report Card S.Y. 2026–2027 (Planning)',
    status: 'draft',
    isPublished: false,
    enrollmentTotal: 0,
    enrollment: 0,
    promotionRate: 0,
    completionRate: 0,
    dropoutRate: 0,
    natProficiencyAverage: 0,
    natRating: 0,
    summary: 'Upcoming school year baseline target framework.',
    keyAccomplishments: [],
    accomplishments: [],
    priorityImprovementAreas: [],
    priorityAreas: [],
    stakeholderHighlights: [],
    updatedAt: '2026-07-01T08:00:00Z'
  }
];

export const DEFAULT_SYSTEM_SETTINGS: SystemSettings = {
  id: 'settings-default',
  maxUploadSizeMb: 25,
  allowedFileExtensions: ['pdf', 'docx', 'xlsx', 'pptx', 'jpg', 'jpeg', 'png'],
  allowAiFeatures: false,
  allowedDomain: 'depedqc.ph',
  currentSchoolYearId: 'SY-2024-2025',
  schoolLogoUrl: '/assets/qhs_logo_placeholder.svg',
  portalSubtitle: 'SBM Monitoring, Archiving, Repository, and Tracking Portal (DepEd Order No. 007, s. 2024)'
};
