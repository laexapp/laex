'use client';

import Image from 'next/image';
import { ImageOff, Search } from 'lucide-react';
import { useState, type PointerEvent } from 'react';

const officialPrinterRoot = '/assets/lf-printer/official/printers/';

export function PrinterVisual({ src, alt, priority = false, compact = false, stage = 'light' }: { src?: string; alt: string; priority?: boolean; compact?: boolean; stage?: 'light' | 'dark' | 'transparent' }) {
  const [lens, setLens] = useState<{ x: number; y: number } | null>(null);
  const [touchZoom, setTouchZoom] = useState(false);
  if (!src) return <div className="grid h-full w-full place-items-center bg-slate-100 text-center text-slate-600"><div><ImageOff className="mx-auto" size={compact ? 24 : 42}/><strong className="mt-3 block text-xs uppercase tracking-[.16em]">Imagen pendiente</strong><span className="mt-1 block text-[10px] text-slate-500">Media oficial no asociada</span></div></div>;
  const isOfficialTransparentAsset = src.startsWith(officialPrinterRoot);
  const zoomable = priority && !compact;
  const dark = stage === 'dark' || zoomable;
  function move(event: PointerEvent<HTMLDivElement>) {
    if (!zoomable || event.pointerType !== 'mouse') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    setLens({ x: Math.max(0, Math.min(100, ((event.clientX - bounds.left) / bounds.width) * 100)), y: Math.max(0, Math.min(100, ((event.clientY - bounds.top) / bounds.height) * 100)) });
  }
  return <div className={`relative h-full w-full overflow-hidden ${dark ? 'bg-[radial-gradient(circle_at_50%_35%,#263441_0%,#0b1118_48%,#020407_100%)]' : stage === 'transparent' ? 'bg-transparent' : 'bg-white'} ${zoomable ? 'cursor-zoom-in touch-pinch-zoom' : ''}`} onPointerMove={move} onPointerLeave={() => setLens(null)} onDoubleClick={() => zoomable && setTouchZoom((value) => !value)}>
    <Image src={src} alt={alt} fill priority={priority} unoptimized={isOfficialTransparentAsset} sizes={compact ? '160px' : '(max-width:1024px) 92vw,42vw'} className={`${compact ? 'p-2' : 'p-5 sm:p-8'} object-contain transition-transform duration-300 ${dark ? 'drop-shadow-[0_24px_28px_rgba(0,0,0,.75)]' : ''} ${touchZoom ? 'scale-[1.7]' : ''}`}/>
    {zoomable && lens && <div aria-hidden className="pointer-events-none absolute hidden size-52 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/80 shadow-[0_18px_55px_rgba(0,0,0,.65)] lg:block" style={{ left: `${lens.x}%`, top: `${lens.y}%`, backgroundImage: `url(${src})`, backgroundRepeat: 'no-repeat', backgroundColor: '#05080c', backgroundSize: '250%', backgroundPosition: `${lens.x}% ${lens.y}%` }}/>} 
    {zoomable && <span className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-black/65 px-4 py-2 text-[10px] font-bold text-white/85 backdrop-blur"><Search size={13}/><span className="hidden lg:inline">Mueve el cursor para ampliar</span><span className="lg:hidden">Toca dos veces o amplía con los dedos</span></span>}
  </div>;
}
