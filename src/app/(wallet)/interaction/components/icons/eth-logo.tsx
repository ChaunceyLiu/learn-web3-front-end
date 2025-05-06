// components/icons/eth-logo.tsx
export function EthLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 0c8.837 0 16 7.163 16 16s-7.163 16-16 16S0 24.837 0 16 7.163 0 16 0z"
        fill="#627EEA"
      />
      <path d="M16.498 4v8.87l7.497 3.35z" fill="#FFF" />
      <path d="M16.498 4L9 16.22l7.498-3.35z" fill="#FFF" />
      <path d="M16.498 21.968v6.027L24 17.616z" fill="#FFF" />
      <path d="M16.498 27.995v-6.028L9 17.616z" fill="#FFF" />
      <path d="M16.498 20.573l7.497-4.353-7.497-3.348z" fill="#FFF" />
      <path d="M9 16.22l7.498 4.353v-7.701z" fill="#FFF" />
    </svg>
  );
}
