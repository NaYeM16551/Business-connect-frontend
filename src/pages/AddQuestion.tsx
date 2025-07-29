// AddQuestionPage.tsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, HelpCircle, Star } from "lucide-react";

const AddQuestionPage = ({ currentUserId }: { currentUserId: number }) => {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [marks, setMarks] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !marks.trim()) {
      alert("Please fill in all fields");
      return;
    }

    if (isNaN(Number(marks)) || Number(marks) <= 0) {
      alert("Please enter a valid positive number for marks");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(
        `http://57.159.26.157:8080/api/v1/${currentUserId}/contests/${contestId}/MakeQuestion`,
        { contestId, title, marks },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      navigate(`/contests/${contestId}/questions`);
    } catch (err) {
      console.error("Error creating question", err);
      alert("Failed to create question. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/contests/${contestId}/questions`)}
            className="mb-4 hover:bg-white/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Questions
          </Button>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-4">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Add Question
            </h1>
            <p className="text-gray-600">Create a new question for your contest</p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-semibold text-gray-800 flex items-center justify-center">
              <HelpCircle className="w-6 h-6 mr-2 text-green-600" />
              Question Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Question Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                Question Title
              </Label>
              <Textarea
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a clear and detailed question..."
                className="min-h-[120px] bg-white/50 border-gray-200 focus:border-green-500 focus:ring-green-500 resize-none"
              />
              <p className="text-xs text-gray-500">
                Provide a comprehensive question that participants can understand easily
              </p>
            </div>

            {/* Marks Field */}
            <div className="space-y-2">
              <Label htmlFor="marks" className="text-sm font-medium text-gray-700 flex items-center">
                <Star className="w-4 h-4 mr-1 text-yellow-500" />
                Marks
              </Label>
              <Input
                id="marks"
                type="number"
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                placeholder="Enter marks for this question..."
                min="1"
                className="h-12 bg-white/50 border-gray-200 focus:border-green-500 focus:ring-green-500"
              />
              <p className="text-xs text-gray-500">
                Assign appropriate marks based on question difficulty
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button 
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Adding Question...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Question
                  </div>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Guidelines Card */}
        <Card className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 border-0">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              <HelpCircle className="w-4 h-4 mr-2 text-green-600" />
              Question Guidelines
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-700 mb-1">Quality Tips:</h4>
                <ul className="space-y-1">
                  <li>• Be clear and specific</li>
                  <li>• Avoid ambiguous language</li>
                  <li>• Include examples if needed</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-1">Marks Assignment:</h4>
                <ul className="space-y-1">
                  <li>• Easy: 1-3 marks</li>
                  <li>• Medium: 4-7 marks</li>
                  <li>• Hard: 8+ marks</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddQuestionPage;