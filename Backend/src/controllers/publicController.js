const prisma = require('../config/db');

const getPublicProfile = async (req, res) => {
  try {
    const profile = await prisma.companyProfile.findFirst();
    res.json(profile || {});
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

const getPublicCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

const getPublicProducts = async (req, res) => {
  try {
    const { category } = req.query;
    
    const filter = category ? { category: { slug: category } } : {};
    
    const products = await prisma.product.findMany({
      where: filter,
      include: {
        category: true,
        images: {
          where: { is_primary: true } // maybe just primary image
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(products);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

const getPublicProductDetail = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: true
      }
    });

    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

const getPublicArticles = async (req, res) => {
  try {
    const articles = await prisma.article.findMany({
      where: { status: 'published' },
      orderBy: { createdAt: 'desc' }
    });
    res.json(articles);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

const getPublicArticleDetail = async (req, res) => {
  try {
    const { slug } = req.params;
    const article = await prisma.article.findUnique({
      where: { slug }
    });

    if (!article || article.status !== 'published') return res.status(404).json({ message: 'Article not found' });
    res.json(article);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getPublicProfile,
  getPublicCategories,
  getPublicProducts,
  getPublicProductDetail,
  getPublicArticles,
  getPublicArticleDetail
};
