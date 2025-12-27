import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useUser, useAuth } from '@clerk/clerk-react';

// Status Constants
const STATUS = {
    NOT_VISITED: 'not-visited',
    NOT_ANSWERED: 'not-answered',
    ANSWERED: 'answered',
    MARKED_FOR_REVIEW: 'review',
    ANSWERED_AND_MARKED: 'ans-review'
};

const DUMMY_QUESTIONS = [
    {
        _id: 'd1',
        questionText: "The arithmetic mean of the 5 consecutive integers starting with 's' is 'a'. What is the arithmetic mean of 9 consecutive integers that start with s + 2?",
        options: [{ text: "78", isCorrect: false }, { text: "58", isCorrect: true }, { text: "68", isCorrect: false }, { text: "98", isCorrect: false }],
        marks: 1
    },
    {
        _id: 'd2',
        questionText: "Which of the following numbers is divisible by 11?",
        options: [{ text: "4823718", isCorrect: false }, { text: "8423718", isCorrect: false }, { text: "8432718", isCorrect: false }, { text: "4832718", isCorrect: true }],
        marks: 1
    },
    {
        _id: 'd3',
        questionText: "If a = 2b and b = 4c, what is the value of a in terms of c?",
        options: [{ text: "8c", isCorrect: true }, { text: "4c", isCorrect: false }, { text: "2c", isCorrect: false }, { text: "6c", isCorrect: false }],
        marks: 1
    },
    {
        _id: 'd4',
        questionText: "A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?",
        options: [{ text: "120 metres", isCorrect: false }, { text: "180 metres", isCorrect: false }, { text: "324 metres", isCorrect: false }, { text: "150 metres", isCorrect: true }],
        marks: 1
    },
    {
        _id: 'd5',
        questionText: "Find the compound interest on Rs. 10,000 in 2 years at 4% per annum, the interest being compounded half-yearly.",
        options: [{ text: "Rs. 636.80", isCorrect: false }, { text: "Rs. 824.32", isCorrect: true }, { text: "Rs. 912.86", isCorrect: false }, { text: "Rs. 828.82", isCorrect: false }],
        marks: 1
    }
];

const MockTestDetailPage = () => {
    const { id } = useParams();
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const [test, setTest] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    // Test Taking State
    const [isTestActive, setIsTestActive] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({}); // { questionId: optionIndex }
    const [questionStatus, setQuestionStatus] = useState({}); // { questionId: STATUS }
    const [timeLeft, setTimeLeft] = useState(0); // in seconds

    // Admin Add Form State
    const [questionText, setQuestionText] = useState('');
    const [options, setOptions] = useState([{ text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }]);
    const [explanation, setExplanation] = useState('');
    const [marks, setMarks] = useState(1);
    const [showAddQuestion, setShowAddQuestion] = useState(false);

    // Score Modal State
    const [showScoreModal, setShowScoreModal] = useState(false);
    const [scoreData, setScoreData] = useState({ score: 0, totalQuestions: 0, answered: 0, correct: 0, wrong: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoaded && user) {
            setIsAdmin(user.publicMetadata?.role === 'admin');
        }
    }, [isLoaded, user]);

    useEffect(() => {
        fetchTestDetails();
    }, [id]);

    useEffect(() => {
        let timer;
        if (isTestActive && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        calculateAndSubmit();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isTestActive, timeLeft]);

    const fetchTestDetails = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/mock-tests/${id}`);
            if (response.ok) {
                const data = await response.json();

                // Inject dummy data if no questions
                if (!data.questions || data.questions.length === 0) {
                    data.questions = DUMMY_QUESTIONS;
                }

                setTest(data);
                setTimeLeft(data.duration * 60); // Set timer based on duration

                // Auto-start test for students (or everyone as requested)
                // Note: We might want to keep the overview for Admins, but the request was "direct this window will appear"
                // For now, I'll auto-start it.
                startTest(data);
            }
        } catch (error) {
            console.error('Error fetching test details:', error);
        } finally {
            setLoading(false);
        }
    };

    // --- Admin Handlers ---
    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index].text = value;
        setOptions(newOptions);
    };

    const handleCorrectOptionChange = (index) => {
        const newOptions = options.map((opt, i) => ({ ...opt, isCorrect: i === index }));
        setOptions(newOptions);
    };

    const handleAddQuestion = async (e) => {
        e.preventDefault();
        try {
            const token = await getToken();
            const questionData = { questionText, options, explanation, marks };
            const payload = { questions: [questionData] };

            const response = await fetch(`http://localhost:5000/api/admin/mock-tests/${id}/questions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert('Question added successfully!');
                setQuestionText('');
                setOptions([{ text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }]);
                setExplanation('');
                setShowAddQuestion(false);
                fetchTestDetails();
            }
        } catch (error) {
            console.error('Error adding question:', error);
        }
    };

    // --- Test Taking Handlers ---
    const startTest = (testData = test) => {
        if (!testData) return;
        setIsTestActive(true);
        // Initialize status
        const initialStatus = {};
        testData.questions.forEach(q => {
            initialStatus[q._id] = STATUS.NOT_VISITED;
        });
        if (testData.questions.length > 0) {
            initialStatus[testData.questions[0]._id] = STATUS.NOT_ANSWERED;
        }
        setQuestionStatus(initialStatus);
    };

    const handleAnswerSelect = (optionIndex) => {
        const currentQ = test.questions[currentQuestionIndex];
        setAnswers({ ...answers, [currentQ._id]: optionIndex });
        updateStatus(currentQ._id, STATUS.ANSWERED);
    };

    const updateStatus = (qId, status) => {
        setQuestionStatus(prev => ({ ...prev, [qId]: status }));
    };

    const handleNext = () => {
        const currentQ = test.questions[currentQuestionIndex];
        // If currently not answered and moving away, mark as not answered (red) if it was not-visited
        if (answers[currentQ._id] === undefined && questionStatus[currentQ._id] === STATUS.NOT_VISITED) {
            updateStatus(currentQ._id, STATUS.NOT_ANSWERED);
        }

        if (currentQuestionIndex < test.questions.length - 1) {
            const nextIndex = currentQuestionIndex + 1;
            setCurrentQuestionIndex(nextIndex);

            // Mark next as visited/not answered if fresh
            const nextQ = test.questions[nextIndex];
            if (questionStatus[nextQ._id] === STATUS.NOT_VISITED) { // Only change if fresh
                updateStatus(nextQ._id, STATUS.NOT_ANSWERED);
            }
        } else {
            // Last Question - Submit
            calculateAndSubmit();
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleMarkForReview = () => {
        const currentQ = test.questions[currentQuestionIndex];
        if (answers[currentQ._id] !== undefined) {
            updateStatus(currentQ._id, STATUS.ANSWERED_AND_MARKED);
        } else {
            updateStatus(currentQ._id, STATUS.MARKED_FOR_REVIEW);
        }
        if (currentQuestionIndex < test.questions.length - 1) {
            handleNext();
        }
    };

    const clearResponse = () => {
        const currentQ = test.questions[currentQuestionIndex];
        const newAnswers = { ...answers };
        delete newAnswers[currentQ._id];
        setAnswers(newAnswers);
        updateStatus(currentQ._id, STATUS.NOT_ANSWERED);
    };

    const handlePaletteClick = (index) => {
        const currentQ = test.questions[currentQuestionIndex];
        // Update status of current before leaving
        if (answers[currentQ._id] === undefined && questionStatus[currentQ._id] === STATUS.NOT_VISITED) {
            updateStatus(currentQ._id, STATUS.NOT_ANSWERED);
        }

        setCurrentQuestionIndex(index);
        const targetQ = test.questions[index];
        if (questionStatus[targetQ._id] === STATUS.NOT_VISITED) {
            updateStatus(targetQ._id, STATUS.NOT_ANSWERED);
        }
    };

    const calculateAndSubmit = () => {
        setIsTestActive(false);
        let score = 0;
        let correct = 0;
        let wrong = 0;
        let answered = 0;

        test.questions.forEach(q => {
            const userAnswerIndex = answers[q._id];
            if (userAnswerIndex !== undefined) {
                answered++;
                const correctOptionIndex = q.options.findIndex(opt => opt.isCorrect);
                if (userAnswerIndex === correctOptionIndex) {
                    score += q.marks;
                    correct++;
                } else {
                    // Determine negative marking if applicable, for now assuming 0 or define logic
                    // Assuming simple scoring for this demo
                    wrong++;
                }
            }
        });

        setScoreData({
            score,
            totalQuestions: test.questions.length,
            answered,
            correct,
            wrong
        });
        setShowScoreModal(true);
    };

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')} : ${m.toString().padStart(2, '0')} : ${s.toString().padStart(2, '0')}`;
    };

    const getStatusColor = (qId, index) => {
        const status = questionStatus[qId] || STATUS.NOT_VISITED;
        const isCurrent = currentQuestionIndex === index;

        let baseClass = 'bg-gray-100 text-gray-700 border-gray-300'; // Default for NOT_VISITED

        switch (status) {
            case STATUS.ANSWERED: baseClass = 'bg-green-600 text-white border-green-600'; break;
            case STATUS.MARKED_FOR_REVIEW: baseClass = 'bg-purple-600 text-white border-purple-600'; break;
            case STATUS.ANSWERED_AND_MARKED: baseClass = 'bg-purple-600 text-white border-purple-600 relative after:content-["✓"] after:absolute after:top-0 after:right-1 after:text-xs'; break;
            case STATUS.NOT_ANSWERED: baseClass = 'bg-red-600 text-white border-red-600'; break;
            default: // NOT_VISITED
                // If not visited and current, it will be blue. Otherwise, it remains gray-100.
                break;
        }

        if (isCurrent) {
            // If current, apply a ring and potentially override color if not answered/visited
            if (status === STATUS.ANSWERED || status === STATUS.ANSWERED_AND_MARKED) {
                return `${baseClass} ring-4 ring-blue-300 ring-offset-1`; // Keep status color, add blue ring
            } else {
                // If current and not answered, not marked, or not visited, make it blue
                return 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-400 ring-offset-1';
            }
        }
        return baseClass;
    };

    if (loading) return <div className="flex justify-center pt-24"><div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div></div>;
    if (!test) return <div className="pt-24 text-center">Test not found</div>;

    // --- RENDER TEST INTERFACE ---
    if (isTestActive) {
        const currentQ = test.questions[currentQuestionIndex];
        return (
            <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center z-10">
                    <h1 className="text-xl font-bold text-gray-800">Online Test - {test.examName}</h1>
                    <div className="flex items-center gap-4">
                        <div className="bg-gray-100 px-4 py-2 rounded-lg flex flex-col items-center">
                            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Time Left</span>
                            <span className="text-xl font-mono font-bold text-blue-600">{formatTime(timeLeft)}</span>
                        </div>
                    </div>
                </header>

                <div className="flex-grow flex overflow-hidden">
                    {/* Left: Question Area */}
                    <div className="flex-grow flex flex-col p-6 overflow-y-auto w-3/4">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex-grow flex flex-col">
                            {/* Question Header */}
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-lg font-bold text-gray-800">Question {currentQuestionIndex + 1}</h2>
                                <span className="text-sm font-medium text-gray-500">Marks: +{currentQ.marks}</span>
                            </div>

                            {/* Question Content */}
                            <div className="p-8 flex-grow overflow-y-auto">
                                <p className="text-lg text-gray-800 mb-8 leading-relaxed font-medium">{currentQ.questionText}</p>
                                <div className="space-y-4 max-w-2xl">
                                    {currentQ.options.map((opt, idx) => (
                                        <label
                                            key={idx}
                                            className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all hover:bg-gray-50 ${answers[currentQ._id] === idx
                                                    ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600'
                                                    : 'border-gray-200'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name={`question-${currentQ._id}`}
                                                className="w-5 h-5 text-blue-600 focus:ring-blue-500 mr-4"
                                                checked={answers[currentQ._id] === idx}
                                                onChange={() => handleAnswerSelect(idx)}
                                            />
                                            <span className="text-base text-gray-700">{opt.text}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                                <div className="flex gap-3">
                                    <button onClick={handleMarkForReview} className="px-4 py-2 rounded-lg bg-orange-100 text-orange-700 hover:bg-orange-200 font-medium transition-colors">
                                        Mark for Review & Next
                                    </button>
                                    <button onClick={clearResponse} className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-200 font-medium transition-colors">
                                        Clear Response
                                    </button>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handlePrevious}
                                        disabled={currentQuestionIndex === 0}
                                        className={`px-6 py-2 rounded-lg font-semibold border ${currentQuestionIndex === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'}`}
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        className="px-6 py-2 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 shadow-lg hover:shadow-xl transition-all"
                                    >
                                        {currentQuestionIndex === test.questions.length - 1 ? 'Save & Submit' : 'Save & Next'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Sidebar Palette */}
                    <div className="w-1/4 bg-white border-l border-gray-200 flex flex-col shadow-xl z-20">
                        <div className="p-4 bg-gray-50 border-b border-gray-200">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                                    {user?.firstName?.[0] || 'U'}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 line-clamp-1">{user?.fullName || 'Candidate'}</p>
                                    <p className="text-xs text-gray-500">Student</p>
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-green-600"></span> Answered</div>
                                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-red-600"></span> Not Answered</div>
                                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-gray-200 border border-gray-300"></span> Not Visited</div>
                                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-purple-600"></span> Mark for Review</div>
                            </div>
                        </div>

                        <div className="flex-grow overflow-y-auto p-4">
                            <h3 className="font-bold text-gray-700 mb-3 bg-blue-50 p-2 rounded">Questions Palette</h3>
                            <div className="grid grid-cols-5 gap-2">
                                {test.questions.map((q, idx) => (
                                    <button
                                        key={q._id || idx}
                                        onClick={() => handlePaletteClick(idx)}
                                        className={`h-10 w-10 rounded-lg flex items-center justify-center text-sm font-bold border transition-all hover:opacity-80 ${getStatusColor(q._id, idx)}`}
                                    >
                                        {idx + 1}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-200 bg-gray-50">
                            <button
                                onClick={() => { if (confirm('Are you sure you want to submit?')) calculateAndSubmit(); }}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all"
                            >
                                Submit Test
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- SCORE MODAL ---
    if (showScoreModal) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-sans p-4">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center">
                    <div className="mb-6">
                        <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Test Submitted!</h2>
                        <p className="text-gray-500 mt-2">Here is your performance summary</p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6 mb-8">
                        <div className="text-4xl font-extrabold text-blue-600 mb-2">{scoreData.score}</div>
                        <div className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Total Score</div>

                        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
                            <div>
                                <div className="text-xl font-bold text-gray-800">{scoreData.totalQuestions}</div>
                                <div className="text-xs text-gray-500">Total</div>
                            </div>
                            <div>
                                <div className="text-xl font-bold text-green-600">{scoreData.correct}</div>
                                <div className="text-xs text-gray-500">Correct</div>
                            </div>
                            <div>
                                <div className="text-xl font-bold text-red-600">{scoreData.wrong}</div>
                                <div className="text-xs text-gray-500">Wrong</div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/mock-tests')}
                        className="w-full btn-primary py-3 rounded-xl text-lg shadow-lg hover:shadow-xl"
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        );
    }

    // --- RENDER OVERVIEW MODE (Original) - Fallback / Loading State ---
    // Since we auto-start, this might briefly flash or be used if there's a delay or logic change
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />
            <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                {/* Test Header */}
                <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-3">
                                {test.examName}
                            </span>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{test.title}</h1>
                            <div className="flex gap-6 text-gray-600 text-sm">
                                <span className="flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    {test.duration} mins
                                </span>
                                <span className="flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                    {test.questions?.length || 0} Questions
                                </span>
                                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${test.difficulty === 'Hard' ? 'bg-red-100 text-red-700' :
                                    test.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-green-100 text-green-700'
                                    }`}>
                                    {test.difficulty}
                                </span>
                            </div>
                            <p className="mt-4 text-gray-600 max-w-2xl">{test.description || "No description provided."}</p>
                        </div>
                        {/* Start Button */}
                        <button onClick={startTest} className="btn-primary text-lg px-8 py-3 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all">
                            Start Test Now
                        </button>
                    </div>
                </div>

                {/* Admin: Add Question Section */}
                {isAdmin && (
                    <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 border-2 border-dashed border-gray-300">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-800">Manage Questions</h3>
                            <button
                                onClick={() => setShowAddQuestion(!showAddQuestion)}
                                className="btn-primary"
                            >
                                {showAddQuestion ? 'Cancel Adding' : 'Add New Question'}
                            </button>
                        </div>

                        {showAddQuestion && (
                            <form onSubmit={handleAddQuestion} className="space-y-6 max-w-3xl mx-auto bg-gray-50 p-6 rounded-xl">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
                                    <textarea
                                        required
                                        className="modern-input w-full"
                                        rows="3"
                                        value={questionText}
                                        onChange={(e) => setQuestionText(e.target.value)}
                                        placeholder="Enter the question here..."
                                    ></textarea>
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-700">Options</label>
                                    {options.map((option, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="correctOption"
                                                checked={option.isCorrect}
                                                onChange={() => handleCorrectOptionChange(index)}
                                                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                                required
                                            />
                                            <input
                                                type="text"
                                                required
                                                className="modern-input py-2"
                                                placeholder={`Option ${index + 1}`}
                                                value={option.text}
                                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                            />
                                        </div>
                                    ))}
                                    <p className="text-xs text-gray-500 ml-7">Select the radio button for the correct answer.</p>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Marks</label>
                                        <input
                                            type="number"
                                            required
                                            min="0.5"
                                            step="0.5"
                                            className="modern-input"
                                            value={marks}
                                            onChange={(e) => setMarks(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Explanation (Optional)</label>
                                    <textarea
                                        className="modern-input w-full"
                                        rows="2"
                                        value={explanation}
                                        onChange={(e) => setExplanation(e.target.value)}
                                        placeholder="Explain the correct answer..."
                                    ></textarea>
                                </div>

                                <button type="submit" className="btn-primary w-full">Save Question</button>
                            </form>
                        )}
                    </div>
                )}

                {/* Questions List (Preview) */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-800 ml-1">Questions Preview ({test.questions?.length || 0})</h3>
                    {test.questions?.map((q, qIndex) => (
                        <div key={q._id || qIndex} className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex justify-between mb-4">
                                <h4 className="font-semibold text-gray-900 text-lg">Q{qIndex + 1}. {q.questionText}</h4>
                                <span className="text-xs font-semibold bg-gray-100 px-2 py-1 rounded text-gray-600 h-fit">
                                    {q.marks} Marks
                                </span>
                            </div>
                            <div className="space-y-2 mb-4">
                                {q.options.map((opt, oIndex) => (
                                    <div key={oIndex} className={`flex items-center gap-3 p-3 rounded-lg border ${opt.isCorrect ? 'bg-green-50 border-green-200' : 'border-gray-100'}`}>
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${opt.isCorrect ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300'}`}>
                                            {opt.isCorrect && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                        </div>
                                        <span className={opt.isCorrect ? 'font-medium text-green-800' : 'text-gray-700'}>{opt.text}</span>
                                    </div>
                                ))}
                            </div>
                            {q.explanation && (
                                <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
                                    <span className="font-bold">Explanation:</span> {q.explanation}
                                </div>
                            )}
                        </div>
                    ))}
                    {(!test.questions || test.questions.length === 0) && (
                        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                            <p className="text-gray-500">No questions added yet.</p>
                        </div>
                    )}
                </div>

            </main>
            <Footer />
        </div>
    );
};

export default MockTestDetailPage;
