import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";

interface Contest {
  id: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
}

interface LiveContestsPageProps {
  currentUserId: number;
}

const LiveContestsPage = ({ currentUserId }: LiveContestsPageProps) => {
  const [contests, setContests] = useState<Contest[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
  console.log("Fetching live contests for user:", currentUserId);
  axios
    .get(`http://localhost:8080/api/v1/${currentUserId}/contests/LiveContests`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then((res) => {
      console.log("Fetched contests:", res.data); // log what comes back
      setContests(res.data);
    })
    .catch((err) => {
      console.error("Error fetching contests:", err);
      setContests([]); // fallback to empty array on error
    });
}, [currentUserId]);


  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Live Contests</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contests.map((contest) => (
          <Card key={contest.id} onClick={() => navigate(`/contests/live/${contest.id}`)} className="cursor-pointer hover:shadow-xl">
            <CardContent className="p-4">
              <h3 className="text-xl font-bold">{contest.title}</h3>
              <p>{contest.description}</p>
              <p className="text-sm text-gray-500">
                Ends: {new Date(contest.endTime).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LiveContestsPage;
