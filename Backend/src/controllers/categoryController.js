const prisma = require('../config/db');

const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        products: true
      }
    });
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    const newCategory = await prisma.category.create({
      data: { name, slug }
    });

    res.json(newCategory);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: { name, slug }
    });

    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.category.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Category deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
