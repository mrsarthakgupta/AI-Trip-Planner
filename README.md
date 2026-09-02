# ✈️ AI Trip Planner

An AI-powered travel planning web application that generates personalized day-by-day trip itineraries based on the user's destination, travel dates, budget, interests, number of travelers, traveler type, transportation preferences, and other travel requirements.

## 🌐 Live Demo

👉 https://ai-trip-planner-brown-seven.vercel.app/


---

## 📌 Project Overview

AI Trip Planner is a modern React + Vite web application designed to simplify travel planning.

Instead of manually searching for places, activities, timings, and transportation options, users can enter their travel preferences through a structured multi-step planning wizard.

The application sends these preferences securely to a backend server function, which communicates with an AI model and generates a structured itinerary.

The generated itinerary is then validated and displayed as an interactive day-by-day travel plan.

### Basic Flow

User Preferences
        ↓
Structured Planning Wizard
        ↓
Secure Backend Function
        ↓
AI Model
        ↓
Structured JSON Response
        ↓
Response Validation
        ↓
Interactive Travel Itinerary

---

## ✨ Features

### 🧳 Personalized Trip Planning

Users can provide details such as:

- Destination
- Start date
- End date
- Number of travelers
- Traveler type
- Budget
- Interests
- Transportation preferences
- Dietary requirements
- Other travel preferences

### 🤖 AI-Powered Itinerary Generation

The application uses an AI model to generate a personalized travel itinerary based on the user's requirements.

### 📅 Day-by-Day Itinerary

The generated plan is organized into individual days with multiple stops.

Each stop can contain:

- Location/activity name
- Time
- Duration
- Description
- Category
- Estimated cost
- Transportation information

### 🎯 Structured AI Output

Instead of treating the AI response as plain text, the application requests structured JSON.

This makes the AI-generated itinerary easier to:

- Validate
- Process
- Display
- Customize
- Extend in the future

### ✅ Response Validation

The application validates the AI response before displaying it to the user.

It checks:

- Trip title
- Trip summary
- Days
- Day titles
- Stops
- Stop names
- Time
- Duration
- Description
- Category

Invalid or incomplete responses are handled with appropriate error messages.

### 🔄 Error Handling

The application handles several possible failures, including:

- Missing environment variables
- Network errors
- Cancelled requests
- Server errors
- Rate limiting
- Invalid AI responses
- Malformed JSON
- Validation failures

### 📱 Responsive Interface

The application is designed to work across different screen sizes and provides a clean travel-planning interface.

---

## 🛠️ Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

### Backend

- Supabase Edge Functions
- Supabase

### AI

- Google Gemini API
- Gemini 2.5 Flash

### Deployment

- Vercel

### Version Control

- Git
- GitHub

---

## 🏗️ Project Structure

```text
AI-Trip-Planner/
│
├── src/
│   ├── components/
│   ├── apis.ts
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
├── README.md
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── eslint.config.js
