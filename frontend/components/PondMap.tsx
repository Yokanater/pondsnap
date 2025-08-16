'use client';
import 'mapbox-gl/dist/mapbox-gl.css';
import Map, { Marker, Popup, ViewState, ViewStateChangeEvent } from 'react-map-gl';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';
import { useTheme } from './ThemeProvider';
import { MiniLine, SeriesPoint } from './PondCharts';

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

const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;

export default function PondMap({ ponds }: { ponds: Pond[] }) {
  const { theme } = useTheme();
  const [view, setView] = useState<ViewState>(() => ({ longitude: ponds[0]?.lng ?? 78.9629, latitude: ponds[0]?.lat ?? 20.5937, zoom: 3, bearing: 0, pitch: 0, padding: { top: 0, right: 0, bottom: 0, left: 0 } }));
  const [active, setActive] = useState<Pond | null>(null);

  const style = theme === 'dark' ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/light-v11';

  const markers = useMemo(() => ponds.map(p => (
    <Marker key={p._id} longitude={p.lng} latitude={p.lat}>
      <button
        aria-label={`Open ${p.name}`}
        onClick={(e) => { e.stopPropagation(); setActive(p); }}
        className="w-3.5 h-3.5 rounded-full bg-pond-green dark:bg-pond-teal ring-2 ring-white dark:ring-slate-800 shadow cursor-pointer"
      />
    </Marker>
  )), [ponds]);

  const handleMapClick = useCallback(() => setActive(null), []);

  return (
    <Map
      mapboxAccessToken={token}
      mapStyle={style}
      {...view}
      onMove={(evt: ViewStateChangeEvent) => setView(evt.viewState)}
      onClick={handleMapClick}
      style={{ width: '100%', height: '100%' }}
    >
      {markers}
      {active && (
        <Popup longitude={active.lng} latitude={active.lat} anchor="bottom" onClose={() => setActive(null)} closeOnMove={false}>
          <div className="space-y-3 max-w-[240px]">
            <div className="relative w-full h-28 rounded overflow-hidden ring-1 ring-pond-green/20 dark:ring-pond-teal/30 bg-slate-200">
              <Image src={active.imageUrl} alt={active.name} fill className="object-cover" />
            </div>
            <div>
              <h3 className="font-serif text-lg text-pond-green dark:text-pond-teal leading-tight">{active.name}</h3>
              {active.note && <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug mt-1">{active.note}</p>}
            </div>
            {(active.sensors?.tds || active.sensors?.temperature) && (
              <div className="grid grid-cols-2 gap-3">
                {active.sensors?.tds && <MiniLine label="TDS" color="#2f6f55" data={active.sensors.tds} />}            
                {active.sensors?.temperature && <MiniLine label="Temp" color="#2b5c85" data={active.sensors.temperature} />}
              </div>
            )}
            <div>
              <Link href={`/pond/${encodeURIComponent(active._id)}`} className="inline-block text-xs px-2 py-1 rounded border border-pond-green/40 dark:border-pond-teal/40 text-pond-green dark:text-pond-teal hover:bg-pond-green/10 dark:hover:bg-pond-teal/20">View details →</Link>
            </div>
          </div>
        </Popup>
      )}
    </Map>
  );
}
