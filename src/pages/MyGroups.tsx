import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Eye, Globe, Lock, Plus, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";

interface Group {
  id: number;
  name: string;
  description: string;
  privacy: "PUBLIC" | "CLOSED" | "PRIVATE";
  ownerId: number;
  ownerName: string;
  createdAt: string;
  coverImage?: string;
  memberCount: number;
  postCount: number;
  isMember: boolean;
  userRole: "OWNER" | "ADMIN" | "MODERATOR" | "MEMBER" | null;
}

export default function MyGroups() {
  const token = localStorage.getItem("token") || "";
  const [isTokenValid, setIsTokenValid] = useState(false);

  useEffect(() => {
    if (token) {
      setIsTokenValid(true);
    }
  }, [token]);

  const fetchMyGroups = async (): Promise<Group[]> => {
    const res = await fetch("http://57.159.26.157:8080/api/groups/my-groups", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch groups: ${res.status}`);
    }
    return res.json();
  };

  const {
    data: groups,
    isLoading,
    isError,
    refetch,
  } = useQuery<Group[], Error>({
    queryKey: ["myGroups"],
    queryFn: fetchMyGroups,
    enabled: isTokenValid,
  });

  const getPrivacyIcon = (privacy: string) => {
    switch (privacy) {
      case "PUBLIC":
        return <Globe className="w-4 h-4 text-green-600" />;
      case "CLOSED":
        return <Eye className="w-4 h-4 text-yellow-600" />;
      case "PRIVATE":
        return <Lock className="w-4 h-4 text-red-600" />;
      default:
        return <Globe className="w-4 h-4 text-green-600" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "OWNER":
        return "text-purple-600 bg-purple-100";
      case "ADMIN":
        return "text-blue-600 bg-blue-100";
      case "MODERATOR":
        return "text-orange-600 bg-orange-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <div className="max-w-6xl mx-auto py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <p>Loading your groups...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <div className="max-w-6xl mx-auto py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-red-600">Failed to load groups</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />

      <main className="max-w-6xl mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-slate-900">My Groups</h1>
          <Link to="/groups/create">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Group
            </Button>
          </Link>
        </div>

        {groups && groups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <Card
                key={group.id}
                className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardHeader className="p-0">
                  {group.coverImage ? (
                    <img
                      src={group.coverImage}
                      alt={group.name}
                      className="w-full h-32 object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="w-full h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-t-lg flex items-center justify-center">
                      <Users className="w-12 h-12 text-white" />
                    </div>
                  )}
                </CardHeader>

                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <Link
                      to={`/groups/${group.id}`}
                      className="text-lg font-semibold text-slate-900 hover:text-blue-600 line-clamp-1"
                    >
                      {group.name}
                    </Link>
                    <div className="flex items-center space-x-1">
                      {getPrivacyIcon(group.privacy)}
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getRoleColor(
                          group.userRole || "MEMBER"
                        )}`}
                      >
                        {group.userRole}
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                    {group.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-slate-500 mb-3">
                    <span>{group.memberCount} members</span>
                    <span>{group.postCount} posts</span>
                  </div>

                  <div className="flex space-x-2">
                    <Link to={`/groups/${group.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        View Group
                      </Button>
                    </Link>
                    <Link to={`/groups/${group.id}/posts`} className="flex-1">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        Posts
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              No groups yet
            </h3>
            <p className="text-slate-500 mb-6">
              Join your first group or create one to get started
            </p>
            <div className="space-x-4">
              <Link to="/groups/explore">
                <Button variant="outline">Explore Groups</Button>
              </Link>
              <Link to="/groups/create">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Create Group
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
