
import { GoogleGenAI, Type } from "@google/genai";
import type { StrategyResult } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const buildPrompt = (vixPercent: number, niftyPrice: number): string => `
You are a sophisticated financial analyst bot specializing in the "India VIX Based Intraday Range for NIFTY" trading strategy.

Given the current India VIX percentage and the NIFTY 50 spot price, perform the following calculations and return the result *only* in the specified JSON format. Do not add any extra text, explanations, or markdown formatting around the JSON object.

**Inputs:**
- India VIX: ${vixPercent}%
- NIFTY 50 Price: ${niftyPrice}

**Calculations to Perform:**

1.  **Expected Move (Method A - VIX/15):**
    *   'expected_move_percent' = ${vixPercent} / 15
    *   'expected_move_points' = ('expected_move_percent' / 100) * ${niftyPrice}
    *   Round 'expected_move_points' to the nearest integer.

2.  **Expected Move (Method B - VIX/√30):**
    *   'expected_move_percent_sqrt' = ${vixPercent} / 5.477225575  // sqrt(30)
    *   'expected_move_points_sqrt' = ('expected_move_percent_sqrt' / 100) * ${niftyPrice}
    *   Round 'expected_move_points_sqrt' to the nearest integer.

3.  **Support and Resistance Levels:**
    *   (Method A): 'resistance' = ${niftyPrice} + 'expected_move_points', 'support' = ${niftyPrice} - 'expected_move_points'
    *   (Method B): 'resistance_sqrt' = ${niftyPrice} + 'expected_move_points_sqrt', 'support_sqrt' = ${niftyPrice} - 'expected_move_points_sqrt'
    *   Round all levels to the nearest integer.

4.  **Trade Recommendation (Simulated):**
    *   Analyze the current Nifty price relative to the calculated support and resistance levels. Assume hypothetical recent candle patterns to determine a trade recommendation.
    *   If nifty_price is within 10% of the daily range to the 'support' level, generate a "LONG" recommendation.
    *   If nifty_price is within 10% of the daily range to the 'resistance' level, generate a "SHORT" recommendation.
    *   Otherwise, generate "NO_TRADE".
    *   Set 'trade_confidence' based on proximity to levels: "HIGH" if very close, "MEDIUM" if moderately close, "LOW" otherwise.
    *   'entry_price': For LONG, set to 'support'. For SHORT, set to 'resistance'. null for NO_TRADE.
    *   'stop_loss':
        *   For LONG: 'support' - max(min(0.25 * 'expected_move_points', 0.005 * ${niftyPrice}), 2)
        *   For SHORT: 'resistance' + max(min(0.25 * 'expected_move_points', 0.005 * ${niftyPrice}), 2)
        *   Round to nearest integer.
    *   'target_1': 'entry_price' +/- (0.5 * 'expected_move_points'), rounded.
    *   'target_2': 'entry_price' +/- (1.0 * 'expected_move_points'), rounded.
    *   'risk_points': abs('entry_price' - 'stop_loss'), integer.
    *   'risk_percent_of_nifty': ('risk_points' / ${niftyPrice}) * 100, float with 2 decimal places.
    *   'reasoning': A short, plausible explanation based on the simulated scenario (e.g., "Nifty approaching strong support level calculated via VIX Method A, showing potential for a technical bounce.").

5.  **Metadata:**
    *   Fill 'vix_timestamp', 'nifty_timestamp', and 'check_timestamp' with the current ISO8601 timestamp.
    *   Use "https://www.nseindia.com" for all source URLs.
    *   'staleness_warning': false.
    *   'notes': "Calculations based on user-provided VIX and Nifty values. Trade recommendation is simulated."
`;

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        vix_percent: { type: Type.NUMBER },
        vix_timestamp: { type: Type.STRING },
        vix_source: { type: Type.STRING },
        nifty_price: { type: Type.NUMBER },
        nifty_timestamp: { type: Type.STRING },
        nifty_source: { type: Type.STRING },
        candle_data_source: { type: Type.STRING },
        expected_move_percent: { type: Type.NUMBER },
        expected_move_percent_sqrt: { type: Type.NUMBER },
        expected_move_points: { type: Type.INTEGER },
        expected_move_points_sqrt: { type: Type.INTEGER },
        resistance: { type: Type.INTEGER },
        support: { type: Type.INTEGER },
        resistance_sqrt: { type: Type.INTEGER },
        support_sqrt: { type: Type.INTEGER },
        trade_recommendation: {
            type: Type.OBJECT,
            properties: {
                side: { type: Type.STRING },
                entry_price: { type: Type.INTEGER, nullable: true },
                stop_loss: { type: Type.INTEGER, nullable: true },
                target_1: { type: Type.INTEGER, nullable: true },
                target_2: { type: Type.INTEGER, nullable: true },
                risk_points: { type: Type.INTEGER, nullable: true },
                risk_percent_of_nifty: { type: Type.NUMBER, nullable: true },
                trade_confidence: { type: Type.STRING },
                reasoning: { type: Type.STRING },
            },
            required: ["side", "entry_price", "stop_loss", "target_1", "target_2", "risk_points", "risk_percent_of_nifty", "trade_confidence", "reasoning"],
        },
        staleness_warning: { type: Type.BOOLEAN },
        check_timestamp: { type: Type.STRING },
        notes: { type: Type.STRING },
    },
    required: ["vix_percent", "vix_timestamp", "vix_source", "nifty_price", "nifty_timestamp", "nifty_source", "candle_data_source", "expected_move_percent", "expected_move_percent_sqrt", "expected_move_points", "expected_move_points_sqrt", "resistance", "support", "resistance_sqrt", "support_sqrt", "trade_recommendation", "staleness_warning", "check_timestamp", "notes"],
};


export const calculateStrategy = async (vixPercent: number, niftyPrice: number): Promise<StrategyResult> => {
  const prompt = buildPrompt(vixPercent, niftyPrice);
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: responseSchema,
        },
    });

    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);
    return parsedJson as StrategyResult;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error && error.message.includes('SAFETY')) {
        throw new Error("The request was blocked due to safety settings. Please adjust your input.");
    }
    throw new Error("Failed to get strategy from AI. The model may be overloaded or the input is invalid.");
  }
};
