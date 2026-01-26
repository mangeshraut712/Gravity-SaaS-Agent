import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Zap, Activity, Cpu, Settings, ArrowRight, Command,
    BarChart2, Globe, Shield, Search, AlertTriangle, CheckCircle,
    MessageSquare, Users, Bot, Layers, Wifi, WifiOff, RefreshCw,
    Database, Cloud, Lock, TrendingUp, Clock, Filter, Download,
    Upload, Play, Pause, SkipForward, Volume2, Bell, User, LogOut,
    Menu, X, Maximize2, Minimize2, Monitor, Smartphone, Tablet
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, RadarChart,
    PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend
} from 'recharts';

// Enhanced Types
interface Message { 
    id: string;
    role: 'user' | 'assistant' | 'system'; 
    text: string; 
    timestamp: Date;
    channelId?: string;
    channelType?: string;
    metadata?: {
        tokens?: number;
        processingTime?: number;
        skillUsed?: string;
        confidence?: number;
    };
}

interface SystemStats {
    status: 'online' | 'offline' | 'degraded' | 'maintenance';
    uptime: number;
    activeSessions: number;
    mcpTools: number;
    memoryUsage: {
        rss: number;
        heapUsed: number;
        heapTotal: number;
        external: number;
        arrayBuffers: number;
    };
    userTier: 'FREE' | 'PRO' | 'ENTERPRISE';
    usagePercent: number;
    errorRate: number;
    responseTime: number;
    requestsPerSecond: number;
    cpuUsage: number;
    diskUsage: number;
    networkIO: {
        bytesIn: number;
        bytesOut: number;
    };
}

interface ChannelStatus {
    totalChannels: number;
    connectedChannels: number;
    channelTypes: string[];
    channels: Array<{
        type: string;
        status: 'connected' | 'disconnected' | 'error';
        lastMessage?: Date;
        messageCount: number;
        errorCount: number;
        responseTime: number;
    }>;
}

interface SkillStats {
    totalSkills: number;
    totalWorkspaces: number;
    totalExecutions: number;
    executionsByStatus: Record<string, number>;
    skillsByCategory: Record<string, number>;
    recentExecutions: Array<{
        id: string;
        skillName: string;
        status: 'completed' | 'failed' | 'running';
        duration: number;
        timestamp: Date;
        userId: string;
    }>;
    performanceMetrics: {
        avgExecutionTime: number;
        successRate: number;
        totalProcessingTime: number;
    };
}

interface Alert {
    id: string;
    type: 'info' | 'warning' | 'error' | 'success';
    title: string;
    message: string;
    timestamp: Date;
    acknowledged: boolean;
}

interface User {
    id: string;
    name: string;
    email: string;
    tier: 'FREE' | 'PRO' | 'ENTERPRISE';
    avatar?: string;
    lastActive: Date;
    status: 'online' | 'offline' | 'away';
}

// Enhanced Dashboard Component
export default function AdvancedDashboard() {
    // State Management
    const [data, setData] = useState(() =>
        Array.from({ length: 30 }, (_, i) => ({
            time: new Date(Date.now() - (29 - i) * 60000).toLocaleTimeString(),
            tokens: Math.floor(Math.random() * 8000) + 2000,
            cost: Math.floor(Math.random() * 3000) + 1000,
            requests: Math.floor(Math.random() * 100) + 20,
            errors: Math.floor(Math.random() * 10),
            responseTime: Math.floor(Math.random() * 500) + 100
        }))
    );
    
    const [messages, setMessages] = useState<Message[]>([
        { 
            id: '1', 
            role: 'system', 
            text: "🚀 Advanced GravityOS Dashboard initialized with real-time monitoring", 
            timestamp: new Date() 
        }
    ]);

    const [stats, setStats] = useState<SystemStats>({
        status: 'online',
        uptime: 0,
        activeSessions: 0,
        mcpTools: 0,
        memoryUsage: { rss: 0, heapUsed: 0, heapTotal: 0, external: 0, arrayBuffers: 0 },
        userTier: 'PRO',
        usagePercent: 0,
        errorRate: 0,
        responseTime: 0,
        requestsPerSecond: 0,
        cpuUsage: 0,
        diskUsage: 0,
        networkIO: { bytesIn: 0, bytesOut: 0 }
    });

    const [channelStats, setChannelStats] = useState<ChannelStatus>({
        totalChannels: 0,
        connectedChannels: 0,
        channelTypes: [],
        channels: []
    });

    const [skillStats, setSkillStats] = useState<SkillStats>({
        totalSkills: 0,
        totalWorkspaces: 0,
        totalExecutions: 0,
        executionsByStatus: {},
        skillsByCategory: {},
        recentExecutions: [],
        performanceMetrics: {
            avgExecutionTime: 0,
            successRate: 0,
            totalProcessingTime: 0
        }
    });

    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error' | 'reconnecting'>('connecting');
    const [activeTab, setActiveTab] = useState<'overview' | 'channels' | 'skills' | 'analytics' | 'users' | 'settings'>('overview');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [currentUser, setCurrentUser] = useState<User>({
        id: 'admin',
        name: 'Administrator',
        email: 'admin@gravityos.ai',
        tier: 'ENTERPRISE',
        lastActive: new Date(),
        status: 'online'
    });
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [refreshInterval, setRefreshInterval] = useState(3000);
    const [selectedTimeRange, setSelectedTimeRange] = useState<'1h' | '6h' | '24h' | '7d'>('1h');

    // Enhanced data fetching with WebSocket simulation
    const fetchStats = useCallback(async () => {
        try {
            const [statsRes, channelRes, skillsRes] = await Promise.allSettled([
                fetch('http://localhost:3003/api/stats'),
                fetch('http://localhost:3003/api/channels/status'),
                fetch('http://localhost:3003/api/skills')
            ]);

            // Handle system stats
            if (statsRes.status === 'fulfilled' && statsRes.value.ok) {
                const json = await statsRes.value.json();
                if (json.success && json.data) {
                    setStats(prev => ({
                        ...prev,
                        ...json.data,
                        requestsPerSecond: Math.random() * 50 + 10,
                        cpuUsage: Math.random() * 80 + 10,
                        diskUsage: Math.random() * 60 + 20,
                        networkIO: {
                            bytesIn: Math.floor(Math.random() * 1000000),
                            bytesOut: Math.floor(Math.random() * 1000000)
                        }
                    }));
                    setConnectionStatus('connected');
                }
            }

            // Handle channel stats
            if (channelRes.status === 'fulfilled' && channelRes.value.ok) {
                const json = await channelRes.value.json();
                if (json.success && json.data) {
                    setChannelStats(prev => ({
                        ...prev,
                        ...json.data.stats,
                        channels: json.data.stats.channelTypes?.map((type: string, index: number) => ({
                            type,
                            status: Math.random() > 0.1 ? 'connected' : Math.random() > 0.5 ? 'disconnected' : 'error',
                            lastMessage: new Date(Date.now() - Math.random() * 3600000),
                            messageCount: Math.floor(Math.random() * 1000),
                            errorCount: Math.floor(Math.random() * 10),
                            responseTime: Math.floor(Math.random() * 300) + 50
                        })) || []
                    }));
                }
            }

            // Handle skills stats
            if (skillsRes.status === 'fulfilled' && skillsRes.value.ok) {
                const json = await skillsRes.value.json();
                if (json.success && json.data) {
                    setSkillStats(prev => ({
                        ...prev,
                        ...json.data.stats,
                        recentExecutions: Array.from({ length: 10 }, (_, i) => ({
                            id: `exec-${i}`,
                            skillName: ['web-search', 'file-manager', 'automation', 'communication'][Math.floor(Math.random() * 4)],
                            status: ['completed', 'failed', 'running'][Math.floor(Math.random() * 3)] as any,
                            duration: Math.floor(Math.random() * 5000) + 500,
                            timestamp: new Date(Date.now() - Math.random() * 3600000),
                            userId: `user-${Math.floor(Math.random() * 100)}`
                        })),
                        performanceMetrics: {
                            avgExecutionTime: Math.floor(Math.random() * 2000) + 500,
                            successRate: Math.random() * 20 + 80,
                            totalProcessingTime: Math.floor(Math.random() * 10000) + 1000
                        }
                    }));
                }
            }

        } catch (e) {
            console.error('Stats fetch error:', e);
            setStats(s => ({ ...s, status: 'degraded' }));
            setConnectionStatus('error');
            
            // Add alert for connection issues
            setAlerts(prev => [...prev, {
                id: `alert-${Date.now()}`,
                type: 'error',
                title: 'Connection Error',
                message: 'Failed to fetch data from gateway',
                timestamp: new Date(),
                acknowledged: false
            }]);
        }
    }, []);

    // Enhanced data simulation with more realistic patterns
    useEffect(() => {
        if (!autoRefresh) return;
        
        const interval = setInterval(() => {
            setData((prev: any) => {
                const newData = [...prev.slice(1)];
                const lastTokens = prev[prev.length - 1].tokens;
                const lastRequests = prev[prev.length - 1].requests;
                
                // Add realistic patterns
                const timeOfDay = new Date().getHours();
                const isBusinessHours = timeOfDay >= 9 && timeOfDay <= 17;
                const baseTokens = isBusinessHours ? 5000 : 2000;
                const baseRequests = isBusinessHours ? 60 : 20;
                
                newData.push({
                    time: new Date().toLocaleTimeString(),
                    tokens: Math.max(1000, lastTokens + (Math.random() - 0.5) * 2000 + baseTokens),
                    cost: Math.max(500, Math.floor(Math.random() * 2500) + 1000),
                    requests: Math.max(10, lastRequests + (Math.random() - 0.5) * 20 + baseRequests),
                    errors: Math.max(0, Math.floor(Math.random() * 5)),
                    responseTime: Math.max(50, Math.floor(Math.random() * 400) + 100)
                });
                return newData;
            });
        }, refreshInterval);
        
        return () => clearInterval(interval);
    }, [autoRefresh, refreshInterval]);

    // Initial data fetch
    useEffect(() => {
        fetchStats();
        if (autoRefresh) {
            const interval = setInterval(fetchStats, refreshInterval);
            return () => clearInterval(interval);
        }
    }, [fetchStats, autoRefresh, refreshInterval]);

    // Memoized chart data
    const chartData = useMemo(() => data, [data]);
    
    const skillCategoryData = useMemo(() => 
        Object.entries(skillStats.skillsByCategory).map(([category, count], index) => ({
            name: category.charAt(0).toUpperCase() + category.slice(1),
            value: count as number,
            color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'][index % 6]
        })), [skillStats.skillsByCategory]);

    const performanceData = useMemo(() => [
        { subject: 'Speed', A: 120, B: 110, fullMark: 150 },
        { subject: 'Reliability', A: 98, B: 130, fullMark: 150 },
        { subject: 'Security', A: 86, B: 130, fullMark: 150 },
        { subject: 'Scalability', A: 99, B: 100, fullMark: 150 },
        { subject: 'Efficiency', A: 85, B: 90, fullMark: 150 },
        { subject: 'Features', A: 65, B: 85, fullMark: 150 }
    ], []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'online': return '#10B981';
            case 'offline': return '#EF4444';
            case 'degraded': return '#F59E0B';
            case 'maintenance': return '#8B5CF6';
            case 'connected': return '#10B981';
            case 'disconnected': return '#6B7280';
            case 'error': return '#EF4444';
            default: return '#6B7280';
        }
    };

    const getConnectionIcon = () => {
        switch (connectionStatus) {
            case 'connected': return <CheckCircle size={16} color="#10B981" />;
            case 'error': return <AlertTriangle size={16} color="#EF4444" />;
            case 'reconnecting': return <RefreshCw size={16} color="#F59E0B" className="animate-spin" />;
            default: return <Activity size={16} color="#6B7280" />;
        }
    };

    const acknowledgeAlert = (alertId: string) => {
        setAlerts(prev => prev.map(alert => 
            alert.id === alertId ? { ...alert, acknowledged: true } : alert
        ));
    };

    const clearAlerts = () => {
        setAlerts([]);
    };

    return (
        <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 ${isDarkMode ? 'dark' : ''}`}>
            {/* Enhanced Header */}
            <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        >
                            {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
                        </button>
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                                <Zap size={24} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">GravityOS Advanced</h1>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Enterprise AI Agent Platform</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        {/* Connection Status */}
                        <div className="flex items-center space-x-2 px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                            {getConnectionIcon()}
                            <span className="text-sm font-medium">{connectionStatus.toUpperCase()}</span>
                        </div>

                        {/* Auto Refresh Toggle */}
                        <button
                            onClick={() => setAutoRefresh(!autoRefresh)}
                            className={`p-2 rounded-lg transition-colors ${
                                autoRefresh 
                                    ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' 
                                    : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                            }`}
                        >
                            <RefreshCw size={20} className={autoRefresh ? 'animate-spin' : ''} />
                        </button>

                        {/* Alerts */}
                        <div className="relative">
                            <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors relative">
                                <Bell size={20} />
                                {alerts.filter(a => !a.acknowledged).length > 0 && (
                                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                                )}
                            </button>
                        </div>

                        {/* User Menu */}
                        <div className="flex items-center space-x-3 px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <User size={16} className="text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">{currentUser.name}</p>
                                <p className="text-xs text-slate-600 dark:text-slate-400">{currentUser.tier}</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setIsDarkMode(!isDarkMode)}
                                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            >
                                {isDarkMode ? <Monitor size={20} /> : <Monitor size={20} />}
                            </button>
                            <button
                                onClick={() => setIsFullscreen(!isFullscreen)}
                                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            >
                                {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Enhanced Sidebar */}
                <nav className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-all duration-300 min-h-screen`}>
                    <div className="p-4">
                        {!sidebarCollapsed && (
                            <div className="space-y-6">
                                {/* Navigation */}
                                <div>
                                    <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Navigation</h3>
                                    <div className="space-y-1">
                                        {[
                                            { id: 'overview', label: 'Overview', icon: Activity },
                                            { id: 'channels', label: 'Channels', icon: MessageSquare },
                                            { id: 'skills', label: 'Skills', icon: Bot },
                                            { id: 'analytics', label: 'Analytics', icon: BarChart2 },
                                            { id: 'users', label: 'Users', icon: Users },
                                            { id: 'settings', label: 'Settings', icon: Settings }
                                        ].map(({ id, label, icon: Icon }) => (
                                            <button
                                                key={id}
                                                onClick={() => setActiveTab(id as any)}
                                                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                                                    activeTab === id
                                                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                                                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
                                                }`}
                                            >
                                                <Icon size={18} />
                                                <span className="font-medium">{label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                <div>
                                    <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Quick Stats</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-600 dark:text-slate-400">Status</span>
                                            <span className="text-sm font-medium" style={{ color: getStatusColor(stats.status) }}>
                                                {stats.status.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-600 dark:text-slate-400">Sessions</span>
                                            <span className="text-sm font-medium">{stats.activeSessions}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-600 dark:text-slate-400">Uptime</span>
                                            <span className="text-sm font-medium">{Math.floor(stats.uptime / 3600)}h</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Collapsed Mode Icons */}
                        {sidebarCollapsed && (
                            <div className="space-y-4">
                                {[
                                    { id: 'overview', icon: Activity },
                                    { id: 'channels', icon: MessageSquare },
                                    { id: 'skills', icon: Bot },
                                    { id: 'analytics', icon: BarChart2 },
                                    { id: 'users', icon: Users },
                                    { id: 'settings', icon: Settings }
                                ].map(({ id, icon: Icon }) => (
                                    <button
                                        key={id}
                                        onClick={() => setActiveTab(id as any)}
                                        className={`w-full flex justify-center p-2 rounded-lg transition-colors ${
                                            activeTab === id
                                                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                                                : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
                                        }`}
                                    >
                                        <Icon size={18} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </nav>

                {/* Main Content */}
                <main className="flex-1 p-6">
                    {/* Alerts Bar */}
                    {alerts.length > 0 && (
                        <div className="mb-6 space-y-2">
                            {alerts.filter(alert => !alert.acknowledged).map(alert => (
                                <motion.div
                                    key={alert.id}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`p-4 rounded-lg border-l-4 ${
                                        alert.type === 'error' ? 'bg-red-50 border-red-500 dark:bg-red-900/20' :
                                        alert.type === 'warning' ? 'bg-yellow-50 border-yellow-500 dark:bg-yellow-900/20' :
                                        alert.type === 'success' ? 'bg-green-50 border-green-500 dark:bg-green-900/20' :
                                        'bg-blue-50 border-blue-500 dark:bg-blue-900/20'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium">{alert.title}</h4>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">{alert.message}</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => acknowledgeAlert(alert.id)}
                                                className="text-sm text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                                            >
                                                Acknowledge
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Time Range Selector */}
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Time Range:</span>
                            {(['1h', '6h', '24h', '7d'] as const).map(range => (
                                <button
                                    key={range}
                                    onClick={() => setSelectedTimeRange(range)}
                                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                        selectedTimeRange === range
                                            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                                            : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    {range}
                                </button>
                            ))}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                <Download size={18} />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                <Filter size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === 'overview' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {/* Status Cards */}
                                    <motion.div
                                        className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700"
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                                                <Activity size={20} className="text-green-600 dark:text-green-400" />
                                            </div>
                                            <span className="text-2xl font-bold text-green-600">{stats.status === 'online' ? '●' : '○'}</span>
                                        </div>
                                        <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">System Status</h3>
                                        <p className="text-2xl font-bold text-slate-900 dark:text-white capitalize">{stats.status}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Uptime: {Math.floor(stats.uptime / 3600)}h {Math.floor((stats.uptime % 3600) / 60)}m</p>
                                    </motion.div>

                                    <motion.div
                                        className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700"
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                                <Users size={20} className="text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <span className="text-sm text-blue-600">+12%</span>
                                        </div>
                                        <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Active Sessions</h3>
                                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.activeSessions}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Peak: 24 today</p>
                                    </motion.div>

                                    <motion.div
                                        className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700"
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                                <Bot size={20} className="text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <span className="text-sm text-purple-600">{skillStats.totalSkills}</span>
                                        </div>
                                        <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Skills Active</h3>
                                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{skillStats.totalExecutions}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Success rate: {skillStats.performanceMetrics.successRate.toFixed(1)}%</p>
                                    </motion.div>

                                    <motion.div
                                        className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700"
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                                                <MessageSquare size={20} className="text-orange-600 dark:text-orange-400" />
                                            </div>
                                            <span className="text-sm text-orange-600">{channelStats.connectedChannels}/{channelStats.totalChannels}</span>
                                        </div>
                                        <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Channels</h3>
                                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{channelStats.connectedChannels}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">All systems operational</p>
                                    </motion.div>

                                    {/* Performance Chart */}
                                    <div className="col-span-full lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Performance Overview</h3>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <AreaChart data={chartData}>
                                                <defs>
                                                    <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                                    </linearGradient>
                                                    <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <XAxis dataKey="time" />
                                                <YAxis />
                                                <Tooltip />
                                                <Area type="monotone" dataKey="tokens" stroke="#3B82F6" fillOpacity={1} fill="url(#colorTokens)" />
                                                <Area type="monotone" dataKey="requests" stroke="#10B981" fillOpacity={1} fill="url(#colorRequests)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>

                                    {/* System Resources */}
                                    <div className="col-span-full lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">System Resources</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-sm text-slate-600 dark:text-slate-400">CPU Usage</span>
                                                    <span className="text-sm font-medium">{stats.cpuUsage.toFixed(1)}%</span>
                                                </div>
                                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                    <div 
                                                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${stats.cpuUsage}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-sm text-slate-600 dark:text-slate-400">Memory Usage</span>
                                                    <span className="text-sm font-medium">{((stats.memoryUsage.heapUsed / stats.memoryUsage.heapTotal) * 100).toFixed(1)}%</span>
                                                </div>
                                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                    <div 
                                                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${(stats.memoryUsage.heapUsed / stats.memoryUsage.heapTotal) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-sm text-slate-600 dark:text-slate-400">Disk Usage</span>
                                                    <span className="text-sm font-medium">{stats.diskUsage.toFixed(1)}%</span>
                                                </div>
                                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                    <div 
                                                        className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${stats.diskUsage}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-sm text-slate-600 dark:text-slate-400">Response Time</span>
                                                    <span className="text-sm font-medium">{stats.responseTime}ms</span>
                                                </div>
                                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                    <div 
                                                        className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${Math.min(100, (stats.responseTime / 500) * 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
