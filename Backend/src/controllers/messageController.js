const prisma = require('../config/db');

// Public: Create a contact message
const createMessage = async (req, res) => {
  try {
    const { fullName, email, phone, message } = req.body;

    if (!fullName || !email || !phone || !message) {
      return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    const newMessage = await prisma.contactMessage.create({
      data: {
        fullName,
        email,
        phone,
        message
      }
    });

    res.status(201).json({
      message: 'Pesan berhasil dikirim',
      data: newMessage
    });
  } catch (err) {
    console.error('Error creating contact message:', err);
    res.status(500).json({ message: 'Gagal mengirim pesan, silakan coba lagi' });
  }
};

// Admin: Get all contact messages
const getAllMessages = async (req, res) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ message: 'Gagal mengambil data pesan' });
  }
};

// Admin: Get unread count
const getUnreadCount = async (req, res) => {
  try {
    const count = await prisma.contactMessage.count({
      where: {
        isRead: false
      }
    });
    res.json({ unreadCount: count });
  } catch (err) {
    console.error('Error counting unread messages:', err);
    res.status(500).json({ message: 'Gagal mengambil jumlah pesan belum dibaca' });
  }
};

// Admin: Mark message as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const messageId = parseInt(id, 10);

    if (isNaN(messageId)) {
      return res.status(400).json({ message: 'ID pesan tidak valid' });
    }

    const updatedMessage = await prisma.contactMessage.update({
      where: { id: messageId },
      data: { isRead: true }
    });

    res.json({
      message: 'Pesan berhasil ditandai telah dibaca',
      data: updatedMessage
    });
  } catch (err) {
    console.error('Error marking message as read:', err);
    res.status(500).json({ message: 'Gagal memperbarui status pesan' });
  }
};

// Admin: Delete message
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const messageId = parseInt(id, 10);

    if (isNaN(messageId)) {
      return res.status(400).json({ message: 'ID pesan tidak valid' });
    }

    await prisma.contactMessage.delete({
      where: { id: messageId }
    });

    res.json({ message: 'Pesan berhasil dihapus' });
  } catch (err) {
    console.error('Error deleting message:', err);
    res.status(500).json({ message: 'Gagal menghapus pesan' });
  }
};

module.exports = {
  createMessage,
  getAllMessages,
  getUnreadCount,
  markAsRead,
  deleteMessage
};
