import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import { Pinecone } from "@pinecone-database/pinecone";

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_INDEX_NAME = "gmaps-finder";

const pinecone = new Pinecone({
  apiKey: PINECONE_API_KEY || "",
});

const pineconeIndex = pinecone.Index(PINECONE_INDEX_NAME);

async function fetchRelevantChunks(query: string): Promise<string[]> {
  const embeddingResponse = await axios.post(
    "https://api.openai.com/v1/embeddings",
    {
      input: query,
      model: "text-embedding-ada-002",
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
    }
  );

  const queryEmbedding: number[] = embeddingResponse.data.data[0].embedding;

  const queryResponse = await pineconeIndex.query({
    vector: queryEmbedding,
    topK: 5,
    includeMetadata: true,
  });

  return queryResponse.matches
    .map((match) =>
      match.metadata && "text" in match.metadata
        ? match.metadata.text
        : undefined
    )
    .filter((text): text is string => text !== undefined);
}

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
      return NextResponse.json(
        {
          error:
            "Invalid input: Input should be an object with a non-empty content string.",
        },
        { status: 400 }
      );
    }

    const relevantChunks = await fetchRelevantChunks(input.content);

    const prompt = `
    The user asked: "${input.content}"
    Use the following context to answer:

    ${relevantChunks.join("\n\n")}

    Answer the question based on the context provided above.
  `;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150,
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
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Error occurred:", error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error("Error occurred:", error.message);
    } else {
      console.error("Error occurred:", error);
    }

    return new NextResponse(
      JSON.stringify({ error: "Error processing request" }),
      { status: 500 }
    );
  }
}
