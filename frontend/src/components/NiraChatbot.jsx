import React, { useState, useRef, useEffect } from "react";
import { SendHorizonal, MessageCircle, Square } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NiraChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hi, I’m Nira 👋. Ask me anything about PCOD, symptoms, or women’s health!",
    },
  ]);

  // Chat container variants for animation
  const chatVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: { 
      opacity: 0, 
      y: 20, 
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  // Button variants for animation
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [stopTyping, setStopTyping] = useState(false);
  const bottomRef = useRef(null);
  const controllerRef = useRef(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    const userInput = input;
    setInput("");
    setLoading(true);
    setStopTyping(false);

    controllerRef.current = new AbortController();

    try {
      const res = await fetch("https://pcod-ml.onrender.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `${userInput}\n\nPlease respond professionally, concisely, and in short bullet points if applicable. Avoid long paragraphs.`,
        }),
        signal: controllerRef.current.signal,
      });

      const data = await res.json();
      let fullText =
        data.reply ||
        "I'm still learning! Please ask something else.";
      fullText = fullText.replace(/\*/g, "");

      const botMessage = { from: "bot", text: "" };
      setMessages((prev) => [...prev, botMessage]);

      let index = 0;
      const typingSpeed = 30;

      const interval = setInterval(() => {
        if (stopTyping) {
          clearInterval(interval);
          setLoading(false);
          return;
        }

        if (index < fullText.length) {
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1].text = fullText.slice(0, index + 1);
            return updated;
          });
          index++;
        } else {
          clearInterval(interval);
          setLoading(false);
        }
      }, typingSpeed);
    } catch (error) {
      if (error.name === "AbortError") {
        console.warn("Response generation stopped by user.");
      } else {
        console.error("Chat error:", error);
        setMessages((prev) => [
          ...prev,
          {
            from: "bot",
            text: "⚠️ Error contacting Nira’s brain. Please try again later.",
          },
        ]);
      }
      setLoading(false);
    }
  };

  const handleStop = () => {
    setStopTyping(true);
    if (controllerRef.current) controllerRef.current.abort();
    setLoading(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end space-y-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-window"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={chatVariants}
            className="w-80 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{ maxHeight: 'calc(100vh - 120px)', minHeight: '500px' }}
          >
            <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <h2 className="font-semibold">Nira - Your Health Assistant</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
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
            <div className="p-4 border-t border-gray-200 bg-white">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                type="text"
                placeholder="Ask about PCOD, symptoms, or health tips..."
                className="flex-1 px-4 py-2 rounded-l-lg bg-white text-sm outline-none placeholder:text-gray-600"
              />
              {loading ? (
                <button
                  onClick={handleStop}
                  className="px-4 py-2 bg-red-500 text-white rounded-r-lg hover:bg-red-600 flex items-center gap-1"
                >
                  <Square size={16} /> Stop
                </button>
              ) : (
                <button
                  onClick={handleSend}
                  className="px-4 py-2 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-r-lg hover:from-pink-600 hover:to-blue-600"
                >
                  <SendHorizonal size={18} />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        whileHover="hover"
        whileTap="tap"
        variants={buttonVariants}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 p-4 bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white rounded-full shadow-xl z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>
    </div>
  );
};

export default NiraChatbot;