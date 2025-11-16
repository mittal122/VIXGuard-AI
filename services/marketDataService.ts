
let intervalId: number | undefined;
let baseline = { vix: 15.5, nifty: 23500 };

/**
 * Generates a slightly randomized next value for VIX and Nifty.
 * This simulates live market data fluctuations.
 */
const generateNewData = () => {
  const niftyChange = (Math.random() - 0.5) * 20; // Fluctuates by +/- 10 points
  const vixChange = (Math.random() - 0.49) * 0.2; // Fluctuates by +/- ~0.1

  // Update baseline nifty price
  baseline.nifty = Math.round((baseline.nifty + niftyChange) * 100) / 100;

  // Update baseline VIX, ensuring it stays within a reasonable range (e.g., > 10)
  baseline.vix = Math.round(Math.max(10, baseline.vix + vixChange) * 100) / 100;

  return { ...baseline };
};

export const marketDataService = {
  /**
   * Starts the simulated data stream.
   * @param initialVix The starting VIX value.
   * @param initialNifty The starting Nifty value.
   * @param callback The function to call with new data on each interval.
   * @param intervalMs The interval in milliseconds (defaults to 5000ms).
   */
  start: (
    initialVix: number,
    initialNifty: number,
    callback: (data: { vix: number; nifty: number }) => void,
    intervalMs = 5000
  ) => {
    // Clear any existing interval to prevent duplicates
    if (intervalId) {
      clearInterval(intervalId);
    }

    baseline = { vix: initialVix, nifty: initialNifty };
    
    // Immediately provide the first data point upon starting
    callback(baseline);

    intervalId = window.setInterval(() => {
      const newData = generateNewData();
      callback(newData);
    }, intervalMs);

    console.log('Started simulated market data stream.');
  },

  /**
   * Stops the simulated data stream.
   */
  stop: () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = undefined;
      console.log('Stopped simulated market data stream.');
    }
  },
};
