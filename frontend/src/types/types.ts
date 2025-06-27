export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER';
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  username: string;
  role: 'ADMIN' | 'EDITOR';
}

export interface Domain {
  id: number;
  name: string;
  description: string;
}

export interface Question {
  id: string;
  text: string;
  Explanation :string 
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  domains: Domain;
  domain_id: number;
  created_at: string;
}

export interface InterviewSession {
  id: string;
  user_id: string;
  domain_id: number;
  Domain: {
    id: number;
    name: string;
  };
  description: string;
  started_at: string;
  completed_at?: string;
}
export interface Session {
  id: string;
  domain: {
    id: number;
    name: string;
  };
  description: string;
  userDomain: number;
  started_at: string;
}
export interface Response {
  responceID?: string;
  sessionID: string;
  questionID?: string;
  UserQuestionID?: string;
  answer: string;
  submitted_at: string;
}
export interface createfeedback{
  ResponceId: string
	SessionID : string
  Domain: string
	Question   :string
	Answer     :string
}
export interface Feedback {
  id: string;
  response_id: string;
  clarity: string;
  tone: string;
  relevance: string;
  overall_score: string;
  suggestion: string;
  NextQuestion: string;
  NextQuestionDifficuilty: 'EASY' | 'MEDIUM' | 'HARD';
  Explanation: string;
}

export interface AuthState {
  user: User | AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  role: 'USER' | 'ADMIN' | 'EDITOR' | null;
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username?: string;
  name?: string; // Only for user registration
  password: string;
  AdminPassword?: string; 
  role?: 'ADMIN' | 'EDITOR'; // Only for admin registration
}

export interface CreateSessionRequest {
 
  DomainID: number;
  Description: string;
}

export interface CreateResponseRequest {
  session_id: string;
  question_id: string;
  user_question_id: string;
  answer: string;
}

export interface FeedbackRequest {
  responce_id: string;
  question: string;
  answer: string;
  user_id: string;
}
export interface CreateUserQuestion{
  Questionnumber: number;
  Text: string;
  Explanation :string;
  UserDomainID: number;
  SessionID: string;
  Difficulty:'EASY' | 'MEDIUM' | 'HARD';
}
export interface CreateUserDomain{
  DomainID : number;
}
export interface CreateUserQuestionResponse {
  id: string,
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  Explanation: string,
  domain_id: number,
  text: string,
  Questionnumber: number;
}
export interface selectorQuestiondata{
  id: string;
  text: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  Explanation: string;
 
   Questionnumber: number;
}
export interface sessionbyID {
  id: string;
  domain_id: number;
  domain_name: string;
  description: string;
  Questions:{
    id: string;
    text: string;
    Explanation: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    Questionnumber: number;
  }[];
}
export interface ResponceandFeedback{
  id : string, text: string, Explanation: string, response: {
        ResponseID: string,
    }
}
export interface FeedbackRespoce{
  Feedback :{
    Clarity: string;
    Tone: string;
    Relevance: string;
    OverallScore: string;
    Suggestion: string;
  },
  answer: string;
}
export type CreateSessionResponse = Pick<InterviewSession, 'id' | 'domain_id' | 'description' | 'Domain' | 'started_at'>
export type AllsesssionsResponse = Pick<InterviewSession, 'id' | 'domain_id' | 'Domain'| 'description' | 'started_at' | 'completed_at'>;