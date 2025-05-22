import React, { useState } from 'react';
import type { EmailData } from '../../types';

interface EmailInputFormProps {
  onSubmit: (emailData: EmailData) => void;
  isLoading: boolean;
  disabled: boolean;
}

export const EmailInputForm: React.FC<EmailInputFormProps> = ({ onSubmit, isLoading, disabled }) => {
  const [sender, setSender] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [body, setBody] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (disabled || isLoading) return;
    onSubmit({ sender, subject, body });
  };

  const commonInputClasses = "w-full p-2.5 bg-slate-700/80 border border-slate-600 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 outline-none transition-colors placeholder-slate-400 text-slate-100 disabled:opacity-60 disabled:cursor-not-allowed text-sm";
  const commonLabelClasses = "block text-xs font-medium text-slate-300 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="kavachSender" className={commonLabelClasses}>Sender Email</label>
        <input type="email" id="kavachSender" value={sender} onChange={(e) => setSender(e.target.value)} placeholder="e.g., no-reply@bank.com" className={commonInputClasses} required disabled={isLoading || disabled} />
      </div>
      <div>
        <label htmlFor="kavachSubject" className={commonLabelClasses}>Email Subject</label>
        <input type="text" id="kavachSubject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g., Urgent: Account Verification" className={commonInputClasses} required disabled={isLoading || disabled} />
      </div>
      <div>
        <label htmlFor="kavachBody" className={commonLabelClasses}>Email Body</label>
        <textarea id="kavachBody" value={body} onChange={(e) => setBody(e.target.value)} rows={6} placeholder="Paste email body..." className={`${commonInputClasses} min-h-[120px] resize-y`} required disabled={isLoading || disabled} />
      </div>
      <button type="submit" disabled={isLoading || disabled}
        className="w-full bg-lime-600 hover:bg-lime-500 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-lime-400 disabled:bg-slate-600 clickable-element flex items-center justify-center"
      >
        {isLoading ? (
          <><svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Analyzing...</>
        ) : ( 'Analyze Email' )}
      </button>
    </form>
  );
};
