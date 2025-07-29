// CreateContestPage.tsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, Trophy, ArrowLeft } from "lucide-react";

const CreateContestPage = ({ currentUserId }: { currentUserId: number }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !startTime || !endTime) {
      alert("Please fill in all fields");
      return;
    }

    if (new Date(startTime) >= new Date(endTime)) {
      alert("End time must be after start time");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(
        `http://57.159.26.157:8080/api/v1/${currentUserId}/contests/create`,
        {title, description, startTime, endTime, createdBy : currentUserId},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      navigate("/contests/myContests");
    } catch (err) {
      console.error("Failed to create contest", err);
      alert("Failed to create contest. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-2xl mx-auto">
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
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Create Contest
            </h1>
            <p className="text-gray-600">Design an engaging contest for the community</p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-semibold text-gray-800">Contest Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title Field */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                Contest Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter an engaging contest title..."
                className="h-12 bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your contest, rules, and objectives..."
                className="min-h-[120px] bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Time Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime" className="text-sm font-medium text-gray-700 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Start Time
                </Label>
                <Input
                  id="startTime"
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="h-12 bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime" className="text-sm font-medium text-gray-700 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  End Time
                </Label>
                <Input
                  id="endTime"
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="h-12 bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button 
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Contest...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Trophy className="w-4 h-4 mr-2" />
                    Create Contest
                  </div>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tips Card */}
        <Card className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 border-0">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-gray-800 mb-2">💡 Tips for a Great Contest</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Choose a clear and descriptive title</li>
              <li>• Provide detailed rules and objectives</li>
              <li>• Set realistic time constraints</li>
              <li>• Ensure adequate time for participants to prepare</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateContestPage;