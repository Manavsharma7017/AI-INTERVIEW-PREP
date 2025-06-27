import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, BookOpen } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/input';
import { domainService } from '../../services/domains';
import type { Domain } from '../../types/types';

export const AdminDomains: React.FC = () => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingDomain, setEditingDomain] = useState<Domain | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    loadDomains();
  }, []);

  const loadDomains = async () => {
    try {
      setIsLoading(true);
      const data = await domainService.getAllDomains();
      setDomains(data);
    } catch (error) {
      console.error('Failed to load domains:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDomain) {
        await domainService.updateDomain(editingDomain.id, formData);
      } else {
        await domainService.createDomain(formData);
      }
      await loadDomains();
      setFormData({ name: '', description: '' });
      setIsCreating(false);
      setEditingDomain(null);
    } catch (error) {
      console.error('Failed to save domain:', error);
    }
  };

  const startEdit = (domain: Domain) => {
    setEditingDomain(domain);
    setFormData({ name: domain.name, description: domain.description });
    setIsCreating(true);
  };

  const cancelEdit = () => {
    setIsCreating(false);
    setEditingDomain(null);
    setFormData({ name: '', description: '' });
  };

  const deleteDomain = async (id: number) => {
    try {
      await domainService.deleteDomain(id);
      await loadDomains();
    } catch (error) {
      alert('Failed to delete domain:');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 md:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Domain Management</h2>
          <p className="text-gray-600">Manage interview practice domains</p>
        </div>
        <Button
          onClick={() => setIsCreating(true)}
          className="flex items-center space-x-2"
        ><div className='flex'> 
          <Plus className="h-4 w-4" />
          <span>Add Domain</span></div>
        </Button>
       
      </div>

      {/* Create/Edit Form */}
      {isCreating && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingDomain ? 'Edit Domain' : 'Create New Domain'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Domain Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., JavaScript, Python, Data Structures"
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe what this domain covers..."
                required
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button type="submit">
                {editingDomain ? 'Update Domain' : 'Create Domain'}
              </Button>
              <Button type="button" variant="outline" onClick={cancelEdit}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Domains Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {domains.map((domain) => (
          <Card key={domain.id} className="p-6 hover" hover>
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => startEdit(domain)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this domain?')) {
                      deleteDomain(domain.id);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {domain.name}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-3">
              {domain.description}
            </p>
          </Card>
        ))}
      </div>

      {domains.length === 0 && (
        <Card className="p-12 text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No domains yet
          </h3>
          <p className="text-gray-600 mb-6">
            Create your first domain to start organizing questions
          </p>
          <Button onClick={() => setIsCreating(true)}>
            <div className='flex'> 
            <Plus className="h-4 w-4 mr-2" />
            <span>Create First Domain</span>
            </div>
          </Button>
         
        </Card>
      )}
    </div>
  );
};