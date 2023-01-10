import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // enabled: true,
      // staleTime: 3_600_000,
      // cacheTime: Infinity,
      // refetchInterval: false,
      // refetchIntervalInBackground: false,
      // refetchOnWindowFocus: true,
      // refetchOnReconnect: true,
      // refetchOnMount: true,
      // retryOnMount: true,
      // suspense: true,
      onError: (error) => {
        //
        console.log("error with query client - ", error);
      },
    },
    mutations: {
      onError: (error) => {
        //
        console.log("error with query client - ", error);
      },
    },
  },
});
