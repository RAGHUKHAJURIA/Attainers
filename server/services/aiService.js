import OpenAI from "openai";

// Lazy init to avoid startup crash if key missing
let openai;
const getOpenAI = () => {
    if (!openai) {
        if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is missing!");
        openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
    return openai;
};

export const parseQuestionsWithAI = async (text) => {
    const client = getOpenAI();

    const prompt = `
    You are an AI assistant that extracts multiple-choice questions from educational text.
    
    Extract questions from the following text and return a JSON array.
    Each object in the array must match this schema:
    {
      "questionText": "The question string",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctOptionIndex": 0, // 0 for A, 1 for B, etc.
      "explanation": "Brief explanation",
      "marks": 1
    }

    Rules:
    - If correct answer is not explicitly marked, infer it if possible, otherwise set index to -1.
    - Ensure strict JSON format. No markdown code blocks.
    - Only return the JSON array.

    Text:
    ${text.substring(0, 15000)} // Limit context window if needed
    `;

    try {
        const completion = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a helpful assistant that outputs raw JSON." },
                { role: "user", content: prompt }
            ],
            temperature: 0.2,
        });

        const rawContent = completion.choices[0].message.content;
        const cleanJson = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(cleanJson);
    } catch (error) {
        console.error("AI Parsing Error:", error);
        throw new Error("Failed to parse text with AI.");
    }
};
