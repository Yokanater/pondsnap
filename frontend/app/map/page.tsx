'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import axios from 'axios';

const PondMapView = dynamic(() => import('../../components/PondMap'), { ssr: false });

interface Pond { _id: string; name: string; note?: string; lat: number; lng: number; imageUrl: string; createdAt: string; sensors?: any }

export default function MapPage() {
  const [ponds, setPonds] = useState<Pond[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [apiRes, localJson] = await Promise.allSettled([
          axios.get((process.env.NEXT_PUBLIC_API_BASE || '') + '/ponds'),
          fetch('/ponds.json').then(r => r.ok ? r.json() : [])
        ]);

        const apiData: Pond[] = apiRes.status === 'fulfilled' ? apiRes.value.data : [];
        const jsonData: Pond[] = localJson.status === 'fulfilled' ? (localJson.value as Pond[]) : [];

        const byId = new Map<string, Pond>();
        for (const p of [...jsonData, ...apiData]) byId.set(p._id, p);
        setPonds(Array.from(byId.values()));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = ponds.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || (p.note || '').toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <h1 className="font-serif text-3xl text-pond-green dark:text-pond-teal">Map</h1>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search ponds..." className="w-full md:w-72 rounded-md border border-pond-green/40 dark:border-pond-teal/40 bg-white/70 dark:bg-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pond-teal" />
      </div>
      <div className="h-[70vh] rounded-xl overflow-hidden border border-pond-green/30 dark:border-pond-teal/30 shadow-sm bg-white/40 dark:bg-white/5">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center text-slate-500">Loading map…</div>
        ) : (
          <PondMapView ponds={filtered} />
        )}
      </div>
    </div>
  );
}
