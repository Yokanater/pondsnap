'use client';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface PondForm {
  name: string;
  note: string;
  lat: number | null;
  lng: number | null;
  imageFile: File | null;
}

const nameSuggestions = ['Willow Mirror', 'Dragonfly Haven', 'Moonlit Basin', 'Reed Whisper', 'Pebble Hollow'];

export default function AddPondPage() {
  const [form, setForm] = useState<PondForm>({ name: '', note: '', lat: null, lng: null, imageFile: null });
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        setForm(f => ({ ...f, lat: pos.coords.latitude, lng: pos.coords.longitude }));
      });
    }
  }, []);

  function handleChange<K extends keyof PondForm>(key: K, value: PondForm[K]) {
    setForm(f => ({ ...f, [key]: value }));
    if (key === 'name') {
      const v = (value as string).toLowerCase();
      setSuggestions(nameSuggestions.filter(s => s.toLowerCase().includes(v)).slice(0, 5));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (!form.name.trim()) return setError('Name required');
    if (!form.imageFile) return setError('Image required');
    if (form.note.length > 200) return setError('Note too long');
    try {
      setSubmitting(true);
      const data = new FormData();
      data.append('name', form.name.trim());
      data.append('note', form.note.trim());
      if (form.lat && form.lng) {
        data.append('lat', String(form.lat));
        data.append('lng', String(form.lng));
      }
      data.append('image', form.imageFile);
      await axios.post(process.env.NEXT_PUBLIC_API_BASE + '/ponds', data);
      setSuccess(true);
      setForm({ name: '', note: '', lat: form.lat, lng: form.lng, imageFile: null });
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="font-serif text-3xl mb-6 text-pond-green dark:text-pond-teal">Add Pond</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={e => handleChange('name', e.target.value)}
            className="w-full rounded-md border border-pond-green/40 dark:border-pond-teal/40 bg-white/70 dark:bg-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pond-teal"
            placeholder="E.g. Willow Mirror"
            maxLength={60}
            required
          />
          {suggestions.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-2">
              {suggestions.map(s => (
                <button type="button" key={s} onClick={() => handleChange('name', s)} className="text-xs px-2 py-1 bg-pond-green/10 dark:bg-pond-teal/30 rounded hover:bg-pond-green/20 dark:hover:bg-pond-teal/40 transition">
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Note</label>
            <textarea
              value={form.note}
              onChange={e => handleChange('note', e.target.value)}
              className="w-full rounded-md border border-pond-green/40 dark:border-pond-teal/40 bg-white/70 dark:bg-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pond-teal resize-none"
              placeholder="Short note (max 200 chars)"
              maxLength={200}
              rows={3}
            />
            <div className="text-xs text-slate-500 dark:text-slate-400 text-right">{form.note.length}/200</div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Latitude</label>
            <input readOnly value={form.lat ?? ''} className="w-full rounded-md border border-pond-green/30 dark:border-pond-teal/30 bg-white/50 dark:bg-white/10 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Longitude</label>
            <input readOnly value={form.lng ?? ''} className="w-full rounded-md border border-pond-green/30 dark:border-pond-teal/30 bg-white/50 dark:bg-white/10 px-3 py-2 text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Photo *</label>
          <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={e => handleChange('imageFile', e.target.files?.[0] || null)} className="block w-full text-sm" required />
        </div>
        {error && <div className="text-sm text-red-600 dark:text-red-400">{error}</div>}
        {success && <div className="text-sm text-green-700 dark:text-green-400">Saved.</div>}
        <button disabled={submitting} className="px-4 py-2 rounded-md bg-pond-green hover:bg-pond-teal text-white text-sm font-medium disabled:opacity-60">
          {submitting ? 'Saving...' : 'Save Pond'}
        </button>
      </form>
    </div>
  );
}
