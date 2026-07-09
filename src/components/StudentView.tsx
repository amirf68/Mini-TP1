import { motion, AnimatePresence } from 'motion/react';
import { useSocket } from '../SocketContext';
import Slide1LeadIn from './slides/Slide1LeadIn';
import Slide2Vocab from './slides/Slide2Vocab';
import Slide3Gist from './slides/Slide3Gist';
import Slide4Detail from './slides/Slide4Detail';
import Slide5Speaking from './slides/Slide5Speaking';
import Slide6PlanB from './slides/Slide6PlanB';

export default function StudentView() {
  const { state, role } = useSocket();

  const renderSlide = () => {
    switch (state.currentSlide) {
      case 1: return <Slide1LeadIn />;
      case 2: return <Slide2Vocab />;
      case 3: return <Slide3Gist />;
      case 4: return <Slide4Detail />;
      case 5: return <Slide5Speaking />;
      case 6: return <Slide6PlanB />;
      default: return <Slide1LeadIn />;
    }
  };

  if (role !== 'student') {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950 text-white">
        <p>Please log in first.</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-slate-950 overflow-hidden font-sans">
      {/* Main Slide Area */}
      <div className="relative flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={state.currentSlide}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full"
          >
            {renderSlide()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
