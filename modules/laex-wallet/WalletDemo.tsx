"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowDownLeft, ArrowLeft, ArrowRight, ArrowUpRight, ArrowLeftRight, Check, CheckCheck, ChevronRight, Copy, Eye, EyeOff, Fingerprint, Globe, Settings, History, Info, KeyRound, LockKeyhole, Plus, RotateCcw, ShieldCheck, Smartphone, Wallet, X } from "lucide-react";
import { ASSETS, DEMO_ADDRESS, DEMO_FEE, amountText, initialDemo, inputAmount, maxSend, parseUnits, simulateReceive, simulateSend, simulateSwap, usdAmount, validateSend, type Asset, type Movement } from "./demo-model";
import { WalletExtensions, useWalletExtras, type ExtraScreen } from "./WalletExtensions";
import "./wallet-demo.css";

type Screen = ExtraScreen | "welcome" | "prepare" | "home" | "send" | "review" | "receive" | "success" | "activity" | "security" | "backup" | "future" | "details" | "about";
const money = (value: number) => value.toLocaleString("en-US", { style: "currency", currency: "USD" });

function Mark({ large = false }: { large?: boolean }) {
  return <span className={`lw-mark ${large ? "lw-mark-large" : ""}`} aria-hidden="true"><Image src="/wallet-demo/brand/laexwallet-monogram-v1.png" alt="" width={1254} height={1254} sizes={large ? "180px" : "80px"} className="lw-monogram-image" /></span>;
}
function Token({ asset }: { asset: Asset }) {
  return <span className={`lw-token lw-token-${asset.toLowerCase()}`} aria-hidden="true">{asset === "USDT" ? <svg viewBox="0 0 32 32" fill="none"><path d="M7 7h18v5h-7v14h-4V12H7z" fill="currentColor"/><ellipse cx="16" cy="16" rx="12" ry="3" stroke="currentColor" strokeWidth="1.8"/></svg> : <svg viewBox="0 0 32 32" fill="currentColor"><path d="m16 3 5 5-5 5-5-5ZM8 11l5 5-5 5-5-5Zm16 0 5 5-5 5-5-5Zm-8 8 5 5-5 5-5-5Zm0-7 4 4-4 4-4-4Z"/></svg>}</span>;
}

export function WalletDemo() {
  const extras = useWalletExtras();
  const network = extras.networks.find(item => item.id === extras.network)!;
  const extraScreens: string[] = ["networks", "add-network", "tokens", "add-token", "token-detail", "swap", "web3", "browser", "connect", "permission", "settings", "contacts", "restore", "lock"];
  const [screen, setScreen] = useState<Screen>("welcome");
  const [state, setState] = useState(initialDemo);
  const [asset, setAsset] = useState<Asset>("USDT");
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [error, setError] = useState("");
  const [hidden, setHidden] = useState(false);
  const [toast, setToast] = useState("");
  const [checked, setChecked] = useState(false);
  const [prepared, setPrepared] = useState(false);
  const [selected, setSelected] = useState<Movement | null>(null);
  const [filter, setFilter] = useState<"all" | "in" | "out">("all");
  const [resetOpen, setResetOpen] = useState(false);
  const title = useRef<HTMLHeadingElement>(null);
  const sending = useRef(false);
  const resetButton = useRef<HTMLButtonElement>(null);
  const cancelReset = useRef<HTMLButtonElement>(null);
  const total = usdAmount(state.balances.USDT, "USDT") + usdAmount(state.balances.BNB, "BNB");

  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); if (screen !== "welcome") (document.querySelector("main h1") as HTMLElement | null)?.focus({ preventScroll: true }); }, [screen]);
  useEffect(() => { if (!toast) return; const timer = window.setTimeout(() => setToast(""), 3000); return () => window.clearTimeout(timer); }, [toast]);
  useEffect(() => { if (resetOpen) cancelReset.current?.focus(); }, [resetOpen]);

  function go(next: Screen) { setError(""); setToast(""); setScreen(next); }
  function startSend(nextAsset = asset) { extras.setNetwork("56"); sending.current = false; setAsset(nextAsset); setAmount(""); setRecipient(""); go("send"); }
  async function copyAddress() {
    try { await navigator.clipboard.writeText(DEMO_ADDRESS); setToast("Identificador de prueba copiado"); }
    catch { setToast("No se pudo copiar. Mantén pulsado el identificador para copiarlo."); }
  }
  function review() { const problem = validateSend(state, asset, amount, recipient); if (problem) { setError(problem); return; } go("review"); }
  function confirmSend() {
    if (sending.current) return;
    sending.current = true;
    try { const next = simulateSend(state, asset, amount, recipient); setState(next); setSelected(next.movements[0]); go("success"); }
    catch (cause) { sending.current = false; setError(cause instanceof Error ? cause.message : "Revisa los datos del envío."); }
  }
  function receiveDemo() { const next = simulateReceive(state, asset); setState(next); setSelected(next.movements[0]); go("success"); }
  function closeReset() { setResetOpen(false); resetButton.current?.focus(); }
  function reset() { extras.reset(); setState(initialDemo()); setPrepared(false); setChecked(false); setHidden(false); setSelected(null); setFilter("all"); setResetOpen(false); setAsset("USDT"); setAmount(""); setRecipient(""); sending.current = false; go("welcome"); }
  const heading = (text: string, subtitle?: string) => <div className="lw-heading"><h1 ref={title} tabIndex={-1}>{text}</h1>{subtitle && <p>{subtitle}</p>}</div>;
  const showNav = !["welcome", "prepare", "send", "review", "success", "backup", "details", "add-network", "add-token", "connect", "permission", "restore", "lock"].includes(screen);
  const back: Partial<Record<Screen, Screen>> = { prepare: "welcome", send: "home", review: "send", receive: "home", success: "home", backup: "security", future: "home", details: "activity", about: "home" };

  function movementRow(movement: Movement) {
    return <button className="lw-movement" key={movement.id} onClick={() => { setSelected(movement); go("details"); }}>
      <span className={`lw-movement-icon ${movement.direction === "in" ? "is-in" : ""}`}>{movement.direction === "in" ? <ArrowDownLeft size={21}/> : <ArrowUpRight size={21}/>}</span>
      <span className="lw-movement-label"><b>{movement.direction === "in" ? "Recibiste" : "Enviaste"} {movement.asset}</b><small>{movement.time}</small></span>
      <span className="lw-movement-value"><b className={movement.direction === "in" ? "lw-positive" : ""}>{movement.direction === "in" ? "+" : "−"}{amountText(movement.units, movement.asset)}</b><small>Simulado</small></span>
    </button>;
  }

  return <div className="lw-demo">
    <aside className="lw-desktop-intro"><Link href="/" className="lw-desktop-back"><ArrowLeft size={17}/> Volver a LAEX</Link><div className="lw-desktop-copy"><span className="lw-eyebrow">UN NUEVO COMIENZO</span><h2>Tu wallet.<br/>Tus decisiones.<br/><em>Tu control.</em></h2><p>Así imaginamos una forma más sencilla de guardar y mover tus criptomonedas.</p><div className="lw-desktop-points"><span><Smartphone size={20}/> Pensada para tu celular</span><span><KeyRound size={20}/> Diseñada para la autocustodia</span><span><ArrowUpRight size={20}/> Una acción a la vez</span></div></div><p className="lw-desktop-foot">laexWallet · Primera demostración del producto</p></aside>
    <div className="lw-app">
      <header className="lw-header"><button className="lw-brand" onClick={() => go(screen === "welcome" ? "welcome" : "home")} aria-label="Inicio de laexWallet"><Mark/><span>laex<span>Wallet</span></span></button><button className="lw-demo-badge" onClick={() => go("about")} aria-label="Acerca de esta demostración"><i/> DEMO</button></header>
      {screen !== "welcome" && <div className="lw-demo-note"><span/> Saldos de prueba · Sin dinero real</div>}
      <main className={`lw-content lw-screen-${screen} ${showNav ? "lw-with-nav" : ""}`}>
        {extraScreens.includes(screen) && <WalletExtensions screen={screen as ExtraScreen} go={go} extras={extras} available={inputAmount(state.balances.USDT,"USDT")} balanceBNB={inputAmount(state.balances.BNB,"BNB")} swap={value=>{try { setState(simulateSwap(state,value)); return null; } catch (cause) { return cause instanceof Error ? cause.message : "No se pudo simular el intercambio."; }}}/>}
        {back[screen] && <button className="lw-back" onClick={() => go(back[screen]!)}><ArrowLeft size={19}/> {screen === "review" ? "Editar envío" : "Volver"}</button>}

        {screen === "welcome" && <section className="lw-welcome">
          <div className="lw-hero-art" aria-hidden="true"><div className="lw-orbit lw-orbit-one"/><div className="lw-orbit lw-orbit-two"/><span className="lw-spark lw-spark-one"/><span className="lw-spark lw-spark-two"/><div className="lw-hero-card"><div className="lw-hero-card-top"><span>laexWallet</span><ShieldCheck size={22}/></div><Mark large/><div className="lw-hero-card-bottom"><span>HECHA PARA TI</span><span>↗</span></div></div><span className="lw-floating-key"><KeyRound size={27}/></span></div>
          <p className="lw-eyebrow">SIMPLE. PERSONAL. TUYA.</p>
          <h1 ref={title} tabIndex={-1}>Tu dinero.<br/><em>Tu control.</em></h1>
          <p className="lw-welcome-copy">Envía, recibe y entiende cada movimiento. Tu próxima wallet empieza aquí.</p>
          <button className="lw-primary" onClick={() => go("prepare")}>Crear wallet demo <ArrowRight size={21}/></button>
          <button className="lw-text-button" onClick={() => go("home")}>Explorar con saldo de prueba <ChevronRight size={17}/></button>
          <button className="lw-text-button" onClick={()=>go("restore")}>Ya tengo una wallet <KeyRound size={17}/></button><div className="lw-welcome-disclosure"><Info size={18}/><p>Demostración interactiva. No crea claves ni mueve criptomonedas reales.</p></div>
        </section>}

        {screen === "prepare" && <section>
          <div className="lw-feature-icon"><KeyRound size={32}/></div>
          {heading("El control empieza contigo", "Una wallet de autocustodia guarda sus claves bajo tu control. Conoce lo esencial antes de explorar.")}
          <ol className="lw-lessons"><li><span>01</span><div><h2>Tu respaldo es tuyo</h2><p>La frase de recuperación permite recuperar el acceso a tu wallet.</p></div></li><li><span>02</span><div><h2>Guárdalo en privado</h2><p>Nunca compartas tu frase con nadie, incluido soporte.</p></div></li><li><span>03</span><div><h2>Aprende sin arriesgar</h2><p>Aquí usaremos saldos ficticios. No necesitas introducir una frase ni una contraseña.</p></div></li></ol>
          <label className="lw-checkbox"><input type="checkbox" checked={checked} onChange={event => setChecked(event.target.checked)}/><span>Entiendo que esta es una demostración, no una wallet real.</span></label>
          <button className="lw-primary" disabled={!checked} onClick={() => { setPrepared(true); go("home"); }}>Entrar a mi wallet demo <ArrowRight size={21}/></button>
        </section>}

        {screen === "home" && <section>
          <div className="lw-wallet-label"><span><span className="lw-avatar">L</span> {extras.walletName || "Mi wallet"}</span><button onClick={() => go("networks")} className="lw-network"><i/> {network.name} <ChevronRight size={13}/></button></div>
          <div className="lw-balance-card"><div className="lw-balance-title"><span>Balance de prueba</span><button className="lw-icon-button" onClick={() => setHidden(!hidden)} aria-label={hidden ? "Mostrar saldo" : "Ocultar saldo"}>{hidden ? <EyeOff size={20}/> : <Eye size={20}/>}</button></div><h1 ref={title} tabIndex={-1} className="lw-balance">{hidden ? "••••••" : money(extras.network === "56" ? total : 0)}<span>USD</span></h1><p>Valores ilustrativos, no cotizaciones actuales.</p><div className="lw-balance-bottom"><span><ShieldCheck size={16}/> Mi espacio personal</span><span className="lw-mini-mark">↗</span></div></div>
          <div className="lw-actions"><button onClick={() => startSend()}><span className="lw-action-main"><ArrowUpRight/></span>Enviar</button><button onClick={() => { extras.setNetwork("56"); go("receive"); }}><span><ArrowDownLeft/></span>Recibir</button><button onClick={() => go("swap")}><span><ArrowLeftRight/></span>Cambiar<small>Demo</small></button></div>
          <button className="lw-learn-card" onClick={() => go("security")}><span className="lw-learn-icon"><ShieldCheck size={23}/></span><span><b>{prepared ? "Tu seguridad, primero" : "Conoce tu respaldo"}</b><small>Tu frase secreta nunca se comparte.</small></span><ChevronRight size={19}/></button>
          <div className="lw-section-title"><h2>Mis monedas</h2><button onClick={() => go("tokens")}><Plus size={14}/> Añadir / gestionar</button></div>
          <div className="lw-asset-list">{(extras.network === "56" ? ["USDT", "BNB"] as Asset[] : []).map(item => <button key={item} className="lw-asset-row" onClick={() => startSend(item)}><Token asset={item}/><span className="lw-asset-name"><b>{ASSETS[item].name}</b><small>{item} · BNB Chain</small></span><span className="lw-asset-value"><b>{hidden ? "••••" : money(usdAmount(state.balances[item], item))}</b><small>{hidden ? "••••" : amountText(state.balances[item], item)} {item}</small></span><ChevronRight size={16}/></button>)}</div>
          {extras.network !== "56" && <p className="lw-footnote">Sin saldo de ejemplo en {network.name}. Enviar, recibir e intercambiar usan el escenario BNB Chain.</p>}
          {extras.tokens.filter(t=>t.network===extras.network).map(t=><button className="lw-menu-row" key={t.address} onClick={()=>go("tokens")}><div><b>{t.symbol}</b><small>{t.name} · Datos manuales</small></div><span>0</span></button>)}
          <button className="lw-history-link" onClick={() => go("activity")}><History size={18}/><span>Ver mis movimientos</span><ChevronRight size={18}/></button>
        </section>}

        {screen === "send" && <section>
          {heading("Envía con confianza", "Elige moneda, destinatario y cantidad. Después revisarás el envío.")}
          <form onSubmit={event => { event.preventDefault(); review(); }}>
            <fieldset className="lw-fieldset"><legend>1. Elige tu moneda</legend><div className="lw-asset-picker">{(["USDT", "BNB"] as Asset[]).map(item => <button type="button" key={item} aria-pressed={asset === item} className={asset === item ? "is-selected" : ""} onClick={() => { setAsset(item); setAmount(""); setError(""); }}><Token asset={item}/><span>{item}</span>{asset === item && <Check size={17}/>}</button>)}</div></fieldset>
            <div className="lw-field"><label htmlFor="lw-recipient">2. ¿A quién enviarás?</label><input id="lw-recipient" autoComplete="off" spellCheck={false} value={recipient} onChange={event => { setRecipient(event.target.value); setError(""); }} placeholder="Identificador de prueba" aria-describedby="lw-recipient-hint"/><p id="lw-recipient-hint">Elige un destinatario ficticio para probar:</p><div className="lw-contacts">{extras.contacts.map(contact=><button type="button" key={contact.address} onClick={()=>{setRecipient(contact.address);setError("");}}><span aria-hidden="true">{contact.name[0]}</span>{contact.name} · Demo {recipient===contact.address&&<Check size={15}/>}</button>)}</div></div>
            <div className="lw-field"><label htmlFor="lw-amount">3. ¿Cuánto quieres enviar?</label><div className="lw-amount-input"><input id="lw-amount" inputMode="decimal" autoComplete="off" placeholder="0.00" value={amount} onChange={event => { setAmount(event.target.value); setError(""); }} aria-describedby="lw-available"/><span>{asset}</span><button type="button" onClick={() => { setAmount(inputAmount(maxSend(state, asset), asset)); setError(""); }}>Máx.</button></div><p id="lw-available">Disponible: {amountText(maxSend(state, asset), asset)} {asset}</p></div>
            <div className="lw-inline-note"><Info size={19}/><p>Red propuesta: <b>BNB Chain</b>. La comisión del ejemplo es {amountText(DEMO_FEE, "BNB")} BNB.</p></div>
            {error && <p className="lw-error" role="alert">{error}</p>}
            <button className="lw-primary" type="submit">Revisar envío <ArrowRight size={21}/></button>
          </form>
        </section>}

        {screen === "review" && <section>
          {heading("Revisa antes de enviar", "Esta es tu oportunidad de comprobar cada detalle.")}
          <div className="lw-review-amount"><Token asset={asset}/><h2>{amountText(parseUnits(amount, asset) || 0, asset)} <span>{asset}</span></h2><p>≈ {money(usdAmount(parseUnits(amount, asset) || 0, asset))} USD de ejemplo</p></div>
          <dl className="lw-details"><div><dt>Desde</dt><dd>Mi wallet demo</dd></div><div><dt>Para</dt><dd>{recipient}<small>{`${extras.contacts.find(contact=>contact.address===recipient)?.name || "Contacto"} · Destinatario ficticio`}</small></dd></div><div><dt>Red propuesta</dt><dd>BNB Chain</dd></div><div><dt>Comisión simulada</dt><dd>{amountText(DEMO_FEE, "BNB")} BNB<small>{money(usdAmount(DEMO_FEE, "BNB"))} USD de ejemplo</small></dd></div><div className="lw-total"><dt>Se descontará</dt><dd>{amountText((parseUnits(amount, asset) || 0) + (asset === "BNB" ? DEMO_FEE : 0), asset)} {asset}{asset !== "BNB" && <small>+ {amountText(DEMO_FEE, "BNB")} BNB</small>}</dd></div></dl>
          <div className="lw-inline-note"><ShieldCheck size={20}/><p>En la wallet real, autorizarás el envío desde tu dispositivo. Aquí solo cambia tu saldo de prueba.</p></div>
          {error && <p className="lw-error" role="alert">{error}</p>}
          <button className="lw-primary" onClick={confirmSend}>Confirmar simulación <CheckCheck size={21}/></button>
        </section>}

        {screen === "receive" && <section>
          {heading("Recibe en tu wallet", "Así se verá el espacio para compartir tu dirección.")}
          <div className="lw-receive-tabs">{(["USDT", "BNB"] as Asset[]).map(item => <button key={item} aria-pressed={asset === item} onClick={() => setAsset(item)} className={asset === item ? "is-selected" : ""}><Token asset={item}/>{item}</button>)}</div>
          <div className="lw-receive-card"><span className="lw-receive-network">{asset} · BNB Chain</span><div className="lw-qr"><Image src="/wallet-demo/receive-demo.svg" alt="Código QR de demostración. No es una dirección de criptomonedas." width={208} height={208}/></div><span className="lw-qr-caption">QR DE PRUEBA · NO RECIBE FONDOS</span><p>Identificador de ejemplo</p><strong className="lw-demo-address">{DEMO_ADDRESS}</strong><button className="lw-secondary" onClick={() => void copyAddress()}><Copy size={18}/> Copiar identificador</button></div>
          <div className="lw-inline-note"><Info size={20}/><p>No envíes dinero a esta demo. El QR y el identificador no son una dirección real.</p></div>
          <button className="lw-primary" onClick={receiveDemo}><Plus size={20}/> Simular recepción de {asset === "USDT" ? "25 USDT" : "0.01 BNB"}</button>
        </section>}

        {screen === "success" && selected && <section className="lw-success"><div className="lw-success-icon"><Check size={44}/></div><span className="lw-eyebrow">SIMULACIÓN COMPLETADA</span>{heading(selected.direction === "in" ? "¡Saldo de prueba recibido!" : "¡Envío de prueba listo!", "No se ha movido dinero real.")}<div className="lw-success-amount">{selected.direction === "in" ? "+" : "−"}{amountText(selected.units, selected.asset)} <span>{selected.asset}</span></div><p>Tu balance y tu historial ya reflejan este movimiento de ejemplo.</p><button className="lw-primary" onClick={() => go("home")}>Volver a mi wallet <ArrowRight size={20}/></button><button className="lw-text-button" onClick={() => go("details")}>Ver detalle del movimiento <ChevronRight size={17}/></button></section>}

        {screen === "activity" && <section>{heading("Tus movimientos", "Todo lo que probaste, en un solo lugar.")}<div className="lw-filters" aria-label="Filtrar movimientos">{([{ key: "all", label: "Todos" }, { key: "in", label: "Recibidos" }, { key: "out", label: "Enviados" }] as const).map(item => <button key={item.key} aria-pressed={filter === item.key} onClick={() => setFilter(item.key)} className={filter === item.key ? "is-selected" : ""}>{item.label}</button>)}</div><p className="lw-list-label">EN ESTA DEMOSTRACIÓN</p><div className="lw-movements">{state.movements.filter(item => filter === "all" || item.direction === filter).map(movementRow)}</div>{!state.movements.some(item => filter === "all" || item.direction === filter) && <div className="lw-empty"><History size={34}/><h2>Aún no hay envíos</h2><p>Prueba tu primer movimiento con monedas ficticias.</p><button className="lw-secondary" onClick={() => startSend()}>Probar un envío <ArrowUpRight size={18}/></button></div>}</section>}

        {screen === "details" && selected && <section>{heading("Detalle del movimiento")}<div className="lw-detail-status"><CheckCheck size={18}/> Simulación completada</div><div className="lw-review-amount"><Token asset={selected.asset}/><h2>{amountText(selected.units, selected.asset)} <span>{selected.asset}</span></h2></div><dl className="lw-details"><div><dt>Movimiento</dt><dd>{selected.direction === "in" ? "Recepción" : "Envío"}</dd></div><div><dt>{selected.direction === "in" ? "Origen" : "Destino"}</dt><dd>{selected.counterparty}</dd></div><div><dt>Referencia local</dt><dd>{selected.id}</dd></div><div><dt>Red propuesta</dt><dd>BNB Chain</dd></div><div><dt>Comisión de ejemplo</dt><dd>{amountText(selected.fee, "BNB")} BNB</dd></div></dl><p className="lw-footnote">Este movimiento no existe en una blockchain. La referencia identifica únicamente esta simulación.</p><button className="lw-primary" onClick={() => go("activity")}>Ver mis movimientos <History size={20}/></button></section>}

        {screen === "security" && <section><div className="lw-feature-icon"><ShieldCheck size={32}/></div>{heading("Tu seguridad, primero", "Comprender tu wallet también es una forma de protegerla.")}<div className="lw-security-banner"><KeyRound size={25}/><div><h2>Tus claves serán solo tuyas</h2><p>En el diseño propuesto, LAEX no podrá mover tus fondos ni recuperar una frase que hayas perdido.</p></div></div><button className="lw-menu-row" onClick={() => go("backup")}><span><KeyRound/></span><div><b>Mi frase de recuperación</b><small>Aprende cómo cuidar tu respaldo</small></div><ChevronRight size={19}/></button><div className="lw-menu-row lw-menu-static"><span><Fingerprint/></span><div><b>Desbloqueo con huella</b><small>Previsto para la aplicación Android</small></div><span className="lw-planned">Después</span></div><div className="lw-menu-row lw-menu-static"><span><LockKeyhole/></span><div><b>Claves en el dispositivo</b><small>Esta demo todavía no genera claves</small></div></div><div className="lw-section-title"><h2>Sobre tu demostración</h2></div><p className="lw-footnote">Los saldos y movimientos duran mientras esta página siga abierta. Al recargar, comienzas de nuevo. No guardamos frases ni contraseñas.</p><button className="lw-secondary" ref={resetButton} onClick={() => setResetOpen(true)}><RotateCcw size={18}/> Reiniciar demostración</button></section>}

        {screen === "backup" && <section><div className="lw-feature-icon"><KeyRound size={32}/></div>{heading("Tu respaldo, en tus manos", "La frase secreta permite recuperar el acceso a una wallet real.")}<div className="lw-backup-preview" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <span key={index}><small>{String(index + 1).padStart(2, "0")}</small>••••••</span>)}</div><p className="lw-preview-caption">Ilustración del respaldo · No contiene una frase real</p><ol className="lw-lessons"><li><span>01</span><div><h2>Anota cada palabra</h2><p>En la wallet real, conserva las palabras y su orden exacto en un respaldo privado.</p></div></li><li><span>02</span><div><h2>Comprueba y guarda</h2><p>Verifica el respaldo y guárdalo en un lugar seguro. Evita fotos y capturas.</p></div></li><li><span>03</span><div><h2>Nunca lo compartas</h2><p>Nadie de LAEX ni de soporte necesita conocer tu frase.</p></div></li></ol><button className="lw-primary" onClick={() => { setPrepared(true); go("security"); }}>Entendido <ShieldCheck size={20}/></button></section>}

        {screen === "future" && <section className="lw-future"><div className="lw-feature-icon"><ArrowLeftRight size={32}/></div><span className="lw-eyebrow">EL SIGUIENTE PASO</span>{heading("Cambiar monedas, con claridad", "Primero construiremos una buena base para enviar y recibir. Después incorporaremos intercambios.")}<div className="lw-swap-preview" aria-hidden="true"><div><Token asset="USDT"/><span>USDT</span></div><ArrowDownLeft size={27}/><div><Token asset="BNB"/><span>BNB</span></div></div><div className="lw-inline-note"><Info size={20}/><p>Esta función todavía no está disponible. Antes de activarla, revisaremos proveedores, comisiones y seguridad.</p></div><button className="lw-primary" onClick={() => go("home")}>Seguir explorando <ArrowRight size={20}/></button></section>}

        {screen === "about" && <section><div className="lw-feature-icon"><Smartphone size={32}/></div>{heading("Así empieza laexWallet", "Una demo ampliada para recorrer la experiencia desde tu celular.")}<div className="lw-roadmap"><div><span className="is-current">01</span><h2>Explorar la experiencia</h2><p>Ahora: envío, recepción, intercambio, redes, tokens, conexiones Web3 y ajustes simulados.</p></div><div><span>02</span><h2>Construir la app Android</h2><p>Después: claves en el dispositivo y operaciones en una red de pruebas.</p></div><div><span>03</span><h2>Validar antes de lanzar</h2><p>Auditoría de seguridad y revisión legal antes de operar con fondos reales.</p></div></div><div className="lw-inline-note"><Info size={20}/><p>Los movimientos usan BNB Chain como escenario ficticio. Ethereum y OMDBLOCKCHAIN son configuraciones de maqueta. Los activos, saldos y precios son ilustrativos. Esta página no se conecta a bancos ni a una blockchain.</p></div><Link href="/" className="lw-secondary">Visitar LAEX <ArrowUpRight size={18}/></Link></section>}
      </main>
      {showNav && <nav className="lw-bottom-nav" aria-label="Navegación de la wallet"><button aria-current={screen === "home" ? "page" : undefined} onClick={() => go("home")}><Wallet size={22}/><span>Mi wallet</span></button><button aria-current={screen === "activity" ? "page" : undefined} onClick={() => go("activity")}><History size={22}/><span>Actividad</span></button><button aria-current={["web3","browser","connect","permission"].includes(screen) ? "page" : undefined} onClick={()=>go("web3")}><Globe size={22}/><span>Web3</span></button><button aria-current={screen === "settings" ? "page" : undefined} onClick={()=>go("settings")}><Settings size={22}/><span>Ajustes</span></button><button aria-current={screen === "security" ? "page" : undefined} onClick={() => go("security")}><ShieldCheck size={22}/><span>Seguridad</span></button></nav>}
      {toast && <div className="lw-toast" role="status"><Check size={18}/>{toast}</div>}
      {resetOpen && <div className="lw-modal-scrim" onKeyDown={event => { if (event.key === "Escape") closeReset(); if (event.key === "Tab") { const buttons = event.currentTarget.querySelectorAll("button"); const first = buttons[0]; const last = buttons[buttons.length - 1]; if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); } } }}><section className="lw-modal" role="dialog" aria-modal="true" aria-labelledby="lw-reset-title"><button className="lw-icon-button lw-modal-close" aria-label="Cerrar" onClick={closeReset}><X/></button><RotateCcw size={30}/><h2 id="lw-reset-title">¿Volvemos a empezar?</h2><p>Se borrarán los movimientos de esta demo y volverán los saldos de ejemplo.</p><button className="lw-primary" onClick={reset}>Sí, reiniciar demo</button><button className="lw-secondary" ref={cancelReset} onClick={closeReset}>Seguir explorando</button></section></div>}
    </div>
  </div>;
}
