import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Calendar, 
  Bell, 
  ArrowLeft,
  Timer,
  Users,
  Trophy,
  Bookmark
} from "lucide-react";
import { format } from "date-fns";

interface Contest {
  id: number;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
}

interface UpcomingContestsPageProps {
  currentUserId: number;
}

const UpcomingContests: React.FC<UpcomingContestsPageProps> = ({ currentUserId }) => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchContests();
  }, [currentUserId]);

  const fetchContests = async () => {
    try {
      const response = await axios.get(`http://57.159.26.157:8080/api/v1/${currentUserId}/contests/UpcomingContests`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setContests(response.data);
    } catch (err: unknown) {
      setError("Failed to load contests");
    } finally {
      setLoading(false);
    }
  };

  const getTimeUntilStart = (startTime: string) => {
    const now = new Date().getTime();
    const start = new Date(startTime).getTime();
    const diff = start - now;

    if (diff <= 0) return "Starting soon";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading upcoming contests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="text-center py-12">
            <div className="text-red-600 text-lg">{error}</div>
            <Button 
              onClick={fetchContests}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6">
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-4">
              <Timer className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              Upcoming Contests
            </h1>
            <p className="text-gray-600 text-lg">Prepare for future contests and mark your calendar</p>
          </div>
        </div>

        {/* Contests Content */}
        {contests.length === 0 ? (
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Upcoming Contests</h3>
              <p className="text-gray-500 mb-6">No contests are scheduled at the moment. Check back later or create your own!</p>
              <div className="space-x-4">
                <Button 
                  onClick={() => navigate("/contests/live")}
                  className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white"
                >
                  Live Contests
                </Button>
                <Button 
                  onClick={() => navigate("/contests/create")}
                  variant="outline"
                  className="border-gray-300 hover:border-blue-500 hover:text-blue-600"
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  Create Contest
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {contests.map((contest) => (
              <Card key={contest.id} className="group bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full">
                        <Trophy className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-bold text-blue-600 mb-1">
                          {contest.name}
                        </CardTitle>
                        <div className="flex items-center space-x-4">
                          <Badge className="bg-blue-100 text-blue-800 flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>Starts in {getTimeUntilStart(contest.startTime)}</span>
                          </Badge>
                          <Badge variant="outline" className="border-gray-300 text-gray-700">
                            Duration: {getContestDuration(contest.startTime, contest.endTime)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-blue-300 text-blue-600 hover:bg-blue-50"
                    >
                      <Bookmark className="w-4 h-4 mr-1" />
                      Remind Me
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 leading-relaxed">
                      {contest.description}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                        <div>
                          <div className="font-medium">Start Time</div>
                          <div>{format(new Date(contest.startTime), "PPPpp")}</div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2 text-blue-500" />
                        <div>
                          <div className="font-medium">End Time</div>
                          <div>{format(new Date(contest.endTime), "PPPpp")}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        Participants: TBA
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm"
                        variant="outline"
                        className="border-gray-300 hover:border-blue-500 hover:text-blue-600"
                      >
                        <Bell className="w-3 h-3 mr-1" />
                        Set Reminder
                      </Button>
                      <Button 
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Tips Card */}
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-cyan-50 border-0">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              <Timer className="w-5 h-5 mr-2 text-blue-600" />
              Preparation Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="bg-white/50 rounded-lg p-4">
                <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Plan Ahead
                </h4>
                <p>Mark your calendar and set reminders for upcoming contests</p>
              </div>
              <div className="bg-white/50 rounded-lg p-4">
                <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Practice
                </h4>
                <p>Review past contest questions to sharpen your skills</p>
              </div>
              <div className="bg-white/50 rounded-lg p-4">
                <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                  <Bell className="w-4 h-4 mr-1" />
                  Stay Updated
                </h4>
                <p>Check for any last-minute updates or announcements</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UpcomingContests;
