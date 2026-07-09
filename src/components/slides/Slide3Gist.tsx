import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { readingText } from '../../data';
import { Timer, EyeOff, BookOpen, Check, X } from 'lucide-react';
import { useSocket } from '../../SocketContext';
import confetti from 'canvas-confetti';

export default function Slide3Gist() {
  const { role, triggerEvent, roomEvent, submitAnswer } = useSocket();
  const [isReading, setIsReading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timeUp, setTimeUp] = useState(false);
  
  // Task A state
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);

  const titles = [
    { id: 'a', text: 'How to find a good job in a new city', correct: false },
    { id: 'b', text: 'Good advice for your first day at work', correct: true },
    { id: 'c', text: 'Why working in an office is a bad idea', correct: false },
  ];

  useEffect(() => {
    if (roomEvent?.eventName === 'startReading') {
      startReadingLocal();
    }
  }, [roomEvent]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isReading && timeLeft > 0) {
      
      // Simple tick sound
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(timeLeft <= 10 ? 800 : 400, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.1);
      } catch(e) {
        // ignore audio errors
      }

      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isReading) {
      setIsReading(false);
      setTimeUp(true);
      
      // Alarm sound
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime + 0.2);
        oscillator.frequency.setValueAtTime(600, audioCtx.currentTime + 0.4);
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 1);
      } catch(e) {}
    }
    return () => clearInterval(timer);
  }, [isReading, timeLeft]);

  const startReadingLocal = () => {
    setIsReading(true);
    setTimeUp(false);
    setTimeLeft(60);
    setSelectedTitle(null);
  };

  const handleTeacherStart = () => {
    triggerEvent('startReading');
  };

  const handleTitleSelect = (titleId: string) => {
    if (selectedTitle || role !== 'student') return;
    
    setSelectedTitle(titleId);
    submitAnswer({ selectedTitle: titleId });
    
    const correct = titles.find(t => t.id === titleId)?.correct;
    if (correct) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.7 } });
    }
  };

  return (
    <div className="flex flex-col items-center h-full w-full p-4 md:p-8 bg-slate-900 text-slate-100 overflow-hidden relative">
      
      {/* Header bar with Timer */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-4 md:mb-8 bg-slate-800 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-700 shadow-xl z-20">
        <div>
          <h2 className="text-xl md:text-3xl font-bold text-white mb-1">Task A: Gist Reading</h2>
          <p className="text-slate-400 text-sm md:text-lg">Skim the text. Don't read every word.</p>
        </div>
        
        <div className={`flex items-center gap-2 md:gap-4 px-4 md:px-8 py-2 md:py-4 rounded-xl md:rounded-2xl font-mono text-3xl md:text-5xl font-bold transition-colors
          ${timeLeft <= 10 && isReading ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-900 text-indigo-400'}`}>
          <Timer size={30} className={`md:w-10 md:h-10 ${timeLeft <= 10 && isReading ? 'animate-pulse text-rose-500' : ''}`} />
          00:{timeLeft.toString().padStart(2, '0')}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-5xl relative flex items-center justify-center">
        
        {!isReading && !timeUp && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center z-30 px-4 w-full"
          >
            <div className="bg-slate-800/80 p-8 md:p-12 rounded-3xl backdrop-blur-sm border border-slate-700 flex flex-col items-center text-center max-w-2xl shadow-2xl w-full">
              <EyeOff size={60} className="text-slate-500 mb-6 md:w-20 md:h-20" />
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">Text is hidden</h3>
              <p className="text-lg md:text-xl text-slate-400 mb-8">Listen to your teacher before reading.</p>
              
              {role === 'teacher' ? (
                <button 
                  onClick={handleTeacherStart}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xl md:text-2xl font-bold py-4 px-8 md:px-12 rounded-full shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all hover:scale-105 active:scale-95 flex items-center gap-3 cursor-pointer w-full justify-center"
                >
                  <BookOpen size={28} /> Start Timer For Class
                </button>
              ) : (
                <div className="bg-slate-900/50 text-slate-300 font-bold py-4 px-8 rounded-full border border-slate-700 text-center w-full">
                  Waiting for teacher to start...
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Text Container with Blur transition */}
        <motion.div 
          initial={false}
          animate={{ 
            filter: timeUp ? 'blur(12px)' : (isReading ? 'blur(0px)' : 'blur(20px)'),
            opacity: (!isReading && !timeUp) ? 0.2 : 1
          }}
          transition={{ duration: 1 }}
          className="w-full h-full bg-slate-50 text-slate-900 p-6 md:p-10 rounded-3xl shadow-2xl absolute inset-0 overflow-y-auto font-sans text-xl md:text-2xl leading-relaxed border-4 border-indigo-500 pointer-events-none pb-24"
        >
          {readingText.split('\n\n').map((paragraph, i) => (
            <p key={i} className="mb-6">{paragraph}</p>
          ))}
        </motion.div>

        {/* Task A Questions overlay when time is up */}
        <AnimatePresence>
          {timeUp && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute inset-0 z-30 flex items-center justify-center p-4 md:p-8"
            >
              <div className="bg-slate-900/95 p-6 md:p-12 rounded-3xl backdrop-blur-md border border-slate-700 w-full max-w-4xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-y-auto max-h-full">
                <div className="flex items-center gap-4 mb-6 md:mb-8 justify-center">
                  <Timer size={40} className="text-rose-500 md:w-12 md:h-12" />
                  <h3 className="text-3xl md:text-4xl font-bold text-white text-center">Time's Up!</h3>
                </div>
                
                <h4 className="text-xl md:text-3xl text-indigo-300 font-medium mb-6 md:mb-8 text-center leading-snug">What is the BEST title for the text?</h4>
                
                <div className="space-y-4">
                  {titles.map((title) => {
                    const isSelected = selectedTitle === title.id;
                    let btnClass = "bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700";
                    let icon = null;

                    if (isSelected) {
                      if (title.correct) {
                        btnClass = "bg-emerald-900/50 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500";
                        icon = <Check size={28} className="text-emerald-400 ml-auto flex-shrink-0" />;
                      } else {
                        btnClass = "bg-rose-900/50 border-rose-500 text-rose-300 ring-2 ring-rose-500";
                        icon = <X size={28} className="text-rose-400 ml-auto flex-shrink-0" />;
                      }
                    }

                    return (
                      <motion.button
                        key={title.id}
                        onClick={() => handleTitleSelect(title.id)}
                        whileHover={!isSelected && role === 'student' ? { scale: 1.02 } : {}}
                        whileTap={!isSelected && role === 'student' ? { scale: 0.98 } : {}}
                        animate={isSelected && !title.correct ? { x: [-10, 10, -10, 10, 0] } : {}}
                        transition={isSelected && !title.correct ? { duration: 0.4 } : {}}
                        className={`w-full text-left p-4 md:p-6 rounded-2xl border-2 text-lg md:text-2xl font-medium transition-all flex items-center gap-3 md:gap-4 ${role === 'student' ? 'cursor-pointer' : 'cursor-default'} ${btnClass}`}
                      >
                        <span className="font-bold text-slate-500 uppercase flex-shrink-0">{title.id})</span>
                        <span className="leading-tight">{title.text}</span>
                        {icon}
                      </motion.button>
                    );
                  })}
                </div>
                
                {selectedTitle && titles.find(t => t.id === selectedTitle)?.correct && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-6 md:mt-8 text-center text-emerald-400 font-bold text-xl md:text-2xl flex items-center justify-center gap-2"
                  >
                    <Check size={28} /> Correct! It gives tips/advice.
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
