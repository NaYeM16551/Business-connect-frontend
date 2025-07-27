// 3. MySubmissionsPage.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

interface Submission {
  id: number;
  fileUrl: string;
  status: string;
  grade: number;
}

const MySubmissionsPage = ({ currentUserId }: { currentUserId: number }) => {
  const { contestId } = useParams();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const userId = 1; // Replace with actual user ID from auth

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/v1/${currentUserId}/contests/${contestId}/submissions`, {
        params: { id: userId },
      })
      .then((res) => setSubmissions(res.data));
  }, [contestId]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Submissions</h2>
      <ul>
        {submissions.map((s) => (
          <li key={s.id} className="mb-2">
            <span>Status: {s.status}, Grade: {s.grade}</span>
            <a
              href={s.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-4 text-blue-600 underline"
            >
              View File
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MySubmissionsPage;