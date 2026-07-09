import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MessageCircle, Lightbulb, Users, Clock } from 'lucide-react';
import { useSocket } from '../../SocketContext';

export default function Slide5Speaking() {
  const { role, triggerEvent, roomEvent } = useSocket();
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    if (roomEvent?.eventName === 'startSpeakingTimer') {
      setIsTimerRunning(true);
    } else if (roomEvent?.eventName === 'resetSpeakingTimer') {
      setIsTimerRunning(false);
      setTimeLeft(120);
    }
  }, [roomEvent]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleStartTimer = () => {
    if (role === 'teacher') triggerEvent('startSpeakingTimer');
  };
  
  const handleResetTimer = () => {
    if (role === 'teacher') triggerEvent('resetSpeakingTimer');
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 md:p-8 bg-gradient-to-br from-slate-900 to-indigo-950 text-white relative overflow-hidden pb-32">
      
      {/* Background circles */}
      <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-indigo-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-rose-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      <motion.div 
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="z-10 flex flex-col items-center w-full max-w-5xl"
      >
        <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-4 text-indigo-400 mt-4">
          <Users size={32} className="md:w-10 md:h-10" />
          <h2 className="text-xl md:text-3xl font-bold uppercase tracking-widest">Speaking Practice</h2>
        </div>
        
        <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold mb-8 md:mb-16 text-center leading-tight">
          What is the <span className="text-rose-400">most important</span> tip?
        </h1>

        <div className="bg-white/10 p-6 md:p-10 rounded-3xl backdrop-blur-lg border border-white/20 w-full mb-8 md:mb-12 shadow-2xl relative">
          <div className="absolute -top-6 -right-4 md:-top-8 md:-right-8 bg-amber-400 text-amber-900 p-3 md:p-4 rounded-full shadow-lg transform rotate-12">
            <Lightbulb size={32} className="md:w-12 md:h-12" />
          </div>
          <h3 className="text-xl md:text-3xl font-medium mb-4 md:mb-6 flex items-center gap-3 md:gap-4">
            <MessageCircle className="text-indigo-400" size={28} />
            Discuss with your group:
          </h3>
          <ul className="text-lg md:text-2xl space-y-4 md:space-y-6 text-indigo-100 ml-6 md:ml-12 list-disc list-outside">
            <li>Which of the 4 tips is the most helpful for you?</li>
            <li>Can you give <strong className="text-white bg-indigo-500/30 px-2 py-1 rounded">ONE MORE</strong> good tip for the first day at work?</li>
          </ul>
        </div>

        {/* Timer Controls */}
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 bg-slate-900/80 p-4 md:px-8 rounded-3xl md:rounded-full border border-slate-700 w-full md:w-auto">
          <div className={`flex items-center gap-3 text-5xl md:text-4xl font-mono font-bold transition-colors ${timeLeft <= 10 && isTimerRunning ? 'text-rose-500 animate-pulse' : 'text-emerald-400'}`}>
            <Clock size={40} className="md:w-9 md:h-9" />
            {formatTime(timeLeft)}
          </div>
          
          {role === 'teacher' ? (
            <>
              <div className="hidden md:block h-10 w-px bg-slate-700"></div>
              <div className="flex w-full md:w-auto gap-4">
                <button 
                  onClick={handleStartTimer}
                  disabled={isTimerRunning || timeLeft === 0}
                  className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-3 px-6 md:px-8 rounded-full transition-all cursor-pointer shadow-lg"
                >
                  Start (2 Mins)
                </button>
                <button 
                  onClick={handleResetTimer}
                  className="flex-1 md:flex-none bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-full transition-all cursor-pointer shadow-lg"
                >
                  Reset
                </button>
              </div>
            </>
          ) : (
            <div className="text-slate-400 font-medium italic mt-2 md:mt-0 text-center">
              {isTimerRunning ? 'Discussing now!' : 'Waiting for teacher to start timer...'}
            </div>
          )}
        </div>

      </motion.div>
    </div>
  );
}
