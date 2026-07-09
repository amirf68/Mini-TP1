export type SlidePhase = 'Lead-in' | 'Vocabulary' | 'Gist (Task A)' | 'Detail (Task B)' | 'Speaking' | 'Plan B (Hot Seat)';

export interface TeacherNotes {
  phase: SlidePhase;
  timeAllocation: string;
  script: string;
  action: string;
  ccqs?: { word: string; questions: string[] }[];
  icqs?: string[];
}

export interface VocabWord {
  id: string;
  word: string;
  definition: string;
  emoji: string;
}

