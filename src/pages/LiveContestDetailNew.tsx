import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Clock, 
  Trophy, 
  Star, 
  FileText, 
  Upload, 
  Check, 
  Trash2, 
  Download,
  ArrowLeft,
  Timer,
  AlertCircle
} from "lucide-react";

interface Question {
  id: number;
  title: string;
  marks: number;
  attachmentUrl: string;
  submitted?: boolean;
  fileUrl?: string;
  submissionId?: number;
}

interface LiveContestDetailPageProps {
  currentUserId: number;
}

const LiveContestDetailPage = ({ currentUserId }: LiveContestDetailPageProps) => {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [remainingTime, setRemainingTime] = useState<string>("");
  const [contestTitle, setContestTitle] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchContestData();
  }, [contestId, currentUserId]);

  const fetchContestData = async () => {
    try {
      // Fetch questions
      const questionsRes = await axios.get(`http://57.159.26.157:8080/api/v1/${currentUserId}/contests/${contestId}/GetAllQuestions`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setQuestions(questionsRes.data);

      // Fetch contest details and setup timer
      const contestRes = await axios.get(`http://57.159.26.157:8080/api/v1/${currentUserId}/contests/${contestId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      setContestTitle(contestRes.data.title);
      const endTime = new Date(contestRes.data.endTime).getTime();
      
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const diff = endTime - now;
        if (diff <= 0) {
          clearInterval(timer);
          setRemainingTime("Contest Ended");
        } else {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          
          if (hours > 0) {
            setRemainingTime(`${hours}h ${minutes}m ${seconds}s left`);
          } else {
            setRemainingTime(`${minutes}m ${seconds}s left`);
          }
        }
      }, 1000);

      return () => clearInterval(timer);
    } catch (err) {
      console.error("Error fetching contest data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (questionId: number, file: File | null) => {
    if (!file) {
      alert("Please select a file to submit");
      return;
    }

    const question = questions.find((q) => q.id === questionId);
    if (question?.submitted) {
      alert("Submission already exists. Delete it before submitting again.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        `http://57.159.26.157:8080/api/v1/${currentUserId}/contests/${contestId}/questions/${questionId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Submitted successfully!");

      // Update UI state
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId
            ? {
                ...q,
                submitted: true,
                submissionId: res.data.submissionId,
                fileUrl: res.data.fileUrl,
              }
            : q
        )
      );
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Submission failed. Please try again.");
    }
  };

  const handleDelete = async (questionId: number, submissionId: number) => {
    if (!confirm("Are you sure you want to delete this submission?")) {
      return;
    }

    try {
      await axios.delete(`http://57.159.26.157:8080/api/v1/${currentUserId}/contests/${contestId}/submissions/${submissionId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Submission deleted successfully!");

      // Update UI
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId
            ? { ...q, submitted: false, submissionId: undefined, fileUrl: undefined }
            : q
        )
      );
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete submission.");
    }
  };

  const downloadSubmission = async (fileUrl: string) => {
    try {
      const response = await axios.get(fileUrl, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const extension = fileUrl.split('.').pop()?.split('?')[0] || 'png';

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `submission.${extension}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download failed", err);
      alert("Download failed");
    }
  };

  const getMarksDifficulty = (marks: number) => {
    if (marks <= 3) return { label: "Easy", color: "bg-green-100 text-green-800" };
    if (marks <= 7) return { label: "Medium", color: "bg-yellow-100 text-yellow-800" };
    return { label: "Hard", color: "bg-red-100 text-red-800" };
  };

  const submittedCount = questions.filter(q => q.submitted).length;
  const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
  const earnedMarks = questions.filter(q => q.submitted).reduce((sum, q) => sum + q.marks, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contest...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/contests/live")}
            className="mb-4 hover:bg-white/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Live Contests
          </Button>
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{contestTitle}</h1>
              <div className="flex items-center space-x-4">
                <Badge className="bg-red-500 text-white animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
                  LIVE
                </Badge>
                <div className="flex items-center text-red-600 font-semibold">
                  <Timer className="w-4 h-4 mr-1" />
                  {remainingTime}
                </div>
              </div>
            </div>
            
            {/* Progress Summary */}
            <Card className="bg-white/70 backdrop-blur-sm border-0">
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {submittedCount}/{questions.length}
                  </div>
                  <div className="text-sm text-gray-600">Questions Submitted</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {earnedMarks}/{totalMarks} marks
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {questions.map((question, index) => {
            const difficulty = getMarksDifficulty(question.marks);
            
            return (
              <Card key={question.id} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full text-white font-semibold text-sm">
                        {index + 1}
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-800">
                        Question {index + 1}
                      </CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={difficulty.color}>
                        {difficulty.label}
                      </Badge>
                      <div className="flex items-center bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm">
                        <Star className="w-3 h-3 mr-1" />
                        {question.marks} marks
                      </div>
                      {question.submitted && (
                        <Badge className="bg-green-100 text-green-800">
                          <Check className="w-3 h-3 mr-1" />
                          Submitted
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 leading-relaxed">
                      {question.title}
                    </p>
                  </div>

                  {question.attachmentUrl && (
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-700 font-medium">Attachment Available</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2 border-blue-300 text-blue-600 hover:bg-blue-50"
                        onClick={() => window.open(question.attachmentUrl, "_blank")}
                      >
                        View Attachment
                      </Button>
                    </div>
                  )}

                  {/* Submission Area */}
                  <div className="border-t pt-4">
                    {question.submitted && question.fileUrl ? (
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Check className="w-5 h-5 text-green-600" />
                            <span className="text-green-700 font-medium">Submission Complete</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => downloadSubmission(question.fileUrl!)}
                              className="border-green-300 text-green-600 hover:bg-green-50"
                            >
                              <Download className="w-3 h-3 mr-1" />
                              Download
                            </Button>
                            {question.submissionId && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDelete(question.id, question.submissionId!)}
                              >
                                <Trash2 className="w-3 h-3 mr-1" />
                                Delete
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-3">
                          <Upload className="w-4 h-4 text-gray-600" />
                          <span className="font-medium text-gray-700">Submit Your Solution</span>
                        </div>
                        <Input
                          type="file"
                          onChange={(e) => handleSubmit(question.id, e.target.files?.[0] || null)}
                          className="bg-white border-gray-300"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          Upload your solution file. Accepted formats: .pdf, .doc, .txt, .zip, etc.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer Info */}
        <Card className="mt-8 bg-gradient-to-r from-red-50 to-orange-50 border-0">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 mb-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <h3 className="font-semibold text-gray-800">Contest Guidelines</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-700 mb-1">Submission Rules:</h4>
                <ul className="space-y-1">
                  <li>• Submit before time runs out</li>
                  <li>• You can delete and resubmit</li>
                  <li>• Only one file per question</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-1">Tips:</h4>
                <ul className="space-y-1">
                  <li>• Read questions carefully</li>
                  <li>• Check file size limits</li>
                  <li>• Save frequently</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LiveContestDetailPage;
