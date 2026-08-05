import { MapPin, Star } from 'lucide-react'

export default function JobCard({ offer }) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-bg-card) p-7 shadow-(--shadow-card) transition hover:-translate-y-1 hover:border-(--color-cta)">
      <span className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-(--color-cta) to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      <span className="mb-4 inline-flex w-fit rounded-full border border-(--color-cta)/30 bg-(--color-cta)/10 px-3 py-1 text-xs font-bold tracking-wide text-(--color-cta)">
        {offer.category}
      </span>

      <h3 className="text-lg font-bold leading-snug text-(--color-text-main)">{offer.title}</h3>
      <p className="mt-1 text-sm text-(--color-text-muted)">{offer.company}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {offer.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-(--color-bg-input) px-3 py-1 text-xs text-(--color-text-muted)"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-(--color-border) pt-4 text-sm">
        <span className="flex items-center gap-1 text-(--color-text-muted)">
          <MapPin size={14} /> {offer.location}
        </span>
        {offer.rating ? (
          <span className="flex items-center gap-1 font-semibold text-(--color-accent)">
            <Star size={14} className="fill-current" /> {offer.rating}
          </span>
        ) : (
          <span className="rounded-full bg-(--color-accent)/15 px-2.5 py-0.5 text-xs font-semibold text-(--color-accent)">
            Nuevo
          </span>
        )}
      </div>

      <p className="mt-4 text-right text-sm font-bold text-(--color-text-main)">{offer.price}</p>
    </div>
  )
}
