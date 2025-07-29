import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Users, 
  Plus, 
  Play, 
  Square, 
  Eye, 
  FileText, 
  Calendar,
  Clock,
  ArrowLeft 
} from "lucide-react";

const MyContestsPage = ({ currentUserId }: { currentUserId: number }) => {
  const [contests, setContests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchContests();
  }, [currentUserId]);

  const fetchContests = async () => {
    try {
      const response = await axios.get(`http://57.159.26.157:8080/api/v1/${currentUserId}/contests/myContests`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setContests(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartContest = async (contestId: number) => {
    try {
      await axios.put(`http://57.159.26.157:8080/api/v1/${currentUserId}/contests/${contestId}/start`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Contest started!");
      fetchContests();
    } catch (err) {
      console.error("Failed to start contest", err);
      alert("Failed to start contest");
    }
  };

  const handleFinishContest = async (contestId: number) => {
    try {
      await axios.put(`http://57.159.26.157:8080/api/v1/${currentUserId}/contests/${contestId}/finish`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Contest finished!");
      fetchContests();
    } catch (err) {
      console.error("Failed to finish contest", err);
      alert("Failed to finish contest");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'live': return 'bg-green-500 text-white';
      case 'upcoming': return 'bg-blue-500 text-white';
      case 'past': return 'bg-gray-500 text-white';
      default: return 'bg-gray-300 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'live': return <Play className="w-3 h-3" />;
      case 'upcoming': return <Clock className="w-3 h-3" />;
      case 'past': return <Square className="w-3 h-3" />;
      default: return <Calendar className="w-3 h-3" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your contests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4 hover:bg-white/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                My Contests
              </h1>
              <p className="text-gray-600">Manage and monitor your created contests</p>
            </div>
            <Button 
              onClick={() => navigate("/contests/create")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Contest
            </Button>
          </div>
        </div>

        {/* Contests Grid */}
        {contests.length === 0 ? (
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="text-center py-12">
              <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Contests Yet</h3>
              <p className="text-gray-500 mb-6">Start by creating your first contest to engage with the community</p>
              <Button 
                onClick={() => navigate("/contests/create")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Contest
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contests.map((contest) => (
              <Card key={contest.id} className="group bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Trophy className="w-5 h-5 text-blue-600" />
                      <Badge className={`${getStatusColor(contest.status)} flex items-center space-x-1`}>
                        {getStatusIcon(contest.status)}
                        <span className="text-xs font-medium">{contest.status}</span>
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-800 line-clamp-2">
                    {contest.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {contest.description}
                  </p>
                  
                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/contests/${contest.id}/questions`)}
                        className="w-full border-gray-300 hover:border-blue-500 hover:text-blue-600"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Questions
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/contests/${contest.id}/add-question`)}
                        className="w-full border-gray-300 hover:border-green-500 hover:text-green-600"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Question
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleStartContest(contest.id)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Start
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleFinishContest(contest.id)}
                        className="w-full bg-red-600 hover:bg-red-700 text-white"
                      >
                        <Square className="w-3 h-3 mr-1" />
                        Finish
                      </Button>
                    </div>
                    
                    {contest.status === "PAST" && (
                      <Button
                        size="sm"
                        onClick={() => navigate(`/contests/${contest.id}/submissions`)}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        <FileText className="w-3 h-3 mr-1" />
                        View Submissions
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyContestsPage;
