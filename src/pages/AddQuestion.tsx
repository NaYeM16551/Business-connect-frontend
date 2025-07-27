// AddQuestionPage.tsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";


const AddQuestionPage = ({ currentUserId }: { currentUserId: number }) => {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [marks, setMarks] = useState("");

  const handleSubmit = () => {
    axios
      .post(
        `http://localhost:8080/api/v1/${currentUserId}/contests/${contestId}/MakeQuestion`,
        {contestId, title, marks, },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(() => navigate(`/contests/${contestId}/questions`))
      .catch((err) => console.error("Error creating question", err));
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add Question</h2>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="border p-2 mb-2 w-full" />
      <textarea value={marks} onChange={(e) => setMarks(e.target.value)} placeholder="Marks" className="border p-2 mb-2 w-full" />
      <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded">Submit</button>
    </div>
  );
};

export default AddQuestionPage;