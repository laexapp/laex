"use client";

import { Activity, AreaChart, CandlestickChart, Search, Sparkles, TriangleAlert } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { assets } from "@/lab-market-intelligence/data";
import type { MarketAsset } from "@/lab-market-intelligence/domain";

const W=900,H=330;
type ChartMode="candles"|"line"|"area";

function sourcesFor(asset:MarketAsset){
  if(asset.slug==="omd") return [{name:"Cuestores",delta:-1.4,state:"Presión vendedora"},{name:"P2V",delta:.3,state:"Compra absorbente"},{name:"Mercado agregado",delta:-.2,state:"Estabilización"}];
  if(asset.slug==="ethereum") return [{name:"Binance",delta:.08,state:"Estable"},{name:"Coinbase",delta:-.04,state:"Estable"},{name:"Kraken",delta:.11,state:"Estable"},{name:"Bybit",delta:-.06,state:"Estable"}];
  if(asset.slug==="bitcoin") return [{name:"Binance",delta:.12,state:"Estable"},{name:"Coinbase",delta:.06,state:"Estable"},{name:"Kraken",delta:-.08,state:"Estable"},{name:"Bybit",delta:.04,state:"Estable"}];
  return [];
}

function insightFor(asset:MarketAsset){
  if(asset.slug==="omd") return "OMD mantiene presión vendedora simulada en Cuestores. Una compra relevante en P2V absorbe parte del movimiento y reduce la diferencia entre mercados.";
  if(asset.slug==="ethereum") return "Ethereum presenta un comportamiento uniforme entre Binance, Coinbase, Kraken y Bybit. No se observan diferencias relevantes de liquidez en esta simulación.";
  if(asset.slug==="bitcoin") return "Bitcoin conserva profundidad consistente. Los proveedores observados se mantienen alineados y el spread agregado permanece contenido.";
  return "LAEX todavía no dispone de mercados, pares ni liquidez. El activo es conceptual y no puede producir una explicación de mercado válida.";
}

export default function MarketTerminal({initialSlug}:{initialSlug:string}){
  const[slug,setSlug]=useState(initialSlug),[mode,setMode]=useState<ChartMode>("candles"),[query,setQuery]=useState(""),[tick,setTick]=useState(0);
  const asset=assets.find(item=>item.slug===slug)??assets[0];
  useEffect(()=>{const timer=window.setInterval(()=>setTick(value=>value+1),2400);return()=>window.clearInterval(timer)},[]);
  const points=useMemo(()=>asset.chart.map((point,index)=>Math.max(0,point+(asset.metric.price?Math.sin((tick+index)*.83)*1.4:0))),[asset,tick]);
  const max=Math.max(...points,1),min=Math.min(...points,0),span=Math.max(max-min,1);
  const xy=(point:number,index:number)=>({x:(index/(points.length-1))*W,y:H-((point-min)/span)*(H-34)-17});
  const poly=points.map((point,index)=>{const p=xy(point,index);return`${p.x},${p.y}`}).join(" ");
  const area=`0,${H} ${poly} ${W},${H}`;
  const filtered=assets.filter(item=>`${item.name} ${item.symbol} ${item.blockchain}`.toLowerCase().includes(query.toLowerCase()));
  const sources=sourcesFor(asset),deviation=sources.length?Math.max(...sources.map(item=>item.delta))-Math.min(...sources.map(item=>item.delta)):0;

  return <section className="relative overflow-hidden rounded-[2rem] border border-white/[.09] bg-[linear-gradient(145deg,rgba(10,22,37,.97),rgba(3,7,12,.98))] shadow-[0_32px_100px_rgba(0,0,0,.46)]">
    <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-violet-400/[.055] blur-3xl"/>
    <header className="relative grid gap-4 border-b border-white/[.07] p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-center">
      <div className="relative max-w-xl"><Search className="absolute left-4 top-3.5 text-slate-500" size={17}/><input aria-label="Buscar y cambiar activo" value={query} onChange={event=>setQuery(event.target.value)} placeholder={`${asset.name} · ${asset.symbol} · Buscar otro activo`} className="h-12 w-full rounded-2xl border border-white/[.09] bg-black/25 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-cyan-200/40 focus:outline-none"/>{query&&<div className="absolute inset-x-0 top-14 z-20 rounded-2xl border border-white/10 bg-[#09111e] p-2 shadow-2xl">{filtered.map(item=><button key={item.assetId} onClick={()=>{setSlug(item.slug);setQuery("")}} className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm hover:bg-white/[.05]"><span><b>{item.name}</b><small className="ml-2 text-slate-500">{item.symbol}</small></span><span className="text-xs text-slate-600">{item.blockchain}</span></button>)}</div>}</div>
      <div className="flex flex-wrap gap-2">{([{id:"candles",label:"Velas",icon:CandlestickChart},{id:"line",label:"Línea",icon:Activity},{id:"area",label:"Área",icon:AreaChart}] as const).map(item=><button key={item.id} onClick={()=>setMode(item.id)} aria-pressed={mode===item.id} className={`flex h-10 items-center gap-2 rounded-xl border px-3 text-xs font-bold transition ${mode===item.id?"border-cyan-200/30 bg-cyan-300/[.09] text-cyan-100":"border-white/[.07] text-slate-500 hover:text-white"}`}><item.icon size={14}/>{item.label}</button>)}</div>
    </header>

    <div className="relative flex flex-col gap-4 border-b border-white/[.06] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"><div className="flex items-baseline gap-3"><strong className="text-2xl tracking-[-.04em]">{asset.name}</strong><span className="text-sm text-slate-500">{asset.symbol}</span><span className={`text-sm font-bold ${asset.metric.change24h>=0?"text-emerald-300":"text-rose-300"}`}>{asset.metric.change24h>=0?"+":""}{asset.metric.change24h}%</span></div><div className="flex items-center gap-2 text-xs font-semibold text-slate-400"><span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-40"/><span className="relative h-2.5 w-2.5 rounded-full bg-emerald-300"/></span>Movimiento simulado · actualización 2,4 s</div></div>

    <div className="relative p-4 sm:p-6"><svg viewBox={`0 0 ${W} ${H}`} className="h-auto min-h-[260px] w-full" role="img" aria-label={`${mode} simulado de ${asset.name}`}><defs><linearGradient id={`terminal-${asset.slug}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#37d8ee" stopOpacity=".32"/><stop offset="1" stopColor="#37d8ee" stopOpacity="0"/></linearGradient><pattern id="terminal-grid" width="90" height="55" patternUnits="userSpaceOnUse"><path d="M 90 0 L 0 0 0 55" fill="none" stroke="rgba(148,163,184,.10)"/></pattern></defs><rect width={W} height={H} fill="url(#terminal-grid)"/>{mode==="area"&&<polygon points={area} fill={`url(#terminal-${asset.slug})`} className="transition-all duration-700"/>}{mode!=="candles"&&<polyline points={poly} fill="none" stroke={mode==="line"?"#60a5fa":"#37d8ee"} strokeWidth={mode==="line"?2.2:3} vectorEffect="non-scaling-stroke" className="transition-all duration-700"/>}{mode==="candles"&&points.slice(1).map((value,index)=>{const prev=points[index],open=prev,close=value,high=Math.max(open,close)+1.4+(index%3)*.35,low=Math.max(0,Math.min(open,close)-1.1-(index%2)*.4),pOpen=xy(open,index+1),pClose=xy(close,index+1),pHigh=xy(high,index+1),pLow=xy(low,index+1),up=close>=open,color=up?"#4ade80":"#fb7185";return <g key={index} className="transition-all duration-700"><line x1={pHigh.x} x2={pLow.x} y1={pHigh.y} y2={pLow.y} stroke={color} strokeWidth="1.5"/><rect x={pOpen.x-9} y={Math.min(pOpen.y,pClose.y)} width="18" height={Math.max(3,Math.abs(pClose.y-pOpen.y))} rx="2" fill={color} opacity=".9"/></g>})}<line x1="0" x2={W} y1={xy(points.at(-1)??0,points.length-1).y} y2={xy(points.at(-1)??0,points.length-1).y} stroke={asset.metric.change24h>=0?"#4ade80":"#fb7185"} strokeDasharray="5 7" opacity=".45"/></svg><div className="mt-4 grid h-14 grid-cols-12 items-end gap-1.5">{points.slice(-12).map((point,index)=><span key={index} className={`rounded-t transition-all duration-700 ${index%4===0?"bg-violet-400/35":asset.metric.change24h>=0?"bg-emerald-300/25":"bg-rose-300/25"}`} style={{height:`${Math.max(16,(point/max)*100)}%`}}/>)}</div></div>

    <div className="grid border-t border-white/[.07] lg:grid-cols-[1.15fr_.85fr]"><article className="border-b border-white/[.07] p-5 sm:p-6 lg:border-b-0 lg:border-r"><div className="flex items-center gap-2 text-violet-300"><Sparkles size={16}/><span className="text-xs font-bold uppercase tracking-[.16em]">Inteligencia del mercado</span></div><p className="mt-4 text-[15px] leading-7 text-slate-300">{insightFor(asset)}</p><p className="mt-4 text-sm leading-6 text-slate-500">Explicación simulada basada en el dataset del laboratorio. No constituye recomendación ni detecta operaciones reales.</p></article><article className="p-5 sm:p-6"><div className="flex items-center justify-between gap-3"><span className="text-xs font-bold uppercase tracking-[.16em] text-slate-400">Mercados observados</span>{deviation>1.5?<span className="flex items-center gap-1 text-xs text-orange-300"><TriangleAlert size={13}/>Desviación {deviation.toFixed(1)}%</span>:sources.length?<span className="text-xs text-blue-300">Comportamiento alineado</span>:<span className="text-xs text-slate-600">Sin proveedores</span>}</div><div className="mt-4 space-y-2">{sources.length?sources.map(source=><div key={source.name} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-xl border border-white/[.06] bg-black/15 px-3 py-2.5 text-xs"><b className="text-slate-300">{source.name}</b><span className={Math.abs(source.delta)>1?"text-orange-300":source.delta>=0?"text-emerald-300":"text-rose-300"}>{source.delta>=0?"+":""}{source.delta}%</span><span className="hidden text-slate-500 sm:block">{source.state}</span></div>):<p className="rounded-xl border border-dashed border-white/[.08] p-4 text-sm text-slate-600">No existen mercados autorizados para este activo.</p>}</div></article></div>
  </section>;
}
