import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FIGHTER_PROMPTS: Record<string, string> = {
  leroy: `Professional 3D render of a Jamaican street fighter named Leroy, muscular athletic build, long black dreadlocks with cyber-tech accessories, green and yellow rasta-colored shirt with circuit patterns, dark skin, confident stance, glowing cyan tattoos on arms, futuristic tech headband, dramatic studio lighting, white background, photorealistic, Unreal Engine 5 quality, 8K resolution`,
  
  jordan: `Professional 3D render of a Jamaican DJ fighter named Jordan, athletic build, large purple headphones, thick gold chain necklace, blue urban streetwear, medium-length dreadlocks, dark brown skin, sound wave aura effect, portable turntable accessory, dramatic lighting, white background, photorealistic, Unreal Engine 5 quality, 8K resolution`,
  
  sifu: `Professional 3D render of a Chinese kung fu master named Sifu, lean muscular build, white traditional gi robe with black belt, short black hair with grey streaks, Asian features, glowing golden chi energy aura, calm wise expression, wire-fu stance, dramatic lighting, white background, photorealistic, Unreal Engine 5 quality, 8K resolution`,
  
  razor: `Professional 3D render of a cyber ninja assassin named Razor, athletic ninja build, black tactical suit with glowing red cybernetic eyes, katana with blue energy blade, mixed ethnicity features, green digital energy field, sleek modern armor, dramatic lighting, white background, photorealistic, Unreal Engine 5 quality, 8K resolution`,
  
  rootsman: `Professional 3D render of a mystic Jamaican warrior named Rootsman, powerful build, very long thick dreadlocks with green/yellow/red rasta beads, dark skin, glowing green nature energy aura, earth-tone robes, wooden staff weapon, spiritual presence, dramatic lighting, white background, photorealistic, Unreal Engine 5 quality, 8K resolution`,
  
  johnwick: `Professional 3D render of John Wick the legendary assassin, athletic muscular build, black tactical suit, white dress shirt, dark tie, short dark hair with beard, Caucasian features, dual pistols, intense focused expression, muzzle flash effects, dramatic cinematic lighting, white background, photorealistic, Unreal Engine 5 quality, 8K resolution`,
};

const POSE_DESCRIPTIONS: Record<string, string> = {
  idle: "standing in neutral ready fighting stance, feet shoulder-width apart, hands up in guard position",
  walking: "mid-stride walking forward, one leg raised, balanced movement",
  lightPunch: "throwing a quick jab, right arm extended forward, left arm protecting face",
  heavyPunch: "winding up a powerful haymaker punch, body twisted, full power stance",
  kick: "executing a high roundhouse kick, leg fully extended at head height",
  special: "performing their signature special move with dramatic energy effects",
  victory: "triumphant victory pose, arms raised in celebration, confident expression",
  hurt: "defensive hurt pose, arms up protecting body, staggered stance",
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fighterId, pose } = await req.json();
    
    if (!fighterId || !pose) {
      throw new Error('Missing fighterId or pose');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const basePrompt = FIGHTER_PROMPTS[fighterId];
    const poseDescription = POSE_DESCRIPTIONS[pose];

    if (!basePrompt || !poseDescription) {
      throw new Error(`Invalid fighterId (${fighterId}) or pose (${pose})`);
    }

    const fullPrompt = `${basePrompt}, ${poseDescription}`;

    console.log(`🎨 Generating fighter: ${fighterId} - ${pose}`);
    console.log(`📝 Prompt: ${fullPrompt}`);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: fullPrompt,
          },
        ],
        modalities: ['image', 'text'],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please wait and try again.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your Lovable workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      console.error('❌ No image in response:', JSON.stringify(data));
      throw new Error('No image generated');
    }

    console.log(`✅ Generated ${fighterId}-${pose}`);

    return new Response(
      JSON.stringify({ 
        imageUrl,
        fighterId,
        pose,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('❌ Error in generate-fighter-sprite:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
