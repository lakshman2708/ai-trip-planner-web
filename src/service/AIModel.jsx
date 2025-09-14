// src/service/AIModal.jsx
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY);

const generationConfig = {
  temperature: 0.2,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

const getModel = () =>
  genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig,
  });

/**
 * Builds the prompt exactly like your screenshot but parameterized.
 * Keep it strict about JSON output.
 */
function buildPrompt({ location = "Las Vegas", days = 3, travellers = "Couple", budget = "Cheap" }) {
  return `Generate Travel Plan for Location : ${location}, for ${days} Days for ${travellers} with a ${budget} budget. 
Give me a Hotels options list with fields: HotelName, HotelAddress, Price, hotelImageUrl, geoCoordinates (lat,long), rating, description.
Also suggest an itinerary for ${days} days with each day's plan listing: placeName, placeDetails, placeImageUrl, geoCoordinates, ticketPricing, rating, travelTimeBetweenLocations, and bestTimeToVisit.
Return the whole response strictly in valid JSON format with top-level keys: "hotels" (array) and "itinerary" (array of days).
Example JSON schema:
{
  "hotels": [
    {
      "hotelName": "string",
      "hotelAddress": "string",
      "price": "string",
      "hotelImageUrl": "string",
      "geoCoordinates": "lat,long",
      "rating": "string",
      "description": "string"
    }
  ],
  "itinerary": [
    {
      "day": 1,
      "places": [
        {
          "placeName": "string",
          "placeDetails": "string",
          "placeImageUrl": "string",
          "geoCoordinates": "lat,long",
          "ticketPricing": "string",
          "rating": "string",
          "travelTimeBetweenLocations": "string",
          "bestTimeToVisit": "string"
        }
      ]
    }
  ]
}
Return ONLY the JSON — no extra commentary.`;
}

/**
 * Generate a travel plan via Gemini and return parsed JSON.
 * params: { location, days, travellers, budget }
 */
export async function generateTravelPlan(params = {}) {
  const model = getModel();
  const prompt = buildPrompt(params);
  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const result = await model.generateContent(prompt);
      const text = await result.response.text();

      try {
        return JSON.parse(text);
      } catch (err) {
        const match = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
        if (match) return JSON.parse(match[0]);
        throw new Error("Model did not return valid JSON.");
      }
    } catch (err) {
      if (err.message.includes("503")) {
        attempt++;
        console.warn(`Gemini overloaded, retry attempt ${attempt}...`);
        await new Promise((res) => setTimeout(res, 2000)); // wait 2s before retry
      } else {
        console.error("generateTravelPlan error:", err);
        throw err;
      }
    }
  }

  throw new Error("Failed after 3 retries: Gemini model is overloaded.");
}
