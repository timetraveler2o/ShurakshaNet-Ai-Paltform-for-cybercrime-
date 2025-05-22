import React, { useState, useCallback, useRef } from 'react';
import type { MediaFileData } from '../../types';
import { SATYADARPAN_SUPPORTED_IMAGE_TYPES, SATYADARPAN_MAX_FILE_SIZE_BYTES, SATYADARPAN_MAX_FILE_SIZE_MB } from '../../constants';

interface MediaUploadFormProps {
  onSubmit: (mediaData: MediaFileData) => void;
  isLoading: boolean;
  disabled: boolean;
}

export const MediaUploadForm: React.FC<MediaUploadFormProps> = ({ onSubmit, isLoading, disabled }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = event.target.files?.[0];
    if (file) {
      if (!SATYADARPAN_SUPPORTED_IMAGE_TYPES.includes(file.type)) {
        setFileError(`Unsupported file type. Please upload an image (${SATYADARPAN_SUPPORTED_IMAGE_TYPES.join(', ')}).`);
        setSelectedFile(null);
        setPreviewUrl(null);
        return;
      }
      if (file.size > SATYADARPAN_MAX_FILE_SIZE_BYTES) {
        setFileError(`File is too large (max ${SATYADARPAN_MAX_FILE_SIZE_MB}MB).`);
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
        onSubmit({
          fileName: selectedFile.name,
          fileType: selectedFile.type,
          base64Data: base64Data,
          objectURL: previewUrl || undefined
        });
      };
      reader.onerror = () => setFileError("Error reading file. Please try again.");
      reader.readAsDataURL(selectedFile);
    } catch (err) {
      setFileError("Could not process the file. Please ensure it's a valid image.");
    }
  };
  
  const triggerFileInput = () => fileInputRef.current?.click();

  const commonInputClasses = "w-full p-3 bg-slate-700/80 border border-slate-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-colors placeholder-slate-400 text-slate-100 disabled:opacity-60 disabled:cursor-not-allowed";
  const commonLabelClasses = "block text-sm font-medium text-slate-300 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="satyadarpanMediaFile" className={commonLabelClasses}> 
          Upload Image File
        </label>
        <input
          type="file"
          id="satyadarpanMediaFile"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={SATYADARPAN_SUPPORTED_IMAGE_TYPES.join(',')}
          className="hidden" 
          disabled={isLoading || disabled}
          aria-describedby="satyadarpanMediaFileHelp satyadarpanFileError"
        />
        <button 
            type="button" 
            onClick={triggerFileInput}
            disabled={isLoading || disabled}
            className={`${commonInputClasses} text-left ${selectedFile ? 'text-violet-300' : 'text-slate-400'} clickable-element`}
        >
            {selectedFile ? selectedFile.name : 'Click to choose an image...'}
        </button>
        <p id="satyadarpanMediaFileHelp" className="text-xs text-slate-500 mt-1">
          Supported types: {SATYADARPAN_SUPPORTED_IMAGE_TYPES.join(', ')}. Max size: {SATYADARPAN_MAX_FILE_SIZE_MB}MB.
        </p>
        {fileError && <p id="satyadarpanFileError" className="text-sm text-red-400 mt-2" role="alert">{fileError}</p>}
      </div>

      {previewUrl && (
        <div className="mt-4 border border-slate-600 rounded-lg p-2 bg-slate-700 bg-opacity-30">
          <p className="text-xs text-slate-400 mb-1 text-center">Image Preview:</p>
          <img 
            src={previewUrl} 
            alt="Selected media preview" 
            className="max-w-full h-auto max-h-60 object-contain rounded-md mx-auto shadow-lg" 
          />
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || disabled || !selectedFile || !!fileError}
        className="w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-opacity-75 disabled:bg-slate-600 disabled:hover:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center text-base clickable-element"
        aria-label={isLoading ? "Analyzing image..." : "Analyze image for deepfake detection"}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing...
          </>
        ) : (
          'Analyze Image'
        )}
      </button>
    </form>
  );
};
