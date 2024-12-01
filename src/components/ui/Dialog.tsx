import React from 'react';
import { Transition } from '@headlessui/react';
import { XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  children,
  className,
}) => {
  return (
    <Transition show={open}>
      <Transition.Child
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="fixed inset-0 bg-black bg-opacity-25 z-50"
        onClick={onClose}
      />

      <Transition.Child
        enter="ease-out duration-300"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div
          className={cn(
            'bg-white rounded-lg shadow-xl w-full max-w-md p-6',
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
          >
            <XIcon className="h-5 w-5" />
          </button>
          {children}
        </div>
      </Transition.Child>
    </Transition>
  );
};

export const DialogTitle: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
    {children}
  </h3>
);

export const DialogContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="mt-2">{children}</div>;

export const DialogActions: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div
    className={cn(
      'mt-6 flex flex-row-reverse gap-3',
      className
    )}
  >
    {children}
  </div>
);