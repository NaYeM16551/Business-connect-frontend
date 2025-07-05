import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Eye, Globe, Lock, Plus, Settings, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

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

interface GroupMember {
  userId: number;
  userName: string;
  userEmail: string;
  role: "OWNER" | "ADMIN" | "MODERATOR" | "MEMBER";
  joinedAt: string;
  profileImage?: string;
}

export default function GroupDetail() {
  const { groupId } = useParams<{ groupId: string }>();
  const token = localStorage.getItem("token") || "";
  const [isTokenValid, setIsTokenValid] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (token) {
      setIsTokenValid(true);
    }
  }, [token]);

  const fetchGroupDetails = async (): Promise<Group> => {
    const res = await fetch(`http://57.159.26.157:8080/api/groups/${groupId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch group: ${res.status}`);
    }
    return res.json();
  };

  const fetchGroupMembers = async (): Promise<GroupMember[]> => {
    const res = await fetch(
      `http://57.159.26.157:8080/api/groups/${groupId}/members`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!res.ok) {
      throw new Error(`Failed to fetch members: ${res.status}`);
    }
    return res.json();
  };

  const {
    data: group,
    isLoading: groupLoading,
    isError: groupError,
    refetch: refetchGroup,
  } = useQuery<Group, Error>({
    queryKey: ["group", groupId],
    queryFn: fetchGroupDetails,
    enabled: isTokenValid && !!groupId,
  });

  const {
    data: members,
    isLoading: membersLoading,
    isError: membersError,
  } = useQuery<GroupMember[], Error>({
    queryKey: ["groupMembers", groupId],
    queryFn: fetchGroupMembers,
    enabled: isTokenValid && !!groupId && group?.isMember,
  });

  const joinGroup = async () => {
    try {
      const res = await fetch(
        `http://57.159.26.157:8080/api/groups/${groupId}/join`,
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

      refetchGroup();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join the group. Please try again.",
        variant: "destructive",
      });
    }
  };

  const leaveGroup = async () => {
    try {
      const res = await fetch(
        `http://57.159.26.157:8080/api/groups/${groupId}/leave`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to leave group: ${res.status}`);
      }

      toast({
        title: "Success!",
        description: "You have left the group.",
      });

      refetchGroup();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to leave the group. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getPrivacyIcon = (privacy: string) => {
    switch (privacy) {
      case "PUBLIC":
        return <Globe className="w-5 h-5 text-green-600" />;
      case "CLOSED":
        return <Eye className="w-5 h-5 text-yellow-600" />;
      case "PRIVATE":
        return <Lock className="w-5 h-5 text-red-600" />;
      default:
        return <Globe className="w-5 h-5 text-green-600" />;
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

  if (groupLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <div className="max-w-6xl mx-auto py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <p>Loading group...</p>
          </div>
        </div>
      </div>
    );
  }

  if (groupError || !group) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <div className="max-w-6xl mx-auto py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-red-600">Failed to load group</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />

      <main className="max-w-6xl mx-auto py-6 px-4">
        {/* Group Header */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg mb-6">
          <CardHeader className="p-0">
            {group.coverImage ? (
              <img
                src={group.coverImage}
                alt={group.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            ) : (
              <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-purple-500 rounded-t-lg flex items-center justify-center">
                <Users className="w-20 h-20 text-white" />
              </div>
            )}
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-slate-900">
                    {group.name}
                  </h1>
                  {getPrivacyIcon(group.privacy)}
                  {group.userRole && (
                    <span
                      className={`px-3 py-1 text-sm rounded-full ${getRoleColor(
                        group.userRole
                      )}`}
                    >
                      {group.userRole}
                    </span>
                  )}
                </div>
                <p className="text-slate-600 mb-4">{group.description}</p>
                <div className="flex items-center space-x-4 text-sm text-slate-500">
                  <span>{group.memberCount} members</span>
                  <span>{group.postCount} posts</span>
                  <span>Created by {group.ownerName}</span>
                  <span>
                    Created {new Date(group.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2 ml-4">
                {group.isMember ? (
                  <>
                    <Link to={`/groups/${group.id}/posts`}>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Post
                      </Button>
                    </Link>
                    {group.userRole !== "OWNER" && (
                      <Button
                        onClick={leaveGroup}
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                      >
                        Leave Group
                      </Button>
                    )}
                    {(group.userRole === "OWNER" ||
                      group.userRole === "ADMIN") && (
                      <Button variant="outline">
                        <Settings className="w-4 h-4 mr-2" />
                        Manage
                      </Button>
                    )}
                  </>
                ) : group.privacy === "PUBLIC" ? (
                  <Button
                    onClick={joinGroup}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Join Group
                  </Button>
                ) : (
                  <Button disabled variant="outline">
                    {group.privacy === "CLOSED"
                      ? "Request to Join"
                      : "Private Group"}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {group.isMember ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-slate-700 mb-2">
                  Group Posts
                </h3>
                <p className="text-slate-500 mb-6">
                  Share updates and connect with group members
                </p>
                <Link to={`/groups/${group.id}/posts`}>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    View All Posts
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-12">
                <Lock className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-700 mb-2">
                  Join to see posts
                </h3>
                <p className="text-slate-500">
                  Become a member to see what's happening in this group
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Members */}
            {group.isMember && members && (
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <h3 className="text-lg font-semibold">
                    Members ({group.memberCount})
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {members.slice(0, 5).map((member) => (
                      <div
                        key={member.userId}
                        className="flex items-center space-x-3"
                      >
                        {member.profileImage ? (
                          <img
                            src={member.profileImage}
                            alt={member.userName}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-slate-600" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900">
                            {member.userName}
                          </p>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${getRoleColor(
                              member.role
                            )}`}
                          >
                            {member.role}
                          </span>
                        </div>
                      </div>
                    ))}
                    {members.length > 5 && (
                      <Button variant="outline" className="w-full">
                        View All Members
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <h3 className="text-lg font-semibold">Quick Actions</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/groups/my-groups" className="block">
                  <Button variant="outline" className="w-full">
                    My Groups
                  </Button>
                </Link>
                <Link to="/groups/explore" className="block">
                  <Button variant="outline" className="w-full">
                    Explore Groups
                  </Button>
                </Link>
                <Link to="/groups/create" className="block">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Create Group
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
