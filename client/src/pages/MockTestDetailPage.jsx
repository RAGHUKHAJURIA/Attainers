import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

// Status Constants
// Status Constants
const STATUS = {
    NOT_VISITED: 'not-visited',
    NOT_ANSWERED: 'not-answered',
    ANSWERED: 'answered',
    MARKED_FOR_REVIEW: 'review',
    ANSWERED_AND_MARKED: 'ans-review'
};

const MockTestDetailPage = () => {
    const { id } = useParams();
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const { backendUrl } = useContext(AppContext);
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
    const [editingQuestionId, setEditingQuestionId] = useState(null); // Track which question is being edited

    // Score Modal State
    const [showScoreModal, setShowScoreModal] = useState(false);
    const [scoreData, setScoreData] = useState({ score: 0, totalQuestions: 0, answered: 0, correct: 0, wrong: 0 });

    const navigate = useNavigate();

    const [showPalette, setShowPalette] = useState(false); // Mobile palette toggle

    useEffect(() => {
        if (isLoaded && user) {
            setIsAdmin(user.publicMetadata?.role === 'admin');
        }
    }, [isLoaded, user]);

    useEffect(() => {
        fetchTestDetails();
    }, [id]);

    // Auto-start test for students ONLY (not admins)
    useEffect(() => {
        // Wait for user to be loaded and test data to be available
        if (isLoaded && test && test.questions && test.questions.length > 0) {
            // Only start if NOT admin and test hasn't started yet
            if (!isAdmin && !isTestActive) {
                startTest(test); // Now safe to call
            }
        }
    }, [isLoaded, test, isAdmin, isTestActive]);

    // Timer Effect
    useEffect(() => {
        let timer;
        if (isTestActive && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isTestActive, timeLeft]);

    // Auto-submit when time runs out
    useEffect(() => {
        if (timeLeft === 0 && isTestActive) {
            calculateAndSubmit();
        }
    }, [timeLeft, isTestActive]);

    const fetchTestDetails = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/public/mock-tests/${id}`);
            if (response.ok) {
                const data = await response.json();

                // Inject dummy data if no questions -- REMOVED
                // if (!data.questions || data.questions.length === 0) {
                //     data.questions = DUMMY_QUESTIONS;
                // }

                setTest(data);
                setTimeLeft(data.duration * 60); // Set timer based on duration

                // Auto-start test for students (or everyone as requested) ONLY if questions exist
                // Auto-start is now handled by a useEffect to respect admin status
                // if (data.questions && data.questions.length > 0) {
                //     startTest(data);
                // }
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

    const handleAddQuestion = async (e, shouldClose = true) => {
        if (e) e.preventDefault();
        try {
            const token = await getToken();
            const questionData = { questionText, options, explanation, marks };

            let url = `${backendUrl}/api/admin/mock-tests/${id}/questions`;
            let method = 'POST';
            let body;

            if (editingQuestionId) {
                // Update existing question
                url = `${backendUrl}/api/admin/mock-tests/${id}/questions/${editingQuestionId}`;
                method = 'PUT';
                body = JSON.stringify(questionData);
            } else {
                // Create new question (wrapped in array as per original API)
                body = JSON.stringify({ questions: [questionData] });
            }

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: body
            });

            if (response.ok) {
                // Reset form
                setQuestionText('');
                setOptions([{ text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }]);
                setExplanation('');
                setEditingQuestionId(null); // Clear editing state

                if (shouldClose) {
                    setShowAddQuestion(false);
                }
                fetchTestDetails();
            }
        } catch (error) {
            console.error('Error saving question:', error);
        }
    };

    const handleEditQuestion = (question) => {
        setQuestionText(question.questionText);
        setOptions(JSON.parse(JSON.stringify(question.options))); // Deep copy
        setExplanation(question.explanation || '');
        setMarks(question.marks);
        setEditingQuestionId(question._id);
        setShowAddQuestion(true);
        // smooth scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteQuestion = async (questionId) => {
        if (!confirm('Are you sure you want to delete this question?')) return;
        try {
            const token = await getToken();
            const response = await fetch(`${backendUrl}/api/admin/mock-tests/${id}/questions/${questionId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                fetchTestDetails();
            } else {
                alert('Failed to delete question');
            }
        } catch (error) {
            console.error('Error deleting question:', error);
        }
    };

    // --- Test Taking Handlers ---
    const startTest = (testData = test) => {
        if (!testData || !testData.questions || testData.questions.length === 0) return;
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

        if (!test || !test.questions || test.questions.length === 0) {
            setScoreData({ score: 0, totalQuestions: 0, answered: 0, correct: 0, wrong: 0 });
            setShowScoreModal(true);
            return;
        }

        test.questions.forEach(q => {
            const userAnswerIndex = answers[q._id];
            if (userAnswerIndex !== undefined) {
                answered++;
                const correctOptionIndex = q.options.findIndex(opt => opt.isCorrect);
                if (userAnswerIndex === correctOptionIndex) {
                    score += q.marks;
                    correct++;
                } else {
                    // Apply negative marking
                    score -= (test.negativeMarks || 0);
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
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
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

    // Auto-hide palette on mobile, show on desktop
    // We can use CSS to handle desktop visibility, but for the toggle logic:
    // Actually, distinct structures might be easier. 
    // Let's use a simple state that toggles a class or renders a modal.

    // --- RENDER TEST INTERFACE ---
    if (isTestActive && test && test.questions && test.questions.length > 0) {
        const currentQ = test.questions[currentQuestionIndex];
        if (!currentQ) return <div>Error: Question not found</div>; // Safety fallback

        return (
            <div className="h-screen bg-gray-50 flex flex-col overflow-hidden relative">
                {/* Header */}
                <header className="bg-white shadow-sm px-4 py-3 sm:px-6 sm:py-4 flex justify-between items-center z-20 shrink-0 h-16 sm:h-auto">
                    {/* Explicit text size to override global h1 */}
                    <h1 className="text-[16px] sm:text-xl font-bold text-gray-800 break-words line-clamp-2 mr-2 flex-grow leading-tight">
                        {test.examName}
                        <span className="hidden sm:inline"> - {test.title}</span>
                    </h1>

                    <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                        <div className="bg-gray-100 px-2 py-1 sm:px-4 sm:py-2 rounded-lg flex flex-col items-center min-w-[60px] sm:min-w-[100px]">
                            <span className="leading-none text-[8px] sm:text-xs text-gray-500 font-bold uppercase tracking-wider hidden sm:inline">Time Left</span>
                            <span className="leading-none text-[8px] sm:hidden text-gray-500 font-bold uppercase tracking-wider mb-0.5">Time</span>
                            <span className={`leading-none text-sm sm:text-xl font-mono font-bold whitespace-nowrap ${timeLeft < 300 ? 'text-red-600 animate-pulse' : 'text-blue-600'}`}>
                                {formatTime(timeLeft)}
                            </span>
                        </div>

                        {/* Mobile Palette Toggle */}
                        <button
                            onClick={() => setShowPalette(!showPalette)}
                            className="lg:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {showPalette ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </header>

                <div className="flex-grow flex relative overflow-hidden">
                    {/* Left: Question Area */}
                    <div className="flex-grow flex flex-col p-3 sm:p-6 overflow-y-auto w-full lg:w-3/4 bg-gray-50">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex-grow flex flex-col max-h-full overflow-hidden">
                            {/* Question Header */}
                            <div className="p-4 sm:p-6 border-b border-gray-100 flex justify-between items-center shrink-0">
                                <h2 className="text-sm sm:text-lg font-bold text-gray-800">
                                    Question {currentQuestionIndex + 1}
                                    <span className="text-gray-400 font-normal text-xs sm:text-sm ml-2">/ {test.questions.length}</span>
                                </h2>
                                <span className="text-xs sm:text-sm font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded whitespace-nowrap">
                                    +{currentQ.marks} Marks
                                </span>
                            </div>

                            {/* Question Content */}
                            <div className="p-4 sm:p-8 flex-grow overflow-y-auto">
                                <p className="text-base sm:text-lg text-gray-800 mb-6 sm:mb-8 leading-relaxed font-medium">
                                    {currentQ.questionText}
                                </p>
                                <div className="space-y-3 sm:space-y-4 max-w-2xl">
                                    {currentQ.options.map((opt, idx) => (
                                        <label
                                            key={idx}
                                            className={`flex items-start sm:items-center p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all hover:bg-gray-50 ${answers[currentQ._id] === idx
                                                ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600'
                                                : 'border-gray-200'
                                                }`}
                                        >
                                            <div className="flex items-center h-5">
                                                <input
                                                    type="radio"
                                                    name={`question-${currentQ._id}`}
                                                    className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 focus:ring-blue-500 mr-3 sm:mr-4 mt-0.5 sm:mt-0"
                                                    checked={answers[currentQ._id] === idx}
                                                    onChange={() => handleAnswerSelect(idx)}
                                                />
                                            </div>
                                            <span className="text-sm sm:text-base text-gray-700">{opt.text}</span>
                                        </label>
                                    ))}
                                </div>
                                {/* Explanation removed during test */}
                            </div>

                            {/* Footer Actions */}
                            <div className="p-3 sm:p-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between items-center shrink-0">
                                <div className="flex gap-3 w-full sm:w-auto">
                                    <button
                                        onClick={handleMarkForReview}
                                        className="flex-1 sm:flex-none px-4 py-3 sm:py-2.5 rounded-lg bg-orange-100 text-orange-700 hover:bg-orange-200 text-sm font-medium transition-colors text-center whitespace-nowrap"
                                    >
                                        Review
                                    </button>
                                    <button
                                        onClick={clearResponse}
                                        className="flex-1 sm:flex-none px-4 py-3 sm:py-2.5 rounded-lg text-gray-600 hover:bg-gray-200 text-sm font-medium transition-colors border border-gray-200 bg-white"
                                    >
                                        Clear
                                    </button>
                                </div>

                                <div className="flex gap-3 w-full sm:w-auto">
                                    <button
                                        onClick={handlePrevious}
                                        disabled={currentQuestionIndex === 0}
                                        className={`flex-1 sm:flex-none px-4 py-3 sm:py-2.5 rounded-lg font-semibold border text-sm ${currentQuestionIndex === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'}`}
                                    >
                                        Prev
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        className="flex-1 sm:flex-none px-6 py-3 sm:py-2.5 rounded-lg bg-green-600 text-white text-sm font-bold hover:bg-green-700 shadow-md hover:shadow-lg transition-all"
                                    >
                                        {currentQuestionIndex === test.questions.length - 1 ? 'Submit' : 'Save & Next'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Sidebar Palette (Responsive) */}
                    <div className={`
                        fixed inset-0 z-30 bg-white lg:static lg:w-1/4 lg:border-l lg:border-gray-200 lg:flex lg:flex-col lg:shadow-xl lg:z-auto transition-transform duration-300 ease-in-out
                        ${showPalette ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
                    `}>
                        {/* Mobile Header for Palette */}
                        <div className="lg:hidden p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 h-16">
                            <h3 className="font-bold text-gray-800">Question Palette</h3>
                            <button onClick={() => setShowPalette(false)} className="text-gray-500 hover:text-gray-700 p-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-4 bg-gray-50 border-b border-gray-200 hidden lg:block">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                                    {user?.firstName?.[0] || 'U'}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 line-clamp-1">{user?.fullName || 'Candidate'}</p>
                                    <p className="text-xs text-gray-500">Student</p>
                                </div>
                            </div>
                        </div>

                        {/* Legend (Visible on Mobile inside palette) */}
                        <div className="p-4 border-b border-gray-200 bg-white">
                            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs text-gray-600">
                                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-green-600 flex-shrink-0"></span> Answered</div>
                                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-red-600 flex-shrink-0"></span> Not Answered</div>
                                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-gray-200 border border-gray-300 flex-shrink-0"></span> Not Visited</div>
                                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-purple-600 flex-shrink-0"></span> Review</div>
                            </div>
                        </div>

                        <div className="flex-grow overflow-y-auto p-4 bg-white lg:bg-transparent">
                            <h3 className="font-bold text-gray-700 mb-3 bg-blue-50 p-2 rounded hidden lg:block">Questions Palette</h3>
                            <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-5 gap-2">
                                {test.questions.map((q, idx) => (
                                    <button
                                        key={q._id || idx}
                                        onClick={() => {
                                            handlePaletteClick(idx);
                                            setShowPalette(false); // Close on mobile selection
                                        }}
                                        className={`h-10 w-10 rounded-lg flex items-center justify-center text-sm font-bold border transition-all hover:opacity-80 ${getStatusColor(q._id, idx)}`}
                                    >
                                        {idx + 1}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-200 bg-gray-50 shrink-0">
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
    // --- DETAILED RESULTS VIEW ---
    if (showScoreModal) {
        return (
            <div className="min-h-screen bg-gray-50 font-sans pb-12">
                <Navbar />
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                    {/* Header Score Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8 text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Test Result</h2>
                        <p className="text-gray-600 mb-6">Performance Summary for <span className="font-bold text-gray-800">{user?.fullName || 'Candidate'}</span></p>

                        <div className="flex flex-col sm:flex-row justify-center items-center gap-8 mb-8">
                            <div className="text-center">
                                <div className="text-5xl font-extrabold text-blue-600 mb-1">{Number(scoreData.score).toFixed(2).replace(/\.00$/, '')}</div>
                                <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Score</div>
                            </div>
                            <div className="h-12 w-px bg-gray-200 hidden sm:block"></div>
                            <div className="flex gap-8">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">{scoreData.correct}</div>
                                    <div className="text-xs text-gray-500 font-medium uppercase">Correct</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-red-600">{scoreData.wrong}</div>
                                    <div className="text-xs text-gray-500 font-medium uppercase">Wrong</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-600">{scoreData.totalQuestions - scoreData.answered}</div>
                                    <div className="text-xs text-gray-500 font-medium uppercase">Unattempted</div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/mock-tests')}
                            className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-transform hover:-translate-y-0.5"
                        >
                            Back to All Tests
                        </button>
                    </div>

                    {/* Detailed Question Analysis */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-gray-800 border-l-4 border-blue-600 pl-4 mb-6">
                            Detailed Solutions
                        </h3>

                        {test.questions.map((q, index) => {
                            const userAnswerIndex = answers[q._id];
                            const correctOptionIndex = q.options.findIndex(opt => opt.isCorrect);
                            const isCorrect = userAnswerIndex === correctOptionIndex;
                            const isUnattempted = userAnswerIndex === undefined;

                            // Determine status Badge
                            let statusBadge;
                            if (isUnattempted) {
                                statusBadge = <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full border border-gray-200">Unattempted</span>;
                            } else if (isCorrect) {
                                statusBadge = <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full border border-green-200">Correct</span>;
                            } else {
                                statusBadge = <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full border border-red-200">Wrong</span>;
                            }

                            return (
                                <div key={q._id || index} className={`bg-white rounded-xl shadow-sm border p-6 ${isCorrect ? 'border-green-100' : isUnattempted ? 'border-gray-200' : 'border-red-100'}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-sm">
                                                {index + 1}
                                            </span>
                                            <h4 className="font-semibold text-gray-900 text-lg leading-snug">{q.questionText}</h4>
                                        </div>
                                        <div className="shrink-0 ml-4">
                                            {statusBadge}
                                        </div>
                                    </div>

                                    <div className="space-y-3 ml-0 sm:ml-11">
                                        {q.options.map((opt, optIndex) => {
                                            let optionClass = "border-gray-200 bg-white";
                                            let icon = null;

                                            // Styling Logic
                                            if (optIndex === correctOptionIndex) {
                                                // Always highlight correct answer in green in the review
                                                optionClass = "border-green-500 bg-green-50 text-green-900 ring-1 ring-green-500";
                                                icon = <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>;
                                            } else if (optIndex === userAnswerIndex && !isCorrect) {
                                                // User chose wrong answer
                                                optionClass = "border-red-500 bg-red-50 text-red-900 ring-1 ring-red-500";
                                                icon = <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>;
                                            } else if (optIndex === userAnswerIndex && isCorrect) {
                                                // User chose correct answer (covered by first if, but purely for logic clarity)
                                                optionClass = "border-green-500 bg-green-50 text-green-900";
                                            }

                                            return (
                                                <div key={optIndex} className={`flex items-center justify-between p-3 rounded-lg border-2 text-sm sm:text-base ${optionClass}`}>
                                                    <span className="font-medium">{opt.text}</span>
                                                    {icon}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Explanation Section - ALWAYS SHOW IN RESULTS */}
                                    <div className="mt-6 ml-0 sm:ml-11 p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
                                        <h5 className="text-xs font-bold text-yellow-800 uppercase tracking-wide mb-2 flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            Explanation
                                        </h5>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            {q.explanation || "No explanation provided."}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    // --- RENDER OVERVIEW MODE (Original) - Fallback / Loading State ---
    // Since we auto-start, this might briefly flash or be used if there's a delay or logic change
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-800">


            {/* Navbar */}
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
                                <span className="flex items-center text-indigo-600 font-medium">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    {test.viewCount || 0} Views
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
                                onClick={() => {
                                    setShowAddQuestion(!showAddQuestion);
                                    setEditingQuestionId(null); // Reset editing state on toggle
                                    setQuestionText('');
                                    setOptions([{ text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }]);
                                    setExplanation('');
                                }}
                                className="btn-primary"
                            >
                                {showAddQuestion ? 'Cancel' : 'Add New Question'}
                            </button>
                        </div>

                        {showAddQuestion && (
                            <form className="space-y-6 max-w-3xl mx-auto bg-gray-50 p-6 rounded-xl">
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

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={(e) => handleAddQuestion(e, false)}
                                        className="flex-1 bg-white border-2 border-indigo-600 text-indigo-700 font-bold py-3 rounded-xl hover:bg-indigo-50 transition-colors"
                                    >
                                        Save & Add Another
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(e) => handleAddQuestion(e, true)}
                                        className="flex-1 btn-primary py-3 rounded-xl shadow-lg"
                                    >
                                        {editingQuestionId ? 'Update Question' : 'Save & Finish'}
                                    </button>
                                </div>
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

                            {isAdmin && (
                                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end gap-3">
                                    <button
                                        onClick={() => handleEditQuestion(q)}
                                        className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteQuestion(q._id)}
                                        className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                    >
                                        Delete
                                    </button>
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
