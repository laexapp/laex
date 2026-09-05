/** Deliberately offline. These identifiers are not blockchain addresses. */
export const DEMO_ADDRESS = "LAEX-DEMO-001";
export const DEMO_RECIPIENTS = ["LAEX-DEMO-002", "LAEX-DEMO-003"] as const;
export const DEMO_FEE = 5_000; // 0.00005 simulated BNB; never a network estimate.
export type Asset = "USDT" | "BNB";
export const ASSETS = {
  USDT: { name: "Tether", decimals: 6, price: 1 },
  BNB: { name: "BNB", decimals: 8, price: 600 },
} as const;
export type Balances = Record<Asset, number>;
export type Movement = { id: string; direction: "in" | "out"; asset: Asset; units: number; counterparty: string; fee: number; time: string };
export type DemoState = { balances: Balances; movements: Movement[]; nextId: number };
export function initialDemo(): DemoState {
  return { balances: { USDT: 1_250_000_000, BNB: 8_000_000 }, nextId: 3, movements: [
    { id: "DEMO-002", direction: "in", asset: "USDT", units: 1_250_000_000, counterparty: "Saldo de ejemplo", fee: 0, time: "Inicio de la demo" },
    { id: "DEMO-001", direction: "in", asset: "BNB", units: 8_000_000, counterparty: "Saldo de ejemplo", fee: 0, time: "Inicio de la demo" },
  ] };
}
export function parseUnits(value: string, asset: Asset): number | null {
  const normalized = value.trim().replace(",", ".");
  const decimals = ASSETS[asset].decimals;
  if (!new RegExp(`^\\d+(?:\\.\\d{1,${decimals}})?$`).test(normalized)) return null;
  const [whole, fraction = ""] = normalized.split(".");
  const units = Number(whole) * 10 ** decimals + Number(fraction.padEnd(decimals, "0"));
  return Number.isSafeInteger(units) && units > 0 ? units : null;
}
export function amountText(units: number, asset: Asset) {
  return (units / 10 ** ASSETS[asset].decimals).toLocaleString("es-DO", { maximumFractionDigits: ASSETS[asset].decimals });
}
export function inputAmount(units: number, asset: Asset) {
  return (units / 10 ** ASSETS[asset].decimals).toFixed(ASSETS[asset].decimals).replace(/\.?0+$/, "") || "0";
}
export function usdAmount(units: number, asset: Asset) { return units / 10 ** ASSETS[asset].decimals * ASSETS[asset].price; }
export function maxSend(state: DemoState, asset: Asset) { return Math.max(0, state.balances[asset] - (asset === "BNB" ? DEMO_FEE : 0)); }
export function validateSend(state: DemoState, asset: Asset, value: string, recipient: string): string | null {
  if (!(DEMO_RECIPIENTS as readonly string[]).includes(recipient.trim())) return "Usa un destinatario de ejemplo. Esta demo no acepta direcciones reales.";
  const units = parseUnits(value, asset);
  if (units === null) return `Escribe una cantidad mayor que cero, con hasta ${ASSETS[asset].decimals} decimales.`;
  if (state.balances.BNB < DEMO_FEE) return "Falta BNB de prueba para cubrir la comisión de red.";
  if (units > maxSend(state, asset)) return asset === "BNB" ? "La cantidad supera tu saldo disponible después de la comisión." : "La cantidad supera tu saldo de prueba.";
  return null;
}
export function simulateSend(state: DemoState, asset: Asset, value: string, recipient: string): DemoState {
  const error = validateSend(state, asset, value, recipient);
  if (error) throw new Error(error);
  const units = parseUnits(value, asset)!;
  const balances = { ...state.balances, BNB: state.balances.BNB - DEMO_FEE };
  balances[asset] -= units;
  return { balances, nextId: state.nextId + 1, movements: [{ id: `DEMO-${String(state.nextId).padStart(3, "0")}`, direction: "out", asset, units, counterparty: recipient.trim(), fee: DEMO_FEE, time: "En esta sesión" }, ...state.movements] };
}
export function simulateReceive(state: DemoState, asset: Asset): DemoState {
  const units = asset === "USDT" ? 25_000_000 : 1_000_000;
  return { balances: { ...state.balances, [asset]: state.balances[asset] + units }, nextId: state.nextId + 1, movements: [{ id: `DEMO-${String(state.nextId).padStart(3, "0")}`, direction: "in", asset, units, counterparty: "Recepción de ejemplo", fee: 0, time: "En esta sesión" }, ...state.movements] };
}
