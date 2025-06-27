import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { sessionService } from "../services/sesssion";
import { MessageSquare, ArrowLeft } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { apiClient2 } from "../services/api";

interface SessionQuestion {
  id: string;
  text: string;
  Explanation: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  Questionnumber: number;
}

interface SessionByID {
  id: string;
  domain_id: number;
  domain_name: string;
  description: string;
  Questions: SessionQuestion[];
}

export const InterviewSessionId = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [sessionData, setSessionData] = useState<SessionByID | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionId) {
      loaddata();
      
    }
  }, [sessionId]);

  const loaddata = async () => {
    try {
      const data = await sessionService.getSessionById(sessionId || "");
      setSessionData(data);
    } catch (error) {
      toast.error("Failed to load session data");
      console.error("Error loading session data:", error);
    } finally {
      setIsLoading(false);
      apiClient2.get(``);
    }
  };

  const getDifficultyVariant = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return "easy";
      case "MEDIUM":
        return "medium";
      case "HARD":
        return "hard";
      default:
        return "info";
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div className="text-center text-gray-500 p-8">
        Could not find session data.
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </button>

      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Interview Session - {sessionData.domain_name}
        </h2>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">{sessionData.description}</p>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {sessionData.Questions.map((question) => (
          // @ts-ignore
          <Card key={question.ID} className="p-4 sm:p-6 hover:shadow-lg transition duration-300">
             {/* @ts-ignore*/ }
            <Link to={`/app/ResponseAndFeedback/${question.ID}`}>
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <MessageSquare className="h-4 w-4 text-purple-600" />
                  </div>
                  {/* @ts-ignore*/ }
                  <Badge variant={getDifficultyVariant(question.Difficulty)}>
                    {/* @ts-ignore*/ }
                    {question.Difficulty}
                  </Badge>
                  <Badge variant="info">
                    Question #{question.Questionnumber}
                  </Badge>
                </div>

                <p className="text-gray-900 leading-relaxed text-sm sm:text-base">
                  {/* @ts-ignore*/ }
                  {question.Text}
                </p>

                <p className="text-sm text-gray-500 italic">
                  Explanation: {question.Explanation}
                </p>
              </div>
            </Link>
          </Card>
        ))}
      </div>

      {sessionData.Questions.length === 0 && (
        <Card className="p-6 sm:p-12 text-center">
          <MessageSquare className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No questions in this session
          </h3>
          <p className="text-gray-600 text-sm sm:text-base">
            This session currently has no interview questions attached.
          </p>
        </Card>
      )}
    </div>
  );
};
