/**
 * Workflow components index file
 * Exports all workflow components for easier imports
 */

// Applicant Scoring Workflows
export { default as ApplicantScoring } from './Applicant_Scoring/ApplicantScoring.vue'
export { default as CandidateScoring } from './Applicant_Scoring/CandidateScoring.vue'
export { default as ProgramRankings } from './Applicant_Scoring/ProgramRankings.vue'
export { default as DocumentVerification } from './Applicant_Scoring/DocumentVerification.vue'

// Data Cleansing Workflows
export { default as DataCleansing } from './Data Cleansing/DataCleansing.vue'
export { default as DataCleansingTool } from './Data Cleansing/DataCleansingTool.vue'

// Document Processing Workflows
export { default as PurchaseOrderViewer } from './Purchase Order/PurchaseOrderViewer.vue'
export { default as DocumentChat } from './Document Chat/DocumentChat.vue'

// Issue Classification Workflow
export { default as IssueClassification } from './Issue_Classification/IssueClassification.vue'

// Receipt Analysis Workflow
export { default as ReceiptClaim } from './Receipt Claim Analyzer/ReceiptClaim.vue'
