import Link from "next/link";

type Props = {
  action: string;
  url: string;
};

export default function SpotlightButton({ action, url }: Props) {
  return (
    <Link
      href={url}
      className="
        inline-flex
        items-center
        justify-center
        rounded-xl
        bg-cyan-500/95
        px-7
        py-3
        text-sm
        font-semibold
        tracking-wide
        text-white
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:bg-cyan-400
        hover:shadow-[0_0_35px_rgba(0,212,255,.45)]
        active:scale-95
      "
    >
      {action}
    </Link>
  );
}