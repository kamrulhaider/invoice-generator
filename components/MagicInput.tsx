import React, { useState } from 'react';
import { Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { parseInvoiceItemsFromText } from '../services/geminiService';
import { LineItem } from '../types';

interface MagicInputProps {
  onItemsGenerated: (items: LineItem[]) => void;
}

const MagicInput: React.FC<MagicInputProps> = ({ onItemsGenerated }) => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleMagicFill = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const rawItems = await parseInvoiceItemsFromText(inputText);
      
      const newItems: LineItem[] = rawItems.map(item => ({
        id: Math.random().toString(36).substring(2, 9),
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
        amount: item.quantity * item.rate
      }));

      onItemsGenerated(newItems);
      setInputText('');
      setIsOpen(false);
    } catch (err) {
      setError("Failed to generate items. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-4 py-2 rounded-lg transition-colors border border-indigo-100"
      >
        <Sparkles className="w-4 h-4" />
        AI Magic Fill
      </button>
    );
  }

  return (
    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6 animate-in fade-in slide-in-from-top-2">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold text-indigo-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          Describe your work
        </h3>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-indigo-400 hover:text-indigo-600"
        >
          <span className="sr-only">Close</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <p className="text-xs text-indigo-600/80 mb-3">
        Example: "I worked 5 hours on the website design at $80/hr and 3 hours fixing bugs at $60/hr."
      </p>

      <textarea
        className="w-full p-3 text-sm rounded-lg border-indigo-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-[80px]"
        placeholder="Type here..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        disabled={isLoading}
      />

      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

      <div className="flex justify-end mt-3">
        <button
          onClick={handleMagicFill}
          disabled={isLoading || !inputText.trim()}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Thinking...
            </>
          ) : (
            <>
              Generate Items
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default MagicInput;
