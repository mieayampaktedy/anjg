const prisma = require('../config/db');
const bcrypt = require('bcryptjs');

// Get all admins
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Create a new admin
const createUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    let user = await prisma.user.findUnique({
      where: { username }
    });

    if (user) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    user = await prisma.user.create({
      data: {
        username,
        password_hash,
        role: role || 'ADMIN'
      },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.status(201).json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update an admin
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, role } = req.body;

    const data = {};
    if (username) data.username = username;
    if (role) data.role = role;
    if (password) {
      data.password_hash = await bcrypt.hash(password, 10);
    }

    // Check if user exists
    let user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user = await prisma.user.update({
      where: { id: parseInt(id) },
      data,
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete an admin
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Optional: Prevent deleting the last superadmin
    if (parseInt(id) === req.user.id) {
       return res.status(400).json({ message: 'You cannot delete yourself' });
    }

    let user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await prisma.user.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'User removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser
};
