import express from 'express';
import { protectAdminRoute } from '../middleware/clerkMiddleware.js';
import { uploadMemory } from '../middleware/uploadMemory.js';
import { parsePdfWithAI, approveTest } from '../controller/agentController.js';

const router = express.Router();

/**
 * POST /api/agent/parse-pdf
 * Admin-only. Accepts a PDF + prompt, calls Gemini, returns MCQ preview.
 *
 * Middleware chain:
 *   protectAdminRoute  → validates Clerk JWT + checks admin role
 *   uploadMemory       → stores PDF in memory buffer (no disk write)
 *   parsePdfWithAI     → controller handler
 */
router.post(
    '/parse-pdf',
    protectAdminRoute,
    uploadMemory.single('file'),
    parsePdfWithAI
);

/**
 * POST /api/agent/approve-test
 * Admin-only. Converts AI-generated draft into a real MockTest in MongoDB.
 *
 * Body: { draft: { title, questions[] }, metadata: { examName, testType, difficulty, duration, negativeMarks } }
 */
router.post(
    '/approve-test',
    protectAdminRoute,
    approveTest
);

export default router;
