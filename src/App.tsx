import './App.css';

import { Toaster } from './components/toaster';
import {
  QueryClientProvider,
  QueryClient,
  QueryCache,
  useQuery,
} from '@tanstack/react-query';
import toast from './core/headless';

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
    onError: (err) => {
      toast.error(err.message)
    },
    onSuccess: (_data) => {
      toast.success("All good1")
    }
  }),
});

const App = () => {
  useQuery({
    queryKey: ['foo'],
    retry: false,
    queryFn: () => Promise.reject(new Error("500: Server is using Nodejs")),
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
