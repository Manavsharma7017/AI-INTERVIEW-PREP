import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, MessageSquare, Filter } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { QuestionForm } from '../forms/QuestionForm';
import { questionService } from '../../services/questions';
import { domainService } from '../../services/domains';
import type { Question, Domain } from '../../types/types';

export const AdminQuestions: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [filters, setFilters] = useState({
    difficulty: '',
    domain: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterQuestions();
  }, [questions, filters]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [questionsData, domainsData] = await Promise.all([
        questionService.getAllquestions(),
        domainService.getAllDomains(),
      ]);
      setQuestions(questionsData);
      setDomains(domainsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterQuestions = () => {
    let filtered = questions;

    if (filters.difficulty) {
      filtered = filtered.filter(q => q.difficulty === filters.difficulty);
    }

    if (filters.domain) {
      filtered = filtered.filter(q => q.domain_id === parseInt(filters.domain));
    }

    setFilteredQuestions(filtered);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (editingQuestion) {
        await questionService.updateQuestion(editingQuestion.id, {
          text: data.text,
          difficulty: data.difficulty,
          Explanation: data.Explanation,
          // @ts-ignore
          DomainID: parseInt(data.domain_id),
        });
      } else {
        await questionService.createQuestion({
          text: data.text,
          difficulty: data.difficulty,
          Explanation: data.Explanation,
          // @ts-ignore
          DomainID: parseInt(data.domain_id),
        });
      }

      await loadData();
      setIsCreating(false);
      setEditingQuestion(null);
    } catch (error) {
      console.error('Failed to save question:', error);
    }
  };

  const startEdit = (question: Question) => {
    setEditingQuestion(question);
    setIsCreating(true);
  };

  const cancelEdit = () => {
    setIsCreating(false);
    setEditingQuestion(null);
  };

  const deleteQuestion = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await questionService.deleteQuestion(id);
        await loadData();
      } catch (error) {
        console.error('Failed to delete question:', error);
      }
    }
  };

  const getDomainName = (domainId: number) => {
    const domain = domains.find(d => d.id === domainId);
    return domain ? domain.name : `Domain ${domainId}`;
  };

  const getDifficultyVariant = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'easy';
      case 'MEDIUM': return 'medium';
      case 'HARD': return 'hard';
      default: return 'info';
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Question Management</h2>
          <p className="text-gray-600">Manage interview questions across all domains</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="flex items-center space-x-2">
          <span className='flex'> <Plus className="h-4 w-4" />
          <span>Add Question</span></span>
         
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={filters.difficulty}
              onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Difficulties</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>

          <select
            value={filters.domain}
            onChange={(e) => setFilters({ ...filters, domain: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Domains</option>
            {domains.map((domain) => (
              <option key={domain.id} value={domain.id}>
                {domain.name}
              </option>
            ))}
          </select>

          <div className="text-sm text-gray-600">
            Showing {filteredQuestions.length} of {questions.length} questions
          </div>
        </div>
      </Card>

      {/* Create/Edit Form */}
      {isCreating && (
        <Card className="p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingQuestion ? 'Edit Question' : 'Create New Question'}
          </h3>
          <QuestionForm
            onSubmit={handleSubmit}
            isLoading={false}
            domains={domains}
            initialData={editingQuestion || undefined}
          />
          <div className="mt-4">
            <Button variant="outline" onClick={cancelEdit}>
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((question) => (
          <Card key={question.id} className="p-4 sm:p-6 hover" hover>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <MessageSquare className="h-4 w-4 text-purple-600" />
                  </div>
                  <Badge variant={getDifficultyVariant(question.difficulty)}>
                    {question.difficulty}
                  </Badge>
                  <Badge variant="info">
                    {getDomainName(question.domain_id)}
                  </Badge>
                </div>
                <p className="text-gray-900 leading-relaxed break-words mb-3">
                  {question.text}
                </p>
                <p className="text-sm text-gray-500">
                  Created: {new Date(question.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="flex flex-row sm:flex-col gap-2 sm:ml-4">
                <Button size="sm" variant="outline" onClick={() => startEdit(question)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="danger" onClick={() => deleteQuestion(question.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredQuestions.length === 0 && (
        <Card className="p-12 text-center">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {questions.length === 0 ? 'No questions yet' : 'No questions match your filters'}
          </h3>
          <p className="text-gray-600 mb-6">
            {questions.length === 0
              ? 'Create your first question to get started'
              : 'Try adjusting your filters or create a new question'}
          </p>
          <Button onClick={() => setIsCreating(true)}>
            <div className='flex'>
            <Plus className="h-4 w-4 mr-2" />
            {questions.length === 0 ? 'Create First Question' : 'Add Question'}
            </div>
          </Button>
        </Card>
      )}
    </div>
  );
};
