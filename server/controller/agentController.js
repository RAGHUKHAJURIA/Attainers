import MockTest from '../models/mockTestModel.js';
import { extractMCQs } from '../services/geminiService.js';

const validateAndCleanQuestions = (aiResponse) => {
  // 1. Check structure
  if (!aiResponse.title || !Array.isArray(aiResponse.questions)) {
    throw new Error('Invalid AI response structure');
  }

  // 2. Filter and validate questions (existing logic)
  const validQuestions = aiResponse.questions.filter(q => {
    return (
      q.question && 
      q.question.trim() !== '' &&
      Array.isArray(q.options) && 
      q.options.length >= 2 &&
      q.options.every(opt => opt && opt.trim() !== '')
    );
  });

  if (validQuestions.length === 0) {
    throw new Error('No valid questions found in PDF');
  }

  // 3. Remove duplicates (existing logic)
  const uniqueQuestions = [];
  const seenQuestions = new Set();

  for (const q of validQuestions) {
    const normalized = q.question.toLowerCase().trim();
    if (!seenQuestions.has(normalized)) {
      seenQuestions.add(normalized);
      uniqueQuestions.push({
        question: q.question.trim(),
        options: q.options.map(opt => opt.trim()),
        answer: q.answer ? q.answer.trim() : ''
      });
    }
  }

  // ✨ 4. NEW: Validate and clean metadata
  const cleanMetadata = {
    subject: aiResponse.metadata?.subject || '',
    examName: aiResponse.metadata?.examName || 'General',
    year: aiResponse.metadata?.year ? Number(aiResponse.metadata.year) : null,
    month: aiResponse.metadata?.month || '',
    timePeriod: aiResponse.metadata?.timePeriod || '',
    testType: aiResponse.metadata?.testType || 'practice',
    difficulty: aiResponse.metadata?.difficulty || 'medium',
    duration: aiResponse.metadata?.duration || Math.ceil(uniqueQuestions.length * 1.5),
    tags: Array.isArray(aiResponse.metadata?.tags) ? aiResponse.metadata.tags : []
  };

  // ✨ 5. NEW: Validate category
  const validCategories = ['subject', 'current-affairs', 'pyq', 'exam-specific', 'practice', 'general'];
  const category = validCategories.includes(aiResponse.category) ? aiResponse.category : 'general';

  return {
    title: aiResponse.title.trim(),
    questions: uniqueQuestions,
    metadata: cleanMetadata,
    category: category
  };
};

export const parsePdfWithAI = async (req, res) => {
  try {
    if (!req.body.prompt || req.body.prompt.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: 'Prompt is required' 
      });
    }

    if (req.file) {
      if (req.file.mimetype !== 'application/pdf') {
        return res.status(400).json({ 
          success: false, 
          message: 'Only PDF files are allowed' 
        });
      }

      if (req.file.size > 10 * 1024 * 1024) {
        return res.status(400).json({ 
          success: false, 
          message: 'PDF file size must not exceed 10MB' 
        });
      }
    }

    // Convert PDF buffer to base64 if it exists
    const pdfBase64 = req.file ? req.file.buffer.toString('base64') : null;
    
    // Send to Gemini service
    const aiResponse = await extractMCQs(pdfBase64, req.body.prompt);

    // Validate and clean response
    const validatedData = validateAndCleanQuestions(aiResponse);

    // ✨ NEW: Return with metadata for routing
    res.json({
      success: true,
      preview: {
        title: validatedData.title,
        questions: validatedData.questions
      },
      metadata: validatedData.metadata || {}, // ✨ AI-classified metadata
      category: validatedData.category || 'general' // ✨ AI-detected category
    });

  } catch (error) {
    console.error('AI Parse Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process PDF with AI'
    });
  }
};

export const approveTest = async (req, res) => {
  try {
    const { draft, metadata, category } = req.body;

    // 1. Validate draft structure
    if (!draft || !draft.title || !Array.isArray(draft.questions)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid draft data'
      });
    }

    if (draft.questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot create test with zero questions'
      });
    }

    // ✨ 3. NEW: Determine collection/field based on category
    let additionalFields = {};
    let collectionHint = 'General Tests'; // For response message

    switch (category) {
      case 'subject':
        additionalFields = {
          subject: metadata.subject || 'General',
          examName: metadata.examName || 'General',
          tags: metadata.tags || []
        };
        collectionHint = `${metadata.subject || 'General'} Tests`;
        break;

      case 'current-affairs':
        additionalFields = {
          testType: 'current-affairs',
          timePeriod: metadata.timePeriod || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          year: metadata.year || new Date().getFullYear(),
          tags: ['Current Affairs', ...(metadata.tags || [])]
        };
        if (metadata.month) {
            // Capitalize first letter to match Enum: ['January', 'February', ...]
            const formattedMonth = metadata.month.charAt(0).toUpperCase() + metadata.month.slice(1).toLowerCase();
            const validMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            if (validMonths.includes(formattedMonth)) {
                additionalFields.month = formattedMonth;
            }
        }
        collectionHint = 'Current Affairs';
        break;

      case 'pyq':
        additionalFields = {
          testType: 'pyq',
          year: metadata.year || new Date().getFullYear(),
          examName: metadata.examName || 'General',
          tags: ['PYQ', ...(metadata.tags || [])]
        };
        collectionHint = `${metadata.year || ''} PYQs`;
        break;

      case 'exam-specific':
        additionalFields = {
          examName: metadata.examName || 'General',
          testType: metadata.testType || 'practice',
          tags: [metadata.examName, ...(metadata.tags || [])]
        };
        collectionHint = `${metadata.examName} Tests`;
        break;

      case 'practice':
        additionalFields = {
          testType: 'practice',
          tags: ['Practice', ...(metadata.tags || [])]
        };
        collectionHint = 'Practice Tests';
        break;

      default:
        // General category
        additionalFields = {
          testType: metadata.testType || 'practice'
        };
        collectionHint = 'General Tests';
    }

    // Normalize difficulty for Mongoose enum matching ('Easy', 'Medium', 'Hard')
    const normalizeDifficulty = (diff) => {
        const map = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };
        if (!diff) return 'Medium';
        return map[diff.toLowerCase()] || diff || 'Medium';
    };

    // Normalize testType to match Mongoose enum if needed. 
    // Mongoose enum: ['mock-test', 'practice', 'subject-wise', 'exam-wise', 'pyq', 'current-affairs']
    // Convert 'full-length' to 'mock-test' because the model doesn't allow 'full-length' natively in testType
    let finalTestType = additionalFields.testType || metadata.testType || 'practice';
    if (finalTestType === 'full-length') finalTestType = 'mock-test';
    
    // Convert 'subject' mapping issue in their code to the model enum
    if (category === 'subject') {
        finalTestType = 'subject-wise';
    } else if (category === 'exam-specific') {
        finalTestType = 'exam-wise';
    }
    
    additionalFields.testType = finalTestType;

    // 4. Transform AI format to MockTest schema format
    const mockTestData = {
      title: draft.title,
      examName: metadata.examName || 'General',
      testType: additionalFields.testType,
      difficulty: normalizeDifficulty(metadata.difficulty),
      duration: metadata.duration || 60,
      negativeMarks: metadata.negativeMarks || 0,
      totalQuestions: draft.questions.length,
      isPublished: true, // Auto-publish so it shows up immediately
      
      // ✨ NEW: Merge additional category-specific fields
      ...additionalFields,
      
      questions: draft.questions.map(q => {
        // Find correct option index
        const correctIndex = q.options.findIndex(
          opt => opt.toLowerCase() === q.answer.toLowerCase()
        );

        return {
          questionText: q.question,
          options: q.options.map((optText, idx) => ({
            text: optText,
            isCorrect: idx === correctIndex
          })),
          explanation: '', // Can be filled manually later
          marks: 1
        };
      })
    };

    // 5. Save to database
    const newTest = await MockTest.create(mockTestData);

    // ✨ 6. NEW: Enhanced response with routing info
    res.json({
      success: true,
      message: `Mock test created successfully in ${collectionHint}`,
      testId: newTest._id,
      category: category,
      location: collectionHint,
      metadata: {
        subject: additionalFields.subject,
        examName: mockTestData.examName,
        testType: mockTestData.testType,
        tags: additionalFields.tags
      }
    });

  } catch (error) {
    console.error('Test creation error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
          success: false,
          message: `Validation error: ${error.message}`,
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create test'
    });
  }
};
