export default function OneMillionMinersScene() {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[34px] pointer-events-none">

      {/* Halo dorado */}
      <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-yellow-400/20 blur-[120px]" />

      {/* Halo azul */}
      <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-cyan-400/20 blur-[140px]" />

      {/* Partícula 1 */}
      <div className="absolute left-[18%] top-[20%] h-2 w-2 rounded-full bg-yellow-300 opacity-70" />

      {/* Partícula 2 */}
      <div className="absolute left-[65%] top-[28%] h-3 w-3 rounded-full bg-cyan-300 opacity-70" />

      {/* Partícula 3 */}
      <div className="absolute left-[80%] top-[70%] h-2 w-2 rounded-full bg-white opacity-60" />

    </div>
  );
}