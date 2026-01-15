import MockTest from "../models/mockTestModel.js";

// Create a new Mock Test
export const createMockTest = async (req, res) => {
    try {

        const { title, examName, difficulty, duration, totalQuestions, description, negativeMarks } = req.body;

        const newTest = new MockTest({
            title,
            examName,
            difficulty,
            duration,
            totalQuestions,
            description,
            negativeMarks: negativeMarks || 0
        });

        const savedTest = await newTest.save();

        res.status(201).json(savedTest);
    } catch (error) {
        console.error("Error creating mock test:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get all Mock Tests
export const getAllMockTests = async (req, res) => {
    try {
        const tests = await MockTest.find().sort({ createdAt: -1 });
        res.status(200).json(tests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single Mock Test by ID (Admin)
export const getMockTestById = async (req, res) => {
    try {
        const test = await MockTest.findById(req.params.id);
        if (!test) return res.status(404).json({ message: "Mock Test not found" });
        res.status(200).json(test);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single Mock Test by ID (Public) - Increments view count
export const getPublicMockTestById = async (req, res) => {
    try {
        const test = await MockTest.findByIdAndUpdate(
            req.params.id,
            { $inc: { viewCount: 1 } },
            { new: true }
        );
        if (!test) return res.status(404).json({ message: "Mock Test not found" });
        res.status(200).json(test);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Mock Test
export const updateMockTest = async (req, res) => {
    try {
        const updatedTest = await MockTest.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedTest) return res.status(404).json({ message: "Mock Test not found" });
        res.status(200).json(updatedTest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Mock Test
export const deleteMockTest = async (req, res) => {
    try {
        const deletedTest = await MockTest.findByIdAndDelete(req.params.id);
        if (!deletedTest) return res.status(404).json({ message: "Mock Test not found" });
        res.status(200).json({ message: "Mock Test deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add Questions to Mock Test
export const addQuestions = async (req, res) => {
    try {



        const { questions } = req.body;
        const test = await MockTest.findById(req.params.id);

        if (!test) {

            return res.status(404).json({ message: "Mock Test not found" });
        }

        if (questions && Array.isArray(questions)) {
            test.questions.push(...questions);
        } else {

        }

        const updatedTest = await test.save();

        res.status(200).json(updatedTest);
    } catch (error) {
        console.error("Error adding questions:", error); // Log full error object
        console.error("Error Stack:", error.stack);
        // Return detailed validation error if available
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: "Validation Error", details: error.message });
        }
        res.status(500).json({ message: error.message, stack: error.stack });
    }
};
