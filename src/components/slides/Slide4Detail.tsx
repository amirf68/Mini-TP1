import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, X, FileText, ChevronDown } from 'lucide-react';

export default function Slide4Detail() {
  const [answers, setAnswers] = useState<Record<number, boolean | null>>({});
  const [showShortAnswers, setShowShortAnswers] = useState(false);

  const tfQuestions = [
    { id: 1, text: 'It is a good idea to arrive exactly on time, not early.', isTrue: false },
    { id: 2, text: 'You should say "Good morning" to people in the office.', isTrue: true },
    { id: 3, text: 'Your colleagues are the people who work with you.', isTrue: true },
    { id: 4, text: 'You should not ask questions if you have a problem.', isTrue: false },
  ];

  const handleAnswer = (id: number, answer: boolean) => {
    setAnswers(prev => ({ ...prev, [id]: answer }));
  };

  return (
    <div className="flex flex-col items-center h-full w-full p-8 bg-slate-50 overflow-y-auto">
      
      <div className="w-full max-w-5xl mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold text-slate-800 mb-2 flex items-center gap-3">
            <FileText className="text-indigo-600" />
            Task B: Reading for Detail
          </h2>
          <p className="text-xl text-slate-500">Are these sentences True (T) or False (F)?</p>
        </div>
      </div>

      <div className="w-full max-w-5xl space-y-4 mb-12">
        {tfQuestions.map((q) => {
          const userAnswer = answers[q.id];
          const isCorrect = userAnswer === q.isTrue;
          const hasAnswered = userAnswer !== undefined;

          return (
            <motion.div 
              key={q.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-6 rounded-2xl border-2 flex items-center justify-between transition-colors
                ${hasAnswered 
                  ? (isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200') 
                  : 'bg-white border-slate-200 shadow-sm'}`}
            >
              <div className="text-2xl font-medium text-slate-700 flex-1 pr-8">
                {q.id}. {q.text}
              </div>
              
              <div className="flex items-center gap-4 shrink-0">
                <button
                  onClick={() => handleAnswer(q.id, true)}
                  className={`px-6 py-3 rounded-xl font-bold text-xl transition-all cursor-pointer border-2
                    ${userAnswer === true 
                      ? (isCorrect ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-rose-500 text-white border-rose-600')
                      : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'}`}
                >
                  TRUE
                </button>
                <button
                  onClick={() => handleAnswer(q.id, false)}
                  className={`px-6 py-3 rounded-xl font-bold text-xl transition-all cursor-pointer border-2
                    ${userAnswer === false 
                      ? (isCorrect ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-rose-500 text-white border-rose-600')
                      : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'}`}
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
      <div className="w-full max-w-5xl bg-white p-8 rounded-3xl border border-slate-200 shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-slate-800">Part 2: Short Answers</h3>
          <button 
            onClick={() => setShowShortAnswers(!showShortAnswers)}
            className="flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-800 transition-colors cursor-pointer bg-indigo-50 px-4 py-2 rounded-lg"
          >
            {showShortAnswers ? 'Hide Answers' : 'Reveal Answers'}
            <ChevronDown size={20} className={`transform transition-transform ${showShortAnswers ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <p className="text-xl text-slate-700 font-medium mb-2">5. How many minutes early should you arrive at the office?</p>
            {showShortAnswers ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-bold text-indigo-600">
                10 minutes (early)
              </motion.div>
            ) : (
              <div className="h-8 border-b-2 border-dashed border-slate-300 w-1/3"></div>
            )}
          </div>
          
          <div className="border-b border-slate-100 pb-4">
            <p className="text-xl text-slate-700 font-medium mb-2">6. Who should you ask for help if you have a problem?</p>
            {showShortAnswers ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-bold text-indigo-600">
                Your (new) colleagues
              </motion.div>
            ) : (
              <div className="h-8 border-b-2 border-dashed border-slate-300 w-1/3"></div>
            )}
          </div>

          <div>
            <p className="text-xl text-slate-700 font-medium mb-2">7. What two things should you do when your manager is talking?</p>
            {showShortAnswers ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-bold text-indigo-600 flex gap-8">
                <span>1. Listen carefully</span>
                <span>2. Take notes</span>
              </motion.div>
            ) : (
              <div className="flex gap-8">
                <div className="h-8 border-b-2 border-dashed border-slate-300 w-1/3 flex items-end"><span className="text-slate-400 font-mono mr-2">1.</span></div>
                <div className="h-8 border-b-2 border-dashed border-slate-300 w-1/3 flex items-end"><span className="text-slate-400 font-mono mr-2">2.</span></div>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
