import type { ResumeLocal } from '../types/resume.types';

// Status color mappings
export const STATUS_COLORS: Record<string, string> = {
  // Application statuses
  pending: "blue",
  reviewed: "green", 
  shortlisted: "cyan",
  interview: "gold",
  rejected: "red",
  hired: "purple",
  failed: "red",
  
  // Resume statuses
  completed: "green",
  timeout: "orange",
  invalidresumedata: "orange",
  corruptedfile: "red",
  canceled: "default",
  servererror: "red",
  
  // Error types
  invalidjobdata: "orange",
  jobtitlenotmatched: "orange",
  technicalerror: "red",
};

// Status label mappings
export const STATUS_LABELS: Record<string, string> = {
  // Application statuses
  pending: "Pending",
  reviewed: "Reviewed", 
  shortlisted: "Shortlisted",
  interview: "Interview",
  rejected: "Rejected",
  hired: "Hired",
  failed: "Failed",
  
  // Resume statuses  
  completed: "Completed",
  timeout: "Timeout",
  invalidresumedata: "Invalid Resume Data",
  corruptedfile: "Corrupted File",
  canceled: "Canceled",
  servererror: "Server Error",
  
  // Error types
  invalidjobdata: "Invalid Job Data",
  jobtitlenotmatched: "Job Title Not Matched", 
  technicalerror: "Technical Error",
};

/**
 * Get display status based on new API response structure
 */
export function getStatusDisplay(resume: ResumeLocal): string {
  const applicationStatus = resume.applicationStatus?.toLowerCase() || '';
  const resumeStatus = resume.resumeStatus?.toLowerCase() || '';
  const errorType = resume.applicationErrorType?.toLowerCase() || '';
  
  // If application failed, check the error reason
  if (applicationStatus === 'failed') {
    switch (errorType) {
      case 'jobtitlenotmatched':
        return 'Không khớp vị trí';
      case 'invalidjobdata':
        return 'Lỗi dữ liệu Job';
      case 'technicalerror':
        return 'Lỗi kỹ thuật';
      default:
        // Check resume status for file-level errors
        if (resumeStatus === 'invalidresumedata') {
          return 'File không phải CV';
        }
        if (resumeStatus === 'corruptedfile') {
          return 'File bị hỏng';
        }
        return 'Lỗi xử lý';
    }
  }
  
  // Map application statuses
  switch (applicationStatus) {
    case 'reviewed':
      return 'Đã chấm điểm';
    case 'shortlisted':
      return 'Đã sơ loại';
    case 'interview':
      return 'Mời phỏng vấn';
    case 'hired':
      return 'Đã tuyển';
    case 'rejected':
      return 'Đã từ chối';
    case 'pending':
      return 'Đang xử lý';
    default:
      // Fallback to resume status or legacy status
      const status = resumeStatus || resume.status?.toLowerCase() || '';
      return humanizeStatus(status);
  }
}

/**
 * Get status color for UI display
 */
export function getStatusColor(resume: ResumeLocal): string {
  const applicationStatus = resume.applicationStatus?.toLowerCase() || '';
  const resumeStatus = resume.resumeStatus?.toLowerCase() || '';
  const errorType = resume.applicationErrorType?.toLowerCase() || '';
  
  // Priority: applicationStatus > applicationErrorType > resumeStatus > legacy status
  let statusKey = applicationStatus;
  
  if (applicationStatus === 'failed' && errorType) {
    statusKey = errorType;
  } else if (!statusKey && resumeStatus) {
    statusKey = resumeStatus;
  } else if (!statusKey && resume.status) {
    statusKey = resume.status.toLowerCase().replace(/[\s_-]+/g, '');
  }
  
  return STATUS_COLORS[statusKey] || 'default';
}

/**
 * Get status label for UI display
 */
export function getStatusLabel(resume: ResumeLocal): string {
  const applicationStatus = resume.applicationStatus?.toLowerCase() || '';
  const resumeStatus = resume.resumeStatus?.toLowerCase() || '';
  const errorType = resume.applicationErrorType?.toLowerCase() || '';
  
  // Priority: applicationStatus > applicationErrorType > resumeStatus > legacy status
  let statusKey = applicationStatus;
  
  if (applicationStatus === 'failed' && errorType) {
    statusKey = errorType;
  } else if (!statusKey && resumeStatus) {
    statusKey = resumeStatus;
  } else if (!statusKey && resume.status) {
    statusKey = resume.status.toLowerCase().replace(/[\s_-]+/g, '');
  }
  
  return STATUS_LABELS[statusKey] || humanizeStatus(statusKey || 'processing');
}

/**
 * Convert status string to human-readable format
 */
export function humanizeStatus(status: string): string {
  if (!status) return "Processing";
  
  const spaced = String(status)
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim();
    
  return spaced
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Check if resume is selectable for comparison (completed status)
 */
export function isSelectableForComparison(resume: ResumeLocal): boolean {
  const applicationStatus = resume.applicationStatus?.toLowerCase() || '';
  const resumeStatus = resume.resumeStatus?.toLowerCase() || '';
  const legacyStatus = resume.status?.toLowerCase() || '';
  
  // Must be completed at both resume and application level
  return (
    (applicationStatus === 'reviewed' || applicationStatus === 'shortlisted' || 
     applicationStatus === 'interview' || applicationStatus === 'hired') &&
    (resumeStatus === 'completed' || legacyStatus === 'completed')
  );
}

/**
 * Check if resume is a qualified candidate (has good score)
 */
export function isQualifiedCandidate(resume: ResumeLocal, index: number, targetQuantity?: number): boolean {
  // Must have score >= 50
  const score = resume.totalScore ?? resume.totalResumeScore ?? resume.adjustedScore;
  if (score == null || score < 50) {
    return false;
  }
  
  // Check if this candidate is within the top qualified range  
  return targetQuantity ? index < targetQuantity : false;
}