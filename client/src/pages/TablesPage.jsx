import React from 'react';
import Navbar from '../components/Navbar';
import TableSection from '../components/TableSection';
import Footer from '../components/Footer';

const TablesPage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="pt-20">
                <TableSection />
            </div>
            <Footer />
        </div>
    );
};

export default TablesPage;
