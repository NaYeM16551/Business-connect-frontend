// import { useEffect, useRef, useState } from "react";
// import SockJS from "sockjs-client";
// import { CompatClient, over } from "stompjs";

// let stompClient: CompatClient;

// interface ChatMessage {
//   senderId: string;
//   receiverId: string;
//   content: string;
//   timestamp?: string;
// }

// export default function ChatPage({ currentUserId, receiverId }: { currentUserId: string; receiverId: string }) {
//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const [newMessage, setNewMessage] = useState("");

//   const connectWebSocket = () => {
//     const socket = new SockJS("http://localhost:8080/ws");
//     stompClient = over(socket);
//     stompClient.connect({}, () => {
//       stompClient.subscribe(`/user/${currentUserId}/queue/messages`, (msg) => {
//         const incoming: ChatMessage = JSON.parse(msg.body);
//         setMessages((prev) => [...prev, incoming]);
//       });
//     });
//   };

//   const sendMessage = () => {
//     const message: ChatMessage = {
//       senderId: currentUserId,
//       receiverId,
//       content: newMessage,
//     };
//     stompClient.send("/app/chat", {}, JSON.stringify(message));
//     setMessages((prev) => [...prev, message]);
//     setNewMessage("");
//   };

//   useEffect(() => {
//     connectWebSocket();
//     return () => stompClient.disconnect(() => console.log("Disconnected"));
//   }, []);

//   return (
//     <div className="max-w-2xl mx-auto p-4 bg-white shadow">
//       <div className="h-96 overflow-y-auto border p-2 mb-4 space-y-2">
//         {messages.map((msg, i) => (
//           <div
//             key={i}
//             className={`p-2 rounded-lg ${msg.senderId === currentUserId ? "bg-blue-100 ml-auto" : "bg-gray-200 mr-auto"}`}
//           >
//             {msg.content}
//           </div>
//         ))}
//       </div>
//       <div className="flex space-x-2">
//         <input
//           type="text"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           className="flex-1 border p-2 rounded"
//           placeholder="Type a message"
//         />
//         <button onClick={sendMessage} className="bg-blue-600 text-white px-4 py-2 rounded">
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }

// import { useEffect, useRef, useState } from "react";
// import SockJS from "sockjs-client";
// import { CompatClient, over } from "stompjs";

// interface ChatMessage {
//   senderId: string;
//   receiverId: string;
//   content: string;
//   timestamp?: string;
// }

// export default function ChatPage({
//   currentUserId,
//   receiverId,
// }: {
//   currentUserId: string;
//   receiverId: string;
// }) {
//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [isConnected, setIsConnected] = useState(false);
//   const stompClientRef = useRef<CompatClient | null>(null);

//   const connectWebSocket = () => {
//      // Frontend (React)
//     const token = localStorage.getItem("token");
//     console.log("Connecting with token:", token);
//     //const socket = new SockJS(`http://localhost:8080/ws?token=${token}`);
//     //const stompClient = over(socket);

//     const socket = new SockJS(`http://localhost:8080/ws?token=${token}`); // Your WebSocket endpoint
//     const client = over(socket);
//     stompClientRef.current = client;

//     client.connect({}, () => {
//       console.log("WebSocket connected");

//       setIsConnected(true);

//       client.subscribe(`/user/${currentUserId}/queue/messages`, (msg) => {
//         const incoming: ChatMessage = JSON.parse(msg.body);
//         setMessages((prev) => [...prev, incoming]);
//       });
//     });
//   };

//   const sendMessage = () => {
//     if (!stompClientRef.current || !isConnected) {
//       console.warn("WebSocket not connected yet.");
//       return;
//     }

//     const message: ChatMessage = {
//       senderId: currentUserId,
//       receiverId,
//       content: newMessage.trim(),
//     };

//     if (message.content) {
//       stompClientRef.current.send(
//         "/app/chat",
//         {},
//         JSON.stringify(message)
//       );
//       setMessages((prev) => [...prev, message]);
//       setNewMessage("");
//     }
//   };

//   useEffect(() => {
//     connectWebSocket();

//     return () => {
//       if (stompClientRef.current && stompClientRef.current.connected) {
//         stompClientRef.current.disconnect(() =>
//           console.log("WebSocket disconnected")
//         );
//       }
//     };
//   }, []);

//   return (
//     <div className="max-w-2xl mx-auto p-4 bg-white shadow">
//       <div className="h-96 overflow-y-auto border p-2 mb-4 space-y-2">
//         {messages.map((msg, i) => (
//           <div
//             key={i}
//             className={`p-2 max-w-sm rounded-lg ${
//               msg.senderId === currentUserId
//                 ? "bg-blue-100 ml-auto text-right"
//                 : "bg-gray-200 mr-auto text-left"
//             }`}
//           >
//             {msg.content}
//           </div>
//         ))}
//       </div>
//       <div className="flex space-x-2">
//         <input
//           type="text"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           className="flex-1 border p-2 rounded"
//           placeholder="Type a message"
//         />
//         <button
//           onClick={sendMessage}
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }

import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import SockJS from "sockjs-client";
import { CompatClient, over } from "stompjs";

interface ChatMessage {
  id?: number;
  senderId: number;
  receiverId: number;
  content: string;
  timestamp?: string;
  read?: boolean;
}

export default function ChatPage({
  currentUserId,
}: {
  currentUserId: number;
}) {
   const { receiverId } = useParams();
  
  const numericReceiverId = parseInt(receiverId || "0", 10);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const stompClientRef = useRef<CompatClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  

  const token = localStorage.getItem("token");

  // Load previous messages via REST API
  const loadChatHistory = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/${currentUserId}/messages/chat/${numericReceiverId}`
,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch chat history");
      const data: ChatMessage[] = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Error loading chat history:", err);
    }
  };

  // Setup WebSocket
  const connectWebSocket = () => {
    if (stompClientRef.current && stompClientRef.current.connected) {
    console.log("⚠️ Already connected. Skipping...");
    return;
  }
    const socket = new SockJS(`http://localhost:8080/ws?token=${token}`);
    const client = over(socket);
    stompClientRef.current = client;

    client.connect({}, () => {
      setIsConnected(true);
      console.log("✅ WebSocket connected");
      client.unsubscribe(`/user/${currentUserId}/queue/messages`); // Just in case
      client.subscribe(`/user/${currentUserId}/queue/messages`, (msg) => {
        const incoming: ChatMessage = JSON.parse(msg.body);
        setMessages((prev) => {
          const exists = prev.some(
            (m) =>
              m.content === incoming.content &&
              m.senderId === incoming.senderId &&
              m.receiverId === incoming.receiverId &&
              m.timestamp === incoming.timestamp
          );
          return exists ? prev : [...prev, incoming];
        });
      });
    });
  };

  const sendMessage = () => {
    if (!stompClientRef.current || !isConnected) {
      console.warn("WebSocket not connected.");
      return;
    }

    const message: ChatMessage = {
      senderId: currentUserId,
      receiverId: numericReceiverId,
      content: newMessage.trim(),
    };

    if (message.content) {
      stompClientRef.current.send("/app/chat", {}, JSON.stringify(message));
      setMessages((prev) => [...prev, message]);
      setNewMessage("");
    }
  };

  const deleteMessage = async (id: number) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/messages/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.ok) {
        setMessages((prev) => prev.filter((msg) => msg.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete message:", err);
    }
  };

  useEffect(() => {
    loadChatHistory();
    connectWebSocket();

    return () => {
      if (stompClientRef.current?.connected) {
        stompClientRef.current.disconnect(() =>
          console.log("🔌 WebSocket disconnected")
        );
      }
    };
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow">
      <div className="h-96 overflow-y-auto border p-2 mb-4 space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 max-w-sm rounded-lg relative ${
              msg.senderId === currentUserId
                ? "bg-blue-100 ml-auto text-right"
                : "bg-gray-200 mr-auto text-left"
            }`}
          >
            {msg.content}
            {msg.senderId === currentUserId && (
              <button
                onClick={() => msg.id && deleteMessage(msg.id)}
                className="text-xs text-red-500 ml-2"
              >
                ❌
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border p-2 rounded"
          placeholder="Type a message"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
