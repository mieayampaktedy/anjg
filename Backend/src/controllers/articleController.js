const prisma = require('../config/db');
const fs = require('fs');
const path = require('path');

const getAllArticles = async (req, res) => {
  try {
    const articles = await prisma.article.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(articles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const createArticle = async (req, res) => {
  try {
    const { title, content, status } = req.body;
    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Date.now();
    let image_url = '';

    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }

    const newArticle = await prisma.article.create({
      data: {
        title,
        slug,
        content,
        status,
        image_url,
        authorId: req.user.id
      }
    });

    res.json(newArticle);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, status } = req.body;
    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Date.now();

    let article = await prisma.article.findUnique({ where: { id: parseInt(id) } });
    if (!article) return res.status(404).json({ message: 'Article not found' });

    let image_url = article.image_url;
    if (req.file) {
      if (article.image_url) {
        const oldImagePath = path.join(__dirname, '../../public', article.image_url);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      image_url = `/uploads/${req.file.filename}`;
    }

    article = await prisma.article.update({
      where: { id: parseInt(id) },
      data: {
        title,
        slug,
        content,
        status,
        image_url
      }
    });

    res.json(article);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await prisma.article.findUnique({ where: { id: parseInt(id) } });
    if (!article) return res.status(404).json({ message: 'Article not found' });

    if (article.image_url) {
      const imagePath = path.join(__dirname, '../../public', article.image_url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await prisma.article.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Article deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getAllArticles,
  createArticle,
  updateArticle,
  deleteArticle
};
