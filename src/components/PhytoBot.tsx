import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Trash2, Bot, User, Loader2, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const STORAGE_KEY = "phytobot-history";

export function PhytoBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Voice hooks
  const { isListening, transcript, startListening, stopListening, isSupported: sttSupported } = useSpeechRecognition();
  const { isSpeaking, speak, stop: stopSpeaking, isSupported: ttsSupported } = useTextToSpeech();

  // Load chat history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMessages(parsed.map((m: Message) => ({ ...m, timestamp: new Date(m.timestamp) })));
      } catch (e) {
        console.error("Failed to load chat history:", e);
      }
    }
  }, []);

  // Save chat history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Handle speech transcript
  useEffect(() => {
    if (transcript && !isListening) {
      setInput(transcript);
      // Auto-send after speech recognition completes
      setTimeout(() => {
        if (transcript.trim()) {
          sendMessageWithContent(transcript.trim());
        }
      }, 300);
    }
  }, [transcript, isListening]);

  const sendMessageWithContent = async (content: string) => {
    if (!content || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const chatHistory = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const { data, error } = await supabase.functions.invoke("phytobot-chat", {
        body: {
          messages: [...chatHistory, { role: "user", content }],
        },
      });

      if (error) throw error;

      const responseText = data.response || "I apologize, I couldn't process that request.";
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Auto-speak response if enabled
      if (autoSpeak && ttsSupported) {
        speak(responseText);
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    await sendMessageWithContent(input.trim());
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
    stopSpeaking();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleMicrophone = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const toggleAutoSpeak = () => {
    if (isSpeaking) {
      stopSpeaking();
    }
    setAutoSpeak(!autoSpeak);
  };

  const speakMessage = (text: string) => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(text);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-elevated transition-all duration-300 hover:scale-110",
          isOpen
            ? "bg-destructive text-destructive-foreground"
            : "bg-gradient-to-br from-primary to-accent text-primary-foreground"
        )}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      <div
        className={cn(
          "fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] transition-all duration-300 origin-bottom-right",
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
        )}
      >
        <div className="glass-card rounded-2xl shadow-elevated overflow-hidden flex flex-col h-[520px] max-h-[75vh]">
          {/* Header */}
          <div className="glass-header px-4 py-3 border-b border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">PhytoBot</h3>
                <p className="text-xs text-muted-foreground">Voice-enabled assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {ttsSupported && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleAutoSpeak}
                  className={cn(
                    "h-8 w-8",
                    autoSpeak ? "text-primary" : "text-muted-foreground"
                  )}
                  title={autoSpeak ? "Auto-speak enabled" : "Auto-speak disabled"}
                >
                  {autoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={clearChat}
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-6">
                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Bot className="w-7 h-7 text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">
                  Hi! I'm PhytoBot 🌿
                </p>
                <p className="text-xs text-muted-foreground mb-3">
                  Your voice-enabled health assistant
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>🌱 Plant diseases & treatments</li>
                  <li>🐾 Animal health concerns</li>
                  <li>🌿 Organic farming tips</li>
                  <li>💊 Prevention methods</li>
                </ul>
                {sttSupported && (
                  <p className="text-xs text-primary mt-4 font-medium">
                    🎤 Tap the mic to speak!
                  </p>
                )}
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-2",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex-shrink-0 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}
                <div className="flex flex-col gap-1 max-w-[80%]">
                  <div
                    className={cn(
                      "px-3 py-2 rounded-2xl text-sm",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted text-foreground rounded-bl-md"
                    )}
                  >
                    {message.content}
                  </div>
                  {message.role === "assistant" && ttsSupported && (
                    <button
                      onClick={() => speakMessage(message.content)}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors self-start ml-1"
                    >
                      <Volume2 className="w-3 h-3" />
                      {isSpeaking ? "Stop" : "Listen"}
                    </button>
                  )}
                </div>
                {message.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-accent/20 flex-shrink-0 flex items-center justify-center">
                    <User className="w-4 h-4 text-accent" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2 items-start">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex-shrink-0 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border/50">
            {isListening && (
              <div className="mb-2 px-3 py-2 bg-primary/10 rounded-lg text-sm text-primary flex items-center gap-2 animate-pulse">
                <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                Listening... speak now
              </div>
            )}
            <div className="flex gap-2">
              {sttSupported && (
                <Button
                  variant={isListening ? "default" : "outline"}
                  size="icon"
                  onClick={toggleMicrophone}
                  className={cn(
                    "rounded-full h-10 w-10 flex-shrink-0",
                    isListening && "bg-primary animate-pulse"
                  )}
                  disabled={isLoading}
                >
                  {isListening ? (
                    <MicOff className="w-4 h-4" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </Button>
              )}
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isListening ? "Listening..." : "Type or speak..."}
                disabled={isLoading || isListening}
                className="flex-1 px-4 py-2 text-sm bg-muted/50 border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
              />
              <Button
                size="icon"
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="rounded-full h-10 w-10 flex-shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
