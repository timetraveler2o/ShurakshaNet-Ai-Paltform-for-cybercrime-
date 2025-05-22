import React, { useState, useEffect } from 'react';
import { 
  ReportTemplate, 
  ReportType, 
  ReportGenerationOptions
} from '../../types/reports';
import { reportService } from '../../services/reportService';
import ElegantCard from '../ElegantCard';
import ElegantButton from '../ElegantButton';
import { FileText, X, Save, ChevronDown, ChevronUp } from 'lucide-react';

interface ReportGeneratorProps {
  onClose: () => void;
  onReportGenerated: () => void;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ onClose, onReportGenerated }) => {
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ReportType>('Security');
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [sectionContents, setSectionContents] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch templates
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await reportService.getTemplates();
        setTemplates(data);
      } catch (err) {
        setError('Failed to load templates');
        console.error(err);
      }
    };
    
    fetchTemplates();
  }, []);

  // Handle template selection
  const handleTemplateSelect = async (templateId: string) => {
    try {
      const template = await reportService.getTemplateById(templateId);
      if (template) {
        setSelectedTemplate(template);
        setType(template.category);
        
        // Initialize section contents with default values
        const initialContents: Record<string, string> = {};
        template.structure.sections.forEach(section => {
          initialContents[section.id] = section.defaultContent || '';
        });
        setSectionContents(initialContents);
        
        // Expand the first section by default
        if (template.structure.sections.length > 0) {
          setExpandedSections([template.structure.sections[0].id]);
        }
      }
    } catch (err) {
      setError('Failed to load template details');
      console.error(err);
    }
  };

  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  // Update section content
  const updateSectionContent = (sectionId: string, content: string) => {
    setSectionContents(prev => ({
      ...prev,
      [sectionId]: content
    }));
  };

  // Generate report
  const handleGenerateReport = async () => {
    if (!selectedTemplate) {
      setError('Please select a template');
      return;
    }
    
    if (!title.trim()) {
      setError('Please enter a report title');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const options: ReportGenerationOptions = {
        templateId: selectedTemplate.id,
        title,
        type,
        author: 'Current User', // This would come from authentication context in a real app
        date: new Date().toISOString()
      };
      
      await reportService.generateReport(options);
      onReportGenerated();
      onClose();
    } catch (err) {
      setError('Failed to generate report');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col bg-slate-900 rounded-lg shadow-xl border border-slate-700">
        {/* Header */}
        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-medium text-white flex items-center">
            <FileText size={20} className="mr-2 text-blue-400" />
            Generate New Report
          </h2>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-grow overflow-y-auto p-4">
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-md text-red-400">
              {error}
            </div>
          )}
          
          <div className="space-y-6">
            {/* Basic Information */}
            <ElegantCard title="Report Information">
              <div className="space-y-4 mt-2">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">
                    Report Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter report title"
                    className="elegant-input w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">
                    Report Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as ReportType)}
                    className="elegant-input w-full"
                  >
                    <option value="Security">Security</option>
                    <option value="Fraud">Fraud</option>
                    <option value="Analytics">Analytics</option>
                    <option value="Statistics">Statistics</option>
                    <option value="Case Management">Case Management</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">
                    Template
                  </label>
                  <select
                    value={selectedTemplate?.id || ''}
                    onChange={(e) => handleTemplateSelect(e.target.value)}
                    className="elegant-input w-full"
                  >
                    <option value="">Select a template</option>
                    {templates.map(template => (
                      <option key={template.id} value={template.id}>
                        {template.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </ElegantCard>
            
            {/* Template Details */}
            {selectedTemplate && (
              <ElegantCard title="Template Structure">
                <div className="mt-2">
                  <p className="text-sm text-slate-400 mb-4">
                    {selectedTemplate.description}
                  </p>
                  
                  <div className="space-y-3">
                    {selectedTemplate.structure.sections.map((section) => (
                      <div 
                        key={section.id} 
                        className="border border-slate-700 rounded-lg overflow-hidden"
                      >
                        <div 
                          className="flex justify-between items-center p-3 bg-slate-800 cursor-pointer"
                          onClick={() => toggleSection(section.id)}
                        >
                          <div>
                            <h3 className="font-medium text-white">
                              {section.title}
                              {section.required && (
                                <span className="ml-2 text-xs text-red-400">Required</span>
                              )}
                            </h3>
                            <p className="text-xs text-slate-400">{section.description}</p>
                          </div>
                          <div>
                            {expandedSections.includes(section.id) ? (
                              <ChevronUp size={18} className="text-slate-400" />
                            ) : (
                              <ChevronDown size={18} className="text-slate-400" />
                            )}
                          </div>
                        </div>
                        
                        {expandedSections.includes(section.id) && (
                          <div className="p-3 border-t border-slate-700">
                            <textarea
                              value={sectionContents[section.id] || ''}
                              onChange={(e) => updateSectionContent(section.id, e.target.value)}
                              placeholder={`Enter content for ${section.title}`}
                              className="elegant-input w-full min-h-[120px]"
                            />
                            
                            {section.chartPlaceholders && section.chartPlaceholders.length > 0 && (
                              <div className="mt-3">
                                <h4 className="text-sm font-medium text-slate-400 mb-2">Charts</h4>
                                <div className="space-y-2">
                                  {section.chartPlaceholders.map(chart => (
                                    <div 
                                      key={chart.id}
                                      className="p-3 bg-slate-800/50 rounded-md border border-slate-700"
                                    >
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <h5 className="text-sm font-medium text-white">{chart.title}</h5>
                                          <p className="text-xs text-slate-400">{chart.description}</p>
                                          <p className="text-xs text-blue-400 mt-1">Chart Type: {chart.type}</p>
                                        </div>
                                        <div className="w-8 h-8 bg-slate-700 rounded-md flex items-center justify-center">
                                          <FileText size={16} className="text-blue-400" />
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </ElegantCard>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-slate-700 flex justify-end space-x-3">
          <ElegantButton 
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </ElegantButton>
          <ElegantButton 
            variant="primary"
            onClick={handleGenerateReport}
            disabled={isLoading || !selectedTemplate || !title.trim()}
            icon={<Save size={16} />}
          >
            {isLoading ? 'Generating...' : 'Generate Report'}
          </ElegantButton>
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;