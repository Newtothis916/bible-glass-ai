// Lovable AI Integration for Bible Glass AI
// This file handles the connection to Lovable AI's backend services

export interface LovableAIRequest {
  question: string;
  context?: Array<{ role: string; content: string }>;
  userId?: string;
}

export interface LovableAIResponse {
  answer: string;
  citations?: string[];
  tokens_used?: number;
  response_time_ms?: number;
}

class LovableAIService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    // Lovable AI configuration - these would be set in your Lovable project
    this.baseUrl = import.meta.env.VITE_LOVABLE_AI_URL || 'https://api.lovable.dev';
    this.apiKey = import.meta.env.VITE_LOVABLE_AI_KEY || '';
  }

  async askBibleGuide(request: LovableAIRequest): Promise<LovableAIResponse> {
    // Call Supabase edge function which uses Lovable AI Gateway internally
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase configuration not found');
      }

      const supabase = createClient(supabaseUrl, supabaseKey);
      
      const { data, error } = await supabase.functions.invoke('ai-bible-guide', {
        body: {
          question: request.question,
          context: request.context || []
        }
      });

      if (error) throw error;

      return {
        answer: data.answer || 'I apologize, but I could not generate a response.',
        citations: data.citations || [],
        tokens_used: data.tokens_used || 0,
        response_time_ms: data.response_time_ms || 0,
      };
    } catch (error) {
      console.error('Error calling AI Bible Guide:', error);
      
      // Return error response
      return {
        answer: "I apologize, but I'm experiencing technical difficulties connecting to the AI service. Please try again in a moment.",
        citations: [],
        tokens_used: 0,
        response_time_ms: 0,
      };
    }
  }

  // Check if Lovable AI service is available
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  // Get usage statistics for the current user
  async getUsageStats(userId: string): Promise<{
    totalQueries: number;
    queriesThisMonth: number;
    remainingQueries: number;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/usage/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch usage stats');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching usage stats:', error);
      return {
        totalQueries: 0,
        queriesThisMonth: 0,
        remainingQueries: 0,
      };
    }
  }
}

export const lovableAI = new LovableAIService();
