import { motion } from 'motion/react';
import { Users, AlertCircle, UploadCloud } from 'lucide-react';

export default function Slide1LeadIn() {
  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full bg-slate-950 overflow-hidden">
      
      {/* Title Area */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 bg-slate-900/80 backdrop-blur-md px-10 py-4 rounded-3xl border border-slate-700 mb-6 flex flex-col items-center shadow-2xl mt-8"
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
        className="relative z-20 w-full max-w-5xl h-[60vh] rounded-2xl overflow-hidden border-4 border-slate-700 shadow-2xl flex items-center justify-center bg-slate-800"
      >
        {/* We use the user's uploaded image here. Instructions provided to user. */}
        <img 
          src="https://uploadkon.ir/uploads/440009_26ChatGPT-Image-Jul-9-2026-04-13-12-PM.png" 
          alt="Office workers showing different emotions" 
          className="w-full h-full object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.nextElementSibling?.classList.remove('hidden');
          }}
        />
        
        {/* Fallback state when image is missing */}
        <div className="hidden absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-slate-800/90 backdrop-blur-sm p-8 text-center">
          <UploadCloud size={64} className="mb-4 text-indigo-400" />
          <h3 className="text-2xl font-bold text-white mb-2">Image Not Found</h3>
          <p className="text-lg">Please upload your image to the <code className="bg-slate-900 px-2 py-1 rounded text-indigo-300">public/</code> folder</p>
          <p className="text-lg">and name it <code className="bg-slate-900 px-2 py-1 rounded text-rose-300">office-emotions.png</code> (or .jpg, then update code).</p>
        </div>
      </motion.div>

      {/* Prompt / Discussion starter */}
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
    </div>
  );
}
