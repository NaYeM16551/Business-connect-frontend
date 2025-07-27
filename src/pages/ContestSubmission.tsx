import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface Submission {
  id: number;
  participantId: number;
  questionId: number;
  fileUrl: string;
  submittedAt: string;
  grade: number;
}


const ContestSubmissionsPage = ({ currentUserId }: { currentUserId: number }) => {
  const { contestId } = useParams();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [grades, setGrades] = useState<{ [submissionId: number]: number }>({});

  useEffect(() => {
    fetchSubmissions();
  }, [contestId]);

  const fetchSubmissions = () => {
    axios
      .get(`http://localhost:8080/api/v1/${currentUserId}/contests/${contestId}/allsubmissions`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setSubmissions(res.data);
        // Preload grades
        const gradeMap: { [id: number]: number } = {};
        res.data.forEach((s: Submission) => {
          gradeMap[s.id] = s.grade;
        });
        setGrades(gradeMap);
      })
      .catch((err) => console.error("Failed to fetch submissions", err));
  };

  const handleGradeChange = (submissionId: number, newGrade: number) => {
    setGrades((prev) => ({
      ...prev,
      [submissionId]: newGrade,
    }));
  };

  const handleUpdateGrade = (submissionId: number) => {
    const grade = grades[submissionId];

    axios
      .put(
        `http://localhost:8080/api/v1/${currentUserId}/contests/${contestId}/allsubmissions/${submissionId}/grade?grade=${grade}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(() => {
        alert(`Grade updated for submission ${submissionId}`);
        fetchSubmissions(); // optional refresh
      })
      .catch((err) => console.error("Failed to update grade", err));
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Submissions for Contest {contestId}</h2>
      {submissions.length === 0 ? (
        <p>No submissions found.</p>
      ) : (
        submissions.map((s) => (
          <div key={s.id} className="border rounded p-4 mb-4">
            <p><strong>Submission ID:</strong> {s.id}</p>
            <p><strong>User ID:</strong> {s.participantId}</p>
            <p><strong>Problem ID:</strong> {s.questionId}</p>
            <p><strong>File URL:</strong> {s.fileUrl}</p>
            <p><strong>Submitted At:</strong> {s.submittedAt}</p>
            <p><strong>Current Grade:</strong> {s.grade}</p>

            <div className="flex gap-2 mt-2">
              <input
                type="number"
                value={grades[s.id] ?? ""}
                onChange={(e) => handleGradeChange(s.id, parseInt(e.target.value))}
                className="border px-2 py-1"
                placeholder="Enter new grade"
              />
              <button
                onClick={() => handleUpdateGrade(s.id)}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Update Grade
              </button>

              <div className="submission-preview">
        {s.fileUrl.toLowerCase().endsWith(".pdf") ? (
        <iframe
        src={s.fileUrl}
        width="100%"
        height="600px"
        title="PDF Viewer"
        className="border rounded"
        />
         ) : (
        <img
        src={s.fileUrl}
        alt="submission"
        className="max-w-full max-h-96 object-contain border rounded"
        />
        )}

    <a
     href={s.fileUrl}
     target="_blank"
     rel="noopener noreferrer"
     className="text-blue-500 underline block mt-2"
    >
                Open in new tab
            </a>
        </div>


            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ContestSubmissionsPage;
