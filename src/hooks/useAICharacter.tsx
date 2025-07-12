/**
 * AI Character Management Hook
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AICharacter, AI_CHARACTERS, DEFAULT_CHARACTER } from '@/data/ai-characters';

interface AICharacterContextType {
  selectedCharacter: AICharacter;
  setSelectedCharacter: (character: AICharacter) => void;
  transformInsight: (originalText: string) => string;
}

const AICharacterContext = createContext<AICharacterContextType | undefined>(undefined);

export const AICharacterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCharacter, setSelectedCharacterState] = useState<AICharacter>(DEFAULT_CHARACTER);

  // Load saved character from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('aiCharacter');
    if (saved) {
      const found = AI_CHARACTERS.find(c => c.id === saved);
      if (found) {
        setSelectedCharacterState(found);
      }
    }
  }, []);

  const setSelectedCharacter = (character: AICharacter) => {
    setSelectedCharacterState(character);
    localStorage.setItem('aiCharacter', character.id);
  };

  const transformInsight = (originalText: string): string => {
    // Transform text based on selected character's style
    return applyCharacterVoice(originalText, selectedCharacter);
  };

  return (
    <AICharacterContext.Provider value={{
      selectedCharacter,
      setSelectedCharacter,
      transformInsight
    }}>
      {children}
    </AICharacterContext.Provider>
  );
};

export const useAICharacter = () => {
  const context = useContext(AICharacterContext);
  if (!context) {
    throw new Error('useAICharacter must be used within an AICharacterProvider');
  }
  return context;
};

// Character voice transformation logic
const applyCharacterVoice = (text: string, character: AICharacter): string => {
  if (!text) return text;

  switch (character.id) {
    case 'shakespeare':
      return transformToShakespeare(text);
    case 'einstein':
      return transformToEinstein(text);
    case 'nasimi':
      return transformToNasimi(text);
    case 'twain':
      return transformToTwain(text);
    case 'minimalist':
      return transformToMinimalist(text);
    case 'zen':
      return transformToZen(text);
    case 'adria':
      return transformToAdria(text);
    case 'coach':
      return transformToCoach(text);
    default:
      return text;
  }
};

// Character-specific transformations
const transformToShakespeare = (text: string): string => {
  return text
    .replace(/you are/gi, 'thou art')
    .replace(/your/gi, 'thy')
    .replace(/you/gi, 'thee')
    .replace(/\bI see\b/gi, 'Methinks I spy')
    .replace(/\bpattern\b/gi, 'tapestry')
    .replace(/\bdata\b/gi, 'chronicles');
};

const transformToEinstein = (text: string): string => {
  return `The data suggests ${text.toLowerCase()}. This correlation presents fascinating implications for understanding the underlying patterns.`;
};

const transformToNasimi = (text: string): string => {
  return `In the sacred dance of thy being, ${text.toLowerCase()}. The beloved whispers through these signs.`;
};

const transformToTwain = (text: string): string => {
  return `Well now, ${text.toLowerCase()}. Ain't that something worth pondering?`;
};

const transformToMinimalist = (text: string): string => {
  // Strip adjectives and keep core meaning
  return text.replace(/\b(very|quite|really|extremely|incredibly)\s+/gi, '').trim();
};

const transformToZen = (text: string): string => {
  return `In this moment, ${text.toLowerCase()}. Let this awareness flow gently through you.`;
};

const transformToAdria = (text: string): string => {
  return `Your heart's journey reveals ${text.toLowerCase()}. Feel the beauty in this recognition.`;
};

const transformToCoach = (text: string): string => {
  return `Great insight! ${text} This shows real progress in your self-awareness. Keep building on this!`;
};
