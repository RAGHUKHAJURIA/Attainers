import fs from 'fs-extra';
import pdf from '../utils/pdfParser.js';
import path from 'path';

// pdf2pic + tesseract.js require system binaries (ImageMagick, Tesseract OCR)
// These are NOT available on Vercel serverless. OCR is disabled in production.
const IS_VERCEL = !!process.env.VERCEL;

export const extractText = async (filePath) => {
    try {
        const dataBuffer = await fs.readFile(filePath);
        const pdfData = await pdf(dataBuffer);
        const text = pdfData.text.trim();

        // Heuristic: If text is very short relative to page count, it likely scanned.
        const isScanned = text.length < (pdfData.numpages * 50);

        if (!isScanned) {
            console.log("PDF detected as Text-based.");
            return text;
        }

        // On Vercel (serverless), skip OCR — binaries are unavailable
        if (IS_VERCEL) {
            console.warn("Scanned PDF detected but OCR is unavailable on Vercel. Returning partial text.");
            return text || "This appears to be a scanned PDF. OCR is not supported in the cloud environment.";
        }

        console.log("PDF detected as Scanned. Starting OCR...");
        return await performOCR(filePath, pdfData.numpages);

    } catch (error) {
        console.error("Error in extractText:", error);
        throw error;
    }
};

const performOCR = async (filePath, numPages) => {
    // Dynamic imports so Vercel doesn't crash on module load
    const { fromPath } = await import('pdf2pic');
    const Tesseract = (await import('tesseract.js')).default;

    let combinedText = '';
    const tempDir = path.dirname(filePath);
    const baseName = path.basename(filePath, path.extname(filePath));

    const options = {
        density: 100,
        saveFilename: baseName,
        savePath: tempDir,
        format: "png",
        width: 800,
        height: 1100
    };

    const convert = fromPath(filePath, options);

    for (let page = 1; page <= numPages; page++) {
        try {
            console.log(`Processing page ${page}/${numPages}...`);
            const resolvePath = await convert(page, { responseType: "image" });
            const imagePath = resolvePath.path;

            const { data: { text } } = await Tesseract.recognize(imagePath, 'eng');
            combinedText += text + '\n\n';

            await fs.remove(imagePath);
        } catch (err) {
            console.error(`Error processing page ${page}:`, err);
        }
    }

    return combinedText;
};
