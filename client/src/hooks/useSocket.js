import { useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:3000";

export function useSocket(roomId) {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isAITyping, setIsAITyping] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !roomId) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      setError(null);
      socket.emit("room:join", { roomId });
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("connect_error", (err) => {
      setError(err.message);
      setIsConnected(false);
    });

    socket.on("error", ({ message }) => {
      setError(message);
    });

    socket.on("room:history", ({ messages: history, roomName: name }) => {
      setMessages(history || []);
      setRoomName(name || "");
    });

    socket.on("message:new", ({ message }) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("room:onlineUsers", ({ users }) => {
      setOnlineUsers(users || []);
    });

    socket.on("room:userJoined", ({ username }) => {
      // Could show a toast
      console.log(`${username} joined`);
    });

    socket.on("room:userLeft", ({ username }) => {
      console.log(`${username} left`);
    });

    socket.on("typing:update", ({ userId, username, isTyping }) => {
      setTypingUsers((prev) => {
        const filtered = prev.filter((u) => u.userId !== userId);
        if (isTyping) return [...filtered, { userId, username }];
        return filtered;
      });
    });

    socket.on("ai:typing", ({ isTyping }) => {
      setIsAITyping(isTyping);
    });

    return () => {
      socket.emit("room:leave", { roomId });
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
      setMessages([]);
      setOnlineUsers([]);
      setTypingUsers([]);
      setIsAITyping(false);
    };
  }, [roomId]);

  const sendMessage = useCallback(
    (content) => {
      if (socketRef.current && content?.trim()) {
        socketRef.current.emit("message:send", { roomId, content });
      }
    },
    [roomId]
  );

  const startTyping = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit("typing:start", { roomId });
    }
  }, [roomId]);

  const stopTyping = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit("typing:stop", { roomId });
    }
  }, [roomId]);

  return {
    isConnected,
    messages,
    onlineUsers,
    typingUsers,
    isAITyping,
    roomName,
    error,
    sendMessage,
    startTyping,
    stopTyping,
  };
}
