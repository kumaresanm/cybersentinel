// Certainly! Here's an example of a Node.js utility that utilizes the Twitter API and the News API to gather data for social media and news articles:
// Import necessary libraries
const Twitter = require('twitter');
const NewsAPI = require('newsapi');
const fs = require('fs'); // Import the 'fs' module for file operations


// Set up Twitter API client
const twitterClient = new Twitter({
  consumer_key: 'wrbyliTyAfHD8WXV4zzzWe2hH',
  consumer_secret: 'NIQAepmZZ7JMUFL5GKlkaU6yqPG3f0sMETL9gCvL6KPfiUVmET',
  access_token_key: '98317495-Zb82K1ynu2sor3Lg6ZQw239oOl2YqEHlI1LDbbTCC',
  access_token_secret: '3hG20LozHYspjm5zSR6Q0IRIPwd39uNU1I88dh5RBah61'
});

// Set up News API client
const newsApiClient = new NewsAPI('05010faebf5f427c9ce418e416d72c97');
// Function to save data to a text file
const saveDataToFile = (data, filename) => {
  fs.writeFileSync(filename, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`Data saved to ${filename}`);
};

// Function to fetch tweets from Twitter API
const getTweets = (query, count) => {
  const params = { q: query, count: count };
  return new Promise((resolve, reject) => {
    twitterClient.get('search/tweets', params, (error, tweets, response) => {
      if (error) reject(error);
      else resolve(tweets);
    });
  });
};

// Function to fetch news articles from News API
const getNewsArticles = (query, count) => {
  return newsApiClient.v2.everything({
    q: query,
    pageSize: count,
    language: 'en',
    sortBy: 'relevancy'
  });
};

// Example usage
const query = 'Facebook';
const count = 100;

getTweets(query, count)
  .then(tweets => {
    saveDataToFile(tweets, 'tweets.json'); // Save tweets to 'tweets.json'
  })
  .catch(error => {
    console.error('Error fetching tweets:', error);
  });

getNewsArticles(query, count)
  .then(articles => {
    saveDataToFile(articles, 'news_articles.json'); // Save news articles to 'news_articles.json'
  })
  .catch(error => {
    console.error('Error fetching news articles:', error);
  });
