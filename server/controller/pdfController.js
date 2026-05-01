import fs from 'fs';
import { extractText } from '../services/ocrService.js';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI lazily
const getGenAI = () => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not set in environment variables");
    }
    return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
};

export const uploadPDF = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        const filePath = req.file.path;

        // 1. Extract Text from PDF (uses OCR for scanned PDFs)
        const extractedText = await extractText(filePath);

        if (!extractedText || extractedText.trim().length === 0) {
            fs.unlinkSync(filePath);
            return res.status(400).json({
                success: false,
                message: "Could not extract text from the PDF. Please try another file."
            });
        }

        // 2. Process with AI
        const genAI = getGenAI();
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
        You are an AI assistant that extracts multiple-choice questions from text.
        
        Extract the following data from the provided text and format it as a JSON array of objects:
        - questionText: The full question.
        - options: An array of 4 option strings.
        - correctOptionIndex: The index (0-3) of the correct option. If the correct answer is not explicitly provided in the text, you can leave this as 0 (we will edit it manually later).
        - explanation: A brief explanation if available, or generate a helpful one. If no explanation can be provided, leave as empty string.
        - marks: Default to 1.
        
        The Output must range be a valid JSON array. Do not include markdown formatting like \`\`\`json. Just the raw JSON.
        
        Text to process:
        ${extractedText}
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Clean up markdown if AI adds it
        const cleanedJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        let questions;
        try {
            questions = JSON.parse(cleanedJson);
        } catch (e) {
            console.error("AI JSON Parse Error:", e, responseText);
            // Verify if it's an array
            const match = cleanedJson.match(/\[.*\]/s);
            if (match) {
                questions = JSON.parse(match[0]);
            } else {
                throw new Error("Failed to parse AI response");
            }
        }

        // Cleanup file
        fs.unlinkSync(filePath);

        res.status(200).json({ success: true, data: questions });

    } catch (error) {
        console.error("Error processing PDF:", error);
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ success: false, message: "Failed to process PDF: " + error.message });
    }
};
