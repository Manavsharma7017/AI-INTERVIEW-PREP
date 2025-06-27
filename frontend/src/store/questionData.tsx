import {atom ,selector} from 'recoil';
import type { selectorQuestiondata } from '../types/types';
import { localStorageEffect } from '../utils/recoilEffects';
  
export const questionDataState = atom<selectorQuestiondata>({
  key: 'questionDataState',
    default: {
        id: '',
        text: '',
        difficulty: "EASY",
        Explanation: '',
        Questionnumber:0
    },
    effects:[localStorageEffect<selectorQuestiondata>('questionData')],
});
export const questionDataSelector = selector<selectorQuestiondata>({
  key: 'questionDataSelector',
    get: ({ get }) => {
        const questionData = get(questionDataState);
        return questionData;
    },
    set: ({ set }, newValue) => {
        if (typeof newValue === 'object' && newValue !== null) {
            set(questionDataState, newValue as selectorQuestiondata);
        } else {
            console.error('Invalid value for questionDataState:', newValue);
        }
    }
});