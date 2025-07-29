
// ContestQuestionsPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  HelpCircle, 
  Star, 
  Plus, 
  ArrowLeft, 
  FileText,
  Award 
} from "lucide-react";

const ContestQuestionsPage = ({ currentUserId }: { currentUserId: number }) => {
  const { contestId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [contestTitle, setContestTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, [contestId, currentUserId]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`http://57.159.26.157:8080/api/v1/${currentUserId}/contests/${contestId}/GetAllQuestions`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setQuestions(response.data);
    } catch (err) {
      console.error("Error fetching questions", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getMarksDifficulty = (marks: number) => {
    if (marks <= 3) return { label: "Easy", color: "bg-green-100 text-green-800" };
    if (marks <= 7) return { label: "Medium", color: "bg-yellow-100 text-yellow-800" };
    return { label: "Hard", color: "bg-red-100 text-red-800" };
  };

  const totalMarks = questions.reduce((sum, q) => sum + (q.marks || 0), 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/contests/myContests")}
            className="mb-4 hover:bg-white/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to My Contests
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Contest Questions
              </h1>
              <p className="text-gray-600">Manage questions for your contest</p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    {questions.length} Questions
                  </div>
                  <div className="flex items-center mt-1">
                    <Award className="w-4 h-4 mr-1" />
                    {totalMarks} Total Marks
                  </div>
                </div>
                <Button 
                  onClick={() => navigate(`/contests/${contestId}/add-question`)}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Question
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Questions List */}
        {questions.length === 0 ? (
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Questions Yet</h3>
              <p className="text-gray-500 mb-6">Start building your contest by adding the first question</p>
              <Button 
                onClick={() => navigate(`/contests/${contestId}/add-question`)}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Question
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {questions.map((question, index) => {
              const difficulty = getMarksDifficulty(question.marks);
              return (
                <Card key={question.id} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <CardTitle className="text-lg font-bold text-gray-800">
                            Question {index + 1}
                          </CardTitle>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={difficulty.color}>
                          {difficulty.label}
                        </Badge>
                        <div className="flex items-center bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm">
                          <Star className="w-3 h-3 mr-1" />
                          {question.marks} marks
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 leading-relaxed">
                        {question.title}
                      </p>
                    </div>
                    {question.description && (
                      <div className="mt-3 text-sm text-gray-600">
                        <strong>Description:</strong> {question.description}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Summary Card */}
        {questions.length > 0 && (
          <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-0">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-blue-600" />
                Contest Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div className="bg-white/50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-blue-600">{questions.length}</div>
                  <div className="text-sm text-gray-600">Total Questions</div>
                </div>
                <div className="bg-white/50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-600">{questions.filter(q => q.marks <= 3).length}</div>
                  <div className="text-sm text-gray-600">Easy Questions</div>
                </div>
                <div className="bg-white/50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-yellow-600">{questions.filter(q => q.marks > 3 && q.marks <= 7).length}</div>
                  <div className="text-sm text-gray-600">Medium Questions</div>
                </div>
                <div className="bg-white/50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-red-600">{questions.filter(q => q.marks > 7).length}</div>
                  <div className="text-sm text-gray-600">Hard Questions</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ContestQuestionsPage;