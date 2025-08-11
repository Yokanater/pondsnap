'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Image from 'next/image';

interface Pond {
  _id: string;
  name: string;
  note?: string;
  lat: number;
  lng: number;
  imageUrl: string;
  createdAt: string;
}

// Simple custom marker icon (fallback to default path fix if bundler changes)
const icon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function PondMap({ ponds }: { ponds: Pond[] }) {
  const center = ponds.length ? [ponds[0].lat, ponds[0].lng] : [20, 0];
  return (
    <MapContainer center={center as any} zoom={3} className="w-full h-full" scrollWheelZoom>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
      {ponds.map(p => (
        <Marker key={p._id} position={[p.lat, p.lng]} icon={icon}>
          <Popup>
            <div className="space-y-2 max-w-[180px]">
              <div className="relative w-full h-24 rounded overflow-hidden bg-slate-200">
                <Image src={p.imageUrl} alt={p.name} fill className="object-cover" />
              </div>
              <div>
                <h3 className="font-serif text-base text-pond-green dark:text-pond-teal">{p.name}</h3>
                {p.note && <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">{p.note}</p>}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
