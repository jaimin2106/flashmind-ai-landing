import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, count = 10, difficulty = "intermediate" } = await req.json();

    if (!text || text.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "No text provided" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');
    if (!perplexityApiKey) {
      console.error('PERPLEXITY_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Calling Perplexity API with', { textLength: text.length, count, difficulty });

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar-pro',
        messages: [
          {
            role: 'user',
            content: `You are an expert educator creating study flashcards. Generate exactly ${count} high-quality flashcard question-answer pairs from the provided content.

Requirements:
- Create ${count} flashcards at ${difficulty} difficulty level
- Questions should be clear, specific, and test understanding
- Answers should be concise but complete
- Cover different aspects of the material
- Return ONLY a valid JSON array, no other text

Format your response as a JSON array:
[
  {"question": "question text here", "answer": "answer text here"},
  {"question": "question text here", "answer": "answer text here"}
]

Content to generate flashcards from:

${text.slice(0, 8000)}`
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Perplexity API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: "Failed to generate flashcards" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    console.log('Raw response:', generatedText);

    // Parse the JSON response
    let flashcards;
    try {
      // Try to extract JSON array from the response
      const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        flashcards = JSON.parse(jsonMatch[0]);
      } else {
        flashcards = JSON.parse(generatedText);
      }

      // Validate flashcards format
      if (!Array.isArray(flashcards)) {
        throw new Error("Response is not an array");
      }

      flashcards = flashcards.filter(card => 
        card && 
        typeof card.question === 'string' && 
        typeof card.answer === 'string' &&
        card.question.trim() && 
        card.answer.trim()
      );

      if (flashcards.length === 0) {
        throw new Error("No valid flashcards generated");
      }

    } catch (parseError) {
      console.error('Failed to parse flashcards:', parseError, 'Raw text:', generatedText);
      return new Response(
        JSON.stringify({ error: "Failed to parse generated flashcards" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Successfully generated', flashcards.length, 'flashcards');

    return new Response(
      JSON.stringify({ flashcards }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-flashcards function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
