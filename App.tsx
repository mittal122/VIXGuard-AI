import React, { useState, useCallback, useEffect } from 'react';
import { InputForm } from './components/InputForm';
import { ResultDisplay } from './components/ResultDisplay';
import { Spinner } from './components/Spinner';
import { ErrorAlert } from './components/ErrorAlert';
import { calculateStrategy } from './services/geminiService';
import { marketDataService } from './services/marketDataService';
import type { StrategyResult } from './types';
import { InfoIcon } from './components/icons/Info';


const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<StrategyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState<boolean>(false);
  
  // Lifted state for inputs
  const [vix, setVix] = useState<string>('15.5');
  const [nifty, setNifty] = useState<string>('23500');

  const handleCalculate = useCallback(async (vixVal: string, niftyVal: string) => {
    const vixPercent = parseFloat(vixVal);
    const niftyPrice = parseFloat(niftyVal);

    if (isNaN(vixPercent) || isNaN(niftyPrice)) return;

    // During live updates, don't clear the previous result immediately for a smoother UI
    if (!isLive) {
      setResult(null);
    }
    setIsLoading(true);
    setError(null);
    try {
      const strategyResult = await calculateStrategy(vixPercent, niftyPrice);
      setResult(strategyResult);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      console.error(err);
      // If the live feed runs into an error, stop it to prevent repeated failed calls.
      if (isLive) {
        setIsLive(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isLive]);

  const toggleLiveMode = () => {
    setIsLive(prev => !prev);
  };
  
  useEffect(() => {
    if (isLive) {
      setIsLoading(true); // Show loading initially when starting live feed
      marketDataService.start(
        (data) => {
          setVix(data.vix.toString());
          setNifty(data.nifty.toString());
          // Trigger calculation with new data
          handleCalculate(data.vix.toString(), data.nifty.toString());
        },
        (errMsg) => {
            setError(`Live Feed Error: ${errMsg}`);
            setIsLive(false); // Stop on error
            setIsLoading(false);
        }
      );
    } else {
      marketDataService.stop();
      setIsLoading(false);
    }

    return () => {
      marketDataService.stop();
    };
  }, [isLive, handleCalculate]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">
            Nifty VIX Strategy Calculator
          </h1>
          {isLive && (
            <div className="flex justify-center items-center gap-2 mt-4 text-emerald-400 animate-fade-in">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span>Live Data Feed Active (Auto-refresh every 60s)</span>
            </div>
          )}
          <p className="mt-2 text-gray-400 max-w-2xl mx-auto">
            Leverage AI to compute intraday ranges and generate trade signals for NIFTY 50 based on India VIX volatility.
          </p>
        </header>

        <main className="space-y-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-700">
            <InputForm 
                vix={vix}
                nifty={nifty}
                onVixChange={setVix}
                onNiftyChange={setNifty}
                onCalculate={() => handleCalculate(vix, nifty)} 
                isLoading={isLoading}
                isLive={isLive}
                onToggleLive={toggleLiveMode}
            />
          </div>

          {isLoading && !result && (
             <div className="flex justify-center items-center py-12">
               <Spinner />
             </div>
          )}

          {error && <ErrorAlert message={error} />}

          {result ? (
            <div className={isLoading && isLive ? "opacity-50 transition-opacity duration-200" : ""}>
                 <ResultDisplay result={result} />
            </div>
          ) : (
             !isLoading && !error && (
                 <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 text-center border border-gray-700 border-dashed">
                    <InfoIcon className="mx-auto h-12 w-12 text-sky-500" />
                    <h3 className="mt-4 text-xl font-semibold text-white">Waiting for Input</h3>
                    <p className="mt-2 text-gray-400">Enter the current India VIX and NIFTY 50 values, or start the live feed to fetch real market data.</p>
                </div>
             )
          )}
        </main>

        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>Live data is fetched via Google Search Grounding.</p>
          <p className="mt-1">
            Disclaimer: This tool is for educational purposes only. Trading involves risk. Not financial advice.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
