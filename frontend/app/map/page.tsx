'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Pond {
  _id: string;
  name: string;
  note?: string;
  lat: number;
  lng: number;
  imageUrl: string;
  createdAt: string;
}

const Map = dynamic(() => import('../../components/PondMap'), { ssr: false });

export default function MapPage() {
  const [ponds, setPonds] = useState<Pond[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    (async () => {
      const res = await axios.get(process.env.NEXT_PUBLIC_API_BASE + '/ponds');
      setPonds(res.data);
    })();
  }, []);

  const filtered = ponds.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || (p.note || '').toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-4">
      <h1 className="font-serif text-3xl mb-2 text-pond-green dark:text-pond-teal">Map</h1>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search ponds..." className="w-full md:w-72 rounded-md border border-pond-green/40 dark:border-pond-teal/40 bg-white/70 dark:bg-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pond-teal" />
      <div className="h-[70vh] rounded-lg overflow-hidden border border-pond-green/30 dark:border-pond-teal/30">
        <Map ponds={filtered} />
      </div>
    </div>
  );
}
