import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Sparkles } from 'lucide-react';
import { vocabData } from '../../data';
import { useSocket } from '../../SocketContext';
import confetti from 'canvas-confetti';

export default function Slide6PlanB() {
  const { role, triggerEvent, roomEvent } = useSocket();
  const [spinning, setSpinning] = useState(false);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  useEffect(() => {
    if (roomEvent?.eventName === 'spinWheel') {
      const targetWord = roomEvent.payload?.targetWord;
      if (targetWord) {
        startSpinAnimation(targetWord);
      }
    }
  }, [roomEvent]);

  // Add some distraction words for the spinner effect
  const wordsForSpinner = [
    ...vocabData.map(v => v.word),
    'Manager', 'Meeting', 'Coffee', 'Late', 'Desk', 'Stress'
  ];

  const handleSpinClick = () => {
    if (spinning || role !== 'teacher') return;
    const targetWord = vocabData[Math.floor(Math.random() * vocabData.length)].word;
    triggerEvent('spinWheel', { targetWord });
  };

  const startSpinAnimation = (targetWord: string) => {
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
        setSelectedWord(targetWord);
        setSpinning(false);
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    }, 100); // 100ms per change
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 md:p-8 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500 via-orange-600 to-rose-900 overflow-hidden relative pb-32">
      
      {/* Background decorations */}
      <div className="absolute top-4 left-4 md:top-10 md:left-10 text-white/10 opacity-50"><Flame size={100} className="md:w-[200px] md:h-[200px]" /></div>
      <div className="absolute bottom-10 right-4 md:right-10 text-white/10 opacity-50"><Flame size={150} className="md:w-[300px] md:h-[300px]" /></div>

      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="z-10 text-center mb-8 md:mb-12 mt-8 md:mt-0"
      >
        <h1 className="text-5xl md:text-8xl font-black text-white mb-2 md:mb-4 tracking-tighter drop-shadow-xl uppercase italic flex items-center justify-center gap-2 md:gap-6">
          <Flame className="text-yellow-300 hidden md:block" size={80} />
          Hot Seat
          <Flame className="text-yellow-300 hidden md:block" size={80} />
        </h1>
        <p className="text-lg md:text-3xl text-amber-100 font-bold bg-black/30 inline-block px-4 py-2 md:px-8 md:py-3 rounded-full">
          Explain the word. DO NOT say it!
        </p>
      </motion.div>

      {/* The Slot Machine / Spinner */}
      <div className="relative z-10 w-full max-w-4xl bg-black/40 p-4 md:p-8 rounded-3xl backdrop-blur-md border border-white/20 shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col items-center">
        
        <div className="w-full bg-white rounded-2xl h-32 md:h-48 flex items-center justify-center mb-6 md:mb-8 shadow-inner overflow-hidden relative">
          <AnimatePresence mode="popLayout">
            {selectedWord ? (
              <motion.div
                key={selectedWord}
                initial={{ y: spinning ? 50 : 0, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: spinning ? -50 : 0, opacity: 0 }}
                transition={{ duration: spinning ? 0.1 : 0.5, type: spinning ? 'tween' : 'spring' }}
                className={`text-4xl md:text-8xl font-black tracking-tight ${spinning ? 'text-slate-400' : 'text-rose-600 drop-shadow-md'}`}
              >
                {selectedWord.toUpperCase()}
              </motion.div>
            ) : (
              <div className="text-2xl md:text-4xl font-bold text-slate-300">
                {role === 'teacher' ? 'Click to Spin' : 'Waiting for teacher...'}
              </div>
            )}
          </AnimatePresence>
        </div>

        {role === 'teacher' && (
          <button
            onClick={handleSpinClick}
            disabled={spinning}
            className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-amber-900 text-xl md:text-3xl font-black py-4 px-8 md:py-6 md:px-16 rounded-full shadow-[0_10px_0_rgb(180,83,9)] hover:shadow-[0_5px_0_rgb(180,83,9)] hover:translate-y-1 active:shadow-none active:translate-y-3 transition-all cursor-pointer flex items-center gap-3 md:gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles size={28} className="md:w-9 md:h-9" />
            {spinning ? 'SPINNING...' : 'GENERATE WORD'}
          </button>
        )}
      </div>

    </div>
  );
}
