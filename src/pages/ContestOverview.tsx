// contest-overview-page.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Clock, Calendar, Plus, Settings } from "lucide-react";

interface ContestOverviewProps {
  currentUserId: number;
}

const ContestOverviewPage = ({ currentUserId }: ContestOverviewProps) => {
  const navigate = useNavigate();

  const contestTypes = [
    {
      title: "Live Contests",
      description: "Join ongoing contests and compete in real-time",
      icon: <Trophy className="w-8 h-8 text-red-500" />,
      action: () => navigate("/contests/live"),
      gradient: "from-red-500 to-pink-500"
    },
    {
      title: "Upcoming Contests",
      description: "View and prepare for future contests",
      icon: <Clock className="w-8 h-8 text-blue-500" />,
      action: () => navigate("/contests/upcoming"),
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Past Contests",
      description: "Review previous contests and submissions",
      icon: <Calendar className="w-8 h-8 text-green-500" />,
      action: () => navigate("/contests/past"),
      gradient: "from-green-500 to-emerald-500"
    },
    {
      title: "Create Contest",
      description: "Design and host your own contest",
      icon: <Plus className="w-8 h-8 text-purple-500" />,
      action: () => navigate("/contests/create"),
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      title: "My Contests",
      description: "Manage contests you've created",
      icon: <Settings className="w-8 h-8 text-orange-500" />,
      action: () => navigate("/contests/myContests"),
      gradient: "from-orange-500 to-yellow-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Contest Hub
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Participate in exciting contests, showcase your skills, and compete with talented individuals from around the world.
          </p>
        </div>

        {/* Contest Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contestTypes.map((contest, index) => (
            <Card 
              key={index} 
              className="group relative overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border-0 bg-white/70 backdrop-blur-sm"
              onClick={contest.action}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${contest.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              <CardHeader className="relative z-10 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-full bg-gray-100 group-hover:bg-white transition-colors duration-300">
                    {contest.icon}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-300" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-gray-900">
                  {contest.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="relative z-10 pt-0">
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {contest.description}
                </p>
                <Button 
                  className={`w-full bg-gradient-to-r ${contest.gradient} hover:shadow-lg transform transition-all duration-200 hover:scale-105 border-0`}
                  onClick={(e) => {
                    e.stopPropagation();
                    contest.action();
                  }}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center bg-white/50 backdrop-blur-sm border-0">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Active Participants</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-white/50 backdrop-blur-sm border-0">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
              <div className="text-gray-600">Contests Hosted</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-white/50 backdrop-blur-sm border-0">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">1000+</div>
              <div className="text-gray-600">Submissions Made</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContestOverviewPage;