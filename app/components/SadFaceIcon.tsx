export default function SadFaceIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="32" cy="32" r="25" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="23" cy="26" r="2.2" fill="currentColor" />
      <circle cx="41" cy="26" r="2.2" fill="currentColor" />
      <path d="M21.5 44c2.3-6.1 6.4-9.2 10.5-9.2s8.2 3.1 10.5 9.2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
