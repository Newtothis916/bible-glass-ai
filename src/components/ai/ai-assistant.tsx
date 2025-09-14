import { useState } from "react";
import { LiquidGlassCard, CardHeader, CardTitle, CardContent } from "@/components/ui/liquid-glass-card";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
import { Sparkles, Send, BookOpen, Clock, Star } from "lucide-react";

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  citations?: { ref: string; excerpt: string }[];
  timestamp: Date;
}

const sampleHistory = [
  {
    id: '1',
    type: 'user' as const,
    content: 'What does John 3:16 mean?',
    timestamp: new Date(Date.now() - 3600000)
  },
  {
    id: '2',
    type: 'assistant' as const,
    content: 'John 3:16 is often called the "Gospel in miniature" because it encapsulates the core message of Christianity in a single verse. Let me break it down:\n\n**"For God so loved the world"** - This emphasizes God\'s universal love for all humanity, regardless of background or status.\n\n**"that he gave his one and only Son"** - This refers to Jesus Christ, highlighting the sacrificial nature of God\'s love.\n\n**"that whoever believes in him shall not perish but have eternal life"** - This presents the promise of salvation and eternal life through faith in Jesus.\n\nThis verse demonstrates both God\'s love and justice, showing how He provided a way for humanity to be reconciled to Him.',
    citations: [
      { ref: 'John 3:16', excerpt: 'For God so loved the world that he gave his one and only Son...' },
      { ref: 'Romans 5:8', excerpt: 'But God demonstrates his own love for us in this: While we were still sinners, Christ died for us.' }
    ],
    timestamp: new Date(Date.now() - 3580000)
  }
];

export function AIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>(sampleHistory);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response (in real app, this would call your API)
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: Date.now().toString() + '_ai',
        type: 'assistant',
        content: "I understand you're asking about Scripture. Let me provide you with a thoughtful explanation based on biblical context and various Christian perspectives.\n\nThis is a demonstration response. In the full app, this would connect to a real AI service with proper biblical knowledge and citation capabilities.",
        citations: [
          { ref: 'Example Reference', excerpt: 'This would be a relevant scripture excerpt...' }
        ],
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen p-4 space-y-4">
      {/* Header */}
      <LiquidGlassCard variant="divine" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-divine opacity-10" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary-foreground">
            <Sparkles className="w-6 h-6" />
            AI Bible Study Guide
          </CardTitle>
          <p className="text-sm text-primary-foreground/80">
            Ask questions about Scripture, theology, or biblical context
          </p>
        </CardHeader>
      </LiquidGlassCard>

      {/* Usage Meter (Free Tier) */}
      <LiquidGlassCard variant="outline">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Questions remaining today</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">2 of 5</span>
              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                <div className="w-2/5 h-full bg-gradient-primary rounded-full" />
              </div>
            </div>
          </div>
          <LiquidGlassButton variant="link" size="sm" className="p-0 h-auto text-xs mt-2">
            Upgrade to Premium for unlimited questions
          </LiquidGlassButton>
        </CardContent>
      </LiquidGlassCard>

      {/* Chat Messages */}
      <div className="space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
              <LiquidGlassCard 
                variant={message.type === 'user' ? 'default' : 'elevated'}
                padding="sm"
                className={message.type === 'user' ? 'bg-gradient-primary text-primary-foreground' : ''}
              >
                <div className="space-y-3">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  
                  {message.citations && message.citations.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-border-glass">
                      <h4 className="text-xs font-medium flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        Scripture References
                      </h4>
                      {message.citations.map((citation, index) => (
                        <div key={index} className="text-xs bg-white/10 backdrop-blur-md border border-white/30 p-2 rounded-2xl shadow-xl transition-all duration-300 hover:scale-105">
                          <p className="font-medium">{citation.ref}</p>
                          <p className="text-muted-foreground mt-1">"{citation.excerpt}"</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-xs text-muted-foreground">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </LiquidGlassCard>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <LiquidGlassCard variant="elevated" padding="sm" className="max-w-[85%]">
              <div className="flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
                <span className="text-sm text-muted-foreground">AI is thinking...</span>
              </div>
            </LiquidGlassCard>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="sticky bottom-20 pt-4">
        <LiquidGlassCard variant="glass" padding="sm">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about Scripture, theology, or biblical context..."
              className="flex-1 bg-transparent border-none outline-none placeholder-muted-foreground text-sm"
              disabled={isLoading}
            />
            <LiquidGlassButton
              variant="default"
              size="sm"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
            >
              <Send className="w-4 h-4" />
            </LiquidGlassButton>
          </div>
        </LiquidGlassCard>
      </div>

      {/* Suggested Questions */}
      <LiquidGlassCard variant="outline">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Star className="w-4 h-4" />
            Popular Questions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            "What is the meaning of John 3:16?",
            "How do different denominations view baptism?",
            "What is the historical context of the Sermon on the Mount?",
            "Explain the parable of the Good Samaritan"
          ].map((question, index) => (
            <LiquidGlassButton
              key={index}
              variant="ghost"
              size="sm"
              className="w-full text-left justify-start text-xs h-auto p-2"
              onClick={() => setInput(question)}
            >
              {question}
            </LiquidGlassButton>
          ))}
        </CardContent>
      </LiquidGlassCard>
    </div>
  );
}