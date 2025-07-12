/**
 * AI Character Menu - Phase 11: Personalized Voice & Character Engine
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Sparkles, Check } from 'lucide-react';
import { useAICharacter } from '@/hooks/useAICharacter';
import { AI_CHARACTERS, AICharacter } from '@/data/ai-characters';

interface AICharacterMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AICharacterMenu: React.FC<AICharacterMenuProps> = ({ isOpen, onClose }) => {
  const { selectedCharacter, setSelectedCharacter } = useAICharacter();
  const [previewCharacter, setPreviewCharacter] = useState<AICharacter | null>(null);

  const handleCharacterSelect = (character: AICharacter) => {
    setSelectedCharacter(character);
    // Brief delay before closing to show selection
    setTimeout(onClose, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Menu Panel */}
          <motion.div
            className="relative bg-gradient-to-br from-background/95 to-background/90 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 20 }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                className="inline-flex items-center gap-3 mb-4"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Bot className="w-8 h-8 text-primary" />
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Choose Your AI Companion
                </h2>
                <Sparkles className="w-8 h-8 text-primary" />
              </motion.div>
              <p className="text-muted-foreground text-lg">
                Select a voice and personality for your cosmic journey
              </p>
            </div>

            {/* Character Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {AI_CHARACTERS.map((character, index) => (
                <motion.div
                  key={character.id}
                  className={`relative p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer group ${
                    selectedCharacter.id === character.id
                      ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                      : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
                  }`}
                  style={{
                    boxShadow: selectedCharacter.id === character.id
                      ? `0 0 30px hsl(${character.color} / 0.3)`
                      : undefined
                  }}
                  onClick={() => handleCharacterSelect(character)}
                  onMouseEnter={() => setPreviewCharacter(character)}
                  onMouseLeave={() => setPreviewCharacter(null)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Selection indicator */}
                  {selectedCharacter.id === character.id && (
                    <motion.div
                      className="absolute top-3 right-3"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 15 }}
                    >
                      <Check className="w-5 h-5 text-primary" />
                    </motion.div>
                  )}

                  {/* Character orb */}
                  <motion.div
                    className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white"
                    style={{
                      background: `linear-gradient(135deg, hsl(${character.color}), hsl(${character.color} / 0.8))`,
                      boxShadow: `0 4px 20px hsl(${character.color} / 0.4)`
                    }}
                    animate={{
                      boxShadow: previewCharacter?.id === character.id
                        ? `0 8px 30px hsl(${character.color} / 0.6)`
                        : `0 4px 20px hsl(${character.color} / 0.4)`
                    }}
                  >
                    {character.name.charAt(0)}
                  </motion.div>

                  {/* Character info */}
                  <h3 className="text-xl font-bold text-center mb-2">{character.name}</h3>
                  <p className="text-sm text-muted-foreground text-center mb-3">
                    {character.description}
                  </p>
                  
                  {/* Sample phrase */}
                  <div className="text-xs text-center p-2 bg-white/5 rounded-lg italic">
                    "{character.samplePhrase}"
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Preview area */}
            <AnimatePresence>
              {previewCharacter && (
                <motion.div
                  className="p-6 bg-white/5 rounded-2xl border border-white/20"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <h4 className="text-lg font-semibold mb-2">{previewCharacter.name} Preview</h4>
                  <p className="text-sm text-muted-foreground mb-3">{previewCharacter.tone}</p>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-primary">Vocabulary:</span> {previewCharacter.style.vocabulary}
                    </div>
                    <div>
                      <span className="text-primary">Rhythm:</span> {previewCharacter.style.rhythm}
                    </div>
                    <div>
                      <span className="text-primary">Formality:</span> {previewCharacter.style.formality}
                    </div>
                    <div>
                      <span className="text-primary">Emotion:</span> {previewCharacter.style.emotion}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Close button */}
            <div className="flex justify-center mt-8">
              <motion.button
                onClick={onClose}
                className="px-6 py-3 bg-primary/20 hover:bg-primary/30 border border-primary/40 rounded-xl text-primary font-medium transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};