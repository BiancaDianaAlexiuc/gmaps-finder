import dotenv from "dotenv";
dotenv.config();

import { Pinecone } from "@pinecone-database/pinecone";
import axios from "axios";

const PINECONE_API_KEY = process.env.PINECONE_API_KEY || "";
const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY || "";
const PINECONE_INDEX_NAME = "gmaps-finder";
const PINECONE_ENVIRONMENT = "us-east-1";

const pinecone = new Pinecone({
  apiKey: PINECONE_API_KEY,
});

const index = pinecone.Index(PINECONE_INDEX_NAME);

const documentChunks = [
  "The Travel AI Planner is a revolutionary tool for planning your travels effortlessly. Designed to provide a seamless, personalized travel planning experience, this app combines real user reviews, estimated costs, and interactive itineraries to help you make the best decisions. Simple, intuitive, and practical—Travel AI Planner is the ultimate app to streamline your travel planning process.",
  "Using the Travel AI Planner is straightforward. You’ll begin on a clean, engaging landing page that guides you through registration and login.",
  "The landing page offers a welcoming “Get Started” button that initiates the process. Here, you’ll see a brief overview of the app’s features and advantages, along with an inviting hero section to draw users in.",
  "If you’re new to the app, registering is quick and easy. Click on the “Register” link near the “New here?” prompt under the login form. You’ll be prompted to provide basic information to create your account. Alternatively, you can register through social media accounts, like Facebook or Google, for faster access.",
  "Already have an account? Click “Get Started” to open a modal view, where you can log in using your social media profiles (Facebook, Google) or through email and password. This streamlined process ensures you’re quickly on your way to planning your next adventure.",
  "Upon logging in, you’ll be directed to the Dashboard—the heart of the Travel AI Planner. The Dashboard is designed with an intuitive layout, featuring a menu on the side and a central interactive map, making it easy to find and explore travel options.",
  "The main section of the Dashboard displays an interactive map, integrated with Google Maps, OpenStreetMap, and other sources. This map allows you to: **Search and Explore** destinations, **Visualize Routes** by displaying distances and estimated travel times., **View Costs** related to various transport options, from flights and car rentals to public transport prices.",
  "With the Travel AI Planner, your itinerary isn’t just a list—it’s an interactive map feature that shows: **Travel Times and Distances** for different segments of your trip, allowing you to plan efficiently, **Estimated Costs** for flights, fuel, accommodations, and train fares, so you’re always aware of expenses as you build your itinerary.",
  "Choosing the best options becomes easier with integrated review analysis. The app combines real reviews from various trusted sources—Booking, Google, TripAdvisor, Reddit, and more—to offer a consolidated view of feedback on different destinations, hotels, and attractions.",
  "With Travel AI Planner, you can: **Save Past Itineraries** for future reference, allowing you to keep track of previous trips., **Bookmark or Save Destinations** you’re interested in, creating a custom travel wish list., Access your saved itineraries from any device once logged in.",
  "Leveraging advanced AI and web scraping, the app generates tailored travel suggestions. The LLM (Large Language Model) suggests points of interest, dining, and activities based on your preferences, making each trip unique to you.",
  "The Travel AI Planner is designed with a clean and minimalistic user interface. Key elements include: **Iconography** that aids navigation and enhances the user experience., A **responsive layout** to ensure usability across devices., **Clear visual hierarchy** to make navigating between sections effortless.",
  "The app consists of several core pages: 1. **Landing Page:** An inviting entry point to showcase the app's main features.,2. **Login and Registration:** A secure access point for users to register or log in., 3. **Dashboard:** The main interface where users interact with the map, reviews, and itinerary planner. ,4. **Profile and Settings:** A section where users can manage account information, saved itineraries, and preferences.",
  "The app’s map integration goes beyond basic navigation, offering real-time travel data, including routes, estimated travel times, and distance measurements. This makes it easy to visualize travel logistics across multiple destinations.",
  "The app provides estimated costs for travel-related expenses, including: **Flights and Car Rentals:** Find competitive prices for major travel expenses., **Accommodations and Local Transport:** Discover affordable options for staying and getting around., **Fuel and Miscellaneous Expenses:** Estimate fuel costs for road trips and add any other relevant expenses to your budget.",
];

async function embedAndStoreChunks() {
  for (let i = 0; i < documentChunks.length; i++) {
    const chunk = documentChunks[i];

    // Get the embedding for this chunk
    const embeddingResponse = await axios.post(
      "https://api.openai.com/v1/embeddings",
      {
        input: chunk,
        model: "text-embedding-ada-002",
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    const embedding = embeddingResponse.data.data[0].embedding;

    await index.upsert([
      {
        id: `doc-chunk-${i}`,
        values: embedding,
        metadata: { text: chunk },
      },
    ]);
  }
  console.log("Document chunks embedded and stored in Pinecone!");
}

embedAndStoreChunks().catch(console.error);
