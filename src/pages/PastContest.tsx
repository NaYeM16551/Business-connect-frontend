// 1. PastContestsPage.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Contest {
  id: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
}

const PastContestsPage = ({ currentUserId }: { currentUserId: number }) => {
  const [contests, setContests] = useState<Contest[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8080/api/v1/${currentUserId}/contests/PastContests`).then((res) => {
      setContests(res.data);
    });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Past Contests</h1>
      {contests.map((contest) => (
        <div key={contest.id} className="border rounded-xl p-4 mb-4 shadow">
          <h2 className="text-xl font-semibold">{contest.title}</h2>
          <p>{contest.description}</p>
          <div className="mt-2 space-x-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => navigate(`/contests/${contest.id}/questions`)}
            >
              See Questions
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={() => navigate(`/contests/${contest.id}/my-submissions`)}
            >
              My Submissions
            </button>
            <button
              className="bg-purple-500 text-white px-4 py-2 rounded"
              onClick={() => navigate(`/contests/${contest.id}/leaderboard`)}
            >
              See Leaderboard
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PastContestsPage;