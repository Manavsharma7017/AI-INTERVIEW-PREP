import { useEffect, useState } from "react";
import type { Question } from "../types/types";
import { userQuestionService } from "../services/UserQuestion";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { MessageSquare, Plus } from "lucide-react";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { useRecoilValue } from "recoil";
import { sessionSelector } from "../store/session";
import { toast } from "react-toastify";

export const QuestionPageId: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [question, setQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const sessionvalue = useRecoilValue(sessionSelector);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) loadQuestion(id);
  }, [id]);

  const loadQuestion = async (questionId: string) => {
    try {
      const response = await userQuestionService.getQuestionById(questionId);
      setQuestion(response);
    } catch (error) {
      console.error("Error loading question:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDomainName = (domainId: number) =>
    question?.domains.name || `Domain ${domainId}`;

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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4 px-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        <div className="text-xl font-medium text-gray-700">Loading question...</div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="text-red-500 text-center p-6 text-base sm:text-lg">
        Question not found
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <Card key={question.id} className="p-4 sm:p-6 space-y-6">
        {/* Header Badges */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <MessageSquare className="h-4 w-4 text-purple-600" />
          </div>
          <Badge variant={getDifficultyVariant(question.difficulty)}>
            {question.difficulty}
          </Badge>
          <Badge variant="info">{getDomainName(question.domain_id)}</Badge>
        </div>

        {/* Domain Title */}
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
          {question.domains.name}
        </h2>

        {/* Domain Description and Button */}
        <div className="flex flex-row gap-4 justify-between items-start">
          <p className="text-gray-900 text-base sm:text-lg leading-relaxed">
            <span className="font-medium">About Domain:</span> {question.domains.description}
          </p>
         <div className=" hidden justify-end md:flex md:justify-end">
            <Button
             className="hidden md:flex items-center space-x-2 w-full"
              onClick={() => {
                if (!sessionvalue.sessionId) {
                  toast.info("You can start an interview now");
                  navigate(
                    `/app/interview?questionId=${question.id}&domainId=${question.domain_id}`
                  );
                } else {
                  navigate(
                    `/app/interviewstarted/${sessionvalue.sessionId}/question/${question.id}`
                  );
                }
              }}
            > <div className="flex items-center space-x-2"> <Plus className="h-4 w-4" />
              <span>Start Attempt</span></div>
             
            </Button>
          </div>
         
        </div>

        {/* Question & Explanation */}
        <div className="space-y-4">
          <p className="text-gray-900 leading-relaxed text-base sm:text-lg">
            <span className="font-medium">Question:</span> {question.text}
          </p>
          <p className="text-gray-900 leading-relaxed text-base sm:text-lg">
            <span className="font-medium">Explanation:</span> {question.Explanation}
          </p>
          <p className="text-sm text-gray-500">
            Created: {new Date(question.created_at).toLocaleDateString()}
          </p>
        </div>
         <div className="flex sm:justify-end">
            <Button
              className=" flex items-center space-x-2 w-full sm:hidden justify-center"
              onClick={() => {
                if (!sessionvalue.sessionId) {
                  toast.info("You can start an interview now");
                  navigate(
                    `/app/interview?questionId=${question.id}&domainId=${question.domain_id}`
                  );
                } else {
                  navigate(
                    `/app/interviewstarted/${sessionvalue.sessionId}/question/${question.id}`
                  );
                }
              }}
            > <div className="flex items-center space-x-2"> <Plus className="h-4 w-4" />
              <span>Start Attempt</span></div>
             
            </Button>
          </div>
      </Card>
    </div>
  );
};
