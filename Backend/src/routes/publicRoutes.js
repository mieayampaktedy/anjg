const express = require('express');
const router = express.Router();

const { 
  getPublicProfile, 
  getPublicCategories, 
  getPublicProducts, 
  getPublicProductDetail, 
  getPublicArticles, 
  getPublicArticleDetail 
} = require('../controllers/publicController');

const { createMessage } = require('../controllers/messageController');

router.get('/profile', getPublicProfile);
router.get('/categories', getPublicCategories);
router.get('/products', getPublicProducts);
router.get('/products/:slug', getPublicProductDetail);
router.get('/articles', getPublicArticles);
router.get('/articles/:slug', getPublicArticleDetail);

// Public Contact Form Submission
router.post('/contact', createMessage);

module.exports = router;
