import React, { useState, useRef } from 'react';
import { Rocket, Wallet, History, ShieldCheck } from 'lucide-react';

const CrashGame = () => {
  const [multiplier, setMultiplier] = useState(1.00);
  const [isRunning, setIsRunning] = useState(false);
  const [isCrashed, setIsCrashed] = useState(false);
  const [balance, setBalance] = useState(150.00); 
  const [betAmount, setBetAmount] = useState(10);
  const [cashedOut, setCashedOut] = useState(false);
  const [history, setHistory] = useState([1.24, 2.50, 1.10, 5.43, 1.05]);

  const gameLoopRef = useRef(null);

  const startGame = () => {
    if (balance < betAmount) return alert("Solde insuffisant !");
    setIsRunning(true);
    setIsCrashed(false);
    setCashedOut(false);
    setBalance(prev => prev - betAmount);
    setMultiplier(1.00);

    const crashPoint = (Math.random() * 4 + 1.1).toFixed(2); 

    gameLoopRef.current = setInterval(() => {
      setMultiplier(prev => {
        const next = prev + (prev * 0.04) + 0.01;
        if (next >= crashPoint) {
          clearInterval(gameLoopRef.current);
          setIsRunning(false);
          setIsCrashed(true);
          setHistory(h => [parseFloat(next.toFixed(2)), ...h.slice(0, 4)]);
          return next;
        }
        return next;
      });
    }, 100);
  };

  const cashOut = () => {
    if (!isRunning || cashedOut || isCrashed) return;
    setBalance(prev => prev + (betAmount * multiplier));
    setCashedOut(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-4">
      <div className="w-full max-w-md flex justify-between bg-slate-800 p-4 rounded-xl border border-slate-700">
        <div className="flex flex-col">
          <span className="text-xs text-slate-400">Joueur</span>
          <span className="font-bold text-blue-400">@Nour_User</span>
        </div>
        <div className="flex items-center gap-2 bg-slate-900 px-3 py-1 rounded-lg">
          <Wallet size={16} className="text-yellow-500" />
          <span className="text-yellow-400 font-bold">{balance.toFixed(2)} TON</span>
        </div>
      </div>

      <div className="w-full max-w-md mt-4 flex gap-2 overflow-x-auto no-scrollbar">
        {history.map((val, i) => (
          <div key={i} className={`px-2 py-1 rounded text-xs font-bold ${val < 2 ? 'bg-red-900/50 text-red-400' : 'bg-green-900/50 text-green-400'}`}>
            {val.toFixed(2)}x
          </div>
        ))}
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className={`w-64 h-64 rounded-full border-4 flex flex-col items-center justify-center transition-all ${isCrashed ? 'border-red-600 shadow-lg shadow-red-900/50' : isRunning ? 'border-blue-500' : 'border-slate-700'}`}>
          {isRunning && !isCrashed && <Rocket className="text-yellow-400 animate-bounce mb-2" size={32} />}
          <span className={`text-5xl font-black ${cashedOut ? 'text-green-400' : isCrashed ? 'text-red-500' : 'text-white'}`}>
            {multiplier.toFixed(2)}x
          </span>
          {isCrashed && <span className="text-red-400 font-bold">CRASH !</span>}
        </div>
      </div>

      <div className="w-full max-w-md bg-slate-800 p-4 rounded-2xl border border-slate-700">
        <div className="flex justify-between items-center bg-slate-900 p-3 rounded-lg mb-4">
          <button onClick={() => setBetAmount(Math.max(1, betAmount - 5))} className="text-2xl font-bold px-4">-</button>
          <span className="text-xl font-bold">{betAmount} TON</span>
          <button onClick={() => setBetAmount(betAmount + 5)} className="text-2xl font-bold px-4">+</button>
        </div>

        {!isRunning || isCrashed ? (
          <button onClick={startGame} className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-xl transition-all">MISER</button>
        ) : (
          <button onClick={cashOut} disabled={cashedOut} className={`w-full py-4 rounded-xl font-bold text-xl ${cashedOut ? 'bg-slate-600' : 'bg-green-600 animate-pulse'}`}>
            {cashedOut ? 'GAGNÉ !' : `RETIRER ${(betAmount * multiplier).toFixed(2)}`}
          </button>
        )}
      </div>
    </div>
  );
};

export default CrashGame;
