import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Slide1LeadIn from './slides/Slide1LeadIn';
import Slide2Vocab from './slides/Slide2Vocab';
import Slide3Gist from './slides/Slide3Gist';
import Slide4Detail from './slides/Slide4Detail';
import Slide5Speaking from './slides/Slide5Speaking';
import Slide6PlanB from './slides/Slide6PlanB';
import TeacherPanel from './TeacherPanel';
import { teacherData } from '../data';
import { ChevronLeft, ChevronRight, Presentation as PresentationIcon, Clock } from 'lucide-react';

export default function Presentation() {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isTeacherPanelOpen, setIsTeacherPanelOpen] = useState(false);
  
  // Global 15-minute Teacher Timer
  const [globalTimeLeft, setGlobalTimeLeft] = useState(15 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setGlobalTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const totalSlides = 6;

  const nextSlide = () => {
    if (currentSlide < totalSlides) setCurrentSlide(curr => curr + 1);
  };

  const prevSlide = () => {
    if (currentSlide > 1) setCurrentSlide(curr => curr - 1);
  };

  const toggleTeacherPanel = () => {
    setIsTeacherPanelOpen(!isTeacherPanelOpen);
  };

  const renderSlide = () => {
    switch (currentSlide) {
      case 1: return <Slide1LeadIn />;
      case 2: return <Slide2Vocab />;
      case 3: return <Slide3Gist />;
      case 4: return <Slide4Detail />;
      case 5: return <Slide5Speaking />;
      case 6: return <Slide6PlanB />;
      default: return <Slide1LeadIn />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-black overflow-hidden font-sans">
      
      {/* Small Global Timer (Top Left) */}
      <div className="absolute top-4 left-4 z-50 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-700/50 shadow-lg text-slate-300">
        <Clock size={16} className={globalTimeLeft < 180 ? "text-rose-500 animate-pulse" : "text-emerald-400"} />
        <span className={`font-mono font-bold ${globalTimeLeft < 180 ? 'text-rose-400' : 'text-white'}`}>
          {formatTime(globalTimeLeft)}
        </span>
        <span className="text-xs text-slate-400 ml-1">Mini-TP Left</span>
      </div>

      {/* Main Slide Area */}
      <div className={`relative flex-1 transition-all duration-300 ${isTeacherPanelOpen ? 'mr-80' : 'mr-0'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            {renderSlide()}
          </motion.div>
        </AnimatePresence>

        {/* Presentation Controls */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-slate-900/80 backdrop-blur-md px-6 py-3 rounded-full shadow-2xl border border-slate-700/50 z-40">
          <button 
            onClick={prevSlide}
            disabled={currentSlide === 1}
            className="text-white disabled:opacity-30 hover:text-indigo-400 transition-colors p-2 cursor-pointer"
          >
            <ChevronLeft size={28} />
          </button>
          
          <div className="text-white font-medium flex items-center gap-4 text-sm tracking-wider uppercase px-4">
            <div className="flex items-center gap-2">
              <PresentationIcon size={16} className="text-indigo-400" />
              Slide {currentSlide} of {totalSlides}
            </div>
            <div className="w-px h-4 bg-slate-600"></div>
            <div className="flex items-center gap-2 text-rose-300">
              <Clock size={16} />
              Target: {teacherData[currentSlide]?.timeAllocation || '2 mins'}
            </div>
          </div>

          <button 
            onClick={nextSlide}
            disabled={currentSlide === totalSlides}
            className="text-white disabled:opacity-30 hover:text-indigo-400 transition-colors p-2 cursor-pointer"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      </div>

      {/* Teacher Panel */}
      <TeacherPanel 
        notes={teacherData[currentSlide]} 
        isOpen={isTeacherPanelOpen} 
        onToggle={toggleTeacherPanel} 
      />

    </div>
  );
}
