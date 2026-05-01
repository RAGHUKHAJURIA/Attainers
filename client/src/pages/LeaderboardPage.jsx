import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Leaderboard from '../components/Leaderboard';

const LeaderboardPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />
            <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
                        Student Leaderboard
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        See how you stack up against other students. Rankings are based on the average score across all attempted mock tests.
                    </p>
                </div>

                <Leaderboard />
            </main>
            <Footer />
        </div>
    );
};

export default LeaderboardPage;
