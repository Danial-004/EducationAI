import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    console.log("Chat Request received...");

    if (!process.env.GEMINI_API_KEY) {
        console.error("Error: GEMINI_API_KEY is missing in environment variables.");
        return NextResponse.json(
            { error: "Server configuration error: Missing API Key" },
            { status: 500 }
        );
    }

    try {
        const { messages, context, language = 'ru' } = await req.json();

        // Initialize Gemini with the API key
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        // Strictly use gemini-2.5-flash as requested by user
        const modelToUse = "gemini-3.0-flash";
        console.log(`Using model: ${modelToUse}`);

        const model = genAI.getGenerativeModel({ model: modelToUse });

        // Map language code to full language name
        const languageMap: Record<string, string> = {
            'en': 'English',
            'ru': 'Russian',
            'kz': 'Kazakh',
        };
        const languageName = languageMap[language] || 'Russian';

        const systemPrompt = `You are a friendly AI Tutor for the course '${context}'. 
        CRITICAL: Answer STRICTLY in ${languageName} language.
        - If language is 'kz', respond in Kazakh.
        - If language is 'ru', respond in Russian.
        - If language is 'en', respond in English.
        
        Use emojis to make the conversation engaging. 
        Keep your answers short, concise, and helpful. 
        If the user asks about something unrelated to the course, politely steer them back to the topic.
        REMEMBER: All responses must be in ${languageName}!`;

        const chatHistory = [
            {
                role: "user",
                parts: [{ text: systemPrompt }],
            },
            {
                role: "model",
                parts: [{ text: "Understood! I'm ready to help with the course. 🚀" }],
            },
            ...messages.slice(0, -1).map((msg: any) => ({
                role: msg.role === "user" ? "user" : "model",
                parts: [{ text: msg.content }],
            })),
        ];

        const lastUserMessage = messages[messages.length - 1].content;

        const chat = model.startChat({
            history: chatHistory,
        });

        console.log("Sending message to Gemini...");
        const result = await chat.sendMessage(lastUserMessage);
        const response = result.response.text();
        console.log("Gemini response received successfully.");

        return NextResponse.json({ response });
    } catch (error: any) {
        console.error("Gemini Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to generate response" },
            { status: 500 }
        );
    }
}
