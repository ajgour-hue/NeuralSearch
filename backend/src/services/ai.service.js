import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {
  HumanMessage,
  SystemMessage,
  AIMessage
} from "@langchain/core/messages";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatOpenAI } from "@langchain/openai";

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
});

const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

// OpenRouter model
const openrouterModel = new ChatOpenAI({
  model: "google/gemma-4-31b-it:free",

  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },

  apiKey: process.env.OPENROUTER_API_KEY,
});

// response
export async function generateResponse(messages) {

    const response = await geminiModel.invoke(messages.map(msg => {
        if (msg.role == "user") {
            return new HumanMessage(msg.content)
        } else if (msg.role == "ai") {
            return new AIMessage(msg.content)
        }
    }));

    return response.content;

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

  return response.content;
}