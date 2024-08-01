import { useEffect, useState } from 'react';
import { DefaultToastOptions, Toast, ToastType } from './types';

export const TOAST_EXPIRE_DISMISS_DELAY = 800;
const TOAST_LIMIT = 5;
export const DEFAULT_TTL: {
  [key in ToastType]: number;
} = {
  blank: 4000,
  error: 4000,
  success: 2000,
  loading: Infinity,
  custom: 4000,
} as const;

export enum ActionType {
  ADD_TOAST = 'ADD_TOAST',
  UPDATE_TOAST = 'UPDATE_TOAST',
  UPSERT_TOAST = 'UPSERT_TOAST', // /* Update or insert */
  DISMISS_TOAST = 'DISMISS_TOAST',
  REMOVE_TOAST = 'REMOVE_TOAST',
  START_PAUSE = 'START_PAUSE',
  END_PAUSE = 'END_PAUSE',
}

type Action =
  | { type: ActionType.ADD_TOAST; toast: Toast }
  | { type: ActionType.UPSERT_TOAST; toast: Toast }
  | { type: ActionType.UPDATE_TOAST; toast: Partial<Toast> }
  | { type: ActionType.DISMISS_TOAST; toastId?: string }
  | { type: ActionType.START_PAUSE; time: number }
  | { type: ActionType.END_PAUSE; time: number }
  | { type: ActionType.REMOVE_TOAST; toastId?: string };

interface State {
  toasts: Toast[];
  pausedAt: number | undefined;
}

let memoryState: State = { toasts: [], pausedAt: undefined };
const stateNotifier = createStateNotifier<State>();
const dismissalQueue = createDismissalQueue(
  (id) => dispatch({ type: ActionType.REMOVE_TOAST, toastId: id }),
  { animationDuration: 1000 }
);

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.ADD_TOAST: {
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };
    }
    case ActionType.UPDATE_TOAST: {
      //  ! Side effects !
      if (action.toast.id) {
        dismissalQueue.cancel(action.toast.id);
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };
    }
    case ActionType.UPSERT_TOAST: {
      const { toast } = action;
      return state.toasts.find((t) => t.id === toast.id)
        ? reducer(state, { type: ActionType.UPDATE_TOAST, toast })
        : reducer(state, { type: ActionType.ADD_TOAST, toast });
    }
    case ActionType.DISMISS_TOAST: {
      const { toastId } = action;

      if (toastId) {
        //  ! Side effects !
        dismissalQueue.schedule(toastId);
      } else {
        // dismiss all
        state.toasts.forEach((toast) => dismissalQueue.schedule(toast.id));
      }

      const updateToastVisibility = (toast: Toast) =>
        toastId === undefined || toast.id === toastId
          ? { ...toast, visible: false }
          : toast;

      return {
        ...state,
        toasts: state.toasts.map(updateToastVisibility),
      };
    }
    case ActionType.REMOVE_TOAST: {
      if (action.toastId === undefined) {
        return { ...state, toasts: [] };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
    }
    case ActionType.START_PAUSE: {
      return {
        ...state,
        pausedAt: action.time,
      };
    }
    case ActionType.END_PAUSE: {
      const diff = action.time - (state.pausedAt || 0);
      return {
        ...state,
        pausedAt: undefined,
        toasts: state.toasts.map((t) => ({
          ...t,
          pauseDuration: t.pauseDuration + diff,
        })),
      };
    }
  }
};

export const dispatch = (action: Action) => {
  memoryState = reducer(memoryState, action);
  stateNotifier.notify(memoryState);
};

export const useStore = (opt: DefaultToastOptions = {}): State => {
  const [state, setState] = useState<State>(memoryState);

  useEffect(() => stateNotifier.subscribe(setState), [state]);

  const toasts = state.toasts.map((t) => ({
    ...opt,
    ...opt[t.type],
    ...t,
    ttl: t.ttl || opt[t.type]?.ttl || opt?.ttl || DEFAULT_TTL[t.type],
    style: {
      ...opt.style,
      ...opt[t.type]?.style,
      ...t.style,
    },
  }));

  return { ...state, toasts };
};

function createStateNotifier<T>() {
  const subscribers = new Set<(state: T) => void>();

  return {
    notify: (state: T) => {
      subscribers.forEach((subscriber) => subscriber(state));
    },
    subscribe: (subscriber: (state: T) => void) => {
      subscribers.add(subscriber);
      return () => {
        subscribers.delete(subscriber);
      };
    },
    clearAllSubscribers: subscribers.clear.bind(subscribers),
  };
}

interface DismissalQueueOptions {
  animationDuration?: number;
}

/**
 * When a toast is dismissed, it's often desirable
 * to have a delay before it's actually removed from the state.
 * This allows for smooth exit animations.
 *
 * Summary: Instead of immediate removal,
 * we delay removing to play animation
 */
function createDismissalQueue(
  removeToast: (id: string) => void,
  options: DismissalQueueOptions = {}
) {
  const { animationDuration = TOAST_EXPIRE_DISMISS_DELAY } = options;

  const queue = new Map<string, ReturnType<typeof setTimeout>>();

  return {
    schedule: (id: string) => {
      if (queue.has(id)) {
        return;
      }

      const timeout = setTimeout(() => {
        queue.delete(id);
        removeToast(id);
      }, animationDuration);

      queue.set(id, timeout);
    },

    cancel: (id: string) => {
      const timeout = queue.get(id);
      if (timeout) {
        clearTimeout(timeout);
        queue.delete(id);
      }
    },

    clear: () => {
      queue.forEach(clearTimeout);
      queue.clear();
    },
  };
}
