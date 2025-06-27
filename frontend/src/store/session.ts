
import { atom, selector } from 'recoil';
import type { Session } from '../types/types';
import { localStorageEffect } from '../utils/recoilEffects';

export const sessionState = atom<Session>({
  key: 'sessionState',
  default: {
    id: "",
    domain: { name: "", id: 0 },
    description: "",
    started_at: "",
    userDomain:0,
  },
  effects: [localStorageEffect<Session>('session')],
});

export const sessionSelector = selector({
    key: 'sessionSelector',
    get: ({get}) => {
        const session = get(sessionState);
        return {
            sessionId: session.id,
        };
    },
});
