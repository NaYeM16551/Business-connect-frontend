import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Eye, Globe, Lock } from "lucide-react";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

interface CreateGroupData {
  name: string;
  type:string;
  description: string;
  privacy: "PUBLIC" | "CLOSED" | "PRIVATE";
  coverImage?: string;
}

export default function CreateGroup() {
  const token = localStorage.getItem("token") || "";
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState<CreateGroupData>({
    name: "",
    type:"",
    description: "",
    privacy: "PUBLIC",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.description.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      
      const res = await fetch("http://57.159.26.157:8080/api/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error(`Failed to create group: ${res.status}`);
      }

      const newGroup = await res.json();

      toast({
        title: "Success!",
        description: "Group created successfully.",
      });

      navigate(`/groups/${newGroup.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create group. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof CreateGroupData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    console.log(`Updated ${field}:`, value);
  };

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />

      <main className="max-w-2xl mx-auto py-6 px-4">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-slate-900">
            Create New Group
          </h1>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle>Group Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Group Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Group Name *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter group name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>
              
              {/* group type*/}
              <div className="space-y-2">
                <Label htmlFor="typeofthegroup">Group Type *</Label>
                <Input
                  id="type"
                  type="text"
                  placeholder="Enter group type"
                  value={formData.type}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your group's purpose and activities"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={4}
                  required
                />
              </div>

              {/* Cover Image */}
              <div className="space-y-2">
                <Label htmlFor="coverImage">Cover Image URL (Optional)</Label>
                <Input
                  id="coverImage"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.coverImage || ""}
                  onChange={(e) =>
                    handleInputChange("coverImage", e.target.value)
                  }
                />
              </div>

              {/* Privacy Settings */}
              <div className="space-y-4">
                <Label>Privacy Settings *</Label>
                <RadioGroup
                  value={formData.privacy}
                  onValueChange={(value) => handleInputChange("privacy", value)}
                  className="space-y-3"
                >
                  <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-slate-50">
                    <RadioGroupItem
                      value="PUBLIC"
                      id="public"
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Globe className="w-4 h-4 text-green-600" />
                        <Label htmlFor="public" className="font-medium">
                          Public
                        </Label>
                      </div>
                      <p className="text-sm text-slate-600">
                        Anyone can see and join this group without approval.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-slate-50">
                    <RadioGroupItem
                      value="CLOSED"
                      id="closed"
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Eye className="w-4 h-4 text-yellow-600" />
                        <Label htmlFor="closed" className="font-medium">
                          Closed
                        </Label>
                      </div>
                      <p className="text-sm text-slate-600">
                        Anyone can see the group, but membership requires
                        approval.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-slate-50">
                    <RadioGroupItem
                      value="PRIVATE"
                      id="private"
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Lock className="w-4 h-4 text-red-600" />
                        <Label htmlFor="private" className="font-medium">
                          Private
                        </Label>
                      </div>
                      <p className="text-sm text-slate-600">
                        Only members can see the group and its content.
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Submit Button */}
              <div className="flex space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting ? "Creating..." : "Create Group"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
