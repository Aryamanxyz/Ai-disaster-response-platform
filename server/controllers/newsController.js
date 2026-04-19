const { fetchDisasterNews } = require('../services/newsService');


const getDisasterNews = async (req, res, next) => {
  try {
    const articles = await fetchDisasterNews();
    res.status(200).json({ success: true, count: articles.length, articles });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDisasterNews };