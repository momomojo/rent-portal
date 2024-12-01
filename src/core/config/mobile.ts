import { logger } from '@core/utils/logger';

// Viewport management configuration
export const viewportConfig = {
  // Initial viewport settings
  initial: {
    width: 'device-width',
    initialScale: 1,
    minimumScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: 'cover' as const,
  },

  // Viewport updates for different scenarios
  scenarios: {
    keyboard: {
      maximumScale: 1,
      userScalable: false,
    },
    landscape: {
      initialScale: 'auto' as const,
    },
  },
};

// Touch optimization configuration
export const touchConfig = {
  // Minimum touch target size (in pixels)
  minTargetSize: 44,
  
  // Touch feedback delay (in milliseconds)
  feedbackDelay: 100,
  
  // Gesture configurations
  gestures: {
    swipe: {
      threshold: 50, // minimum distance for swipe
      velocity: 0.3, // minimum velocity for swipe
      directionLock: true, // lock to primary direction
    },
    pinch: {
      enabled: true,
      minScale: 0.5,
      maxScale: 3,
    },
    doubleTap: {
      delay: 300, // maximum delay between taps
    },
  },
};

// Mobile feature detection
export const mobileFeatures = {
  // Check if device supports touch
  hasTouch: () => 'ontouchstart' in window || navigator.maxTouchPoints > 0,
  
  // Check if device is iOS
  isIOS: () => /iPad|iPhone|iPod/.test(navigator.userAgent),
  
  // Check if device is Android
  isAndroid: () => /Android/.test(navigator.userAgent),
  
  // Check if device is mobile
  isMobile: () => {
    const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return mobile.test(navigator.userAgent);
  },
};

// Safe area inset management
export const safeAreaManager = {
  // Initialize safe area insets
  init: () => {
    const style = document.createElement('style');
    style.innerHTML = `
      :root {
        --safe-area-inset-top: env(safe-area-inset-top);
        --safe-area-inset-right: env(safe-area-inset-right);
        --safe-area-inset-bottom: env(safe-area-inset-bottom);
        --safe-area-inset-left: env(safe-area-inset-left);
      }
    `;
    document.head.appendChild(style);
  },

  // Get safe area inset values
  getInsets: () => ({
    top: parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--safe-area-inset-top')),
    right: parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--safe-area-inset-right')),
    bottom: parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--safe-area-inset-bottom')),
    left: parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--safe-area-inset-left')),
  }),
};

// Viewport management functions
export const viewportManager = {
  // Update viewport meta tag
  update: (settings: Partial<typeof viewportConfig.initial>) => {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      logger.error('Viewport meta tag not found');
      return;
    }

    const content = Object.entries({
      ...viewportConfig.initial,
      ...settings,
    })
      .map(([key, value]) => `${key}=${value}`)
      .join(', ');

    viewport.setAttribute('content', content);
  },

  // Handle orientation change
  handleOrientation: () => {
    if (window.orientation === 90 || window.orientation === -90) {
      viewportManager.update(viewportConfig.scenarios.landscape);
    } else {
      viewportManager.update(viewportConfig.initial);
    }
  },

  // Handle keyboard visibility
  handleKeyboard: (visible: boolean) => {
    if (visible) {
      viewportManager.update(viewportConfig.scenarios.keyboard);
    } else {
      viewportManager.update(viewportConfig.initial);
    }
  },
};

// Initialize mobile optimizations
export const initializeMobileOptimizations = () => {
  // Initialize safe area insets
  safeAreaManager.init();

  // Set up orientation change handler
  window.addEventListener('orientationchange', () => {
    viewportManager.handleOrientation();
  });

  // Set up viewport for iOS keyboard
  if (mobileFeatures.isIOS()) {
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        viewportManager.handleKeyboard(true);
      });
      input.addEventListener('blur', () => {
        viewportManager.handleKeyboard(false);
      });
    });
  }

  // Add touch feedback
  if (mobileFeatures.hasTouch()) {
    document.addEventListener('touchstart', (e) => {
      const target = e.target as HTMLElement;
      if (target.matches('button, [role="button"], a')) {
        target.style.transition = `opacity ${touchConfig.feedbackDelay}ms`;
        target.style.opacity = '0.7';
        
        setTimeout(() => {
          target.style.opacity = '1';
        }, touchConfig.feedbackDelay);
      }
    });
  }

  // Log mobile environment
  logger.info('Mobile environment:', {
    isIOS: mobileFeatures.isIOS(),
    isAndroid: mobileFeatures.isAndroid(),
    hasTouch: mobileFeatures.hasTouch(),
    safeAreaInsets: safeAreaManager.getInsets(),
  });
};
