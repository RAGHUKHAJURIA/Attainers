import FreeCourse from "../models/freeCourseModel.js";
import axios from "axios";

// Helper: Extract Playlist ID
const extractPlaylistId = (url) => {
    console.log("Extracting ID from:", url);
    // Handle full URL
    const regExp = /[?&]list=([^#\&\?]+)/;
    const match = url.match(regExp);
    if (match) return match[1];

    // Handle raw ID (starts with PL, UU, FL, RD) or just a long string
    if (url.length > 10 && !url.includes('http')) return url;

    return null;
};

// Helper: Scrape Metadata
const scrapePlaylistMetadata = async (playlistId) => {
    try {
        const url = `https://www.youtube.com/playlist?list=${playlistId}`;
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        // 1. Try OG Tags
        const titleMatch = data.match(/<meta property="og:title" content="(.*?)"/);
        const imageMatch = data.match(/<meta property="og:image" content="(.*?)"/);

        let title = titleMatch ? titleMatch[1] : null;
        let thumbnail = imageMatch ? imageMatch[1] : null;

        // 2. Fallback: Find first video ID for thumbnail
        if (!thumbnail) {
            const videoIdMatch = data.match(/"videoId":"(.*?)"/);
            if (videoIdMatch && videoIdMatch[1]) {
                thumbnail = `https://i.ytimg.com/vi/${videoIdMatch[1]}/hqdefault.jpg`;
            }
        }

        // 3. Fallback: Title from <title>
        if (!title) {
            const titleTagMatch = data.match(/<title>(.*?) - YouTube<\/title>/);
            if (titleTagMatch) title = titleTagMatch[1];
        }

        // Decode HTML entities (Simple fallback)
        if (title) {
            title = title.replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'");
        }

        return { title, thumbnail };
    } catch (error) {
        console.error("Scraping error:", error.message);
        return { title: null, thumbnail: null };
    }
};

export const createFreeCourse = async (req, res) => {
    try {
        const { playlistUrl, description, category } = req.body;

        const playlistId = extractPlaylistId(playlistUrl);
        console.log("Extracted Playlist ID:", playlistId);

        if (!playlistId) {
            console.log("Failed to extract Playlist ID");
            return res.status(400).json({ success: false, message: "Invalid Playlist URL" });
        }

        // Check availability
        const existing = await FreeCourse.findOne({ playlistId });
        if (existing) {
            console.log("Course already exists for ID:", playlistId);
            return res.status(400).json({ success: false, message: "Course already exists" });
        }

        // Auto-detect metadata
        const { title, thumbnail } = await scrapePlaylistMetadata(playlistId);

        if (!title) {
            console.log("Failed to scrape title for ID:", playlistId);
            return res.status(400).json({
                success: false,
                message: "Could not auto-detect playlist title. Please check the URL."
            });
        }

        // Fallback thumbnail if detection fails
        const finalThumbnail = thumbnail || 'https://img.youtube.com/vi/placeholder/hqdefault.jpg'; // or a generic image

        const newCourse = await FreeCourse.create({
            title,
            description,
            playlistId,
            playlistLink: playlistUrl,
            thumbnail: finalThumbnail,
            category: category || 'General',
            isPublished: true
        });

        res.status(201).json({ success: true, course: newCourse });
    } catch (error) {
        console.error("Create Course Error:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

export const getFreeCourses = async (req, res) => {
    try {
        const courses = await FreeCourse.find({ isPublished: true }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, courses });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching courses" });
    }
};

export const deleteFreeCourse = async (req, res) => {
    try {
        const { id } = req.params;
        await FreeCourse.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Course deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting course" });
    }
};
