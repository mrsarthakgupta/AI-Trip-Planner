import type { TripPreferences, Itinerary, Day, Stop } from "./types";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export class ApiError extends Error {
  constructor(message: string, public retryable: boolean = true) {
    super(message);
    this.name = "ApiError";
  }
}

export async function generateItinerary(
  preferences: TripPreferences,
  signal?: AbortSignal
): Promise<Itinerary> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new ApiError("Backend is not configured. Check your environment variables.", false);
  }

  const url = `${SUPABASE_URL}/functions/v1/generate-itinerary`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ preferences }),
      signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ApiError("Request was cancelled.", false);
    }
    throw new ApiError("Could not reach the server. Check your connection and try again.");
  }

  if (!response.ok) {
    let detail = "";
    try {
      const errBody = await response.json();
      detail = errBody?.error ?? "";
    } catch {
      // response body wasn't JSON
    }
    const retryable = response.status >= 500 || response.status === 429;
    throw new ApiError(detail || `Server error (${response.status}).`, retryable);
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new ApiError("Received an invalid response from the server.");
  }

  return validateAndNormalize(data);
}

function genId(): string {
  return Math.random().toString(36).slice(2, 11);
}

function validateAndNormalize(data: unknown): Itinerary {
  if (typeof data !== "object" || data === null) {
    throw new ApiError("AI response is not a valid object.", false);
  }

  const obj = data as Record<string, unknown>;

  if (typeof obj.title !== "string" || !obj.title.trim()) {
    throw new ApiError("AI response is missing a valid trip title.", false);
  }
  if (typeof obj.summary !== "string" || !obj.summary.trim()) {
    throw new ApiError("AI response is missing a valid summary.", false);
  }
  if (!Array.isArray(obj.days) || obj.days.length === 0) {
    throw new ApiError("AI response must include at least one day.", false);
  }

  const destination =
    typeof obj.destination === "string" && obj.destination.trim() ? obj.destination : "";

  const days: Day[] = obj.days.map((rawDay: unknown, dIdx: number): Day => {
    if (typeof rawDay !== "object" || rawDay === null) {
      throw new ApiError(`Day ${dIdx + 1} is not a valid object.`, false);
    }
    const d = rawDay as Record<string, unknown>;
    if (typeof d.title !== "string" || !d.title.trim()) {
      throw new ApiError(`Day ${dIdx + 1} is missing a title.`, false);
    }
    if (!Array.isArray(d.stops) || d.stops.length === 0) {
      throw new ApiError(`Day ${dIdx + 1} must have at least one stop.`, false);
    }

    const stops: Stop[] = d.stops.map((rawStop: unknown, sIdx: number): Stop => {
      if (typeof rawStop !== "object" || rawStop === null) {
        throw new ApiError(`Day ${dIdx + 1} stop ${sIdx + 1} is not a valid object.`, false);
      }
      const s = rawStop as Record<string, unknown>;
      if (typeof s.name !== "string" || !s.name.trim()) {
        throw new ApiError(`Day ${dIdx + 1} stop ${sIdx + 1} is missing a name.`, false);
      }
      return {
        id: genId(),
        name: s.name,
        time: typeof s.time === "string" ? s.time : "",
        duration: typeof s.duration === "string" ? s.duration : "",
        description: typeof s.description === "string" ? s.description : "",
        category: typeof s.category === "string" ? s.category : "activity",
        estimatedCost: typeof s.estimatedCost === "string" ? s.estimatedCost : "",
        transport: typeof s.transport === "string" ? s.transport : "",
        completed: false,
      };
    });

    return {
      id: genId(),
      day: typeof d.day === "number" ? d.day : dIdx + 1,
      title: d.title,
      summary: typeof d.summary === "string" ? d.summary : "",
      stops,
    };
  });

  return {
    title: obj.title,
    destination,
    summary: obj.summary,
    totalDays: typeof obj.totalDays === "number" ? obj.totalDays : days.length,
    days,
  };
}
