import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import cn from 'classnames';

export interface ModalProps {
  /** Unique identifier for the modal */
  id: string;
  /** Modal content */
  children: React.ReactNode;
  /** Title of the modal */
  title?: string;
  /** Whether to show close button in corner */
  showCloseButton?: boolean;
  /** Whether modal can be closed by clicking outside */
  closeOnBackdrop?: boolean;
  /** Custom width classes (e.g., 'w-11/12 max-w-5xl') */
  modalBoxClassName?: string;
  /** Modal position */
  position?: 'top' | 'middle' | 'bottom';
  /** Modal horizontal alignment */
  horizontalAlign?: 'start' | 'center' | 'end';
  /** Responsive behavior */
  responsive?: boolean;
  /** Callback when modal is opened */
  onOpen?: () => void;
  /** Callback when modal is closed */
  onClose?: () => void;
  /** Additional className for the modal container */
  className?: string;
}

export interface ModalRef {
  showModal: () => void;
  close: () => void;
}

const Modal = forwardRef<ModalRef, ModalProps>(
  (
    {
      id,
      children,
      title,
      showCloseButton = true,
      closeOnBackdrop = true,
      modalBoxClassName,
      position = 'middle',
      horizontalAlign = 'center',
      responsive = false,
      onOpen,
      onClose,
      className,
    },
    ref,
  ) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useImperativeHandle(ref, () => ({
      showModal: () => {
        dialogRef.current?.showModal();
        onOpen?.();
      },
      close: () => {
        dialogRef.current?.close();
        onClose?.();
      },
    }));

    useEffect(() => {
      const dialog = dialogRef.current;

      const handleClose = () => {
        onClose?.();
      };

      if (dialog) {
        dialog.addEventListener('close', handleClose);
        return () => dialog.removeEventListener('close', handleClose);
      }
    }, [onClose]);

    const getPositionClasses = () => {
      const classes = [];

      if (responsive) {
        classes.push('modal-bottom sm:modal-middle');
      } else {
        switch (position) {
          case 'top':
            classes.push('modal-top');
            break;
          case 'bottom':
            classes.push('modal-bottom');
            break;
          case 'middle':
          default:
            classes.push('modal-middle');
            break;
        }
      }

      switch (horizontalAlign) {
        case 'start':
          classes.push('modal-start');
          break;
        case 'end':
          classes.push('modal-end');
          break;
        case 'center':
        default:
          // Default behavior, no additional class needed
          break;
      }

      return classes.join(' ');
    };

    return (
      <dialog id={id} ref={dialogRef} className={cn('modal', getPositionClasses(), className)}>
        <div className={cn('modal-box', modalBoxClassName)}>
          {showCloseButton && (
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
          )}

          {title && <h3 className="font-bold text-2xl text-center">{title}</h3>}
          <div className="modal-content">{children}</div>
        </div>

        {closeOnBackdrop && (
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        )}
      </dialog>
    );
  },
);

Modal.displayName = 'Modal';

export default Modal;

// Hook para usar el modal más fácilmente
export const useModal = (id: string) => {
  const showModal = () => {
    const modal = document.getElementById(id) as HTMLDialogElement;
    modal?.showModal();
  };

  const closeModal = () => {
    const modal = document.getElementById(id) as HTMLDialogElement;
    modal?.close();
  };

  return { showModal, closeModal };
};

// Componente para las acciones del modal
export const ModalActions: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return <div className={cn('modal-action', className)}>{children}</div>;
};
