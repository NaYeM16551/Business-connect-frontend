// src/App.tsx
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes } from "react-router-dom";

import { RequireAuth } from "@/components/RequireAuth";
import axios from "axios";
import { getCurrentUserIdFromToken } from "./auth";
import AddQuestionPage from "./pages/AddQuestion";
import CompleteRegistration from "./pages/CompleteRegistration";
import ContestOverviewPage from "./pages/ContestOverview";
import ContestSubmissionsPage from "./pages/ContestSubmission";
import CreateContestPage from "./pages/CreateContest";
import CreateGroup from "./pages/CreateGroup";
import ExploreGroups from "./pages/ExploreGroups";
import Feed from "./pages/Feed";
import GroupDetail from "./pages/GroupDetail";
import GroupPosts from "./pages/GroupPosts";
import Index from "./pages/Index";
import LiveContestsPage from "./pages/LiveContest";
import LiveContestDetailPage from "./pages/LiveContestDetail";
import Login from "./pages/Login";
import ContestQuestionsPage from "./pages/MyContestQuestion";
import MyContestsPage from "./pages/MyContests";
import MyGroups from "./pages/MyGroups";
import MyNetwork from "./pages/MyNetwork";
import NotFound from "./pages/NotFound";
import PastContestsPage from "./pages/PastContest";
import LeaderboardPage from "./pages/PastContestLeaderBoard";
import PastContestQuestionsPage from "./pages/PastContestQuestion";
import MySubmissionsPage from "./pages/PastContestSubmission";
import RecommendedGroups from "./pages/RecommendedGroups";
import UpcomingContests from "./pages/UpcomingContest";
import UserProfile from "./pages/UserProfile";
import VerifyEmail from "./pages/VerifyEmail";
import ChatPage from "./pages/chatpage";
import MessageList from "./pages/messagingFront";

const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

const queryClient = new QueryClient();

export default function App() {
  const CurrentUserId = getCurrentUserIdFromToken();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <Routes>
          {/* Public */}
          <Route path="/" element={<Index />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/login" element={<Login />} />

          {/* Protected */}
          <Route
            path="/complete-registration"
            element={
              <RequireAuth>
                <CompleteRegistration />
              </RequireAuth>
            }
          />
          <Route
            path="/feed"
            element={
              <RequireAuth>
                <Feed />
              </RequireAuth>
            }
          />
          <Route
            path="/network"
            element={
              <RequireAuth>
                <MyNetwork />
              </RequireAuth>
            }
          />
          <Route
            path="/groups/my-groups"
            element={
              <RequireAuth>
                <MyGroups />
              </RequireAuth>
            }
          />
          <Route
            path="/groups/explore"
            element={
              <RequireAuth>
                <ExploreGroups />
              </RequireAuth>
            }
          />
          <Route
            path="/groups/recommended-groups"
            element={
              <RequireAuth>
                <RecommendedGroups />
              </RequireAuth>
            }
          />
          <Route
            path="/groups/create"
            element={
              <RequireAuth>
                <CreateGroup />
              </RequireAuth>
            }
          />
          <Route
            path="/groups/:groupId"
            element={
              <RequireAuth>
                <GroupDetail />
              </RequireAuth>
            }
          />
          <Route
            path="/groups/:groupId/posts"
            element={
              <RequireAuth>
                <GroupPosts />
              </RequireAuth>
            }
          />
          <Route
            path="/user/:userId"
            element={
              <RequireAuth>
                <UserProfile />
              </RequireAuth>
            }
          />

          <Route
            path="/messages"
            element={<MessageList currentUserId={CurrentUserId} />}
          />
          <Route
            path="/chat/:receiverId"
            element={<ChatPage currentUserId={CurrentUserId} />}
          />

          <Route
            path="/contests"
            element={<ContestOverviewPage currentUserId={CurrentUserId} />}
          />
          <Route
            path="/contests/live"
            element={<LiveContestsPage currentUserId={CurrentUserId} />}
          />
          <Route
            path="/contests/live/:contestId"
            element={<LiveContestDetailPage currentUserId={CurrentUserId} />}
          />
          <Route
            path="/contests/upcoming"
            element={<UpcomingContests currentUserId={CurrentUserId} />}
          />
          <Route
            path="/contests/create"
            element={<CreateContestPage currentUserId={CurrentUserId} />}
          />
          <Route
            path="/contests/myContests"
            element={<MyContestsPage currentUserId={CurrentUserId} />}
          />
          <Route
            path="/contests/:contestId/add-question"
            element={<AddQuestionPage currentUserId={CurrentUserId} />}
          />
          <Route
            path="/contests/:contestId/questions"
            element={<ContestQuestionsPage currentUserId={CurrentUserId} />}
          />
          <Route
            path="/contests/:contestId/submissions"
            element={<ContestSubmissionsPage currentUserId={CurrentUserId} />}
          />
          <Route
            path="/contests/past"
            element={<PastContestsPage currentUserId={CurrentUserId} />}
          />
          <Route
            path="/contests/:contestId/questions"
            element={<PastContestQuestionsPage currentUserId={CurrentUserId} />}
          />
          <Route
            path="/contests/:contestId/my-submissions"
            element={<MySubmissionsPage currentUserId={CurrentUserId} />}
          />
          <Route
            path="/contests/:contestId/leaderboard"
            element={<LeaderboardPage currentUserId={CurrentUserId} />}
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
