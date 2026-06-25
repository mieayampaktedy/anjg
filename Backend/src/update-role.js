require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Update existing admin user to SUPERADMIN
  const updated = await prisma.user.updateMany({
    where: { 
      OR: [
        { role: 'admin' },
        { username: 'admin' }
      ]
    },
    data: { role: 'SUPERADMIN' }
  });

  console.log(`Updated ${updated.count} user(s) to SUPERADMIN`);
  
  // List all users
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
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
