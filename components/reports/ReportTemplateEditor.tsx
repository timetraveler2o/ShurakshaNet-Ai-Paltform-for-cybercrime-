import React, { useState, useEffect } from 'react';
import { 
  ReportTemplate, 
  ReportType, 
  ReportTemplateSection,
  ReportTemplateChartPlaceholder
} from '../../types/reports';
import { reportService } from '../../services/reportService';
import ElegantCard from '../ElegantCard';
import ElegantButton from '../ElegantButton';
import { 
  FileText, 
  X, 
  Save, 
  Plus, 
  Trash2, 
  BarChart4, 
  LineChart,
  PieChart, 
  CircleOff, // Using CircleOff instead of DoughnutChart which doesn't exist
  GripVertical,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface ReportTemplateEditorProps {
  templateId?: string; // If provided, we're editing an existing template
  onClose: () => void;
  onSave: () => void;
}

const ReportTemplateEditor: React.FC<ReportTemplateEditorProps> = ({ 
  templateId, 
  onClose, 
  onSave 
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ReportType>('Security');
  const [sections, setSections] = useState<ReportTemplateSection[]>([]);
  const [includeRecommendations, setIncludeRecommendations] = useState(true);
  const [includeAttachments, setIncludeAttachments] = useState(true);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load template data if editing
  useEffect(() => {
    if (templateId) {
      const fetchTemplate = async () => {
        setIsLoading(true);
        try {
          const template = await reportService.getTemplateById(templateId);
          if (template) {
            setTitle(template.title);
            setDescription(template.description);
            setCategory(template.category);
            setSections(template.structure.sections);
            setIncludeRecommendations(template.structure.includeRecommendations);
            setIncludeAttachments(template.structure.includeAttachments);
            
            // Expand the first section by default
            if (template.structure.sections.length > 0) {
              setExpandedSections([template.structure.sections[0].id]);
            }
          }
        } catch (err) {
          setError('Failed to load template');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchTemplate();
    } else {
      // Add a default section for new templates
      const defaultSection: ReportTemplateSection = {
        id: `sec-${Math.random().toString(36).substring(2, 9)}`,
        title: 'Introduction',
        description: 'Provide an introduction to the report',
        required: true
      };
      setSections([defaultSection]);
      setExpandedSections([defaultSection.id]);
    }
  }, [templateId]);

  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  // Add a new section
  const addSection = () => {
    const newSection: ReportTemplateSection = {
      id: `sec-${Math.random().toString(36).substring(2, 9)}`,
      title: 'New Section',
      description: 'Description for the new section',
      required: false
    };
    
    setSections(prev => [...prev, newSection]);
    setExpandedSections(prev => [...prev, newSection.id]);
  };

  // Remove a section
  const removeSection = (sectionId: string) => {
    setSections(prev => prev.filter(section => section.id !== sectionId));
    setExpandedSections(prev => prev.filter(id => id !== sectionId));
  };

  // Update section
  const updateSection = (sectionId: string, updates: Partial<ReportTemplateSection>) => {
    setSections(prev => 
      prev.map(section => 
        section.id === sectionId
          ? { ...section, ...updates }
          : section
      )
    );
  };

  // Add chart placeholder to section
  const addChartPlaceholder = (sectionId: string) => {
    const newChart: ReportTemplateChartPlaceholder = {
      id: `chart-${Math.random().toString(36).substring(2, 9)}`,
      type: 'bar',
      title: 'New Chart',
      description: 'Description for the new chart'
    };
    
    setSections(prev => 
      prev.map(section => 
        section.id === sectionId
          ? { 
              ...section, 
              chartPlaceholders: [
                ...(section.chartPlaceholders || []),
                newChart
              ]
            }
          : section
      )
    );
  };

  // Remove chart placeholder
  const removeChartPlaceholder = (sectionId: string, chartId: string) => {
    setSections(prev => 
      prev.map(section => 
        section.id === sectionId && section.chartPlaceholders
          ? { 
              ...section, 
              chartPlaceholders: section.chartPlaceholders.filter(chart => chart.id !== chartId)
            }
          : section
      )
    );
  };

  // Update chart placeholder
  const updateChartPlaceholder = (
    sectionId: string, 
    chartId: string, 
    updates: Partial<ReportTemplateChartPlaceholder>
  ) => {
    setSections(prev => 
      prev.map(section => 
        section.id === sectionId && section.chartPlaceholders
          ? { 
              ...section, 
              chartPlaceholders: section.chartPlaceholders.map(chart => 
                chart.id === chartId
                  ? { ...chart, ...updates }
                  : chart
              )
            }
          : section
      )
    );
  };

  // Save template
  const handleSave = async () => {
    if (!title.trim()) {
      setError('Please enter a template title');
      return;
    }
    
    if (sections.length === 0) {
      setError('Please add at least one section');
      return;
    }
    
    setIsSaving(true);
    setError(null);
    
    try {
      const templateData: Omit<ReportTemplate, 'id'> = {
        title,
        description,
        category,
        structure: {
          sections,
          includeRecommendations,
          includeAttachments
        },
        createdBy: 'Current User', // This would come from authentication context in a real app
        lastModified: new Date().toISOString()
      };
      
      if (templateId) {
        await reportService.updateTemplate(templateId, templateData);
      } else {
        await reportService.createTemplate(templateData);
      }
      
      onSave();
      onClose();
    } catch (err) {
      setError('Failed to save template');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  // Get chart icon based on type
  const getChartIcon = (type: 'bar' | 'line' | 'pie' | 'doughnut') => {
    switch (type) {
      case 'bar':
        return <BarChart4 size={16} className="text-blue-400" />;
      case 'line':
        return <LineChart size={16} className="text-green-400" />;
      case 'pie':
        return <PieChart size={16} className="text-purple-400" />;
      case 'doughnut':
        return <CircleOff size={16} className="text-amber-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="p-8 bg-slate-900 rounded-lg shadow-xl">
          <p className="text-white">Loading template...</p>
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
            {templateId ? 'Edit Report Template' : 'Create Report Template'}
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
            <ElegantCard title="Template Information">
              <div className="space-y-4 mt-2">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">
                    Template Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter template title"
                    className="elegant-input w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter template description"
                    className="elegant-input w-full min-h-[80px]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ReportType)}
                    className="elegant-input w-full"
                  >
                    <option value="Security">Security</option>
                    <option value="Fraud">Fraud</option>
                    <option value="Analytics">Analytics</option>
                    <option value="Statistics">Statistics</option>
                    <option value="Case Management">Case Management</option>
                  </select>
                </div>
                
                <div className="flex space-x-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="includeRecommendations"
                      checked={includeRecommendations}
                      onChange={(e) => setIncludeRecommendations(e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="includeRecommendations" className="text-sm text-slate-300">
                      Include Recommendations
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="includeAttachments"
                      checked={includeAttachments}
                      onChange={(e) => setIncludeAttachments(e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="includeAttachments" className="text-sm text-slate-300">
                      Include Attachments
                    </label>
                  </div>
                </div>
              </div>
            </ElegantCard>
            
            {/* Sections */}
            <ElegantCard 
              title="Template Sections"
              action={
                <ElegantButton 
                  variant="outline"
                  size="sm"
                  onClick={addSection}
                  icon={<Plus size={16} />}
                >
                  Add Section
                </ElegantButton>
              }
            >
              <div className="mt-2 space-y-4">
                {sections.length === 0 ? (
                  <p className="text-slate-400 text-center py-4">
                    No sections added yet. Click "Add Section" to create your first section.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {sections.map((section) => (
                      <div 
                        key={section.id} 
                        className="border border-slate-700 rounded-lg overflow-hidden"
                      >
                        <div 
                          className="flex justify-between items-center p-3 bg-slate-800 cursor-pointer"
                          onClick={() => toggleSection(section.id)}
                        >
                          <div className="flex items-center">
                            <GripVertical size={16} className="text-slate-500 mr-2" />
                            <div>
                              <h3 className="font-medium text-white">
                                {section.title || 'Untitled Section'}
                                {section.required && (
                                  <span className="ml-2 text-xs text-red-400">Required</span>
                                )}
                              </h3>
                              <p className="text-xs text-slate-400">{section.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeSection(section.id);
                              }}
                              className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                              title="Remove Section"
                            >
                              <Trash2 size={16} />
                            </button>
                            {expandedSections.includes(section.id) ? (
                              <ChevronUp size={18} className="text-slate-400" />
                            ) : (
                              <ChevronDown size={18} className="text-slate-400" />
                            )}
                          </div>
                        </div>
                        
                        {expandedSections.includes(section.id) && (
                          <div className="p-3 border-t border-slate-700 space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-slate-400 mb-1">
                                Section Title
                              </label>
                              <input
                                type="text"
                                value={section.title}
                                onChange={(e) => updateSection(section.id, { title: e.target.value })}
                                placeholder="Enter section title"
                                className="elegant-input w-full"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-slate-400 mb-1">
                                Description
                              </label>
                              <textarea
                                value={section.description}
                                onChange={(e) => updateSection(section.id, { description: e.target.value })}
                                placeholder="Enter section description"
                                className="elegant-input w-full min-h-[80px]"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-slate-400 mb-1">
                                Default Content (Optional)
                              </label>
                              <textarea
                                value={section.defaultContent || ''}
                                onChange={(e) => updateSection(section.id, { defaultContent: e.target.value })}
                                placeholder="Enter default content for this section"
                                className="elegant-input w-full min-h-[80px]"
                              />
                            </div>
                            
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id={`required-${section.id}`}
                                checked={section.required}
                                onChange={(e) => updateSection(section.id, { required: e.target.checked })}
                                className="mr-2"
                              />
                              <label htmlFor={`required-${section.id}`} className="text-sm text-slate-300">
                                This section is required
                              </label>
                            </div>
                            
                            {/* Chart Placeholders */}
                            <div className="mt-4">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="text-sm font-medium text-slate-300">Chart Placeholders</h4>
                                <button
                                  onClick={() => addChartPlaceholder(section.id)}
                                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center"
                                >
                                  <Plus size={14} className="mr-1" />
                                  Add Chart
                                </button>
                              </div>
                              
                              {section.chartPlaceholders && section.chartPlaceholders.length > 0 ? (
                                <div className="space-y-3">
                                  {section.chartPlaceholders.map(chart => (
                                    <div 
                                      key={chart.id}
                                      className="p-3 bg-slate-800/50 rounded-md border border-slate-700"
                                    >
                                      <div className="flex justify-between">
                                        <div className="flex-grow space-y-2">
                                          <div>
                                            <label className="block text-xs font-medium text-slate-400 mb-1">
                                              Chart Title
                                            </label>
                                            <input
                                              type="text"
                                              value={chart.title}
                                              onChange={(e) => updateChartPlaceholder(section.id, chart.id, { title: e.target.value })}
                                              placeholder="Enter chart title"
                                              className="elegant-input w-full text-sm"
                                            />
                                          </div>
                                          
                                          <div>
                                            <label className="block text-xs font-medium text-slate-400 mb-1">
                                              Description
                                            </label>
                                            <input
                                              type="text"
                                              value={chart.description}
                                              onChange={(e) => updateChartPlaceholder(section.id, chart.id, { description: e.target.value })}
                                              placeholder="Enter chart description"
                                              className="elegant-input w-full text-sm"
                                            />
                                          </div>
                                          
                                          <div>
                                            <label className="block text-xs font-medium text-slate-400 mb-1">
                                              Chart Type
                                            </label>
                                            <select
                                              value={chart.type}
                                              onChange={(e) => updateChartPlaceholder(section.id, chart.id, { type: e.target.value as any })}
                                              className="elegant-input w-full text-sm"
                                            >
                                              <option value="bar">Bar Chart</option>
                                              <option value="line">Line Chart</option>
                                              <option value="pie">Pie Chart</option>
                                              <option value="doughnut">Doughnut Chart</option>
                                            </select>
                                          </div>
                                        </div>
                                        
                                        <div className="ml-3 flex flex-col justify-between">
                                          <div className="w-8 h-8 bg-slate-700 rounded-md flex items-center justify-center">
                                            {getChartIcon(chart.type)}
                                          </div>
                                          <button
                                            onClick={() => removeChartPlaceholder(section.id, chart.id)}
                                            className="p-1 text-slate-400 hover:text-red-400 transition-colors self-end"
                                            title="Remove Chart"
                                          >
                                            <Trash2 size={16} />
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-xs text-slate-500 italic">
                                  No charts added. Click "Add Chart" to include chart placeholders in this section.
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </ElegantCard>
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
            onClick={handleSave}
            disabled={isSaving}
            icon={<Save size={16} />}
          >
            {isSaving ? 'Saving...' : 'Save Template'}
          </ElegantButton>
        </div>
      </div>
    </div>
  );
};

export default ReportTemplateEditor;