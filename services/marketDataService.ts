import { fetchLiveMarketData } from './geminiService';

let intervalId: number | undefined;

export const marketDataService = {
  /**
   * Starts the live data stream using Gemini Search Grounding.
   * Fetches data every 60 seconds to respect API quotas while providing "live" updates.
   */
  start: async (
    callback: (data: { vix: number; nifty: number }) => void,
    onError: (error: string) => void,
    intervalMs = 60000 
  ) => {
    // Clear any existing interval
    if (intervalId) {
      clearInterval(intervalId);
    }

    // Initial Fetch
    try {
       const data = await fetchLiveMarketData();
       callback(data);
    } catch (err) {
       onError(err instanceof Error ? err.message : 'Failed to fetch initial live data');
    }

    // Periodic Fetch
    intervalId = window.setInterval(async () => {
      try {
        const data = await fetchLiveMarketData();
        callback(data);
      } catch (err) {
        console.error("Live feed update failed:", err);
        // We don't stop the feed on single failure, just log it, 
        // unless we want to notify the user via the onError callback
        onError(err instanceof Error ? err.message : 'Live feed update failed');
      }
    }, intervalMs);

    console.log('Started live market data stream (Real-time via Google Search).');
  },

  /**
   * Stops the data stream.
   */
  stop: () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = undefined;
      console.log('Stopped live market data stream.');
    }
  },
};
