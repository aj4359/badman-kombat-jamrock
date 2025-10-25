import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle } from 'lucide-react';

interface TutorialSkipDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const TutorialSkipDialog: React.FC<TutorialSkipDialogProps> = ({
  open,
  onConfirm,
  onCancel,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onCancel}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="h-8 w-8 text-yellow-400" />
            <AlertDialogTitle className="text-2xl">
              Skip Tutorial?
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base space-y-3">
            <p className="text-foreground/90">
              Fighting games can be tricky! The tutorial will teach you:
            </p>
            <ul className="list-disc list-inside space-y-1 text-foreground/80">
              <li>Movement & controls</li>
              <li>Basic attacks & combos</li>
              <li>Blocking & defense</li>
              <li>Special moves & super attacks</li>
            </ul>
            <p className="text-foreground/90 font-semibold">
              It only takes 5 minutes and makes the game much more fun!
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogAction
            onClick={onCancel}
            className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white font-bold"
          >
            OK, I'LL TAKE THE TUTORIAL
          </AlertDialogAction>
          <AlertDialogCancel
            onClick={onConfirm}
            className="font-semibold"
          >
            No thanks, I know what I'm doing
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
