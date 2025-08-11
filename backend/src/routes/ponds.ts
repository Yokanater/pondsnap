import { Router } from 'express';
import { Pond } from '../models/Pond';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const router = Router();

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'pondsnap',
    resource_type: 'image',
    format: 'jpg',
    transformation: [{ width: 1600, height: 1600, crop: 'limit' }]
  })
});

const upload = multer({ storage });

router.get('/', async (req, res) => {
  const ponds = await Pond.find().sort({ createdAt: -1 }).lean();
  res.json(ponds);
});

router.get('/export', async (_req, res) => {
  const ponds = await Pond.find().lean();
  res.setHeader('Content-Disposition', 'attachment; filename="ponds.json"');
  res.json(ponds);
});

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, note, lat, lng } = req.body;
    if (!name) return res.status(400).json({ message: 'Name required' });
    if (!req.file || !('path' in req.file)) return res.status(400).json({ message: 'Image required' });
    if (!lat || !lng) return res.status(400).json({ message: 'Coordinates required' });

    const pond = await Pond.create({
      name: name.trim(),
      note: (note || '').trim(),
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      imageUrl: (req.file as any).path
    });
    res.status(201).json(pond);
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
