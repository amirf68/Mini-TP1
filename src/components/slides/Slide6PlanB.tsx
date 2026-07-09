import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Sparkles } from 'lucide-react';
import { vocabData } from '../../data';

export default function Slide6PlanB() {
  const [spinning, setSpinning] = useState(false);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  // Add some distraction words for the spinner effect
  const wordsForSpinner = [
    ...vocabData.map(v => v.word),
    'Manager', 'Meeting', 'Coffee', 'Late', 'Desk', 'Stress'
  ];

  const spinWheel = () => {
    if (spinning) return;
    
    setSpinning(true);
    setSelectedWord(null);
    
    // Fake spinning effect
    let count = 0;
    const maxSpins = 20;
    const interval = setInterval(() => {
      setSelectedWord(wordsForSpinner[Math.floor(Math.random() * wordsForSpinner.length)]);
      count++;
      
      if (count > maxSpins) {
        clearInterval(interval);
        // Ensure the final word is from our target vocab
        const targetWord = vocabData[Math.floor(Math.random() * vocabData.length)].word;
        setSelectedWord(targetWord);
        setSpinning(false);
      }
    }, 100); // 100ms per change
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-8 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500 via-orange-600 to-rose-900 overflow-hidden relative">
      
      {/* Background decorations */}
      <div className="absolute top-10 left-10 text-white/10 opacity-50"><Flame size={200} /></div>
      <div className="absolute bottom-10 right-10 text-white/10 opacity-50"><Flame size={300} /></div>

      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="z-10 text-center mb-12"
      >
        <h1 className="text-6xl md:text-8xl font-black text-white mb-4 tracking-tighter drop-shadow-xl uppercase italic flex items-center justify-center gap-6">
          <Flame className="text-yellow-300" size={80} />
          Hot Seat
          <Flame className="text-yellow-300" size={80} />
        </h1>
        <p className="text-3xl text-amber-100 font-bold bg-black/30 inline-block px-8 py-3 rounded-full">
          Explain the word. DO NOT say it!
        </p>
      </motion.div>

      {/* The Slot Machine / Spinner */}
      <div className="relative z-10 w-full max-w-4xl bg-black/40 p-8 rounded-3xl backdrop-blur-md border border-white/20 shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col items-center">
        
        <div className="w-full bg-white rounded-2xl h-48 flex items-center justify-center mb-8 shadow-inner overflow-hidden relative">
          <AnimatePresence mode="popLayout">
            {selectedWord ? (
              <motion.div
                key={selectedWord}
                initial={{ y: spinning ? 50 : 0, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: spinning ? -50 : 0, opacity: 0 }}
                transition={{ duration: spinning ? 0.1 : 0.5, type: spinning ? 'tween' : 'spring' }}
                className={`text-6xl md:text-8xl font-black tracking-tight ${spinning ? 'text-slate-400' : 'text-rose-600 drop-shadow-md'}`}
              >
                {selectedWord.toUpperCase()}
              </motion.div>
            ) : (
              <div className="text-4xl font-bold text-slate-300">Click to Spin</div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={spinWheel}
          disabled={spinning}
          className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-amber-900 text-3xl font-black py-6 px-16 rounded-full shadow-[0_10px_0_rgb(180,83,9)] hover:shadow-[0_5px_0_rgb(180,83,9)] hover:translate-y-1 active:shadow-none active:translate-y-3 transition-all cursor-pointer flex items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Sparkles size={36} />
          {spinning ? 'SPINNING...' : 'GENERATE WORD'}
        </button>
      </div>

    </div>
  );
}
