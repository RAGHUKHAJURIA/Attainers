import News from "../models/newsModel.js";

export const createNews = async (req, res) => {
  try {
    const { title, content, newsUrl } = req.body;

    // Create new news document
    const news = new News({
      title,
      content,
      newsUrl
    });

    // Save to DB
    await news.save();

    res.status(201).json({
      success: true,
      message: "News added successfully!",
    });
  } catch (error) {
    console.error("Error creating news:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error: error.message,
    });
  }
};


export const getAllNews = async (req, res) => {
  try {
    const newsList = await News.find();


    res.status(200).json({
      success: true,
      news: newsList,

    });
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error: error.message,
    });
  }
};

