
import React from 'react';
import type { StrategyResult } from '../types';

interface KeyMetricsProps {
  result: StrategyResult;
}

const MetricItem: React.FC<{ label: string; value: string | number; unit?: string, className?: string }> = ({ label, value, unit, className }) => (
  <div className="flex justify-between items-baseline">
    <p className="text-gray-400">{label}</p>
    <p className={`font-semibold text-lg ${className}`}>
      {typeof value === 'number' ? value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : value}
      {unit && <span className="text-sm text-gray-500 ml-1">{unit}</span>}
    </p>
  </div>
);

export const KeyMetrics: React.FC<KeyMetricsProps> = ({ result }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-700 h-full">
      <h3 className="text-xl font-bold text-white mb-4">Key Metrics</h3>
      <div className="space-y-3">
        <MetricItem label="NIFTY 50 Price" value={result.nifty_price} className="text-white" />
        <MetricItem label="India VIX" value={result.vix_percent} unit="%" className="text-white" />
        <hr className="border-gray-700 my-3" />
        <MetricItem label="Expected Move (A)" value={result.expected_move_points} unit="pts" className="text-sky-400" />
        <MetricItem label="Expected Move % (A)" value={result.expected_move_percent} unit="%" className="text-sky-400" />
        <hr className="border-gray-700 my-3" />
        <MetricItem label="Expected Move (B)" value={result.expected_move_points_sqrt} unit="pts" className="text-emerald-400" />
        <MetricItem label="Expected Move % (B)" value={result.expected_move_percent_sqrt} unit="%" className="text-emerald-400" />
      </div>
    </div>
  );
};
