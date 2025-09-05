import { createContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'

export const AppContext = createContext();


export const AppProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const [allNews, setAllNews] = useState([]);

  const fetchAllNews = async () => {
    try {
      const res = await axios.get(backendUrl + '/api/admin/all-news');
      console.log(res);
      const data = res.data;
      console.log(data);

      if (data.success) {
        setAllNews(data.news)
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error("Error in fetching news" + error.message)
    }
  }


  const value = {
    fetchAllNews, allNews
  }

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}
