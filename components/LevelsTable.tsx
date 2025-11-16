
import React from 'react';
import type { StrategyResult } from '../types';
import { ArrowDownIcon } from './icons/ArrowDown';
import { ArrowUpIcon } from './icons/ArrowUp';

interface LevelsTableProps {
  result: StrategyResult;
}

export const LevelsTable: React.FC<LevelsTableProps> = ({ result }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-4">Support & Resistance Levels</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="py-2 px-4 font-semibold text-gray-400">Level</th>
              <th className="py-2 px-4 font-semibold text-gray-400 text-center">Method A (vix/15)</th>
              <th className="py-2 px-4 font-semibold text-gray-400 text-center">Method B (vix/√30)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-700/50">
              <td className="py-3 px-4 flex items-center gap-2 text-red-400 font-semibold">
                <ArrowUpIcon className="h-5 w-5" /> Resistance
              </td>
              <td className="py-3 px-4 text-center font-mono text-lg">{result.resistance.toLocaleString()}</td>
              <td className="py-3 px-4 text-center font-mono text-lg">{result.resistance_sqrt.toLocaleString()}</td>
            </tr>
            <tr>
              <td className="py-3 px-4 flex items-center gap-2 text-green-400 font-semibold">
                <ArrowDownIcon className="h-5 w-5" /> Support
              </td>
              <td className="py-3 px-4 text-center font-mono text-lg">{result.support.toLocaleString()}</td>
              <td className="py-3 px-4 text-center font-mono text-lg">{result.support_sqrt.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
