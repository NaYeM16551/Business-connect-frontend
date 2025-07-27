import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  Clock,
  MessageCircle,
  Search,
  User,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface UserDTO {
  id: number;
  username: string;
  email: string;
  profilePictureUrl?: string | null;
  role?: string;
  lastSeen?: string;
}

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

interface ChatPreview {
  user: Connection;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  hasConversation: boolean;
}

interface MessageFrontProps {
  currentUserId: number;
}

export default function MessageFront({ currentUserId }: MessageFrontProps) {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [conversationUsers, setConversationUsers] = useState<UserDTO[]>([]);
  const [chatPreviews, setChatPreviews] = useState<ChatPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUserId) return;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Fetch connections (following list)
        const connectionsRes = await fetch(
          "http://57.159.26.157:8080/api/v1/connections/following",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!connectionsRes.ok) {
          throw new Error("Failed to fetch connections");
        }

        const connectionsData: Connection[] = await connectionsRes.json();
        setConnections(connectionsData);

        // Fetch existing conversations
        const conversationsRes = await fetch(
          `http://57.159.26.157:8080/api/v1/${currentUserId}/messages`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        let conversationsData: UserDTO[] = [];
        if (conversationsRes.ok) {
          conversationsData = await conversationsRes.json();
          setConversationUsers(conversationsData);
        }

        // Create chat previews by combining connections and conversations
        const previews: ChatPreview[] = connectionsData.map((connection) => {
          const hasConversation = conversationsData.some(
            (conv) => conv.id === connection.id
          );
          
          return {
            user: connection,
            hasConversation,
            lastMessage: hasConversation ? "Continue conversation..." : "Start a conversation",
            unreadCount: 0, // We can enhance this later with unread count API
          };
        });

        // Sort: conversations first, then other connections
        previews.sort((a, b) => {
          if (a.hasConversation && !b.hasConversation) return -1;
          if (!a.hasConversation && b.hasConversation) return 1;
          return 0;
        });

        setChatPreviews(previews);
        setLoading(false);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUserId]);

  const handleClick = (chatPreview: ChatPreview) => {
    navigate(`/chat/${chatPreview.user.id}`, {
      state: { receiver: chatPreview.user }, // Send full user object
    });
  };

  // Filter chat previews based on search term
  const filteredChatPreviews = chatPreviews.filter(
    (preview) =>
      preview.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      preview.user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      preview.user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-pulse" />
              <p className="text-lg text-slate-600">
                Loading your conversations...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="bg-white shadow-lg">
              <CardContent className="p-8 text-center">
                <MessageCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-red-600 mb-2">
                  Error Loading Messages
                </h3>
                <p className="text-slate-600">{error}</p>
                <Button
                  onClick={() => window.location.reload()}
                  className="mt-4 bg-blue-600 hover:bg-blue-700"
                >
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />

      <main className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <MessageCircle className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900">Messages</h1>
          </div>
          <p className="text-slate-600">
            Connect with your network • {chatPreviews.length} connection
            {chatPreviews.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Search Bar */}
        <Card className="bg-white shadow-sm mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-3 text-base"
              />
            </div>
          </CardContent>
        </Card>

        {/* Messages List */}
        {filteredChatPreviews.length === 0 ? (
          <Card className="bg-white shadow-sm">
            <CardContent className="p-12 text-center">
              {chatPreviews.length === 0 ? (
                <>
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No connections yet
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Start connecting with people in your network to begin
                    conversations.
                  </p>
                  <Link to="/network">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Users className="w-4 h-4 mr-2" />
                      Browse Network
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No connections found
                  </h3>
                  <p className="text-gray-500">
                    Try adjusting your search terms or clear the search to see
                    all connections.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setSearchTerm("")}
                  >
                    Clear Search
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredChatPreviews.map((chatPreview) => (
              <Card
                key={chatPreview.user.id}
                className="bg-white shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
                onClick={() => handleClick(chatPreview)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    {/* Profile Picture */}
                    <div className="relative">
                      {chatPreview.user.profilePictureUrl ? (
                        <img
                          src={chatPreview.user.profilePictureUrl}
                          alt={chatPreview.user.username}
                          className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-2 border-gray-200">
                          <User className="w-7 h-7 text-white" />
                        </div>
                      )}
                      {/* Conversation status indicator */}
                      <div 
                        className={`absolute -bottom-1 -right-1 w-5 h-5 border-2 border-white rounded-full ${
                          chatPreview.hasConversation ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                      ></div>
                      {/* Unread count badge */}
                      {chatPreview.unreadCount && chatPreview.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {chatPreview.unreadCount > 9 ? '9+' : chatPreview.unreadCount}
                        </div>
                      )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <Link
                          to={`/user/${chatPreview.user.id}`}
                          className="font-semibold text-lg text-slate-800 hover:text-blue-600 truncate group-hover:text-blue-600 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {chatPreview.user.username}
                        </Link>
                        <div className="flex items-center text-gray-400 group-hover:text-blue-500 transition-colors">
                          {chatPreview.hasConversation ? (
                            <>
                              <MessageCircle className="w-4 h-4 mr-1" />
                              <span className="text-sm">Active</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-4 h-4 mr-1" />
                              <span className="text-sm">New</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="space-y-1">
                        {chatPreview.user.role && (
                          <p className="text-sm text-blue-600 font-medium capitalize">
                            {chatPreview.user.role}
                          </p>
                        )}
                        <p className="text-sm text-slate-500 truncate">
                          {chatPreview.user.email}
                        </p>
                      </div>
                      <div className="flex items-center mt-2">
                        <MessageCircle className="w-4 h-4 text-gray-400 mr-2" />
                        <span className={`text-sm ${chatPreview.hasConversation ? 'text-gray-600' : 'text-gray-500'}`}>
                          {chatPreview.lastMessage}
                        </span>
                      </div>
                    </div>

                    {/* Arrow Icon */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <ArrowRight className="w-5 h-5 text-blue-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {chatPreviews.length > 0 && (
          <Card className="bg-white shadow-sm mt-8">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/network" className="flex-1">
                  <Button variant="outline" className="w-full">
                    <Users className="w-4 h-4 mr-2" />
                    View My Network
                  </Button>
                </Link>
                <Link to="/feed" className="flex-1">
                  <Button variant="outline" className="w-full">
                    <Search className="w-4 h-4 mr-2" />
                    Discover People
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
