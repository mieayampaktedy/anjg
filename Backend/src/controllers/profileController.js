const prisma = require('../config/db');

const getProfile = async (req, res) => {
  try {
    let profile = await prisma.companyProfile.findFirst();
    if (!profile) {
      // Create empty profile if not exists
      profile = await prisma.companyProfile.create({
        data: {
          name: '',
          tagline: '',
          established: '',
          history: '',
          vision: '',
          mission: '',
          phone: '',
          email: '',
          address: '',
          map_url: '',
          whatsapp_number: '',
          whatsapp_text: '',
          hours_weekday: '',
          hours_saturday: '',
          hours_sunday: '',
          hero_title: '',
          hero_subtitle: '',
          footer_tagline: '',
          home_divisions: '',
          home_cta_title: '',
          home_cta_desc: '',
          home_credentials_desc: '',
          home_workshop_location: '',
          home_workshop_acreage: '',
          home_workshop_facilities: '',
          home_procurement_workflow: '',
          home_procurement_support: ''
        }
      });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const updateProfile = async (req, res) => {
  try {
    const {
      name,
      tagline,
      established,
      history,
      vision,
      mission,
      phone,
      email,
      address,
      map_url,
      whatsapp_number,
      whatsapp_text,
      hours_weekday,
      hours_saturday,
      hours_sunday,
      hero_title,
      hero_subtitle,
      footer_tagline,
      home_divisions,
      home_cta_title,
      home_cta_desc,
      home_credentials_desc,
      home_workshop_location,
      home_workshop_acreage,
      home_workshop_facilities,
      home_procurement_workflow,
      home_procurement_support
    } = req.body;
    
    let profile = await prisma.companyProfile.findFirst();
    
    const updateData = {
      name,
      tagline,
      established,
      history,
      vision,
      mission,
      phone,
      email,
      address,
      map_url,
      whatsapp_number,
      whatsapp_text,
      hours_weekday,
      hours_saturday,
      hours_sunday,
      hero_title,
      hero_subtitle,
      footer_tagline,
      home_divisions,
      home_cta_title,
      home_cta_desc,
      home_credentials_desc,
      home_workshop_location,
      home_workshop_acreage,
      home_workshop_facilities,
      home_procurement_workflow,
      home_procurement_support
    };

    if (req.files) {
      const fs = require('fs');
      const path = require('path');
      
      if (req.files.about_image && req.files.about_image[0]) {
        if (profile && profile.about_image_url) {
          const oldImagePath = path.join(__dirname, '../../public', profile.about_image_url);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        updateData.about_image_url = `/uploads/${req.files.about_image[0].filename}`;
      }

      if (req.files.workshop_image && req.files.workshop_image[0]) {
        if (profile && profile.workshop_image_url) {
          const oldImagePath = path.join(__dirname, '../../public', profile.workshop_image_url);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        updateData.workshop_image_url = `/uploads/${req.files.workshop_image[0].filename}`;
      }

      if (req.files.logo && req.files.logo[0]) {
        if (profile && profile.logo_url) {
          const oldImagePath = path.join(__dirname, '../../public', profile.logo_url);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        updateData.logo_url = `/uploads/${req.files.logo[0].filename}`;
      }
    }

    if (profile) {
      profile = await prisma.companyProfile.update({
        where: { id: profile.id },
        data: updateData
      });
    } else {
      profile = await prisma.companyProfile.create({
        data: updateData
      });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getProfile,
  updateProfile
};

