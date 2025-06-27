import { apiClient } from "./api";
import type { CreateUserQuestion, CreateUserQuestionResponse, Question, ResponceandFeedback } from "../types/types";

export const userQuestionService = {
    async getAllUserQuestions(): Promise<Question[]> {
        const response = await apiClient.get('/questions/find/all');
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
    async getQuestionByfilter(fileter: {difficulty?:string|null,domainID?:number|null}): Promise<Question[]> {
        const response = await apiClient.get(`/questions`,{
            params: {
                difficulty: fileter.difficulty,
                domain_id: fileter.domainID
            }
        });
        const rawQuestions = response.data.questions;
        const questions: Question[] = rawQuestions.map((q: any) => ({
            id: q.ID,
            text: q.Text,
            difficulty: q.Difficulty,
            domain_id: q.DomainID,
            domains: q.Domains,
            created_at: q.CreatedAt,
            updated_at: q.UpdatedAt
        }));
        return questions;
    },
    async getQuestionById(id: string): Promise<Question> {
        const response = await apiClient.get(`/questions/${id}`);
        const q = response.data.question;
        const question: Question = {
            id: q.ID,
            text: q.Text,
            difficulty: q.Difficulty,
            domain_id: q.DomainID,
            Explanation: q.Explanation,
            domains: { id: q.Domain.ID,
            name: q.Domain.Name,
            description: q.Domain.Description},
            created_at: q.CreatedAt,
        };
        return question;
    },
    async createuserQuestion(questionData: CreateUserQuestion ): Promise<CreateUserQuestionResponse> {
        const response = await apiClient.post('/user-questions', questionData);
        const q = response.data.user_question;
        const question:CreateUserQuestionResponse = {
            id: q.id,
            difficulty: q.Difficulty,
            Explanation: q.Explanation,
            text: q.Text,
            domain_id: q.DomainID,
            Questionnumber: q.Questionnumber,
        };
        return question;
    },
    async getUserQuestionById(id: string): Promise<ResponceandFeedback> {
        const response = await apiClient.get(`/user-questions/${id}`);
        const q = response.data;
        const question= {
            id: q.ID,
            text: q.Text,
            Explanation: q.Explanation,
            response:q.Responses,
        };
        return question;
    },
    async deleteUserQuestion(id: string): Promise<void> {
        await apiClient.delete(`/user-questions/${id}`);
    }
};
