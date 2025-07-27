import { getCurrentUserIdFromToken } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, User } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

interface ProfileCardProps {
  token: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ token }) => {
  const currentUserId = getCurrentUserIdFromToken();

  if (!currentUserId) {
    return null;
  }

  return (
    <Card className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
      <CardContent className="p-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-3">
            <User className="w-8 h-8 text-white" />
          </div>

          <h3 className="font-semibold text-gray-900 mb-2">Your Profile</h3>
          <p className="text-sm text-gray-600 mb-4">
            View and edit your professional profile
          </p>

          <Link to={`/user/${currentUserId}`} className="w-full">
            <Button
              variant="outline"
              className="w-full text-sm border-blue-300 text-blue-600 hover:bg-blue-50"
            >
              <Eye className="w-4 h-4 mr-2" />
              View My Profile
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
