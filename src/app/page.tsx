export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-16">
      <section className="max-w-3xl">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-amber-300">
          Mahjong hand prediction
        </p>

        <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
          Higher or lower?
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-emerald-100/70">
          Predict whether the next Mahjong hand will have a higher or lower
          value than the current hand.
        </p>
      </section>
    </main>
  );
}