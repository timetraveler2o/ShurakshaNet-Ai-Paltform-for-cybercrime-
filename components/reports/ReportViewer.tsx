import React, { useState, useEffect } from 'react';
import { Report } from '../../types/reports';
import { reportService } from '../../services/reportService';
import ElegantButton from '../ElegantButton';
import { 
  FileText, 
  X, 
  Download, 
  Share2, 
  Printer, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  User
} from 'lucide-react';

interface ReportViewerProps {
  reportId: string;
  onClose: () => void;
}

const ReportViewer: React.FC<ReportViewerProps> = ({ reportId, onClose }) => {
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch report data
  useEffect(() => {
    const fetchReport = async () => {
      setIsLoading(true);
      try {
        const data = await reportService.getReportById(reportId);
        if (data) {
          setReport(data);
          // Calculate total pages (1 for summary + sections + 1 for conclusion)
          setTotalPages(data.content.sections.length + 2);
        } else {
          setError('Report not found');
        }
      } catch (err) {
        setError('Failed to load report');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReport();
  }, [reportId]);

  // Handle download
  const handleDownload = async () => {
    if (!report) return;
    
    try {
      await reportService.downloadReport(reportId, 'Current User');
      // In a real app, this would trigger a file download
      alert('Report downloaded successfully');
    } catch (err) {
      console.error('Failed to download report', err);
    }
  };

  // Handle share
  const handleShare = async () => {
    if (!report) return;
    
    try {
      await reportService.shareReport(reportId, 'Current User');
      // In a real app, this would open a sharing dialog
      alert('Report shared successfully');
    } catch (err) {
      console.error('Failed to share report', err);
    }
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Navigate to previous page
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Navigate to next page
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Render current page content
  const renderPageContent = () => {
    if (!report) return null;
    
    if (currentPage === 1) {
      // Summary page
      return (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">{report.title}</h1>
            <p className="text-slate-400">
              {report.type} Report • {formatDate(report.date)}
            </p>
          </div>
          
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-medium text-blue-400 mb-4">Executive Summary</h2>
            <p className="text-slate-300 whitespace-pre-line">{report.content.summary}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
              <div className="flex items-center mb-2">
                <Clock size={16} className="text-slate-400 mr-2" />
                <h3 className="text-sm font-medium text-slate-300">Generated On</h3>
              </div>
              <p className="text-white">{formatDate(report.date)}</p>
            </div>
            
            <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
              <div className="flex items-center mb-2">
                <User size={16} className="text-slate-400 mr-2" />
                <h3 className="text-sm font-medium text-slate-300">Created By</h3>
              </div>
              <p className="text-white">{report.createdBy}</p>
            </div>
          </div>
          
          <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
            <h3 className="text-sm font-medium text-slate-300 mb-2">Table of Contents</h3>
            <ol className="list-decimal list-inside space-y-1 text-slate-300">
              {report.content.sections.map((section, index) => (
                <li key={section.id} className="hover:text-blue-400 cursor-pointer" onClick={() => setCurrentPage(index + 2)}>
                  {section.title}
                </li>
              ))}
              <li className="hover:text-blue-400 cursor-pointer" onClick={() => setCurrentPage(totalPages)}>
                Conclusion
                {report.content.recommendations && report.content.recommendations.length > 0 && ' & Recommendations'}
              </li>
            </ol>
          </div>
        </div>
      );
    } else if (currentPage === totalPages) {
      // Conclusion page
      return (
        <div className="space-y-6">
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-medium text-blue-400 mb-4">Conclusion</h2>
            <p className="text-slate-300 whitespace-pre-line">{report.content.conclusion}</p>
          </div>
          
          {report.content.recommendations && report.content.recommendations.length > 0 && (
            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
              <h2 className="text-xl font-medium text-blue-400 mb-4">Recommendations</h2>
              <ul className="list-disc list-inside space-y-2 text-slate-300">
                {report.content.recommendations.map((recommendation, index) => (
                  <li key={index} className="ml-2">{recommendation}</li>
                ))}
              </ul>
            </div>
          )}
          
          {report.content.attachments && report.content.attachments.length > 0 && (
            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
              <h2 className="text-xl font-medium text-blue-400 mb-4">Attachments</h2>
              <div className="space-y-2">
                {report.content.attachments.map(attachment => (
                  <div 
                    key={attachment.id}
                    className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center">
                      <FileText size={18} className="text-blue-400 mr-3" />
                      <div>
                        <p className="text-white">{attachment.name}</p>
                        <p className="text-xs text-slate-400">{attachment.size}</p>
                      </div>
                    </div>
                    <Download size={16} className="text-slate-400 hover:text-blue-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    } else {
      // Section pages
      const sectionIndex = currentPage - 2;
      const section = report.content.sections[sectionIndex];
      
      if (!section) return <div>Section not found</div>;
      
      return (
        <div className="space-y-6">
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-medium text-blue-400 mb-4">{section.title}</h2>
            <div className="text-slate-300 whitespace-pre-line">
              {section.content}
            </div>
          </div>
          
          {section.charts && section.charts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.charts.map(chart => (
                <div 
                  key={chart.id}
                  className="bg-slate-800/30 p-4 rounded-lg border border-slate-700/50"
                >
                  <h3 className="text-white font-medium mb-2">{chart.title}</h3>
                  <div className="h-64 bg-slate-700/50 rounded-lg flex items-center justify-center">
                    <p className="text-slate-400">Chart visualization would appear here</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="p-8 bg-slate-900 rounded-lg shadow-xl">
          <p className="text-white">Loading report...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="p-8 bg-slate-900 rounded-lg shadow-xl">
          <p className="text-red-400">{error || 'Report not found'}</p>
          <div className="mt-4 flex justify-end">
            <ElegantButton variant="outline" onClick={onClose}>Close</ElegantButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col bg-slate-900 rounded-lg shadow-xl border border-slate-700">
        {/* Header */}
        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-medium text-white flex items-center">
            <FileText size={20} className="mr-2 text-blue-400" />
            {report.title}
          </h2>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handlePrint}
              className="p-2 text-slate-400 hover:text-white transition-colors"
              title="Print Report"
            >
              <Printer size={18} />
            </button>
            <button 
              onClick={handleShare}
              className="p-2 text-slate-400 hover:text-white transition-colors"
              title="Share Report"
            >
              <Share2 size={18} />
            </button>
            <button 
              onClick={handleDownload}
              className="p-2 text-slate-400 hover:text-white transition-colors"
              title="Download Report"
            >
              <Download size={18} />
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white transition-colors"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-grow overflow-y-auto p-6">
          {renderPageContent()}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-slate-700 flex justify-between items-center">
          <div className="text-sm text-slate-400">
            Page {currentPage} of {totalPages}
          </div>
          
          <div className="flex space-x-2">
            <ElegantButton 
              variant="outline"
              size="sm"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              icon={<ChevronLeft size={16} />}
            >
              Previous
            </ElegantButton>
            <ElegantButton 
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              icon={<ChevronRight size={16} className="ml-2 order-2" />}
              iconPosition="right"
            >
              Next
            </ElegantButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportViewer;