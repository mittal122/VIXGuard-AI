
import React from 'react';
import type { TradeRecommendation } from '../types';
import { ArrowUpIcon } from './icons/ArrowUp';
import { ArrowDownIcon } from './icons/ArrowDown';

interface TradeCardProps {
  recommendation: TradeRecommendation;
}

const confidenceColors: { [key in TradeRecommendation['trade_confidence']]: string } = {
  HIGH: 'bg-green-500/20 text-green-400 border-green-500/30',
  MEDIUM: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  LOW: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const sideInfo = {
  LONG: {
    bg: 'bg-green-900/50 border-green-500/40',
    text: 'text-green-400',
    icon: <ArrowUpIcon className="h-6 w-6" />,
  },
  SHORT: {
    bg: 'bg-red-900/50 border-red-500/40',
    text: 'text-red-400',
    icon: <ArrowDownIcon className="h-6 w-6" />,
  },
  NO_TRADE: {
    bg: 'bg-gray-700/50 border-gray-600/40',
    text: 'text-gray-400',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  },
};

export const TradeCard: React.FC<TradeCardProps> = ({ recommendation }) => {
  const { side, entry_price, stop_loss, target_1, target_2, risk_points, risk_percent_of_nifty, trade_confidence, reasoning } = recommendation;
  const currentSide = sideInfo[side];

  return (
    <div className={`rounded-2xl p-6 shadow-2xl border ${currentSide.bg}`}>
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <span className={currentSide.text}>{side.replace('_', ' ')}</span>
            {currentSide.icon}
          </h2>
          <p className="text-gray-400 mt-1">{reasoning}</p>
        </div>
        <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${confidenceColors[trade_confidence]}`}>
          {trade_confidence} Confidence
        </span>
      </div>

      {side !== 'NO_TRADE' && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <p className="text-sm text-gray-400">Entry</p>
            <p className="text-xl font-bold text-white">{entry_price?.toLocaleString()}</p>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <p className="text-sm text-gray-400">Stop Loss</p>
            <p className="text-xl font-bold text-red-400">{stop_loss?.toLocaleString()}</p>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <p className="text-sm text-gray-400">Target 1</p>
            <p className="text-xl font-bold text-green-400">{target_1?.toLocaleString()}</p>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <p className="text-sm text-gray-400">Target 2</p>
            <p className="text-xl font-bold text-green-300">{target_2?.toLocaleString()}</p>
          </div>
        </div>
      )}

      {side !== 'NO_TRADE' && (
        <div className="mt-6 border-t border-gray-700 pt-6 grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-400">Risk (Points)</p>
            <p className="text-lg font-semibold text-white">{risk_points}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Risk (% of Nifty)</p>
            <p className="text-lg font-semibold text-white">{risk_percent_of_nifty?.toFixed(2)}%</p>
          </div>
        </div>
      )}
    </div>
  );
};
