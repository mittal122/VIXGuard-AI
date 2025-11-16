
export type TradeSide = "LONG" | "SHORT" | "NO_TRADE";
export type TradeConfidence = "HIGH" | "MEDIUM" | "LOW";

export interface TradeRecommendation {
  side: TradeSide;
  entry_price: number | null;
  stop_loss: number | null;
  target_1: number | null;
  target_2: number | null;
  risk_points: number | null;
  risk_percent_of_nifty: number | null;
  trade_confidence: TradeConfidence;
  reasoning: string;
}

export interface StrategyResult {
  vix_percent: number;
  vix_timestamp: string;
  vix_source: string;
  nifty_price: number;
  nifty_timestamp: string;
  nifty_source: string;
  candle_data_source: string;
  expected_move_percent: number;
  expected_move_percent_sqrt: number;
  expected_move_points: number;
  expected_move_points_sqrt: number;
  resistance: number;
  support: number;
  resistance_sqrt: number;
  support_sqrt: number;
  trade_recommendation: TradeRecommendation;
  staleness_warning: boolean;
  check_timestamp: string;
  notes: string;
}
