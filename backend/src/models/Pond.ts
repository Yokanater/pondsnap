import mongoose from 'mongoose';

const pondSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 60 },
  note: { type: String, maxlength: 200 },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  imageUrl: { type: String, required: true },
}, { timestamps: true });

export type PondDoc = mongoose.Document & {
  name: string;
  note?: string;
  lat: number;
  lng: number;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
};

export const Pond = mongoose.model<PondDoc>('Pond', pondSchema);
