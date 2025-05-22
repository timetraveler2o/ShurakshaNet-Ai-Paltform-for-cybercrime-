import React, { useState, useEffect } from 'react';
import ElegantCard from '../components/ElegantCard';
import ElegantButton from '../components/ElegantButton';
import { FileText, Download, Filter, ChevronDown, Search, ArrowUpDown, Eye, Share2 } from 'lucide-react';
import { reportService, formatReportDate, formatActivityTime } from './../services/reportService';
import { Report, ReportTemplate, ReportActivity, ReportType } from '../types/reports';
import ReportGenerator from '../components/reports/ReportGenerator';
import ReportTemplateEditor from '../components/reports/ReportTemplateEditor';
import ReportViewer from '../components/reports/ReportViewer';

export const ReportsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'generated' | 'templates'>('generated');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [reports, setReports] = useState<Report[]>([]);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [activities, setActivities] = useState<ReportActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // Error state for handling API errors
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [showReportGenerator, setShowReportGenerator] = useState(false);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<string | undefined>(undefined);
  const [viewingReportId, setViewingReportId] = useState<string | undefined>(undefined);
  
  // Filter states
  const [typeFilter, setTypeFilter] = useState<ReportType | 'All'>('All');
  const [showFilters, setShowFilters] = useState(false);

  // Load data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [reportsData, templatesData, activitiesData] = await Promise.all([
          reportService.getReports(),
          reportService.getTemplates(),
          reportService.getRecentActivities(5)
        ]);
        
        setReports(reportsData);
        setTemplates(templatesData);
        setActivities(activitiesData);
      } catch (err) {
        setError('Failed to load data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Refresh data after actions
  const refreshData = async () => {
    try {
      const [reportsData, templatesData, activitiesData] = await Promise.all([
        reportService.getReports(),
        reportService.getTemplates(),
        reportService.getRecentActivities(5)
      ]);
      
      setReports(reportsData);
      setTemplates(templatesData);
      setActivities(activitiesData);
    } catch (err) {
      console.error('Failed to refresh data', err);
    }
  };

  // Filter reports based on search query and type filter
  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === 'All' || report.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  // Sort reports based on date
  const sortedReports = [...filteredReports].sort((a, b) => {
    if (sortOrder === 'newest') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
  });

  // Handle report download
  const handleDownloadReport = async (reportId: string) => {
    try {
      await reportService.downloadReport(reportId, 'Current User');
      refreshData();
      // In a real app, this would trigger a file download
      alert('Report downloaded successfully');
    } catch (err) {
      console.error('Failed to download report', err);
    }
  };

  // Handle report share
  const handleShareReport = async (reportId: string) => {
    try {
      await reportService.shareReport(reportId, 'Current User');
      refreshData();
      // In a real app, this would open a sharing dialog
      alert('Report shared successfully');
    } catch (err) {
      console.error('Failed to share report', err);
    }
  };

  // Handle template use
  const handleUseTemplate = (_templateId?: string) => {
    setEditingTemplateId(undefined);
    setShowReportGenerator(true);
  };

  // Handle template edit
  const handleEditTemplate = (templateId: string) => {
    setEditingTemplateId(templateId);
    setShowTemplateEditor(true);
  };

  // Handle view report
  const handleViewReport = (reportId: string) => {
    setViewingReportId(reportId);
  };

  // Get type badge style
  const getTypeBadgeStyle = (type: ReportType) => {
    switch (type) {
      case 'Security':
        return 'bg-blue-500/20 text-blue-400';
      case 'Fraud':
        return 'bg-amber-500/20 text-amber-400';
      case 'Analytics':
        return 'bg-indigo-500/20 text-indigo-400';
      case 'Statistics':
        return 'bg-emerald-500/20 text-emerald-400';
      case 'Case Management':
        return 'bg-purple-500/20 text-purple-400';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="view-container">
      <div className="mb-6">
        <h1 className="text-3xl font-poppins font-bold mb-2">
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-500 bg-clip-text text-transparent">
            Reports
          </span>
        </h1>
        <p className="text-slate-400">
          Generate, manage, and download security and analytics reports.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-700">
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'generated'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-slate-400 hover:text-slate-300'
          }`}
          onClick={() => setActiveTab('generated')}
        >
          Generated Reports
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'templates'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-slate-400 hover:text-slate-300'
          }`}
          onClick={() => setActiveTab('templates')}
        >
          Report Templates
        </button>
      </div>

      {activeTab === 'generated' ? (
        <>
          {/* Search and filters */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 my-4">
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search reports..."
                className="elegant-input pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {error && (
              <div className="bg-red-500/10 text-red-400 px-4 py-2 rounded-md mb-4">
                {error}
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <div className="relative">
                <button 
                  className="elegant-button-outline flex items-center"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter size={16} className="mr-2" />
                  <span>Filter</span>
                  <ChevronDown size={16} className="ml-2" />
                </button>
                
                {showFilters && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-md shadow-lg z-10 border border-slate-700">
                    <div className="p-3">
                      <h3 className="text-sm font-medium text-slate-300 mb-2">Report Type</h3>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="typeFilter" 
                            value="All" 
                            checked={typeFilter === 'All'} 
                            onChange={() => setTypeFilter('All')}
                            className="mr-2"
                          />
                          <span className="text-sm text-slate-300">All Types</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="typeFilter" 
                            value="Security" 
                            checked={typeFilter === 'Security'} 
                            onChange={() => setTypeFilter('Security')}
                            className="mr-2"
                          />
                          <span className="text-sm text-slate-300">Security</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="typeFilter" 
                            value="Fraud" 
                            checked={typeFilter === 'Fraud'} 
                            onChange={() => setTypeFilter('Fraud')}
                            className="mr-2"
                          />
                          <span className="text-sm text-slate-300">Fraud</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="typeFilter" 
                            value="Analytics" 
                            checked={typeFilter === 'Analytics'} 
                            onChange={() => setTypeFilter('Analytics')}
                            className="mr-2"
                          />
                          <span className="text-sm text-slate-300">Analytics</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="typeFilter" 
                            value="Statistics" 
                            checked={typeFilter === 'Statistics'} 
                            onChange={() => setTypeFilter('Statistics')}
                            className="mr-2"
                          />
                          <span className="text-sm text-slate-300">Statistics</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="typeFilter" 
                            value="Case Management" 
                            checked={typeFilter === 'Case Management'} 
                            onChange={() => setTypeFilter('Case Management')}
                            className="mr-2"
                          />
                          <span className="text-sm text-slate-300">Case Management</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <button 
                className="elegant-button-outline flex items-center"
                onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
              >
                <ArrowUpDown size={16} className="mr-2" />
                <span>{sortOrder === 'newest' ? 'Newest' : 'Oldest'}</span>
              </button>
              
              <ElegantButton 
                variant="primary"
                className="flex items-center"
                icon={<FileText size={16} />}
                onClick={() => setShowReportGenerator(true)}
              >
                New Report
              </ElegantButton>
            </div>
          </div>

          {/* Reports list */}
          <ElegantCard>
            {isLoading ? (
              <div className="py-8 text-center">
                <p className="text-slate-400">Loading reports...</p>
              </div>
            ) : sortedReports.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-slate-400">No reports found</p>
                {searchQuery && (
                  <p className="text-sm text-slate-500 mt-2">
                    Try adjusting your search or filters
                  </p>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Report ID</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Title</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Date</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Type</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Size</th>
                      <th className="text-right py-3 px-4 text-slate-400 font-medium text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedReports.map((report) => (
                      <tr key={report.id} className="border-b border-slate-700/50 hover:bg-slate-800/30">
                        <td className="py-3 px-4 text-blue-400 font-medium">{report.id}</td>
                        <td className="py-3 px-4 text-white">{report.title}</td>
                        <td className="py-3 px-4 text-slate-300">{formatReportDate(report.date)}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${getTypeBadgeStyle(report.type)}`}>
                            {report.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-400">{report.size}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end space-x-1">
                            <button 
                              className="p-2 text-slate-400 hover:text-blue-300 transition-colors"
                              onClick={() => handleViewReport(report.id)}
                              title="View Report"
                            >
                              <Eye size={18} />
                            </button>
                            <button 
                              className="p-2 text-slate-400 hover:text-blue-300 transition-colors"
                              onClick={() => handleShareReport(report.id)}
                              title="Share Report"
                            >
                              <Share2 size={18} />
                            </button>
                            <button 
                              className="p-2 text-slate-400 hover:text-blue-300 transition-colors"
                              onClick={() => handleDownloadReport(report.id)}
                              title="Download Report"
                            >
                              <Download size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </ElegantCard>
        </>
      ) : (
        <>
          {/* Report Templates */}
          <div className="flex justify-between items-center my-4">
            <h2 className="text-lg font-medium text-white">Available Templates</h2>
            <ElegantButton 
              variant="outline"
              size="sm"
              icon={<FileText size={16} />}
              onClick={() => {
                setEditingTemplateId(undefined);
                setShowTemplateEditor(true);
              }}
            >
              Create Template
            </ElegantButton>
          </div>
          
          {isLoading ? (
            <div className="py-8 text-center">
              <p className="text-slate-400">Loading templates...</p>
            </div>
          ) : templates.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-slate-400">No templates found</p>
              <ElegantButton 
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setEditingTemplateId(undefined);
                  setShowTemplateEditor(true);
                }}
              >
                Create Your First Template
              </ElegantButton>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <ElegantCard key={template.id} className="h-full">
                  <div className="flex justify-between">
                    <div className="flex-grow">
                      <h3 className="font-medium text-blue-400">{template.title}</h3>
                      <p className="text-sm text-slate-400 mt-1">{template.description}</p>
                      <div className="mt-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${getTypeBadgeStyle(template.category)}`}>
                          {template.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <FileText size={20} className="text-blue-400" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-700/50 flex justify-between">
                    <ElegantButton 
                      variant="text" 
                      size="sm"
                      onClick={() => handleEditTemplate(template.id)}
                    >
                      Edit Template
                    </ElegantButton>
                    <ElegantButton 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleUseTemplate()}
                    >
                      Use Template
                    </ElegantButton>
                  </div>
                </ElegantCard>
              ))}
            </div>
          )}
        </>
      )}

      {/* Recent Activity */}
      <ElegantCard title="Recent Report Activity" className="mt-6">
        {activities.length === 0 ? (
          <div className="py-4 text-center">
            <p className="text-slate-400">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-3 mt-2">
            {activities.map(activity => (
              <ActivityItem 
                key={activity.id}
                icon={<FileText size={16} className="text-blue-400" />}
                title={activity.reportTitle}
                action={activity.action}
                user={activity.user}
                time={formatActivityTime(activity.timestamp)}
                onClick={() => handleViewReport(activity.reportId)}
              />
            ))}
          </div>
        )}
      </ElegantCard>

      {/* Modals */}
      {showReportGenerator && (
        <ReportGenerator 
          onClose={() => setShowReportGenerator(false)}
          onReportGenerated={() => {
            refreshData();
            setShowReportGenerator(false);
          }}
        />
      )}

      {showTemplateEditor && (
        <ReportTemplateEditor 
          templateId={editingTemplateId}
          onClose={() => setShowTemplateEditor(false)}
          onSave={() => {
            refreshData();
            setShowTemplateEditor(false);
          }}
        />
      )}

      {viewingReportId && (
        <ReportViewer 
          reportId={viewingReportId}
          onClose={() => setViewingReportId(undefined)}
        />
      )}
    </div>
  );
};

// Activity Item Component
const ActivityItem: React.FC<{ 
  icon: React.ReactNode;
  title: string;
  action: string;
  user: string;
  time: string;
  onClick?: () => void;
}> = ({ icon, title, action, user, time, onClick }) => {
  return (
    <div 
      className="flex items-start p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="bg-slate-700 p-2 rounded-lg mr-3">
        {icon}
      </div>
      <div className="flex-grow">
        <h4 className="font-medium text-white">{title}</h4>
        <p className="text-xs text-slate-400 mt-1">
          <span className="text-blue-400">{action}</span> by {user}
        </p>
      </div>
      <div className="text-xs text-slate-500 whitespace-nowrap">
        {time}
      </div>
    </div>
  );
};