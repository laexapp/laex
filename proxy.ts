import { NextRequest, NextResponse } from "next/server";
import { blockedOnLfPrinter, commerceApiAllowedOnLfPrinter, isAllowedProductionHost, isLegacyHost, isLfPrinterHost, legacyRedirectEnabled, lfPrinterDestination, productionRoutingEnabled, requestHost } from "@/core/routing/production-domains";
import { PUBLIC_ORIGINS } from "@/core/config/public-origins";

const requestId = () => crypto.randomUUID();

export function proxy(request: NextRequest) {
  if (!productionRoutingEnabled()) return NextResponse.next();
  const host = requestHost(request.headers);
  if (!isAllowedProductionHost(host) && !isLegacyHost(host)) return new NextResponse("Host no autorizado", { status: 421 });

  if (legacyRedirectEnabled() && isLegacyHost(host)) {
    const target = new URL(`${request.nextUrl.pathname}${request.nextUrl.search}`, PUBLIC_ORIGINS.laex);
    return NextResponse.redirect(target, 308);
  }

  if (isLfPrinterHost(host)) {
    if (blockedOnLfPrinter(request.nextUrl.pathname)) return new NextResponse("No encontrado", { status: 404 });
    if (request.nextUrl.pathname.startsWith("/api/commerce/") && !commerceApiAllowedOnLfPrinter(request.nextUrl.pathname)) return new NextResponse("No encontrado", { status: 404 });
    const destination = lfPrinterDestination(request.nextUrl.pathname);
    if (destination) {
      const url = request.nextUrl.clone();
      const [pathname, hash] = destination.split("#");
      url.pathname = pathname;
      if (hash) url.hash = hash;
      const response = NextResponse.rewrite(url);
      response.headers.set("x-laex-surface", "lf-printer");
      response.headers.set("x-request-id", request.headers.get("x-request-id") ?? requestId());
      return response;
    }
  }

  const headers = new Headers(request.headers);
  headers.set("x-request-id", request.headers.get("x-request-id") ?? requestId());
  headers.set("x-laex-surface", isLfPrinterHost(host) ? "lf-printer" : "laex");
  return NextResponse.next({ request: { headers } });
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|woff2?)$).*)"] };
