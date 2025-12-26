import React from 'react';
import Navbar from '../components/Navbar';
import UpdateSection from '../components/UpdateSection';
import Footer from '../components/Footer';

const UpdatesPage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="pt-20">
                <UpdateSection />
            </div>
            <Footer />
        </div>
    );
};

export default UpdatesPage;
