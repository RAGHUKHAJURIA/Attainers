import { useState, useRef, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

/* ── UI Configs ── */
const CATEGORY_LABELS = {
  'subject': '📚 Subject-Wise',
  'current-affairs': '📰 Current Affairs',
  'pyq': '📝 Previous Year',
  'exam-specific': '🎯 Exam-Specific',
  'practice': '💪 Practice',
  'general': '📋 General'
};

const CATEGORY_COLORS = {
  'subject': 'bg-blue-100 text-blue-700 border-blue-200',
  'current-affairs': 'bg-green-100 text-green-700 border-green-200',
  'pyq': 'bg-purple-100 text-purple-700 border-purple-200',
  'exam-specific': 'bg-orange-100 text-orange-700 border-orange-200',
  'practice': 'bg-pink-100 text-pink-700 border-pink-200',
  'general': 'bg-gray-100 text-gray-700 border-gray-200'
};

const getLocationDescription = (category, metadata) => {
  switch (category) {
    case 'subject':
      return `${metadata?.subject || 'General'} > ${metadata?.examName || 'All Tests'}`;
    case 'current-affairs':
      return `Current Affairs > ${metadata?.timePeriod || 'Latest'}`;
    case 'pyq':
      return `PYQs > ${metadata?.examName || 'General'} > ${metadata?.year || 'All Years'}`;
    case 'exam-specific':
      return `${metadata?.examName} > ${metadata?.testType === 'practice' ? 'Practice Tests' : 'Full-Length Tests'}`;
    case 'practice':
      return `Practice Tests`;
    default:
      return `General Tests`;
  }
};

/* ── Preview Card ── */
const PreviewDisplay = ({ data, metadata, category, onApprove, onCancel }) => {
  const [expandedQuestions, setExpandedQuestions] = useState(new Set([0]));

  const toggleQuestion = (index) => {
    setExpandedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-4 w-full">
      <div className="border-b pb-3 border-gray-200">
        <div className="flex items-start justify-between mb-2 gap-2">
          <h3 className="text-xl font-bold text-gray-800 flex-1 leading-tight">{data.title}</h3>
          <span className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold border ${CATEGORY_COLORS[category]}`}>
            {CATEGORY_LABELS[category]}
          </span>
        </div>
        
        <p className="text-sm text-blue-600 font-medium">
          {data.questions.length} questions extracted
        </p>

        {/* Location Info Box */}
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 font-bold">
            📍 This test will be added to:
          </p>
          <p className="text-sm text-blue-800 mb-2 font-medium pl-5">
            {getLocationDescription(category, metadata)}
          </p>
          
          {/* Metadata Details */}
          <div className="flex flex-wrap gap-2 pt-1 border-t border-blue-200/50">
            {metadata?.subject && (
              <span className="px-2 py-0.5 bg-white rounded border border-blue-100 text-xs text-gray-700 shadow-sm">
                Subject: {metadata.subject}
              </span>
            )}
            {metadata?.examName && metadata.examName !== 'General' && (
              <span className="px-2 py-0.5 bg-white rounded border border-blue-100 text-xs text-gray-700 shadow-sm">
                Exam: {metadata.examName}
              </span>
            )}
            {metadata?.difficulty && (
              <span className="px-2 py-0.5 bg-white rounded border border-blue-100 text-xs text-gray-700 shadow-sm capitalize">
                Difficulty: {metadata.difficulty}
              </span>
            )}
            {metadata?.duration && (
              <span className="px-2 py-0.5 bg-white rounded border border-blue-100 text-xs text-gray-700 shadow-sm">
                Duration: {metadata.duration} mins
              </span>
            )}
            {metadata?.testType && (
              <span className="px-2 py-0.5 bg-white rounded border border-blue-100 text-xs text-gray-700 shadow-sm capitalize">
                Type: {metadata.testType}
              </span>
            )}
          </div>

          {/* Tags Display */}
          {metadata?.tags && metadata.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {metadata.tags.map((tag, idx) => (
                <span key={idx} className="px-2 py-0.5 bg-blue-100/50 text-blue-700 rounded-full text-xs font-medium border border-blue-200">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {data.questions.map((q, idx) => (
          <div key={idx} className="border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm hover:shadow-md transition">
            {/* Question Header (Collapsible) */}
            <button
              onClick={() => toggleQuestion(idx)}
              className="w-full text-left p-3 hover:bg-gray-50 flex items-start gap-3 transition"
            >
              <span className="font-bold text-blue-600 flex-shrink-0 mt-0.5">
                Q{idx + 1}.
              </span>
              <span className="flex-1 text-sm font-medium text-gray-800 leading-snug">{q.question}</span>
              <span className="text-gray-400 text-xs mt-1">
                {expandedQuestions.has(idx) ? '▼' : '▶'}
              </span>
            </button>

            {/* Expanded Content */}
            {expandedQuestions.has(idx) && (
              <div className="px-3 pb-3 space-y-2">
                {q.options.map((opt, optIdx) => (
                  <div
                    key={optIdx}
                    className={`p-2.5 rounded-lg text-sm flex items-center gap-3 transition ${
                      opt === q.answer
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                        : 'bg-gray-50 text-gray-600 border border-transparent'
                    }`}
                  >
                    <span className="font-bold text-xs opacity-70">
                      {String.fromCharCode(65 + optIdx)}.
                    </span>
                    <span className="flex-1">{opt}</span>
                    {opt === q.answer && (
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      </span>
                    )}
                  </div>
                ))}
                
                {!q.answer && (
                  <p className="text-xs text-amber-600 italic bg-amber-50 p-2 rounded-lg border border-amber-200 inline-flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    No correct answer detected in PDF
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={onApprove}
          className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-bold
                     hover:opacity-90 transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
          Approve & Create in {CATEGORY_LABELS[category].split(' ')[1]}
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 font-bold transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

/* ── Message Bubble ── */
const MessageBubble = ({ message, onApprove, onCancel }) => {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end mb-5">
        <div className="max-w-[75%] bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl rounded-tr-sm p-4 shadow-md">
          <p className="text-xs text-blue-200 font-semibold mb-1 uppercase tracking-wider">You asked</p>
          <p className="text-sm font-medium leading-relaxed">{message.content}</p>
          {message.fileName && (
            <div className="mt-3 inline-flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded text-xs font-medium border border-white/10">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              {message.fileName}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (message.role === 'agent' && message.content === 'preview') {
    return (
      <div className="flex justify-start mb-5 gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center flex-shrink-0 shadow-lg mt-1 border-2 border-white">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        <div className="bg-white border border-gray-200/60 rounded-2xl rounded-tl-sm p-5 shadow-xl shadow-gray-200/40 flex-1 max-w-[90%] ring-1 ring-black/5">
          <PreviewDisplay 
            data={message.data}
            metadata={message.metadata}
            category={message.category}
            onApprove={onApprove}
            onCancel={onCancel}
          />
        </div>
      </div>
    );
  }

  if (message.role === 'system') {
    return (
      <div className="flex justify-center mb-5">
        <div className={`px-5 py-3 rounded-2xl text-sm font-medium whitespace-pre-line shadow-sm border ${
          message.isError 
            ? 'bg-red-50 text-red-700 border-red-200 shadow-red-100' 
            : 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-emerald-100'
        }`}>
          {message.content}
        </div>
      </div>
    );
  }

  return null;
};

const TypingIndicator = () => (
  <div className="flex justify-start mb-5 gap-3">
    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg border-2 border-white">
      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
    </div>
    <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-5 py-3 shadow-md flex items-center gap-3">
      <div className="flex gap-1.5">
        {[0, 150, 300].map(d => <div key={d} className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: `${d}ms` }} />)}
      </div>
      <span className="text-sm font-medium text-gray-500">Analyzing PDF & Auto-Routing...</span>
    </div>
  </div>
);

/* ── Main Page ── */
const AdminAIMockTest = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const chatEndRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [currentPreview, setCurrentPreview] = useState(null);
  const [currentMetadata, setCurrentMetadata] = useState(null);
  const [currentCategory, setCurrentCategory] = useState('general');

  useEffect(() => {
    if (isLoaded && user?.publicMetadata?.role !== 'admin') {
      toast.error('Access denied. Admin only.');
      navigate('/');
    }
  }, [isLoaded, user, navigate]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isLoading]);

  const handleFileSelect = e => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.type !== 'application/pdf') { toast.error('Only PDF files allowed'); return; }
    if (f.size > 10 * 1024 * 1024) { toast.error('Max 10MB limit'); return; }
    setSelectedFile(f);
  };

  const handleRemoveFile = () => { 
    setSelectedFile(null); 
    if (fileRef.current) fileRef.current.value = ''; 
  };

  const handleSubmit = async () => {
    if (!inputPrompt.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: inputPrompt,
      fileName: selectedFile ? selectedFile.name : null,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    const p = inputPrompt.trim();
    const f = selectedFile;
    setInputPrompt('');
    setIsLoading(true);

    try {
      const token = await window.Clerk.session.getToken();
      const fd = new FormData();
      if (f) {
        fd.append('file', f);
      }
      fd.append('prompt', p);
      
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/agent/parse-pdf`, 
        fd, 
        {
          headers: { 
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}` 
          }
        }
      );
      
      if (response.data.success) {
        setCurrentPreview(response.data.preview);
        setCurrentMetadata(response.data.metadata);
        setCurrentCategory(response.data.category);

        const agentMessage = {
          role: 'agent',
          content: 'preview',
          data: response.data.preview,
          metadata: response.data.metadata,
          category: response.data.category,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, agentMessage]);
        
        toast.success(`Extracted ${response.data.preview.questions.length} questions`);
      }
    } catch (error) {
      console.error('Parse error:', error);
      const errorMessage = {
        role: 'system',
        content: error.response?.data?.message || 'Failed to process PDF. Please try again.',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
      toast.error('Processing failed');
    } finally { 
      setIsLoading(false);
      handleRemoveFile(); 
    }
  };

  const handleApprove = async () => {
    if (!currentPreview) return;
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/agent/approve-test`,
        {
          draft: currentPreview,
          metadata: currentMetadata,
          category: currentCategory
        },
        {
          headers: {
            'Authorization': `Bearer ${await window.Clerk.session.getToken()}`
          }
        }
      );

      if (response.data.success) {
        const successMessage = {
          role: 'system',
          content: `✓ ${response.data.message}\n\nTest ID: ${response.data.testId}\nCategory: ${CATEGORY_LABELS[response.data.category] || response.data.category}\nLocation: ${response.data.location}\n\nYou can now publish it from the Mock Tests management page.`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, successMessage]);
        
        setCurrentPreview(null);
        setCurrentMetadata(null);
        setCurrentCategory('general');
        
        toast.success(`Test created in ${response.data.location}!`);
      }

    } catch (error) {
      console.error('Approval error:', error);
      toast.error(error.response?.data?.message || 'Failed to create test');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelPreview = () => {
    setCurrentPreview(null);
    setCurrentMetadata(null);
    setCurrentCategory('general');
    // Remove the last preview message from the UI to show it was cancelled
    setMessages(prev => prev.filter(m => m.role !== 'agent' || m.content !== 'preview' || m.data !== currentPreview));
    toast.info("Test creation cancelled");
  };

  const SUGGESTIONS = [
    'Extract 30 Biology MCQs for NEET from Cell Biology chapter',
    'Get current affairs questions from January 2026',
    'Extract JEE 2023 previous year physics questions',
    'Make a quick practice test on Thermodynamics',
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="text-gray-400 hover:text-gray-800 transition bg-gray-50 p-2 rounded-xl border border-gray-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-200">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div>
                <h1 className="text-base font-extrabold text-gray-900 tracking-tight">AI Mock Test Generator</h1>
                <p className="text-xs text-violet-600 font-semibold tracking-wide">SMART ROUTING & EXTRACTION</p>
              </div>
            </div>
          </div>
          <span className="hidden sm:flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />Admin Online
          </span>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center fade-in">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-100 to-fuchsia-100 flex items-center justify-center mb-6 shadow-inner border border-violet-200">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">Upload. Describe. Done.</h2>
              <p className="text-gray-500 max-w-md mb-8 text-sm leading-relaxed">
                Gemini AI will extract MCQs from your PDF and <strong className="text-gray-800">automatically route them</strong> to the correct section based on your prompt.
              </p>

              <div className="w-full max-w-2xl bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Supported Sections</p>
                <div className="flex flex-wrap justify-center gap-2.5 mb-8">
                  {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                    <span key={k} className={`text-xs px-3 py-1.5 rounded-lg border font-bold ${CATEGORY_COLORS[k]}`}>{v}</span>
                  ))}
                </div>

                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Prompt Examples</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SUGGESTIONS.map((s, i) => (
                    <button key={i} onClick={() => setInputPrompt(s)}
                      className="text-left px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 font-medium hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 transition-all group shadow-sm">
                      <span className="opacity-50 group-hover:opacity-100 transition-opacity">💡</span> {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2 pb-6">
              {messages.map((msg, i) => (
                <MessageBubble 
                  key={i} 
                  message={msg} 
                  onApprove={handleApprove} 
                  onCancel={handleCancelPreview}
                />
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white/90 backdrop-blur-xl border-t border-gray-200 sticky bottom-0 p-4 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
        <div className="max-w-4xl mx-auto">
          {selectedFile && (
            <div className="flex items-center gap-3 px-4 py-2.5 bg-indigo-50 border border-indigo-100 rounded-2xl mb-3 shadow-sm w-max max-w-full">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-indigo-900 truncate">{selectedFile.name}</p>
                <p className="text-xs text-indigo-500 font-medium">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB PDF</p>
              </div>
              <button onClick={handleRemoveFile} className="w-8 h-8 flex items-center justify-center rounded-lg text-indigo-400 hover:text-red-500 hover:bg-red-50 transition ml-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          )}
          
          <div className="flex gap-3 items-end">
            <input ref={fileRef} type="file" accept="application/pdf" onChange={handleFileSelect} className="hidden" />
            
            <button onClick={() => fileRef.current?.click()} title="Upload PDF"
              className="flex-shrink-0 w-14 h-14 flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 hover:border-violet-400 hover:text-violet-600 hover:bg-violet-50 transition-all group shadow-sm">
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </button>
            
            <div className="flex-1 bg-white border-2 border-gray-200 rounded-2xl shadow-sm focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-50 transition-all flex items-center pr-2">
              <textarea 
                value={inputPrompt} 
                onChange={e => setInputPrompt(e.target.value)} 
                onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSubmit(); }}
                placeholder="e.g., 'Extract 50 Biology MCQs for NEET' (AI will auto-route it)" 
                rows={1}
                className="flex-1 resize-none bg-transparent px-5 py-4 text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none min-h-[56px] max-h-32 overflow-y-auto" 
              />
              <button 
                onClick={handleSubmit} 
                disabled={!inputPrompt.trim() || isLoading}
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-all disabled:opacity-40 disabled:scale-100 active:scale-95 ml-2 shadow-sm"
              >
                {isLoading
                  ? <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  : <svg className="w-5 h-5 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                }
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 mt-3 text-xs font-semibold text-gray-400">
            {selectedFile 
              ? <span className="text-indigo-500">✅ PDF Ready</span> 
              : <span>📎 Upload a PDF (Optional)</span>}
            <span>•</span>
            <span>Press <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-gray-500">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-gray-500">Enter</kbd> to send</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAIMockTest;
