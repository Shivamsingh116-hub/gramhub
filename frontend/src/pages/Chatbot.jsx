import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
const apiUrl = import.meta.env.VITE_API_URL;

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const sendMessage = async () => {
    const message = input.trim();

    if (!message || loading) return;

    // Add user's message immediately
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: message,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to get AI response");
      }

      // Add AI response
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <main className="fixed inset-0 z-50 flex w-full max-w-full flex-col bg-gradient-to-br from-white via-blue-50 to-cyan-100 text-cyan-500">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-cyan-200 bg-white/70 px-5 py-4 backdrop-blur-md">
        <div>
          <h1 className="text-xl font-bold text-cyan-600">AI Assistant</h1>

          <p className="text-sm text-gray-500">Ask me anything</p>
        </div>
        <div>
          <Link
            to="/"
            className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-cyan-600 hover:text-cyan-700"
          >
            <HomeIcon />
          </Link>
        </div>
      </header>

      {/* Messages */}
      <section className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
          {/* Empty state */}
          {messages.length === 0 && (
            <div className="flex flex-1 items-center justify-center py-20 text-center">
              <div>
                <h2 className="mb-2 text-2xl font-bold text-cyan-600">
                  How can I help you?
                </h2>

                <p className="text-gray-500">
                  Start a conversation with your AI assistant.
                </p>
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                  message.role === "user"
                    ? "rounded-br-sm bg-cyan-500 text-white"
                    : "rounded-bl-sm border border-cyan-100 bg-white text-gray-700"
                }`}
              >
                <p className="whitespace-pre-wrap text-sm break-words">
                  {message.content}
                </p>
              </div>
            </div>
          ))}

          {/* Loading */}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl text-sm rounded-bl-sm border border-cyan-100 bg-white px-4 py-3 text-gray-500 shadow-sm">
                AI is thinking...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </section>

      {/* Input */}
      <footer className="border-t border-cyan-200 bg-white/70 p-4 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-4xl gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            rows={2}
            disabled={loading}
            className="min-h-[48px] text-sm flex-1 resize-none rounded-xl border border-cyan-200 bg-white px-4 py-3 text-gray-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 disabled:bg-gray-100"
          />

          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "..." : "Send"}
          </button>
        </div>

        <p className="mt-2 text-center text-xs text-gray-400">
          Press Enter to send • Shift + Enter for a new line
        </p>
      </footer>
    </main>
  );
};

export default Chatbot;
