
// ContestQuestionsPage.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ContestQuestionsPage = ({ currentUserId }: { currentUserId: number }) => {
  const { contestId } = useParams();
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/v1/${currentUserId}/contests/${contestId}/GetAllQuestions`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setQuestions(res.data))
      .catch((err) => console.error("Error fetching questions", err));
  }, [contestId, currentUserId]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Questions</h2>
      {questions.map((q) => (
        <div key={q.id} className="border p-4 rounded mb-2">
          <h3 className="font-semibold">{q.title}</h3>
          <p>{q.description}</p>
        </div>
      ))}
    </div>
  );
};

export default ContestQuestionsPage;