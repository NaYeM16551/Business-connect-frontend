import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Eye, Globe, Lock, Plus, Search, Users } from "lucide-react";
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

export default function ExploreGroups() {
  const token = localStorage.getItem("token") || "";
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (token) {
      setIsTokenValid(true);
    }
  }, [token]);

  const fetchGroups = async (): Promise<Group[]> => {
    const url = searchQuery
      ? `http://localhost:8080/api/groups/search?query=${encodeURIComponent(
          searchQuery
        )}`
      : "http://localhost:8080/api/groups/search";

    const res = await fetch(url, {
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
    queryKey: ["exploreGroups", searchQuery],
    queryFn: fetchGroups,
    enabled: isTokenValid,
  });

  const joinGroup = async (groupId: number) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/groups/${groupId}/join`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to join group: ${res.status}`);
      }

      toast({
        title: "Success!",
        description: "You have successfully joined the group.",
      });

      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join the group. Please try again.",
        variant: "destructive",
      });
    }
  };

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

  const getPrivacyText = (privacy: string) => {
    switch (privacy) {
      case "PUBLIC":
        return "Public";
      case "CLOSED":
        return "Closed";
      case "PRIVATE":
        return "Private";
      default:
        return "Public";
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
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
            <p>Loading groups...</p>
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
          <h1 className="text-3xl font-bold text-slate-900">Explore Groups</h1>
          <Link to="/groups/create">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Group
            </Button>
          </Link>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </form>

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
                      <span className="text-xs text-slate-500">
                        {getPrivacyText(group.privacy)}
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

                  <p className="text-xs text-slate-500 mb-3">
                    Created by {group.ownerName}
                  </p>

                  <div className="flex space-x-2">
                    <Link to={`/groups/${group.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        View
                      </Button>
                    </Link>
                    {group.isMember ? (
                      <Button disabled className="flex-1 bg-green-600">
                        Joined
                      </Button>
                    ) : group.privacy === "PUBLIC" ? (
                      <Button
                        onClick={() => joinGroup(group.id)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        Join
                      </Button>
                    ) : (
                      <Button disabled className="flex-1" variant="outline">
                        {group.privacy === "CLOSED" ? "Request" : "Private"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              {searchQuery ? "No groups found" : "No groups available"}
            </h3>
            <p className="text-slate-500 mb-6">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Be the first to create a group in this community"}
            </p>
            <Link to="/groups/create">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Create Group
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
