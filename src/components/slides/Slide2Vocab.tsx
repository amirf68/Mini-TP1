import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { vocabData } from '../../data';
import { Check, X } from 'lucide-react';
import { useSocket } from '../../SocketContext';
import confetti from 'canvas-confetti';

export default function Slide2Vocab() {
  const { role, submitAnswer } = useSocket();
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({}); // wordId -> definitionId (which is also the wordId)
  const [wrongMatch, setWrongMatch] = useState<string | null>(null);

  // Shuffle order for definitions to make it a game
  const [shuffledDefs, setShuffledDefs] = useState([...vocabData]);

  useEffect(() => {
    setShuffledDefs([...vocabData].sort(() => Math.random() - 0.5));
  }, []);

  const handleWordClick = (id: string) => {
    if (matches[id]) return; // Already matched
    setSelectedWordId(id);
    setWrongMatch(null);
  };

  const handleDefClick = (defId: string) => {
    if (!selectedWordId) return;
    
    if (selectedWordId === defId) {
      // Correct match
      const newMatches = { ...matches, [selectedWordId]: defId };
      setMatches(newMatches);
      setSelectedWordId(null);
      setWrongMatch(null);
      
      if (role === 'student') {
        submitAnswer({ matchedWord: defId, progress: Object.keys(newMatches).length });
      }

      if (Object.keys(newMatches).length === vocabData.length) {
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      }

    } else {
      // Wrong match
      setWrongMatch(defId);
      setTimeout(() => setWrongMatch(null), 1000);
      setSelectedWordId(null);
    }
  };

  const isAllMatched = Object.keys(matches).length === vocabData.length;

  return (
    <div className="flex flex-col items-center justify-start h-full w-full p-4 md:p-8 bg-slate-950 overflow-y-auto pb-32">
      <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-2 mt-4 md:mt-8">Office Words</h2>
      <p className="text-lg md:text-2xl text-slate-400 mb-6 md:mb-10 text-center">Match the word to the picture and meaning.</p>

      <div className="flex flex-col md:flex-row w-full max-w-6xl gap-4 md:gap-8">
        {/* Words Column */}
        <div className="w-full md:w-1/3 flex flex-row md:flex-col gap-3 flex-wrap md:flex-nowrap justify-center">
          {vocabData.map((v) => {
            const isMatched = !!matches[v.id];
            const isSelected = selectedWordId === v.id;
            return (
              <motion.button
                key={`word-${v.id}`}
                whileHover={!isMatched ? { scale: 1.05 } : {}}
                whileTap={!isMatched ? { scale: 0.95 } : {}}
                onClick={() => handleWordClick(v.id)}
                className={`p-3 md:p-6 rounded-2xl text-xl md:text-3xl font-bold border-2 transition-all flex justify-between items-center flex-grow md:flex-grow-0
                  ${isMatched ? 'bg-emerald-900/50 border-emerald-500/50 text-emerald-400 opacity-50 cursor-default' : 
                    isSelected ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)] ring-2 ring-indigo-300' : 
                    'bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700 hover:border-slate-500 shadow-md'}`}
              >
                {v.word}
                {isMatched && <Check size={28} className="text-emerald-500 hidden md:block" />}
              </motion.button>
            );
          })}
        </div>

        {/* Definitions Column */}
        <div className="w-full md:w-2/3 flex flex-col gap-3">
          {shuffledDefs.map((v) => {
            const isMatched = Object.values(matches).includes(v.id);
            const isWrong = wrongMatch === v.id;
            
            return (
              <motion.button
                key={`def-${v.id}`}
                whileHover={!isMatched && selectedWordId ? { scale: 1.02 } : {}}
                whileTap={!isMatched && selectedWordId ? { scale: 0.98 } : {}}
                onClick={() => handleDefClick(v.id)}
                animate={isWrong ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={isWrong ? { duration: 0.4 } : {}}
                className={`p-3 md:p-4 rounded-2xl border-2 transition-all flex items-center gap-4 md:gap-6 text-left w-full
                  ${isMatched ? 'bg-emerald-900/20 border-emerald-500/30 opacity-60 cursor-default' : 
                    isWrong ? 'bg-rose-900/50 border-rose-500' :
                    selectedWordId ? 'bg-slate-800 border-slate-600 hover:border-indigo-400 hover:bg-indigo-900/30 cursor-pointer shadow-lg' : 
                    'bg-slate-800/80 border-slate-700 opacity-80 cursor-default'}`}
              >
                <div className="text-4xl md:text-6xl bg-slate-700/50 p-2 md:p-4 rounded-xl flex-shrink-0">
                  {v.emoji}
                </div>
                <div className="text-lg md:text-2xl text-slate-200 font-medium leading-tight">
                  {v.definition}
                </div>
                {isWrong && <X size={28} className="text-rose-500 ml-auto mr-2 md:mr-4 flex-shrink-0" />}
                {isMatched && <Check size={28} className="text-emerald-500 ml-auto mr-2 md:mr-4 flex-shrink-0" />}
              </motion.button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {isAllMatched && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="mt-8 md:mt-12 text-2xl md:text-4xl font-extrabold text-white bg-emerald-600 border-4 border-emerald-400 px-6 md:px-10 py-4 md:py-6 rounded-3xl flex items-center gap-4 shadow-[0_0_30px_rgba(16,185,129,0.5)]"
          >
            <Check size={40} className="text-emerald-200" /> Awesome matching!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
