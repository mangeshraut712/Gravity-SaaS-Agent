'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Zap, Activity, Cpu, Settings, ArrowRight, Command,
    BarChart2, Globe, Shield, TrendingUp, Users, MessageSquare,
    Menu, X, Moon, Sun, Bell, Wifi, WifiOff, Server
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    CartesianGrid
} from 'recharts';

interface Message { 
    role: 'user' | 'assistant'; 
    text: string; 
    timestamp?: Date;
    id?: string;
}

interface SystemStats {
    status: 'online' | 'offline' | 'degraded';
    uptime: number;
    activeSessions: number;
    mcpTools: number;
    memoryUsage: Record<string, number>;
    userTier: string;
    usagePercent: number;
    errorRate?: number;
    responseTime?: number;
    cpuUsage?: number;
}

interface ChannelStatus {
    type: string;
    status: 'connected' | 'disconnected' | 'error';
    messageCount?: number;
    errorCount?: number;
}

interface SkillStats {
    id: string;
    name: string;
    category: string;
    executionCount: number;
    successRate: number;
    averageLatency: number;
}

const COLORS = ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899'];

export default function GravityOSDashboard() {
    const [darkMode, setDarkMode] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [timeRange, setTimeRange] = useState('1h');
    
    const [performanceData, setPerformanceData] = useState(() =>
        Array.from({ length: 20 }, (_, i) => ({
            time: new Date(Date.now() - (19 - i) * 5 * 60 * 1000).toLocaleTimeString(),
            tokens: Math.floor(Math.random() * 5000) + 2000,
            requests: Math.floor(Math.random() * 100) + 50,
            errors: Math.floor(Math.random() * 10),
            cpu: Math.floor(Math.random() * 80) + 20,
            memory: Math.floor(Math.random() * 70) + 30
        }))
    );
    
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', text: "🌌 Welcome to GravityOS v2.0 - Enterprise AI Platform", id: '1' },
        { role: 'assistant', text: "All systems operational. Enhanced monitoring and security active.", id: '2' }
    ]);

    const [stats, setStats] = useState<SystemStats>({
        status: 'offline',
        activeSessions: 0,
        mcpTools: 0,
        uptime: 0,
        userTier: 'ENTERPRISE',
        usagePercent: 0,
        memoryUsage: { rss: 0, heapUsed: 0, heapTotal: 0 },
        cpuUsage: 0
    });

    const [channels, setChannels] = useState<ChannelStatus[]>([
        { type: 'WhatsApp', status: 'connected', messageCount: 1234, errorCount: 2 },
        { type: 'Telegram', status: 'connected', messageCount: 892, errorCount: 0 },
        { type: 'Slack', status: 'connected', messageCount: 567, errorCount: 1 }
    ]);

    const [skills, setSkills] = useState<SkillStats[]>([
        { id: 'web-search', name: 'Web Search', category: 'utility', executionCount: 342, successRate: 98.5, averageLatency: 1.2 },
        { id: 'file-manager', name: 'File Manager', category: 'productivity', executionCount: 156, successRate: 99.2, averageLatency: 0.8 },
        { id: 'automation', name: 'Automation', category: 'automation', executionCount: 89, successRate: 96.6, averageLatency: 2.1 },
        { id: 'communication', name: 'Communication', category: 'communication', executionCount: 234, successRate: 97.8, averageLatency: 1.5 }
    ]);

    const [inputText, setInputText] = useState('');
    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
    const [selectedModel, setSelectedModel] = useState('openrouter/anthropic/claude-sonnet-4-5');
    const [isLoading, setIsLoading] = useState(false);

    // API Calls
    const fetchSystemStats = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:3004/api/stats');
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setStats(prev => ({ 
                        ...prev, 
                        ...data.data.system, 
                        status: 'online'
                    }));
                    setConnectionStatus('connected');
                }
            }
        } catch (error) {
            setConnectionStatus('error');
        }
    }, []);

    useEffect(() => {
        fetchSystemStats();
        const interval = setInterval(fetchSystemStats, 5000);
        return () => clearInterval(interval);
    }, [fetchSystemStats]);

    // Real-time data simulation
    useEffect(() => {
        const interval = setInterval(() => {
            setPerformanceData(prev => {
                const newData = [...prev.slice(1)];
                const lastTokens = prev[prev.length - 1].tokens;
                newData.push({
                    time: new Date().toLocaleTimeString(),
                    tokens: Math.max(1000, lastTokens + (Math.random() - 0.5) * 1000),
                    requests: Math.floor(Math.random() * 100) + 50,
                    errors: Math.floor(Math.random() * 5),
                    cpu: Math.floor(Math.random() * 80) + 20,
                    memory: Math.floor(Math.random() * 70) + 30
                });
                return newData;
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleSendMessage = async () => {
        if (!inputText.trim() || isLoading) return;
        
        const userMessage: Message = { 
            role: 'user', 
            text: inputText, 
            timestamp: new Date(),
            id: Date.now().toString()
        };
        
        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:3004/api/chat/completions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [{ role: 'user', content: inputText }],
                    model: selectedModel,
                    maxTokens: 1000
                })
            });

            const data = await response.json();
            
            if (data.success) {
                const assistantMessage: Message = {
                    role: 'assistant',
                    text: data.data.content,
                    timestamp: new Date(),
                    id: (Date.now() + 1).toString()
                };
                setMessages(prev => [...prev, assistantMessage]);
            } else {
                throw new Error(data.error || 'Failed to process message');
            }
        } catch (error) {
            const errorMessage: Message = {
                role: 'assistant',
                text: `❌ Error: ${error instanceof Error ? error.message : 'Failed to process request'}`,
                timestamp: new Date(),
                id: (Date.now() + 1).toString()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'online': case 'connected': return '#10B981';
            case 'offline': case 'disconnected': return '#EF4444';
            case 'degraded': case 'error': return '#F59E0B';
            default: return '#6B7280';
        }
    };

    const formatUptime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    };

    const totalMessages = useMemo(() => 
        channels.reduce((sum, ch) => sum + (ch.messageCount || 0), 0), [channels]);

    return (
        <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
            <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-6 py-4`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                        >
                            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg">
                                <Zap size={24} className="text-white" />
                            </div>
                            <div>
                                <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    GravityOS Dashboard
                                </h1>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Enterprise AI Platform
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            {connectionStatus === 'connected' ? (
                                <Wifi className="text-green-500" size={20} />
                            ) : (
                                <WifiOff className="text-red-500" size={20} />
                            )}
                            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
                            </span>
                        </div>
                        
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                        >
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex">
                <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'} overflow-hidden`}>
                    <nav className="p-4 space-y-2">
                        {[
                            { id: 'overview', label: 'Overview', icon: BarChart2 },
                            { id: 'channels', label: 'Channels', icon: Globe },
                            { id: 'skills', label: 'Skills', icon: Command },
                            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
                            { id: 'users', label: 'Users', icon: Users },
                            { id: 'settings', label: 'Settings', icon: Settings }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                    activeTab === tab.id
                                        ? 'bg-purple-600 text-white'
                                        : darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                                }`}
                            >
                                <tab.icon size={20} />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </aside>

                <main className="flex-1 p-6">
                    {activeTab === 'overview' && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <motion.div whileHover={{ scale: 1.02 }} className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-3 rounded-lg ${darkMode ? 'bg-green-900' : 'bg-green-100'}`}>
                                            <Server className="text-green-600" size={24} />
                                        </div>
                                        <span className={`text-sm font-medium ${getStatusColor(stats.status)}`}>
                                            {stats.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {formatUptime(stats.uptime)}
                                    </h3>
                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Uptime</p>
                                </motion.div>

                                <motion.div whileHover={{ scale: 1.02 }} className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-3 rounded-lg ${darkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                                            <Users className="text-blue-600" size={24} />
                                        </div>
                                        <TrendingUp className="text-green-500" size={20} />
                                    </div>
                                    <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {stats.activeSessions}
                                    </h3>
                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Active Sessions</p>
                                </motion.div>

                                <motion.div whileHover={{ scale: 1.02 }} className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-3 rounded-lg ${darkMode ? 'bg-purple-900' : 'bg-purple-100'}`}>
                                            <MessageSquare className="text-purple-600" size={24} />
                                        </div>
                                        <span className="text-xs text-green-500">+12%</span>
                                    </div>
                                    <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {totalMessages.toLocaleString()}
                                    </h3>
                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Messages</p>
                                </motion.div>

                                <motion.div whileHover={{ scale: 1.02 }} className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-3 rounded-lg ${darkMode ? 'bg-orange-900' : 'bg-orange-100'}`}>
                                            <Cpu className="text-orange-600" size={24} />
                                        </div>
                                        <span className={`text-sm font-medium ${stats.usagePercent > 80 ? 'text-red-500' : 'text-green-500'}`}>
                                            {stats.usagePercent.toFixed(1)}%
                                        </span>
                                    </div>
                                    <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {stats.userTier}
                                    </h3>
                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Usage Plan</p>
                                </motion.div>
                            </div>

                            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Performance Metrics
                                    </h3>
                                    <select 
                                        value={timeRange}
                                        onChange={(e) => setTimeRange(e.target.value)}
                                        className={`px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
                                    >
                                        <option value="1h">Last Hour</option>
                                        <option value="6h">Last 6 Hours</option>
                                        <option value="24h">Last 24 Hours</option>
                                        <option value="7d">Last 7 Days</option>
                                    </select>
                                </div>
                                
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={performanceData}>
                                            <defs>
                                                <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                                                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
                                            <XAxis dataKey="time" stroke={darkMode ? '#9CA3AF' : '#6B7280'} />
                                            <YAxis stroke={darkMode ? '#9CA3AF' : '#6B7280'} />
                                            <Tooltip 
                                                contentStyle={{ 
                                                    backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    color: darkMode ? '#F3F4F6' : '#111827'
                                                }} 
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="tokens"
                                                stroke="#8B5CF6"
                                                fillOpacity={1}
                                                fill="url(#colorTokens)"
                                                strokeWidth={2}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="requests"
                                                stroke="#10B981"
                                                strokeWidth={2}
                                                dot={false}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'channels' && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Channel Status
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {channels.map((channel, index) => (
                                    <motion.div
                                        key={channel.type}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {channel.type}
                                            </h3>
                                            <div className={`w-3 h-3 rounded-full ${getStatusColor(channel.status)}`}></div>
                                        </div>
                                        
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Status</span>
                                                <span className={`text-sm font-medium ${getStatusColor(channel.status)}`}>
                                                    {channel.status.toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Messages</span>
                                                <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    {channel.messageCount?.toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Errors</span>
                                                <span className={`text-sm font-medium text-red-500`}>
                                                    {channel.errorCount}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <button className={`w-full mt-4 px-4 py-2 rounded-lg ${
                                            darkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'
                                        } text-white transition-colors`}>
                                            Configure
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'skills' && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Skills Platform
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {skills.map((skill, index) => (
                                    <motion.div
                                        key={skill.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {skill.name}
                                            </h3>
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                skill.category === 'utility' ? 'bg-blue-100 text-blue-800' :
                                                skill.category === 'productivity' ? 'bg-green-100 text-green-800' :
                                                skill.category === 'automation' ? 'bg-purple-100 text-purple-800' :
                                                'bg-orange-100 text-orange-800'
                                            }`}>
                                                {skill.category}
                                            </span>
                                        </div>
                                        
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Executions</span>
                                                <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    {skill.executionCount}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Success Rate</span>
                                                <span className={`text-sm font-medium text-green-500`}>
                                                    {skill.successRate.toFixed(1)}%
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Avg Latency</span>
                                                <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    {skill.averageLatency}s
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${skill.successRate}%` }}
                                            ></div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </main>

                <aside className={`w-96 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-l ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex flex-col`}>
                    <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                AI Assistant
                            </h3>
                            <select
                                value={selectedModel}
                                onChange={(e) => setSelectedModel(e.target.value)}
                                className={`px-3 py-1 text-sm rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
                            >
                                <option value="openrouter/anthropic/claude-sonnet-4-5">Claude Sonnet 4.5</option>
                                <option value="openrouter/anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet</option>
                                <option value="openrouter/openai/gpt-4">GPT-4</option>
                            </select>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        <AnimatePresence>
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                                            message.role === 'user'
                                                ? 'bg-purple-600 text-white'
                                                : darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                                        }`}
                                    >
                                        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                                        {message.timestamp && (
                                            <p className={`text-xs mt-1 ${
                                                message.role === 'user' ? 'text-purple-200' : darkMode ? 'text-gray-400' : 'text-gray-500'
                                            }`}>
                                                {message.timestamp.toLocaleTimeString()}
                                            </p>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        
                        {isLoading && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                                <div className={`px-4 py-3 rounded-2xl ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Type your message..."
                                disabled={connectionStatus !== 'connected' || isLoading}
                                className={`flex-1 px-4 py-3 rounded-lg ${
                                    darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                                } focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50`}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={connectionStatus !== 'connected' || isLoading || !inputText.trim()}
                                className={`px-4 py-3 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                            >
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
