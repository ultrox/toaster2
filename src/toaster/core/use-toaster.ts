import { useCallback } from 'react';
import { dispatch, ActionType, useStore } from './store';
import { toast } from './toast';
import { DefaultToastOptions, Toast, ToastPosition } from './types';
import { useInterval } from './utils';

export const useToaster = (toastOptions?: DefaultToastOptions) => {
  const { toasts, pausedAt } = useStore(toastOptions);

  const hasNotExpired = useCallback((toast: Toast) => {
    if (toast.ttl === Infinity) {
      return true;
    }

    const expiresAt = toast.createdAt + (toast.ttl || 0) + toast.pauseDuration;
    return (
       expiresAt >= Date.now()
    );
  }, []);

  useInterval(
    () => {
      const activeToasts = toasts.filter(hasNotExpired);
      if (activeToasts.length !== toasts.length) {
        toasts
          .filter((t) => !hasNotExpired(t) && t.visible)
          .forEach((t) => toast.dismiss(t.id));
      }
    },
    300,
    { mode: toasts.length === 0 || pausedAt ? 'paused' : 'running' }
  );

  const calculateOffset = useCallback(
    (
      toast: Toast,
      opts?: {
        reverseOrder?: boolean;
        gutter?: number;
        defaultPosition?: ToastPosition;
      }
    ) => {
      const { reverseOrder = false, gutter = 8, defaultPosition } = opts || {};

      const relevantToasts = toasts.filter(
        (t) =>
          (t.position || defaultPosition) ===
            (toast.position || defaultPosition) && t.height
      );
      const toastIndex = relevantToasts.findIndex((t) => t.id === toast.id);
      const toastsBefore = relevantToasts.filter(
        (toast, i) => i < toastIndex && toast.visible
      ).length;

      const offset = relevantToasts
        .filter((t) => t.visible)
        .slice(...(reverseOrder ? [toastsBefore + 1] : [0, toastsBefore]))
        .reduce((acc, t) => acc + (t.height || 0) + gutter, 0);

      return offset;
    },
    [toasts]
  );

  return {
    toasts,
    handlers: {
      startPause,
      endPause,
      updateHeight,
      calculateOffset,
    },
  };
};


const updateHeight = (toastId: string, height: number) => {
  dispatch({
    type: ActionType.UPDATE_TOAST,
    toast: { id: toastId, height },
  });
};

export const endPause = () => {
  dispatch({ type: ActionType.END_PAUSE, time: Date.now() });
};

export const startPause = () => {
  dispatch({
    type: ActionType.START_PAUSE,
    time: Date.now(),
  });
};
