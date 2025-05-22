import React, { useState, useCallback, useRef } from 'react';
import type { AudioFileDataInput } from '../../types';
import { VAANISHIELD_SUPPORTED_AUDIO_TYPES, VAANISHIELD_MAX_FILE_SIZE_BYTES_AUDIO, VAANISHIELD_MAX_FILE_SIZE_MB_AUDIO } from '../../constants';

interface AudioUploadFormProps {
  onSubmit: (audioData: AudioFileDataInput) => void;
  isLoading: boolean;
  disabled: boolean;
}

export const AudioUploadForm: React.FC<AudioUploadFormProps> = ({ onSubmit, isLoading, disabled }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = event.target.files?.[0];
    if (file) {
      if (!VAANISHIELD_SUPPORTED_AUDIO_TYPES.includes(file.type)) {
        setFileError(`Unsupported. Use: ${VAANISHIELD_SUPPORTED_AUDIO_TYPES.map(t => t.split('/')[1]).join(', ')}.`);
        setSelectedFile(null); return;
      }
      if (file.size > VAANISHIELD_MAX_FILE_SIZE_BYTES_AUDIO) {
        setFileError(`File too large (max ${VAANISHIELD_MAX_FILE_SIZE_MB_AUDIO}MB).`);
        setSelectedFile(null); return;
      }
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
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
        const objectURL = URL.createObjectURL(selectedFile);
        onSubmit({ fileName: selectedFile.name, fileType: selectedFile.type, base64Data, objectURL });
      };
      reader.onerror = () => setFileError("Error reading file.");
      reader.readAsDataURL(selectedFile);
    } catch (err) {
      setFileError("Could not process audio file.");
    }
  };
  
  const triggerFileInput = () => fileInputRef.current?.click();
  const commonInputClasses = "w-full p-2.5 bg-slate-700/80 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors placeholder-slate-400 text-slate-100 disabled:opacity-60 disabled:cursor-not-allowed text-sm";
  const commonLabelClasses = "block text-xs font-medium text-slate-300 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="vaanishieldAudioFile" className={commonLabelClasses}>Call Audio File</label>
        <input type="file" id="vaanishieldAudioFile" ref={fileInputRef} onChange={handleFileChange} accept={VAANISHIELD_SUPPORTED_AUDIO_TYPES.join(',')} className="hidden" disabled={isLoading || disabled} aria-describedby="vaanishieldAudioHelp vaanishieldFileError"/>
        <button type="button" onClick={triggerFileInput} disabled={isLoading || disabled} className={`${commonInputClasses} text-left ${selectedFile ? 'text-cyan-300' : 'text-slate-400'} clickable-element`}>
            {selectedFile ? selectedFile.name : 'Select audio file...'}
        </button>
        <p id="vaanishieldAudioHelp" className="text-xs text-slate-500 mt-0.5">Supported: {VAANISHIELD_SUPPORTED_AUDIO_TYPES.map(t=>t.split('/')[1]).join(', ')}. Max {VAANISHIELD_MAX_FILE_SIZE_MB_AUDIO}MB.</p>
        {fileError && <p id="vaanishieldFileError" className="text-xs text-red-400 mt-1" role="alert">{fileError}</p>}
      </div>

      <button type="submit" disabled={isLoading || disabled || !selectedFile || !!fileError}
        className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:bg-slate-600 clickable-element flex items-center justify-center"
      >
        {isLoading ? (
          <><svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Analyzing...</>
        ) : ( 'Analyze Call Audio' )}
      </button>
    </form>
  );
};
