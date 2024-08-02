import { toast } from './toast';

export type {
  DefaultToastOptions,
  IconTheme,
  Renderable,
  Toast,
  ToasterProps,
  ToastOptions,
  ToastPosition,
  ToastType,
  ValueFunction,
  ValueOrFunction,
} from './types';

export { resolveValue } from './types';
export { useToaster } from './use-toaster';
export { useStore as useToasterStore } from './store';

export { toast };
export default toast;
