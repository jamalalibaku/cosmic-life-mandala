/**
 * AI Character Quote Library - Dynamic speech bubble content
 */

export interface AIQuote {
  text: string;
  mood: 'reflective' | 'encouraging' | 'humorous' | 'sarcastic' | 'energetic' | 'wise';
}

export const AI_QUOTES: Record<string, AIQuote[]> = {
  shakespeare: [
    { text: "Thy patterns weave a tale most curious, dear soul.", mood: 'reflective' },
    { text: "Methinks the data doth reveal thy hidden truths.", mood: 'wise' },
    { text: "In time's grand tapestry, thou art both thread and weaver.", mood: 'encouraging' },
    { text: "What light through yonder dataset breaks?", mood: 'humorous' },
    { text: "To chart or not to chart, that is the question.", mood: 'reflective' }
  ],

  einstein: [
    { text: "Time is relative, but your procrastination is absolute.", mood: 'humorous' },
    { text: "The most incomprehensible thing about your data is that it's comprehensible.", mood: 'wise' },
    { text: "Imagination is more important than your sleep schedule.", mood: 'encouraging' },
    { text: "God does not play dice, but your mood swings suggest otherwise.", mood: 'sarcastic' },
    { text: "E=mc², but your energy equals coffee squared.", mood: 'humorous' }
  ],

  nasimi: [
    { text: "In thy daily dance, the beloved whispers secrets.", mood: 'wise' },
    { text: "Each moment carries a pearl from the ocean of consciousness.", mood: 'reflective' },
    { text: "The mirror of thy heart reflects infinite patterns.", mood: 'encouraging' },
    { text: "Love flows through thy timeline like wine through crystal.", mood: 'wise' },
    { text: "Thy struggles are the beloved's way of polishing thy soul.", mood: 'encouraging' }
  ],

  twain: [
    { text: "The reports of your productivity's death are greatly exaggerated.", mood: 'humorous' },
    { text: "Habit is habit, and not to be flung out the window by any timeline.", mood: 'wise' },
    { text: "The secret of getting ahead is getting started, partner.", mood: 'encouraging' },
    { text: "Age is an issue of mind over matter. If you don't mind, it doesn't matter.", mood: 'wise' },
    { text: "Kindness is the language the deaf can hear and the algorithms can compute.", mood: 'reflective' }
  ],

  minimalist: [
    { text: "Less noise. More signal.", mood: 'wise' },
    { text: "Essential progress detected.", mood: 'encouraging' },
    { text: "Simplicity speaks volumes.", mood: 'reflective' },
    { text: "Quality over quantity.", mood: 'wise' },
    { text: "Focus. Breathe. Continue.", mood: 'encouraging' }
  ],

  zen: [
    { text: "This moment contains all moments. Rest in its completeness.", mood: 'wise' },
    { text: "Your awareness blooms like a lotus on still water.", mood: 'encouraging' },
    { text: "In stillness, the pattern of all patterns reveals itself.", mood: 'reflective' },
    { text: "Each breath carries the wisdom of acceptance.", mood: 'wise' },
    { text: "The river of time flows through you, not against you.", mood: 'encouraging' }
  ],

  adria: [
    { text: "Your heart's rhythm creates the most beautiful data poetry.", mood: 'encouraging' },
    { text: "I see the golden threads weaving through your journey.", mood: 'wise' },
    { text: "Every moment of tenderness shows in your patterns.", mood: 'reflective' },
    { text: "You're painting your life with such brave strokes.", mood: 'encouraging' },
    { text: "The universe conspires to show you your own magnificence.", mood: 'wise' }
  ],

  coach: [
    { text: "Every setback is a setup for a comeback! You've got this!", mood: 'encouraging' },
    { text: "Progress isn't perfection—it's persistence!", mood: 'wise' },
    { text: "Your commitment to growth is inspiring to witness!", mood: 'encouraging' },
    { text: "Small wins compound into massive transformations!", mood: 'wise' },
    { text: "You're building mental muscle with every conscious choice!", mood: 'encouraging' }
  ],

  angrymother: [
    { text: "Oh brilliant, another all-nighter? Want me to schedule your crash for Thursday?", mood: 'sarcastic' },
    { text: "Lovely darling, skipping meals again? How wonderfully self-destructive.", mood: 'sarcastic' },
    { text: "Well aren't you clever, avoiding that task for the third day running.", mood: 'sarcastic' },
    { text: "How delightful, your sleep pattern looks like abstract art.", mood: 'humorous' },
    { text: "Oh wonderful, procrastination as a lifestyle choice. Bold strategy.", mood: 'sarcastic' }
  ],

  krusty: [
    { text: "HEY HEY KIDS! Your mood just went SUPERSONIC! 🎪", mood: 'energetic' },
    { text: "WOAH-ZA! Time to celebrate with COSMIC CONFETTI! ✨", mood: 'energetic' },
    { text: "CIRCUS ALERT! Your productivity just performed a TRIPLE BACKFLIP!", mood: 'humorous' },
    { text: "PARTY EXPLOSION! Even your stress looks FABULOUS today! 🎊", mood: 'energetic' },
    { text: "WOW-ZA! You're turning life into a RAINBOW TORNADO of awesome!", mood: 'humorous' }
  ],

  eminem: [
    { text: "Your hustle's tight, your grind's on sight — that's the vibe that makes you bright!", mood: 'energetic' },
    { text: "Mood swings like a pendulum's flow, but your spirit's got that inner glow!", mood: 'encouraging' },
    { text: "Stress hits hard but you bounce right back — resilience is your strongest track!", mood: 'encouraging' },
    { text: "Time ticks by but you stay on beat — your rhythm makes life complete!", mood: 'wise' },
    { text: "Progress ain't perfect but you keep it real — that's the power in how you feel!", mood: 'encouraging' }
  ]
};

export const getRandomQuote = (characterId: string): AIQuote => {
  const quotes = AI_QUOTES[characterId] || AI_QUOTES.shakespeare;
  return quotes[Math.floor(Math.random() * quotes.length)];
};

export const getQuotesByMood = (characterId: string, mood: AIQuote['mood']): AIQuote[] => {
  const quotes = AI_QUOTES[characterId] || AI_QUOTES.shakespeare;
  return quotes.filter(quote => quote.mood === mood);
};