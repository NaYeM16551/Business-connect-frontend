import CreatePost from "@/components/CreatePost";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { ArrowLeft, MessageSquare, Share2, ThumbsUp, User } from "lucide-react";
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

interface GroupPost {
  id: number;
  content: string;
  createdAt: string;
  authorId: number;
  authorName: string;
  authorAvatarUrl?: string;
  media?: Array<{
    mediaUrl: string;
    mediaType: string;
  }>;
  likeCount: number;
  commentCount: number;
  shareCount: number;
}

interface GroupPostsResponse {
  content: GroupPost[];
  hasNext: boolean;
  page: number;
}

export default function GroupPosts() {
  const { groupId } = useParams<{ groupId: string }>();
  const token = localStorage.getItem("token") || "";
  const [isTokenValid, setIsTokenValid] = useState(false);

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

  const fetchGroupPosts = async ({
    pageParam = 0,
  }): Promise<GroupPostsResponse> => {
    const res = await fetch(
      `http://57.159.26.157:8080/api/groups/${groupId}/posts?page=${pageParam}&size=10`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!res.ok) {
      throw new Error(`Failed to fetch posts: ${res.status}`);
    }
    const posts = await res.json();
    return {
      content: posts,
      hasNext: posts.length === 10,
      page: pageParam,
    };
  };

  const {
    data: group,
    isLoading: groupLoading,
    isError: groupError,
  } = useQuery<Group, Error>({
    queryKey: ["group", groupId],
    queryFn: fetchGroupDetails,
    enabled: isTokenValid && !!groupId,
  });

  const {
    data: postsData,
    isLoading: postsLoading,
    isError: postsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchPosts,
  } = useInfiniteQuery({
    queryKey: ["groupPosts", groupId],
    queryFn: fetchGroupPosts,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNext ? lastPage.page + 1 : undefined;
    },
    enabled: isTokenValid && !!groupId && group?.isMember,
  });

  const allPosts = postsData?.pages.flatMap((page) => page.content) || [];

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (groupLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <div className="max-w-4xl mx-auto py-6">
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
        <div className="max-w-4xl mx-auto py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-red-600">Failed to load group</p>
          </div>
        </div>
      </div>
    );
  }

  if (!group.isMember) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <div className="max-w-4xl mx-auto py-6 px-4">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Access Restricted
            </h2>
            <p className="text-slate-600 mb-6">
              You need to be a member of this group to view posts.
            </p>
            <Link to={`/groups/${groupId}`}>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Back to Group
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />

      <main className="max-w-4xl mx-auto py-6 px-4">
        {/* Header */}
        <div className="mb-6">
          <Link to={`/groups/${groupId}`}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Group
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {group.name}
              </h1>
              <p className="text-slate-600">Posts and discussions</p>
            </div>
          </div>
        </div>

        {/* Create Post */}
        <CreatePost
          groupId={Number(groupId)}
          onPostCreated={() => refetchPosts()}
        />

        {/* Posts */}
        {postsLoading ? (
          <div className="text-center py-6">
            <p>Loading posts...</p>
          </div>
        ) : postsError ? (
          <div className="text-center py-6">
            <p className="text-red-600">Failed to load posts</p>
          </div>
        ) : allPosts.length > 0 ? (
          <div className="space-y-6">
            {allPosts.map((post) => (
              <Card
                key={post.id}
                className="bg-white/90 backdrop-blur-sm shadow-lg"
              >
                <CardHeader className="flex items-center space-x-3 justify-start px-4 pt-4">
                  {post.authorAvatarUrl ? (
                    <img
                      src={post.authorAvatarUrl}
                      alt={post.authorName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-slate-500" />
                  )}
                  <div>
                    <p className="font-semibold text-slate-900">
                      {post.authorName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(post.createdAt).toLocaleString()}
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="px-4 pb-4 space-y-4">
                  <p>{post.content}</p>

                  {post.media && post.media.length > 0 && (
                    <div className="grid grid-cols-1 gap-2">
                      {post.media.map((media, i) => (
                        <img
                          key={i}
                          src={media.mediaUrl}
                          alt={`media-${i}`}
                          className="max-h-80 w-full object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}

                  <div className="flex justify-around text-slate-600 pt-2">
                    <button className="flex items-center space-x-1 hover:text-blue-600">
                      <ThumbsUp className="w-5 h-5" />
                      <span>
                        {post.likeCount} Like{post.likeCount !== 1 && "s"}
                      </span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-blue-600">
                      <MessageSquare className="w-5 h-5" />
                      <span>
                        {post.commentCount} Comment
                        {post.commentCount !== 1 && "s"}
                      </span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-blue-600">
                      <Share2 className="w-5 h-5" />
                      <span>
                        {post.shareCount} Share
                        {post.shareCount !== 1 && "s"}
                      </span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Load More Button */}
            {hasNextPage && (
              <div className="text-center">
                <Button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isFetchingNextPage ? "Loading..." : "Load More Posts"}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              No posts yet
            </h3>
            <p className="text-slate-500 mb-6">
              Be the first to share something with this group!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
