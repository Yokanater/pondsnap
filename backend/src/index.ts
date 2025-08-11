import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import pondsRouter from './routes/ponds';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const { MONGODB_URI, PORT = '4000', CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
if (!MONGODB_URI) {
  console.error('MONGODB_URI missing');
  process.exit(1);
}
if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.error('Cloudinary env vars missing');
  process.exit(1);
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
});

mongoose.connect(MONGODB_URI).then(() => {
  console.log('Mongo connected');
}).catch(e => {
  console.error('Mongo error', e);
  process.exit(1);
});

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/ponds', pondsRouter);

app.listen(parseInt(PORT), () => {
  console.log('API listening on ' + PORT);
});
