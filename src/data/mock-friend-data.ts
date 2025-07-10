/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

export interface Friend {
  id: string;
  name: string;
  emoji: string;
  avatarUrl?: string;
  sharedMoments?: number;
  connection?: 'close' | 'regular' | 'distant';
}

export const mockFriends: Friend[] = [
  {
    id: '1',
    name: 'Maya',
    emoji: '🌟',
    sharedMoments: 47,
    connection: 'close'
  },
  {
    id: '2',
    name: 'Alex',
    emoji: '🎨',
    sharedMoments: 23,
    connection: 'regular'
  },
  {
    id: '3',
    name: 'Sam',
    emoji: '🌙',
    sharedMoments: 15,
    connection: 'regular'
  },
  {
    id: '4',
    name: 'River',
    emoji: '🌊',
    sharedMoments: 8,
    connection: 'distant'
  },
  {
    id: '5',
    name: 'Kai',
    emoji: '⚡',
    sharedMoments: 31,
    connection: 'close'
  },
  {
    id: '6',
    name: 'Nova',
    emoji: '✨',
    sharedMoments: 12,
    connection: 'regular'
  }
];