/**
 * Service Worker Manager for GuardianChain
 * Handles service worker registration with proper error handling for Replit environment
 */

export class ServiceWorkerManager {
  private static instance: ServiceWorkerManager;
  private isRegistered = false;
  private registration: ServiceWorkerRegistration | null = null;

  private constructor() {}

  static getInstance(): ServiceWorkerManager {
    if (!ServiceWorkerManager.instance) {
      ServiceWorkerManager.instance = new ServiceWorkerManager();
    }
    return ServiceWorkerManager.instance;
  }

  async register(): Promise<void> {
    // Skip registration in development or insecure contexts
    if (process.env.NODE_ENV === 'development' || !this.isServiceWorkerSupported()) {
      console.log('🔧 Service Worker registration skipped in development environment');
      return;
    }

    try {
      // Check if we're in a secure context (required for service workers)
      if (!window.isSecureContext) {
        console.log('⚠️ Service Worker requires secure context (HTTPS)');
        return;
      }

      // Check if service workers are supported
      if (!('serviceWorker' in navigator)) {
        console.log('⚠️ Service Worker not supported in this browser');
        return;
      }

      // Attempt registration with error handling
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none'
      });

      console.log('✅ Service Worker registered successfully');
      this.isRegistered = true;

      // Listen for updates
      this.registration.addEventListener('updatefound', () => {
        console.log('🔄 Service Worker update found');
      });

      // Handle successful registration
      if (this.registration.installing) {
        console.log('🔧 Service Worker installing...');
      } else if (this.registration.waiting) {
        console.log('⏳ Service Worker waiting to activate');
      } else if (this.registration.active) {
        console.log('✅ Service Worker active');
      }

    } catch (error: any) {
      // Silently handle SecurityError in development environments
      if (error.name === 'SecurityError') {
        console.log('🔒 Service Worker registration blocked by security policy (normal in development)');
      } else {
        console.log('❌ Service Worker registration failed:', error.message);
      }
    }
  }

  async unregister(): Promise<void> {
    if (!this.isRegistered || !this.registration) {
      return;
    }

    try {
      const result = await this.registration.unregister();
      if (result) {
        console.log('✅ Service Worker unregistered successfully');
        this.isRegistered = false;
        this.registration = null;
      }
    } catch (error) {
      console.log('❌ Service Worker unregistration failed:', error);
    }
  }

  getRegistration(): ServiceWorkerRegistration | null {
    return this.registration;
  }

  isRegistrationActive(): boolean {
    return this.isRegistered && this.registration !== null;
  }

  private isServiceWorkerSupported(): boolean {
    return typeof window !== 'undefined' && 
           'serviceWorker' in navigator && 
           window.isSecureContext;
  }

  // Request background sync for offline features
  async requestBackgroundSync(tag: string): Promise<void> {
    if (!this.registration) {
      console.log('⚠️ Cannot request background sync: Service Worker not registered');
      return;
    }

    try {
      await this.registration.sync.register(tag);
      console.log(`🔄 Background sync requested: ${tag}`);
    } catch (error) {
      console.log(`❌ Background sync request failed for ${tag}:`, error);
    }
  }

  // Check if app is running in standalone mode (PWA)
  isStandaloneMode(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches || 
           (window.navigator as any).standalone === true;
  }

  // Get app install status
  getInstallStatus(): 'installed' | 'installable' | 'not-supported' {
    if (this.isStandaloneMode()) {
      return 'installed';
    }

    if ('BeforeInstallPromptEvent' in window) {
      return 'installable';
    }

    return 'not-supported';
  }
}

// Export singleton instance
export const serviceWorkerManager = ServiceWorkerManager.getInstance();

// Auto-register on import (with error handling)
if (typeof window !== 'undefined') {
  // Delay registration to avoid blocking initial page load
  setTimeout(() => {
    serviceWorkerManager.register().catch(() => {
      // Silently handle registration failures
    });
  }, 2000);
}