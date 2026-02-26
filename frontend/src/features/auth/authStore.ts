import { create } from 'zustand';
import { User } from '@/types/user';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user:
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('user') || 'null')
      : null,

  token:
    typeof window !== 'undefined'
      ? localStorage.getItem('token')
      : null,

  isAuthenticated:
    typeof window !== 'undefined'
      ? !!localStorage.getItem('token')
      : false,

  setAuth: (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
      set({ token, isAuthenticated: true });
    } else {
      localStorage.removeItem('token');
      set({ token: null, isAuthenticated: false });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
    window.location.href = '/login';
  },
}));