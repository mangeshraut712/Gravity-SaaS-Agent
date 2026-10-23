/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const USER = { id: 'user-1', email: 'dev@gravity.ai' };

const auth = vi.hoisted(() => ({
    getSession: vi.fn(),
    getUser: vi.fn(),
    onAuthStateChange: vi.fn(),
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    resetPasswordForEmail: vi.fn(),
    signOut: vi.fn(),
}));

const adminAuth = vi.hoisted(() => ({
    mode: 'ok' as 'ok' | 'empty' | 'throw',
}));

const router = vi.hoisted(() => ({
    push: vi.fn(),
    back: vi.fn(),
    replace: vi.fn(),
}));

vi.mock('next/link', () => ({
    default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) =>
        React.createElement('a', { href, ...props }, children),
}));

vi.mock('next/navigation', () => ({
    useRouter: () => router,
    usePathname: () => '/dashboard',
    useSearchParams: () => new URLSearchParams('template=sales'),
    redirect: (url: string) => {
        throw new Error(`REDIRECT:${url}`);
    },
}));

vi.mock('next/font/google', () => ({
    Inter: () => ({ className: 'font-inter', variable: '--font-sans' }),
}));

vi.mock('next/dynamic', () => ({
    default: (loader: () => Promise<unknown>) => {
        void loader();
        return function DynamicStub(props: { children?: React.ReactNode }) {
            return React.createElement('div', props, props.children);
        };
    },
}));

vi.mock('framer-motion', () => {
    const motion = new Proxy(
        {},
        {
            get: () =>
                function MotionStub(props: { children?: React.ReactNode }) {
                    return React.createElement('div', props, props.children);
                },
        },
    );
    return {
        motion,
        AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
    };
});

vi.mock('recharts', () => {
    const stub = (name: string) =>
        function ChartStub(props: { children?: React.ReactNode }) {
            return React.createElement('div', { 'data-chart': name }, props.children);
        };
    return {
        ResponsiveContainer: stub('responsive'),
        AreaChart: stub('area-chart'),
        Area: stub('area'),
        XAxis: stub('x'),
        YAxis: stub('y'),
        Tooltip: stub('tooltip'),
        LineChart: stub('line-chart'),
        Line: stub('line'),
        CartesianGrid: stub('grid'),
        PieChart: stub('pie-chart'),
        Pie: stub('pie'),
        Cell: stub('cell'),
    };
});

vi.mock('../../../apps/dashboard/src/app/globals.css', () => ({}));

vi.mock('../../../apps/dashboard/src/lib/supabaseClient.js', () => ({
    supabaseClient: {
        auth,
        from: (table: string) => queryBuilder(table),
    },
}));

vi.mock('../../../apps/dashboard/src/lib/supabaseAdmin.js', () => ({
    getSupabaseAdminClient: () => {
        if (adminAuth.mode === 'throw') {
            throw new Error('admin offline');
        }
        return {
            auth: {
                getUser: async () => ({
                    data: {
                        user: adminAuth.mode === 'empty' ? null : { email: 'dev@gravity.ai' },
                    },
                }),
            },
        };
    },
}));

function queryBuilder(table: string) {
    const rows = rowsFor(table);
    const payload = { data: rows, error: null, count: Array.isArray(rows) ? rows.length : 1 };
    const builder: {
        select: () => typeof builder;
        insert: () => typeof builder;
        update: () => typeof builder;
        delete: () => typeof builder;
        eq: () => typeof builder;
        gte: () => typeof builder;
        order: () => typeof builder;
        limit: () => typeof builder;
        single: () => Promise<typeof payload>;
        maybeSingle: () => Promise<{ data: unknown; error: null; count: number }>;
        then: (resolve: (value: typeof payload) => unknown, reject?: (reason: unknown) => unknown) => Promise<unknown>;
    } = {
        select: () => builder,
        insert: () => builder,
        update: () => builder,
        delete: () => builder,
        eq: () => builder,
        gte: () => builder,
        order: () => builder,
        limit: () => builder,
        single: () => Promise.resolve({
            ...payload,
            data: Array.isArray(rows) ? rows[0] : rows,
        }),
        maybeSingle: () => Promise.resolve({
            data: Array.isArray(rows) ? rows[0] : rows,
            error: null,
            count: payload.count,
        }),
        then: (resolve, reject) => Promise.resolve(payload).then(resolve, reject),
    };
    return builder;
}

function rowsFor(table: string) {
    if (table === 'users') {
        return { id: USER.id, subscription_tier: 'pro' };
    }
    if (table === 'conversations') {
        return [{
            id: 'c1',
            user_identifier: 'Ada',
            status: 'active',
            started_at: new Date().toISOString(),
            last_message_at: new Date().toISOString(),
            agents: { name: 'Support Bot' },
        }];
    }
    if (table === 'analytics_events') {
        return [{ created_at: new Date().toISOString() }];
    }
    return [{
        id: 'agent-1',
        name: 'Support Bot',
        template_type: 'customer_support',
        status: 'active',
        created_at: new Date().toISOString(),
        personality: 'friendly',
        api_key: 'sk-test',
        channels: { web: true, whatsapp: false, api: true },
        user_id: USER.id,
    }];
}

import '../../../apps/dashboard/src/components/index.js';
import '../../../apps/dashboard/src/hooks/index.js';
import { AuthProvider } from '../../../apps/dashboard/src/hooks/useAuth.js';
import RootLayout from '../../../apps/dashboard/src/app/layout.js';
import HomePage from '../../../apps/dashboard/src/app/page.js';
import LoginPage from '../../../apps/dashboard/src/app/login/page.js';
import SignupPage from '../../../apps/dashboard/src/app/signup/page.js';
import ForgotPasswordPage from '../../../apps/dashboard/src/app/forgot-password/page.js';
import ContactPage from '../../../apps/dashboard/src/app/contact/page.js';
import DashboardLayout from '../../../apps/dashboard/src/app/(app)/layout.js';
import DashboardPage from '../../../apps/dashboard/src/app/(app)/dashboard/page.js';
import AgentsPage from '../../../apps/dashboard/src/app/(app)/agents/page.js';
import AgentDetailPage from '../../../apps/dashboard/src/app/(app)/agents/[id]/page.js';
import NewAgentPage from '../../../apps/dashboard/src/app/(app)/agents/new/page.js';
import AnalyticsPage from '../../../apps/dashboard/src/app/(app)/analytics/page.js';
import BillingPage from '../../../apps/dashboard/src/app/(app)/billing/page.js';
import ConversationsPage from '../../../apps/dashboard/src/app/(app)/conversations/page.js';
import SettingsPage from '../../../apps/dashboard/src/app/(app)/settings/page.js';
import TemplatesPage from '../../../apps/dashboard/src/app/(app)/templates/page.js';
import AnalyticsTab from '../../../apps/dashboard/src/app/components/AnalyticsTab.js';
import ChannelsTab from '../../../apps/dashboard/src/app/components/ChannelsTab.js';
import OverviewTab from '../../../apps/dashboard/src/app/components/OverviewTab.js';
import SettingsTab from '../../../apps/dashboard/src/app/components/SettingsTab.js';
import SkillsTab from '../../../apps/dashboard/src/app/components/SkillsTab.js';
import { ChatWidget } from '../../../apps/dashboard/src/components/ChatWidget.js';
import {
    Badge,
    Button,
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
    Input,
    Label,
    RadioGroup,
    RadioGroupItem,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Textarea,
} from '../../../apps/dashboard/src/components/ui/index.js';

function signedIn() {
    auth.getSession.mockResolvedValue({ data: { session: { user: USER } } });
    auth.getUser.mockResolvedValue({ data: { user: USER }, error: null });
    auth.onAuthStateChange.mockImplementation((cb: (event: string, session: { user: typeof USER } | null) => void) => {
        cb('SIGNED_IN', { user: USER });
        return { data: { subscription: { unsubscribe: vi.fn() } } };
    });
    auth.signInWithPassword.mockResolvedValue({ error: null });
    auth.signUp.mockResolvedValue({ data: { user: USER }, error: null });
    auth.resetPasswordForEmail.mockResolvedValue({ error: null });
    auth.signOut.mockResolvedValue({ error: null });
}

function renderSignedIn(node: React.ReactElement) {
    return render(React.createElement(AuthProvider, null, node));
}

describe('dashboard pages and ui', () => {
    beforeEach(() => {
        signedIn();
        adminAuth.mode = 'ok';
        router.push.mockReset();
        router.back.mockReset();
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: (query: string) => ({
                matches: false,
                media: query,
                addEventListener: () => undefined,
                removeEventListener: () => undefined,
                addListener: () => undefined,
                removeListener: () => undefined,
                dispatchEvent: () => false,
            }),
        });
        window.HTMLElement.prototype.scrollIntoView = () => undefined;
        window.HTMLElement.prototype.hasPointerCapture = () => false;
        window.HTMLElement.prototype.setPointerCapture = () => undefined;
        window.HTMLElement.prototype.releasePointerCapture = () => undefined;
        Object.assign(navigator, {
            clipboard: { writeText: vi.fn(async () => undefined) },
        });
    });

    it('renders the marketing site, auth screens, and contact form', async () => {
        render(React.createElement(HomePage));
        expect(screen.getAllByText('Gravity').length).toBeGreaterThan(0);
        fireEvent.scroll(window);
        fireEvent.click(screen.getAllByRole('button')[0]);
        cleanup();

        render(React.createElement(LoginPage));
        fireEvent.change(screen.getByPlaceholderText('you@company.com'), { target: { value: 'dev@gravity.ai' } });
        fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'secret' } });
        fireEvent.submit(screen.getByRole('button', { name: /sign in/i }).closest('form')!);
        await waitFor(() => expect(router.push).toHaveBeenCalledWith('/dashboard'));

        auth.signInWithPassword.mockResolvedValueOnce({ error: { message: 'bad credentials' } });
        fireEvent.submit(screen.getByRole('button', { name: /sign in/i }).closest('form')!);
        expect(await screen.findByText('bad credentials')).toBeTruthy();
        cleanup();

        render(React.createElement(SignupPage));
        fireEvent.change(screen.getByPlaceholderText('you@company.com'), { target: { value: 'dev@gravity.ai' } });
        fireEvent.change(screen.getByPlaceholderText('At least 8 characters'), { target: { value: 'secret' } });
        fireEvent.submit(screen.getByRole('button', { name: /create account/i }).closest('form')!);
        await waitFor(() => expect(router.push).toHaveBeenCalledWith('/dashboard'));
        cleanup();

        render(React.createElement(ForgotPasswordPage));
        fireEvent.change(screen.getByPlaceholderText('you@company.com'), { target: { value: 'dev@gravity.ai' } });
        fireEvent.submit(screen.getByRole('button', { name: /send reset link/i }).closest('form')!);
        expect(await screen.findByText('Check your inbox')).toBeTruthy();
        cleanup();

        vi.useFakeTimers();
        render(React.createElement(ContactPage));
        fireEvent.change(screen.getByPlaceholderText('John Doe'), { target: { value: 'Ada' } });
        fireEvent.submit(screen.getByRole('button', { name: /send message/i }).closest('form')!);
        await vi.advanceTimersByTimeAsync(1500);
        vi.useRealTimers();
        cleanup();
    });

    it('renders signed-in app pages and exercises agent actions', async () => {
        const layout = await DashboardLayout({ children: React.createElement('p', null, 'child') });
        render(layout);
        expect(screen.getByText('child')).toBeTruthy();
        expect(screen.getByText('dev@gravity.ai')).toBeTruthy();
        cleanup();

        adminAuth.mode = 'empty';
        await expect(DashboardLayout({ children: null })).rejects.toThrow('REDIRECT:/login');
        adminAuth.mode = 'throw';
        const fallback = await DashboardLayout({ children: React.createElement('p', null, 'offline') });
        render(fallback);
        expect(screen.getByText('mangesh@gravity.ai')).toBeTruthy();
        cleanup();

        render(React.createElement(RootLayout, null, React.createElement('p', null, 'root-child')));
        expect(screen.getByText('root-child')).toBeTruthy();
        cleanup();

        renderSignedIn(React.createElement(DashboardPage));
        expect(await screen.findByText(/Welcome back/)).toBeTruthy();
        cleanup();

        renderSignedIn(React.createElement(AgentsPage));
        expect(await screen.findByText('Support Bot')).toBeTruthy();
        fireEvent.change(screen.getByPlaceholderText(/search agents/i), { target: { value: 'missing' } });
        expect(screen.getByText('No matches found')).toBeTruthy();
        fireEvent.change(screen.getByPlaceholderText(/search agents/i), { target: { value: '' } });
        fireEvent.click(screen.getByTitle('Pause Agent'));
        await waitFor(() => expect(screen.getByTitle('Activate Agent')).toBeTruthy());
        vi.spyOn(window, 'confirm').mockReturnValue(true);
        fireEvent.click(screen.getByTitle('Delete Agent'));
        await waitFor(() => expect(screen.queryByText('Support Bot')).toBeNull());
        cleanup();

        vi.spyOn(window, 'confirm').mockReturnValue(true);
        renderSignedIn(React.createElement(AgentDetailPage, { params: Promise.resolve({ id: 'agent-1' }) }));
        expect(await screen.findByRole('heading', { name: 'Support Bot' })).toBeTruthy();
        fireEvent.click(screen.getByRole('switch'));
        const copyButton = document.querySelector('button.h-12');
        if (copyButton) fireEvent.click(copyButton);
        const deleteButton = document.querySelector('button.text-red-500');
        if (!deleteButton) throw new Error('delete button missing');
        fireEvent.click(deleteButton);
        await waitFor(() => expect(router.push).toHaveBeenCalledWith('/agents'));
        cleanup();

        renderSignedIn(React.createElement(NewAgentPage));
        fireEvent.change(await screen.findByLabelText('Agent Name'), { target: { value: 'Closer' } });
        for (let step = 0; step < 4; step += 1) {
            fireEvent.click(screen.getByRole('button', { name: /next step/i }));
        }
        fireEvent.click(screen.getByRole('button', { name: /launch agent/i }));
        await waitFor(() => expect(router.push).toHaveBeenCalledWith('/agents'));
        cleanup();

        renderSignedIn(React.createElement(AnalyticsPage));
        expect(await screen.findByText(/analytics/i)).toBeTruthy();
        cleanup();

        renderSignedIn(React.createElement(BillingPage));
        expect(await screen.findByText('Pro')).toBeTruthy();
        cleanup();

        renderSignedIn(React.createElement(ConversationsPage));
        expect(await screen.findByText('Ada')).toBeTruthy();
        cleanup();

        renderSignedIn(React.createElement(SettingsPage));
        expect(screen.getByRole('heading', { name: 'Settings' })).toBeTruthy();
        cleanup();
        renderSignedIn(React.createElement(TemplatesPage));
        expect(screen.getByRole('heading', { name: 'Agent Templates' })).toBeTruthy();
        cleanup();
    });

    it('renders operator tabs, the chat widget, and shared ui controls', async () => {
        const stats = {
            status: 'operational' as const,
            uptime: 90061,
            activeConnections: 3,
            totalRequests: 1200,
            errorRate: 0.01,
            responseTime: 80,
            cpuUsage: 10,
            memoryUsage: 2048,
            diskUsage: 4096,
            networkIO: 0,
        };
        render(React.createElement(OverviewTab, {
            systemStats: stats,
            darkMode: true,
            totalMessages: 10,
            performanceData: [{ time: 'now', requests: 1, responseTime: 20 }],
        }));
        render(React.createElement(OverviewTab, {
            systemStats: { ...stats, status: 'offline', memoryUsage: 0 },
            darkMode: false,
            totalMessages: 0,
            performanceData: [],
        }));
        render(React.createElement(ChannelsTab, {
            darkMode: false,
            channels: [
                { id: '1', name: 'WA', type: 'whatsapp', status: 'connected', messageCount: 1, errorCount: 0, latency: 10 },
                { id: '2', name: 'TG', type: 'telegram', status: 'disconnected', messageCount: 0, errorCount: 1, latency: 20 },
                { id: '3', name: 'SL', type: 'slack', status: 'error', messageCount: 2, errorCount: 2, latency: 30 },
            ],
        }));
        render(React.createElement(SkillsTab, {
            darkMode: true,
            skills: [{
                id: 's1',
                name: 'Search',
                description: 'Find things',
                category: 'utility',
                status: 'active',
                usageCount: 4,
                successRate: 0.9,
            }],
        }));
        render(React.createElement(AnalyticsTab, { darkMode: true }));
        render(React.createElement(AnalyticsTab, { darkMode: false }));
        render(React.createElement(SettingsTab, { darkMode: true }));
        render(React.createElement(SettingsTab, { darkMode: false }));
        cleanup();

        const fetchMock = vi.spyOn(globalThis, 'fetch');
        fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ data: { response: 'Hello' } }), { status: 200 }));
        render(React.createElement(ChatWidget, { agentId: 'agent-1' }));
        fireEvent.change(screen.getByPlaceholderText(/type a message/i), { target: { value: 'Hi' } });
        fireEvent.click(screen.getByRole('button', { name: 'Send' }));
        expect(await screen.findByText('Hello')).toBeTruthy();

        fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ error: 'nope' }), { status: 500 }));
        fireEvent.change(screen.getByPlaceholderText(/type a message/i), { target: { value: 'Again' } });
        fireEvent.keyDown(screen.getByPlaceholderText(/type a message/i), { key: 'Enter' });
        expect(await screen.findByRole('alert')).toBeTruthy();
        fetchMock.mockRestore();
        cleanup();

        render(React.createElement('div', null,
            React.createElement(Button, { variant: 'premium', size: 'sm' }, 'Go'),
            React.createElement(Button, { asChild: true }, React.createElement('a', { href: '/x' }, 'Link')),
            React.createElement(Badge, { variant: 'success' }, 'ok'),
            React.createElement(Input, { placeholder: 'field', 'aria-label': 'field' }),
            React.createElement(Textarea, { placeholder: 'notes', 'aria-label': 'notes' }),
            React.createElement(Label, null, 'Label'),
            React.createElement(Switch, { 'aria-label': 'toggle' }),
            React.createElement(RadioGroup, { defaultValue: 'a' },
                React.createElement(RadioGroupItem, { value: 'a', 'aria-label': 'a' }),
            ),
            React.createElement(Tabs, { defaultValue: 'one' },
                React.createElement(TabsList, null, React.createElement(TabsTrigger, { value: 'one' }, 'One')),
                React.createElement(TabsContent, { value: 'one' }, 'tab body'),
            ),
            React.createElement(Table, null,
                React.createElement(TableHeader, null, React.createElement(TableRow, null, React.createElement(TableHead, null, 'H'))),
                React.createElement(TableBody, null, React.createElement(TableRow, null, React.createElement(TableCell, null, 'C'))),
            ),
            React.createElement(DropdownMenu, { open: true },
                React.createElement(DropdownMenuTrigger, null, 'Menu'),
                React.createElement(DropdownMenuContent, null,
                    React.createElement(DropdownMenuLabel, null, 'Label'),
                    React.createElement(DropdownMenuItem, null, 'Item'),
                    React.createElement(DropdownMenuCheckboxItem, { checked: true }, 'Check'),
                    React.createElement(DropdownMenuRadioGroup, { value: 'a' },
                        React.createElement(DropdownMenuRadioItem, { value: 'a' }, 'Radio'),
                    ),
                    React.createElement(DropdownMenuSeparator),
                    React.createElement(DropdownMenuShortcut, null, '⌘K'),
                    React.createElement(DropdownMenuSub, null,
                        React.createElement(DropdownMenuSubTrigger, null, 'More'),
                        React.createElement(DropdownMenuSubContent, null, React.createElement(DropdownMenuItem, null, 'Nested')),
                    ),
                ),
            ),
        ));
        fireEvent.click(screen.getByText('Menu'));
        expect(await screen.findByText('Item')).toBeTruthy();
    });
});
