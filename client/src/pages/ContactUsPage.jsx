import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ContactUsPage = () => {
    const { backendUrl } = useContext(AppContext);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        category: 'general'
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const response = await fetch(`${backendUrl}/api/public/feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    subject: '',
                    message: '',
                    category: 'general'
                });
                setTimeout(() => setSuccess(false), 5000);
            } else {
                setError(data.message || 'Failed to submit feedback');
            }
        } catch (err) {
            console.error('Error submitting feedback:', err);
            setError('Network error. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Get in Touch
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Have questions, feedback, or need assistance? We're here to help! Fill out the form below and we'll get back to you as soon as possible.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Contact Info Cards */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Email Card */}
                            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Email Us</h3>
                                <p className="text-gray-600 text-sm mb-3">Send us an email anytime</p>
                                <a href="mailto:support@attainers.com" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                                    support@attainers.com
                                </a>
                            </div>

                            {/* Phone Card */}
                            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Call Us</h3>
                                <p className="text-gray-600 text-sm mb-3">Mon-Fri from 9am to 6pm</p>
                                <a href="tel:+911234567890" className="text-green-600 hover:text-green-700 font-medium text-sm">
                                    +91 123 456 7890
                                </a>
                            </div>

                            {/* Location Card */}
                            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Visit Us</h3>
                                <p className="text-gray-600 text-sm">
                                    Jammu & Kashmir, India
                                </p>
                            </div>
                        </div>

                        {/* Feedback Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>

                                {/* Success Message */}
                                {success && (
                                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
                                        <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div>
                                            <h4 className="font-semibold text-green-900">Success!</h4>
                                            <p className="text-sm text-green-700">Your feedback has been submitted successfully. We'll get back to you soon!</p>
                                        </div>
                                    </div>
                                )}

                                {/* Error Message */}
                                {error && (
                                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                                        <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div>
                                            <h4 className="font-semibold text-red-900">Error</h4>
                                            <p className="text-sm text-red-700">{error}</p>
                                        </div>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Name & Email */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Full Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email Address <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>

                                    {/* Phone & Category */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                placeholder="+91 1234567890"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Category
                                            </label>
                                            <select
                                                name="category"
                                                value={formData.category}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            >
                                                <option value="general">General Inquiry</option>
                                                <option value="support">Technical Support</option>
                                                <option value="complaint">Complaint</option>
                                                <option value="suggestion">Suggestion</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Subject */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Subject <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="subject"
                                            required
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="How can we help you?"
                                        />
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Message <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            name="message"
                                            required
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows="6"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                            placeholder="Tell us more about your inquiry..."
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <span>Send Message</span>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                </svg>
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ContactUsPage;
