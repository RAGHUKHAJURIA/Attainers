import { clerkClient } from "@clerk/express";

// Middleware: Protect Admin Route
export const protectAdminRoute = async (req, res, next) => {
    try {
        const { userId } = req.auth;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No user found."
            });
        }

        // Fetch user from Clerk
        const user = await clerkClient.users.getUser(userId);

        // Check if role is "admin"
        if (user.publicMetadata.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Forbidden: Admin access only."
            });
        }

        next(); // Allow admin to access
    } catch (error) {
        console.error("Admin middleware error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
