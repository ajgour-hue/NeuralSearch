import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage,  SystemMessage,  AIMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { createAgent } from "langchain";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatOpenAI } from "@langchain/openai";
import * as z from "zod";
import { searchInternet } from "./internet.service.js";

// Gemini model
const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
});


// Mistral model
const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

// OpenRouter model
const openrouterModel = new ChatOpenAI({
  model: "nvidia/nemotron-3-ultra-550b-a55b:free",

  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },

  apiKey: process.env.OPEN_ROUTER_API,
});

// tool for web search
const searchTool =  tool(
  searchInternet,
  {
    name: "searchInternet",
    description: "Search the internet for recent information.",
    schema: z.object({
      query: z.string().describe("The search query to look up the internet."),
    }),
  }
)

// agent that uses the search tool and the mistral model
const agent = createAgent({ 
  model: mistralModel,
  tools: [searchTool],
})


// console.log("🔥 generateResponse called");

export async function generateResponse(messages) {
    console.log("Received messages:", messages);
    const response = await agent.invoke({
      messages: messages.map(msg => {
        if (msg.role == "user") {
            return new HumanMessage(msg.content)
        } else if (msg.role == "ai") {
            return new AIMessage(msg.content)
        }
      }),
    });

    console.log("🔥 Returning test markdown");
    return response.messages[response.messages.length - 1].content;
}

// title for the chat
export async function generateTitle(message) {
  const response = await mistralModel.invoke([
    new SystemMessage(`
You generate short, clear conversation titles.

Rules:
- Maximum 6 words
- Do not use quotes
- Do not use punctuation unless necessary
- Return only the title
- Make the title specific and meaningful
- Avoid generic titles like "New Chat" or "Conversation"
    `),

    new HumanMessage(`
Generate a concise conversation title for this message:

${message}
    `),
  ]);

  
    console.log("Gemini Response:", response);
console.log("Content:", response.content);
console.log("Type:", typeof response.content);

  return response.content;
}