const prisma = require('../config/db');
const fs = require('fs');
const path = require('path');

const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        images: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const createProduct = async (req, res) => {
  try {
    const { categoryId, name, description, specification, status, youtube_url } = req.body;
    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Date.now();

    const newProduct = await prisma.product.create({
      data: {
        categoryId: parseInt(categoryId),
        name,
        slug,
        description,
        specification,
        status,
        youtube_url
      }
    });

    if (req.file) {
      await prisma.productImage.create({
        data: {
          productId: newProduct.id,
          image_url: `/uploads/${req.file.filename}`,
          is_primary: true
        }
      });
    }

    res.json(newProduct);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryId, name, description, specification, status, youtube_url } = req.body;
    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Date.now();

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        categoryId: parseInt(categoryId),
        name,
        slug,
        description,
        specification,
        status,
        youtube_url
      }
    });

    if (req.file) {
      // Find existing primary image
      const existingImage = await prisma.productImage.findFirst({
        where: { productId: parseInt(id), is_primary: true }
      });
      if (existingImage) {
        const oldImagePath = path.join(__dirname, '../../public', existingImage.image_url);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
        await prisma.productImage.delete({ where: { id: existingImage.id } });
      }
      await prisma.productImage.create({
        data: {
          productId: parseInt(id),
          image_url: `/uploads/${req.file.filename}`,
          is_primary: true
        }
      });
    }

    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Find all images linked to this product and delete them from disk
    const productImages = await prisma.productImage.findMany({
      where: { productId: parseInt(id) }
    });

    for (const img of productImages) {
      const imagePath = path.join(__dirname, '../../public', img.image_url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await prisma.product.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct
};
