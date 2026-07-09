import { TeacherNotes, VocabWord } from './types';

export const vocabData: VocabWord[] = [
  {
    id: 'survive',
    word: 'Survive',
    definition: 'To live through a difficult situation.',
    emoji: '🧗‍♂️',
  },
  {
    id: 'colleague',
    word: 'Colleague',
    definition: 'A person you work with.',
    emoji: '🤝',
  },
  {
    id: 'punctual',
    word: 'Punctual',
    definition: 'Arriving at the correct time; not late.',
    emoji: '⏱️',
  },
  {
    id: 'polite',
    word: 'Polite',
    definition: 'Having good manners and showing respect.',
    emoji: '🎩',
  },
];

export const teacherData: Record<number, TeacherNotes> = {
  1: {
    phase: 'Lead-in',
    timeAllocation: '2 mins',
    action: 'Display slide. Gesturing open hands to students, then pairing them up (pointing to pairs). Click the emotions to show interactions.',
    script: "Look at the screen. First day of work! Partner A, Partner B. How do they feel? Have you felt like this? You have 1 minute. Go.",
    ccqs: []
  },
  2: {
    phase: 'Vocabulary',
    timeAllocation: '4 mins',
    action: 'Click to select a word, then click a definition to match. Invite students to the smartboard or have them shout out the color/number.',
    script: "Match the words to the pictures and meanings. Work with your partner. 3 minutes.",
    ccqs: [
      { word: 'Survive', questions: ['Is the situation easy? (No)', 'Are you okay at the end? (Yes)'] },
      { word: 'Colleague', questions: ['Is this your mother or sister? (No)', 'Do you work in the same office? (Yes)'] },
      { word: 'Punctual', questions: ['Work starts at 9:00. You arrive at 8:55. Are you punctual? (Yes)', 'You arrive at 9:15. Are you punctual? (No)'] },
      { word: 'Polite', questions: ["Saying 'Give me coffee!' - is that polite? (No)", "Saying 'Could I have coffee, please?' - is that polite? (Yes)"] }
    ]
  },
  3: {
    phase: 'Gist (Task A)',
    timeAllocation: '3 mins',
    action: 'Show the timer. Start the timer when they confirm ICQs. After 1 minute, the text blurs and title options appear. Elicit the best title.',
    script: "Read the text quickly. Don't worry about new words. Find the best title. You have 1 minute. Go.",
    icqs: [
      "Are we reading slowly? (No)",
      "Are we reading every word? (No)",
      "How much time do we have? (1 minute)",
      "What are we looking for? (The best title)"
    ]
  },
  4: {
    phase: 'Detail (Task B)',
    timeAllocation: '4 mins',
    action: 'Hand out worksheet. Click the T/F buttons on the board to check answers interactively after they finish reading.',
    script: "Now read carefully. Answer the True/False questions on your paper. 3 minutes. Then check with your partner.",
    icqs: [
      "Do you work with your partner first or alone? (Alone)",
      "What do you do after you finish? (Check with my partner)"
    ]
  },
  5: {
    phase: 'Speaking',
    timeAllocation: '2 mins',
    action: 'Put students in groups of 3. Give them 30 seconds to think silently, then 1.5 minutes to speak.',
    script: "Work in groups of three. Which tip is the most important? Can you give ONE more tip? Discuss.",
    icqs: [
      "How many people in a group? (Three)",
      "Are you writing or speaking? (Speaking)"
    ]
  },
  6: {
    phase: 'Plan B (Hot Seat)',
    timeAllocation: 'Extra Time',
    action: 'Place a chair at the front facing the class. Use the interactive spinner on screen. Class shouts clues.',
    script: "Let's play Hot Seat! One person sits here. The screen shows a word. You CANNOT say the word and you CANNOT speak Farsi. The class explains the word. Go!",
    icqs: [
      "Can you say the word on the board? (No!)",
      "Can you use Farsi? (No!)",
      "Can you use your hands? (Yes!)"
    ]
  }
};

export const readingText = `Welcome to your first day at the new office! It is normal to feel nervous and stressed. But do not worry; here are some easy tips to help you survive and have a great first day.

First, always be punctual. Do not arrive late. It is a good idea to leave your house early and arrive at the office 10 minutes before work starts.

Second, be polite to everyone. Smile and say "Good morning" when you walk into the office. People like friendly workers.

Third, try to learn the names of your new colleagues. They are the people you will work with every day. If you have a question or a problem, do not be shy. Ask them for help.

Finally, listen carefully to your manager and take notes. You will learn a lot of new things today.

Good luck!`;
