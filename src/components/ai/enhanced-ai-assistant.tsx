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
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-3xl mx-auto bg-background">
      {/* Claude-style Quick Prompts - Only show when no messages */}
      {messages.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
          <div className="max-w-2xl w-full space-y-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-medium mb-2 text-foreground">How can I help you today?</h2>
              <p className="text-muted-foreground text-base">
                Ask me about Scripture, theology, spiritual guidance, or biblical questions
              </p>
            </div>
            
            <div className="grid gap-2">
              {quickPrompts.slice(0, 6).map((prompt) => (
                <button
                  key={prompt.title}
                  className="w-full p-4 text-left rounded-lg border border-border/50 hover:bg-muted/30 transition-colors group"
                  onClick={() => handleQuickPrompt(prompt.prompt)}
                >
                  <div className="font-medium text-foreground mb-1 group-hover:text-primary transition-colors">
                    {prompt.title}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {prompt.prompt}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Claude-style Chat Messages */}
      {messages.length > 0 && (
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
          {messages.map((message) => (
            <div key={message.id} className="flex gap-4 max-w-none">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                {message.role === 'user' ? (
                  <User className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Bot className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="prose prose-sm max-w-none">
                  <div className="text-foreground leading-relaxed whitespace-pre-wrap text-base">
                    {message.content}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <Bot className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
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

      {/* Claude-style Input Area */}
      <div className="flex-shrink-0 px-4 py-4 bg-background">
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
              className="w-full min-h-[52px] max-h-32 resize-none bg-background border border-border rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-primary/20 focus:outline-none focus:border-primary/50 transition-all text-base"
              disabled={isLoading}
              rows={1}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 bottom-2 w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
        <div className="mt-2 text-xs text-muted-foreground text-center">
          AI responses may contain errors. Always verify with Scripture.
        </div>
      </div>
    </div>
  );
}