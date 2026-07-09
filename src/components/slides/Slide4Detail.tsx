import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Check, X, FileText, ChevronDown } from 'lucide-react';
import { useSocket } from '../../SocketContext';
import confetti from 'canvas-confetti';

export default function Slide4Detail() {
  const { role, submitAnswer, triggerEvent, roomEvent } = useSocket();
  const [answers, setAnswers] = useState<Record<number, boolean | null>>({});

  // Use roomEvent to control revealing short answers across all clients
  const [showShortAnswers, setShowShortAnswers] = useState(false);

  useEffect(() => {
    if (roomEvent?.eventName === 'revealAnswers') {
      setShowShortAnswers(true);
    }
  }, [roomEvent]);

  const tfQuestions = [
    { id: 1, text: 'It is a good idea to arrive exactly on time, not early.', isTrue: false },
    { id: 2, text: 'You should say "Good morning" to people in the office.', isTrue: true },
    { id: 3, text: 'Your colleagues are the people who work with you.', isTrue: true },
    { id: 4, text: 'You should not ask questions if you have a problem.', isTrue: false },
  ];

  const handleAnswer = (id: number, answer: boolean) => {
    if (answers[id] !== undefined) return; // Prevent changing answer for gamification fairness
    
    const newAnswers = { ...answers, [id]: answer };
    setAnswers(newAnswers);

    if (role === 'student') {
      submitAnswer({ questionId: id, answer, correct: answer === tfQuestions.find(q => q.id === id)?.isTrue });
    }

    if (Object.keys(newAnswers).length === tfQuestions.length) {
      const allCorrect = tfQuestions.every(q => newAnswers[q.id] === q.isTrue);
      if (allCorrect) {
        confetti({ particleCount: 100, spread: 60 });
      }
    }
  };

  const handleReveal = () => {
    if (role === 'teacher') {
      triggerEvent('revealAnswers');
    }
  };

  return (
    <div className="flex flex-col items-center h-full w-full p-4 md:p-8 bg-slate-950 overflow-y-auto pb-32">
      
      <div className="w-full max-w-5xl mb-6 md:mb-8 mt-4">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 flex items-center gap-3">
          <FileText className="text-indigo-400" />
          Task B: Reading for Detail
        </h2>
        <p className="text-lg md:text-2xl text-slate-400">Are these sentences True (T) or False (F)?</p>
      </div>

      <div className="w-full max-w-5xl space-y-4 mb-10">
        {tfQuestions.map((q) => {
          const userAnswer = answers[q.id];
          const isCorrect = userAnswer === q.isTrue;
          const hasAnswered = userAnswer !== undefined;

          return (
            <motion.div 
              key={q.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-4 md:p-6 rounded-2xl border-2 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors
                ${hasAnswered 
                  ? (isCorrect ? 'bg-emerald-900/30 border-emerald-500/50' : 'bg-rose-900/30 border-rose-500/50') 
                  : 'bg-slate-800 border-slate-700 shadow-sm'}`}
            >
              <div className={`text-xl md:text-2xl font-medium flex-1 ${hasAnswered ? 'text-slate-300' : 'text-white'}`}>
                {q.id}. {q.text}
              </div>
              
              <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
                <button
                  onClick={() => handleAnswer(q.id, true)}
                  disabled={hasAnswered}
                  className={`px-4 md:px-6 py-2 md:py-3 rounded-xl font-bold text-lg md:text-xl transition-all border-2
                    ${userAnswer === true 
                      ? (isCorrect ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-rose-500 text-white border-rose-600')
                      : 'bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600'}
                    ${hasAnswered && userAnswer !== true ? 'opacity-50' : ''}`}
                >
                  TRUE
                </button>
                <button
                  onClick={() => handleAnswer(q.id, false)}
                  disabled={hasAnswered}
                  className={`px-4 md:px-6 py-2 md:py-3 rounded-xl font-bold text-lg md:text-xl transition-all border-2
                    ${userAnswer === false 
                      ? (isCorrect ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-rose-500 text-white border-rose-600')
                      : 'bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600'}
                    ${hasAnswered && userAnswer !== false ? 'opacity-50' : ''}`}
                >
                  FALSE
                </button>
                
                <div className="w-10 flex justify-center">
                  {hasAnswered && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring' }}
                    >
                      {isCorrect ? <Check size={36} className="text-emerald-500" /> : <X size={36} className="text-rose-500" />}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Short Answers Section */}
      <div className="w-full max-w-5xl bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-700 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h3 className="text-2xl md:text-3xl font-bold text-white">Part 2: Short Answers</h3>
          
          {role === 'teacher' ? (
            <button 
              onClick={handleReveal}
              className="flex items-center gap-2 text-white font-bold bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl transition-colors cursor-pointer w-full md:w-auto justify-center shadow-[0_0_15px_rgba(79,70,229,0.4)]"
            >
              Reveal to Class
              <ChevronDown size={24} className={`transform transition-transform ${showShortAnswers ? 'rotate-180' : ''}`} />
            </button>
          ) : (
            <div className="text-indigo-400 font-medium italic">
              {showShortAnswers ? 'Answers revealed!' : 'Waiting for teacher to reveal...'}
            </div>
          )}
        </div>

        <div className="space-y-6 md:space-y-8">
          <div className="border-b border-slate-800 pb-4 md:pb-6">
            <p className="text-lg md:text-2xl text-slate-300 font-medium mb-3">5. How many minutes early should you arrive at the office?</p>
            {showShortAnswers ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl md:text-3xl font-bold text-emerald-400">
                10 minutes (early)
              </motion.div>
            ) : (
              <div className="h-10 border-b-2 border-dashed border-slate-600 w-2/3 md:w-1/3 bg-slate-800/30 rounded-t-lg"></div>
            )}
          </div>
          
          <div className="border-b border-slate-800 pb-4 md:pb-6">
            <p className="text-lg md:text-2xl text-slate-300 font-medium mb-3">6. Who should you ask for help if you have a problem?</p>
            {showShortAnswers ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl md:text-3xl font-bold text-emerald-400">
                Your (new) colleagues
              </motion.div>
            ) : (
              <div className="h-10 border-b-2 border-dashed border-slate-600 w-2/3 md:w-1/3 bg-slate-800/30 rounded-t-lg"></div>
            )}
          </div>

          <div>
            <p className="text-lg md:text-2xl text-slate-300 font-medium mb-3">7. What two things should you do when your manager is talking?</p>
            {showShortAnswers ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl md:text-3xl font-bold text-emerald-400 flex flex-col md:flex-row gap-4 md:gap-12">
                <span className="flex items-center gap-2"><Check className="text-emerald-500" /> 1. Listen carefully</span>
                <span className="flex items-center gap-2"><Check className="text-emerald-500" /> 2. Take notes</span>
              </motion.div>
            ) : (
              <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                <div className="h-10 border-b-2 border-dashed border-slate-600 w-full md:w-1/3 flex items-end bg-slate-800/30 rounded-t-lg px-2"><span className="text-slate-500 font-mono font-bold mb-1">1.</span></div>
                <div className="h-10 border-b-2 border-dashed border-slate-600 w-full md:w-1/3 flex items-end bg-slate-800/30 rounded-t-lg px-2"><span className="text-slate-500 font-mono font-bold mb-1">2.</span></div>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
