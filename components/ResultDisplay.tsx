
import React from 'react';
import type { StrategyResult } from '../types';
import { KeyMetrics } from './KeyMetrics';
import { TradeCard } from './TradeCard';
import { LevelsTable } from './LevelsTable';

interface ResultDisplayProps {
  result: StrategyResult;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <TradeCard recommendation={result.trade_recommendation} />
        </div>
        <div className="space-y-8">
            <KeyMetrics result={result} />
        </div>
      </div>
      <div>
        <LevelsTable result={result} />
      </div>
       <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 text-sm text-gray-400">
        <p><strong className="text-gray-200">Note:</strong> {result.notes}</p>
        <p className="mt-1"><strong className="text-gray-200">Last Checked:</strong> {new Date(result.check_timestamp).toLocaleString()}</p>
       </div>
    </div>
  );
};
