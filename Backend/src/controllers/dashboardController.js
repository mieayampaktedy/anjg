const prisma = require('../config/db');

const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await prisma.product.count();
    const totalCategories = await prisma.category.count();
    const totalArticles = await prisma.article.count();
    const totalMessages = await prisma.contactMessage.count();

    // 1. Product Trend (last 6 months)
    const indonesianMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
    const productTrend = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = indonesianMonths[d.getMonth()];
      const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
      const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);

      const count = await prisma.product.count({
        where: {
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth
          }
        }
      });

      productTrend.push({
        month: monthName,
        value: count
      });
    }

    // 2. Category Distribution
    const categories = await prisma.category.findMany({
      select: {
        name: true,
        _count: {
          select: { products: true }
        }
      }
    });
    const categoryDistribution = categories.map(cat => ({
      name: cat.name,
      value: cat._count.products
    }));

    // 3. Recent Activity Log
    const recentProducts = await prisma.product.findMany({
      take: 5,
      orderBy: { updatedAt: 'desc' },
      select: {
        name: true,
        createdAt: true,
        updatedAt: true
      }
    });

    const recentArticles = await prisma.article.findMany({
      take: 5,
      orderBy: { updatedAt: 'desc' },
      select: {
        title: true,
        createdAt: true,
        updatedAt: true
      }
    });

    const recentMessages = await prisma.contactMessage.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        fullName: true,
        createdAt: true
      }
    });

    const activities = [];

    recentProducts.forEach(p => {
      const isNew = p.createdAt.getTime() === p.updatedAt.getTime();
      activities.push({
        user: "Admin",
        initials: "AD",
        activity: isNew ? `Menambahkan produk baru: "${p.name}"` : `Memperbarui produk: "${p.name}"`,
        time: p.updatedAt
      });
    });

    recentArticles.forEach(a => {
      const isNew = a.createdAt.getTime() === a.updatedAt.getTime();
      activities.push({
        user: "Admin",
        initials: "AD",
        activity: isNew ? `Menerbitkan artikel baru: "${a.title}"` : `Memperbarui artikel: "${a.title}"`,
        time: a.updatedAt
      });
    });

    recentMessages.forEach(m => {
      const parts = m.fullName.trim().split(/\s+/);
      const initials = parts.map(n => n[0]).join('').substring(0, 2).toUpperCase() || "CN";
      activities.push({
        user: m.fullName,
        initials,
        activity: `Mengirim pesan kontak baru`,
        time: m.createdAt
      });
    });

    activities.sort((a, b) => b.time.getTime() - a.time.getTime());
    const recentActivity = activities.slice(0, 5).map(act => ({
      user: act.user,
      initials: act.initials,
      activity: act.activity,
      time: act.time.toISOString()
    }));

    res.json({
      totalProducts,
      totalCategories,
      totalArticles,
      totalMessages,
      productTrend,
      categoryDistribution,
      recentActivity
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getDashboardStats
};

