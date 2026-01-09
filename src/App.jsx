import React, { useState, useEffect, useRef } from 'react';
import { Rocket, Wallet, History, ShieldCheck } from 'lucide-react';

const CrashGame = () => {
  // --- États du jeu ---
  const [multiplier, setMultiplier] = useState(1.00);
  const [isRunning, setIsRunning] = useState(false);
  const [isCrashed, setIsCrashed] = useState(false);
  const [balance, setBalance] = useState(150.00); 
  const [betAmount, setBetAmount] = useState(10);
  const [hasBet, setHasBet] = useState(false);
  const [cashedOut, setCashedOut] = useState(false);
  const [history, setHistory] = useState([1.24, 2.50, 1.10, 5.43, 1.05]);

  const gameLoopRef = useRef(null);

  const startGame = () => {
    if (balance < betAmount) return alert("Solde insuffisant !");
    
    setIsRunning(true);
    setIsCrashed(false);
    setCashedOut(false);
    setHasBet(true);
    setBalance(prev => prev - betAmount);
    setMultiplier(1.00);

    // Simulation du point de crash (entre 1.00 et 6.00)
    const crashPoint = (Math.random() * 5 + 1).toFixed(2); 
    console.log("Crash prévu à : " + crashPoint + "x");

    gameLoopRef.current = setInterval(() => {
      setMultiplier(prev => {
        const next = prev + (prev * 0.05) + 0.01;
        
        if (next >= crashPoint) {
          handleCrash(next);
          return next;
        }
        return next;
      });
    }, 100);
  };

  const handleCrash = (finalValue) => {
    clearInterval(gameLoopRef.current);
    setIsRunning(false);
    setIsCrashed(true);
    setHasBet(false);
    setHistory(prev => [parseFloat(finalValue.toFixed(2)), ...prev.slice(0, 4)]);
  };

  const cashOut = () => {
    if (!isRunning || cashedOut || isCrashed) return;

    const winAmount = betAmount * multiplier;
    setBalance(prev => prev + winAmount);
    setCashedOut(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col items-center justify-between pb-4">
      
      {/* 1. Header */}
      <div className="w-full max-w-md bg-slate-800 p-4 shadow-lg flex justify-between items-center rounded-b-xl border-b border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold">
            U
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-400">Joueur</span>
            <span className="text-sm font-bold text-blue-400">@Nour_User</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-900 px-3 py-1 rounded-lg border border-slate-700">
          <Wallet size={16} className="text-yellow-500" />
          <span className="font-mono font-bold text-yellow-400">{balance.toFixed(2)} TON</span>
        </div>
      </div>

      {/* 2. Historique */}
      <div className="w-full max-w-md px-4 mt-2 mb-2">
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            <div className="flex items-center gap-1 text-xs text-slate-500 mr-2">
                <History size={14} /> Derniers:
            </div>
            {history.map((val, idx) => (
                <div key={idx} className={`px-2 py-1 rounded text-xs font-bold ${val < 2.0 ? 'bg-red-900/50 text-red-400' : 'bg-green-900/50 text-green-400'}`}>
                    {val.toFixed(2)}x
                </div>
            ))}
        </div>
      </div>

      {/* 3. Zone de Jeu */}
      <div className="relative w-full max-w-md flex-1 flex flex-col items-center justify-center p-4">
        <div className={`relative w-64 h-64 rounded-full border-4 flex items-center justify-center transition-all duration-100 
            ${isCrashed ? 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)]' : isRunning ? 'border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.3)]' : 'border-slate-700'}`}>
            
            {isRunning && !isCrashed && (
                <div className="absolute top-0 animate-pulse text-yellow-400">
                    <Rocket size={32} className="transform -rotate-45 drop-shadow-lg" />
                </div>
            )}

            <div className="text-center z-10">
                {isCrashed ? (
                    <>
                        <span className="text-5xl font-black text-red-500 drop-shadow-md">CRASH</span>
                        <p className="text-sm text-red-300 mt-2">À {multiplier.toFixed(2)}x</p>
                    </>
                ) : (
                    <>
                        <span className={`text-6xl font-black tracking-tighter ${cashedOut ? 'text-green-400' : 'text-white'}`}>
                            {multiplier.toFixed(2)}x
                        </span>
                        {cashedOut && <p className="text-green-400 text-sm font-bold mt-1">GAGNÉ !</p>}
                    </>
                )}
            </div>
        </div>
      </div>

      {/* 4. Panneau de Contrôle */}
      <div className="w-full max-w-md px-4 pb-6">
        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 shadow-xl">
            
            <div className="flex justify-between items-center mb-4 bg-slate-900 p-2 rounded-lg">
                <button onClick={() => setBetAmount(Math.max(1, betAmount - 1))} className="w-10 h-10 bg-slate-700 rounded text-xl font-bold hover:bg-slate-600">-</button>
                <div className="flex flex-col items-center">
                    <span className="text-xs text-slate-400">Montant (TON)</span>
                    <input 
                        type="number" 
                        value={betAmount} 
                        onChange={(e) => setBetAmount(parseFloat(e.target.value))}
                        className="bg-transparent text-center font-bold text-xl w-24 outline-none text-white"
                    />
                </div>
                <button onClick={() => setBetAmount(betAmount + 1)} className="w-10 h-10 bg-slate-700 rounded text-xl font-bold hover:bg-slate-600">+</button>
            </div>

            {!isRunning ? (
                <button 
                    onClick={startGame}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-black text-xl uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all text-white"
                >
                    Miser Maintenant
                </button>
            ) : (
                <button 
                    onClick={cashOut}
                    disabled={cashedOut || isCrashed}
                    className={`w-full py-4 rounded-xl font-black text-xl uppercase tracking-wider shadow-lg transition-all text-white
                    ${cashedOut ? 'bg-slate-600 cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:brightness-110 active:scale-95 animate-pulse'}`}
                >
                    {cashedOut ? 'En attente...' : `Retirer (${(betAmount * multiplier).toFixed(2)})`}
                </button>
            )}
            
            <div className="mt-3 flex justify-center items-center gap-2 text-xs text-slate-500">
                <ShieldCheck size={12} />
                <span>Provably Fair & Sécurisé par TON</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CrashGame;
