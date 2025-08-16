'use client';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend);

export type SeriesPoint = { t: string | number | Date; v: number };

function lineOptions(label: string, color: string): ChartOptions<'line'> {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { mode: 'nearest' as const, intersect: false } },
    scales: {
      x: { type: 'time', time: { unit: 'day' as const }, grid: { display: false }, ticks: { color: '#94a3b8' } },
      y: { grid: { color: 'rgba(148,163,184,0.2)' }, ticks: { color: '#94a3b8' } }
    },
    elements: { point: { radius: 2 }, line: { tension: 0.3, borderColor: color as any, backgroundColor: (color + '33') as any } }
  };
}

export function MiniLine({ label, color, data }: { label: string; color: string; data: SeriesPoint[] }) {
  const ds = {
    labels: data.map(d => d.t),
    datasets: [
      { label, data: data.map(d => d.v), borderColor: color, backgroundColor: color + '33', fill: true }
    ]
  } as const;
  return <div style={{ height: 120 }}><Line data={ds as any} options={lineOptions(label, color)} /></div>;
  
}
