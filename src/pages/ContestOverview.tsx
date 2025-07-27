// contest-overview-page.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ContestOverviewProps {
  currentUserId: number;
}

const ContestOverviewPage = ({ currentUserId }: ContestOverviewProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 gap-4">
      <h1 className="text-3xl font-bold">Contests</h1>
      <div className="flex gap-4">
        <Button onClick={() => navigate("/contests/live")}>Live Contests</Button>
        <Button onClick={() => navigate("/contests/upcoming")}>Upcoming Contests</Button>
        <Button onClick={() => navigate("/contests/past")}>Past Contests</Button>
        <Button onClick={() => navigate("/contests/create")}>Create Contest</Button>
        <Button onClick={() => navigate("/contests/myContests")}>See My Created Contests</Button>
      </div>
    </div>
  );
};

export default ContestOverviewPage;