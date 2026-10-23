/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Bot } from 'lucide-react';
import { AsyncErrorBoundary, ErrorBoundary } from '../../../apps/dashboard/src/components/ErrorBoundary.js';
import { StatsCard } from '../../../apps/dashboard/src/components/ui/stats-card.js';

vi.mock('next/link', () => ({
    default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) =>
        React.createElement('a', { href, ...props }, children),
}));

vi.mock('next/navigation', () => ({
    usePathname: () => '/agents/123',
}));

import { Sidebar } from '../../../apps/dashboard/src/components/Sidebar.js';

function Boom(): React.ReactElement {
    throw new Error('boom');
}

describe('dashboard components', () => {
    it('renders a stats card and the sidebar navigation', () => {
        render(
            React.createElement(StatsCard, {
                title: 'Agents',
                value: 3,
                icon: Bot,
                description: 'Active',
                className: 'extra',
            }),
        );
        expect(screen.getByText('Agents')).toBeTruthy();
        expect(screen.getByText('Active')).toBeTruthy();

        render(React.createElement(StatsCard, { title: 'Empty', value: 0, icon: Bot }));
        expect(screen.getByText('Empty')).toBeTruthy();

        render(React.createElement(Sidebar, { email: 'dev@gravity.ai' }));
        expect(screen.getByText('dev@gravity.ai')).toBeTruthy();
        expect(screen.getByText('DE')).toBeTruthy();
        expect(screen.getByText('My Agents')).toBeTruthy();
        expect(screen.getByText('Logout')).toBeTruthy();
    });

    it('catches render errors and recovers', () => {
        const previousEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'development';
        const onError = vi.fn();
        const sentry = vi.fn();
        (window as unknown as { Sentry?: { captureException: typeof sentry } }).Sentry = { captureException: sentry };
        vi.spyOn(console, 'error').mockImplementation(() => undefined);

        const view = render(
            React.createElement(ErrorBoundary, { onError }, React.createElement(Boom)),
        );
        expect(screen.getByText('Something went wrong')).toBeTruthy();
        expect(screen.getByText(/boom/)).toBeTruthy();
        expect(onError).toHaveBeenCalled();
        expect(sentry).toHaveBeenCalled();

        screen.getByRole('button', { name: 'Try Again' }).click();
        expect(view.container.textContent).toContain('Something went wrong');
        cleanup();

        render(React.createElement(ErrorBoundary, { fallback: React.createElement('p', null, 'Custom fallback') }, React.createElement(Boom)));
        expect(screen.getByText('Custom fallback')).toBeTruthy();
        cleanup();

        const reset = vi.fn();
        render(React.createElement(AsyncErrorBoundary, { error: new Error('load failed'), reset }, React.createElement('p', null, 'ready')));
        expect(screen.getByText('Failed to load')).toBeTruthy();
        screen.getByRole('button', { name: 'Try Again' }).click();
        expect(reset).toHaveBeenCalled();

        cleanup();
        render(React.createElement(AsyncErrorBoundary, { error: null, reset }, React.createElement('span', null, 'ready')));
        expect(screen.getByText('ready')).toBeTruthy();
        process.env.NODE_ENV = previousEnv;
    });
});
