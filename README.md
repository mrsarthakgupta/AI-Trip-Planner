# AI Trip Planner

An AI-powered trip planning web application built with React and TypeScript. It helps users create personalized day-by-day travel itineraries based on their destination, travel dates, budget, interests, transportation preferences, and other requirements.

## Features

- 🗺️ Personalized AI-generated travel itineraries
- 📅 Day-by-day trip planning
- 💰 Budget-based planning
- ❤️ Interest and activity preferences
- 🚗 Transportation preferences
- 🍽️ Dietary preferences
- ✏️ Interactive itinerary editing
- ✅ Mark activities as completed
- 🔄 Retry failed AI requests
- 📱 Responsive and user-friendly interface
- 🔐 Secure AI integration through a backend function

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Supabase Edge Functions
- Google Gemini API

## How It Works

The application follows this flow:

1. The user enters their travel preferences through the planning wizard.
2. The frontend sends the structured preferences to the Supabase backend.
3. The backend securely communicates with the Gemini API.
4. Gemini generates a structured JSON itinerary.
5. The backend validates the response.
6. The frontend displays the itinerary as an interactive day-by-day travel plan.

## Project Structure

```text
AI-Trip-Planner/
│
├── src/
│   ├── components/
│   ├── api.ts
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── types.ts
│   └── vite-env.d.ts
│
├── supabase/
│   ├── functions/
│   │   └── generate-itinerary/
│   │       └── index.ts
│   └── config.toml
│
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

# AI Trip Planner

An AI-powered trip planning web application built with React and TypeScript. It helps users create personalized day-by-day travel itineraries based on their destination, travel dates, budget, interests, transportation preferences, and other requirements.

## Features

- 🗺️ Personalized AI-generated travel itineraries
- 📅 Day-by-day trip planning
- 💰 Budget-based planning
- ❤️ Interest and activity preferences
- 🚗 Transportation preferences
- 🍽️ Dietary preferences
- ✏️ Interactive itinerary editing
- ✅ Mark activities as completed
- 🔄 Retry failed AI requests
- 📱 Responsive and user-friendly interface
- 🔐 Secure AI integration through a backend function

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Supabase Edge Functions
- Google Gemini API

## How It Works

The application follows this flow:

1. The user enters their travel preferences through the planning wizard.
2. The frontend sends the structured preferences to the Supabase backend.
3. The backend securely communicates with the Gemini API.
4. Gemini generates a structured JSON itinerary.
5. The backend validates the response.
6. The frontend displays the itinerary as an interactive day-by-day travel plan.

## Project Structure

```text
AI-Trip-Planner/
│
├── src/
│   ├── components/
│   ├── api.ts
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── types.ts
│   └── vite-env.d.ts
│
├── supabase/
│   ├── functions/
│   │   └── generate-itinerary/
│   │       └── index.ts
│   └── config.toml
│
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

# AI Trip Planner

A polished React + Vite web application that generates personalized day-by-day trip itineraries using AI. Users describe their travel requirements through a guided multi-step planning wizard, and the AI creates a structured itinerary they can interact with and customize.

## Project Overview

This is NOT a chatbot. The app is a proper interactive travel-planning product with a structured 5-step planning wizard that collects user preferences (destination, dates, budget, interests, transportation, dietary needs, etc.) and sends them to an LLM through a secure backend. The LLM returns strictly structured JSON, which is validated and rendered as an interactive itinerary dashboard.

**Flow:**

```
User Preferences (structured wizard)
        ↓
Structured Request to Backend
        ↓
LLM (OpenAI GPT-4o-mini)
        ↓
Structured JSON Response
        ↓
Validation & Normalization
        ↓
Interactive React Itinerary
        ↓
User Can Modify Itinerary
```

## Features

- **5-Step Planning Wizard** with progress indicator:
  1. Destination & Dates — destination, travel dates, duration, number of travelers, traveler type
  2. Budget & Travel Style — budget level, travel pace, trip type
  3. Interests — selectable interest chips (beaches, food, history, nature, nightlife, etc.)
  4. Travel Preferences — transportation, accommodation, dietary, crowd preference, must-visit places, places to avoid
  5. Personal Requirements — free-form text input with character counter
- **Review screen** — summary of all preferences before generation, with edit shortcuts
- **AI-powered itinerary generation** — personalized based on ALL user preferences
- **Interactive itinerary dashboard**:
  - Expand/collapse days
  - Expand/collapse individual stops
  - Remove stops
  - Reorder stops (move up/down)
  - Mark stops as completed (with progress bar)
  - Regenerate itinerary
  - Plan another trip
- **Robust error handling** — loading states, error states, retry for malformed JSON, invalid schema, empty responses, API failures, timeouts, and network failures
- **Stale response protection** — older AI requests can never overwrite newer ones
- **Fully responsive** — optimized for mobile, tablet, and desktop
- **Secure API key handling** — the OpenAI API key lives only on the server

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS + lucide-react icons
- **Language**: TypeScript
- **Backend**: Supabase Edge Function (Deno) proxying OpenAI's API
- **LLM**: OpenAI `gpt-4o-mini` with `response_format: json_object` for guaranteed JSON output

## How the AI Integration Works

1. The user completes the 5-step wizard, building a `TripPreferences` object.
2. On "Create My Itinerary", the frontend sends the preferences object to a Supabase Edge Function (`generate-itinerary`).
3. The edge function constructs a detailed prompt from the structured preferences and sends it to OpenAI's `gpt-4o-mini` model with a strong system prompt that instructs the model to return ONLY valid JSON matching the required schema.
4. The edge function parses and validates the JSON server-side before returning it.
5. The frontend performs a second round of validation and normalization (adds unique IDs, fills defaults, checks types) before rendering.

The OpenAI API key is stored as a Supabase Edge Function secret (`OPENAI_API_KEY`) and is never exposed to the browser.

## Structured JSON Approach

The LLM is instructed to return JSON with this exact structure:

```json
{
  "title": "A catchy title for the trip",
  "destination": "The destination name",
  "summary": "A 2-3 sentence overview",
  "totalDays": 4,
  "days": [
    {
      "day": 1,
      "title": "Day title",
      "summary": "Day summary",
      "stops": [
        {
          "id": "stop-1-1",
          "name": "Stop name",
          "category": "sightseeing",
          "time": "09:00 AM",
          "duration": "2 hours",
          "description": "What to do here",
          "estimatedCost": "₹200",
          "transport": "20 min by taxi"
        }
      ]
    }
  ]
}
```

## Validation / Failure Handling

The app validates the AI response at two layers:

**Server-side (edge function):**

- JSON parsing with fallback extraction (strips markdown fences, extracts JSON from text)
- Schema validation: checks for title, summary, days array, stop fields, types
- Returns a 502 error with a descriptive message if validation fails

**Client-side (frontend):**

- Re-parses JSON and validates all required fields
- Normalizes: generates unique IDs for stops/days, fills missing optional fields with defaults
- Throws `ApiError` with user-friendly messages for each failure case

Handled failure cases:

1. Malformed JSON
2. Invalid JSON structure
3. Missing required fields
4. Incorrect data types
5. Empty itinerary
6. Empty days
7. Empty stops
8. API failure (non-2xx)
9. Timeout (55-second server-side timeout)
10. Network failure

The app NEVER crashes due to invalid AI output. It shows a user-friendly error message and a Retry button.

## Stale Request Protection

When a user generates a new itinerary while a previous request is still in flight, the app uses two mechanisms:

1. **AbortController**: The previous request is aborted immediately, canceling the fetch.
2. **Request Token**: Each request gets an incrementing token. When a response arrives, the app checks if the token still matches the latest one. If it doesn't match (a newer request was made), the response is silently discarded.

This ensures that if Request A (Goa) finishes after Request B (Jaipur) was started, the Goa response can never overwrite the Jaipur itinerary.

## Local Setup

### Prerequisites

- Node.js 18+
- A Supabase project with edge functions enabled
- An OpenAI API key

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

The following are pre-populated in the Bolt environment:

| Variable                   | Purpose                            |
| -------------------------- | ---------------------------------- |
| `VITE_SUPABASE_URL`      | Supabase project URL (client-side) |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key (client-side)    |

The OpenAI API key is set as a server-side edge function secret (`OPENAI_API_KEY`) and is NOT exposed to the frontend.

### 3. Run the dev server

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build
```

## Environment Variables

- `VITE_SUPABASE_URL` — Your Supabase project URL (exposed to frontend, safe to expose)
- `VITE_SUPABASE_ANON_KEY` — Supabase anon key (safe for frontend use, restricted by RLS)
- `OPENAI_API_KEY` — OpenAI API key (server-side only, stored as Supabase edge function secret, NEVER exposed to the browser)

## AI Tools Used

- **OpenAI GPT-4o-mini** — Generates structured trip itineraries from user preferences
- **Bolt (AI coding assistant)** — Used to scaffold and build the application code

## AI Usage Note

This project was built with the assistance of Bolt, an AI coding assistant. The AI helped with:

- Project structure and component architecture
- Writing React components and TypeScript types
- Implementing the edge function and validation logic
- Styling with Tailwind CSS

The AI-generated itineraries may occasionally produce inaccurate travel information (times, distances, venue details, costs). Always verify critical details before traveling.

## Known Limitations

- **No persistence**: Itineraries are stored in React state only; refreshing the page loses the current itinerary. No database is used per the assignment scope.
- **No authentication**: Single-user, no-login app per the assignment scope.
- **No maps**: Stops are listed as text without map integration.
- **AI accuracy**: Generated times, durations, costs, and venue details may not be perfectly accurate.
- **Rate limits**: Subject to OpenAI API rate limits and quotas.
- **Request timeout**: The edge function aborts after 55 seconds.
- **Reordering**: Uses move up/down buttons rather than drag-and-drop for reliability.

## Time Spent

Approximately **5-6 hours**, broken down as:

- Project setup & configuration: 30 min
- Edge function (LLM proxy + prompt engineering + validation): 1 hour
- Frontend API client + type validation: 45 min
- 5-step wizard components (Destination, Budget, Interests, Preferences, Notes): 1.5 hours
- Review step + wizard container with navigation: 45 min
- Itinerary dashboard (DayCard, StopCard, ItineraryView): 1 hour
- Loading/error states, stale-response protection, App orchestration: 30 min
- README + testing + polish: 30 min

## License

MIT
