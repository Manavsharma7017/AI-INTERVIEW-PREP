import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { userQuestionService } from "../services/UserQuestion";
import { responseService } from "../services/responceservice";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { ArrowLeft } from "lucide-react";

import type { FeedbackRespoce, ResponceandFeedback } from "../types/types";

export const ResponseAndFeedback = () => {
  const { id } = useParams<{ id: string }>();
  const [response, setResponse] = useState<ResponceandFeedback>();
  const [feedback, setFeedback] = useState<FeedbackRespoce>();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, []);

  const loadData = async () => {
    try {
      const responseData = await userQuestionService.getUserQuestionById(id || "");
      if (!responseData) {
        toast.error("No response and feedback data found for this ID");
        return;
      }
      const feedbackData = await responseService.getResponseById(responseData.response.ResponseID || "");
      setResponse(responseData);
      setFeedback(feedbackData);
    } catch (error) {
      toast.error("Failed to load response and feedback data");
      console.error("Error loading response and feedback data:", error);
    } finally {
      setIsLoading(false);
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

  if (!response || !feedback) {
    return (
      <div className="text-center text-gray-500 p-8">
        Could not load response and feedback.
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-6">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        <span className="text-sm sm:text-base">Back</span>
      </button>

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          Response & Feedback
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Review your answer and the AI’s feedback
        </p>
      </div>

      {/* Question */}
      <Card className="p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Question</h3>
        <p className="text-gray-900 mb-3">{response.text}</p>
        <p className="text-sm text-gray-600 italic">
          Explanation: {response.Explanation}
        </p>
      </Card>

      {/* User's Answer */}
      <Card className="p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Your Answer</h3>
        <p className="text-gray-900 whitespace-pre-wrap text-sm sm:text-base">
          {feedback.answer}
        </p>
      </Card>

      {/* Feedback */}
      <Card className="p-4 sm:p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Feedback Summary</h3>

        <div className="flex flex-wrap gap-3">
          <Badge variant="info">Clarity: {feedback.Feedback.Clarity}</Badge>
          <Badge variant="info">Tone: {feedback.Feedback.Tone}</Badge>
          <Badge variant="info">Relevance: {feedback.Feedback.Relevance}</Badge>
          <Badge variant="success">Score: {feedback.Feedback.OverallScore}/10</Badge>
        </div>

        <div className="mt-4">
          <h4 className="text-md font-semibold text-gray-700 mb-1">Suggestion</h4>
          <p className="text-gray-800 text-sm sm:text-base">
            {feedback.Feedback.Suggestion}
          </p>
        </div>
      </Card>
    </div>
  );
};
