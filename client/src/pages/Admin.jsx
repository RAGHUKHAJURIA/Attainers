import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import Loading from '../components/Loading';
import AdminDashboard from '../components/AdminDashboard';

const Admin = () => {
    const { user, isLoaded } = useUser();

    // Wait until Clerk loads the user
    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="flex justify-center flex-col items-center">
                    <Loading size="large" />
                    <h2 className="text-xl font-semibold text-gray-600">Loading Admin Panel...</h2>
                </div>
            </div>
        );
    }

    // Restrict non-admin users
    if (!user || user.publicMetadata.role !== "admin") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
                <div className="text-center bg-white p-8 rounded-2xl shadow-xl border border-red-200">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-red-600 mb-2">
                        Access Denied
                    </h2>
                    <p className="text-gray-600">
                        This area is restricted to administrators only.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <AdminDashboard user={user} />
        </div>
    );
};

export default Admin;
