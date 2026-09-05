import type { Metadata } from "next";
import { WalletDemo } from "@/modules/laex-wallet/WalletDemo";

export const metadata: Metadata = {
  title: "laexWallet · Tu wallet, a tu manera",
  description: "Explora la demostración interactiva de laexWallet. Enviar, recibir y aprender, paso a paso y con saldos simulados.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://www.laexapp.com/laexwallet" },
};

export default function Page() { return <WalletDemo />; }
