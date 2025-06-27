import type { User, AdminUser } from '../types/types';

export const saveAuthData = (token: string, user: User | AdminUser) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};


export const getStoredAuthData = (): { token: string | null; user: User | AdminUser | null } => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  
  return { token, user };
};


export const clearQuestionData = () => {
  localStorage.removeItem('questionData');
}


export const clearsessionData = () => {
  localStorage.removeItem(`session`);
}
export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getUserRole = (user: User | AdminUser | null): 'USER' | 'ADMIN' | 'EDITOR' | null => {
  if (!user) return null;
  return user.role;
};