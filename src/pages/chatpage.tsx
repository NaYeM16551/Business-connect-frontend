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
//     const socket = new SockJS("http://57.159.26.157:8080/ws");
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
//     //const socket = new SockJS(`http://57.159.26.157:8080/ws?token=${token}`);
//     //const stompClient = over(socket);

//     const socket = new SockJS(`http://57.159.26.157:8080/ws?token=${token}`); // Your WebSocket endpoint
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

import { Clock, MessageCircle, Send, Trash2 } from "lucide-react";
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

export default function ChatPage({ currentUserId }: { currentUserId: number }) {
  const { receiverId } = useParams();

  const numericReceiverId = parseInt(receiverId || "0", 10);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const stompClientRef = useRef<CompatClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const token = localStorage.getItem("token");

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Format timestamp for display
  const formatTime = (timestamp?: string) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const deleteMessage = async (id: number) => {
    try {
      const res = await fetch(
        `http://57.159.26.157:8080/api/v1/messages/delete/${id}`,
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
    if (!numericReceiverId || numericReceiverId <= 0) return;

    // Clear previous messages when switching conversations
    setMessages([]);
    setIsConnected(false);

    // Load previous messages via REST API
    const loadChatHistory = async () => {
      try {
        console.log(
          `Loading chat history for conversation ${currentUserId} -> ${numericReceiverId}`
        );
        const res = await fetch(
          `http://57.159.26.157:8080/api/v1/${currentUserId}/messages/chat/${numericReceiverId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          if (res.status === 404) {
            // No chat history found - this is normal for new conversations
            console.log(
              "No previous chat history found - starting new conversation"
            );
            setMessages([]);
            return;
          }
          throw new Error(`Failed to fetch chat history: ${res.status}`);
        }

        const data: ChatMessage[] = await res.json();
        console.log(`Loaded ${data.length} previous messages`);
        setMessages(data || []);
      } catch (err) {
        console.error("Error loading chat history:", err);
        // Set empty array for new conversations
        setMessages([]);
      }
    };

    // Setup WebSocket
    const connectWebSocket = () => {
      // Disconnect any existing connection first
      if (stompClientRef.current?.connected) {
        console.log("Disconnecting existing WebSocket connection...");
        stompClientRef.current.disconnect(() => {
          console.log("Previous connection disconnected");
        });
      }

      console.log("Establishing new WebSocket connection...");
      const socket = new SockJS(`http://57.159.26.157:8080/ws?token=${token}`);
      const client = over(socket);
      stompClientRef.current = client;

      client.connect(
        {},
        () => {
          setIsConnected(true);
          console.log("✅ WebSocket connected successfully");

          // Subscribe to incoming messages
          client.subscribe(`/user/${currentUserId}/queue/messages`, (msg) => {
            const incoming: ChatMessage = JSON.parse(msg.body);
            console.log("Received WebSocket message:", incoming);

            setMessages((prev) => {
              // Check if message already exists to avoid duplicates
              const exists = prev.some(
                (m) =>
                  m.content === incoming.content &&
                  m.senderId === incoming.senderId &&
                  m.receiverId === incoming.receiverId &&
                  Math.abs(
                    new Date(m.timestamp || "").getTime() -
                      new Date(incoming.timestamp || "").getTime()
                  ) < 1000
              );
              return exists ? prev : [...prev, incoming];
            });
          });
        },
        (error: Error | string) => {
          console.error("WebSocket connection failed:", error);
          setIsConnected(false);
        }
      );
    };

    // Load chat history first, then connect WebSocket
    const initializeChat = async () => {
      await loadChatHistory();
      connectWebSocket();
    };

    initializeChat();

    return () => {
      if (stompClientRef.current?.connected) {
        console.log("🔌 Cleaning up WebSocket connection");
        stompClientRef.current.disconnect(() =>
          console.log("WebSocket disconnected on cleanup")
        );
      }
      setIsConnected(false);
    };
  }, [numericReceiverId, currentUserId, token]); // Dependencies for re-running when conversation changes

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">Chat Conversation</h2>
              <div className="flex items-center space-x-2 text-sm opacity-90">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? "bg-green-400" : "bg-red-400"
                  }`}
                ></div>
                <span>{isConnected ? "Connected" : "Connecting..."}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <MessageCircle className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg font-medium">No messages yet</p>
            <p className="text-sm">
              Start the conversation by sending a message
            </p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.senderId === currentUserId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-2xl shadow-sm relative group ${
                  msg.senderId === currentUserId
                    ? "bg-blue-600 text-white rounded-br-md"
                    : "bg-white text-gray-800 border border-gray-200 rounded-bl-md"
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.content}</p>
                {msg.timestamp && (
                  <div
                    className={`flex items-center mt-2 text-xs ${
                      msg.senderId === currentUserId
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTime(msg.timestamp)}
                  </div>
                )}
                {msg.senderId === currentUserId && msg.id && (
                  <button
                    onClick={() => deleteMessage(msg.id!)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center hover:bg-red-600"
                    title="Delete message"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 max-h-32"
              placeholder="Type your message..."
              rows={1}
              style={{
                minHeight: "48px",
                maxHeight: "128px",
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = Math.min(target.scrollHeight, 128) + "px";
              }}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || !isConnected}
            className="bg-blue-600 text-white p-3 rounded-2xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
            title="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span
            className={`flex items-center space-x-1 ${
              isConnected ? "text-green-600" : "text-red-600"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span>{isConnected ? "Online" : "Offline"}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
