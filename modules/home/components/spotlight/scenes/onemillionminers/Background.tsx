export default function Background() {
  return (
    <>

      {/* Halo dorado principal */}
      <div
        className="
          absolute
          -left-24
          top-10
          h-96
          w-96
          rounded-full
          bg-yellow-400/20
          blur-[140px]
        "
      />

      {/* Halo azul derecho */}
      <div
        className="
          absolute
          -right-24
          bottom-0
          h-[420px]
          w-[420px]
          rounded-full
          bg-cyan-400/15
          blur-[160px]
        "
      />

      {/* Luz central */}
      <div
        className="
          absolute
          left-1/2
          top-1/2
          h-72
          w-72
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-white/5
          blur-[120px]
        "
      />

    </>
  );
}