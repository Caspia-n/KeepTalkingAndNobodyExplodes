import { BombState, SavedBomb } from '@/types/bomb';

const CURRENT_BOMB_KEY = 'ktane_current_bomb';
const SAVED_BOMBS_KEY = 'ktane_saved_bombs';

export const storage = {
  getCurrentBomb: (): BombState | null => {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(CURRENT_BOMB_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setCurrentBomb: (bomb: BombState | null): void => {
    if (typeof window === 'undefined') return;
    try {
      if (bomb) {
        localStorage.setItem(CURRENT_BOMB_KEY, JSON.stringify(bomb));
      } else {
        localStorage.removeItem(CURRENT_BOMB_KEY);
      }
    } catch (error) {
      console.error('Failed to save current bomb:', error);
    }
  },

  clearCurrentBomb: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(CURRENT_BOMB_KEY);
  },

  getSavedBombs: (): SavedBomb[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(SAVED_BOMBS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveBomb: (name: string, bomb: BombState): void => {
    if (typeof window === 'undefined') return;
    try {
      const savedBombs = storage.getSavedBombs();
      const existingIndex = savedBombs.findIndex((s) => s.bomb.id === bomb.id);

      const savedBomb: SavedBomb = {
        name,
        bomb,
        savedAt: Date.now(),
      };

      if (existingIndex >= 0) {
        savedBombs[existingIndex] = savedBomb;
      } else {
        savedBombs.push(savedBomb);
      }

      localStorage.setItem(SAVED_BOMBS_KEY, JSON.stringify(savedBombs));
    } catch (error) {
      console.error('Failed to save bomb:', error);
    }
  },

  deleteSavedBomb: (bombId: string): void => {
    if (typeof window === 'undefined') return;
    try {
      const savedBombs = storage.getSavedBombs();
      const filtered = savedBombs.filter((s) => s.bomb.id !== bombId);
      localStorage.setItem(SAVED_BOMBS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to delete saved bomb:', error);
    }
  },
};
