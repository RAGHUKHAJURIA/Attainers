import YouTube from "../models/youtubeModel.js";
import axios from "axios";
import xml2js from "xml2js";

/* =====================================================
   HELPERS
===================================================== */

const extractVideoId = (url) => {
    const regExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]{11}).*/;
    const match = url.match(regExp);
    return match ? match[2] : null;
};

const getVideoThumbnail = (videoId) =>
    `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

/* =====================================================
   1. SYNC LATEST 15 VIDEOS (RSS + NO SHORTS)
===================================================== */

export const syncYouTubeVideos = async (req, res) => {
    try {
        const { channelId } = req.body;
        if (!channelId) {
            return res.status(400).json({
                success: false,
                message: "Channel ID is required"
            });
        }

        const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
        const response = await axios.get(FEED_URL);

        const parser = new xml2js.Parser({ explicitArray: false });
        const feed = await parser.parseStringPromise(response.data);

        if (!feed?.feed?.entry) {
            return res.status(200).json({
                success: true,
                message: "No videos found"
            });
        }

        let entries = Array.isArray(feed.feed.entry)
            ? feed.feed.entry
            : [feed.feed.entry];

        // 🔥 Latest first
        entries.sort(
            (a, b) => new Date(b.published) - new Date(a.published)
        );

        const latest15 = entries.slice(0, 15);

        let keptIds = [];
        let added = 0;
        let updated = 0;

        for (const video of latest15) {
            const videoId = video["yt:videoId"];
            const title = video.title;
            const publishedAt = new Date(video.published);

            const mediaGroup = video["media:group"];
            const description =
                typeof mediaGroup?.["media:description"] === "string"
                    ? mediaGroup["media:description"]
                    : title;

            // ❌ Shorts filter (Heuristic + Strict HTTP Check)
            // 1. Check title/description 
            if (title.toLowerCase().includes("#shorts") || title.toLowerCase().includes("#short")) continue;

            // 2. Strict HTTP Check (The only 100% reliable way)
            // If it returns 200 on /shorts/ URL, it IS a short. 
            // If it redirects (303/302) to /watch, it is a VIDEO.
            try {
                const shortCheckUrl = `https://www.youtube.com/shorts/${videoId}`;
                const shortCheckRes = await axios.head(shortCheckUrl, {
                    maxRedirects: 0,
                    validateStatus: (status) => status >= 200 && status < 400
                });

                if (shortCheckRes.status === 200) {
                    continue; // It's a Short
                }
            } catch (err) {
                // If network fails, we proceed, but log it.
                console.error(`Short check failed for ${videoId}:`, err.message);
            }

            keptIds.push(videoId);

            const thumbnail = getVideoThumbnail(videoId);
            const existing = await YouTube.findOne({ videoId });

            if (existing) {
                existing.title = title;
                existing.description = description;
                existing.thumbnail = thumbnail;
                // Update date only if it seems wrong, or just trusting feed is generally better
                existing.publishedAt = publishedAt;
                existing.isPublished = true;
                await existing.save();
                updated++;
            } else {
                await YouTube.create({
                    title,
                    description,
                    videoId,
                    thumbnail,
                    category: "general",
                    tags: [],
                    isFeatured: false,
                    isPublished: true,
                    views: 0,
                    publishedAt
                });
                added++;
            }
        }

        // Keep ONLY latest 15
        const deleted = await YouTube.deleteMany({
            videoId: { $nin: keptIds }
        });

        res.status(200).json({
            success: true,
            added,
            updated,
            deleted: deleted.deletedCount
        });
    } catch (error) {
        console.error("Sync error:", error);
        res.status(500).json({
            success: false,
            message: "Sync failed",
            error: error.message
        });
    }
};

/* =====================================================
   2. WEBHOOK VERIFY (GET)
===================================================== */

export const verifyWebhook = (req, res) => {
    const hubMode = req.query["hub.mode"];
    const hubChallenge = req.query["hub.challenge"];

    if (hubMode === "subscribe" || hubMode === "unsubscribe") {
        return res.status(200).send(hubChallenge);
    }

    return res.status(400).send("Invalid webhook verification");
};

/* =====================================================
   3. WEBHOOK HANDLER (POST)
===================================================== */

export const handleWebhook = async (req, res) => {
    try {
        const xmlData = req.body;

        const parser = new xml2js.Parser({ explicitArray: false });
        const result = await parser.parseStringPromise(xmlData);

        if (!result?.feed?.entry) {
            return res.status(200).send("No entries");
        }

        const entries = Array.isArray(result.feed.entry)
            ? result.feed.entry
            : [result.feed.entry];

        for (const video of entries) {
            const videoId = video["yt:videoId"];
            const title = video.title;
            const publishedAt = new Date(video.published);

            const mediaGroup = video["media:group"];
            const duration = parseInt(
                mediaGroup?.["media:content"]?.["$"]?.duration || 0
            );

            // ❌ Skip Shorts
            if (duration > 0 && duration <= 60) continue;

            const exists = await YouTube.findOne({ videoId });
            if (!exists) {
                await YouTube.create({
                    title,
                    description: title,
                    videoId,
                    thumbnail: getVideoThumbnail(videoId),
                    category: "general",
                    isPublished: true,
                    views: 0,
                    publishedAt
                });

                console.log("Webhook added:", title);
            }
        }

        return res.status(200).send("OK");
    } catch (error) {
        console.error("Webhook error:", error);
        return res.status(200).send("Handled");
    }
};

/* =====================================================
   4. GET VIDEOS (LATEST FIRST)
===================================================== */

export const getAllYouTubeVideos = async (req, res) => {
    try {
        const { page = 1, limit = 15 } = req.query;

        const videos = await YouTube.find({ isPublished: true })
            .sort({ publishedAt: -1 })
            .limit(Number(limit))
            .skip((page - 1) * limit);

        const total = await YouTube.countDocuments({ isPublished: true });

        res.status(200).json({
            success: true,
            videos,
            total
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Fetch failed",
            error: error.message
        });
    }
};

/* =====================================================
   5. RESTORED CRUD & SUBSCRIPTION (REQUIRED BY ADMIN ROUTE)
===================================================== */

export const getYouTubeVideoById = async (req, res) => {
    try {
        const { id } = req.params;
        const video = await YouTube.findById(id);
        if (!video) return res.status(404).json({ success: false, message: "Video not found" });
        res.status(200).json({ success: true, video });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching video", error: error.message });
    }
};

export const updateYouTubeVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const video = await YouTube.findByIdAndUpdate(id, updateData, { new: true });
        if (!video) return res.status(404).json({ success: false, message: "Video not found" });
        res.status(200).json({ success: true, message: "Video updated", video });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating video", error: error.message });
    }
};

export const subscribeToYouTubeHub = async (channelId) => {
    const callbackUrl = process.env.YOUTUBE_WEBHOOK_CALLBACK_URL;
    const topicUrl = `https://www.youtube.com/xml/feeds/videos.xml?channel_id=${channelId}`;
    const hubUrl = 'https://pubsubhubbub.appspot.com/subscribe';

    if (!callbackUrl) throw new Error("Missing YOUTUBE_WEBHOOK_CALLBACK_URL");

    const params = new URLSearchParams();
    params.append('hub.callback', callbackUrl);
    params.append('hub.mode', 'subscribe');
    params.append('hub.topic', topicUrl);

    await axios.post(hubUrl, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return true;
};

export const subscribeToFeed = async (req, res) => {
    try {
        const { channelId } = req.body;
        await subscribeToYouTubeHub(channelId);
        res.status(200).json({ success: true, message: "Subscription request sent" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Subscription failed", error: error.message });
    }
};
