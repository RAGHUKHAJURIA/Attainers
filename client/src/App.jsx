import { useState, useEffect } from 'react'
import './App.css'
import Hero from './pages/Hero'
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer } from 'react-toastify'
import Admin from './pages/Admin';
import { AppProvider } from './context/AppContext'
import PDFsPage from './pages/PDFsPage';
import VideoLecturesPage from './pages/VideoLecturesPage';
import CoursesPage from './pages/CoursesPage';
import PreviousPapersPage from './pages/PreviousPapersPage';
import BlogsPage from './pages/BlogsPage';
import YouTubePage from './pages/YouTubePage';
import UpdatesPage from './pages/UpdatesPage';
import TablesPage from './pages/TablesPage';
import MockTestsPage from './pages/MockTestsPage';
import MockTestDetailPage from './pages/MockTestDetailPage';
import { useUser } from '@clerk/clerk-react';

function App() {
  const { user, isLoaded, isSignedIn } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const isUserView = searchParams.get('view') === 'user';

    if (isLoaded && isSignedIn && user?.publicMetadata?.role === 'admin' && !isUserView) {
      if (location.pathname === '/') {
        navigate('/admin');
      }
    }
  }, [isLoaded, isSignedIn, user, navigate, location]);

  return (
    <AppProvider>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Hero />} />
        <Route path='/admin' element={<Admin />} />
        <Route path='/pdfs' element={<PDFsPage />} />
        <Route path='/video-lectures' element={<VideoLecturesPage />} />
        <Route path='/courses' element={<CoursesPage />} />
        <Route path='/previous-papers' element={<PreviousPapersPage />} />
        <Route path='/blogs' element={<BlogsPage />} />
        <Route path='/youtube' element={<YouTubePage />} />
        <Route path='/updates' element={<UpdatesPage />} />
        <Route path='/schedules' element={<TablesPage />} />
        <Route path='/mock-tests' element={<MockTestsPage />} />
        <Route path='/mock-tests/:id' element={<MockTestDetailPage />} />
      </Routes>
    </AppProvider>
  )
}

export default App
