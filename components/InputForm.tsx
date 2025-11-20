import React from 'react';

interface InputFormProps {
  vix: string;
  nifty: string;
  onVixChange: (value: string) => void;
  onNiftyChange: (value: string) => void;
  onCalculate: () => void;
  isLoading: boolean;
  isLive: boolean;
  onToggleLive: () => void;
}

export const InputForm: React.FC<InputFormProps> = ({ 
    vix, 
    nifty, 
    onVixChange, 
    onNiftyChange, 
    onCalculate, 
    isLoading, 
    isLive, 
    onToggleLive 
}) => {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate();
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 items-end">
      <div>
        <label htmlFor="vix" className="block text-sm font-medium text-gray-300 mb-1">
          India VIX (%)
        </label>
        <input
          type="number"
          id="vix"
          value={vix}
          onChange={(e) => onVixChange(e.target.value)}
          placeholder="e.g., 15.5"
          step="0.01"
          required
          disabled={isLive}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        />
      </div>
      <div>
        <label htmlFor="nifty" className="block text-sm font-medium text-gray-300 mb-1">
          NIFTY 50 Price
        </label>
        <input
          type="number"
          id="nifty"
          value={nifty}
          onChange={(e) => onNiftyChange(e.target.value)}
          placeholder="e.g., 23500"
          step="0.01"
          required
          disabled={isLive}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || isLive}
        className="w-full bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center h-[42px]"
      >
        {isLoading && !isLive ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Calculating...
          </>
        ) : (
          'Calculate Once'
        )}
      </button>
       <button
        type="button"
        onClick={onToggleLive}
        // Allow stopping even if loading
        disabled={false}
        className={`w-full text-white font-bold py-2 px-4 rounded-lg transition duration-200 ease-in-out flex items-center justify-center h-[42px] ${isLive ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
      >
        {isLoading && isLive ? (
           <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Fetching...
          </>
        ) : isLive ? (
          'Stop Live Data'
        ) : (
          'Start Live Data'
        )}
      </button>
    </form>
  );
};
