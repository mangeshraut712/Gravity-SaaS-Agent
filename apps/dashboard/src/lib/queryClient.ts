/**
 * React Query Client Configuration
 * Optimized for performance with caching and stale-while-revalidate strategy
 */

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Data stays fresh for 5 minutes
            staleTime: 5 * 60 * 1000,
            // Cache data for 10 minutes
            gcTime: 10 * 60 * 1000,
            // Retry failed requests 3 times with exponential backoff
            retry: 3,
            retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
            // Refetch on window focus for real-time data
            refetchOnWindowFocus: true,
            // Refetch on reconnect
            refetchOnReconnect: true,
            // Don't refetch on mount if data is fresh
            refetchOnMount: false,
        },
        mutations: {
            // Retry mutations once on failure
            retry: 1,
            // Optimistic updates enabled
            onMutate: async () => {
                // Cancel any outgoing refetches
                await queryClient.cancelQueries();
            },
        },
    },
});

// Cache key factories for type-safe queries
export const queryKeys = {
    agents: {
        all: ['agents'] as const,
        lists: () => [...queryKeys.agents.all, 'list'] as const,
        list: (filters: Record<string, any>) => [...queryKeys.agents.lists(), filters] as const,
        details: () => [...queryKeys.agents.all, 'detail'] as const,
        detail: (id: string) => [...queryKeys.agents.details(), id] as const,
    },
    conversations: {
        all: ['conversations'] as const,
        lists: () => [...queryKeys.conversations.all, 'list'] as const,
        list: (agentId: string) => [...queryKeys.conversations.lists(), agentId] as const,
        details: () => [...queryKeys.conversations.all, 'detail'] as const,
        detail: (id: string) => [...queryKeys.conversations.details(), id] as const,
    },
    analytics: {
        all: ['analytics'] as const,
        dashboard: () => [...queryKeys.analytics.all, 'dashboard'] as const,
        stats: (period: string) => [...queryKeys.analytics.all, 'stats', period] as const,
    },
    user: {
        all: ['user'] as const,
        profile: () => [...queryKeys.user.all, 'profile'] as const,
        billing: () => [...queryKeys.user.all, 'billing'] as const,
    },
};

// Prefetch helpers for common data
export const prefetchQueries = {
    agents: () => queryClient.prefetchQuery({
        queryKey: queryKeys.agents.lists(),
        queryFn: async () => {
            const res = await fetch('/api/agents');
            return res.json();
        },
    }),

    analytics: () => queryClient.prefetchQuery({
        queryKey: queryKeys.analytics.dashboard(),
        queryFn: async () => {
            const res = await fetch('/api/analytics/dashboard');
            return res.json();
        },
    }),
};
