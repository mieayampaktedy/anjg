import { useState, useEffect } from 'react';
import api from '@/services/axios';

// Default fallback data jika DB belum diisi
const defaultProfile = {
  id: null,
  name: 'CV Globalindo Teknik Mandiri',
  tagline: 'Pabrikator & Supplier Peralatan Teknik Industri Nasional',
  established: '2009',
  history: '',
  vision: '',
  mission: '',
  phone: '+62 251-8329302',
  email: 'sales@globalindoteknikmandiri.co.id',
  address: 'Jl. Raya Johar No. 26, RT.005/RW.004, Kel. Cibadak, Kec. Tanah Sareal, Kota Bogor, Jawa Barat 16161',
  map_url: '',
  whatsapp_number: '6281234567890',
  hours_weekday: 'Senin - Jumat: 08.00 - 17.00 WIB',
  hours_saturday: 'Sabtu: 08.00 - 14.00 WIB',
  hours_sunday: 'Minggu & Hari Libur Nasional: Tutup',
  hero_title: 'Mitra Penyedia Peralatan Jalan, Mesin Pertanian, dan Alat Uji Laboratorium Berstandar Industri',
  hero_subtitle: 'Sejak 2009, kami menyuplai kebutuhan pengadaan proyek swasta nasional, BUMN, dan tender pemerintah ke seluruh wilayah Indonesia dengan workshop lokal di Bogor.',
  footer_tagline: 'Mitra terpercaya dalam penyediaan peralatan industri dan manufaktur. Melayani perusahaan-perusahaan terkemuka di seluruh Indonesia.',
  whatsapp_text: 'Halo%20CV%20Globalindo%20Teknik%20Mandiri,%20saya%20ingin%20berkonsultasi%20mengenai%20pengadaan%20alat.',
  logo_url: '/logo.png',
};

let cachedProfile = null;
let cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function useCompanyProfile() {
  const [profile, setProfile] = useState(cachedProfile || defaultProfile);
  const [loading, setLoading] = useState(!cachedProfile);

  useEffect(() => {
    const now = Date.now();
    if (cachedProfile && now - cacheTime < CACHE_TTL) {
      return;
    }

    api.get('/public/profile')
      .then(res => {
        const data = res.data;
        if (data && data.id) {
          const merged = { ...defaultProfile, ...data };
          cachedProfile = merged;
          cacheTime = Date.now();
          setProfile(merged);
        }
      })
      .catch(() => {
        // Use defaults on error
      })
      .finally(() => setLoading(false));
  }, []);

  const getWhatsappLink = (customText) => {
    const num = (profile.whatsapp_number || defaultProfile.whatsapp_number || '').replace(/[^0-9]/g, '');
    const text = customText 
      ? encodeURIComponent(customText) 
      : (profile.whatsapp_text || defaultProfile.whatsapp_text || '');
    return `https://wa.me/${num}?text=${text}`;
  };

  return { profile, loading, getWhatsappLink };
}

// Utility to invalidate cache (call after admin saves)
export function invalidateProfileCache() {
  cachedProfile = null;
  cacheTime = 0;
}
