import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { Bot, Send, User } from "lucide-react";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  citations?: string[];
}

interface QuickPrompt {
  id: string;
  title: string;
  prompt: string;
  category: 'study' | 'prayer' | 'theology' | 'application';
}

export function EnhancedAIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts: QuickPrompt[] = [
    {
      id: '1',
      title: 'Explain this passage',
      prompt: 'Can you explain the meaning and context of this Bible passage?',
      category: 'study'
    },
    {
      id: '2',
      title: 'Historical context',
      prompt: 'What is the historical context of this scripture?',
      category: 'study'
    },
    {
      id: '3',
      title: 'Prayer guidance',
      prompt: 'How can I pray about this topic or situation?',
      category: 'prayer'
    },
    {
      id: '4',
      title: 'Apply to daily life',
      prompt: 'How can I apply this biblical principle to my daily life?',
      category: 'application'
    },
    {
      id: '5',
      title: 'Related verses',
      prompt: 'What other Bible verses relate to this topic?',
      category: 'study'
    },
    {
      id: '6',
      title: 'God\'s character',
      prompt: 'What does this passage teach us about God\'s character?',
      category: 'theology'
    }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = input.trim();
    if (!content) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-bible-guide', {
        body: {
          question: content,
          context: messages.slice(-5).map(m => ({ role: m.role, content: m.content }))
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer || "I apologize, but I'm having trouble responding right now. Please try again.",
        timestamp: new Date(),
        citations: data.citations || []
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error calling AI assistant:', error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive"
      });

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
    const syntheticEvent = {
      preventDefault: () => {},
    } as React.FormEvent;
    
    setTimeout(() => handleSendMessage(syntheticEvent), 100);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] bg-background text-foreground">
      {/* Header */}
      <div className="flex items-center justify-center py-4 px-6 border-b border-border bg-card/50">
        <h1 className="text-lg font-normal">
          <span className="text-foreground">Bible AI Assistant</span>
        </h1>
      </div>

      {/* Welcome Screen */}
      {messages.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center space-y-8">
              {/* Loading spinner */}
              <div className="relative">
                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              </div>
              <h2 className="text-2xl font-normal text-muted-foreground text-center max-w-lg">
                How can I help you with Scripture today?
              </h2>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-8">
              {/* Icon */}
              <div className="w-12 h-12 text-primary">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                  <path d="M12 2L14.09 8.26L20 9L14.09 15.74L12 22L9.91 15.74L4 9L9.91 8.26L12 2Z"/>
                </svg>
              </div>
              <h2 className="text-2xl font-normal text-muted-foreground text-center max-w-lg">
                How can I help you with Scripture today?
              </h2>
            </div>
          )}
        </div>
      )}

      {/* Conversation */}
      {messages.length > 0 && (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 py-8 space-y-12">
            {messages.map((message) => (
              <div key={message.id} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                    {message.role === 'user' ? (
                      <User className="w-3.5 h-3.5 text-muted-foreground" />
                    ) : (
                      <Bot className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {message.role === 'user' ? 'You' : 'Assistant'}
                  </span>
                </div>
                <div className="ml-9">
                  <div className="text-foreground leading-7 whitespace-pre-wrap">
                    {message.content}
                  </div>
                  <div className="text-xs text-muted-foreground mt-4">
                    {format(new Date(message.timestamp), 'MMM d, h:mm a')}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Assistant</span>
                </div>
                <div className="ml-9">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-6 border-t border-border bg-card/50">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSendMessage}>
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
                placeholder="Ask about Scripture..."
                className="w-full min-h-[52px] max-h-32 resize-none bg-input border border-border rounded-lg px-4 py-3 pr-16 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50"
                disabled={isLoading}
              />
              <div className="absolute right-2 bottom-2 flex items-center gap-2">
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="p-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}