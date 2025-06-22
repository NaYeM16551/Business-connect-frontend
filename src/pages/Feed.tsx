import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { useInfiniteQuery, QueryFunctionContext } from "@tanstack/react-query";
import CreatePost from "@/components/CreatePost";
import Navbar from "@/components/navbar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MessageSquare, Share2, ThumbsUp, User } from "lucide-react";

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

    const res = await fetch(`http://localhost:8080/api/v1/feed?${params}`, {
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

      <main className="max-w-2xl mx-auto py-6 space-y-6">
        <CreatePost />

        {uniquePosts.length > 0 ? (
          uniquePosts.map((post) => (
            <Card
              key={post.postId}
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
                  <p className="font-semibold text-slate-900">{post.authorName}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="px-4 pb-4 space-y-4">
                {post.contentSnippet && <p>{post.contentSnippet}</p>}

                {post.parentPostId && post.parentAuthorName && (
                  <div className="border rounded bg-slate-100 p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      {post.parentAuthorAvatarUrl ? (
                        <img
                          src={post.parentAuthorAvatarUrl}
                          alt={post.parentAuthorName}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-slate-500" />
                      )}
                      <p className="text-sm font-medium text-slate-800">
                        {post.parentAuthorName}
                      </p>
                    </div>
                    {post.parentPostContentSnippet && (
                      <p className="text-sm text-slate-700">
                        {post.parentPostContentSnippet}
                      </p>
                    )}
                  </div>
                )}

                {post.mediaUrls.length > 0 && (
                  <div className="grid grid-cols-1 gap-2">
                    {post.mediaUrls.map((url, i) => (
                      <img
                        key={i}
                        src={url}
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
          ))
        ) : (
          <div className="min-h-screen flex items-center justify-center">
            <p className="text-slate-600">You’re all caught up! No more posts to show.</p>
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
      </main>
    </div>
  );
}
