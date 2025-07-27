// // import React, { useEffect, useState } from "react";
// // import { useParams } from "react-router-dom";
// // import axios from "axios";
// // import { Card, CardContent } from "@/components/ui/card";
// // import { Button } from "@/components/ui/button";

// // interface Question {
// //   id: number;
// //   title: string;
// //   marks: number;
// //   attachmentUrl: string;
// //   submitted?: boolean;
// //   fileUrl?: string;
// // }

// // interface LiveContestDetailPageProps {
// //     currentUserId: number;
// // }

// // const LiveContestDetailPage = ({ currentUserId }: LiveContestDetailPageProps) => {
// //   const { contestId } = useParams();
// //   const [questions, setQuestions] = useState<Question[]>([]);
// //   const [remainingTime, setRemainingTime] = useState<string>("");

// //   useEffect(() => {
// //     axios.get(`http://57.159.26.157:8080/api/v1/1/contests/${contestId}/GetAllQuestions`, {
// //       headers: {
// //         Authorization: `Bearer ${localStorage.getItem("token")}`,
// //       },
// //     }).then((res) => {
// //       setQuestions(res.data);
// //     });

// //     const fetchContest = async () => {
// //       const res = await axios.get(`http://57.159.26.157:8080/api/v1/${currentUserId}/contests/${contestId}`, {
// //         headers: {
// //           Authorization: `Bearer ${localStorage.getItem("token")}`,
// //         },
// //       });
// //       const endTime = new Date(res.data.endTime).getTime();
// //       const timer = setInterval(() => {
// //         const now = new Date().getTime();
// //         const diff = endTime - now;
// //         if (diff <= 0) {
// //           clearInterval(timer);
// //           setRemainingTime("Contest Ended");
// //         } else {
// //           const minutes = Math.floor(diff / 60000);
// //           const seconds = Math.floor((diff % 60000) / 1000);
// //           setRemainingTime(`${minutes}m ${seconds}s left`);
// //         }
// //       }, 1000);
// //     };
// //     fetchContest();
// //   }, [contestId]);

// //   const handleSubmit = async (questionId: number, file: File | null) => {
// //     if (!file) return;
// //     const formData = new FormData();
// //     formData.append("file", file);
// //     await axios.post(`http://57.159.26.157:8080/api/v1/1/contests/${contestId}/questions/${questionId}`, formData,
// //       {
// //         headers: {
// //           "Content-Type": "multipart/form-data",
// //           Authorization: `Bearer ${localStorage.getItem("token")}`,
// //         },
// //       } 
// //     );
// //     alert("Submitted successfully!");
// //   };

// //   return (
// //     <div className="p-4 space-y-4">
// //       <h2 className="text-2xl font-semibold">Live Contest Questions</h2>
// //       <p className="text-green-600 font-semibold">{remainingTime}</p>
// //       {questions.map((q) => (
// //         <Card key={q.id}>
// //           <CardContent className="p-4 space-y-2">
// //             <h3 className="font-bold text-lg">{q.title}</h3>
// //             <p>Marks: {q.marks}</p>
// //             {q.attachmentUrl && (
// //               <a
// //                 className="text-blue-500 underline"
// //                 href={q.attachmentUrl}
// //                 target="_blank"
// //                 rel="noopener noreferrer"
// //               >
// //                 View Attachment
// //               </a>
// //             )}
// //             <input
// //               type="file"
// //               onChange={(e) => handleSubmit(q.id, e.target.files?.[0] || null)}
// //             />
// //           </CardContent>
// //         </Card>
// //       ))}
// //     </div>
// //   );
// // };

// // export default LiveContestDetailPage;


// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// interface Question {
//   id: number;
//   title: string;
//   marks: number;
//   attachmentUrl: string;
//   submitted?: boolean;
//   fileUrl?: string;
//   submissionId?: number;
// }

// interface LiveContestDetailPageProps {
//   currentUserId: number;
// }

// const LiveContestDetailPage = ({ currentUserId }: LiveContestDetailPageProps) => {
//   const { contestId } = useParams();
//   const [questions, setQuestions] = useState<Question[]>([]);
//   const [remainingTime, setRemainingTime] = useState<string>("");

//   const fetchQuestions = async () => {
//     const res = await axios.get(
//       `http://57.159.26.157:8080/api/v1/${currentUserId}/contests/${contestId}/GetAllQuestions`,
//       {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       }
//     );
//     setQuestions(res.data);
//   };

//   useEffect(() => {
//     fetchQuestions();

//     const fetchContest = async () => {
//       const res = await axios.get(
//         `http://57.159.26.157:8080/api/v1/${currentUserId}/contests/${contestId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       const endTime = new Date(res.data.endTime).getTime();
//       const timer = setInterval(() => {
//         const now = new Date().getTime();
//         const diff = endTime - now;
//         if (diff <= 0) {
//           clearInterval(timer);
//           setRemainingTime("Contest Ended");
//         } else {
//           const minutes = Math.floor(diff / 60000);
//           const seconds = Math.floor((diff % 60000) / 1000);
//           setRemainingTime(`${minutes}m ${seconds}s left`);
//         }
//       }, 1000);
//     };

//     fetchContest();
//   }, [contestId]);

//   const handleSubmit = async (questionId: number, file: File | null) => {
//     if (!file) return;

//     try {
//       const formData = new FormData();
//       formData.append("file", file);
//       await axios.post(
//         `http://57.159.26.157:8080/api/v1/${currentUserId}/contests/${contestId}/questions/${questionId}`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       alert("Submitted successfully!");
//       fetchQuestions(); // refresh submission status
//     } catch (error) {
//       alert("Submission failed");
//     }
//   };

//   const handleDelete = async (submissionId: number) => {
//   try {
//     await axios.delete(`http://57.159.26.157:8080/api/v1/${currentUserId}/contests/${contestId}/submissions/${submissionId}`, {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//     });
//     alert("Submission deleted successfully.");
//     // Refresh or update state here
//   } catch (error) {
//     alert("Failed to delete submission.");
//   }
// };


//   return (
//     <div className="p-4 space-y-4">
//       <h2 className="text-2xl font-semibold">Live Contest Questions</h2>
//       <p className="text-green-600 font-semibold">{remainingTime}</p>
//       {questions.map((q) => (
//         <Card key={q.id}>
//           <CardContent className="p-4 space-y-2">
//             <h3 className="font-bold text-lg">{q.title}</h3>
//             <p>Marks: {q.marks}</p>
//             {q.attachmentUrl && (
//               <a
//                 className="text-blue-500 underline"
//                 href={q.attachmentUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 View Attachment
//               </a>
//             )}

//             {q.submitted ? (
//               <div className="flex items-center gap-4">
//                 <p className="text-sm text-green-600">Already submitted.</p>
//                 <Button variant="destructive" onClick={() => handleDelete(q.id)}>
//                   Delete Submission
//                 </Button>
//               </div>
//             ) : (
//               <input
//                 type="file"
//                 onChange={(e) => handleSubmit(q.id, e.target.files?.[0] || null)}
//               />
//             )}
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );
// };

// export default LiveContestDetailPage;


import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Question {
  id: number;
  title: string;
  marks: number;
  attachmentUrl: string;
  submitted?: boolean;
  fileUrl?: string;
  submissionId?: number;
}

interface LiveContestDetailPageProps {
  currentUserId: number;
}

const LiveContestDetailPage = ({ currentUserId }: LiveContestDetailPageProps) => {
  const { contestId } = useParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [remainingTime, setRemainingTime] = useState<string>("");

  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await axios.get(`http://57.159.26.157:8080/api/v1/${currentUserId}/contests/${contestId}/GetAllQuestions`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setQuestions(res.data);
    };

    const fetchContest = async () => {
      const res = await axios.get(`http://57.159.26.157:8080/api/v1/${currentUserId}/contests/${contestId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const endTime = new Date(res.data.endTime).getTime();
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const diff = endTime - now;
        if (diff <= 0) {
          clearInterval(timer);
          setRemainingTime("Contest Ended");
        } else {
          const minutes = Math.floor(diff / 60000);
          const seconds = Math.floor((diff % 60000) / 1000);
          setRemainingTime(`${minutes}m ${seconds}s left`);
        }
      }, 1000);
    };

    fetchQuestions();
    fetchContest();
  }, [contestId, currentUserId]);

  const handleSubmit = async (questionId: number, file: File | null) => {
    if (!file) return;

    const question = questions.find((q) => q.id === questionId);
    if (question?.submitted) {
      alert("Submission already exists. Delete it before submitting again.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post(
      `http://57.159.26.157:8080/api/v1/${currentUserId}/contests/${contestId}/questions/${questionId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    alert("Submitted successfully!");

    // Update UI state
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              submitted: true,
              submissionId: res.data.submissionId,
              fileUrl: res.data.fileUrl,
            }
          : q
      )
    );
  };

  const handleDelete = async (questionId: number, submissionId: number) => {
    try {
      await axios.delete(`http://57.159.26.157:8080/api/v1/${currentUserId}/contests/${contestId}/submissions/${submissionId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Submission deleted successfully!");

      // Update UI
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId
            ? { ...q, submitted: false, submissionId: undefined, fileUrl: undefined }
            : q
        )
      );
    } catch (err) {
      alert("Failed to delete submission.");
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-semibold">Live Contest Questions</h2>
      <p className="text-green-600 font-semibold">{remainingTime}</p>
      {questions.map((q) => (
        <Card key={q.id}>
          <CardContent className="p-4 space-y-2">
            <h3 className="font-bold text-lg">{q.title}</h3>
            <p>Marks: {q.marks}</p>
            {q.attachmentUrl && (
              <a
                className="text-blue-500 underline"
                href={q.attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Attachment
              </a>
            )}

            {q.submitted && q.fileUrl ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-700">Submitted File:</p>
<Button
  className="text-blue-500 underline"
  onClick={async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(q.fileUrl, {
        responseType: 'blob', // Important for binary files
        headers: {
          Authorization: `Bearer ${token}`, // Optional if not required for Cloudinary URL
        },
      });

      const blob = new Blob([response.data], { type: response.headers['content-type'] });

      // Extract file extension from URL (e.g., .png, .jpg)
      const extension = q.fileUrl.split('.').pop()?.split('?')[0] || 'png';

      // Create download link
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `submission.${extension}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download failed", err);
      alert("Download failed");
      }
    }}
  >
    View Submission
    </Button>


                {q.submissionId && (
                  <Button
                    className="bg-red-500 hover:bg-red-600 text-white"
                    onClick={() => handleDelete(q.id, q.submissionId!)}
                  >
                    Delete Submission
                  </Button>
                )}
              </div>
            ) : (
              <input
                type="file"
                onChange={(e) => handleSubmit(q.id, e.target.files?.[0] || null)}
              />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default LiveContestDetailPage;
