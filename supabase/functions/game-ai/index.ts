import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    // Handle different AI commentary types
    if (type === "commentary") {
      systemPrompt = "You are an energetic Jamaican fighting game commentator. Provide exciting, brief commentary on fight actions in patois style. Keep responses under 20 words.";
      userPrompt = `Fighter ${data.attacker} just hit ${data.defender} with a ${data.move}! Current health: ${data.attackerHealth} vs ${data.defenderHealth}`;
    } else if (type === "strategy") {
      systemPrompt = "You are a wise Jamaican fighting sensei. Give brief strategic advice in patois style. Keep responses under 30 words.";
      userPrompt = `Fighter ${data.fighter} is at ${data.health} health against ${data.opponent}. What strategy should they use?`;
    } else if (type === "victory") {
      systemPrompt = "You are a hype Jamaican announcer. Celebrate the winner in an exciting patois style. Keep it under 25 words.";
      userPrompt = `${data.winner} has defeated ${data.loser}! ${data.winner} has ${data.wins} wins.`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded, try again later" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, add credits to Lovable workspace" }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiData = await response.json();
    const commentary = aiData.choices[0].message.content;

    return new Response(
      JSON.stringify({ commentary }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Game AI error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
