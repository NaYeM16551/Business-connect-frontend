// ContestQuestionsPage.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface QuestionModel {
  id: number;
  title: string;
  marks: number;
}

const PastContestQuestionsPage = ({ currentUserId }: { currentUserId: number }) => {
  const { contestId } = useParams<{ contestId: string }>();
  const [questions, setQuestions] = useState<QuestionModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://57.159.26.157:8080/api/v1/${currentUserId}/contests/${contestId}/questions`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setQuestions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching questions:", err);
        setLoading(false);
      });
  }, [contestId]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Questions for Contest #{contestId}</h2>

      {loading ? (
        <p>Loading questions...</p>
      ) : questions.length === 0 ? (
        <p>No questions found for this contest.</p>
      ) : (
        <ul className="space-y-4">
          {questions.map((q) => (
            <li key={q.id} className="border p-4 rounded shadow-md">
              <h3 className="text-lg font-semibold">{q.title}</h3>
              <p className="text-sm text-gray-600 mb-2">Marks: {q.marks}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PastContestQuestionsPage;
