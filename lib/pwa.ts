"use client";

export type PlatformType = "ios" | "android" | "chrome" | "edge" | "safari" | "firefox" | "other";

export interface PwaState {
  canPromptNative: boolean;
  isInstalled: boolean;
  isSupported: boolean;
  platform: PlatformType;
}

// Module-level deferred prompt and cached state
let deferredPrompt: any = null;
const subscribers = new Set<() => void>();

export function detectPlatform(): PlatformType {
  if (typeof window === "undefined") return "other";
  const ua = window.navigator.userAgent.toLowerCase();

  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  if (/android/.test(ua)) return "android";
  if (/edg/.test(ua)) return "edge";
  if (/chrome|crios/.test(ua)) return "chrome";
  if (/safari/.test(ua) && !/chrome/.test(ua)) return "safari";
  if (/firefox/.test(ua)) return "firefox";
  return "other";
}

export function checkIsInstalled(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true ||
    (typeof document !== "undefined" && document.referrer.includes("android-app://"))
  );
}

const SERVER_SNAPSHOT: PwaState = {
  canPromptNative: false,
  isInstalled: false,
  isSupported: false,
  platform: "other",
};

let currentSnapshot: PwaState = SERVER_SNAPSHOT;

function getClientSnapshot(): PwaState {
  if (typeof window === "undefined") return SERVER_SNAPSHOT;
  return {
    canPromptNative: Boolean(deferredPrompt),
    isInstalled: checkIsInstalled(),
    isSupported: true,
    platform: detectPlatform(),
  };
}

function updateSnapshot() {
  const next = getClientSnapshot();
  if (
    currentSnapshot.canPromptNative !== next.canPromptNative ||
    currentSnapshot.isInstalled !== next.isInstalled ||
    currentSnapshot.isSupported !== next.isSupported ||
    currentSnapshot.platform !== next.platform
  ) {
    currentSnapshot = next;
    notify();
  }
}

function notify() {
  subscribers.forEach((cb) => {
    try {
      cb();
    } catch {}
  });
}

// Initialize listeners in browser
let initialized = false;
export function initPwa() {
  if (typeof window === "undefined" || initialized) return;
  initialized = true;

  // Initialize cached snapshot once on client
  currentSnapshot = getClientSnapshot();

  // Register Service Worker
  if ("serviceWorker" in navigator) {
    if (document.readyState === "complete") {
      registerWorker();
    } else {
      window.addEventListener("load", registerWorker);
    }
  }

  // Capture beforeinstallprompt
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    updateSnapshot();
  });

  // Track app installation
  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    updateSnapshot();
  });

  // Media query listener for standalone changes
  try {
    const mq = window.matchMedia("(display-mode: standalone)");
    if (mq.addEventListener) {
      mq.addEventListener("change", () => updateSnapshot());
    } else if ((mq as any).addListener) {
      (mq as any).addListener(() => updateSnapshot());
    }
  } catch {}
}

function registerWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.warn("PWA: Service worker registration:", err);
    });
  }
}

export const pwaStore = {
  getSnapshot(): PwaState {
    if (typeof window !== "undefined" && currentSnapshot === SERVER_SNAPSHOT) {
      currentSnapshot = getClientSnapshot();
    }
    return currentSnapshot;
  },
  getServerSnapshot(): PwaState {
    return SERVER_SNAPSHOT;
  },
  subscribe(callback: () => void) {
    subscribers.add(callback);
    initPwa();
    return () => {
      subscribers.delete(callback);
    };
  },
  async prompt(): Promise<"accepted" | "dismissed" | "unsupported"> {
    if (!deferredPrompt) {
      return "unsupported";
    }
    try {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice && choice.outcome === "accepted") {
        deferredPrompt = null;
        updateSnapshot();
      }
      return choice ? choice.outcome : "dismissed";
    } catch {
      return "unsupported";
    }
  },
};
