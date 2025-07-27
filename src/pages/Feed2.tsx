import CreatePost from "@/components/CreatePost";
import Navbar from "@/components/navbar";
import Post from "@/components/Post";
import RecommendedUsers from "@/components/RecommendedUsers";
import { QueryFunctionContext, useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";

interface FeedItem {
  postId: number;
  authorId: number;
  authorName: string;
  authorAvatarUrl?: string | null;
  contentSnippet?: string | null;
  mediaUrls: string[];
  createdAt: string;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  myLikeType: 0 | 1 | 2 | 3 | 4 | 5;
  parentPostId?: number | null;
  parentAuthorName?: string | null;
  parentAuthorAvatarUrl?: string | null;
  parentAuthorId?: number | null;
  parentPostContentSnippet?: string | null;
}

interface FeedResponse {
  items: FeedItem[];
  nextCursor?: {
    rankScore: number;
    postId: number;
    lastDateTime?: string;
  };
}

type Cursor = {
  rankScore: number;
  postId: number;
  lastDateTime: string;
};

type FeedQueryContext = QueryFunctionContext<["feed"], Cursor>;

export default function Feed() {
  const token = localStorage.getItem("token") || "";
  const [isTokenValid, setIsTokenValid] = useState(false);

  // "now" for the very first fetch
  const initialTime = useMemo(() => new Date().toISOString(), []);

  // Load cursor from localStorage if available
  const savedCursor = useMemo(() => {
    try {
      const saved = localStorage.getItem("feedCursor");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }, []);

  // fetcher that includes lastPostTime
  const fetchFeed = async ({
    pageParam,
    signal,
  }: FeedQueryContext): Promise<FeedResponse> => {
    const params = new URLSearchParams({ limit: "10" });
    const cursor = pageParam ?? savedCursor;
    if (cursor) {
      params.set("cursorScore", cursor.rankScore.toString());
      params.set("cursorPostId", cursor.postId.toString());
      params.set("lastPostTime", cursor.lastDateTime);
    } else {
      params.set("lastPostTime", initialTime);
    }

    const res = await fetch(`http://57.159.26.157:8080/api/v1/feed?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
      signal,
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch feed: ${res.status}`);
    }
    const data = await res.json();
    return data;
  };

  // hook to load pages
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<FeedResponse, Error>({
    queryKey: ["feed"] as const,
    queryFn: fetchFeed,
    initialPageParam: savedCursor ?? undefined,
    getNextPageParam: (lastPage) => {
      const c = lastPage.nextCursor;
      return c
        ? { ...c, lastDateTime: c.lastDateTime || initialTime }
        : undefined;
    },
    enabled: !!token,
  });

  // Save the latest cursor to localStorage
  useEffect(() => {
    if (data?.pages && data.pages.length > 0) {
      const lastPage = data.pages[data.pages.length - 1];
      if (lastPage.nextCursor) {
        localStorage.setItem(
          "feedCursor",
          JSON.stringify({
            ...lastPage.nextCursor,
            lastDateTime: lastPage.nextCursor.lastDateTime || initialTime,
          })
        );
      }
    }
  }, [data, initialTime]);

  // de-duplicate by postId
  const uniquePosts = useMemo(() => {
    const seen = new Set<number>();
    return data?.pages
      ? data.pages
          .flatMap((page) => page.items)
          .filter((post) => {
            if (seen.has(post.postId)) return false;
            seen.add(post.postId);
            return true;
          })
      : [];
  }, [data]);

  // protect route
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading feed…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Failed to load feed</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />

      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-3 space-y-6">
            <CreatePost />

            {uniquePosts.length > 0 ? (
              uniquePosts.map((post) => (
                <Post key={post.postId} post={post} token={token} />
              ))
            ) : (
              <div className="min-h-[400px] flex items-center justify-center">
                <p className="text-slate-600">
                  You're all caught up! No more posts to show.
                </p>
              </div>
            )}

            {hasNextPage ? (
              <div className="text-center">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {isFetchingNextPage ? "Loading…" : "Load more"}
                </button>
              </div>
            ) : (
              <p className="text-center text-slate-500">
                expand your network for more posts!
              </p>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <RecommendedUsers token={token} limit={5} />
          </div>
        </div>
      </div>
    </div>
  );
}
