import React, { useState, useCallback, useRef } from 'react';
import type { SurveillanceVideoData, AnalysisParameters } from '../../types'; // Updated type
import { NIGRANIAI_SUPPORTED_VIDEO_TYPES, NIGRANIAI_MAX_FILE_SIZE_BYTES, NIGRANIAI_MAX_FILE_SIZE_MB } from '../../constants'; // Updated constants

interface VideoUploadAndQueryFormProps { // Renamed props interface
  onSubmit: (videoData: SurveillanceVideoData, params: AnalysisParameters) => void;
  isLoading: boolean;
  disabled: boolean;
}

export const VideoUploadAndQueryForm: React.FC<VideoUploadAndQueryFormProps> = ({ onSubmit, isLoading, disabled }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [customFocus, setCustomFocus] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = event.target.files?.[0];
    if (file) {
      if (!NIGRANIAI_SUPPORTED_VIDEO_TYPES.includes(file.type)) {
        setFileError(`Unsupported file type. Use: ${NIGRANIAI_SUPPORTED_VIDEO_TYPES.map(t => t.split('/')[1]).join(', ')}.`);
        setSelectedFile(null); setPreviewUrl(null); return;
      }
      if (file.size > NIGRANIAI_MAX_FILE_SIZE_BYTES) {
        setFileError(`File too large (max ${NIGRANIAI_MAX_FILE_SIZE_MB}MB).`);
        setSelectedFile(null); setPreviewUrl(null); return;
      }
      setSelectedFile(file);
      const objectURL = URL.createObjectURL(file);
      setPreviewUrl(objectURL);
    } else {
      setSelectedFile(null); setPreviewUrl(null);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile || disabled || isLoading) return;
    setFileError(null);
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = (reader.result as string).split(',')[1];
        onSubmit(
          { fileName: selectedFile.name, fileType: selectedFile.type, base64Data, objectURL: previewUrl || undefined },
          { customFocus: customFocus.trim() || undefined }
        );
      };
      reader.onerror = () => setFileError("Error reading file.");
      reader.readAsDataURL(selectedFile);
    } catch (err) {
      setFileError("Could not process file.");
    }
  };
  
  const triggerFileInput = () => fileInputRef.current?.click();
  const commonInputClasses = "w-full p-2.5 bg-slate-700/80 border border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors placeholder-slate-400 text-slate-100 disabled:opacity-60 disabled:cursor-not-allowed text-sm";
  const commonLabelClasses = "block text-xs font-medium text-slate-300 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nigraniaiVideoFile" className={commonLabelClasses}>Surveillance Video</label> {/* Changed label */}
        <input type="file" id="nigraniaiVideoFile" ref={fileInputRef} onChange={handleFileChange} accept={NIGRANIAI_SUPPORTED_VIDEO_TYPES.join(',')} className="hidden" disabled={isLoading || disabled} aria-describedby="nigraniaiVideoHelp nigraniaiFileError"/>
        <button type="button" onClick={triggerFileInput} disabled={isLoading || disabled} className={`${commonInputClasses} text-left ${selectedFile ? 'text-amber-300' : 'text-slate-400'} clickable-element`}>
            {selectedFile ? selectedFile.name : 'Select video file...'}
        </button>
        <p id="nigraniaiVideoHelp" className="text-xs text-slate-500 mt-0.5">{NIGRANIAI_SUPPORTED_VIDEO_TYPES.map(t => t.split('/')[1]).join(', ')}. Max {NIGRANIAI_MAX_FILE_SIZE_MB}MB.</p>
        {fileError && <p id="nigraniaiFileError" className="text-xs text-red-400 mt-1" role="alert">{fileError}</p>}
      </div>

      {previewUrl && selectedFile && NIGRANIAI_SUPPORTED_VIDEO_TYPES.includes(selectedFile.type) && (
        <div className="border border-slate-600 rounded-lg p-1.5 bg-slate-700/30">
          <video src={previewUrl} controls className="max-w-full h-auto max-h-60 object-contain rounded mx-auto shadow-md">
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      <div>
        <label htmlFor="nigraniaiCustomFocus" className={commonLabelClasses}>Specific Focus (Optional)</label>
        <input type="text" id="nigraniaiCustomFocus" value={customFocus} onChange={(e) => setCustomFocus(e.target.value)} placeholder="e.g., 'person in red shirt', 'unattended black bag'" className={commonInputClasses} disabled={isLoading || disabled} aria-describedby="nigraniaiCustomFocusHelp"/>
        <p id="nigraniaiCustomFocusHelp" className="text-xs text-slate-500 mt-0.5">Help AI prioritize elements within the video.</p>
      </div>

      <button type="submit" disabled={isLoading || disabled || !selectedFile || !!fileError}
        className="w-full bg-amber-600 hover:bg-amber-500 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:bg-slate-600 clickable-element flex items-center justify-center"
      >
        {isLoading ? (
          <><svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Analyzing Video...</>
        ) : ( 'Analyze Video Scene' )}
      </button>
    </form>
  );
};