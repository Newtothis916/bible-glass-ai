import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question, contextRefs = [], userId } = await req.json();

    if (!question || typeof question !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Question is required and must be a string' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('AI Bible Guide request:', { question, contextRefs, userId });

    // Build context from verse references
    let contextText = '';
    if (contextRefs.length > 0) {
      try {
        // Simple verse lookup - in production you'd want more sophisticated retrieval
        const { data: verses } = await supabase
          .from('verses')
          .select(`
            text,
            number,
            chapter:chapters!inner(
              number,
              book:books!inner(
                name,
                code
              )
            )
          `)
          .in('id', contextRefs)
          .limit(10);

        if (verses && verses.length > 0) {
          contextText = verses.map(v => 
            `${v.chapter.book.name} ${v.chapter.number}:${v.number} - "${v.text}"`
          ).join('\n');
        }
      } catch (error) {
        console.error('Error fetching context verses:', error);
      }
    }

    // Enhanced system prompt for Bible study guidance
    const systemPrompt = `You are a wise and knowledgeable Bible study assistant called "AI Bible Guide". Your purpose is to help people understand Scripture with accuracy, reverence, and pastoral care.

CORE PRINCIPLES:
- Always cite specific Bible verses to support your answers
- Present different Christian perspectives respectfully when they exist
- Point people to Scripture as the ultimate authority
- Be encouraging and pastoral in tone
- Acknowledge when something is unclear or debated

DENOMINATIONAL AWARENESS:
When doctrinal differences exist between traditions (Catholic, Protestant, Orthodox), briefly acknowledge different viewpoints:
- "Some traditions interpret this as... while others understand..."
- "The Catholic Church teaches... while many Protestant denominations hold..."
- Be fair and respectful to all mainstream Christian traditions

RESPONSE FORMAT:
You must respond with valid JSON in this exact format:
{
  "answer_md": "Your markdown-formatted answer with verse citations",
  "citations": [
    {"type": "verse", "ref": "John 3:16", "excerpt": "For God so loved the world..."},
    {"type": "resource", "ref": "Commentary Title", "excerpt": "Brief relevant quote"}
  ]
}

GUIDELINES:
- Include at least 2-3 Bible verse citations in your citations array
- Use markdown formatting in your answer (headers, lists, emphasis)
- Keep answers focused but thorough (300-800 words typically)
- If asked about non-Christian religions, redirect to biblical perspective
- For personal/medical/legal advice, suggest speaking with a pastor/counselor
- Always include practical application when appropriate

CONTEXT PROVIDED:
${contextText ? `Scripture Context:\n${contextText}\n` : 'No specific verses provided as context.'}`;

    const userPrompt = `Question: ${question}

Please provide a biblical answer with appropriate Scripture citations.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1500,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    let aiResponse;

    try {
      aiResponse = JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      return new Response(
        JSON.stringify({ error: 'Invalid AI response format' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate response structure
    if (!aiResponse.answer_md || !aiResponse.citations || !Array.isArray(aiResponse.citations)) {
      console.error('Invalid AI response structure:', aiResponse);
      return new Response(
        JSON.stringify({ error: 'AI response missing required fields' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate usage for tracking
    const tokensUsed = data.usage?.total_tokens || 0;
    const responseTimeMs = Date.now() - new Date().getTime();

    // Log the query in database if user is provided
    if (userId) {
      try {
        await supabase
          .from('ai_queries')
          .insert({
            user_id: userId,
            question: question,
            context_refs: contextRefs,
            answer_md: aiResponse.answer_md,
            citations: aiResponse.citations,
            tokens_used: tokensUsed,
            response_time_ms: responseTimeMs
          });
      } catch (dbError) {
        console.error('Error logging query to database:', dbError);
        // Don't fail the request if logging fails
      }
    }

    console.log('AI Bible Guide response generated successfully');
    
    return new Response(
      JSON.stringify({
        ...aiResponse,
        tokens_used: tokensUsed,
        response_time_ms: responseTimeMs
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in AI Bible Guide function:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Internal server error',
        details: 'Failed to process AI request'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});