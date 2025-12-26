import Table from "../models/tableModel.js";

export const createTable = async (req, res) => {
    try {
        const { title, description, category, data, headers, source } = req.body;

        const table = new Table({
            title,
            description,
            category,
            data: data || [],
            headers: headers || [],
            source
        });

        await table.save();

        res.status(201).json({
            success: true,
            message: "Table created successfully!",
            table
        });
    } catch (error) {
        console.error("Error creating table:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong!",
            error: error.message,
        });
    }
};

export const getAllTables = async (req, res) => {
    try {
        const { category, page = 1, limit = 10 } = req.query;
        const query = { isPublished: true };

        if (category) {
            query.category = category;
        }

        const tables = await Table.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Table.countDocuments(query);

        res.status(200).json({
            success: true,
            tables,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error("Error fetching tables:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong!",
            error: error.message,
        });
    }
};

export const getTableById = async (req, res) => {
    try {
        const { id } = req.params;
        const table = await Table.findById(id);

        if (!table) {
            return res.status(404).json({
                success: false,
                message: "Table not found"
            });
        }

        res.status(200).json({
            success: true,
            table
        });
    } catch (error) {
        console.error("Error fetching table:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong!",
            error: error.message,
        });
    }
};

export const updateTable = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const table = await Table.findByIdAndUpdate(id, updateData, { new: true });

        if (!table) {
            return res.status(404).json({
                success: false,
                message: "Table not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Table updated successfully!",
            table
        });
    } catch (error) {
        console.error("Error updating table:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong!",
            error: error.message,
        });
    }
};

export const deleteTable = async (req, res) => {
    try {
        const { id } = req.params;
        const table = await Table.findByIdAndDelete(id);

        if (!table) {
            return res.status(404).json({
                success: false,
                message: "Table not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Table deleted successfully!"
        });
    } catch (error) {
        console.error("Error deleting table:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong!",
            error: error.message,
        });
    }
};

