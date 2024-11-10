import React from "react";

function ChatMessage({ message, direction }) {
  return (
    <div
      className={`max-w-xs px-4 py-2 m-2 rounded-lg text-white text-sm ${
        direction === "left"
          ? "bg-blue-400 rounded-tl-none self-start"
          : "bg-blue-600 rounded-tr-none self-end"
      }`}
      style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }} // Ensures text wraps properly
    >
      {message}
    </div>
  );
}

export default ChatMessage;
