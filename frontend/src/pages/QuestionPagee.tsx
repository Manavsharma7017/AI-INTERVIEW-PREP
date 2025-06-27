import { useEffect, useState } from "react";
import type { Domain, Question } from "../types/types";
import { domainService } from "../services/domains";
import { userQuestionService } from "../services/UserQuestion";
import { Filter, MessageSquare } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { useNavigate } from "react-router-dom";

export const QuestionPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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
      const [questionsResponse, domainsResponse] = await Promise.all([
        userQuestionService.getAllUserQuestions(),
        domainService.getAllUserDomains(),
      ]);
      setQuestions(questionsResponse);
      setFilteredQuestions(questionsResponse);
      setDomains(domainsResponse);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterQuestions = () => {
    if (!filters.difficulty && !filters.domain) {
      setFilteredQuestions(questions);
      return;
    }

    userQuestionService
      .getQuestionByfilter({
        difficulty: filters.difficulty || null,
        domainID: filters.domain ? parseInt(filters.domain) : null,
      })
      .then((filtered) => setFilteredQuestions(filtered))
      .catch((err) => {
        console.error("Filter error:", err);
        setFilteredQuestions([]);
      });
  };

  const getDomainName = (domainId: number) => {
    const domain = domains.find((d) => d.id === domainId);
    return domain ? domain.name : `Domain ${domainId}`;
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="text-center sm:text-left">
        <h2 className="text-2xl font-bold text-gray-900">All Questions</h2>
        <p className="text-gray-600 text-sm sm:text-base">
          View interview questions across all domains
        </p>
      </div>

      {/* Filters */}
  <Card className="p-4 sm:p-6">
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between flex-wrap">
    {/* Filters */}
    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
      {/* Difficulty Filter with Icon */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-gray-500" />
        <select
          value={filters.difficulty}
          onChange={(e) =>
            setFilters({ ...filters, difficulty: e.target.value })
          }
          className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Difficulties</option>
          <option value="EASY">Easy</option>
          <option value="MEDIUM">Medium</option>
          <option value="HARD">Hard</option>
        </select>
      </div>

      {/* Domain Filter */}
      <select
        value={filters.domain}
        onChange={(e) =>
          setFilters({ ...filters, domain: e.target.value })
        }
        className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Domains</option>
        {domains.map((domain) => (
          <option key={domain.id} value={domain.id}>
            {domain.name}
          </option>
        ))}
      </select>
    </div>

    {/* Result Count */}
    <div className="text-sm text-gray-600 text-center sm:text-right w-full sm:w-auto">
      Showing{" "}
      <span className="font-medium">{filteredQuestions.length}</span> of{" "}
      <span className="font-medium">{questions.length}</span> questions
    </div>
  </div>
</Card>


      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((question) => (
          <Card
            key={question.id}
            className="p-4 sm:p-6 transition-shadow hover:shadow-xl hover:border-blue-200 cursor-pointer"
            
          >
            <div onClick={() => navigate(`/app/question/${question.id}`)} className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MessageSquare className="h-4 w-4 text-purple-600" />
                </div>
                <Badge variant={getDifficultyVariant(question.difficulty)}>
                  {question.difficulty}
                </Badge>
                <Badge variant="info">{getDomainName(question.domain_id)}</Badge>
              </div>

              <p className="text-gray-900 text-base sm:text-lg leading-relaxed">
                {question.text}
              </p>

              <p className="text-sm text-gray-500">
                Created: {new Date(question.created_at).toLocaleDateString()}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {filteredQuestions.length === 0 && (
        <Card className="p-8 sm:p-12 text-center">
          <MessageSquare className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {questions.length === 0
              ? "No questions yet"
              : "No questions match your filters"}
          </h3>
          <p className="text-gray-600 text-sm sm:text-base mb-6">
            {questions.length === 0
              ? "Create your first question to get started"
              : "Try adjusting your filters or create a new question"}
          </p>
        </Card>
      )}
    </div>
  );
};
