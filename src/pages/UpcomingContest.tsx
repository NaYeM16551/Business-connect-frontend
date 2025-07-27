import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";

interface Contest {
  id: number;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
}
interface UpcomingContestsPageProps {
  currentUserId: number;
}
const UpcomingContests: React.FC<UpcomingContestsPageProps> = ({ currentUserId }) => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await axios.get(`http://57.159.26.157:8080/api/v1/${currentUserId}/contests/UpcomingContests`); // Adjust your backend route here
        setContests(response.data);
        setLoading(false);
      } catch (err: unknown) {
        setError("Failed to load contests");
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  if (loading) return <div className="text-center text-lg p-4">Loading...</div>;
  if (error) return <div className="text-center text-red-600 p-4">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Upcoming Contests</h1>
      {contests.length === 0 ? (
        <p className="text-center text-gray-500">No upcoming contests available.</p>
      ) : (
        <div className="grid gap-6">
          {contests.map((contest) => (
            <div key={contest.id} className="border p-4 rounded-xl shadow hover:shadow-lg transition-all">
              <h2 className="text-2xl font-semibold mb-2 text-blue-600">{contest.name}</h2>
              <p className="mb-2 text-gray-700">{contest.description}</p>
              <div className="text-sm text-gray-600">
                <p>
                  <strong>Start:</strong>{" "}
                  {format(new Date(contest.startTime), "PPPpp")}
                </p>
                <p>
                  <strong>End:</strong>{" "}
                  {format(new Date(contest.endTime), "PPPpp")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingContests;
