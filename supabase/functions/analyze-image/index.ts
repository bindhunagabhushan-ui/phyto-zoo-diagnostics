import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // ~10MB of base64 payload
const ALLOWED_MIME = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

async function requireUser(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    { global: { headers: { Authorization: authHeader } } }
  );

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
}


const systemPrompt = `You are an expert diagnostic AI for plant and animal health. Analyze the uploaded image and determine if there are any signs of disease, pest infestation, or abnormal condition.

IMPORTANT: You must respond with ONLY valid JSON, no markdown, no code blocks, just raw JSON.

For PLANTS, identify: leaves, fruits, vegetables, stems, roots, flowers, bark
For ANIMALS, identify: skin, fur, teeth, eyes, nails, wounds, ears, paws

Analyze the image and respond with this exact JSON structure:
{
  "detected": true/false,
  "detectedCategory": "Plant" or "Animal",
  "detectedSpecies": "Specific species name (e.g., 'Tomato', 'Labrador Retriever', 'Rose', 'Persian Cat')",
  "detectedPart": "The part being analyzed (e.g., 'Leaf', 'Fruit', 'Skin', 'Eye', 'Fur', 'Stem')",
  "conditionName": "Disease or condition name (e.g., 'Late Blight', 'Fungal Dermatitis', 'Powdery Mildew')",
  "category": "plant" or "animal",
  "symptoms": ["symptom 1", "symptom 2", "symptom 3", "symptom 4", "symptom 5"],
  "severity": "low" or "medium" or "high",
  "organicTreatment": "Detailed organic/natural treatment and preventive measures",
  "chemicalTreatment": "Detailed chemical/conventional treatment recommendations with safety disclaimers",
  "monitoring": ["step 1", "step 2", "step 3", "step 4", "step 5"],
  "confidenceScore": 0-100
}

If no disease or condition is detected, respond with:
{
  "detected": false,
  "message": "No disease or abnormal condition detected. The subject appears healthy.",
  "detectedCategory": "Plant" or "Animal",
  "detectedSpecies": "Identified species if possible",
  "detectedPart": "The part being analyzed",
  "category": "plant" or "animal",
  "confidenceScore": 0-100
}

Be specific and accurate. Consider common diseases for the detected species. Provide actionable treatment advice.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const user = await requireUser(req);
    if (!user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { imageBase64 } = await req.json();

    if (!imageBase64 || typeof imageBase64 !== "string") {
      return new Response(
        JSON.stringify({ error: "No image provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (imageBase64.length > MAX_IMAGE_BYTES) {
      return new Response(
        JSON.stringify({ error: "Image too large. Maximum size is 10MB." }),
        { status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const mimeMatch = imageBase64.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,([A-Za-z0-9+/=\s]+)$/);
    if (!mimeMatch || !ALLOWED_MIME.includes(mimeMatch[1].toLowerCase())) {
      return new Response(
        JSON.stringify({ error: "Invalid image format. Use PNG, JPEG or WebP data URLs." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }


    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Starting image analysis...");

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
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this image for any signs of disease, pest infestation, or abnormal condition. Identify the species if possible." },
              { type: "image_url", image_url: { url: imageBase64 } }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "AI analysis failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    console.log("AI response received:", content?.substring(0, 200));

    if (!content) {
      return new Response(
        JSON.stringify({ error: "No analysis result returned" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse the JSON response from the AI
    let analysisResult;
    try {
      // Remove any markdown code blocks if present
      const cleanedContent = content.replace(/```json\n?|\n?```/g, "").trim();
      analysisResult = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError, content);
      return new Response(
        JSON.stringify({ error: "Failed to parse analysis result", raw: content }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Analysis complete, detected:", analysisResult.detected);

    return new Response(
      JSON.stringify(analysisResult),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in analyze-image function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
