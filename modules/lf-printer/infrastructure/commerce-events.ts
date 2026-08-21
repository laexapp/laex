"use client";

const EVENT_NAME = "laex:commerce-changed";
const CHANNEL_NAME = "laex-commerce";

export function announceCommerceChange(companySlug: string) {
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { companySlug } }));
  if ("BroadcastChannel" in window) {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.postMessage({ companySlug });
    channel.close();
  }
}

export function subscribeToCommerceChanges(companySlug: string, listener: () => void) {
  const onWindowEvent = (event: Event) => {
    if ((event as CustomEvent<{ companySlug?: string }>).detail?.companySlug === companySlug) listener();
  };
  window.addEventListener(EVENT_NAME, onWindowEvent);
  const channel = "BroadcastChannel" in window ? new BroadcastChannel(CHANNEL_NAME) : undefined;
  if (channel) channel.onmessage = (event: MessageEvent<{ companySlug?: string }>) => {
    if (event.data?.companySlug === companySlug) listener();
  };
  return () => {
    window.removeEventListener(EVENT_NAME, onWindowEvent);
    channel?.close();
  };
}
