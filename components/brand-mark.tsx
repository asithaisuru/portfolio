export function BrandMark({ className = 'size-10' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect width="48" height="48" rx="15" fill="#233c62" />
      <path d="M10 33 20 14l10 19M14 26h12" stroke="#fffdf5" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M36 24v9" stroke="#9bd5c4" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="36" cy="16" r="2.8" fill="#f5b768" />
    </svg>
  );
}
