// CreateContestPage.tsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateContestPage = ({ currentUserId }: { currentUserId: number }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    axios
      .post(
        `http://localhost:8080/api/v1/${currentUserId}/contests/create`,
        {title, description, startTime, endTime, createdBy : currentUserId},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(() => navigate("/contests/myContests"))
      .catch((err) => console.error("Failed to create contest", err));
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create Contest</h2>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="border p-2 mb-2 w-full" />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="border p-2 mb-2 w-full" />
      <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="border p-2 mb-2 w-full" />
      <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="border p-2 mb-2 w-full" />
      <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
    </div>
  );
};

export default CreateContestPage;