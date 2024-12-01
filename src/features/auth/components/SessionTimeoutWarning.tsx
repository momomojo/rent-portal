import React from 'react';
import { Dialog, DialogContent, DialogActions, Button } from '@/components/ui';
import { AlertCircle } from 'lucide-react';

interface SessionTimeoutWarningProps {
  open: boolean;
  onClose: () => void;
  onExtend: () => void;
  remainingTime: number;
}

export const SessionTimeoutWarning: React.FC<SessionTimeoutWarningProps> = ({
  open,
  onClose,
  onExtend,
  remainingTime
}) => {
  // Calculate progress percentage (assuming warning shows in last 5 minutes)
  const progress = (remainingTime / (5 * 60)) * 100;
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="sm:max-w-md"
    >
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="text-amber-500 h-6 w-6" />
          <h2 className="text-lg font-semibold text-gray-900">
            Session Timeout Warning
          </h2>
        </div>

        <DialogContent>
          <p className="text-gray-700 mb-4">
            Your session will expire in {minutes}:{seconds.toString().padStart(2, '0')} minutes.
            Would you like to extend your session?
          </p>

          {/* Progress bar */}
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-amber-600 bg-amber-200">
                  Session Time Remaining
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-200">
              <div
                style={{ width: `${progress}%` }}
                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${
                  remainingTime < 60 
                    ? 'bg-red-500' 
                    : remainingTime < 120 
                    ? 'bg-amber-500' 
                    : 'bg-green-500'
                }`}
              />
            </div>
          </div>
        </DialogContent>

        <DialogActions className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Log Out
          </Button>
          <Button
            variant="default"
            onClick={onExtend}
          >
            Extend Session
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );
};