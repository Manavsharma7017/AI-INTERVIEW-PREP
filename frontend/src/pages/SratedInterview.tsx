import { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { questionDataSelector } from "../store/questionData";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { MessageSquare } from "lucide-react";
import { responseService } from "../services/responceservice";
import { toast } from "react-toastify";
import { userQuestionService } from "../services/UserQuestion";
import { sessionState } from "../store/session";
import { useAntiCheatProtection } from "../components/anticheat/useAntiCheatProtection";
import { clearQuestionData, clearsessionData } from "../utils/auth";
import { sessionService } from "../services/sesssion";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";

export const SratedInterview = () => {
  const navigate = useNavigate();
  const QuestionData = useRecoilValue(questionDataSelector); // moved here
  const sessionValue = useRecoilValue(sessionState);
  const setSession = useSetRecoilState(sessionState);
  const setQuestionData = useSetRecoilState(questionDataSelector);
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const endSession = async (id: string) => {
    useEffect(() => {
      toast.info("Due to Free Deployment,backend might take some time to respond. Please be patient.");
    }, []); // Ensure this is called only once
    try {
      await sessionService.endsession(id);
      setSession({
        id: "",
        domain: { id: 0, name: "" },
        description: "",
        userDomain: 0,
        started_at: "",
      });
      await userQuestionService.deleteUserQuestion(QuestionData.id);
      toast.success("Session ended successfully");
      clearsessionData();
      clearQuestionData();
    } catch (error) {
      console.error("Error ending session:", error);
      toast.error("Failed to end session. Please try again.");
      clearsessionData();
      clearQuestionData();
    } finally {
      navigate("/app/About");
    }
  };

  useAntiCheatProtection({
    maxWarnings: 3,
    onViolation: (count) => {
      console.warn(`Warning ${count}: Suspicious behavior detected!`);
      toast.warn(`Warning ${count}: Stay focused on the test.`);
    },
    onMaxViolation: async () => {
      toast.warn("Maximum number of warnings reached. You are disqualified.");
      await endSession(sessionValue.id);
    },
    blockContextMenu: true,
  });

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

  const handsubmitAnswer = async () => {
    if (!answer.trim()) {
      toast.error("Answer cannot be empty");
      return;
    }

    try {
      setLoading(true);
      const response = await responseService.createResponce({
        sessionID: sessionValue.id,
        UserQuestionID: QuestionData.id,
        answer,
        submitted_at: new Date().toISOString(),
      });

      const feedback = await responseService.createFeedback({
        ResponceId: response.responceID||"",
        Domain: sessionValue.domain.name,
        SessionID: sessionValue.id,
        Question: QuestionData.text,
        Answer: answer,
      });

      toast.success("Answer submitted successfully!");

      const newQuestion = await userQuestionService.createuserQuestion({
        UserDomainID: sessionValue.userDomain,
        SessionID: sessionValue.id,
        Explanation: feedback.Explanation,
        Questionnumber: QuestionData.Questionnumber + 1,
        Text: feedback.NextQuestion,
        Difficulty: feedback.NextQuestionDifficuilty,
      });

      setQuestionData({
        id: newQuestion.id,
        text: newQuestion.text,
        Questionnumber: QuestionData.Questionnumber + 1,
        Explanation: newQuestion.Explanation,
        difficulty: newQuestion.difficulty,
      });

      toast.success("Started attempting new question");
      setAnswer("");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Failed to submit answer or fetch next question.");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Card className="p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-2 sm:space-y-0">
          <div className="p-2 bg-purple-100 rounded-lg w-fit">
            <MessageSquare className="h-5 w-5 text-purple-600" />
          </div>
          <Badge variant={getDifficultyVariant(QuestionData?.difficulty || "")}>
            {QuestionData?.difficulty || "UNKNOWN"}
          </Badge>
        </div>

        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
          Question: {QuestionData?.text || "No question loaded"}
        </h2>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
          Explanation: {QuestionData?.Explanation || "No explanation available"}
        </h2>

        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={10}
          className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          placeholder="Write your answer here..."
        />

        <div className="flex justify-end">
          <Button
            onClick={handsubmitAnswer}
            className="text-lg px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {loading?<div className="w-12 h-12 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
:"Submit Answer"}
          </Button>
        </div>
      </Card>
    </div>
  );
};
