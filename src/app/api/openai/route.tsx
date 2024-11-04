import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import axios from "axios";

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const { input }: any = await req.json();

    if (!input) {
      return NextResponse.json({ error: "No input provided" }, { status: 400 });
    }

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        messages: input,
        max_tokens: 50,
        model: "gpt-3.5-turbo",
        temperature: 1,
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
