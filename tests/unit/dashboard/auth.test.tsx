/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const { getSession, onAuthStateChange, signOut, unsubscribe } = vi.hoisted(() => {
    const unsubscribe = vi.fn();
    return {
        unsubscribe,
        getSession: vi.fn(),
        signOut: vi.fn(async () => undefined),
        onAuthStateChange: vi.fn(),
    };
});

vi.mock('../../../apps/dashboard/src/lib/supabaseClient.js', () => ({
    supabaseClient: {
        auth: { getSession, onAuthStateChange, signOut },
    },
}));

import { AuthProvider, useAuth } from '../../../apps/dashboard/src/hooks/useAuth.js';

function AuthProbe() {
    const auth = useAuth();
    return React.createElement(
        'div',
        null,
        React.createElement('span', null, auth.loading ? 'loading' : auth.user?.email ?? 'signed-out'),
        React.createElement('button', { onClick: () => void auth.signOut() }, 'Sign out'),
    );
}

describe('useAuth', () => {
    it('reads the session and signs out', async () => {
        getSession.mockResolvedValue({
            data: { session: { user: { email: 'dev@gravity.ai' } } },
        });
        onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe } } });

        render(React.createElement(AuthProvider, null, React.createElement(AuthProbe)));
        await waitFor(() => expect(screen.getByText('dev@gravity.ai')).toBeTruthy());

        const listener = onAuthStateChange.mock.calls[0][0] as (event: string, session: { user: { email: string } } | null) => void;
        listener('SIGNED_OUT', null);
        await waitFor(() => expect(screen.getByText('signed-out')).toBeTruthy());

        screen.getByRole('button', { name: 'Sign out' }).click();
        await waitFor(() => expect(signOut).toHaveBeenCalled());
    });
});
