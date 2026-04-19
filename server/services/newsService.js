const axios = require('axios');
const groq = require('../config/groq');

const fetchDisasterNews = async () => {
  const response = await axios.get('https://newsapi.org/v2/everything', {
    params: {
      q: 'flood OR earthquake OR cyclone OR landslide OR tsunami OR NDRF OR NDMA OR "disaster" OR "emergency"',
      language: 'en',
      sortBy: 'publishedAt',
      pageSize: 20,
      apiKey: process.env.NEWSAPI_KEY
    }
  });

  const articles = response.data.articles
    .filter(article => 
      article.title && 
      article.description &&
      !article.title.includes('[Removed]')
    )
    .map(article => ({
      title: article.title,
      description: article.description,
      url: article.url,
      source: article.source.name,
      publishedAt: article.publishedAt,
      urlToImage: article.urlToImage
    }));

  const prompt = `
    You are a disaster news classifier.
    From these news articles, return ONLY the ones related to natural disasters, floods, earthquakes, cyclones, landslides, droughts, tsunamis, or disaster relief/response.
    Respond ONLY in JSON format as an array:
    [
      {
        "title": "article title",
        "description": "article description",
        "url": "article url",
        "source": "source name",
        "publishedAt": "date",
        "urlToImage": "image url or null",
        "disasterType": "flood/earthquake/cyclone/landslide/drought/other",
        "isDisasterRelated": true
      }
    ]
    
    Articles to classify:
    ${JSON.stringify(articles)}
    
    Return empty array [] if no disaster related articles found.
  `;

  const aiResponse = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.1
  });

  const text = aiResponse.choices[0].message.content;
  const cleaned = text.replace(/```json|```/g, '').trim();
  const filtered = JSON.parse(cleaned);

  return filtered;
};

module.exports = { fetchDisasterNews };