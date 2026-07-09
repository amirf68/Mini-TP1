import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { vocabData } from '../../data';
import { Check, X } from 'lucide-react';

export default function Slide2Vocab() {
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
      setMatches(prev => ({ ...prev, [selectedWordId]: defId }));
      setSelectedWordId(null);
      setWrongMatch(null);
    } else {
      // Wrong match
      setWrongMatch(defId);
      setTimeout(() => setWrongMatch(null), 1000);
      setSelectedWordId(null);
    }
  };

  const isAllMatched = Object.keys(matches).length === vocabData.length;

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-8 bg-slate-50">
      <h2 className="text-4xl font-bold text-slate-800 mb-2">Office Words</h2>
      <p className="text-xl text-slate-500 mb-10">Match the word to the picture and meaning.</p>

      <div className="flex w-full max-w-6xl gap-8">
        {/* Words Column */}
        <div className="w-1/3 flex flex-col gap-4">
          {vocabData.map((v) => {
            const isMatched = !!matches[v.id];
            const isSelected = selectedWordId === v.id;
            return (
              <motion.button
                key={`word-${v.id}`}
                whileHover={!isMatched ? { scale: 1.02 } : {}}
                whileTap={!isMatched ? { scale: 0.98 } : {}}
                onClick={() => handleWordClick(v.id)}
                className={`p-6 rounded-2xl text-2xl font-bold border-2 transition-all text-left flex justify-between items-center
                  ${isMatched ? 'bg-emerald-100 border-emerald-500 text-emerald-700 opacity-50 cursor-default' : 
                    isSelected ? 'bg-indigo-600 border-indigo-700 text-white shadow-lg ring-4 ring-indigo-200' : 
                    'bg-white border-slate-200 text-slate-700 hover:border-indigo-300 shadow-sm'}`}
              >
                {v.word}
                {isMatched && <Check size={24} className="text-emerald-600" />}
              </motion.button>
            );
          })}
        </div>

        {/* Definitions Column */}
        <div className="w-2/3 flex flex-col gap-4">
          {shuffledDefs.map((v) => {
            const isMatched = Object.values(matches).includes(v.id);
            const isWrong = wrongMatch === v.id;
            
            return (
              <motion.button
                key={`def-${v.id}`}
                whileHover={!isMatched && selectedWordId ? { scale: 1.01 } : {}}
                onClick={() => handleDefClick(v.id)}
                animate={isWrong ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={isWrong ? { duration: 0.4 } : {}}
                className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-6 text-left
                  ${isMatched ? 'bg-emerald-50 border-emerald-300 opacity-60 cursor-default' : 
                    isWrong ? 'bg-rose-100 border-rose-500' :
                    selectedWordId ? 'bg-white border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer shadow-sm' : 
                    'bg-white border-slate-200 opacity-80 cursor-default'}`}
              >
                <div className="text-6xl bg-slate-100 p-4 rounded-xl">
                  {v.emoji}
                </div>
                <div className="text-2xl text-slate-700 font-medium">
                  {v.definition}
                </div>
                {isWrong && <X size={32} className="text-rose-500 ml-auto mr-4" />}
                {isMatched && <Check size={32} className="text-emerald-500 ml-auto mr-4" />}
              </motion.button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {isAllMatched && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 text-3xl font-bold text-emerald-600 bg-emerald-100 px-8 py-4 rounded-full flex items-center gap-3"
          >
            <Check size={36} /> Great job!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
