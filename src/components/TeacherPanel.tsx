import { CheckCircle2, MessageSquare, Play, HelpCircle, Clock } from 'lucide-react';
import { TeacherNotes } from '../types';

interface TeacherPanelProps {
  notes: TeacherNotes;
  isOpen: boolean;
  onToggle: () => void;
}

export default function TeacherPanel({ notes, isOpen, onToggle }: TeacherPanelProps) {
  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed top-4 right-4 z-50 bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium border-2 border-indigo-400"
      >
        <CheckCircle2 size={18} />
        CELTA Assessor View
      </button>
    );
  }

  return (
    <div className="fixed top-0 right-0 w-80 h-full bg-slate-900 text-slate-100 shadow-2xl z-50 overflow-y-auto border-l border-slate-700 flex flex-col">
      <div className="p-4 bg-slate-800 flex justify-between items-center sticky top-0 border-b border-slate-700 z-10">
        <h2 className="font-bold text-lg text-indigo-400">Teacher Notes</h2>
        <button
          onClick={onToggle}
          className="text-slate-400 hover:text-white transition-colors text-sm underline"
        >
          Close
        </button>
      </div>

      <div className="p-5 flex-1 space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Stage</span>
          <h3 className="text-xl font-semibold text-white">{notes.phase}</h3>
          <div className="flex items-center gap-2 mt-2 text-rose-400 bg-rose-900/30 w-fit px-3 py-1 rounded-full text-sm font-medium border border-rose-500/20">
            <Clock size={14} /> Time: {notes.timeAllocation}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="flex items-center gap-2 text-indigo-400 font-medium">
            <MessageSquare size={16} /> Script (TTT Minimal)
          </h4>
          <p className="bg-slate-800 p-3 rounded-lg text-sm border-l-2 border-indigo-500 italic text-slate-300 leading-relaxed">
            "{notes.script}"
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="flex items-center gap-2 text-emerald-400 font-medium">
            <Play size={16} /> Teacher Action
          </h4>
          <p className="text-sm text-slate-300 bg-slate-800/50 p-3 rounded-lg border border-slate-700 leading-relaxed">
            {notes.action}
          </p>
        </div>

        {notes.icqs && notes.icqs.length > 0 && (
          <div className="space-y-3">
            <h4 className="flex items-center gap-2 text-amber-400 font-medium">
              <HelpCircle size={16} /> ICQs
            </h4>
            <ul className="space-y-2">
              {notes.icqs.map((icq, idx) => (
                <li key={idx} className="text-sm bg-amber-500/10 text-amber-200 p-2 rounded border border-amber-500/20">
                  {icq}
                </li>
              ))}
            </ul>
          </div>
        )}

        {notes.ccqs && notes.ccqs.length > 0 && (
          <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-pink-400 font-medium">
              <HelpCircle size={16} /> CCQs (Target Vocab)
            </h4>
            {notes.ccqs.map((ccq, idx) => (
              <div key={idx} className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                <div className="font-bold text-pink-300 mb-1">{ccq.word}</div>
                <ul className="space-y-1 list-disc list-inside text-sm text-slate-300">
                  {ccq.questions.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
