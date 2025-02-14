import { Notice } from '../types';

export const storage = {
  saveNotice: (notice: Notice) => {
    try {
      const notices = storage.getAllNotices();
      notices.push({ ...notice, id: Date.now().toString() });
      localStorage.setItem('notices', JSON.stringify(notices));
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  getAllNotices: (): Notice[] => {
    try {
      const notices = localStorage.getItem('notices');
      return notices ? JSON.parse(notices) : [];
    } catch {
      return [];
    }
  },

  searchNotices: (field: string, term: string): Notice[] => {
    try {
      const notices = storage.getAllNotices();
      return notices.filter(notice => {
        const value = notice[field as keyof Notice];
        return value && value.toString().toLowerCase().includes(term.toLowerCase());
      });
    } catch {
      return [];
    }
  }
};