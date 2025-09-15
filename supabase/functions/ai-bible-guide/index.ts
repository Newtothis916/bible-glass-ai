import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question, context = [] } = await req.json()

    if (!question) {
      throw new Error('Question is required')
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user from auth header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (userError || !user) {
      throw new Error('Invalid user')
    }

    // Prepare OpenAI API call
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    // Build context for the AI
    const systemPrompt = `You are a knowledgeable Bible assistant. You help users understand Scripture, theology, and Christian living. Always provide biblically accurate responses with relevant verse references. Be encouraging and pastoral in your tone while maintaining theological accuracy.`

    const messages = [
      { role: 'system', content: systemPrompt },
      ...context.slice(-5), // Last 5 messages for context
      { role: 'user', content: question }
    ]

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    })

    if (!openaiResponse.ok) {
      const error = await openaiResponse.json()
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`)
    }

    const openaiData = await openaiResponse.json()
    const answer = openaiData.choices[0]?.message?.content || 'I apologize, but I could not generate a response.'
    const tokensUsed = openaiData.usage?.total_tokens || 0

    // Extract potential Bible references from the answer
    const citations = extractBibleReferences(answer)

    // Log the query to database
    const { error: logError } = await supabase
      .from('ai_queries')
      .insert({
        user_id: user.id,
        question: question,
        answer_md: answer,
        citations: citations,
        tokens_used: tokensUsed,
        response_time_ms: 0 // Could measure actual response time
      })

    if (logError) {
      console.error('Error logging AI query:', logError)
    }

    return new Response(
      JSON.stringify({
        answer: answer,
        citations: citations,
        tokens_used: tokensUsed
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('AI Bible Guide Error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        answer: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment."
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})

// Helper function to extract Bible references from text
function extractBibleReferences(text: string): string[] {
  const bibleBooks = [
    'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth',
    '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah',
    'Esther', 'Job', 'Psalms', 'Psalm', 'Proverbs', 'Ecclesiastes', 'Song of Songs', 'Isaiah',
    'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos', 'Obadiah',
    'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
    'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians',
    'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
    '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter',
    '1 John', '2 John', '3 John', 'Jude', 'Revelation'
  ]
  
  const references: string[] = []
  const pattern = new RegExp(`(${bibleBooks.join('|')})\\s+\\d+(?::\\d+(?:-\\d+)?)?`, 'gi')
  const matches = text.match(pattern)
  
  if (matches) {
    references.push(...matches.map(match => match.trim()))
  }
  
  return [...new Set(references)] // Remove duplicates
}