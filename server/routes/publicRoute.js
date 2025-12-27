import express from "express";
import { verifyWebhook, handleWebhook } from "../controller/youtube.js";

const router = express.Router();

// YouTube PubSubHubbub Webhook
// GET: Verification Challenge
router.get('/youtube/webhook', verifyWebhook);

// POST: Notification (Atom Feed)
// We need to ensure the body is parsed as string/buffer for xml2js in the controller
// We'll handle body parsing in server.js or here specifically
router.post('/youtube/webhook', handleWebhook);

export default router;
