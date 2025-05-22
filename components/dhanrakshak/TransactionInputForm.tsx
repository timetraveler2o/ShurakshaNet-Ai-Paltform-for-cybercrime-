import React, { useState } from 'react';
import type { UPITransactionData } from '../../types'; // Adjusted path

interface TransactionInputFormProps {
  onSubmit: (data: Omit<UPITransactionData, 'timestamp' | 'transactionId'>) => void;
  isLoading: boolean;
  disabled: boolean;
}

export const TransactionInputForm: React.FC<TransactionInputFormProps> = ({ onSubmit, isLoading, disabled }) => {
  const [senderVpa, setSenderVpa] = useState<string>('');
  const [receiverVpa, setReceiverVpa] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (disabled || isLoading) return;
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert("Please enter a valid positive amount."); // Basic validation
      return;
    }
    onSubmit({ senderVpa, receiverVpa, amount: parsedAmount, remarks });
  };

  const commonInputClasses = "w-full p-3 bg-slate-700/80 border border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors placeholder-slate-400 text-slate-100 disabled:opacity-60 disabled:cursor-not-allowed";
  const commonLabelClasses = "block text-sm font-medium text-slate-300 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="senderVpa" className={commonLabelClasses}>
          Sender VPA (UPI ID)
        </label>
        <input
          type="text"
          id="senderVpa"
          value={senderVpa}
          onChange={(e) => setSenderVpa(e.target.value)}
          placeholder="e.g., user@okbank"
          className={commonInputClasses}
          required
          disabled={isLoading || disabled}
          aria-describedby="senderVpaHelp"
        />
        <p id="senderVpaHelp" className="text-xs text-slate-500 mt-1">Enter the sender's Virtual Payment Address.</p>
      </div>

      <div>
        <label htmlFor="receiverVpa" className={commonLabelClasses}>
          Receiver VPA (UPI ID)
        </label>
        <input
          type="text"
          id="receiverVpa"
          value={receiverVpa}
          onChange={(e) => setReceiverVpa(e.target.value)}
          placeholder="e.g., merchant@okservice"
          className={commonInputClasses}
          required
          disabled={isLoading || disabled}
          aria-describedby="receiverVpaHelp"
        />
        <p id="receiverVpaHelp" className="text-xs text-slate-500 mt-1">Enter the receiver's Virtual Payment Address.</p>
      </div>

      <div>
        <label htmlFor="amount" className={commonLabelClasses}>
          Amount (INR)
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="e.g., 500.00"
          min="0.01"
          step="0.01"
          className={commonInputClasses}
          required
          disabled={isLoading || disabled}
          aria-describedby="amountHelp"
        />
        <p id="amountHelp" className="text-xs text-slate-500 mt-1">Enter the transaction amount in Indian Rupees.</p>
      </div>

      <div>
        <label htmlFor="remarks" className={commonLabelClasses}>
          Remarks (Optional)
        </label>
        <input
          type="text"
          id="remarks"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="e.g., Bill payment, Gift"
          className={commonInputClasses}
          disabled={isLoading || disabled}
          aria-describedby="remarksHelp"
        />
        <p id="remarksHelp" className="text-xs text-slate-500 mt-1">Optional notes for the transaction.</p>
      </div>

      <button
        type="submit"
        disabled={isLoading || disabled}
        className="w-full bg-sky-600 hover:bg-sky-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75 disabled:bg-slate-600 disabled:hover:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center text-base clickable-element"
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
          'Analyze Transaction'
        )}
      </button>
    </form>
  );
};
