/**
 * Mobile Midtrans Enhancement
 * Improves mobile experience for Midtrans Snap popup
 */

// Enhanced Midtrans initialization with mobile support
export function initializeMidtrans() {
  // Wait for Snap to be loaded
  if (typeof window === 'undefined' || !window.snap) {
    console.log('Midtrans Snap not loaded yet');
    return false;
  }

  // Override default Snap behavior for mobile
  const originalPay = window.snap.pay;
  
  window.snap.pay = function(token, options = {}) {
    // Detect mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Enhance options for mobile
      const enhancedOptions = {
        skipOrderSummary: false,
        gopayMode: 'deeplink',
        language: 'id',
        ...options,
        
        // Wrap callbacks to add mobile-specific handling
        onSuccess: (result) => {
          console.log('Mobile payment success:', result);
          if (options.onSuccess) options.onSuccess(result);
        },
        
        onPending: (result) => {
          console.log('Mobile payment pending:', result);
          if (options.onPending) options.onPending(result);
        },
        
        onError: (result) => {
          console.log('Mobile payment error:', result);
          if (options.onError) options.onError(result);
        },
        
        onClose: () => {
          console.log('Mobile Snap closed');
          // Don't assume cancellation on mobile - user might have switched apps
          if (options.onClose) options.onClose();
          
          // Add mobile-specific close handling
          enhanceSnapModal();
        }
      };
      
      // Call original pay with enhanced options
      const result = originalPay.call(this, token, enhancedOptions);
      
      // Apply mobile enhancements after popup opens
      setTimeout(() => {
        enhanceSnapModal();
      }, 500);
      
      return result;
    } else {
      // Desktop - use original behavior
      return originalPay.call(this, token, options);
    }
  };
  
  return true;
}

// Enhance Snap modal for mobile
function enhanceSnapModal() {
  if (typeof document === 'undefined') return;
  
  // Wait for modal to be in DOM
  setTimeout(() => {
    const modal = document.querySelector('#snap-midtrans') || 
                 document.querySelector('.snap-overlay') ||
                 document.querySelector('[id*="snap"]');
    
    if (modal) {
      // Add mobile-specific classes
      modal.classList.add('snap-mobile-enhanced');
      
      // Enhance close button
      const closeButton = modal.querySelector('.snap-close') || 
                         modal.querySelector('[class*="close"]') ||
                         modal.querySelector('button[aria-label*="close"]') ||
                         modal.querySelector('button[title*="close"]');
      
      if (closeButton) {
        // Make close button more accessible
        closeButton.style.minWidth = '44px';
        closeButton.style.minHeight = '44px';
        closeButton.style.fontSize = '24px';
        closeButton.style.padding = '8px';
        closeButton.style.background = '#f1f5f9';
        closeButton.style.color = '#64748b';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '6px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.display = 'flex';
        closeButton.style.alignItems = 'center';
        closeButton.style.justifyContent = 'center';
        
        // Add hover effects
        closeButton.addEventListener('mouseover', () => {
          closeButton.style.background = '#e2e8f0';
          closeButton.style.color = '#334155';
        });
        
        closeButton.addEventListener('mouseout', () => {
          closeButton.style.background = '#f1f5f9';
          closeButton.style.color = '#64748b';
        });
        
        // Ensure it has proper text/symbol
        if (!closeButton.innerHTML.trim() || closeButton.innerHTML === '×') {
          closeButton.innerHTML = '✕';
        }
        
        // Add accessibility attributes
        closeButton.setAttribute('aria-label', 'Tutup pembayaran');
        closeButton.setAttribute('title', 'Tutup pembayaran');
      }
      
      // Enhance modal structure
      const snapContent = modal.querySelector('.snap-content') ||
                         modal.querySelector('[class*="content"]');
      
      if (snapContent) {
        snapContent.style.maxHeight = 'calc(100vh - 120px)';
        snapContent.style.overflowY = 'auto';
        snapContent.style.webkitOverflowScrolling = 'touch';
      }
      
      // Add touch-friendly payment buttons
      const buttons = modal.querySelectorAll('button, .snap-btn, [class*="btn"]');
      buttons.forEach(btn => {
        if (btn !== closeButton) {
          btn.style.minHeight = '44px';
          btn.style.touchAction = 'manipulation';
          btn.style.borderRadius = '8px';
        }
      });
      
      console.log('Enhanced Midtrans modal for mobile');
    } else {
      console.log('Midtrans modal not found for enhancement');
    }
  }, 100);
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMidtrans);
  } else {
    initializeMidtrans();
  }
}

export default {
  initializeMidtrans,
  enhanceSnapModal
};