import { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'
import { useAuth, useUser, useSession } from '@clerk/clerk-react'

export const AppContext = createContext();

export const AppProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const [allNews, setAllNews] = useState([]);
  const [allBlogs, setAllBlogs] = useState([]);
  const [allTables, setAllTables] = useState([]);
  const [allUpdates, setAllUpdates] = useState([]);
  const [allYouTubeVideos, setAllYouTubeVideos] = useState([]);
  const [allPDFs, setAllPDFs] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [allVideoLectures, setAllVideoLectures] = useState([]);
  const [allPreviousPapers, setAllPreviousPapers] = useState([]);

  const logToken = async () => {

  }

  const { getToken } = useAuth()

  // News functions
  const fetchAllNews = async () => {
    try {
      const res = await axios.get(backendUrl + '/api/public/news');
      const data = res.data;

      if (data.success) {
        setAllNews(data.news)
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error in fetching news: " + error.message)
    }
  }

  // Blog functions
  const fetchAllBlogs = async (category = null) => {
    try {
      const url = category ?
        `${backendUrl}/api/public/blogs?category=${category}` :
        `${backendUrl}/api/public/blogs`;
      const res = await axios.get(url);
      const data = res.data;

      if (data.success) {
        setAllBlogs(data.blogs)
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error in fetching blogs: " + error.message)
    }
  }

  // Table functions
  const fetchAllTables = async (category = null) => {
    try {
      const url = category ?
        `${backendUrl}/api/public/tables?category=${category}` :
        `${backendUrl}/api/public/tables`;
      const res = await axios.get(url);
      const data = res.data;

      if (data.success) {
        setAllTables(data.tables)
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error in fetching tables: " + error.message)
    }
  }

  // Update functions
  const fetchAllUpdates = async (type = null) => {
    try {
      const url = type ?
        `${backendUrl}/api/public/updates?type=${type}` :
        `${backendUrl}/api/public/updates`;
      const res = await axios.get(url);
      const data = res.data;

      if (data.success) {
        setAllUpdates(data.updates)
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error in fetching updates: " + error.message)
    }
  }

  // YouTube functions
  const fetchAllYouTubeVideos = async (category = null, featured = null) => {
    try {
      let url = `${backendUrl}/api/public/youtube`;
      const params = new URLSearchParams();

      if (category) params.append('category', category);
      if (featured) params.append('featured', featured);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await axios.get(url);
      const data = res.data;

      if (data.success) {
        setAllYouTubeVideos(data.videos)
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error in fetching YouTube videos: " + error.message)
    }
  }

  // PDF functions
  const fetchAllPDFs = async (category = null, subject = null) => {
    try {
      let url = `${backendUrl}/api/public/pdfs`;
      const params = new URLSearchParams();

      if (category) params.append('category', category);
      if (subject) params.append('subject', subject);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await axios.get(url);
      const data = res.data;

      if (data.success) {
        setAllPDFs(data.pdfs)
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error in fetching PDFs: " + error.message)
    }
  }

  // Course functions
  const fetchAllCourses = async (category = null, level = null) => {
    try {
      let url = `${backendUrl}/api/public/courses`;
      const params = new URLSearchParams();

      if (category) params.append('category', category);
      if (level) params.append('level', level);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await axios.get(url);
      const data = res.data;

      if (data.success) {
        setAllCourses(data.courses)
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error in fetching courses: " + error.message)
    }
  }

  // Video Lecture functions
  const fetchAllVideoLectures = async (courseId = null) => {
    try {
      let url = `${backendUrl}/api/public/video-lectures`;
      const params = new URLSearchParams();

      if (courseId) params.append('courseId', courseId);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await axios.get(url);
      const data = res.data;

      if (data.success) {
        setAllVideoLectures(data.lectures)
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error in fetching video lectures: " + error.message)
    }
  }

  // Previous Paper functions
  const fetchAllPreviousPapers = async (examName = null, year = null, category = null) => {
    try {
      let url = `${backendUrl}/api/public/previous-papers`;
      const params = new URLSearchParams();

      if (examName) params.append('examName', examName);
      if (year) params.append('year', year);
      if (category) params.append('category', category);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await axios.get(url);
      const data = res.data;

      if (data.success) {
        setAllPreviousPapers(data.papers)
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error in fetching previous papers: " + error.message)
    }
  }

  // Admin functions
  const createContent = async (type, data) => {
    try {
      const token = await getToken();

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      // Axios automatically sets content-type to multipart/form-data when data is FormData
      // So no special handling usually needed, but ensuring user didn't force JSON headers previously.
      // The previous code didn't force Content-Type: application/json, so it should work.
      // But adding explicit check if needed, or just let axios handle it.

      const res = await axios.post(`${backendUrl}/api/admin/${type}`, data, config);

      if (res.data.success) {
        toast.success(res.data.message);
        // Refresh the respective data
        switch (type) {
          case 'news':
            fetchAllNews();
            break;
          case 'blogs':
            fetchAllBlogs();
            break;
          case 'tables':
            fetchAllTables();
            break;
          case 'updates':
            fetchAllUpdates();
            break;
          case 'youtube':
            fetchAllYouTubeVideos();
            break;
          case 'pdfs':
            fetchAllPDFs();
            break;
          case 'courses':
            fetchAllCourses();
            break;
          case 'video-lectures':
            fetchAllVideoLectures();
            break;
          case 'previous-papers':
            fetchAllPreviousPapers();
            break;
        }
        return res.data;
      } else {
        toast.error(res.data.message);
        return null;
      }
    } catch (error) {
      toast.error("Error creating content: " + error.message);
      return null;
    }
  }

  useEffect(() => {
    logToken();
    // Fetch initial data
    fetchAllNews();
    fetchAllBlogs();
    fetchAllTables();
    fetchAllUpdates();
    fetchAllYouTubeVideos();
    fetchAllPDFs();
    fetchAllCourses();
    fetchAllVideoLectures();
    fetchAllPreviousPapers();
  }, [])

  const value = {
    // Data
    allNews, allBlogs, allTables, allUpdates, allYouTubeVideos, allPDFs, allCourses, allVideoLectures, allPreviousPapers,

    // Fetch functions
    fetchAllNews, fetchAllBlogs, fetchAllTables, fetchAllUpdates, fetchAllYouTubeVideos, fetchAllPDFs, fetchAllCourses, fetchAllVideoLectures, fetchAllPreviousPapers,

    // Admin functions
    createContent,

    // Utility
    getToken, backendUrl
  }

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}
