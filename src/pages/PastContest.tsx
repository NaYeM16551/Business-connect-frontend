// PastContestsPage.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Clock, 
  FileText, 
  Users, 
  ArrowLeft,
  Calendar,
  Award,
  BarChart3
} from "lucide-react";

interface Contest {
  id: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
}

const PastContestsPage = ({ currentUserId }: { currentUserId: number }) => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPastContests();
  }, [currentUserId]);

  const fetchPastContests = async () => {
    try {
      const response = await axios.get(`http://57.159.26.157:8080/api/v1/${currentUserId}/contests/PastContests`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setContests(response.data);
    } catch (err) {
      console.error("Error fetching past contests:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getContestDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    }
    return `${diffMinutes}m`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading past contests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/contests")}
            className="mb-4 hover:bg-white/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Contest Hub
          </Button>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-gray-600 to-blue-600 rounded-full mb-4">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-700 to-blue-600 bg-clip-text text-transparent mb-2">
              Past Contests
            </h1>
            <p className="text-gray-600 text-lg">Review completed contests and your performance</p>
          </div>
        </div>

        {/* Contests Grid */}
        {contests.length === 0 ? (
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Past Contests</h3>
              <p className="text-gray-500 mb-6">No contests have been completed yet. Check out live or upcoming contests!</p>
              <div className="space-x-4">
                <Button 
                  onClick={() => navigate("/contests/live")}
                  className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white"
                >
                  Live Contests
                </Button>
                <Button 
                  onClick={() => navigate("/contests/upcoming")}
                  variant="outline"
                  className="border-gray-300 hover:border-blue-500 hover:text-blue-600"
                >
                  Upcoming Contests
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contests.map((contest) => (
              <Card 
                key={contest.id} 
                className="group bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Trophy className="w-5 h-5 text-gray-600" />
                      <Badge className="bg-gray-100 text-gray-700">
                        Completed
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500">
                      {getContestDuration(contest.startTime, contest.endTime)}
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
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      Started: {formatDate(contest.startTime)}
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Clock className="w-4 h-4 mr-2" />
                      Ended: {formatDate(contest.endTime)}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/contests/${contest.id}/questions`)}
                      className="w-full border-gray-300 hover:border-blue-500 hover:text-blue-600"
                    >
                      <FileText className="w-3 h-3 mr-2" />
                      View Questions
                    </Button>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        size="sm"
                        onClick={() => navigate(`/contests/${contest.id}/my-submissions`)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        <FileText className="w-3 h-3 mr-1" />
                        My Submissions
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => navigate(`/contests/${contest.id}/leaderboard`)}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        <BarChart3 className="w-3 h-3 mr-1" />
                        Leaderboard
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Statistics Card */}
        {contests.length > 0 && (
          <Card className="mt-8 bg-gradient-to-r from-gray-50 to-blue-50 border-0">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-gray-600" />
                Your Contest History
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-white/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-700">{contests.length}</div>
                  <div className="text-sm text-gray-600">Contests Participated</div>
                </div>
                <div className="bg-white/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.floor(contests.reduce((total, contest) => {
                      const duration = getContestDuration(contest.startTime, contest.endTime);
                      const hours = parseInt(duration.split('h')[0]) || 0;
                      return total + hours;
                    }, 0))}h+
                  </div>
                  <div className="text-sm text-gray-600">Total Contest Time</div>
                </div>
                <div className="bg-white/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-600">--</div>
                  <div className="text-sm text-gray-600">Average Rank</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PastContestsPage;