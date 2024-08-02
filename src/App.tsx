import './App.css';

import { Toaster } from './toaster/toaster';
import {
  QueryClientProvider,
  QueryClient,
  QueryCache,
  useQuery,
} from '@tanstack/react-query';
import toast from './toaster/core/headless';

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
const withDismiss = () => {
  toast((t) => (
    <span>
      Custom and <b>bold</b>
      <button onClick={() => toast.dismiss(t.id)}>
        Dismiss2
      </button>
    </span>
  ));
}
const App = () => {
  useQuery({
    queryKey: ['foo'],
    retry: false,
    queryFn: () => Promise.reject(new Error("500: Server is using Nodejs")),
  });
  return (
    <div>
      <button onClick={promise}>Boom</button>
      <button onClick={withDismiss}>With Dismiss</button>
      <MakeAndRemove />
      <Toaster />
    </div>
  );
};

export default () => (
  <QueryClientProvider client={client}>
    <App />
  </QueryClientProvider>
);


function MakeAndRemove() {
 
  return <button onClick={ () => {
    toast(
    ({id}) => (
      <div className="bg-green-500">
        <p>Hello!</p>
        <button onClick={() => toast.remove(id)}>Remove Me</button>
      </div>
    ),
    {ttl: 3000}
  )}}>Add And Remove</button>
}