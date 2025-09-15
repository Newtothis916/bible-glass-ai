import { useState, useRef, useEffect } from 'react';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { LiquidGlassButton } from '@/components/ui/liquid-glass-button';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/use-auth';
import { aiAPI, AIQuery, Citation } from '@/lib/ai-api';
import { AuthModal } from '@/components/auth/auth-modal';
import { 
  MessageSquare, 
  Send, 
  Loader2, 
  ThumbsUp, 
  ThumbsDown, 
  Star,
  History,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  timestamp: Date;
  queryId?: string;
  rating?: number;
}

const suggestionQuestions = [
  "What does John 3:16 mean?",
  "How can I find peace in difficult times?",
  "What does the Bible say about forgiveness?",
  "How do I grow in my faith?",
  "What is the Gospel message?",
  "How should Christians pray?",
];

export function AIPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [userHistory, setUserHistory] = useState<AIQuery[]>([]);
  const [usageStats, setUsageStats] = useState<{
    remaining?: number;
    canUse: boolean;
    resetDate?: string;
  }>({ canUse: true, remaining: 5 });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (user) {
      loadUserHistory();
      checkUsageLimit();
    }
  }, [user]);

  const loadUserHistory = async () => {
    if (!user) return;
    
    try {
      const history = await aiAPI.getUserQueries(user.id, 20);
      setUserHistory(history);
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const checkUsageLimit = async () => {
    if (!user) return;

    try {
      // In a real app, you'd check the user's subscription status
      const isPremium = false; // This would come from user's subscription
      const usage = await aiAPI.checkUsageLimit(user.id, isPremium);
      setUsageStats(usage);
    } catch (error) {
      console.error('Error checking usage limit:', error);
    }
  };

  const handleSendMessage = async (question?: string) => {
    const messageText = question || input.trim();
    if (!messageText) return;

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!usageStats.canUse) {
      toast.error('Daily AI limit reached. Upgrade to Premium for unlimited queries.');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await aiAPI.askBibleGuide(messageText);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.answer_md,
        citations: response.citations,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Update usage stats
      await checkUsageLimit();
      
      toast.success('AI response generated!');
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast.error('Failed to get AI response. Please try again.');
      
      // Remove the user message if AI failed
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRateResponse = async (messageId: string, rating: number) => {
    const message = messages.find(m => m.id === messageId);
    if (!message || !message.queryId) return;

    try {
      await aiAPI.rateResponse(message.queryId, rating);
      
      setMessages(prev => prev.map(m => 
        m.id === messageId ? { ...m, rating } : m
      ));
      
      toast.success('Thank you for your feedback!');
    } catch (error) {
      toast.error('Failed to save rating');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-hero">
      {/* Header */}
      <div className="p-4 border-b border-border-glass">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">AI Bible Guide</h1>
              <p className="text-sm text-muted-foreground">
                Ask questions about Scripture and get biblically grounded answers
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {user && (
              <div className="text-sm text-muted-foreground">
                {usageStats.canUse 
                  ? `${usageStats.remaining} questions remaining today`
                  : 'Daily limit reached'
                }
              </div>
            )}
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
            >
              <History className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Welcome to AI Bible Guide</h3>
                <p className="text-muted-foreground mb-6">
                  Ask any question about the Bible and get thoughtful, Scripture-based answers
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                  {suggestionQuestions.map((question, index) => (
                    <LiquidGlassButton
                      key={index}
                      variant="outline"
                      onClick={() => handleSendMessage(question)}
                      className="text-left p-4 h-auto"
                    >
                      <MessageSquare className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="text-sm">{question}</span>
                    </LiquidGlassButton>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="space-y-3">
                  {message.type === 'user' ? (
                    <div className="flex justify-end">
                      <LiquidGlassCard className="max-w-xs md:max-w-md p-3 bg-primary/10">
                        <p className="text-sm">{message.content}</p>
                      </LiquidGlassCard>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <LiquidGlassCard className="p-4">
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                        
                        {message.citations && message.citations.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-border">
                            <p className="text-xs font-medium text-muted-foreground mb-2">
                              Scripture References:
                            </p>
                            <div className="space-y-1">
                              {message.citations.map((citation, index) => (
                                <div key={index} className="text-xs bg-muted/50 rounded p-2">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{citation.ref}</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </div>
                                  <p className="text-muted-foreground mt-1">
                                    "{citation.excerpt}..."
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRateResponse(message.id, 5)}
                              className={message.rating === 5 ? 'text-green-600' : ''}
                            >
                              <ThumbsUp className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRateResponse(message.id, 1)}
                              className={message.rating === 1 ? 'text-red-600' : ''}
                            >
                              <ThumbsDown className="w-3 h-3" />
                            </Button>
                          </div>
                          
                          <p className="text-xs text-muted-foreground">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </LiquidGlassCard>
                    </div>
                  )}
                </div>
              ))
            )}
            
            {isLoading && (
              <div className="flex justify-center">
                <LiquidGlassCard className="p-4 max-w-xs">
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Searching Scripture...</span>
                  </div>
                </LiquidGlassCard>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border-glass">
            <div className="flex gap-3">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={user 
                  ? "Ask any question about the Bible..."
                  : "Sign in to ask AI Bible Guide questions..."
                }
                className="resize-none"
                rows={2}
                disabled={!user || isLoading}
              />
              <LiquidGlassButton 
                onClick={() => handleSendMessage()}
                disabled={!input.trim() || isLoading}
                size="sm"
              >
                <Send className="w-4 h-4" />
              </LiquidGlassButton>
            </div>
            
            {!user && (
              <p className="text-xs text-muted-foreground mt-2">
                <button 
                  onClick={() => setShowAuthModal(true)}
                  className="text-primary hover:underline"
                >
                  Sign in
                </button>
                {" "}to start asking questions
              </p>
            )}
          </div>
        </div>

        {/* History Sidebar */}
        {showHistory && user && (
          <div className="w-80 border-l border-white/30 p-4 bg-white/10 backdrop-blur-md">
            <h3 className="font-inter font-normal tracking-tighter mb-4">Recent Questions</h3>
            <div className="space-y-2">
              {userHistory.map((query) => (
                <div 
                  key={query.id} 
                  className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white/15 cursor-pointer transition-all duration-300 hover:scale-[1.045] shadow-xl"
                  onClick={() => setInput(query.question)}
                >
                  <p className="text-sm line-clamp-2">{query.question}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-muted-foreground">
                      {new Date(query.created_at).toLocaleDateString()}
                    </p>
                    {query.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span className="text-xs">{query.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
}