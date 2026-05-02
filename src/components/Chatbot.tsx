import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';

const profile = '/images/profile.webp';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [strikes, setStrikes] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSend = async () => {
    if (!message.trim() || isDisabled || isLoading) return;

    const userMessage = message;
    setMessage('');
    setHistory(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, history }),
      });

      const data = await response.json();

      // Always use data.text — our API always returns a friendly message
      const responseText = data.text || "I'm sorry, I couldn't generate a response. Please try again later or contact me directly at lacuarindaniela1@gmail.com. Thank you!!";

      if (data.isProfane) {
        const newStrikes = strikes + 1;
        setStrikes(newStrikes);
        if (newStrikes >= 3) {
          setIsDisabled(true);
          setHistory(prev => [...prev, {
            role: 'model',
            text: "Chat disabled due to multiple violations of our professional conduct policy."
          }]);
          setIsLoading(false);
          return;
        }
      }

      setHistory(prev => [...prev, { role: 'model', text: responseText }]);

    } catch (error: any) {
      // Only real network-level errors reach here (offline, CORS, DNS)
      console.error("Chat Error:", error);
      setHistory(prev => [...prev, {
        role: 'model',
        text: "Network error. Please check your internet connection and try again!"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-2xl z-50 group overflow-hidden border border-white/10"
      >
        <div className="absolute inset-0 bg-accent-beige opacity-0 group-hover:opacity-10 transition-opacity" />
        <div className="relative flex items-center justify-center">
          <MessageSquare size={24} strokeWidth={1.5} />
          <div className="absolute flex gap-[1.5px] mb-1">
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
              className="w-0.5 h-0.5 bg-white rounded-full"
            />
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
              className="w-0.5 h-0.5 bg-white rounded-full"
            />
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
              className="w-0.5 h-0.5 bg-white rounded-full"
            />
          </div>
        </div>
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center md:items-end md:justify-end p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm md:bg-transparent"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-sm h-[500px] rounded-2xl shadow-2xl relative z-10 flex flex-col overflow-hidden border border-gray-100"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent-beige/20 overflow-hidden border border-gray-100 flex items-center justify-center">
                    <img
                      src={profile}
                      alt="Daniela"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display text-sm font-bold text-black uppercase tracking-tight">
                      Daniela
                    </span>
                    <span className="text-[10px] text-green-500 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Online
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Messages */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-gray-50/30"
              >
                {history.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <div className="w-16 h-16 bg-accent-beige/10 rounded-full flex items-center justify-center mb-4">
                      <Bot size={32} className="text-accent-beige" />
                    </div>
                    <h4 className="font-display text-sm font-bold text-black mb-2">
                      How can I help you today?
                    </h4>
                    <p className="text-xs text-muted leading-relaxed">
                      I am Daniela Lacuarin. Ask me about my marketing background, social media expertise, or education!
                    </p>
                  </div>
                )}

                {history.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'model' && (
                      <div className="w-8 h-8 rounded-full bg-accent-beige/20 flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-100">
                        <img
                          src={profile}
                          alt="Daniela"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-black text-white rounded-br-none'
                        : 'bg-white text-black border border-gray-100 rounded-bl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 rounded-full bg-accent-beige/20 flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-100">
                      <img
                        src={profile}
                        alt="Daniela"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-gray-100 shadow-sm">
                      <div className="flex gap-1">
                        <motion.span
                          animate={{ opacity: [0.2, 1, 0.2] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                          className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                        />
                        <motion.span
                          animate={{ opacity: [0.2, 1, 0.2] }}
                          transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                          className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                        />
                        <motion.span
                          animate={{ opacity: [0.2, 1, 0.2] }}
                          transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                          className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-100 bg-white">
                <form
                  onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                  className="relative"
                >
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={isDisabled}
                    placeholder={isDisabled ? "Chat disabled..." : "Ask me anything..."}
                    className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none focus:border-black/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    type="submit"
                    disabled={isDisabled || !message.trim() || isLoading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center hover:bg-gray-900 transition-colors disabled:bg-gray-200 disabled:cursor-not-allowed"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}