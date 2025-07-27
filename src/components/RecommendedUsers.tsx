import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { User, UserPlus, X } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

interface RecommendedUser {
  id: number;
  username: string;
  email: string;
  role: string;
  profilePictureUrl?: string;
  industry: string[];
  interests: string[];
  achievements: string[];
  reasonForRecommendation: string;
}

interface RecommendedUsersResponse {
  success: boolean;
  data: RecommendedUser[];
  total: number;
  message: string;
}

interface RecommendedUsersProps {
  token: string;
  limit?: number;
}

export const RecommendedUsers: React.FC<RecommendedUsersProps> = ({
  token,
  limit = 5,
}) => {
  const [followingStates, setFollowingStates] = useState<
    Record<number, boolean>
  >({});
  const [dismissedUsers, setDismissedUsers] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  // Fetch recommended users
  const {
    data: recommendedUsers,
    isLoading,
    isError,
    refetch,
  } = useQuery<RecommendedUsersResponse>({
    queryKey: ["recommendedUsers", limit],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:8080/api/v1/recommended/users?limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error("Failed to fetch recommended users");
      }
      return await res.json();
    },
    enabled: !!token,
  });

  const handleFollow = async (userId: number) => {
    setFollowingStates((prev) => ({ ...prev, [userId]: true }));
    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/connections/follow/${userId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to follow user");
      }

      toast({
        title: "Success!",
        description: "You are now following this user.",
      });

      // Remove the user from recommendations after following
      setDismissedUsers((prev) => new Set(prev).add(userId));
    } catch (error) {
      console.error("Failed to follow user:", error);
      toast({
        title: "Error",
        description: "Failed to follow user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setFollowingStates((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const handleDismiss = (userId: number) => {
    setDismissedUsers((prev) => new Set(prev).add(userId));
  };

  if (isLoading) {
    return (
      <Card className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        <CardHeader className="bg-white px-4 py-3 border-b border-gray-100">
          <CardTitle className="text-base font-semibold text-gray-900">
            People you may know
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            </div>
          </div>
          <div className="mt-4 flex space-x-2">
            <div className="flex-1 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="flex-1 h-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError || !recommendedUsers?.data) {
    return null; // Don't show anything if there's an error
  }

  // Filter out dismissed users
  const filteredUsers = recommendedUsers.data.filter(
    (user) => !dismissedUsers.has(user.id)
  );

  if (filteredUsers.length === 0) {
    return null; // Don't show the component if no users to recommend
  }

  return (
    <Card className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
      <CardHeader className="bg-white px-4 py-3 border-b border-gray-100">
        <CardTitle className="text-base font-semibold text-gray-900">
          People you may know
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="p-4 hover:bg-gray-50 transition-colors duration-150"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {user.profilePictureUrl ? (
                      <img
                        src={user.profilePictureUrl}
                        alt={user.username}
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-2 border-gray-100">
                        <User className="w-8 h-8 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-grow min-w-0">
                    <Link
                      to={`/user/${user.id}`}
                      className="font-semibold text-gray-900 hover:text-blue-600 block truncate text-sm"
                    >
                      {user.username}
                    </Link>
                    <p className="text-sm text-gray-600 capitalize mt-0.5">
                      {user.role}
                    </p>
                    {user.industry.length > 0 && (
                      <p className="text-xs text-gray-500 truncate mt-1">
                        {user.industry.slice(0, 2).join(" • ")}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDismiss(user.id)}
                  className="flex-shrink-0 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  title="Dismiss"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mb-3">
                <p className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-md inline-block">
                  {user.reasonForRecommendation}
                </p>
              </div>

              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => handleFollow(user.id)}
                  disabled={followingStates[user.id]}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-2 rounded-md transition-colors"
                >
                  <UserPlus className="w-3 h-3 mr-1.5" />
                  {followingStates[user.id] ? "Following..." : "Follow"}
                </Button>
                <Link to={`/user/${user.id}`} className="flex-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-xs font-medium px-3 py-2 border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md transition-colors"
                  >
                    View Profile
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length >= limit && (
          <div className="p-4 bg-gray-50 border-t border-gray-100">
            <Link
              to="/recommendations"
              className="block text-center text-blue-600 hover:text-blue-700 text-sm font-medium py-2 hover:bg-blue-50 rounded-md transition-colors"
            >
              See all recommendations
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendedUsers;
