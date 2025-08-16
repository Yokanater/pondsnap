'use client';
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { MiniLine, SeriesPoint } from '../../../components/PondCharts';

interface Pond {
  _id: string;
  name: string;
  note?: string;
  lat: number;
  lng: number;
  imageUrl: string;
  createdAt: string;
  sensors?: {
    tds?: SeriesPoint[];
    temperature?: SeriesPoint[];
    ph?: SeriesPoint[];
    metals?: SeriesPoint[];
  };
}

export default function PondDetail({ params }: { params: { id: string } }) {
  const [pond, setPond] = useState<Pond | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // Try API first
        const api = await axios.get((process.env.NEXT_PUBLIC_API_BASE || '') + '/ponds');
        const apiMatch = (api.data as Pond[]).find((p) => p._id === params.id);
        if (apiMatch) { setPond(apiMatch); return; }
      } catch {}

      // Fallback to local JSON
      try {
        const localJson: Pond[] = await fetch('/ponds.json').then(r => r.ok ? r.json() : []);
        const j = localJson.find(p => p._id === params.id);
        if (j) { setPond(j); return; }
      } catch {}

  // No other local sources
      setPond(null);
    })().finally(() => setLoading(false));
  }, [params.id]);

  const stats = useMemo(() => {
    function summarize(series?: SeriesPoint[]) {
      if (!series || !series.length) return null;
      const vals = series.map(s => s.v);
      const min = Math.min(...vals);
      const max = Math.max(...vals);
      const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
      const latest = vals[vals.length - 1];
      return { min, max, avg: Number(avg.toFixed(2)), latest };
    }
    return {
      tds: summarize(pond?.sensors?.tds),
      temperature: summarize(pond?.sensors?.temperature),
      ph: summarize(pond?.sensors?.ph),
      metals: summarize(pond?.sensors?.metals)
    };
  }, [pond]);

  if (loading) return <div className="max-w-4xl mx-auto">Loading…</div>;
  if (!pond) return <div className="max-w-4xl mx-auto">Pond not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-pond-green dark:text-pond-teal">{pond.name}</h1>
        <Link href="/map" className="text-sm text-pond-blue dark:text-pond-teal hover:underline">← Back to map</Link>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="relative w-full h-64 rounded-xl overflow-hidden ring-1 ring-pond-green/20 dark:ring-pond-teal/30 bg-slate-200">
          <Image src={pond.imageUrl} alt={pond.name} fill className="object-cover" />
        </div>
        <div className="space-y-3 text-sm">
          <div className="p-3 rounded-lg bg-white/60 dark:bg-white/10 border border-pond-green/20 dark:border-pond-teal/30">
            <div><strong>Coordinates:</strong> {pond.lat.toFixed(5)}, {pond.lng.toFixed(5)}</div>
            <div><strong>Recorded:</strong> {new Date(pond.createdAt).toLocaleString()}</div>
            {pond.note && <div className="mt-2 text-slate-600 dark:text-slate-300">{pond.note}</div>}
          </div>
          {stats && (
            <div className="grid grid-cols-3 gap-3 text-xs">
              {stats.tds && <div className="p-3 rounded bg-white/60 dark:bg-white/10 border border-pond-green/20 dark:border-pond-teal/30"><div className="text-slate-500">TDS</div><div className="font-medium">avg {stats.tds.avg}</div><div>min {stats.tds.min} · max {stats.tds.max}</div></div>}
              {stats.temperature && <div className="p-3 rounded bg-white/60 dark:bg-white/10 border border-pond-green/20 dark:border-pond-teal/30"><div className="text-slate-500">Temp</div><div className="font-medium">avg {stats.temperature.avg}°C</div><div>min {stats.temperature.min} · max {stats.temperature.max}</div></div>}
              {stats.ph && <div className="p-3 rounded bg-white/60 dark:bg-white/10 border border-pond-green/20 dark:border-pond-teal/30"><div className="text-slate-500">pH</div><div className="font-medium">avg {stats.ph.avg}</div><div>min {stats.ph.min} · max {stats.ph.max}</div></div>}
            </div>
          )}
        </div>
      </div>
      {(pond.sensors?.tds || pond.sensors?.temperature || pond.sensors?.ph) && (
        <div className="grid md:grid-cols-3 gap-6">
          {pond.sensors?.tds && <div><div className="mb-2 font-medium">TDS trend</div><MiniLine label="TDS" color="#2f6f55" data={pond.sensors.tds} /></div>}
          {pond.sensors?.temperature && <div><div className="mb-2 font-medium">Temperature</div><MiniLine label="Temp" color="#2b5c85" data={pond.sensors.temperature} /></div>}
          {pond.sensors?.ph && <div><div className="mb-2 font-medium">pH</div><MiniLine label="pH" color="#1d7f78" data={pond.sensors.ph} /></div>}
          {pond.sensors?.metals && <div className="md:col-span-3"><div className="mb-2 font-medium">Dissolved Metals (proxy)</div><MiniLine label="Metals" color="#7c3aed" data={pond.sensors.metals} /></div>}
        </div>
      )}

      <div className="grid md:grid-cols-4 gap-3 text-xs">
        {stats.tds && <div className="p-3 rounded bg-white/60 dark:bg-white/10 border border-pond-green/20 dark:border-pond-teal/30"><div className="text-slate-500">TDS</div><div className="font-medium">avg {stats.tds.avg}</div><div>min {stats.tds.min} · max {stats.tds.max}</div><div>latest {stats.tds.latest}</div></div>}
        {stats.temperature && <div className="p-3 rounded bg-white/60 dark:bg-white/10 border border-pond-green/20 dark:border-pond-teal/30"><div className="text-slate-500">Temp</div><div className="font-medium">avg {stats.temperature.avg}°C</div><div>min {stats.temperature.min} · max {stats.temperature.max}</div><div>latest {stats.temperature.latest}°C</div></div>}
        {stats.ph && <div className="p-3 rounded bg-white/60 dark:bg-white/10 border border-pond-green/20 dark:border-pond-teal/30"><div className="text-slate-500">pH</div><div className="font-medium">avg {stats.ph.avg}</div><div>min {stats.ph.min} · max {stats.ph.max}</div><div>latest {stats.ph.latest}</div></div>}
        {stats.metals && <div className="p-3 rounded bg-white/60 dark:bg-white/10 border border-pond-green/20 dark:border-pond-teal/30"><div className="text-slate-500">Metals</div><div className="font-medium">avg {stats.metals.avg}</div><div>min {stats.metals.min} · max {stats.metals.max}</div><div>latest {stats.metals.latest}</div></div>}
      </div>
    </div>
  );
}
