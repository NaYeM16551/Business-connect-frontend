import CreatePost from "@/components/CreatePost";
import Navbar from "@/components/navbar";
import Post from "@/components/Post";
import ProfileCard from "@/components/ProfileCard";
import RecommendedUsers from "@/components/RecommendedUsers";
import {
  QueryFunctionContext,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
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
  parentMediaUrls?: string[];
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
  const queryClient = useQueryClient();

  // "now" for the very first fetch
  const initialTime = useMemo(() => new Date().toISOString(), []);

  // restore & validate saved cursor
  const savedCursor = useMemo<Cursor | null>(() => {
    const raw = localStorage.getItem("feedCursor");
    if (!raw) return null;
    try {
      const obj = JSON.parse(raw);
      if (
        typeof obj.rankScore === "number" &&
        typeof obj.postId === "number" &&
        typeof obj.lastDateTime === "string"
      ) {
        return obj;
      }
    } catch {
      // invalid JSON
    }
    localStorage.removeItem("feedCursor");
    return null;
  }, []);

  // UseEffect to check if token exists and set valid token flag
  useEffect(() => {
    if (token) {
      setIsTokenValid(true);
    }
  }, [token]);

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

    // Debug: Log some feed data to check like information
    if (data.items && data.items.length > 0) {
      console.log("Feed API Response - First post like data:", {
        postId: data.items[0].postId,
        likeCount: data.items[0].likeCount,
        myLikeType: data.items[0].myLikeType,
      });
    }

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
      if (!c) return undefined;
      const finalTime =
        c.lastDateTime ?? lastPage.items[lastPage.items.length - 1].createdAt;
      return {
        rankScore: c.rankScore,
        postId: c.postId,
        lastDateTime: finalTime,
      };
    },
    enabled: isTokenValid, // Enable the query only if the token is valid
  });

  // persist the newest cursor after fetches
  useEffect(() => {
    if (data?.pages.length) {
      const last = data.pages[data.pages.length - 1];
      const c = last.nextCursor;
      if (c) {
        const finalTime =
          c.lastDateTime ?? last.items[last.items.length - 1].createdAt;
        localStorage.setItem(
          "feedCursor",
          JSON.stringify({
            rankScore: c.rankScore,
            postId: c.postId,
            lastDateTime: finalTime,
          })
        );
      }
    }
  }, [data]);

  // Handle post updates (likes, comments, shares)
  const handlePostUpdate = (updatedPost: FeedItem) => {
    // Update the post in the cached data
    queryClient.setQueryData(
      ["feed"],
      (oldData: { pages: FeedResponse[] } | undefined) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: FeedResponse) => ({
            ...page,
            items: page.items.map((item: FeedItem) =>
              item.postId === updatedPost.postId ? updatedPost : item
            ),
          })),
        };
      }
    );
  };

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
                <Post
                  key={post.postId}
                  post={post}
                  token={token}
                  onPostUpdate={handlePostUpdate}
                />
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
            <ProfileCard token={token} />
            <RecommendedUsers token={token} limit={40} />
          </div>
        </div>
      </div>
    </div>
  );
}
