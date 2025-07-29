import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Clock, 
  Users, 
  Play, 
  ArrowLeft,
  Zap,
  Calendar
} from "lucide-react";

interface Contest {
  id: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
}

interface LiveContestsPageProps {
  currentUserId: number;
}

const LiveContestsPage = ({ currentUserId }: LiveContestsPageProps) => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLiveContests();
  }, [currentUserId]);

  const fetchLiveContests = async () => {
    try {
      console.log("Fetching live contests for user:", currentUserId);
      const response = await axios.get(`http://57.159.26.157:8080/api/v1/${currentUserId}/contests/LiveContests`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Fetched contests:", response.data);
      setContests(response.data);
    } catch (err) {
      console.error("Error fetching contests:", err);
      setContests([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getTimeRemaining = (endTime: string) => {
    const now = new Date().getTime();
    const end = new Date(endTime).getTime();
    const diff = end - now;

    if (diff <= 0) return "Ended";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m left`;
    }
    return `${minutes}m left`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading live contests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 p-6">
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">
              Live Contests
            </h1>
            <p className="text-gray-600 text-lg">Join ongoing contests and compete in real-time</p>
          </div>
        </div>

        {/* Live Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center bg-red-100 text-red-800 px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
            <span className="font-medium">LIVE NOW</span>
          </div>
        </div>

        {/* Contests Grid */}
        {contests.length === 0 ? (
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="text-center py-12">
              <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Live Contests</h3>
              <p className="text-gray-500 mb-6">There are currently no live contests. Check back later or explore upcoming contests.</p>
              <div className="space-x-4">
                <Button 
                  onClick={() => navigate("/contests/upcoming")}
                  variant="outline"
                  className="border-gray-300 hover:border-blue-500 hover:text-blue-600"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Upcoming Contests
                </Button>
                <Button 
                  onClick={() => navigate("/contests/create")}
                  className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white"
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  Create Contest
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contests.map((contest) => (
              <Card 
                key={contest.id} 
                className="group bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer relative overflow-hidden"
                onClick={() => navigate(`/contests/live/${contest.id}`)}
              >
                {/* Live indicator */}
                <div className="absolute top-4 right-4">
                  <Badge className="bg-red-500 text-white animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
                    LIVE
                  </Badge>
                </div>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <CardHeader className="relative z-10 pb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Trophy className="w-5 h-5 text-red-600" />
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-800 line-clamp-2 group-hover:text-red-700 transition-colors">
                    {contest.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="relative z-10 space-y-4">
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {contest.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="font-medium text-red-600">
                        {getTimeRemaining(contest.endTime)}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      Ends: {new Date(contest.endTime).toLocaleString()}
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold transform transition-all duration-200 hover:scale-105"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/contests/live/${contest.id}`);
                    }}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Join Contest
                  </Button>
                </CardContent>

                {/* Animated border */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </Card>
            ))}
          </div>
        )}

        {/* Info Card */}
        <Card className="mt-8 bg-gradient-to-r from-red-50 to-orange-50 border-0">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-red-600" />
              Live Contest Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="bg-white/50 rounded-lg p-3">
                <h4 className="font-medium text-gray-700 mb-1">⚡ Quick Start</h4>
                <p>Join immediately to maximize your competition time</p>
              </div>
              <div className="bg-white/50 rounded-lg p-3">
                <h4 className="font-medium text-gray-700 mb-1">🎯 Stay Focused</h4>
                <p>Read questions carefully and manage your time well</p>
              </div>
              <div className="bg-white/50 rounded-lg p-3">
                <h4 className="font-medium text-gray-700 mb-1">🏆 Good Luck</h4>
                <p>Give your best effort and enjoy the competition</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LiveContestsPage;
