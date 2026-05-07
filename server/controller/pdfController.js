import fs from 'fs';
import path from 'path';
import os from 'os';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI lazily
const getGenAI = () => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not set in environment variables");
    }
    return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
};

export const uploadPDF = async (req, res) => {
    let tempFilePath = null;

    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        let extractedText = '';

        // On Vercel (memory storage), write buffer to /tmp then extract text
        if (req.file.buffer) {
            // Memory storage — write to temp file
            const tempDir = process.env.VERCEL ? '/tmp' : os.tmpdir();
            tempFilePath = path.join(tempDir, `pdf-${Date.now()}-${req.file.originalname}`);
            fs.writeFileSync(tempFilePath, req.file.buffer);

            // Lazy import to avoid crashing on Vercel if OCR binaries absent
            const { extractText } = await import('../services/ocrService.js');
            extractedText = await extractText(tempFilePath);

            // Cleanup temp file
            if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
            tempFilePath = null;
        } else if (req.file.path) {
            // Disk storage (local dev)
            const { extractText } = await import('../services/ocrService.js');
            extractedText = await extractText(req.file.path);
            if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        } else {
            return res.status(400).json({ success: false, message: "Unsupported upload mode" });
        }

        if (!extractedText || extractedText.trim().length === 0) {
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
        
        The Output must be a valid JSON array. Do not include markdown formatting like \`\`\`json. Just the raw JSON.
        
        Text to process:
        ${extractedText.substring(0, 15000)}
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
            const match = cleanedJson.match(/\[.*\]/s);
            if (match) {
                questions = JSON.parse(match[0]);
            } else {
                throw new Error("Failed to parse AI response");
            }
        }

        res.status(200).json({ success: true, data: questions });

    } catch (error) {
        console.error("Error processing PDF:", error);
        // Cleanup temp file on error
        if (tempFilePath && fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
        }
        if (req.file?.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ success: false, message: "Failed to process PDF: " + error.message });
    }
};
