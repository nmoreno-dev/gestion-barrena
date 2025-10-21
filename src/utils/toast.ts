// Toast utility for DaisyUI notifications
export interface ToastOptions {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  position?: 'top' | 'bottom';
  align?: 'start' | 'center' | 'end';
}

let toastCounter = 0;

export function showToast({
  message,
  type = 'success',
  duration = 3000,
  position = 'top',
  align = 'end',
}: ToastOptions) {
  const toastId = `toast-${++toastCounter}`;

  // Create toast container if it doesn't exist
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = `toast toast-${position} toast-${align} z-50`;
    document.body.appendChild(toastContainer);
  }

  // Create toast element
  const toastElement = document.createElement('div');
  toastElement.id = toastId;
  toastElement.className = `alert alert-${type} shadow-lg`;

  // Toast content with icon and message
  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '✓';
    }
  };

  toastElement.innerHTML = `
    <div class="flex items-center gap-2">
      <span class="text-lg">${getIcon()}</span>
      <span>${message}</span>
    </div>
  `;

  // Add to container
  toastContainer.appendChild(toastElement);

  // Auto remove after duration
  setTimeout(() => {
    const element = document.getElementById(toastId);
    if (element) {
      element.style.opacity = '0';
      element.style.transform = 'translateX(100%)';
      element.style.transition = 'all 0.3s ease';
      setTimeout(() => {
        element.remove();
        // Remove container if no more toasts
        const container = document.getElementById('toast-container');
        if (container && container.children.length === 0) {
          container.remove();
        }
      }, 300);
    }
  }, duration);

  return toastId;
}

// Convenience functions
export const toast = {
  success: (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) =>
    showToast({ message, type: 'success', ...options }),

  error: (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) =>
    showToast({ message, type: 'error', ...options }),

  warning: (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) =>
    showToast({ message, type: 'warning', ...options }),

  info: (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) =>
    showToast({ message, type: 'info', ...options }),
};
