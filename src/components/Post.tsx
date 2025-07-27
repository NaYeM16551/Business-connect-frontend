import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MessageSquare, Share2, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Reaction types and icons
const REACTIONS = [
  { type: 1, label: "Love", emoji: "❤️" },
  { type: 2, label: "Like", emoji: "👍" },
  { type: 3, label: "Wow", emoji: "😮" },
  { type: 4, label: "Angry", emoji: "😡" },
  { type: 5, label: "Haha", emoji: "😂" },
];

interface Comment {
  id: number;
  authorName: string;
  content: string;
  commentedAt: string;
}

export interface FeedItem {
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

interface PostProps {
  post: FeedItem;
  token: string;
  onPostUpdate?: (updated: FeedItem) => void;
}

export const Post: React.FC<PostProps> = ({ post, token, onPostUpdate }) => {
  // Debug logging to check the received post data
  useEffect(() => {
    console.log(`Post ${post.postId} initial data:`, {
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      shareCount: post.shareCount,
      myLikeType: post.myLikeType,
    });
  }, [
    post.postId,
    post.likeCount,
    post.commentCount,
    post.shareCount,
    post.myLikeType,
  ]);

  const [likeType, setLikeType] = useState(post.myLikeType);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [commentCount, setCommentCount] = useState(post.commentCount || 0);
  const [shareCount, setShareCount] = useState(post.shareCount || 0);
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [shareText, setShareText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [postingComment, setPostingComment] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [reactionPopoverOpen, setReactionPopoverOpen] = useState(false);

  // Update local counts when post prop changes
  useEffect(() => {
    setLikeCount(post.likeCount || 0);
    setCommentCount(post.commentCount || 0);
    setShareCount(post.shareCount || 0);
    setLikeType(post.myLikeType);
  }, [post.likeCount, post.commentCount, post.shareCount, post.myLikeType]);

  // Like/React handler
  const handleReact = async (type: number) => {
    setReactionPopoverOpen(false);
    if (type === likeType) return; // No change

    const previousLikeType = likeType;
    const previousLikeCount = likeCount;

    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/posts/like/${post.postId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ likeType: type }),
        }
      );

      if (res.ok) {
        // Calculate new like count based on previous and new likeType
        let newLikeCount = previousLikeCount;

        // If user had no reaction (0) and now reacting, increment count
        if (previousLikeType === 0 && type !== 0) {
          newLikeCount = previousLikeCount + 1;
        }
        // If user had a reaction and now removing it (setting to 0), decrement count
        else if (previousLikeType !== 0 && type === 0) {
          newLikeCount = previousLikeCount - 1;
        }
        // If user is changing from one reaction to another, count stays the same
        // (previousLikeType !== 0 && type !== 0) - no change to count

        setLikeCount(newLikeCount);
        setLikeType(type as 0 | 1 | 2 | 3 | 4 | 5);

        if (onPostUpdate) {
          onPostUpdate({
            ...post,
            myLikeType: type as 0 | 1 | 2 | 3 | 4 | 5,
            likeCount: newLikeCount,
          });
        }
      } else {
        console.error("Failed to react to post:", res.status, res.statusText);
      }
    } catch (error) {
      console.error("Failed to react to post:", error);
      // Revert optimistic updates on error
      setLikeCount(previousLikeCount);
      setLikeType(previousLikeType);
    }
  };

  // Fetch comments
  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/posts/comments/${post.postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setComments(data);
        // Update comment count based on actual fetched comments
        if (Array.isArray(data)) {
          setCommentCount(data.length);
        }
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setLoadingComments(false);
    }
  };

  // Post comment
  const handlePostComment = async () => {
    if (!commentText.trim()) return;
    setPostingComment(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/posts/comment/${post.postId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ comment: commentText }),
        }
      );
      if (res.ok) {
        setCommentText("");
        const newCommentCount = commentCount + 1;
        setCommentCount(newCommentCount);
        fetchComments(); // Refresh comments list
        if (onPostUpdate)
          onPostUpdate({ ...post, commentCount: newCommentCount });
      }
    } catch (error) {
      console.error("Failed to post comment:", error);
    } finally {
      setPostingComment(false);
    }
  };

  // Share post
  const handleShare = async () => {
    if (sharing) return;
    setSharing(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/posts/share/${post.postId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: shareText }),
        }
      );
      if (res.ok) {
        setShareText("");
        const newShareCount = shareCount + 1;
        setShareCount(newShareCount);
        setShowShareDialog(false);
        if (onPostUpdate) onPostUpdate({ ...post, shareCount: newShareCount });
      }
    } catch (error) {
      console.error("Failed to share post:", error);
    } finally {
      setSharing(false);
    }
  };

  // Reaction button label/icon
  const currentReaction = REACTIONS.find((r) => r.type === likeType);

  return (
    <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
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
          <Link
            to={`/user/${post.authorId}`}
            className="font-semibold text-slate-900 hover:underline"
          >
            {post.authorName}
          </Link>
          <p className="text-xs text-slate-500">
            {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-4">
        {post.contentSnippet && (
          <div>
            <p className="text-slate-800">{post.contentSnippet}</p>
          </div>
        )}

        {/* Shared Post Display */}
        {post.parentPostId && post.parentAuthorName && (
          <div className="border-2 border-slate-200 rounded-lg bg-white overflow-hidden">
            {/* Original Post Header */}
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                {post.parentAuthorAvatarUrl ? (
                  <img
                    src={post.parentAuthorAvatarUrl}
                    alt={post.parentAuthorName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-slate-500" />
                )}
                <div>
                  <Link
                    to={`/user/${post.parentAuthorId}`}
                    className="text-sm font-semibold text-slate-800 hover:text-blue-600 hover:underline"
                  >
                    {post.parentAuthorName}
                  </Link>
                  <p className="text-xs text-slate-500">Original post</p>
                </div>
              </div>
            </div>

            {/* Original Post Content */}
            <div className="p-4 space-y-3">
              {post.parentPostContentSnippet && (
                <p className="text-slate-700 leading-relaxed">
                  {post.parentPostContentSnippet}
                </p>
              )}

              {/* Original Post Media */}
              {post.parentMediaUrls && post.parentMediaUrls.length > 0 && (
                <div className="space-y-2">
                  {post.parentMediaUrls.length === 1 ? (
                    <img
                      src={post.parentMediaUrls[0]}
                      alt="Shared post media"
                      className="w-full max-h-96 object-cover rounded-lg"
                    />
                  ) : (
                    <div
                      className={`grid gap-2 ${
                        post.parentMediaUrls.length === 2
                          ? "grid-cols-2"
                          : post.parentMediaUrls.length === 3
                          ? "grid-cols-2"
                          : "grid-cols-2"
                      }`}
                    >
                      {post.parentMediaUrls.slice(0, 4).map((url, i) => (
                        <div key={i} className="relative">
                          <img
                            src={url}
                            alt={`Shared post media ${i + 1}`}
                            className={`w-full object-cover rounded-lg ${
                              post.parentMediaUrls!.length === 3 && i === 0
                                ? "row-span-2 h-full max-h-80"
                                : "h-40"
                            }`}
                          />
                          {/* Show "+X more" overlay for additional images */}
                          {i === 3 && post.parentMediaUrls!.length > 4 && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                              <span className="text-white font-semibold text-lg">
                                +{post.parentMediaUrls!.length - 4} more
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Current Post Media (for non-shared posts) */}
        {!post.parentPostId && post.mediaUrls.length > 0 && (
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
        {/* Actions */}
        <div className="flex justify-around text-slate-600 pt-2">
          {/* Like/React */}
          <Popover
            open={reactionPopoverOpen}
            onOpenChange={setReactionPopoverOpen}
          >
            <PopoverTrigger asChild>
              <Button
                variant={likeType ? "secondary" : "ghost"}
                className="flex items-center space-x-1"
                onClick={() => setReactionPopoverOpen((open) => !open)}
              >
                <span className="text-lg">
                  {currentReaction ? currentReaction.emoji : <span>👍</span>}
                </span>
                <span>
                  {likeCount} {currentReaction ? currentReaction.label : "Like"}
                  {likeCount !== 1 && "s"}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="center"
              sideOffset={8}
              className="flex space-x-2 p-2 bg-white border rounded shadow-lg"
            >
              {REACTIONS.map((r) => (
                <button
                  key={r.type}
                  className={`text-2xl hover:scale-125 transition-transform duration-100 ${
                    likeType === r.type
                      ? "ring-2 ring-blue-400 rounded-full"
                      : ""
                  }`}
                  onClick={() => {
                    handleReact(r.type);
                    setReactionPopoverOpen(false);
                  }}
                  aria-label={r.label}
                  type="button"
                >
                  {r.emoji}
                </button>
              ))}
            </PopoverContent>
          </Popover>
          {/* Comment */}
          <Dialog
            open={showCommentDialog}
            onOpenChange={(open) => {
              setShowCommentDialog(open);
              if (open) fetchComments();
            }}
          >
            <DialogTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-1">
                <MessageSquare className="w-5 h-5" />
                <span>
                  {commentCount} Comment{commentCount !== 1 && "s"}
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Comments</DialogTitle>
              </DialogHeader>
              <div className="max-h-60 overflow-y-auto space-y-2 mb-2">
                {loadingComments ? (
                  <div>Loading…</div>
                ) : comments.length === 0 ? (
                  <div className="text-slate-500">No comments yet.</div>
                ) : (
                  comments.map((c) => (
                    <div key={c.id} className="border-b pb-2">
                      <div className="font-semibold text-sm">
                        {c.authorName}
                      </div>
                      <div className="text-xs text-slate-500">
                        {new Date(c.commentedAt).toLocaleString()}
                      </div>
                      <div>{c.content}</div>
                    </div>
                  ))
                )}
              </div>
              <div className="flex gap-2 mt-2">
                <Input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment…"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handlePostComment();
                  }}
                  disabled={postingComment}
                />
                <Button
                  onClick={handlePostComment}
                  disabled={postingComment || !commentText.trim()}
                >
                  Post
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          {/* Share */}
          <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
            <DialogTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-1">
                <Share2 className="w-5 h-5" />
                <span>
                  {shareCount} Share{shareCount !== 1 && "s"}
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Post</DialogTitle>
              </DialogHeader>
              <Input
                value={shareText}
                onChange={(e) => setShareText(e.target.value)}
                placeholder="Add a comment (optional)"
                disabled={sharing}
              />
              <DialogFooter>
                <Button onClick={handleShare} disabled={sharing}>
                  Share
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default Post;
