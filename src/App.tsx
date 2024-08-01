import './App.css';

import { Toaster } from './components/toaster';
import {
  QueryClientProvider,
  QueryClient,
  QueryCache,
  useQuery,
} from '@tanstack/react-query';
import toast, { useToaster } from './core/headless';

const notify = () => toast('Here is your toast.');
const error = () => toast.success('Error Danger');
toast('Hello Darkness!', {
  icon: '👏',
  style: {
    borderRadius: '10px',
    background: '#333',
    color: '#fff',
  },
});

const client = new QueryClient({
  queryCache: new QueryCache({
    onError: () => {
      error('KOKO');
    },
  }),
});

const App = () => {
  const data = useQuery({
    queryKey: ['foo'],
    retry: false,
    queryFn: () => Promise.reject('fido'),
  });
  return (
    <div>
      <button onClick={notify}>Make me a toast</button>
      <Toaster />
    </div>
  );
};

export default () => (
  <QueryClientProvider client={client}>
    <App />
  </QueryClientProvider>
);

const Notifications = () => {
  const { toasts } = useToaster();

  return (
    <div>
      {toasts
        .filter((toast) => toast.visible)
        .map((toast) => (
          <h2 key={toast.id}>{toast.message}</h2>
        ))}
    </div>
  );
};

const genId = (() => {
  let id = 0;
  return () => ++id;
})();
