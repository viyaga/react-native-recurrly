import { create } from 'zustand';
import { HOME_BOTS } from '@/constants/data';

interface BotStore {
  bots: Bot[];
  addBot: (bot: Bot) => void;
  setBots: (bots: Bot[]) => void;
}

export const useBotStore = create<BotStore>((set) => ({
  bots: HOME_BOTS,
  addBot: (bot) =>
    set((state) => ({ bots: [bot, ...state.bots] })),
  setBots: (bots) => set({ bots }),
}));
