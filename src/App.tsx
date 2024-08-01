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
const promise = () => {
  toast.promise(
    new Promise(r => setTimeout(r, 5000)),
     {
       loading: 'Fetching...',
       success: <b>Got it saved!</b>,
       error: <b>We faild.</b>,
     }
   );
}

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
      <button onClick={() => {
              promise()
      }}>Boom</button>
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
