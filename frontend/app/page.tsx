export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="text-center py-10">
        <h1 className="font-serif text-5xl mb-4 text-pond-green dark:text-pond-teal tracking-tight">PondSnap</h1>
        <p className="text-lg max-w-xl mx-auto text-slate-600 dark:text-slate-300">Capture, name and map the ponds you discover. A mindful catalog of watery micro-worlds.</p>
        <div className="mt-6 flex justify-center gap-4">
          <a href="/add" className="px-5 py-2 rounded-md bg-pond-green hover:bg-pond-teal text-white text-sm font-medium shadow">Add Pond</a>
          <a href="/map" className="px-5 py-2 rounded-md border border-pond-green dark:border-pond-teal text-pond-green dark:text-pond-teal hover:bg-pond-green/10 dark:hover:bg-pond-teal/20 text-sm font-medium">View Map</a>
        </div>
      </section>
      <section className="grid md:grid-cols-3 gap-6">
        {[
          { title: 'Snap', desc: 'Use your phone or camera to capture a pond.' },
          { title: 'Locate', desc: 'Geotag automatically with one tap.' },
          { title: 'Explore', desc: 'Browse ponds on an interactive map.' }
        ].map(card => (
          <div key={card.title} className="p-5 rounded-lg bg-white/60 dark:bg-white/10 backdrop-blur border border-pond-green/20 dark:border-pond-teal/30 shadow-sm">
            <h3 className="font-serif text-xl mb-2 text-pond-blue dark:text-pond-teal">{card.title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{card.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
