import React, { useState, useRef, useEffect } from "react";
import axios from "../axios";
import { FiMessageSquare, FiX, FiSend, FiMinimize2, FiMaximize2, FiRefreshCw, FiChevronRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const QUICK_PROMPTS = [
  { icon: "🛍️", label: "Browse products" },
  { icon: "💻", label: "Show me laptops" },
  { icon: "🎧", label: "Available headphones" },
  { icon: "📦", label: "Track my order" },
  { icon: "📱", label: "Recommend a phone" },
  { icon: "📊", label: "What's in stock?" },
];

const CHAT_CONVERSATION_KEY = "shopgrid_chat_conversation_id";

const getOrCreateConversationId = () => {
  const existingId = window.localStorage.getItem(CHAT_CONVERSATION_KEY);
  if (existingId) return existingId;
  const newId =
    window.crypto?.randomUUID?.() ??
    `chat_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  window.localStorage.setItem(CHAT_CONVERSATION_KEY, newId);
  return newId;
};

const resetConversationId = () => {
  const newId =
    window.crypto?.randomUUID?.() ??
    `chat_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  window.localStorage.setItem(CHAT_CONVERSATION_KEY, newId);
  return newId;
};

/** Renders text with line breaks preserved */
const FormattedText = ({ text }) => {
  if (!text) return null;
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, i) => (
        <React.Fragment key={i}>
          {line}
          {i < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </>
  );
};

/* ──────────── Message Bubbles ──────────── */

const BotAvatar = () => (
  <div
    style={{
      width: "30px",
      height: "30px",
      borderRadius: "10px",
      background: "linear-gradient(135deg, rgba(231,111,81,0.12) 0%, rgba(244,162,97,0.15) 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "0.65rem",
      color: "#E76F51",
      fontWeight: "700",
      flexShrink: 0,
      letterSpacing: "0.02em",
    }}
  >
    AI
  </div>
);

const BotMessage = ({ message, isFirst }) => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.25 }}
    style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "14px" }}
  >
    <BotAvatar />
    <div
      style={{
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        fontSize: "0.84rem",
        lineHeight: "1.65",
        color: "#334155",
        maxWidth: "82%",
        borderRadius: "4px 14px 14px 14px",
        padding: "10px 14px",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}
    >
      <FormattedText text={message} />
    </div>
  </motion.div>
);

const UserMessage = ({ message }) => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2 }}
    style={{ display: "flex", justifyContent: "flex-end", marginBottom: "14px" }}
  >
    <div
      style={{
        background: "linear-gradient(135deg, #E76F51 0%, #F4A261 100%)",
        color: "#fff",
        fontSize: "0.84rem",
        lineHeight: "1.55",
        maxWidth: "82%",
        borderRadius: "14px 4px 14px 14px",
        padding: "10px 14px",
        wordBreak: "break-word",
      }}
    >
      {message}
    </div>
  </motion.div>
);

const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "14px" }}
  >
    <BotAvatar />
    <div
      style={{
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: "4px 14px 14px 14px",
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        gap: "4px",
      }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "#94a3b8",
            display: "inline-block",
            animation: `sgBounce 1.2s ease-in-out ${i * 0.15}s infinite`,
          }}
        />
      ))}
    </div>
  </motion.div>
);

/* ──────────── Welcome Screen ──────────── */

const WelcomeScreen = ({ onSend }) => (
  <div style={{ padding: "20px 16px 8px", textAlign: "center" }}>
    {/* Sparkle icon */}
    <div
      style={{
        width: "52px",
        height: "52px",
        borderRadius: "16px",
        background: "linear-gradient(135deg, rgba(231,111,81,0.08) 0%, rgba(244,162,97,0.12) 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 14px",
        fontSize: "1.4rem",
      }}
    >
      ✨
    </div>
    <h3
      style={{
        fontSize: "1.05rem",
        fontWeight: "700",
        color: "var(--text-primary)",
        margin: "0 0 4px",
        fontFamily: "'Outfit', sans-serif",
        letterSpacing: "-0.01em",
      }}
    >
      Hi! How can I help?
    </h3>
    <p
      style={{
        fontSize: "0.8rem",
        color: "#94a3b8",
        margin: "0 0 18px",
        lineHeight: "1.4",
      }}
    >
      Ask me about products, orders, availability & more
    </p>

    {/* Quick Prompt Cards */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "8px",
        textAlign: "left",
      }}
    >
      {QUICK_PROMPTS.map((p) => (
        <button
          key={p.label}
          onClick={() => onSend(p.label)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 12px",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            background: "#ffffff",
            color: "#475569",
            cursor: "pointer",
            fontSize: "0.78rem",
            fontWeight: "500",
            fontFamily: "inherit",
            textAlign: "left",
            lineHeight: "1.3",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(231,111,81,0.05)";
            e.currentTarget.style.borderColor = "rgba(231,111,81,0.3)";
            e.currentTarget.style.color = "#E76F51";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#ffffff";
            e.currentTarget.style.borderColor = "var(--border-color)";
            e.currentTarget.style.color = "var(--text-secondary)";
          }}
        >
          <span style={{ fontSize: "1rem", flexShrink: 0 }}>{p.icon}</span>
          <span style={{ flex: 1 }}>{p.label}</span>
          <FiChevronRight size={12} style={{ flexShrink: 0, opacity: 0.4 }} />
        </button>
      ))}
    </div>
  </div>
);

/* ──────────── Header Action Button ──────────── */

const HeaderBtn = ({ onClick, title, children }) => (
  <button
    onClick={onClick}
    title={title}
    style={{
      background: "rgba(255,255,255,0.18)",
      border: "none",
      color: "#fff",
      borderRadius: "8px",
      width: "30px",
      height: "30px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      backdropFilter: "blur(4px)",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.3)")}
    onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.18)")}
  >
    {children}
  </button>
);

/* ──────────── Main ChatBot ──────────── */

const WELCOME_MESSAGE = {
  role: "bot",
  text: "Hi! I'm your ShopGrid AI assistant 🛍️\nAsk me anything about our products, orders, availability, or recommendations!",
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [conversationId, setConversationId] = useState(() => getOrCreateConversationId());
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const isWelcomeState = messages.length <= 1;

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleNewConversation = () => {
    const newId = resetConversationId();
    setConversationId(newId);
    setMessages([WELCOME_MESSAGE]);
    setInput("");
    setIsLoading(false);
  };

  const sendMessage = async (text) => {
    const query = (text || input).trim();
    if (!query || isLoading) return;

    setMessages((prev) => [...prev, { role: "user", text: query }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await axios.post(`/chat/ask`, {
        message: query,
        conversationId,
      });

      const reply = response.data?.reply || response.data;
      const returnedConvId = response.data?.conversationId;

      if (returnedConvId && returnedConvId !== conversationId) {
        setConversationId(returnedConvId);
        window.localStorage.setItem(CHAT_CONVERSATION_KEY, returnedConvId);
      }

      setMessages((prev) => [...prev, { role: "bot", text: reply }]);
    } catch (err) {
      const errorMessage =
        err.response?.data?.reply ||
        "Sorry, I couldn't reach the server. Please try again later.";
      setMessages((prev) => [...prev, { role: "bot", text: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const chatWidth = isExpanded ? "440px" : "380px";
  const chatHeight = isExpanded ? "640px" : "520px";

  return (
    <>
      <style>{`
        @keyframes sgBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
        @keyframes sgPulseRing {
          0% { box-shadow: 0 0 0 0 rgba(231, 111, 81, 0.35); }
          70% { box-shadow: 0 0 0 12px rgba(231, 111, 81, 0); }
          100% { box-shadow: 0 0 0 0 rgba(231, 111, 81, 0); }
        }
      `}</style>

      {/* ── Floating Trigger ── */}
      <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 1200 }}>
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setIsOpen(true)}
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, #E76F51 0%, #F4A261 100%)",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                boxShadow: "0 6px 20px rgba(231, 111, 81, 0.35), 0 2px 8px rgba(0,0,0,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: "sgPulseRing 2.5s ease-out infinite",
                position: "relative",
              }}
              title="Chat with AI Assistant"
            >
              <FiMessageSquare size={22} />
              {hasUnread && (
                <span
                  style={{
                    position: "absolute",
                    top: "-2px",
                    right: "-2px",
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: "#ef4444",
                    border: "2px solid white",
                  }}
                />
              )}
            </motion.button>
          )}
        </AnimatePresence>

        {/* ── Chat Window ── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ type: "spring", damping: 28, stiffness: 350 }}
              style={{
                position: "fixed",
                bottom: "24px",
                right: "24px",
                width: chatWidth,
                height: chatHeight,
                borderRadius: "20px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                boxShadow:
                  "0 25px 50px -12px rgba(0,0,0,0.1), 0 12px 24px -8px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)",
                background: "#ffffff",
                zIndex: 1200,
              }}
            >
              {/* ── Header ── */}
              <div
                style={{
                  background: "linear-gradient(135deg, #E76F51 0%, #F4A261 50%, #E9C46A 100%)",
                  padding: "16px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  flexShrink: 0,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Decorative circle */}
                <div
                  style={{
                    position: "absolute",
                    top: "-20px",
                    right: "-20px",
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.08)",
                    pointerEvents: "none",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "-30px",
                    left: "40px",
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.05)",
                    pointerEvents: "none",
                  }}
                />

                {/* Avatar */}
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.2)",
                    backdropFilter: "blur(8px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.1rem",
                    border: "1px solid rgba(255,255,255,0.25)",
                    flexShrink: 0,
                  }}
                >
                  🤖
                </div>

                {/* Title */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      color: "#fff",
                      fontWeight: "700",
                      fontSize: "0.92rem",
                      fontFamily: "'Outfit', sans-serif",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    ShopGrid AI
                  </div>
                  <div
                    style={{
                      color: "rgba(255,255,255,0.7)",
                      fontSize: "0.72rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "#4ade80",
                        display: "inline-block",
                      }}
                    />
                    Online • Powered by Gemini
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "4px" }}>
                  <HeaderBtn onClick={handleNewConversation} title="New conversation">
                    <FiRefreshCw size={13} />
                  </HeaderBtn>
                  <HeaderBtn onClick={() => setIsExpanded(!isExpanded)} title={isExpanded ? "Minimize" : "Expand"}>
                    {isExpanded ? <FiMinimize2 size={13} /> : <FiMaximize2 size={13} />}
                  </HeaderBtn>
                  <HeaderBtn onClick={() => setIsOpen(false)} title="Close">
                    <FiX size={14} />
                  </HeaderBtn>
                </div>
              </div>

              {/* ── Messages / Welcome ── */}
              <div
                className="chatbot-messages"
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: isWelcomeState ? "0" : "16px",
                  background: isWelcomeState ? "#ffffff" : "#fafbfc",
                }}
              >
                {isWelcomeState ? (
                  <WelcomeScreen onSend={sendMessage} />
                ) : (
                  <>
                    {messages.slice(1).map((msg, i) =>
                      msg.role === "bot" ? (
                        <BotMessage key={i} message={msg.text} isFirst={i === 0} />
                      ) : (
                        <UserMessage key={i} message={msg.text} />
                      )
                    )}
                    {isLoading && <TypingIndicator />}
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* ── Input ── */}
              <div
                style={{
                  padding: "12px 14px",
                  borderTop: "1px solid #f1f5f9",
                  display: "flex",
                  gap: "8px",
                  flexShrink: 0,
                  background: "#ffffff",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "0 12px",
                    background: "#f8fafc",
                    gap: "8px",
                  }}
                >
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything..."
                    rows={1}
                    disabled={isLoading}
                    style={{
                      flex: 1,
                      resize: "none",
                      border: "none",
                      padding: "10px 0",
                      fontSize: "0.84rem",
                      background: "transparent",
                      color: "#1e293b",
                      outline: "none",
                      fontFamily: "inherit",
                      lineHeight: "1.4",
                    }}
                  />
                </div>
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "12px",
                    background:
                      !input.trim() || isLoading
                        ? "var(--border-color)"
                        : "linear-gradient(135deg, #E76F51 0%, #F4A261 100%)",
                    border: "none",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: !input.trim() || isLoading ? "not-allowed" : "pointer",
                    flexShrink: 0,
                    alignSelf: "flex-end",
                  }}
                  onMouseEnter={(e) => {
                    if (input.trim() && !isLoading) e.currentTarget.style.background = "#d15d41";
                  }}
                  onMouseLeave={(e) => {
                    if (input.trim() && !isLoading) e.currentTarget.style.background = "linear-gradient(135deg, #E76F51 0%, #F4A261 100%)";
                  }}
                >
                  <FiSend size={15} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default ChatBot;
