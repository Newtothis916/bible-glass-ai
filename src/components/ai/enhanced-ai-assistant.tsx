import { useState, useRef, useEffect } from "react";
import { LiquidGlassCard, CardHeader, CardTitle, CardContent } from "@/components/ui/liquid-glass-card";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, Sparkles, BookOpen, MessageSquare, Loader2 } from "lucide-react";
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
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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
      title: 'Apply to life',
      prompt: 'How can I apply this biblical principle to my daily life?',
      category: 'application'
    },
    {
      id: '5',
      title: 'Cross references',
      prompt: 'What other Bible verses relate to this topic?',
      category: 'study'
    },
    {
      id: '6',
      title: 'Theological meaning',
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

  const handleSendMessage = async (messageContent?: string) => {
    const content = messageContent || inputMessage.trim();
    if (!content) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
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
    handleSendMessage(prompt);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'study': return 'bg-primary';
      case 'prayer': return 'bg-secondary';
      case 'theology': return 'bg-accent';
      case 'application': return 'bg-muted';
      default: return 'bg-muted';
    }
  };

  const filteredPrompts = selectedCategory === 'all' 
    ? quickPrompts 
    : quickPrompts.filter(p => p.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Bot className="w-6 h-6" />
          AI Bible Assistant
        </h1>
        <p className="text-muted-foreground">
          Ask questions about Scripture, theology, and Christian living
        </p>
      </div>

      {/* Quick Prompts */}
      <LiquidGlassCard>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Quick Prompts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Badge 
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSelectedCategory('all')}
            >
              All
            </Badge>
            {['study', 'prayer', 'theology', 'application'].map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                className="cursor-pointer capitalize"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {filteredPrompts.map((prompt) => (
              <LiquidGlassButton
                key={prompt.id}
                variant="outline"
                size="sm"
                className="justify-start h-auto p-3"
                onClick={() => handleQuickPrompt(prompt.prompt)}
              >
                <div className="text-left">
                  <div className="font-medium">{prompt.title}</div>
                  <div className="text-xs text-muted-foreground capitalize">
                    {prompt.category}
                  </div>
                </div>
              </LiquidGlassButton>
            ))}
          </div>
        </CardContent>
      </LiquidGlassCard>

      {/* Chat Messages */}
      <LiquidGlassCard className="min-h-[400px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Conversation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-6 max-h-96 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Ask me anything about the Bible, theology, or Christian faith!</p>
                <p className="text-sm">Try one of the quick prompts above to get started.</p>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}>
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    {message.citations && message.citations.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-border/20">
                        <div className="text-xs text-muted-foreground mb-1">References:</div>
                        <div className="flex gap-1 flex-wrap">
                          {message.citations.map((citation, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {citation}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Ask about Scripture, theology, or spiritual questions..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
              disabled={isLoading}
              className="mobile-input"
            />
            <LiquidGlassButton
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isLoading}
              className="mobile-touch-target"
            >
              <Send className="w-4 h-4" />
            </LiquidGlassButton>
          </div>
        </CardContent>
      </LiquidGlassCard>
    </div>
  );
}