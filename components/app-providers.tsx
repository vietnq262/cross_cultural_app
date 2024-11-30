'use client';

import { PropsWithChildren } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: false,
    },
  },
});

export default function AppProvider(props: PropsWithChildren) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </SessionProvider>
  );
}
