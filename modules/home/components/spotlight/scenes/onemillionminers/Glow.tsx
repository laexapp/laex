export default function Glow() {
  return (
    <>

      {/* Glow superior izquierdo */}
      <div
        className="
          absolute
          left-12
          top-10
          h-40
          w-40
          rounded-full
          bg-yellow-300/20
          blur-[80px]
          animate-pulse
        "
      />

      {/* Glow central */}
      <div
        className="
          absolute
          left-1/2
          top-1/3
          h-52
          w-52
          -translate-x-1/2
          rounded-full
          bg-amber-300/10
          blur-[120px]
          animate-pulse
        "
        style={{
          animationDuration: "5s",
        }}
      />

      {/* Glow derecho */}
      <div
        className="
          absolute
          right-10
          bottom-16
          h-44
          w-44
          rounded-full
          bg-cyan-400/15
          blur-[90px]
          animate-pulse
        "
        style={{
          animationDuration: "7s",
        }}
      />

    </>
  );
}