import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  User, 
  Calendar, 
  Star, 
  Download, 
  ExternalLink,
  ArrowLeft,
  Trophy,
  GraduationCap,
  Clock
} from "lucide-react";

interface Submission {
  id: number;
  participantId: number;
  questionId: number;
  fileUrl: string;
  submittedAt: string;
  grade: number;
}

const ContestSubmissionsPage = ({ currentUserId }: { currentUserId: number }) => {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [grades, setGrades] = useState<{ [submissionId: number]: number }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [contestTitle, setContestTitle] = useState("");

  useEffect(() => {
    fetchSubmissions();
    fetchContestDetails();
  }, [contestId]);

  const fetchContestDetails = async () => {
    try {
      const response = await axios.get(`http://57.159.26.157:8080/api/v1/${currentUserId}/contests/${contestId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setContestTitle(response.data.title);
    } catch (err) {
      console.error("Failed to fetch contest details", err);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get(`http://57.159.26.157:8080/api/v1/${currentUserId}/contests/${contestId}/allsubmissions`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSubmissions(response.data);
      
      // Preload grades
      const gradeMap: { [id: number]: number } = {};
      response.data.forEach((s: Submission) => {
        gradeMap[s.id] = s.grade;
      });
      setGrades(gradeMap);
    } catch (err) {
      console.error("Failed to fetch submissions", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGradeChange = (submissionId: number, newGrade: number) => {
    setGrades((prev) => ({
      ...prev,
      [submissionId]: newGrade,
    }));
  };

  const handleUpdateGrade = async (submissionId: number) => {
    const grade = grades[submissionId];
    
    if (grade === undefined || grade < 0) {
      alert("Please enter a valid grade");
      return;
    }

    try {
      await axios.put(
        `http://57.159.26.157:8080/api/v1/${currentUserId}/contests/${contestId}/allsubmissions/${submissionId}/grade?grade=${grade}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert(`Grade updated for submission ${submissionId}`);
      fetchSubmissions();
    } catch (err) {
      console.error("Failed to update grade", err);
      alert("Failed to update grade");
    }
  };

  const getFileType = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase();
    return extension;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "bg-green-100 text-green-800";
    if (grade >= 70) return "bg-blue-100 text-blue-800";
    if (grade >= 50) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
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
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Contest Submissions
              </h1>
              <p className="text-gray-600">{contestTitle}</p>
            </div>
            <Card className="bg-white/70 backdrop-blur-sm border-0">
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {submissions.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Submissions</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Submissions */}
        {submissions.length === 0 ? (
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Submissions Found</h3>
              <p className="text-gray-500">No participants have submitted their solutions yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {submissions.map((submission) => (
              <Card key={submission.id} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full text-white font-semibold">
                        {submission.id}
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-800">
                          Submission #{submission.id}
                        </CardTitle>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <User className="w-4 h-4 mr-1" />
                            Participant {submission.participantId}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <FileText className="w-4 h-4 mr-1" />
                            Question {submission.questionId}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getGradeColor(submission.grade)}>
                        <Star className="w-3 h-3 mr-1" />
                        Grade: {submission.grade || 'Not Graded'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Submission Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <Calendar className="w-4 h-4 mr-1" />
                        Submitted At
                      </div>
                      <div className="font-medium">{formatDate(submission.submittedAt)}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <FileText className="w-4 h-4 mr-1" />
                        File Type
                      </div>
                      <div className="font-medium uppercase">{getFileType(submission.fileUrl) || 'Unknown'}</div>
                    </div>
                  </div>

                  {/* File Preview */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                      <FileText className="w-4 h-4 mr-1" />
                      Submission Preview
                    </h4>
                    <div className="submission-preview">
                      {submission.fileUrl.toLowerCase().endsWith(".pdf") ? (
                        <iframe
                          src={submission.fileUrl}
                          width="100%"
                          height="400px"
                          title="PDF Viewer"
                          className="border rounded-lg"
                        />
                      ) : getFileType(submission.fileUrl) === 'txt' ? (
                        <div className="bg-white border rounded-lg p-4 max-h-64 overflow-auto">
                          <iframe src={submission.fileUrl} width="100%" height="200px" />
                        </div>
                      ) : (
                        <img
                          src={submission.fileUrl}
                          alt="submission"
                          className="max-w-full max-h-64 object-contain border rounded-lg mx-auto"
                        />
                      )}
                    </div>
                    <div className="flex space-x-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(submission.fileUrl, "_blank")}
                        className="border-gray-300 hover:border-blue-500 hover:text-blue-600"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Open in New Tab
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(submission.fileUrl, "_blank")}
                        className="border-gray-300 hover:border-green-500 hover:text-green-600"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>

                  {/* Grading Section */}
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                      <GraduationCap className="w-4 h-4 mr-1" />
                      Grading
                    </h4>
                    <div className="flex items-center space-x-3">
                      <Input
                        type="number"
                        value={grades[submission.id] ?? ""}
                        onChange={(e) => handleGradeChange(submission.id, parseInt(e.target.value) || 0)}
                        placeholder="Enter grade (0-100)"
                        className="max-w-xs bg-white"
                        min="0"
                        max="100"
                      />
                      <Button
                        onClick={() => handleUpdateGrade(submission.id)}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                      >
                        Update Grade
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Summary Card */}
        {submissions.length > 0 && (
          <Card className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 border-0">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-purple-600" />
                Grading Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div className="bg-white/50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-purple-600">{submissions.length}</div>
                  <div className="text-sm text-gray-600">Total Submissions</div>
                </div>
                <div className="bg-white/50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-600">
                    {submissions.filter(s => s.grade > 0).length}
                  </div>
                  <div className="text-sm text-gray-600">Graded</div>
                </div>
                <div className="bg-white/50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-blue-600">
                    {submissions.filter(s => s.grade >= 70).length}
                  </div>
                  <div className="text-sm text-gray-600">Pass Grade (≥70)</div>
                </div>
                <div className="bg-white/50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-orange-600">
                    {submissions.length > 0 ? Math.round(submissions.reduce((acc, s) => acc + s.grade, 0) / submissions.length) : 0}
                  </div>
                  <div className="text-sm text-gray-600">Average Grade</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ContestSubmissionsPage;
