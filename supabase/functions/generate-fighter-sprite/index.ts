import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FIGHTER_BASE_STYLES: Record<string, string> = {
  leroy: `Jamaican street fighter, muscular build, long dreadlocks with tech accessories, green/yellow rasta colors, cyan glowing tattoos, dark skin, futuristic headband`,
  jordan: `Jamaican DJ fighter, athletic build, purple headphones, gold chain, blue streetwear, medium dreadlocks, brown skin, sound wave effects`,
  sifu: `Chinese kung fu master, lean muscular, white gi with black belt, short grey-streaked hair, Asian features, golden chi aura, wise expression`,
  razor: `Cyber ninja assassin, athletic ninja build, black tactical suit, red cybernetic eyes, blue energy katana, mixed ethnicity, green digital effects`,
  rootsman: `Mystic Jamaican warrior, powerful build, very long dreadlocks with rasta beads, dark skin, green nature aura, earth-tone robes, wooden staff`,
  johnwick: `John Wick legendary assassin, muscular build, black suit, white shirt, dark tie, short dark hair and beard, Caucasian, dual pistols`,
};

const SPRITE_SHEET_TEMPLATE = `Create a pixel art sprite sheet in Street Fighter II style with exactly 24 frames arranged in a 4×6 grid (4 rows, 6 columns).

CHARACTER STYLE: {characterStyle}

FRAME LAYOUT (exactly 200×200px each frame, total image 1200×800px):
Row 1 (Idle & Walk): [1] idle stance [2] idle variation [3] idle return [4] idle cycle [5] walk frame 1 [6] walk frame 2
Row 2 (Movement): [7] walk frame 3 [8] walk frame 4 [9] walk frame 5 [10] walk frame 6 [11] jump up [12] jump peak
Row 3 (Actions): [13] jump down [14] jump land [15] crouch start [16] crouch hold [17] light punch wind [18] light punch hit
Row 4 (Attacks): [19] heavy punch wind [20] heavy kick [21] special move start [22] special move mid [23] block/hurt [24] victory pose

STRICT REQUIREMENTS:
- Retro pixel art style like Street Fighter II, Capcom arcade fighting games
- 16-bit era pixel graphics, NOT 3D renders
- Each frame EXACTLY 200×200 pixels in a perfect grid
- Character facing RIGHT in all frames
- Transparent or solid color background
- Consistent character size and proportion across all 24 frames
- Clear, distinct poses for each animation state
- Bold outlines, limited color palette (16-32 colors max)
- No modern 3D graphics, photorealism, or high-poly renders

REFERENCE: Classic 1990s arcade fighters - Street Fighter II, King of Fighters, Fatal Fury pixel sprite sheets.`;


serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fighterId, type } = await req.json();
    
    if (!fighterId) {
      throw new Error('Missing fighterId');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const characterStyle = FIGHTER_BASE_STYLES[fighterId];
    if (!characterStyle) {
      throw new Error(`Invalid fighterId: ${fighterId}`);
    }

    // Generate sprite sheet prompt
    const fullPrompt = SPRITE_SHEET_TEMPLATE.replace('{characterStyle}', characterStyle);

    console.log(`🎨 Generating sprite sheet for: ${fighterId}`);
    console.log(`📐 Creating 24-frame grid (1200×800px)`);
    console.log(`📝 Prompt length: ${fullPrompt.length} chars`);

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

    console.log(`✅ Generated sprite sheet for ${fighterId}`);

    return new Response(
      JSON.stringify({ 
        imageUrl,
        fighterId,
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
