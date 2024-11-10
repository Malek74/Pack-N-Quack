import React, { useState } from "react";
import { Send } from "lucide-react";
function MessageInput({ onSubmit }) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSubmit(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e) => {
    // Check if Enter is pressed without the Shift key
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevents new line in the textarea
      handleSubmit(e); // Calls the submit function
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center p-2 bg-blue-200 rounded-lg"
    >
      <textarea
        placeholder="Write a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        rows="1"
        className="flex-grow p-2 text-gray-700 bg-transparent outline-none placeholder-gray-500 resize-none overflow-hidden"
        style={{ maxHeight: "150px" }} // Limit the max height
      />
      <button type="submit" className="mr-2 text-blue-500 hover:text-blue-700">
        <Send />
      </button>
    </form>
  );
}

export default MessageInput;
