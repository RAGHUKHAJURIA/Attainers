import { useState, useEffect } from 'react'
import './App.css'

import Hero from './pages/Hero'
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer } from 'react-toastify'
import Admin from './pages/Admin';
import { AppProvider } from './context/AppContext'
import PDFsPage from './pages/PDFsPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
// import PreviousPapersPage from './pages/PreviousPapersPage';
import BlogsPage from './pages/BlogsPage';
import BlogDetailPage from './pages/BlogDetailPage';
import YouTubePage from './pages/YouTubePage';
import UpdatesPage from './pages/UpdatesPage';
import TablesPage from './pages/TablesPage';
import MockTestsPage from './pages/MockTestsPage';
import MockTestDetailPage from './pages/MockTestDetailPage';
import PreviousPapersPage from './pages/PreviousPapersPage';
import PYQPage from './pages/PYQPage';
import FreeCoursesPage from './pages/FreeCoursesPage';
import PYQYearPage from './pages/PYQYearPage';
import ContactUsPage from './pages/ContactUsPage';
import CurrentAffairsPage from './pages/CurrentAffairsPage';
import SubjectWiseTestsPage from './pages/SubjectWiseTestsPage';
import ExamWiseTestsPage from './pages/ExamWiseTestsPage';
// import VideoLecturesPage from './pages/VideoLecturesPage';
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
        <Route path='/free-courses' element={<FreeCoursesPage />} />
        <Route path='/courses' element={<CoursesPage />} />
        <Route path='/courses/:id' element={<CourseDetailPage />} />
        <Route path='/courses/:id' element={<CourseDetailPage />} />
        {/* Previous Papers now redirects to Exam-wise Tests */}
        <Route path='/previous-papers' element={<PreviousPapersPage />} />
        {/* Route path='/video-lectures' element={<VideoLecturesPage />} / */}
        <Route path='/blogs' element={<BlogsPage />} />
        <Route path='/blogs/:id' element={<BlogDetailPage />} />
        <Route path='/youtube' element={<YouTubePage />} />
        <Route path='/updates' element={<UpdatesPage />} />
        <Route path='/current-affairs' element={<CurrentAffairsPage />} />
        <Route path='/schedules' element={<TablesPage />} />
        <Route path='/mock-tests' element={<MockTestsPage />} />
        <Route path='/mock-tests/:id' element={<MockTestDetailPage />} />
        <Route path='/pyq' element={<PYQPage />} />
        <Route path='/pyq/:year' element={<PYQYearPage />} />
        <Route path='/mock-tests/subject-wise' element={<SubjectWiseTestsPage />} />
        <Route path='/mock-tests/exam-wise' element={<ExamWiseTestsPage />} />
        <Route path='/contact' element={<ContactUsPage />} />
      </Routes>
    </AppProvider>
  )
}

export default App
