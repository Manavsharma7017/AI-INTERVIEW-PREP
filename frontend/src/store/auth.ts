import { atom, selector } from 'recoil';
import type { AuthState } from '../types/types';

export const authState = atom<AuthState>({
  key: 'authState',
  default: {
    user: null,
    token: null,
    isAuthenticated: false,
    role: null,
  },
});

export const userSelector = selector({
  key: 'userSelector',
  get: ({ get }) => {
    const auth = get(authState);
    return auth.user;
  },
});

export const isAdminSelector = selector({
  key: 'isAdminSelector',
  get: ({ get }) => {
    const auth = get(authState);
    return auth.role === 'ADMIN' || auth.role === 'EDITOR';
  },
});

export const isAuthenticatedSelector = selector({
  key: 'isAuthenticatedSelector',
  get: ({ get }) => {
    const auth = get(authState);
    return auth.isAuthenticated;
  },
});
export const isUserSelector = selector({
  key: 'isUserSelector',
  get: ({ get }) => {
    const auth = get(authState);
    return auth.role === 'USER';
  }
});
export const tokenSelector = selector({
    key: 'tokenSelector',
    get: ({ get }) => {
        const auth = get(authState);
        return auth.token;
    }  
});