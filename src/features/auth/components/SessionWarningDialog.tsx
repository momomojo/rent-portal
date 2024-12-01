import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogActions, Button } from '@/components/ui';

interface SessionWarningDialogProps {
  open: boolean;
  remainingTime: number;
  onExtend: () => void;
  onLogout: () => void;
}

export const SessionWarningDialog: React.FC<SessionWarningDialogProps> = ({
  open,
  remainingTime,
  onExtend,
  onLogout
}) => {
  // Calculate progress percentage (120 seconds = 100%)
  const progressValue = (remainingTime / 120) * 100;

  return (
    <Dialog 
      open={open}
      onClose={() => {}} // Prevent closing by clicking outside
      className="sm:max-w-md"
    >
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="text-amber-500 h-6 w-6" />
          <h2 className="text-lg font-semibold text-gray-900">
            Session Expiring Soon
          </h2>
        </div>

        <DialogContent>
          <p className="text-gray-700 mb-4">
            Your session will expire in {Math.ceil(remainingTime)} seconds. 
            Would you like to extend your session?
          </p>

          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-amber-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressValue}%` }}
            />
          </div>
        </DialogContent>

        <DialogActions className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={onLogout}
          >
            Logout Now
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