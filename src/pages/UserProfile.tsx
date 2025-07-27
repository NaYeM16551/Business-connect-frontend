import Navbar from "@/components/navbar";
import { FeedItem, Post } from "@/components/Post";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { User, UserMinus, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

interface Post {
  id: number;
  content: string;
  media: Array<{
    mediaUrl: string;
    mediaType: string;
  }>;
  createdAt: string;
  authorId?: number;
  authorName?: string;
  authorAvatarUrl?: string;
  likeCount?: number;
  commentCount?: number;
  shareCount?: number;
  myLikeType?: 0 | 1 | 2 | 3 | 4 | 5;
}

interface UserProfileData {
  id: number;
  username: string;
  email: string;
  role?: string;
  industry?: string[];
  interests?: string[];
  achievements?: string[];
  profilePictureUrl?: string | null;
  posts?: Post[];
}

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const token = localStorage.getItem("token") || "";
  const currentUserId = localStorage.getItem("userId");
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
  const [followLoading, setFollowLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<UserProfileData | null>(null);
  const { toast } = useToast();

  // Transform Post to FeedItem for the Post component
  const transformPostToFeedItem = (
    post: Post,
    userProfile: UserProfileData | null
  ): FeedItem => {
    return {
      postId: post.id,
      authorId: post.authorId || userProfile?.id || parseInt(userId || "0"),
      authorName: post.authorName || userProfile?.username || "Unknown User",
      authorAvatarUrl:
        post.authorAvatarUrl || userProfile?.profilePictureUrl || null,
      contentSnippet: post.content || null,
      mediaUrls: post.media?.map((m) => m.mediaUrl) || [],
      createdAt: post.createdAt,
      likeCount: post.likeCount || 0,
      commentCount: post.commentCount || 0,
      shareCount: post.shareCount || 0,
      myLikeType: post.myLikeType || 0,
      parentPostId: null,
      parentAuthorName: null,
      parentAuthorAvatarUrl: null,
      parentAuthorId: null,
      parentPostContentSnippet: null,
      parentMediaUrls: [],
    };
  };

  // Fetch user details (either current user via /me or extract from posts)
  const fetchUserProfile = async (): Promise<UserProfileData | null> => {
    console.log(
      "fetchUserProfile called with userId:",
      userId,
      "currentUserId:",
      currentUserId
    );

    // Try to fetch user profile directly via auth/{userId} endpoint
    console.log("Fetching user profile via /auth/{userId}");
    try {
      const res = await fetch(`http://localhost:8080/api/v1/auth/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const userData = await res.json();
        console.log("User profile data from auth endpoint:", userData);
        setUserInfo(userData);
        return userData;
      } else {
        console.log("Failed to fetch user profile, status:", res.status);
        const errorText = await res.text();
        console.log("Error response:", errorText);
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }

    // Fallback: try to extract info from their posts
    console.log("Fallback: Fetching user's profile via posts");
    try {
      const postsRes = await fetch(
        `http://localhost:8080/api/v1/posts/user/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (postsRes.ok) {
        const posts = await postsRes.json();
        console.log("Posts data:", posts);

        // Extract user info from the first post if available
        if (posts.length > 0 && posts[0].authorName) {
          console.log(
            "Extracting username from first post:",
            posts[0].authorName
          );
          const userProfile: UserProfileData = {
            id: parseInt(userId || "0"),
            username: posts[0].authorName,
            email: "", // Not available from posts
          };
          setUserInfo(userProfile);
          return userProfile;
        }
      } else {
        console.log("Failed to fetch posts, status:", postsRes.status);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }

    // Final fallback if everything fails
    console.log("Using final fallback username");
    const userProfile: UserProfileData = {
      id: parseInt(userId || "0"),
      username: `User ${userId}`,
      email: "",
    };
    setUserInfo(userProfile);
    return userProfile;
  };

  // Fetch user posts separately
  const fetchUserPosts = async (): Promise<Post[]> => {
    const res = await fetch(
      `http://localhost:8080/api/v1/posts/user/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!res.ok) {
      throw new Error("Failed to fetch user posts");
    }
    return await res.json();
  };

  // Fetch user profile
  const {
    data: userProfile,
    isLoading: profileLoading,
    isError: profileError,
  } = useQuery<UserProfileData | null, Error>({
    queryKey: ["userProfile", userId],
    queryFn: fetchUserProfile,
    enabled: !!token && !!userId,
  });

  console.log("userProfile query result:", userProfile);
  console.log("profileLoading:", profileLoading);
  console.log("profileError:", profileError);

  // Fetch user posts
  const {
    data: posts,
    isLoading: postsLoading,
    isError: postsError,
    refetch: refetchPosts,
  } = useQuery<Post[], Error>({
    queryKey: ["userPosts", userId],
    queryFn: fetchUserPosts,
    enabled: !!token && !!userId,
  });

  // Get following status (only if not viewing own profile)
  useEffect(() => {
    if (!userId || !token) return;

    // Convert both to strings for proper comparison and handle null/undefined
    const userIdString = String(userId || "");
    const currentUserIdString = String(currentUserId || "");

    // Don't fetch following status if viewing own profile or if currentUserId is missing
    if (!currentUserId || userIdString === currentUserIdString) return;

    const fetchFollowingStatus = async (): Promise<void> => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/v1/connections/following/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) {
          setIsFollowing(false);
          return;
        }

        const data = await res.json();
        const currentUserId = localStorage.getItem("userId");
        setIsFollowing(
          data.some((user: { id: number }) => String(user.id) === currentUserId)
        );
      } catch {
        setIsFollowing(false);
      }
    };

    fetchFollowingStatus();
  }, [userId, token, currentUserId]);

  const handleFollow = async () => {
    if (!userId) return;
    setFollowLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/connections/follow/${userId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to follow user");

      setIsFollowing(true);
      toast({
        title: "Success!",
        description: "Successfully followed user.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to follow user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setFollowLoading(false);
    }
  };

  const handleUnfollow = async () => {
    if (!userId) return;
    setFollowLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/connections/unfollow/${userId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to unfollow user");

      setIsFollowing(false);
      toast({
        title: "Success!",
        description: "Successfully unfollowed user.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to unfollow user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setFollowLoading(false);
    }
  };

  // Get username from userProfile query data or userInfo state or show loading until we have it
  const username = userProfile?.username || userInfo?.username || "Loading...";
  console.log("Final username resolved to:", username);
  console.log("userProfile?.username:", userProfile?.username);
  console.log("userInfo?.username:", userInfo?.username);
  console.log("userId:", userId, "currentUserId:", currentUserId);
  console.log("userId === currentUserId:", userId === currentUserId);
  console.log(
    "typeof userId:",
    typeof userId,
    "typeof currentUserId:",
    typeof currentUserId
  );

  const isLoading = profileLoading || postsLoading;
  const isError = profileError || postsError;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <div className="max-w-4xl mx-auto py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <div className="max-w-4xl mx-auto py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-red-600">Failed to load user profile</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />

      <main className="max-w-4xl mx-auto py-6 px-4">
        {/* Profile Header */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg mb-6">
          <CardHeader className="text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {username}
                </h1>
                {(userProfile?.role || userInfo?.role) && (
                  <p className="text-slate-600 text-sm font-medium">
                    {userProfile?.role || userInfo?.role}
                  </p>
                )}
                {((userProfile?.industry && userProfile.industry.length > 0) ||
                  (userInfo?.industry && userInfo.industry.length > 0)) && (
                  <p className="text-slate-500 text-xs">
                    {(userProfile?.industry || userInfo?.industry)?.join(" • ")}
                  </p>
                )}
              </div>

              {/* Follow/Unfollow Button - only show if not viewing own profile */}
              {(() => {
                console.log("Checking follow button visibility:");
                console.log("userId:", userId, "currentUserId:", currentUserId);

                // Convert both to strings and handle null/undefined cases
                const userIdString = String(userId || "");
                const currentUserIdString = String(currentUserId || "");

                console.log(
                  "userIdString:",
                  userIdString,
                  "currentUserIdString:",
                  currentUserIdString
                );
                console.log(
                  "userIdString !== currentUserIdString:",
                  userIdString !== currentUserIdString
                );

                // Only show follow button if we have both IDs and they're different
                const shouldShowButton =
                  userId &&
                  currentUserId &&
                  userIdString !== currentUserIdString;
                console.log("shouldShowButton:", shouldShowButton);

                return shouldShowButton;
              })() && (
                <div className="flex space-x-4">
                  {isFollowing === null ? (
                    <Button disabled variant="outline">
                      Loading...
                    </Button>
                  ) : isFollowing ? (
                    <Button
                      onClick={handleUnfollow}
                      disabled={followLoading}
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                    >
                      <UserMinus className="w-4 h-4 mr-2" />
                      {followLoading ? "Unfollowing..." : "Unfollow"}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleFollow}
                      disabled={followLoading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      {followLoading ? "Following..." : "Follow"}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Posts Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-slate-900">
            Posts ({posts?.length || 0})
          </h2>

          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <Post
                key={post.id}
                post={transformPostToFeedItem(post, userProfile || userInfo)}
                token={token}
                onPostUpdate={(updatedPost) => {
                  // Optionally refetch posts or update local state
                  refetchPosts();
                }}
              />
            ))
          ) : (
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
              <CardContent className="p-12 text-center">
                <User className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-700 mb-2">
                  No posts yet
                </h3>
                <p className="text-slate-500">
                  This user hasn't shared any posts yet.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
