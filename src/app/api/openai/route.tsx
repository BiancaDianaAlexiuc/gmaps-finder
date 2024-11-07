import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

// Define custom responses
const customResponses: Record<string, string> = {
  "how can i login?":
    "To log in, click the Get Started button on the center and choose from social media login (Facebook / Google) or with email and password.",
  "how to login?":
    "To log in, click the Get Started button on the center and choose from social media login (Facebook / Google) or with email and password.",
};

export async function POST(req: NextRequest) {
  try {
    const requestBody = await req.json();
    const input = requestBody?.input;

    if (
      !input ||
      typeof input !== "object" ||
      input.role !== "user" ||
      typeof input.content !== "string" ||
      !input.content.trim()
    ) {
      console.log("Invalid input received:", input);
      return NextResponse.json(
        {
          error:
            "Invalid input: Input should be an object with a non-empty content string.",
        },
        { status: 400 }
      );
    }

    const normalizedContent = input.content.toLowerCase().trim();

    const customResponse = customResponses[normalizedContent];
    if (customResponse) {
      return NextResponse.json({ output: customResponse });
    }

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        messages: [{ role: "user", content: input.content }],
        max_tokens: 50,
        model: "gpt-4",
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    const output =
      response.data.choices[0]?.message?.content?.trim() ||
      "Sorry, I do not understand.";

    return NextResponse.json({ output });
  } catch (error: any) {
    console.error(
      "Error occurred:",
      error.response?.data || error.message || error
    );
    return new NextResponse(
      JSON.stringify({ error: "Error processing request" }),
      { status: 500 }
    );
  }
}
