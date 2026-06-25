const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const defaultProfile = {
    name: 'CV Globalindo Teknik Mandiri',
    tagline: 'Pabrikator & Supplier Peralatan Teknik Industri Nasional',
    established: '2009',
    history: 'Didirikan pada tahun 2009, CV Globalindo Teknik Mandiri telah berkembang menjadi salah satu perusahaan fabrikasi dan suplai peralatan teknik industri terkemuka di Indonesia. Kami berawal dari sebuah workshop kecil di Bogor yang berfokus pada alat uji material, dan kini telah mengekspansi lini produksi ke alat marka jalan, peralatan pertanian, dan alat uji pertambangan. Dengan komitmen pada kualitas dan inovasi, kami terus dipercaya oleh berbagai instansi pemerintah, BUMN, dan swasta nasional.',
    vision: 'Menjadi mitra pengadaan peralatan industri dan manufaktur yang paling terpercaya, inovatif, dan berkontribusi pada pembangunan infrastruktur serta kemandirian teknologi di Indonesia.',
    mission: '1. Memproduksi peralatan teknik yang memenuhi standar kualitas nasional dan internasional.\n2. Memberikan layanan purna jual yang responsif dan solutif bagi seluruh klien.\n3. Terus berinovasi dalam desain produk untuk meningkatkan efisiensi dan keamanan kerja.\n4. Membangun kemitraan jangka panjang yang saling menguntungkan dengan seluruh pemangku kepentingan.',
    phone: '+62 251-8329302',
    email: 'sales@globalindoteknikmandiri.co.id',
    address: 'Jl. Raya Johar No. 26, RT.005/RW.004, Kel. Cibadak, Kec. Tanah Sareal, Kota Bogor, Jawa Barat 16161',
    map_url: 'https://maps.app.goo.gl/...',
    whatsapp_number: '6281234567890',
    whatsapp_text: 'Halo CV Globalindo Teknik Mandiri, saya ingin berkonsultasi mengenai pengadaan alat.',
    hours_weekday: 'Senin - Jumat: 08.00 - 17.00 WIB',
    hours_saturday: 'Sabtu: 08.00 - 14.00 WIB',
    hours_sunday: 'Minggu & Hari Libur Nasional: Tutup',
    hero_title: 'Mitra Penyedia Peralatan Jalan, Mesin Pertanian, dan Alat Uji Laboratorium Berstandar Industri',
    hero_subtitle: 'Sejak 2009, kami menyuplai kebutuhan pengadaan proyek swasta nasional, BUMN, dan tender pemerintah ke seluruh wilayah Indonesia dengan workshop lokal di Bogor.',
    footer_tagline: 'Mitra terpercaya dalam penyediaan peralatan industri dan manufaktur. Melayani perusahaan-perusahaan terkemuka di seluruh Indonesia.'
  };

  let profile = await prisma.companyProfile.findFirst();
  
  if (profile) {
    await prisma.companyProfile.update({
      where: { id: profile.id },
      data: defaultProfile
    });
    console.log('Profile updated!');
  } else {
    await prisma.companyProfile.create({
      data: defaultProfile
    });
    console.log('Profile created!');
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
