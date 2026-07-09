import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MessageCircle, Lightbulb, Users, Clock } from 'lucide-react';

export default function Slide5Speaking() {
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const startTimer = () => setIsTimerRunning(true);
  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimeLeft(120);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-8 bg-gradient-to-br from-slate-900 to-indigo-950 text-white relative overflow-hidden">
      
      {/* Background circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      <motion.div 
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="z-10 flex flex-col items-center w-full max-w-5xl"
      >
        <div className="flex items-center gap-4 mb-4 text-indigo-400">
          <Users size={40} />
          <h2 className="text-3xl font-bold uppercase tracking-widest">Speaking Practice</h2>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-16 text-center leading-tight">
          What is the <span className="text-rose-400">most important</span> tip?
        </h1>

        <div className="bg-white/10 p-10 rounded-3xl backdrop-blur-lg border border-white/20 w-full mb-12 shadow-2xl relative">
          <div className="absolute -top-8 -right-8 bg-amber-400 text-amber-900 p-4 rounded-full shadow-lg transform rotate-12">
            <Lightbulb size={48} />
          </div>
          <h3 className="text-3xl font-medium mb-6 flex items-center gap-4">
            <MessageCircle className="text-indigo-400" size={36} />
            Discuss with your group (3 people):
          </h3>
          <ul className="text-2xl space-y-6 text-indigo-100 ml-12 list-disc list-outside">
            <li>Which of the 4 tips is the most helpful for you?</li>
            <li>Can you give <strong className="text-white bg-indigo-500/30 px-3 py-1 rounded">ONE MORE</strong> good tip for the first day at work?</li>
          </ul>
        </div>

        {/* Timer Controls */}
        <div className="flex items-center gap-8 bg-slate-900/80 p-4 px-8 rounded-full border border-slate-700">
          <div className="flex items-center gap-3 text-4xl font-mono font-bold text-emerald-400">
            <Clock size={36} />
            {formatTime(timeLeft)}
          </div>
          
          <div className="h-10 w-px bg-slate-700"></div>
          
          <div className="flex gap-4">
            <button 
              onClick={startTimer}
              disabled={isTimerRunning || timeLeft === 0}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-3 px-8 rounded-full transition-all cursor-pointer"
            >
              Start (2 Mins)
            </button>
            <button 
              onClick={resetTimer}
              className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-full transition-all cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
