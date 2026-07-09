import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, AlertCircle, UploadCloud, Send } from 'lucide-react';
import { useSocket } from '../../SocketContext';
import confetti from 'canvas-confetti';

export default function Slide1LeadIn() {
  const { role, submitAnswer, state } = useSocket();
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const emotions = [
    "Stress", "Curiosity", "Anger", "Confusion", "Boredom", "Jealousy", "Happiness"
  ];

  const handleSubmit = () => {
    if (selectedEmotion) {
      submitAnswer({ emotion: selectedEmotion });
      setIsSubmitted(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  // Check if current user has answered based on state
  const me = state.students.find(s => s.isOnline && s.hasAnsweredCurrent);
  
  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full bg-slate-950 overflow-hidden pb-20">
      
      {/* Title Area */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 bg-slate-900/80 backdrop-blur-md px-10 py-4 rounded-3xl border border-slate-700 mb-4 flex flex-col items-center shadow-2xl mt-4"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight text-center">
          First Day at the Office
        </h1>
        <p className="text-xl text-slate-400 font-medium flex items-center gap-2">
          <Users size={24} className="text-indigo-400" />
          Look at the picture. How do they feel?
        </p>
      </motion.div>

      {/* Image Area */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="relative z-20 w-full max-w-4xl h-[45vh] rounded-2xl overflow-hidden border-4 border-slate-700 shadow-2xl flex items-center justify-center bg-slate-800"
      >
        <img 
          src="/office-emotions.png" 
          alt="Office workers showing different emotions" 
          className="w-full h-full object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.nextElementSibling?.classList.remove('hidden');
          }}
        />
        <div className="hidden absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-slate-800/90 backdrop-blur-sm p-8 text-center">
          <UploadCloud size={64} className="mb-4 text-indigo-400" />
          <h3 className="text-2xl font-bold text-white mb-2">Image Not Found</h3>
        </div>
      </motion.div>

      {/* Interaction Area (Only for students) */}
      {role === 'student' && !isSubmitted && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="z-30 mt-6 w-full max-w-4xl px-4 flex flex-col items-center"
        >
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {emotions.map(emo => (
              <button
                key={emo}
                onClick={() => setSelectedEmotion(emo)}
                className={`px-6 py-3 rounded-full text-xl font-bold transition-all duration-200 border-2 shadow-lg ${
                  selectedEmotion === emo 
                  ? 'bg-rose-500 text-white border-rose-400 scale-110 shadow-rose-500/50' 
                  : 'bg-slate-800 text-slate-300 border-slate-600 hover:bg-slate-700 hover:scale-105'
                }`}
              >
                {emo}
              </button>
            ))}
          </div>
          
          <AnimatePresence>
            {selectedEmotion && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={handleSubmit}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-12 rounded-xl text-2xl transition-all shadow-xl shadow-indigo-600/30 flex items-center gap-3"
              >
                Submit <Send size={24} />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Submitted State */}
      {role === 'student' && isSubmitted && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="z-30 mt-8 bg-emerald-500/20 border-2 border-emerald-500/50 px-8 py-4 rounded-2xl flex items-center gap-4 text-emerald-400"
        >
          <AlertCircle size={32} />
          <div>
            <h3 className="text-2xl font-bold">Great job!</h3>
            <p className="text-lg">Waiting for the teacher to continue...</p>
          </div>
        </motion.div>
      )}

      {/* Teacher View / Prompt */}
      {role === 'teacher' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="z-30 bg-white px-8 py-4 rounded-2xl shadow-2xl border-4 border-rose-500 flex items-center gap-6 max-w-3xl mt-6"
        >
          <div className="bg-rose-100 p-3 rounded-full text-rose-600">
            <AlertCircle size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">
              Discuss with your partner
            </h3>
            <p className="text-lg text-slate-600 font-medium">Why do you think they feel this way? Have you ever felt like this?</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
