"use client";

import { ChangeEvent, useEffect, useState } from "react";

interface Message {
  role: "assistant" | "user";
  content: string;
}

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "👋 Hi! I am your assistant, ask me anything about Travel AI Planner!",
    },
  ]);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setShowTooltip(true);
    }, 2000);

    const hideTimer = setTimeout(() => {
      setShowTooltip(false);
    }, 8000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const handleOpenChat = () => {
    setIsOpen(!isOpen);
    setShowTooltip(false);
  };

  const sendMessage = async () => {
    const msg: any = [...messages, { content: input, role: "user" }];
    setMessages(msg);
    setInput("");

    const response: Message[] = await getOpenAIResponse(msg);
    setMessages([...msg, { content: response, role: "assistant" }]);
  };

  const getOpenAIResponse = async (userInput: string) => {
    try {
      const response = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: userInput }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      return data.output;
    } catch (error) {
      console.error("Error fetching OpenAI response:", error);
      throw error;
    }
  };

  return (
    <div>
      <div className="fixed bottom-5 right-5 z-50 cursor-pointer">
        {showTooltip && !isOpen && (
          <div className="absolute bottom-14 right-0 mb-2 w-48 text-white text-sm rounded-lg p-2 shadow-lg chat chat-end">
            <div className="chat-bubble bg-orange-700">
              Hi there! How can I help you?
            </div>
          </div>
        )}
        <div
          className="bg-orange-700 rounded-full p-4 text-white shadow-lg"
          onClick={handleOpenChat}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="w-6 h-6"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.36 5.08L2.05 21.62a1 1 0 0 0 1.27 1.27l4.54-1.31A9.931 9.931 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm-1 13h-2v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z" />
          </svg>
        </div>
      </div>

      {/* Chat box */}
      {isOpen && (
        <div className="fixed bottom-20 right-5 z-50 w-96 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 h-100 overflow-y-auto">
            {messages.map((message: any, index: any) => (
              <div
                key={index}
                className={`chat ${message.role === "assistant" ? "chat-start" : "chat-end"}`}
              >
                {message.role === "assistant" && (
                  <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                      <img
                        src="https://i.ibb.co/DrJKGbK/DALL-E-2024-10-18-14-51-30-A-modern-and-minimalistic-app-icon-for-a-travel-AI-planner-app-The-icon-s.png"
                        alt="Assistant Avatar"
                      />
                    </div>
                  </div>
                )}
                <div
                  className={`chat-bubble ${message.role === "assistant" ? "bg-gray-100 text-black" : "bg-orange-300 text-black"}`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setInput(e.target.value)
              }
              className="input input-bordered w-full mr-2"
              placeholder="Type a message..."
            />
            <button onClick={sendMessage} className="btn bg-transparent">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="fill-grey-200"
                className="size-6"
              >
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatAssistant;
