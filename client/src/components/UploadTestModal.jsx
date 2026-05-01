import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { useAuth } from '@clerk/clerk-react';

const UploadTestModal = ({ isOpen, onClose, onUploadComplete }) => {
    const { backendUrl } = useContext(AppContext);
    const { getToken } = useAuth();

    // Steps: 'upload', 'processing', 'preview'
    const [step, setStep] = useState('upload');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [parsedQuestions, setParsedQuestions] = useState([]);
    const [progress, setProgress] = useState(0);

    // Form State
    const [examName, setExamName] = useState('');
    const [title, setTitle] = useState('');
    const [duration, setDuration] = useState(60);
    const [negativeMarks, setNegativeMarks] = useState(0.25);
    const [testType, setTestType] = useState('mock-test');
    const [year, setYear] = useState(new Date().getFullYear());



    if (!isOpen) return null;

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
            setError('');
        }
    };



    const handleUpload = async () => {
        if (!file) return;

        setLoading(true);
        setStep('processing');
        setProgress(0);
        setError('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = await getToken();
            const response = await fetch(`${backendUrl}/api/admin/mock-tests/upload-pdf`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setParsedQuestions(data.data);
                setStep('preview');
                setLoading(false);
            } else {
                setError(data.message || 'Failed to process file');
                setStep('upload');
                setLoading(false);
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred while uploading.');
            setStep('upload');
            setLoading(false);
        }
    };

    const handleSaveTest = async () => {
        if (!examName || !title) {
            alert("Please fill in Exam Name and Title");
            return;
        }

        setLoading(true);
        try {
            const token = await getToken();
            const testData = {
                examName,
                title,
                duration,
                negativeMarks,
                testType,
                year,
                questions: parsedQuestions
            };

            const response = await fetch(`${backendUrl}/api/admin/mock-tests`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(testData)
            });

            if (response.ok) {
                onUploadComplete();
                onClose();
            } else {
                const data = await response.json();
                alert(data.message || "Failed to save test");
            }
        } catch (err) {
            console.error(err);
            alert("Error saving test");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                    Upload PDF Mock Test (AI & OCR)
                                </h3>

                                {step === 'upload' && (
                                    <div className="mt-4">
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors">
                                            <input
                                                type="file"
                                                accept=".pdf"
                                                className="hidden"
                                                id="pdf-upload"
                                                onChange={handleFileChange}
                                            />
                                            <label htmlFor="pdf-upload" className="cursor-pointer">
                                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                                <p className="mt-2 text-sm text-gray-600">
                                                    {file ? file.name : "Click to upload PDF"}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">Supports Text & Scanned PDFs</p>
                                            </label>
                                        </div>
                                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                                    </div>
                                )}

                                {step === 'processing' && (
                                    <div className="mt-8 text-center py-12">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                                        <p className="mt-4 text-gray-600">Processing File (Extracting Text & AI Analyzing)...</p>
                                        <p className="text-sm text-gray-500 mt-2">This may take up to a minute depending on file size.</p>
                                    </div>
                                )}

                                {step === 'preview' && (
                                    <div className="mt-4 max-h-[60vh] overflow-y-auto pr-2">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                            <input
                                                type="text"
                                                placeholder="Exam Name (e.g. JKSSB)"
                                                className="modern-input"
                                                value={examName}
                                                onChange={(e) => setExamName(e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Title (e.g. Mock Test 1)"
                                                className="modern-input"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                            />
                                        </div>

                                        <h4 className="font-bold text-gray-700 mb-2">Extracted {parsedQuestions.length} Questions</h4>
                                        <div className="space-y-4">
                                            {parsedQuestions.map((q, idx) => (
                                                <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm">
                                                    <p className="font-bold mb-2">{idx + 1}. {q.questionText}</p>
                                                    <ul className="list-disc list-inside pl-2 mb-2">
                                                        {q.options.map((opt, i) => (
                                                            <li key={i} className={i === q.correctOptionIndex ? 'text-green-600 font-bold' : 'text-gray-700'}>
                                                                {opt}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                    <p className="text-xs text-gray-500 italic">Exp: {q.explanation}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        {step === 'upload' && (
                            <button
                                type="button"
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                                onClick={handleUpload}
                                disabled={!file || loading}
                            >
                                {loading ? 'Uploading...' : 'Upload & Process'}
                            </button>
                        )}
                        {step === 'preview' && (
                            <button
                                type="button"
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                                onClick={handleSaveTest}
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Publish Test'}
                            </button>
                        )}
                        <button
                            type="button"
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadTestModal;
