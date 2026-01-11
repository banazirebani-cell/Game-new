import React, { useState, useEffect, useRef } from 'react';
import { Rocket, Wallet, History, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CrashGameUltimate = () => {
  const [phase, setPhase] = useState('LOADING'); 
  const [multiplier, setMultiplier] = useState(1.00);
  const [balance, setBalance] = useState(150.00);
  const [betAmount, setBetAmount] = useState(10);
  const [nextBetAmount, setNextBetAmount] = useState(10);
  const [isBettingNext, setIsBettingNext] = useState(false);
  const [currentBetActive, setCurrentBetActive] = useState(false);
  const [cashedOut, setCashedOut] = useState(false);
  const [autoBet, setAutoBet] = useState(false);
  const [history, setHistory] = useState([1.24, 8.50, 1.10, 2.43]);
  const [countdown, setCountdown] = useState(5.0);

  const gameLoopRef = useRef(null);
  const startTimeRef = useRef(0);

  useEffect(() => {
    startBettingPhase();
    return () => clearInterval(gameLoopRef.current);
  }, []);

  useEffect(() => {
    if (phase === 'LOADING' && autoBet) {
      setIsBettingNext(true);
    }
  }, [phase, autoBet]);

  const startBettingPhase = () => {
    setPhase('LOADING');
    setMultiplier(1.00);
    setCashedOut(false);
    setCurrentBetActive(false);
    let timeLeft = 5.0;
    setCountdown(5.0);

    const timer = setInterval(() => {
      timeLeft -= 0.1;
      setCountdown(Math.max(0, timeLeft));
      if (timeLeft <= 0) {
        clearInterval(timer);
        startFlightPhase();
      }
    }, 100);
  };

  const startFlightPhase = () => {
    setIsBettingNext(currentState => {
      if (currentState) {
        setBalance(prev => prev - nextBetAmount);
        setCurrentBetActive(true);
        setBetAmount(nextBetAmount);
      }
      return false;
    });

    setPhase('FLYING');
    startTimeRef.current = Date.now();
    const crashPoint = (Math.random() * 5 + 1.1).toFixed(2);

    gameLoopRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = (now - startTimeRef.current) / 1000;
      const nextMultiplier = 1 + (elapsed * elapsed * 0.1) + (elapsed * 0.05);

      if (nextMultiplier >= crashPoint) {
        handleCrash(nextMultiplier);
      } else {
        setMultiplier(nextMultiplier);
      }
    }, 50);
  };

  const handleCrash = (finalVal) => {
    clearInterval(gameLoopRef.current);
    setPhase('CRASHED');
    setMultiplier(finalVal);
    setHistory(prev => [parseFloat(finalVal.toFixed(2)), ...prev.slice(0, 4)]);
    setTimeout(() => startBettingPhase(), 2500);
  };

  const cashOut = () => {
    if (phase !== 'FLYING' || !currentBetActive || cashedOut) return;
    setBalance(prev => prev + (betAmount * multiplier));
    setCashedOut(true);
    setCurrentBetActive(false);
  };

  const handleBetClick = () => {
    setIsBettingNext(!isBettingNext);
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] text-white font-sans overflow-hidden flex flex-col relative">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />

      <header className="relative z-10 px-4 py-3 flex justify-between items-center bg-[#151a25] border-b border-white/5 shadow-md">
        <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg"><Rocket size={18} /></div>
            <span className="font-bold tracking-wider">TON CRASH</span>
        </div>
        <div className="flex items-center gap-3 bg-black/40 px-3 py-1.5 rounded-full border border-white/10">
            <Wallet size={14} className="text-blue-400" />
            <span className="font-mono font-bold">{balance.toFixed(2)} TON</span>
        </div>
      </header>

      <div className="relative z-10 px-4 py-2 flex gap-2 justify-end">
            {history.map((val, idx) => (
                <div key={idx} className={`px-2 py-0.5 rounded text-[10px] font-bold border border-white/5 ${val >= 2.0 ? 'bg-green-500/20 text-green-400' : 'bg-rose-500/20 text-rose-500'}`}>
                    {val.toFixed(2)}x
                </div>
            ))}
      </div>

      <main className="flex-1 relative flex flex-col items-center justify-center p-4">
        <div className="relative w-64 h-64 flex items-center justify-center">
            {phase === 'LOADING' && (
                <div className="absolute inset-0 rounded-full border-4 border-white/10">
                     <svg className="w-full h-full rotate-[-90deg]">
                        <circle cx="128" cy="128" r="124" stroke="#3b82f6" strokeWidth="4" fill="none" strokeDasharray="780" strokeDashoffset={780 - (780 * (countdown / 5))} className="transition-all duration-100 ease-linear" />
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xs text-blue-400 font-bold uppercase animate-pulse">Départ dans</span>
                        <span className="text-4xl font-mono font-black">{countdown.toFixed(1)}s</span>
                     </div>
                </div>
            )}

            {phase !== 'LOADING' && (
                 <div className="flex flex-col items-center">
                    {phase === 'CRASHED' ? (
                        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                            <div className="text-5xl font-black text-rose-500 font-mono">{multiplier.toFixed(2)}x</div>
                            <div className="text-rose-200/50 font-bold uppercase text-center text-xs">CRASHED</div>
                        </motion.div>
                    ) : (
                        <div className="relative">
                            <div className={`text-6xl font-black font-mono ${cashedOut ? 'text-green-400' : 'text-white'}`}>
                                {multiplier.toFixed(2)}x
                            </div>
                            {!cashedOut && <Rocket size={32} className="text-yellow-400 animate-bounce absolute -top-10 left-1/2 -translate-x-1/2" />}
                        </div>
                    )}
                </div>
            )}
        </div>
        
        <AnimatePresence>
            {cashedOut && (
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }} className="absolute top-10 bg-green-500 text-black font-bold px-6 py-2 rounded-full shadow-lg">
                    +{(betAmount * multiplier).toFixed(2)} TON
                </motion.div>
            )}
        </AnimatePresence>
      </main>

      <div className="relative z-20 bg-[#151a25] rounded-t-3xl border-t border-white/5 p-5">
        <div className="flex justify-between items-center mb-4 px-2">
            <div className="flex items-center gap-2" onClick={() => setAutoBet(!autoBet)}>
                <div className={`w-10 h-5 rounded-full flex items-center p-1 transition-colors ${autoBet ? 'bg-green-500' : 'bg-gray-700'}`}>
                    <div className={`w-3 h-3 bg-white rounded-full transition-transform ${autoBet ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
                <span className={`text-xs font-bold ${autoBet ? 'text-white' : 'text-gray-500'}`}>AUTO BET</span>
            </div>
            <Settings size={14} className="text-gray-500" />
        </div>

        <div className="bg-[#0b0e14] p-2 rounded-xl flex items-center justify-between border border-white/5 mb-4">
            <button onClick={() => setNextBetAmount(prev => Math.max(1, prev / 2))} className="w-10 h-10 rounded-lg bg-[#1a1f2e] text-gray-400">½</button>
            <input type="number" value={nextBetAmount} onChange={(e) => setNextBetAmount(parseFloat(e.target.value))} className="w-20 bg-transparent text-center text-lg font-bold outline-none" />
            <button onClick={() => setNextBetAmount(prev => prev * 2)} className="w-10 h-10 rounded-lg bg-[#1a1f2e] text-gray-400">2x</button>
        </div>

        {phase === 'FLYING' && currentBetActive && !cashedOut ? (
            <button onClick={cashOut} className="w-full h-14 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl font-black text-xl uppercase shadow-lg">
                RETIRER {(betAmount * multiplier).toFixed(2)}
            </button>
        ) : (
            <button onClick={handleBetClick} className={`w-full h-14 rounded-xl font-black text-lg uppercase transition-all flex flex-col items-center justify-center ${isBettingNext ? 'bg-rose-600' : 'bg-blue-600'}`}>
                {isBettingNext ? "Pari Validé" : `Miser ${nextBetAmount} TON`}
                {phase !== 'LOADING' && !isBettingNext && <span className="text-[10px] lowercase opacity-70">pour le prochain tour</span>}
            </button>
        )}
      </div>
    </div>
  );
};

export default CrashGameUltimate;
