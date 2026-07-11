import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex items-center">
      <Image
        src="/brand/logo/logo-header.png"
        alt="LAEX"
        width={1536}
        height={1024}
        priority
        style={{
          width: "220px",
          height: "auto",
        }}
      />
    </div>
  );
}