const client = require('../config/redis');

const setCache = async (key, data, expiry = 3600) => {
  try {
    await client.setEx(key, expiry, JSON.stringify(data));
  } catch (error) {
    console.log('Cache set error:', error.message);
  }
};

const getCache = async (key) => {
  try {
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.log('Cache get error:', error.message);
    return null;
  }
};

const deleteCache = async (key) => {
  try {
    await client.del(key);
  } catch (error) {
    console.log('Cache delete error:', error.message);
  }
};

module.exports = { setCache, getCache, deleteCache };