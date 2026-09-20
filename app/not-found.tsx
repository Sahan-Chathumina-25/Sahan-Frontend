import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <p className="font-mono text-sm text-primary">404</p>
      <h1 className="mt-3 font-display text-4xl font-bold text-paper">Packet lost.</h1>
      <p className="mt-3 text-paper-dim">
        The page you&apos;re looking for doesn&apos;t exist or was moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-md bg-primary px-5 py-3 text-sm font-semibold text-ink-950 hover:opacity-90"
      >
        Back home
      </Link>
    </div>
  );
}
