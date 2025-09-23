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
    <div className="flex flex-col h-screen w-full bg-background">
      {/* Claude LLM-style Chat Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full min-h-[60vh]">
              <div className="text-center">
                <h2 className="text-2xl font-medium text-foreground mb-2">Bible Assistant</h2>
                <p className="text-muted-foreground text-base mb-4">
                  Ask me anything about Scripture, theology, or spiritual guidance
                </p>
                <p className="text-xs text-muted-foreground">
                  AI responses may contain errors. Always verify with Scripture.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {messages.map((message) => (
                <div key={message.id} className="flex gap-4 max-w-none">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    {message.role === 'user' ? (
                      <User className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Bot className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 max-w-none">
                    <div className="text-foreground leading-relaxed whitespace-pre-wrap text-base">
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-4 max-w-none">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Bot className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0 max-w-none">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Claude LLM-style Input Area */}
      <div className="flex-shrink-0 bg-background">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <form onSubmit={handleSendMessage} className="relative">
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
                placeholder="Message Bible Assistant..."
                className="w-full min-h-[52px] max-h-32 resize-none bg-gray-100 text-white placeholder-gray-500 rounded-xl pl-4 pr-12 py-3 focus:ring-2 focus:ring-primary/20 focus:outline-none focus:bg-gray-200 transition-all text-base"
                disabled={isLoading}
                rows={1}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}