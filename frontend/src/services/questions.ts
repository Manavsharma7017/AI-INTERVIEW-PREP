import { apiClient } from './api';
import type { Question } from '../types/types';

export const questionService = {
  async getAllquestions(): Promise<Question[]> {
    const response = await apiClient.get('/admin/questions');
    const rawQuestions = response.data.questions;
    const questions: Question[] = rawQuestions.map((q: any) => ({
        id: q.ID,
        text: q.Text,
        difficulty: q.Difficulty,
        domain_id: q.DomainID,
        created_at: q.CreatedAt,
        updated_at: q.UpdatedAt
        }));
    return questions;
    },
  async createQuestion(question: Omit<Question, 'id' | 'created_at'>): Promise<Question> {
    const response = await apiClient.post('/admin/questions', question);
    return response.data;
  },

  async updateQuestion(id: string, question: Partial<Question>): Promise<Question> {
    const response = await apiClient.put(`/admin/questions/${id}`, question);
    return response.data;
  },

  async deleteQuestion(id: string): Promise<void> {
    await apiClient.delete(`/admin/questions/${id}`);
  }
};