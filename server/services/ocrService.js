import fs from 'fs-extra';
import pdf from '../utils/pdfParser.js';
import { fromPath } from 'pdf2pic';
import Tesseract from 'tesseract.js';
import path from 'path';

export const extractText = async (filePath) => {
    try {
        const dataBuffer = await fs.readFile(filePath);
        const pdfData = await pdf(dataBuffer);
        const text = pdfData.text.trim();

        // Heuristic: If text is very short relative to page count, it likely scanned.
        // e.g. < 50 chars per page on average
        const isScanned = text.length < (pdfData.numpages * 50);

        if (!isScanned) {
            console.log("PDF detected as Text-based.");
            return text;
        }

        console.log("PDF detected as Scanned. Starting OCR...");
        return await performOCR(filePath, pdfData.numpages);

    } catch (error) {
        console.error("Error in extractText:", error);
        throw error;
    }
};

const performOCR = async (filePath, numPages) => {
    let combinedText = '';
    const tempDir = path.dirname(filePath);
    const baseName = path.basename(filePath, path.extname(filePath));

    // Configure pdf2pic
    const options = {
        density: 100,
        saveFilename: baseName,
        savePath: tempDir,
        format: "png",
        width: 800,
        height: 1100
    };

    // Note: pdf2pic requires GraphicsMagick/ImageMagick installed on system
    const convert = fromPath(filePath, options);

    for (let page = 1; page <= numPages; page++) {
        try {
            console.log(`Processing page ${page}/${numPages}...`);
            // Convert page to image
            const resolvePath = await convert(page, { responseType: "image" });
            const imagePath = resolvePath.path;

            // OCR with Tesseract.js
            const { data: { text } } = await Tesseract.recognize(imagePath, 'eng');
            combinedText += text + '\n\n';

            // Cleanup image
            await fs.remove(imagePath);
        } catch (err) {
            console.error(`Error processing page ${page}:`, err);
        }
    }

    return combinedText;
};
