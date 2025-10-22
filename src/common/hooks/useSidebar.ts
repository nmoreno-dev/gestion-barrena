// Hook simple para manejar el sidebar usando DaisyUI drawer
// El estado se maneja con el checkbox nativo del drawer

const DRAWER_ID = 'main-drawer';

export const useSidebar = () => {
  const toggle = () => {
    const checkbox = document.getElementById(DRAWER_ID) as HTMLInputElement;
    if (checkbox) {
      checkbox.checked = !checkbox.checked;
    }
  };

  const open = () => {
    const checkbox = document.getElementById(DRAWER_ID) as HTMLInputElement;
    if (checkbox) {
      checkbox.checked = true;
    }
  };

  const close = () => {
    const checkbox = document.getElementById(DRAWER_ID) as HTMLInputElement;
    if (checkbox) {
      checkbox.checked = false;
    }
  };

  return { toggle, open, close, drawerId: DRAWER_ID };
};
