import { apiClient } from "./api";
import type { createfeedback, Feedback, FeedbackRespoce, Response } from "../types/types";
export const responseService = {
    async createResponce(data: Response):Promise<Response> {
            const response = await apiClient.post('/responses', data);
            return response.data.responce;
    },
    async createFeedback(data:createfeedback):Promise<Feedback> {
        const response = await apiClient.post('/responses/feedback', data);
        return response.data.data;
    },
    async getResponseById(id: string): Promise<FeedbackRespoce> {
        if (!id) {
            throw new Error("Response ID is required to fetch response details.");
        }
        const response = await apiClient.get(`/responses/${id}`);
        return response.data.responce;
    }
}