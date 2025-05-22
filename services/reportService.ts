import { 
  Report, 
  ReportTemplate, 
  ReportGenerationOptions, 
  ReportActivity,
  ReportContent,
  ReportSection
} from '../types/reports';

// Mock data for reports
const mockReports: Report[] = [
  {
    id: 'REP-2025-001',
    title: 'Monthly Cybersecurity Threat Analysis',
    date: '2025-03-15',
    type: 'Security',
    status: 'Completed',
    size: '2.4 MB',
    content: {
      summary: 'This report provides an analysis of cybersecurity threats detected and mitigated during the month of March 2025.',
      sections: [
        {
          id: 'sec-001',
          title: 'Executive Summary',
          content: 'During March 2025, our systems detected a 15% increase in phishing attempts compared to the previous month. The majority of these attempts targeted financial institutions and government agencies.'
        },
        {
          id: 'sec-002',
          title: 'Threat Landscape',
          content: 'The most prevalent threats were phishing (45%), malware (30%), and ransomware (15%). The remaining 10% consisted of various other attack vectors including DDoS and social engineering attempts.'
        },
        {
          id: 'sec-003',
          title: 'Mitigation Measures',
          content: 'Our team successfully blocked 98.5% of all detected threats. The remaining 1.5% were contained before any significant damage could occur.'
        }
      ],
      conclusion: 'The cybersecurity landscape continues to evolve, with attackers employing increasingly sophisticated methods. Continued vigilance and proactive measures are essential.',
      recommendations: [
        'Implement multi-factor authentication across all systems',
        'Conduct regular security awareness training for all personnel',
        'Update intrusion detection systems to the latest version'
      ]
    },
    createdBy: 'System Administrator',
    lastModified: '2025-03-15T14:30:00Z'
  },
  {
    id: 'REP-2025-002',
    title: 'Financial Fraud Detection Summary',
    date: '2025-03-10',
    type: 'Fraud',
    status: 'Completed',
    size: '1.8 MB',
    content: {
      summary: 'This report summarizes financial fraud detection activities and findings for Q1 2025.',
      sections: [
        {
          id: 'sec-001',
          title: 'Overview',
          content: 'In Q1 2025, our systems processed over 10 million transactions and flagged approximately 0.5% for potential fraud.'
        },
        {
          id: 'sec-002',
          title: 'Fraud Patterns',
          content: 'The most common fraud patterns involved identity theft (40%), account takeover (30%), and transaction manipulation (20%).'
        }
      ],
      conclusion: 'Our fraud detection systems continue to perform well, with a false positive rate of only 0.02%.',
      recommendations: [
        'Enhance real-time monitoring capabilities',
        'Implement behavioral analytics for improved detection'
      ]
    },
    createdBy: 'Fraud Analysis Team',
    lastModified: '2025-03-10T09:15:00Z'
  },
  {
    id: 'REP-2025-003',
    title: 'Deepfake Detection Performance Metrics',
    date: '2025-03-05',
    type: 'Analytics',
    status: 'Completed',
    size: '3.2 MB',
    content: {
      summary: 'This report evaluates the performance of our deepfake detection algorithms over the past quarter.',
      sections: [
        {
          id: 'sec-001',
          title: 'Algorithm Performance',
          content: 'Our deepfake detection algorithms achieved an accuracy of 97.8% on the test dataset, with a precision of 98.2% and recall of 96.5%.'
        },
        {
          id: 'sec-002',
          title: 'Challenging Cases',
          content: 'The most challenging cases involved high-quality deepfakes created using the latest generation of AI models.'
        }
      ],
      conclusion: 'While our algorithms perform well overall, there is room for improvement in detecting the most sophisticated deepfakes.',
      recommendations: [
        'Invest in research on advanced detection techniques',
        'Expand the training dataset with more diverse examples'
      ]
    },
    createdBy: 'AI Research Team',
    lastModified: '2025-03-05T16:45:00Z'
  },
  {
    id: 'REP-2025-004',
    title: 'Missing Persons Case Resolution Statistics',
    date: '2025-02-28',
    type: 'Statistics',
    status: 'Completed',
    size: '1.5 MB',
    content: {
      summary: 'This report presents statistics on missing persons cases and their resolution rates for February 2025.',
      sections: [
        {
          id: 'sec-001',
          title: 'Case Overview',
          content: 'In February 2025, a total of 120 missing persons cases were reported. Of these, 85% were resolved within the first 72 hours.'
        },
        {
          id: 'sec-002',
          title: 'Resolution Methods',
          content: 'The most effective resolution methods were community tips (40%), surveillance footage analysis (30%), and social media monitoring (20%).'
        }
      ],
      conclusion: 'Our case resolution rate continues to improve, largely due to enhanced technology and community engagement.',
      recommendations: [
        'Expand the use of facial recognition technology',
        'Strengthen community outreach programs'
      ]
    },
    createdBy: 'Missing Persons Unit',
    lastModified: '2025-02-28T11:20:00Z'
  },
  {
    id: 'REP-2025-005',
    title: 'Phishing Campaign Analysis',
    date: '2025-02-20',
    type: 'Security',
    status: 'Completed',
    size: '2.1 MB',
    content: {
      summary: 'This report analyzes a sophisticated phishing campaign targeting government employees in February 2025.',
      sections: [
        {
          id: 'sec-001',
          title: 'Campaign Overview',
          content: 'The phishing campaign used spoofed government email addresses and convincing document attachments to trick recipients into revealing their credentials.'
        },
        {
          id: 'sec-002',
          title: 'Technical Analysis',
          content: 'The attackers used a combination of social engineering and technical exploits to bypass standard security measures.'
        }
      ],
      conclusion: 'This campaign represents a significant evolution in phishing tactics, requiring enhanced defensive measures.',
      recommendations: [
        'Implement DMARC email authentication',
        'Enhance email filtering rules',
        'Conduct targeted security awareness training'
      ]
    },
    createdBy: 'Cybersecurity Team',
    lastModified: '2025-02-20T14:10:00Z'
  },
  {
    id: 'REP-2025-006',
    title: 'Voice Scam Detection Accuracy Report',
    date: '2025-02-15',
    type: 'Analytics',
    status: 'Completed',
    size: '1.9 MB',
    content: {
      summary: 'This report evaluates the accuracy of our voice scam detection system over the past month.',
      sections: [
        {
          id: 'sec-001',
          title: 'System Performance',
          content: 'Our voice scam detection system processed over 50,000 calls in January 2025, correctly identifying 98.7% of scam calls.'
        },
        {
          id: 'sec-002',
          title: 'False Positives Analysis',
          content: 'The system generated a false positive rate of 0.3%, primarily due to unusual but legitimate call patterns.'
        }
      ],
      conclusion: 'The voice scam detection system is performing exceptionally well, providing valuable protection to citizens.',
      recommendations: [
        'Fine-tune detection algorithms to reduce false positives',
        'Expand coverage to additional telecommunication providers'
      ]
    },
    createdBy: 'VaaniShield Team',
    lastModified: '2025-02-15T10:30:00Z'
  }
];

// Mock data for report templates
const mockTemplates: ReportTemplate[] = [
  {
    id: 'TPL-001',
    title: 'Cybersecurity Incident Report',
    description: 'Template for documenting security incidents and response actions',
    category: 'Security',
    structure: {
      sections: [
        {
          id: 'sec-001',
          title: 'Incident Overview',
          description: 'Provide a brief summary of the security incident',
          required: true,
          defaultContent: 'On [DATE], a security incident was detected involving [BRIEF DESCRIPTION].'
        },
        {
          id: 'sec-002',
          title: 'Technical Details',
          description: 'Document the technical aspects of the incident',
          required: true
        },
        {
          id: 'sec-003',
          title: 'Impact Assessment',
          description: 'Assess the impact of the incident on systems and data',
          required: true
        },
        {
          id: 'sec-004',
          title: 'Response Actions',
          description: 'Detail the actions taken to address the incident',
          required: true
        },
        {
          id: 'sec-005',
          title: 'Timeline',
          description: 'Provide a chronological timeline of the incident and response',
          required: false
        }
      ],
      includeRecommendations: true,
      includeAttachments: true
    },
    createdBy: 'System Administrator',
    lastModified: '2025-01-15T08:30:00Z'
  },
  {
    id: 'TPL-002',
    title: 'Financial Fraud Investigation',
    description: 'Structured template for financial crime investigation documentation',
    category: 'Fraud',
    structure: {
      sections: [
        {
          id: 'sec-001',
          title: 'Case Summary',
          description: 'Provide an overview of the fraud case',
          required: true
        },
        {
          id: 'sec-002',
          title: 'Financial Analysis',
          description: 'Document the financial transactions and patterns related to the fraud',
          required: true,
          chartPlaceholders: [
            {
              id: 'chart-001',
              type: 'bar',
              title: 'Transaction Volume by Date',
              description: 'Chart showing the volume of suspicious transactions over time'
            }
          ]
        },
        {
          id: 'sec-003',
          title: 'Evidence Collection',
          description: 'Detail the evidence collected during the investigation',
          required: true
        },
        {
          id: 'sec-004',
          title: 'Legal Considerations',
          description: 'Document any legal aspects of the case',
          required: false
        }
      ],
      includeRecommendations: true,
      includeAttachments: true
    },
    createdBy: 'Fraud Investigation Unit',
    lastModified: '2025-01-20T14:45:00Z'
  },
  {
    id: 'TPL-003',
    title: 'Monthly Security Metrics',
    description: 'Standard format for monthly security performance reporting',
    category: 'Analytics',
    structure: {
      sections: [
        {
          id: 'sec-001',
          title: 'Executive Summary',
          description: 'Provide a high-level overview of security metrics for the month',
          required: true
        },
        {
          id: 'sec-002',
          title: 'Incident Statistics',
          description: 'Document the number and types of security incidents',
          required: true,
          chartPlaceholders: [
            {
              id: 'chart-001',
              type: 'pie',
              title: 'Incident Distribution by Type',
              description: 'Chart showing the distribution of incidents by category'
            },
            {
              id: 'chart-002',
              type: 'line',
              title: 'Incident Trend',
              description: 'Chart showing the trend of incidents over time'
            }
          ]
        },
        {
          id: 'sec-003',
          title: 'Response Metrics',
          description: 'Detail response times and effectiveness metrics',
          required: true
        },
        {
          id: 'sec-004',
          title: 'Compliance Status',
          description: 'Document compliance with security policies and regulations',
          required: true
        }
      ],
      includeRecommendations: true,
      includeAttachments: false
    },
    createdBy: 'Security Operations Center',
    lastModified: '2025-01-25T11:15:00Z'
  },
  {
    id: 'TPL-004',
    title: 'Case Resolution Summary',
    description: 'Template for summarizing case outcomes and resolution details',
    category: 'Case Management',
    structure: {
      sections: [
        {
          id: 'sec-001',
          title: 'Case Overview',
          description: 'Provide a summary of the case',
          required: true
        },
        {
          id: 'sec-002',
          title: 'Investigation Summary',
          description: 'Document the key aspects of the investigation',
          required: true
        },
        {
          id: 'sec-003',
          title: 'Resolution Details',
          description: 'Detail how the case was resolved',
          required: true
        },
        {
          id: 'sec-004',
          title: 'Resource Utilization',
          description: 'Document the resources used in resolving the case',
          required: false,
          chartPlaceholders: [
            {
              id: 'chart-001',
              type: 'doughnut',
              title: 'Resource Allocation',
              description: 'Chart showing the allocation of resources to different aspects of the case'
            }
          ]
        }
      ],
      includeRecommendations: true,
      includeAttachments: true
    },
    createdBy: 'Case Management Team',
    lastModified: '2025-02-01T09:30:00Z'
  }
];

// Mock data for report activities
const mockActivities: ReportActivity[] = [
  {
    id: 'ACT-001',
    reportId: 'REP-2025-001',
    reportTitle: 'Monthly Cybersecurity Threat Analysis',
    action: 'Downloaded',
    user: 'Officer Johnson',
    timestamp: '2025-03-15T16:30:00Z'
  },
  {
    id: 'ACT-002',
    reportId: 'REP-2025-002',
    reportTitle: 'Financial Fraud Detection Summary',
    action: 'Generated',
    user: 'Analyst Singh',
    timestamp: '2025-03-10T10:15:00Z'
  },
  {
    id: 'ACT-003',
    reportId: 'REP-2025-005',
    reportTitle: 'Phishing Campaign Analysis',
    action: 'Shared',
    user: 'Supervisor Patel',
    timestamp: '2025-02-21T09:45:00Z'
  }
];

// Service functions
export const reportService = {
  // Reports
  getReports: (): Promise<Report[]> => {
    return Promise.resolve([...mockReports]);
  },

  getReportById: (id: string): Promise<Report | undefined> => {
    const report = mockReports.find(r => r.id === id);
    return Promise.resolve(report ? { ...report } : undefined);
  },

  createReport: (report: Omit<Report, 'id' | 'size'>): Promise<Report> => {
    const newReport: Report = {
      ...report,
      id: `REP-${new Date().getFullYear()}-${String(mockReports.length + 1).padStart(3, '0')}`,
      size: `${(Math.random() * 5 + 1).toFixed(1)} MB`
    };
    mockReports.push(newReport);
    
    // Add activity
    const activity: ReportActivity = {
      id: `ACT-${String(mockActivities.length + 1).padStart(3, '0')}`,
      reportId: newReport.id,
      reportTitle: newReport.title,
      action: 'Created',
      user: newReport.createdBy,
      timestamp: new Date().toISOString()
    };
    mockActivities.push(activity);
    
    return Promise.resolve({ ...newReport });
  },

  updateReport: (id: string, updates: Partial<Report>): Promise<Report | undefined> => {
    const index = mockReports.findIndex(r => r.id === id);
    if (index === -1) return Promise.resolve(undefined);
    
    mockReports[index] = { ...mockReports[index], ...updates, lastModified: new Date().toISOString() };
    
    // Add activity
    const activity: ReportActivity = {
      id: `ACT-${String(mockActivities.length + 1).padStart(3, '0')}`,
      reportId: mockReports[index].id,
      reportTitle: mockReports[index].title,
      action: 'Modified',
      user: updates.createdBy || mockReports[index].createdBy,
      timestamp: new Date().toISOString()
    };
    mockActivities.push(activity);
    
    return Promise.resolve({ ...mockReports[index] });
  },

  deleteReport: (id: string): Promise<boolean> => {
    const index = mockReports.findIndex(r => r.id === id);
    if (index === -1) return Promise.resolve(false);
    
    mockReports.splice(index, 1);
    return Promise.resolve(true);
  },

  downloadReport: (id: string, user: string): Promise<boolean> => {
    const report = mockReports.find(r => r.id === id);
    if (!report) return Promise.resolve(false);
    
    // Add activity
    const activity: ReportActivity = {
      id: `ACT-${String(mockActivities.length + 1).padStart(3, '0')}`,
      reportId: report.id,
      reportTitle: report.title,
      action: 'Downloaded',
      user,
      timestamp: new Date().toISOString()
    };
    mockActivities.push(activity);
    
    return Promise.resolve(true);
  },

  shareReport: (id: string, user: string): Promise<boolean> => {
    const report = mockReports.find(r => r.id === id);
    if (!report) return Promise.resolve(false);
    
    // Add activity
    const activity: ReportActivity = {
      id: `ACT-${String(mockActivities.length + 1).padStart(3, '0')}`,
      reportId: report.id,
      reportTitle: report.title,
      action: 'Shared',
      user,
      timestamp: new Date().toISOString()
    };
    mockActivities.push(activity);
    
    return Promise.resolve(true);
  },

  // Templates
  getTemplates: (): Promise<ReportTemplate[]> => {
    return Promise.resolve([...mockTemplates]);
  },

  getTemplateById: (id: string): Promise<ReportTemplate | undefined> => {
    const template = mockTemplates.find(t => t.id === id);
    return Promise.resolve(template ? { ...template } : undefined);
  },

  createTemplate: (template: Omit<ReportTemplate, 'id'>): Promise<ReportTemplate> => {
    const newTemplate: ReportTemplate = {
      ...template,
      id: `TPL-${String(mockTemplates.length + 1).padStart(3, '0')}`,
      lastModified: new Date().toISOString()
    };
    mockTemplates.push(newTemplate);
    return Promise.resolve({ ...newTemplate });
  },

  updateTemplate: (id: string, updates: Partial<ReportTemplate>): Promise<ReportTemplate | undefined> => {
    const index = mockTemplates.findIndex(t => t.id === id);
    if (index === -1) return Promise.resolve(undefined);
    
    mockTemplates[index] = { ...mockTemplates[index], ...updates, lastModified: new Date().toISOString() };
    return Promise.resolve({ ...mockTemplates[index] });
  },

  deleteTemplate: (id: string): Promise<boolean> => {
    const index = mockTemplates.findIndex(t => t.id === id);
    if (index === -1) return Promise.resolve(false);
    
    mockTemplates.splice(index, 1);
    return Promise.resolve(true);
  },

  // Report Generation
  generateReport: (options: ReportGenerationOptions): Promise<Report> => {
    const template = mockTemplates.find(t => t.id === options.templateId);
    if (!template) {
      return Promise.reject(new Error('Template not found'));
    }
    
    // Create report content based on template
    const sections: ReportSection[] = template.structure.sections.map(section => ({
      id: `sec-${Math.random().toString(36).substring(2, 9)}`,
      title: section.title,
      content: section.defaultContent || `Content for ${section.title}`
    }));
    
    const content: ReportContent = {
      summary: `This report was generated using the ${template.title} template.`,
      sections,
      conclusion: 'This is an automatically generated report.',
      recommendations: template.structure.includeRecommendations ? ['Recommendation 1', 'Recommendation 2'] : undefined
    };
    
    const newReport: Omit<Report, 'id' | 'size'> = {
      title: options.title,
      date: options.date,
      type: options.type,
      status: 'Draft',
      content,
      createdBy: options.author,
      lastModified: new Date().toISOString()
    };
    
    return reportService.createReport(newReport);
  },

  // Activities
  getActivities: (): Promise<ReportActivity[]> => {
    return Promise.resolve([...mockActivities].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ));
  },

  getRecentActivities: (count: number = 5): Promise<ReportActivity[]> => {
    return Promise.resolve([...mockActivities]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, count)
    );
  }
};

// Helper functions
export const formatReportDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

export const formatActivityTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMins < 60) {
    return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
};