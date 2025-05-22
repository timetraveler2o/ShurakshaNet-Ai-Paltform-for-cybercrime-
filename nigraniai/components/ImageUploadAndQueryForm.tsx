import React, { useState, useCallback, useRef } from 'react';
import type { SurveillanceImageData, AnalysisParameters } from '../types';
import { SUPPORTED_IMAGE_TYPES, MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_MB } from '../constants';

interface ImageUploadAndQueryFormProps {
  onSubmit: (imageData: SurveillanceImageData, params: AnalysisParameters) => void;
  isLoading: boolean;
  disabled: boolean;
}

export const ImageUploadAndQueryForm: React.FC<ImageUploadAndQueryFormProps> = ({ onSubmit, isLoading, disabled }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [customFocus, setCustomFocus] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = event.target.files?.[0];
    if (file) {
      if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
        setFileError(`Unsupported file type. Use: ${SUPPORTED_IMAGE_TYPES.join(', ')}.`);
        setSelectedFile(null);
        setPreviewUrl(null);
        return;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setFileError(`File too large (max ${MAX_FILE_SIZE_MB}MB).`);
        setSelectedFile(null);
        setPreviewUrl(null);
        return;
      }
      setSelectedFile(file);
      const objectURL = URL.createObjectURL(file);
      setPreviewUrl(objectURL);
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
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
      setFileError("Could not process the file.");
    }
  };
  
  const triggerFileInput = () => fileInputRef.current?.click();

  const commonInputClasses = "w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors placeholder-slate-400 text-slate-100 disabled:opacity-60 disabled:cursor-not-allowed";
  const commonLabelClasses = "block text-sm font-medium text-slate-300 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="surveillanceImageFile" className={commonLabelClasses}>
          Upload Surveillance Image
        </label>
        <input
          type="file"
          id="surveillanceImageFile"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={SUPPORTED_IMAGE_TYPES.join(',')}
          className="hidden"
          disabled={isLoading || disabled}
          aria-describedby="surveillanceImageFileHelp fileErrorSurveillance"
        />
        <button 
            type="button" 
            onClick={triggerFileInput}
            disabled={isLoading || disabled}
            className={`${commonInputClasses} text-left ${selectedFile ? 'text-amber-300' : 'text-slate-400'}`}
        >
            {selectedFile ? selectedFile.name : 'Click to select an image...'}
        </button>
        <p id="surveillanceImageFileHelp" className="text-xs text-slate-500 mt-1">
          {SUPPORTED_IMAGE_TYPES.join(', ')}. Max {MAX_FILE_SIZE_MB}MB.
        </p>
        {fileError && <p id="fileErrorSurveillance" className="text-sm text-red-400 mt-2" role="alert">{fileError}</p>}
      </div>

      {previewUrl && (
        <div className="border border-slate-600 rounded-lg p-2 bg-slate-700 bg-opacity-30">
          <p className="text-xs text-slate-400 mb-1 text-center">Image Preview:</p>
          <img src={previewUrl} alt="Surveillance scene preview" className="max-w-full h-auto max-h-60 object-contain rounded-md mx-auto shadow-lg" />
        </div>
      )}

      <div>
        <label htmlFor="customFocus" className={commonLabelClasses}>
          Specific Focus for Analysis (Optional)
        </label>
        <input
          type="text"
          id="customFocus"
          value={customFocus}
          onChange={(e) => setCustomFocus(e.target.value)}
          placeholder="e.g., 'person in red shirt', 'unattended black bag'"
          className={commonInputClasses}
          disabled={isLoading || disabled}
          aria-describedby="customFocusHelp"
        />
        <p id="customFocusHelp" className="text-xs text-slate-500 mt-1">Help the AI prioritize certain elements.</p>
      </div>

      <button
        type="submit"
        disabled={isLoading || disabled || !selectedFile || !!fileError}
        className="w-full bg-amber-600 hover:bg-amber-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-75 disabled:bg-slate-600 disabled:hover:bg-slate-600 disabled:cursor-not-allowed transform hover:scale-105 active:scale-100 flex items-center justify-center text-base"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Analyzing Scene...
          </>
        ) : (
          'Analyze Scene'
        )}
      </button>
    </form>
  );
};
