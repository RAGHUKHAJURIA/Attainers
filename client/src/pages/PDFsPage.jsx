import { AppContext } from '../context/AppContext';
import Navbar from '../components/Navbar';
import { useContext, useState, useEffect } from 'react';
import Footer from '../components/Footer';
import PDFCard from '../components/PDFCard';
import AddPDFModal from '../components/AddPDFModal';
import { useUser, useAuth } from '@clerk/clerk-react';


const PDFsPage = () => {
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { backendUrl, fetchAllPDFs: contextFetchPDFs } = useContext(AppContext);
    // Note: AppContext has fetchAllPDFs but it stores result in context. 
    // This page uses local state 'pdfs'.
    // Ideally should use context data, but refactoring to context entirely might break local search/filter if not careful.
    // For now, just use backendUrl to fix hardcoding.
    const [pdfs, setPdfs] = useState([]);

    useEffect(() => {
        fetchPDFs();
    }, []);

    const fetchPDFs = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/public/pdfs`);
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setPdfs(data.pdfs);
                }
            }
        } catch (error) {
            console.error('Error fetching PDFs:', error);
        }
    };

    useEffect(() => {
        if (isLoaded && user) {
            setIsAdmin(user.publicMetadata?.role === 'admin');
        }
    }, [isLoaded, user]);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this PDF?")) return;

        try {
            const token = await getToken();
            const response = await fetch(`${backendUrl}/api/admin/pdfs/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                fetchPDFs(); // Refresh list
            } else {
                const errData = await response.json();
                alert(`Failed to delete PDF: ${errData.message || response.statusText}`);
            }
        } catch (error) {
            console.error('Error deleting PDF:', error);
            alert("Error deleting PDF. Check console for details.");
        }
    };

    const handleAddPDF = async (newPDF) => {
        try {
            const token = await getToken();
            let body;
            let headers = {
                'Authorization': `Bearer ${token}`
            };

            if (newPDF.file) {
                const formData = new FormData();
                formData.append('title', newPDF.title);
                formData.append('description', newPDF.description);
                formData.append('category', newPDF.category);
                formData.append('subject', newPDF.subject);
                if (newPDF.fileUrl) formData.append('fileUrl', newPDF.fileUrl);
                formData.append('file', newPDF.file);
                formData.append('fileName', newPDF.fileName);
                formData.append('fileSize', newPDF.fileSize);
                formData.append('pages', newPDF.pages);
                formData.append('isPaid', newPDF.isPaid);
                formData.append('price', newPDF.price);
                body = formData;
                // do NOT set Content-Type header for FormData
            } else {
                body = JSON.stringify(newPDF);
                headers['Content-Type'] = 'application/json';
            }

            const response = await fetch(`${backendUrl}/api/admin/pdfs`, {
                method: 'POST',
                headers: headers,
                body: body
            });

            if (response.ok) {
                fetchPDFs(); // Refresh list
            } else {
                const errData = await response.json();
                alert(`Failed to add PDF: ${errData.message || response.statusText}`);
            }
        } catch (error) {
            console.error('Error adding PDF:', error);
            alert("Error adding PDF. Check console for details.");
        }
    };

    const filteredPDFs = pdfs.filter(pdf =>
        pdf.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pdf.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">

            <Navbar />

            <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            PDF Library
                        </h1>
                        <p className="mt-2 text-lg text-gray-600">
                            Access high-quality study materials and reference documents.
                        </p>
                    </div>

                    <div className="flex gap-4 items-center">
                        {/* Search Bar */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search PDFs..."
                                className="modern-input !pl-14"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        {isAdmin && (
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="btn-primary whitespace-nowrap flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Upload PDF
                            </button>
                        )}
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {['All', 'Mathematics', 'Physics', 'History'].map((filter) => (
                        <button
                            key={filter}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${searchTerm === '' && filter === 'All' ? 'bg-blue-600 text-white' :
                                filter !== 'All' && searchTerm.includes(filter) ? 'bg-blue-600 text-white' :
                                    'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }`}
                            onClick={() => setSearchTerm(filter === 'All' ? '' : filter)}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Content Grid */}
                {filteredPDFs.length > 0 ? (
                    <div className="h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
                            {filteredPDFs.map((pdf) => (
                                <PDFCard
                                    key={pdf._id}
                                    pdf={pdf}
                                    isAdmin={isAdmin}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No PDFs found</h3>
                        <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria.</p>
                    </div>
                )}
            </main>

            <Footer />

            <AddPDFModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddPDF}
            />
        </div>
    );
};

export default PDFsPage;

