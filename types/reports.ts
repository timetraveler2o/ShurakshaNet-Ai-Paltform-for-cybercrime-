// Report Types
export interface Report {
  id: string;
  title: string;
  date: string;
  type: ReportType;
  status: ReportStatus;
  size: string;
  content: ReportContent;
  createdBy: string;
  lastModified: string;
}

export interface ReportContent {
  summary: string;
  sections: ReportSection[];
  conclusion: string;
  recommendations?: string[];
  attachments?: ReportAttachment[];
}

export interface ReportSection {
  id: string;
  title: string;
  content: string;
  charts?: ReportChart[];
}

export interface ReportChart {
  id: string;
  type: 'bar' | 'line' | 'pie' | 'doughnut';
  title: string;
  data: any; // Chart data structure
}

export interface ReportAttachment {
  id: string;
  name: string;
  type: string;
  size: string;
  url: string;
}

export type ReportType = 'Security' | 'Fraud' | 'Analytics' | 'Statistics' | 'Case Management';
export type ReportStatus = 'Draft' | 'Completed' | 'Archived';

// Report Template Types
export interface ReportTemplate {
  id: string;
  title: string;
  description: string;
  category: ReportType;
  structure: ReportTemplateStructure;
  createdBy?: string;
  lastModified?: string;
}

export interface ReportTemplateStructure {
  sections: ReportTemplateSection[];
  includeRecommendations: boolean;
  includeAttachments: boolean;
}

export interface ReportTemplateSection {
  id: string;
  title: string;
  description: string;
  required: boolean;
  defaultContent?: string;
  chartPlaceholders?: ReportTemplateChartPlaceholder[];
}

export interface ReportTemplateChartPlaceholder {
  id: string;
  type: 'bar' | 'line' | 'pie' | 'doughnut';
  title: string;
  description: string;
}

// Report Generation Types
export interface ReportGenerationOptions {
  templateId: string;
  title: string;
  type: ReportType;
  author: string;
  date: string;
}

// Activity Types
export interface ReportActivity {
  id: string;
  reportId: string;
  reportTitle: string;
  action: 'Created' | 'Modified' | 'Downloaded' | 'Shared' | 'Generated';
  user: string;
  timestamp: string;
}