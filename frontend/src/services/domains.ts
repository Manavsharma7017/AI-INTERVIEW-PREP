import { apiClient } from './api';
import type { CreateUserDomain, Domain } from '../types/types';

export const domainService = {
  async getAllDomains(): Promise<Domain[]> {
    const response = await apiClient.get('/admin/domain/getall');
   const rawDomains = response.data.domains;
    const domains: Domain[] = rawDomains.map((d: any) => ({
      id: d.ID,
      name: d.Name,
      description: d.Description,
    }));
    return domains;
  },
  async getAllUserDomains(): Promise<Domain[]> {
  const response = await apiClient.get('/domain/getall');

  const rawDomains = response.data?.domains ?? []; // Safe fallback to empty array

  if (!Array.isArray(rawDomains)) {
    console.warn('Unexpected domains format:', rawDomains);
    return [];
  }

  const domains: Domain[] = rawDomains.map((d: any) => ({
    id: d.ID,
    name: d.Name,
    description: d.Description,
  }));

  return domains;
}
,

  async createDomain(domain: Omit<Domain, 'id'>): Promise<Domain> {
    const response = await apiClient.post('/admin/domain/create', domain);
    return response.data;
  },

  async updateDomain(id: number, domain: Partial<Domain>): Promise<Domain> {
    const response = await apiClient.put(`/admin/domain/update/${id}`, domain);
    return response.data;
  },
  async deleteDomain(id: number): Promise<void> {
    await apiClient.delete(`/admin/domain/delete/${id}`);
    },
  async getDomainById(id: number): Promise<Domain> {
    const response = await apiClient.get(`/domain/get/${id}`);
    const d = response.data.domain;
    const domain: Domain = {
      id: d.ID,
      name: d.Name,
      description: d.Description,
    };
    return domain;
  },
  async createUserDomain(domain:CreateUserDomain): Promise<number> {
    const response = await apiClient.post('/user-domains', domain);
    return response.data.user_domain.id;
  }
};