export default function IdentityMessage({ children, success = false }: { children: React.ReactNode; success?: boolean }) {
  return <div role="status" className={`mt-5 rounded-2xl border px-4 py-3 text-center text-xs ${success ? "border-emerald-300/20 bg-emerald-300/[0.06] text-emerald-200" : "border-rose-300/20 bg-rose-300/[0.06] text-rose-200"}`}>{children}</div>;
}
