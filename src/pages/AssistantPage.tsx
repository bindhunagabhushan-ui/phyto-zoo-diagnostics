import { useState, useRef, useEffect } from "react";
import { Send, Trash2, Bot, User, Loader2, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const STORAGE_KEY = "phytobot-assistant-history";

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { isListening, transcript, startListening, stopListening, isSupported: sttSupported } = useSpeechRecognition();
  const { isSpeaking, speak, stop: stopSpeaking, isSupported: ttsSupported } = useTextToSpeech();

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

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (transcript && !isListening) {
      setInput(transcript);
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
    <div className="h-[calc(100vh-180px)] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">PhytoBot Assistant</h1>
          <p className="text-muted-foreground text-sm">Ask questions about plants and animals</p>
        </div>
        <div className="flex items-center gap-2">
          {ttsSupported && (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleAutoSpeak}
              className={cn(autoSpeak && "bg-primary/10")}
            >
              {autoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={clearChat}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Hi! I'm PhytoBot</h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Your AI assistant for plant and animal health. Ask me about diseases, treatments, prevention methods, and more.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3 max-w-md mx-auto">
                <button
                  onClick={() => sendMessageWithContent("What are common tomato plant diseases?")}
                  className="p-3 text-left rounded-lg bg-muted hover:bg-muted/80 text-sm transition-colors"
                >
                  🌱 Common tomato diseases
                </button>
                <button
                  onClick={() => sendMessageWithContent("How to prevent fungal infections in plants?")}
                  className="p-3 text-left rounded-lg bg-muted hover:bg-muted/80 text-sm transition-colors"
                >
                  🍄 Prevent fungal infections
                </button>
                <button
                  onClick={() => sendMessageWithContent("What are signs of skin infection in dogs?")}
                  className="p-3 text-left rounded-lg bg-muted hover:bg-muted/80 text-sm transition-colors"
                >
                  🐕 Dog skin infections
                </button>
                <button
                  onClick={() => sendMessageWithContent("Organic pest control methods")}
                  className="p-3 text-left rounded-lg bg-muted hover:bg-muted/80 text-sm transition-colors"
                >
                  🌿 Organic pest control
                </button>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}
              <div className="flex flex-col gap-1 max-w-[75%]">
                <div
                  className={cn(
                    "px-4 py-3 rounded-2xl text-sm",
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
                <div className="w-8 h-8 rounded-full bg-accent/10 flex-shrink-0 flex items-center justify-center">
                  <User className="w-4 h-4 text-accent" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
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
        </CardContent>

        <div className="p-4 border-t">
          {isListening && (
            <div className="mb-3 px-4 py-2 bg-primary/10 rounded-lg text-sm text-primary flex items-center gap-2">
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
                className={cn(isListening && "animate-pulse")}
                disabled={isLoading}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
            )}
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isListening ? "Listening..." : "Type your message..."}
              disabled={isLoading || isListening}
              className="flex-1 px-4 py-2 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
            />
            <Button
              size="icon"
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
