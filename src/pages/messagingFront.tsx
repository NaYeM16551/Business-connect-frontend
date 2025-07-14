// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { User } from "lucide-react";

// interface UserDTO {
//   id: number;
//   username: string;
//   email: string;
//   profilePictureUrl?: string | null;
// }

// interface MessageListProps {
//   currentUserId: number;
// }

// export default function MessageList({ currentUserId }: MessageListProps) {
//   const [senders, setSenders] = useState<UserDTO[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!currentUserId) return;

//     const fetchSenders = async () => {
//       try {
//         const res = await fetch(
//           `http://localhost:8080/api/v1/${currentUserId}/messages`,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );

//         if (!res.ok) {
//           throw new Error("Failed to fetch messages");
//         }

//         const data: UserDTO[] = await res.json();
//         setSenders(data);
//         setLoading(false);
//       } catch (err: any) {
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     fetchSenders();
//   }, [currentUserId]);

//   const handleClick = (senderId: number) => {
//     navigate(`/chat/${senderId}`, { state: { receiver } });
//   };

//   if (loading) {
//     return <div className="text-center p-4">Loading messages...</div>;
//   }

//   if (error) {
//     return <div className="text-center text-red-500 p-4">{error}</div>;
//   }

//   return (
//     <div className="max-w-md mx-auto mt-6 bg-white rounded shadow p-4 space-y-4">
//       <h2 className="text-xl font-bold mb-4 text-slate-800">Message Requests</h2>
//       {senders.length === 0 ? (
//         <p className="text-slate-600">No messages found</p>
//       ) : (
//         senders.map((sender) => (
//           <div
//             key={sender.id}
//             className="flex items-center space-x-3 p-3 rounded hover:bg-blue-50 cursor-pointer"
//             onClick={() => handleClick(sender.id)}
//           >
//             {sender.profilePictureUrl ? (
//               <img
//                 src={sender.profilePictureUrl}
//                 alt={sender.username}
//                 className="w-10 h-10 rounded-full object-cover"
//               />
//             ) : (
//               <User className="w-10 h-10 text-slate-500" />
//             )}
//             <div>
//               <p className="font-semibold text-slate-800">{sender.username}</p>
//               <p className="text-sm text-slate-500">{sender.email}</p>
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";

interface UserDTO {
  id: number;
  username: string;
  email: string;
  profilePictureUrl?: string | null;
}

interface MessageFrontProps {
  currentUserId: number;
}

export default function MessageFront({ currentUserId }: MessageFrontProps) {
  const [senders, setSenders] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUserId) return;

    const fetchSenders = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/v1/${currentUserId}/messages`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch messages");
        }

        const data: UserDTO[] = await res.json();
        setSenders(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSenders();
  }, [currentUserId]);

  const handleClick = (receiver: UserDTO) => {
    navigate(`/chat/${receiver.id}`, {
      state: { receiver }, // 🟢 Send full user object
    });
  };

  if (loading) {
    return <div className="text-center p-4">Loading messages...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-6 bg-white rounded shadow p-4 space-y-4">
      <h2 className="text-xl font-bold mb-4 text-slate-800">Message Requests</h2>
      {senders.length === 0 ? (
        <p className="text-slate-600">No messages found</p>
      ) : (
        senders.map((sender) => (
          <div
            key={sender.id}
            className="flex items-center space-x-3 p-3 rounded hover:bg-blue-50 cursor-pointer"
            onClick={() => handleClick(sender)}
          >
            {sender.profilePictureUrl ? (
              <img
                src={sender.profilePictureUrl}
                alt={sender.username}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <User className="w-10 h-10 text-slate-500" />
            )}
            <div>
              <p className="font-semibold text-slate-800">{sender.username}</p>
              <p className="text-sm text-slate-500">{sender.email}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
