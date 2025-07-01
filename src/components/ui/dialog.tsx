import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import clsx from 'clsx';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  // Trap focus
  const dialogRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (open && dialogRef.current) {
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length) focusable[0].focus();
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onOpenChange(false);
        if (e.key === 'Tab' && focusable.length) {
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey) {
            if (document.activeElement === first) {
              e.preventDefault();
              last.focus();
            }
          } else {
            if (document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [open, onOpenChange]);

  // Overlay click closes
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onOpenChange(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOverlayClick}
        >
          <motion.div
            ref={dialogRef}
            className={clsx(
              'relative w-full max-w-lg sm:rounded-xl bg-white shadow-2xl flex flex-col',
              'sm:max-h-[90vh] sm:my-8',
              'outline-none',
              'transition-all',
              'p-0',
              'sm:w-[90vw]',
              'w-full',
              'h-full sm:h-auto',
              'overflow-y-auto'
            )}
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}
export function DialogContent({ children, className }: DialogContentProps) {
  return <div className={clsx('w-full', className)}>{children}</div>;
}

interface DialogHeaderProps {
  children: React.ReactNode;
  className?: string;
}
export function DialogHeader({ children, className }: DialogHeaderProps) {
  return <div className={clsx('flex items-center justify-between border-b border-border px-4 pt-4 pb-2', className)}>{children}</div>;
}

interface DialogTitleProps {
  children: React.ReactNode;
  className?: string;
}
export function DialogTitle({ children, className }: DialogTitleProps) {
  return <h2 className={clsx('text-lg font-bold text-primary', className)}>{children}</h2>;
}

interface DialogCloseProps {
  onClick?: () => void;
  className?: string;
  'aria-label'?: string;
  children?: React.ReactNode;
}
export function DialogClose({ onClick, className, children = <X className="w-5 h-5" />, ...props }: DialogCloseProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx('ml-auto text-2xl text-muted-foreground hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary rounded-full px-2 py-1', className)}
      aria-label={props['aria-label'] || 'Close'}
    >
      {children}
    </button>
  );
} 