import { getCurrentUserIdFromToken } from "@/auth";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import {
  Filter,
  MessageSquare,
  Search,
  User,
  UserMinus,
  Users as UsersIcon,
} from "lucide-react";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";

interface Connection {
  id: number;
  username: string;
  email?: string;
  role?: string;
  industry?: string[];
  interests?: string[];
  achievements?: string[];
  profilePictureUrl?: string | null;
  followedAt?: string;
}

export default function MyNetwork() {
  const token = localStorage.getItem("token") || "";
  const currentUserId = getCurrentUserIdFromToken();
  const [searchTerm, setSearchTerm] = useState("");
  const [unfollowingStates, setUnfollowingStates] = useState<
    Record<number, boolean>
  >({});
  const { toast } = useToast();

  // Fetch user's connections (following list)
  const {
    data: connections,
    isLoading,
    isError,
    refetch,
  } = useQuery<Connection[]>({
    queryKey: ["myConnections"],
    queryFn: async () => {
      const res = await fetch(
        "http://57.159.26.157:8080/api/v1/connections/following",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ API Error:", errorText);
        throw new Error("Failed to fetch connections");
      }
      const data = await res.json();
      return data;
    },
    enabled: !!token,
  });

  const handleUnfollow = async (userId: number) => {
    setUnfollowingStates((prev) => ({ ...prev, [userId]: true }));
    try {
      const res = await fetch(
        `http://57.159.26.157:8080/api/v1/connections/unfollow/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to unfollow user");
      }

      toast({
        title: "Success!",
        description: "You have unfollowed this user.",
      });

      // Refetch connections to update the list
      refetch();
    } catch (error) {
      console.error("Failed to unfollow user:", error);
      toast({
        title: "Error",
        description: "Failed to unfollow user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUnfollowingStates((prev) => ({ ...prev, [userId]: false }));
    }
  };

  // Filter connections based on search term
  const filteredConnections =
    connections?.filter(
      (connection) =>
        connection.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        connection.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        connection.industry?.some((ind) =>
          ind.toLowerCase().includes(searchTerm.toLowerCase())
        )
    ) || [];

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <div className="max-w-6xl mx-auto py-6 px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <p>Loading your network...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <div className="max-w-6xl mx-auto py-6 px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-red-600">Failed to load your network</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />

      <main className="max-w-6xl mx-auto py-6 px-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                My Network
              </h1>
              <p className="text-slate-600">
                Manage your professional connections •{" "}
                {connections?.length || 0} connections
              </p>
            </div>
            {currentUserId && (
              <div className="mt-4 md:mt-0">
                <Link to={`/user/${currentUserId}`}>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <User className="w-4 h-4 mr-2" />
                    View My Profile
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Search and Filter Bar */}
        <Card className="bg-white shadow-sm mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search your connections..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Connections Grid */}
        {filteredConnections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredConnections.map((connection) => (
              <Card
                key={connection.id}
                className="bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="relative inline-block">
                      {connection.profilePictureUrl ? (
                        <img
                          src={connection.profilePictureUrl}
                          alt={connection.username}
                          className="w-20 h-20 rounded-full object-cover mx-auto border-4 border-white shadow-lg"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto border-4 border-white shadow-lg">
                          <User className="w-10 h-10 text-white" />
                        </div>
                      )}
                    </div>

                    <div className="mt-3">
                      <Link
                        to={`/user/${connection.id}`}
                        className="font-semibold text-lg text-gray-900 hover:text-blue-600 block"
                      >
                        {connection.username}
                      </Link>
                      {connection.role && (
                        <p className="text-gray-600 text-sm capitalize mt-1">
                          {connection.role}
                        </p>
                      )}
                      {connection.industry &&
                        connection.industry.length > 0 && (
                          <p className="text-gray-500 text-xs mt-1">
                            {connection.industry.slice(0, 2).join(" • ")}
                          </p>
                        )}
                    </div>
                  </div>

                  {/* Connection Info */}
                  {connection.followedAt && (
                    <div className="text-center mb-4">
                      <p className="text-xs text-gray-500">
                        Connected on{" "}
                        {new Date(connection.followedAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Link to={`/chat/${connection.id}`} className="flex-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs"
                      >
                        <MessageSquare className="w-3 h-3 mr-1" />
                        Message
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUnfollow(connection.id)}
                      disabled={unfollowingStates[connection.id]}
                      className="flex-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <UserMinus className="w-3 h-3 mr-1" />
                      {unfollowingStates[connection.id]
                        ? "Removing..."
                        : "Unfollow"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : searchTerm ? (
          <Card className="bg-white shadow-sm">
            <CardContent className="p-12 text-center">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No connections found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search terms or clear the search to see all
                connections.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setSearchTerm("")}
              >
                Clear Search
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white shadow-sm">
            <CardContent className="p-12 text-center">
              <UsersIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No connections yet
              </h3>
              <p className="text-gray-500 mb-6">
                Start building your professional network by connecting with
                colleagues, industry experts, and potential partners.
              </p>
              <Link to="/feed">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Discover People
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Network Stats */}
        {connections && connections.length > 0 && (
          <Card className="bg-white shadow-sm mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Network Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {connections.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Connections</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {new Set(connections.flatMap((c) => c.industry || [])).size}
                  </div>
                  <div className="text-sm text-gray-600">Industries</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {
                      new Set(connections.map((c) => c.role).filter(Boolean))
                        .size
                    }
                  </div>
                  <div className="text-sm text-gray-600">Roles</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
