import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      
      gcTime: 1000 * 60 * 10,
      
      retry: 1,
      
      refetchOnWindowFocus: false,
      
      refetchOnReconnect: false,
      
      refetchOnMount: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

export const realtimeQueryConfig = {
  staleTime: 0, 
  gcTime: 1000 * 60 * 2, 
  refetchInterval: 30000, 
};

export const staticQueryConfig = {
  staleTime: 1000 * 60 * 60, 
  gcTime: 1000 * 60 * 60 * 24, 
  refetchOnMount: false,
};

export const userQueryConfig = {
  staleTime: 1000 * 60 * 10, 
  gcTime: 1000 * 60 * 30, 
};