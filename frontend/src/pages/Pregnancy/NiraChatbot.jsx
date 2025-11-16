import React, { useState, useRef, useEffect } from "react";
import { SendHorizonal, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NiraChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hi, I am Nira. Ask me anything about PCOD or health symptoms!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    const userInput = input; // store before clearing
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://pcod-ml.onrender.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userInput }),
      });

      const data = await res.json();
      let text = data.reply || "I'm still learning! Please ask something else.";

      // clean up formatting
      text = text.replace(/\*/g, "");

      const botMessage = { from: "bot", text };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "⚠️ Error contacting server. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-screen h-screen bg-white">
      {/* Toggle Button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 p-4 bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white rounded-full shadow-xl z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-20 right-4 w-[90%] sm:w-96 h-[70vh] bg-gradient-to-r from-blue-300 to-pink-300 rounded-xl shadow-2xl flex flex-col overflow-hidden z-40 border-2 border-blue-500"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-blue-500 to-pink-500 text-white font-bold text-lg">
              Nira AI
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: msg.from === "user" ? 50 : -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`max-w-[80%] px-4 py-2 rounded-lg text-sm break-words ${
                    msg.from === "user"
                      ? "bg-white text-black self-end text-right ml-auto"
                      : "bg-gradient-to-r from-pink-500 to-blue-500 text-white self-start"
                  }`}
                >
                  {msg.text}
                </motion.div>
              ))}
              {loading && (
                <div className="text-sm text-gray-600 animate-pulse">
                  Nira is typing...
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-blue-500 bg-gradient-to-r from-blue-100 to-pink-100 flex items-center">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                type="text"
                placeholder="Ask about doctor booking, PCOD, health..."
                className="flex-1 px-4 py-2 rounded-l-lg bg-white text-sm outline-none placeholder:text-gray-600"
              />
              <button
                onClick={handleSend}
                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-r-lg hover:from-pink-600 hover:to-blue-600"
              >
                <SendHorizonal size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NiraChatbot;