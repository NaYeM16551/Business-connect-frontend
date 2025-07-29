// 4. LeaderboardPage.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

interface LeaderBoardDto {
  participant_id: number;
  userName: string;
  score: number;
}

const LeaderboardPage = ({ currentUserId }: { currentUserId: number }) => {
  const { contestId } = useParams();
  const [leaderboard, setLeaderboard] = useState<LeaderBoardDto[]>([]);

  useEffect(() => {
    axios
      .get(`http://57.159.26.157:8080/api/v1/${currentUserId}/contests/${contestId}/leaderboard`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setLeaderboard(res.data));
  }, [contestId]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
      <table className="table-auto w-full border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Rank</th>
            <th className="border px-4 py-2">Username</th>
            <th className="border px-4 py-2">Total Marks</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, index) => (
            <tr key={entry.participant_id}>
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{entry.userName}</td>
              <td className="border px-4 py-2">{entry.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardPage;
