import { useState, useEffect } from 'react';
import type { AllsesssionsResponse, CreateSessionRequest, Domain } from '../types/types';
import { sessionService } from '../services/sesssion';
import { Button } from '../components/ui/Button';
import { Filter, Minus, Plus } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { InterviewForm } from '../components/forms/IntervieewFrom';
import { domainService } from '../services/domains';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { sessionState } from '../store/session';
import { clearsessionData } from '../utils/auth';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { userQuestionService } from '../services/UserQuestion';
import { questionDataSelector } from '../store/questionData';

export const InterviewPage = () => {
  const [sessions, setSessions] = useState<AllsesssionsResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [selectedDomainId, setSelectedDomainId] = useState<number | 'all'>('all');
  const [searchParams] = useSearchParams();

  const setQuestiondata = useSetRecoilState(questionDataSelector);
  const questionId = searchParams.get('questionId');
  const domainId = searchParams.get('domainId');

  const currentSession = useRecoilValue(sessionState);
  const setSession = useSetRecoilState(sessionState);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const domainsData = await domainService.getAllUserDomains();
      setDomains(domainsData);
      const sessionsData = await sessionService.getAllsession();
      
      setSessions(sessionsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelEdit = () => {
    setIsCreating(false);
  };

  const handleCreateSession = async (data: any) => {
    setIsSubmitting(true);

    const newSession: CreateSessionRequest = {
      Description: data.description,
      DomainID: parseInt(data.domain_id),
    };

    if (!newSession.Description || !newSession.DomainID) {
      toast.error('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

    try {
      const session = await sessionService.createSession(newSession);
      const createdUserDomain = await domainService.createUserDomain({ DomainID: session.Domain.id });
      const requiredData = await userQuestionService.getQuestionById(questionId || '');

      const createUserQuestion = await userQuestionService.createuserQuestion({
        UserDomainID: createdUserDomain,
        SessionID: session.id,
        Explanation: requiredData.Explanation,
        Questionnumber: 1,
        Text: requiredData.text,
        Difficulty: requiredData.difficulty,
      });

      setSession({
        id: session.id,
        domain: { id: session.Domain.id, name: session.Domain.name },
        userDomain: createdUserDomain,
        description: session.description,
        started_at: session.started_at,
      });

      setQuestiondata({
        id: createUserQuestion.id,
        text: createUserQuestion.text,
        Explanation: createUserQuestion.Explanation,
        Questionnumber: 1,
        difficulty: requiredData.difficulty,
      });

      if (questionId) {
        navigate(`/app/interviewstarted/${session.id}/question/${questionId}`);
      } else {
        await loadData();
      }

      setIsCreating(false);
    } catch (error) {
      toast.error('Failed to create session. Please try again.');
      console.error('Error creating session:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const endSession = (id: string) => async () => {
    setIsSubmitting(true);
    try {
      await sessionService.endsession(id);
      setSession({
        id: '',
        domain: { id: 0, name: '' },
        description: '',
        started_at: '',
        userDomain: 0,
      });
      clearsessionData();
      await loadData();
    } catch (error) {
      console.error('Error ending session:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredSessions =
    selectedDomainId === 'all'
      ? sessions
      : sessions.filter((s) => s.Domain.id === selectedDomainId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 sm:px-6 pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Interview Management</h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Manage interview questions across all domains
          </p>
        </div>
        {currentSession.id ? (
          <Button
            onClick={endSession(currentSession.id)}
            className="flex items-center gap-2 w-full sm:w-auto"
            disabled={isSubmitting}
          >
            <Minus className="h-4 w-4" />
            <span>End session</span>
          </Button>
        ) : (
          <Button
            onClick={() => {
              if (!questionId) {
                toast.info('Please select a question to start the session');
                navigate('/app/question');
                return;
              }
              setIsCreating(true);
            }}
            className="flex items-center gap-2 w-full sm:w-auto"
            disabled={isSubmitting}
          >
            <div className="flex items-center justify-center">
            <Plus className="h-4 w-4" />
            <span>Start session</span>
            </div>
          </Button>
        )}
      </div>

      {/* Filter Dropdown */}
      {sessions.length > 0 && (
        <Card className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={selectedDomainId}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedDomainId(value === 'all' ? 'all' : parseInt(value));
                }}
                className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Domains</option>
                {domains.map((domain) => (
                  <option key={domain.id} value={domain.id}>
                    {domain.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>
      )}

      {/* Create Form */}
        {isCreating && (
          <Card className="p-4 sm:p-6">
            <InterviewForm
              onSubmit={handleCreateSession}
              isLoading={isSubmitting}
              domains={domains}
              domainId={parseInt(domainId || '0')}
              onCancel={cancelEdit}
            />
          
          </Card>
        )}

      {/* Session Cards */}
      {filteredSessions.length === 0 ? (
        <div className="text-center text-gray-500">
          No sessions available for this domain.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSessions.map((session) => (
            <Card key={session.id} className="p-4 sm:p-6 hover:shadow-xl transition duration-200">
              <Link to={`/app/interview/${session.id}`}>
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-semibold text-gray-900">{session.Domain.name}</h3>
                  <p className="text-gray-700 text-sm line-clamp-2">
                    Description: {session.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    Created at: {new Date(session.started_at).toLocaleString()}
                  </p>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
