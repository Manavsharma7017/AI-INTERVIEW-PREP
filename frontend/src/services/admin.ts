import { apiClient } from "./api";
import type { AdminUser } from "../types/types";

export const adminService ={
    async getAllAdmins(): Promise<AdminUser[]> {
        const response = await apiClient.get('/admin/profile');
        const rawAdmins = response.data.adminuserdata;
        const admins: AdminUser[] = rawAdmins.map((a: any) => ({
            id: a.id,
            username: a.username,
            email: a.email,
            role: a.role,
        }));
        return admins;
    },
    async getAdminStats(): Promise<any> {
        const response = await apiClient.get('/admin/dashboard');
        const rawdata= response.data.data;
        const stats = {
            totalUsers: rawdata.total_users || 0,
            totalDomains: rawdata.total_domains || 0,
            totalQuestions: rawdata.total_questions || 0,
            totalSessions: rawdata.total_sessions || 0,
        };  

        return stats;
    },
}