export default function Particles() {
  return (
    <>
      {/* Partícula 1 */}
      <div
        className="
          absolute
          left-[18%]
          top-[22%]
          h-2
          w-2
          rounded-full
          bg-yellow-300
          shadow-[0_0_18px_#FFD700]
          animate-pulse
        "
      />

      {/* Partícula 2 */}
      <div
        className="
          absolute
          left-[68%]
          top-[18%]
          h-3
          w-3
          rounded-full
          bg-cyan-300
          shadow-[0_0_22px_#00D4FF]
          animate-pulse
        "
        style={{
          animationDuration: "4s",
        }}
      />

      {/* Partícula 3 */}
      <div
        className="
          absolute
          left-[82%]
          top-[72%]
          h-2
          w-2
          rounded-full
          bg-amber-300
          shadow-[0_0_18px_#FBBF24]
          animate-pulse
        "
        style={{
          animationDuration: "6s",
        }}
      />

      {/* Partícula 4 */}
      <div
        className="
          absolute
          left-[30%]
          top-[68%]
          h-2
          w-2
          rounded-full
          bg-white
          shadow-[0_0_16px_white]
          animate-pulse
        "
        style={{
          animationDuration: "3s",
        }}
      />

      {/* Partícula 5 */}
      <div
        className="
          absolute
          left-[52%]
          top-[42%]
          h-1.5
          w-1.5
          rounded-full
          bg-cyan-200
          shadow-[0_0_14px_#67E8F9]
          animate-pulse
        "
        style={{
          animationDuration: "5s",
        }}
      />
    </>
  );
}