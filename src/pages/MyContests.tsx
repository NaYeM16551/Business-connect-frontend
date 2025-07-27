// // MyContestsPage.tsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const MyContestsPage = ({ currentUserId }: { currentUserId: number }) => {
//   const [contests, setContests] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     axios
//       .get(`http://localhost:8080/api/v1/${currentUserId}/contests/myContests`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       })
//       .then((res) => setContests(res.data))
//       .catch((err) => console.error(err));
//   }, [currentUserId]);

//   return (
//     <div className="p-4">
//       <h2 className="text-2xl font-bold mb-4">My Contests</h2>
//       {contests.map((c) => (
//         <div key={c.id} className="border p-4 rounded mb-4">
//           <h3 className="text-lg font-semibold">{c.title}</h3>
//           <p>{c.description}</p>
//           <div className="mt-2 flex gap-2">
//             <button onClick={() => navigate(`/contests/${c.id}/questions`)} className="bg-gray-700 text-white px-3 py-1 rounded">See All Questions</button>
//             <button onClick={() => navigate(`/contests/${c.id}/add-question`)} className="bg-green-600 text-white px-3 py-1 rounded">Add Question</button>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default MyContestsPage;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyContestsPage = ({ currentUserId }: { currentUserId: number }) => {
  const [contests, setContests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchContests();
  }, [currentUserId]);

  const fetchContests = () => {
    axios
      .get(`http://localhost:8080/api/v1/${currentUserId}/contests/myContests`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setContests(res.data))
      .catch((err) => console.error(err));
  };

  const handleStartContest = (contestId: number) => {
    axios
      .put(`http://localhost:8080/api/v1/${currentUserId}/contests/${contestId}/start`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        alert("Contest started!");
        fetchContests(); // refresh updated status
      })
      .catch((err) => console.error("Failed to start contest", err));
  };

  const handleFinishContest = (contestId: number) => {
    axios
      .put(`http://localhost:8080/api/v1/${currentUserId}/contests/${contestId}/finish`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        alert("Contest finished!");
        fetchContests(); // refresh updated status
      })
      .catch((err) => console.error("Failed to finish contest", err));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Contests</h2>
      {contests.map((c) => (
        <div key={c.id} className="border p-4 rounded mb-4">
          <h3 className="text-lg font-semibold">{c.title}</h3>
          <p>{c.description}</p>
          <p className="text-sm text-gray-500 mt-1">Status: <strong>{c.status}</strong></p>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => navigate(`/contests/${c.id}/questions`)}
              className="bg-gray-700 text-white px-3 py-1 rounded"
            >
              See All Questions
            </button>
            <button
              onClick={() => navigate(`/contests/${c.id}/add-question`)}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              Add Question
            </button>
            <button
              onClick={() => handleStartContest(c.id)}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Start Contest
            </button>
            <button
              onClick={() => handleFinishContest(c.id)}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Finish Contest
            </button>
            {c.status === "PAST" && (
            <button
                onClick={() => navigate(`/contests/${c.id}/submissions`)}
            className="bg-purple-600 text-white px-3 py-1 rounded"
                        >
                See All Submissions
                </button>
                )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyContestsPage;

