import { apiClient } from "./api";
import  type  {AllsesssionsResponse, CreateSessionRequest, CreateSessionResponse, sessionbyID} from "../types/types";
import { clearsessionData } from "../utils/auth";
export const sessionService={
    async getAllsession(): Promise<AllsesssionsResponse[]> {
        const response = await apiClient.get('/sessions/getall');
        const rawSessions = response.data.interview_sessions;
        const sessions: AllsesssionsResponse[] = rawSessions.map((s: any) => ({
            id: s.id,
            domainId: s.domain_id,
            description: s.description,
            Domain: {
                id: s.domain_id,
                name: s.domain_name,
            },
            started_at: s.started_at,
            completed_at: s.completed_at,
           
        }));
        return sessions;
    },

    async createSession(sessionData: CreateSessionRequest): Promise<CreateSessionResponse> {
        const response = await apiClient.post('/sessions/create', sessionData);
        const session: CreateSessionResponse = {
            id: response.data.session.id,
            domain_id: response.data.session.domain_id,
            description: response.data.session.description,
            Domain: {
                id: response.data.session.domain_id,
                name: response.data.session.domain_name,
            },
            started_at: response.data.session.started_at,
          
        };
        return session;
    },
    async endsession(sessionId: string): Promise<void> {
        if (!sessionId) {
            throw new Error("Session ID is required to end the session.");
        }
        await apiClient.patch(`sessions/${sessionId}/complete`);
        clearsessionData();
    },
    async getSessionById(SessionId: string): Promise<sessionbyID> {
        if (!SessionId) {
            throw new Error("Session ID is required to fetch session details.");
        }
        const response = await apiClient.get(`/sessions/${SessionId}`);
        const s = response.data.session;    
        const session: sessionbyID = {
            id: s.id,
            domain_id: s.domain_id,
            description: s.description,
            domain_name: s.domain_name,
            Questions: s.Questions
        };
        return session;
    }
}