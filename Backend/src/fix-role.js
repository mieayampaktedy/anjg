// Script ini mengupdate role user admin menjadi SUPERADMIN
// Jalankan dengan: node src/fix-role.js
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function main() {
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Found' : 'NOT FOUND');
  
  const updated = await prisma.user.updateMany({
    where: { 
      OR: [
        { role: 'admin' },
        { username: 'admin' }
      ]
    },
    data: { role: 'SUPERADMIN' }
  });

  console.log(`✅ Updated ${updated.count} user(s) to SUPERADMIN`);
  
  const users = await prisma.user.findMany({
    select: { id: true, username: true, role: true }
  });
  console.log('Current users:', users);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error:', e.message);
    await prisma.$disconnect();
    process.exit(1);
  });
