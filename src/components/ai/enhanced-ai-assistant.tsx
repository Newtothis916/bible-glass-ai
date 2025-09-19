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
    <div className="flex flex-col h-[calc(100vh-5rem)] max-w-none mx-0 bg-background">
      {/* Clean Claude-style Header */}
      <div className="flex-shrink-0 px-8 py-6 bg-background">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-medium text-foreground mb-1">Bible Assistant</h1>
          <p className="text-muted-foreground text-sm">
            Ask me about Scripture, theology, or spiritual guidance
          </p>
        </div>
      </div>

      {/* Claude-style Welcome Screen */}
      {messages.length === 0 && (
        <div className="flex-1 flex items-center justify-center px-8">
          <div className="max-w-2xl w-full">
            <div className="text-center mb-12">
              <h2 className="text-xl font-medium mb-3 text-foreground">How can I help you today?</h2>
              <p className="text-muted-foreground leading-relaxed">
                I'm here to help you explore Scripture, understand theology, find spiritual guidance, and answer biblical questions.
              </p>
            </div>
            
            <div className="grid gap-3 max-w-xl mx-auto">
              {quickPrompts.slice(0, 6).map((prompt) => (
                <button
                  key={prompt.id}
                  onClick={() => handleQuickPrompt(prompt.prompt)}
                  className="p-4 text-left bg-background hover:bg-muted/30 rounded-lg transition-colors border border-border/40 hover:border-border"
                >
                  <div className="font-medium text-foreground mb-1 text-sm">{prompt.title}</div>
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    {prompt.prompt}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Claude-style Conversation */}
      {messages.length > 0 && (
        <div className="flex-1 overflow-y-auto px-8">
          <div className="max-w-3xl mx-auto space-y-8 py-4">
            {messages.map((message) => (
              <div key={message.id} className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                    {message.role === 'user' ? (
                      <User className="w-3.5 h-3.5 text-muted-foreground" />
                    ) : (
                      <Bot className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {message.role === 'user' ? 'You' : 'Assistant'}
                  </span>
                </div>
                <div className="ml-9">
                  <div className="text-foreground leading-7 whitespace-pre-wrap text-[15px]">
                    {message.content}
                  </div>
                  <div className="text-xs text-muted-foreground mt-3">
                    {format(new Date(message.timestamp), 'MMM d, h:mm a')}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <span className="text-sm font-medium text-foreground">Assistant</span>
                </div>
                <div className="ml-9">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      {/* Claude-style Input Area */}
      <div className="flex-shrink-0 px-8 pb-8 pt-4 bg-background">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSendMessage} className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              placeholder="Ask me anything about Scripture, theology, or spiritual guidance..."
              className="w-full min-h-[52px] max-h-32 resize-none bg-background border border-border rounded-lg px-4 py-3 pr-12 focus:ring-1 focus:ring-primary/30 focus:outline-none text-sm placeholder:text-muted-foreground transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 bottom-2 p-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="mt-3 text-xs text-muted-foreground text-center">
            AI may make mistakes. Always verify with Scripture.
          </div>
        </div>
      </div>
    </div>
  );
}