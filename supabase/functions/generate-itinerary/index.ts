const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SYSTEM_PROMPT = `You are an expert travel planner. Generate a detailed day-by-day trip itinerary based on the user's structured preferences.

Return ONLY valid JSON (no markdown, no code fences, no commentary) with this exact structure:
{
  "title": "A catchy title for the trip",
  "destination": "The destination name",
  "summary": "A 2-3 sentence overview of the trip",
  "totalDays": 4,
  "days": [
    {
      "day": 1,
      "title": "Short descriptive title for this day",
      "summary": "1-2 sentence summary of what this day covers",
      "stops": [
        {
          "id": "stop-1-1",
          "name": "Name of the stop, attraction, or restaurant",
          "category": "One of: sightseeing, food, transport, shopping, activity, rest, nightlife, nature, culture, beach, adventure",
          "time": "Suggested time like 09:00 AM or 2:00 PM",
          "duration": "Estimated duration like 2 hours or 45 min",
          "description": "Brief 1-2 sentence description of what to do or see",
          "estimatedCost": "Estimated cost like ₹200 or $15 or Free",
          "transport": "How to get there like '20 min by taxi' or '10 min walk'"
        }
      ]
    }
  ]
}

Rules:
- Generate exactly the number of days specified by the user's duration, defaulting to 3 days if unspecified.
- Each day should have 3-6 stops arranged in a logical geographic sequence to minimize travel time.
- Spread activities realistically across the day with appropriate times.
- PERSONALIZE the itinerary based on ALL user preferences:
  - Match the budget level (budget/moderate/premium/luxury) in cost estimates and venue choices.
  - Match the travel pace (relaxed = fewer stops, more downtime; balanced = moderate; packed = more stops).
  - Match the trip type (solo/couple/family/friends/business) in activity choices.
  - Prioritize stops that align with the user's selected interests.
  - Respect transportation preferences (public transport, taxi, rental car, etc.).
  - Respect accommodation, dietary, and crowd preferences.
  - Include must-visit places if specified.
  - Avoid places/activities the user wants to avoid.
  - Incorporate additional notes and personal requirements.
- Keep descriptions concise and actionable.
- Use the category field to classify each stop accurately.
- Give each stop a unique id like "stop-1-1", "stop-1-2", "stop-2-1" etc.`;

interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OpenAIResponse {
  choices: Array<{
    message: { content: string };
  }>;
}

interface TripPreferences {
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  travelerType: string;
  budget: string;
  pace: string;
  tripType: string;
  interests: string[];
  transportation: string;
  accommodation: string;
  dietary: string;
  crowdPreference: string;
  mustVisit: string;
  avoid: string;
  additionalNotes: string;
}

function calculateDuration(startDate: string, endDate: string): number {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
  const diffMs = end.getTime() - start.getTime();
  if (diffMs < 0) return 0;
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1;
  return diffDays > 0 ? diffDays : 0;
}

function buildUserPrompt(prefs: TripPreferences): string {
  const lines: string[] = [];

  lines.push(`Please create a personalized trip itinerary with the following preferences:`);
  lines.push("");

  if (prefs.destination) lines.push(`Destination: ${prefs.destination}`);

  if (prefs.startDate && prefs.endDate) {
    const duration = calculateDuration(prefs.startDate, prefs.endDate);
    lines.push(`Travel dates: ${prefs.startDate} to ${prefs.endDate}`);
    if (duration > 0) lines.push(`Trip duration: ${duration} days`);
  } else if (prefs.startDate) {
    lines.push(`Start date: ${prefs.startDate}`);
  }
  if (prefs.travelers) lines.push(`Number of travelers: ${prefs.travelers} (${prefs.travelerType})`);
  if (prefs.budget) lines.push(`Budget: ${prefs.budget}`);
  if (prefs.pace) lines.push(`Travel pace: ${prefs.pace}`);
  if (prefs.tripType) lines.push(`Trip type: ${prefs.tripType}`);

  if (prefs.interests.length > 0) {
    lines.push(`Interests: ${prefs.interests.join(", ")}`);
  }

  if (prefs.transportation) lines.push(`Preferred transportation: ${prefs.transportation}`);
  if (prefs.accommodation) lines.push(`Accommodation preference: ${prefs.accommodation}`);
  if (prefs.dietary) lines.push(`Dietary preference: ${prefs.dietary}`);
  if (prefs.crowdPreference) lines.push(`Crowd preference: ${prefs.crowdPreference}`);

  if (prefs.mustVisit) lines.push(`Places I definitely want to visit: ${prefs.mustVisit}`);
  if (prefs.avoid) lines.push(`Places or activities to avoid: ${prefs.avoid}`);
  if (prefs.additionalNotes) lines.push(`Additional requirements: ${prefs.additionalNotes}`);

  return lines.join("\n");
}

function extractJson(raw: string): string {
  let text = raw.trim();
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    text = fenceMatch[1].trim();
  }
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first !== -1 && last !== -1 && last > first) {
    text = text.slice(first, last + 1);
  }
  return text;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error:
            "OpenAI API key is not configured. Set the OPENAI_API_KEY edge function secret.",
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const preferences: TripPreferences = body?.preferences;

    if (!preferences || typeof preferences !== "object") {
      return new Response(
        JSON.stringify({ error: "Trip preferences are required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!preferences.destination || preferences.destination.trim().length < 2) {
      return new Response(
        JSON.stringify({ error: "A destination of at least 2 characters is required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userPrompt = buildUserPrompt(preferences);

    const messages: LLMMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ];

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 55000);

    let openaiResponse: Response;
    try {
      openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages,
          response_format: { type: "json_object" },
          temperature: 0.7,
          max_tokens: 4096,
        }),
        signal: controller.signal,
      });
    } catch (fetchErr) {
      clearTimeout(timeout);
      const msg = fetchErr instanceof Error ? fetchErr.message : "Network error";
      return new Response(
        JSON.stringify({ error: `Failed to reach AI service: ${msg}` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    clearTimeout(timeout);

    if (!openaiResponse.ok) {
      const errText = await openaiResponse.text();
      return new Response(
        JSON.stringify({
          error: `AI service returned an error (status ${openaiResponse.status}).`,
          detail: errText.slice(0, 500),
        }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const openaiData: OpenAIResponse = await openaiResponse.json();
    const content = openaiData.choices?.[0]?.message?.content;

    if (!content) {
      return new Response(
        JSON.stringify({ error: "AI returned an empty response." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const jsonStr = extractJson(content);

    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonStr);
    } catch {
      return new Response(
        JSON.stringify({ error: "AI returned malformed JSON that could not be parsed." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const validationError = validateItinerary(parsed);
    if (validationError) {
      return new Response(
        JSON.stringify({ error: `AI response failed validation: ${validationError}` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown server error";
    return new Response(
      JSON.stringify({ error: `Server error: ${msg}` }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function validateItinerary(data: unknown): string | null {
  if (typeof data !== "object" || data === null) return "Response is not an object";
  const obj = data as Record<string, unknown>;
  if (typeof obj.title !== "string" || !obj.title.trim()) return "Missing or invalid title";
  if (typeof obj.summary !== "string" || !obj.summary.trim()) return "Missing or invalid summary";
  if (!Array.isArray(obj.days) || obj.days.length === 0) return "Days must be a non-empty array";

  for (let i = 0; i < obj.days.length; i++) {
    const day = obj.days[i] as Record<string, unknown>;
    if (typeof day !== "object" || day === null) return `Day ${i + 1} is not an object`;
    if (typeof day.title !== "string" || !day.title.trim()) return `Day ${i + 1} missing title`;
    if (!Array.isArray(day.stops) || day.stops.length === 0)
      return `Day ${i + 1} must have at least one stop`;

    for (let j = 0; j < day.stops.length; j++) {
      const stop = day.stops[j] as Record<string, unknown>;
      if (typeof stop !== "object" || stop === null) return `Day ${i + 1} stop ${j + 1} is not an object`;
      if (typeof stop.name !== "string" || !stop.name.trim()) return `Day ${i + 1} stop ${j + 1} missing name`;
      if (typeof stop.description !== "string") return `Day ${i + 1} stop ${j + 1} missing description`;
      if (typeof stop.time !== "string") return `Day ${i + 1} stop ${j + 1} missing time`;
      if (typeof stop.duration !== "string") return `Day ${i + 1} stop ${j + 1} missing duration`;
      if (typeof stop.category !== "string") return `Day ${i + 1} stop ${j + 1} missing category`;
    }
  }

  return null;
}
