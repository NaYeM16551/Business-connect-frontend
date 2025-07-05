// src/App.tsx
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes } from "react-router-dom";

import { RequireAuth } from "@/components/RequireAuth";
import CompleteRegistration from "./pages/CompleteRegistration";
import CreateGroup from "./pages/CreateGroup";
import ExploreGroups from "./pages/ExploreGroups";
import Feed from "./pages/Feed";
import GroupDetail from "./pages/GroupDetail";
import GroupPosts from "./pages/GroupPosts";
import Index from "./pages/Index";
import Login from "./pages/Login";
import MyGroups from "./pages/MyGroups";
import NotFound from "./pages/NotFound";
import VerifyEmail from "./pages/VerifyEmail";

const queryClient = new QueryClient();

export default function App() {
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

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
