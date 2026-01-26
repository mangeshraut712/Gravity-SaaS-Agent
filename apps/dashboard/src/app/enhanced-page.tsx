'use client';

import React, { useState, useEffect } from 'react';
import {
    Zap, Activity, Cpu, Settings, ArrowRight, Command,
    BarChart2, Globe, Shield, Search, AlertTriangle, CheckCircle,
    MessageSquare, Users, Bot, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';

interface Message { 
    role: 'user' | 'assistant'; 
    text: string; 
    timestamp?: Date;
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
}

interface ChannelStatus {
    totalChannels: number;
    connectedChannels: number;
    channelTypes: string[];
}

interface SkillStats {
    totalSkills: number;
    totalWorkspaces: number;
    totalExecutions: number;
    executionsByStatus: Record<string, number>;
    skillsByCategory: Record<string, number>;
}

export default function EnhancedDashboard() {
    const [data, setData] = useState(() =>
        Array.from({ length: 15 }, (_, i) => ({
            time: `${10 + i}:00`,
            tokens: Math.floor(Math.random() * 5000) + 2000,
            cost: Math.floor(Math.random() * 2000) + 1000
        }))
    );
    
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', text: "🦞 GravityBot Enhanced with Clawdbot-inspired features! Multi-channel support and skills platform active." },
        { role: 'assistant', text: "Ready to assist across WhatsApp, Telegram, Slack, and more!" }
    ]);

    const [stats, setStats] = useState<SystemStats>({
        status: 'offline',
        activeSessions: 0,
        mcpTools: 0,
        uptime: 0,
        userTier: 'PRO',
        usagePercent: 0,
        memoryUsage: { rss: 0, heapUsed: 0, heapTotal: 0 }
    });

    const [channelStats, setChannelStats] = useState<ChannelStatus>({
        totalChannels: 0,
        connectedChannels: 0,
        channelTypes: []
    });

    const [skillStats, setSkillStats] = useState<SkillStats>({
        totalSkills: 0,
        totalWorkspaces: 0,
        totalExecutions: 0,
        executionsByStatus: {},
        skillsByCategory: {}
    });

    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
    const [activeTab, setActiveTab] = useState<'overview' | 'channels' | 'skills'>('overview');

    // Enhanced stats fetching with multi-channel and skills data
    useEffect(() => {
        const fetchStats = async () => {
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
                        setStats(json.data);
                        setConnectionStatus('connected');
                    }
                }

                // Handle channel stats
                if (channelRes.status === 'fulfilled' && channelRes.value.ok) {
                    const json = await channelRes.value.json();
                    if (json.success && json.data) {
                        setChannelStats(json.data.stats);
                    }
                }

                // Handle skills stats
                if (skillsRes.status === 'fulfilled' && skillsRes.value.ok) {
                    const json = await skillsRes.value.json();
                    if (json.success && json.data) {
                        setSkillStats(json.data.stats);
                    }
                }

            } catch (e) {
                console.error('Stats fetch error:', e);
                setStats(s => ({ ...s, status: 'offline' }));
                setConnectionStatus('error');
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, 3000);
        return () => clearInterval(interval);
    }, []);

    // Enhanced data simulation
    useEffect(() => {
        const interval = setInterval(() => {
            setData((prev: any) => {
                const newData = [...prev.slice(1)];
                const lastTokens = prev[prev.length - 1].tokens;
                const variation = (Math.random() - 0.5) * 1000;
                newData.push({
                    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                    tokens: Math.max(1000, lastTokens + variation),
                    cost: Math.max(500, Math.floor(Math.random() * 2500) + 1000)
                });
                return newData;
            });
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const handleSend = async () => {
        if (!inputText.trim()) return;
        
        const userMsg = inputText;
        const newMsg: Message = { role: 'user', text: userMsg, timestamp: new Date() };
        setMessages((prev: Message[]) => [...prev, newMsg]);
        setInputText('');

        try {
            const res = await fetch('http://localhost:3003/api/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: 'dashboard-user', text: userMsg })
            });

            if (res.ok) {
                const json = await res.json();
                if (json.success && json.data) {
                    setMessages((prev: Message[]) => [...prev, { 
                        role: 'assistant', 
                        text: json.data.reply,
                        timestamp: new Date()
                    }]);
                } else {
                    throw new Error(json.error || 'Invalid response format');
                }
            } else {
                throw new Error(`HTTP ${res.status}: Gateway rejected request`);
            }
        } catch (e) {
            console.error('Message send error:', e);
            setMessages((prev: Message[]) => [...prev, { 
                role: 'assistant', 
                text: `❌ Error: ${e instanceof Error ? e.message : 'Could not reach Gateway'}`,
                timestamp: new Date()
            }]);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'online': return '#10B981';
            case 'offline': return '#EF4444';
            case 'degraded': return '#F59E0B';
            default: return '#6B7280';
        }
    };

    const getConnectionIcon = () => {
        switch (connectionStatus) {
            case 'connected': return <CheckCircle size={16} color="#10B981" />;
            case 'error': return <AlertTriangle size={16} color="#EF4444" />;
            default: return <Activity size={16} color="#6B7280" />;
        }
    };

    // Prepare chart data
    const skillCategoryData = Object.entries(skillStats.skillsByCategory).map(([category, count], index) => ({
        name: category.charAt(0).toUpperCase() + category.slice(1),
        value: count as number,
        color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5]
    }));

    const executionStatusData = Object.entries(skillStats.executionsByStatus).map(([status, count]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: count as number,
        color: status === 'completed' ? '#10B981' : status === 'failed' ? '#EF4444' : '#F59E0B'
    }));

    return (
        <div className="layout">
            {/* Enhanced Sidebar */}
            <nav className="sidebar">
                <div>
                    <div className="brand">
                        <div className="brand-icon"><Zap size={20} fill="currentColor" /></div>
                        <div>
                            <h2 style={{ fontSize: '18px', fontWeight: 700 }}>GravityBot</h2>
                            <p style={{ fontSize: '12px', color: '#888' }}>Enhanced Intelligence</p>
                        </div>
                    </div>

                    <div className="nav-group">
                        <div 
                            className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                            onClick={() => setActiveTab('overview')}
                        >
                            <Activity size={18} /> Overview
                        </div>
                        <div 
                            className={`nav-link ${activeTab === 'channels' ? 'active' : ''}`}
                            onClick={() => setActiveTab('channels')}
                        >
                            <MessageSquare size={18} /> Channels
                        </div>
                        <div 
                            className={`nav-link ${activeTab === 'skills' ? 'active' : ''}`}
                            onClick={() => setActiveTab('skills')}
                        >
                            <Bot size={18} /> Skills
                        </div>
                    </div>
                </div>

                <div className="nav-link"><Settings size={18} /> System Config</div>
            </nav>

            {/* Main Content */}
            <main className="main">
                <header className="header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <h1>Enhanced Command Center</h1>
                        {getConnectionIcon()}
                    </div>
                    <p>Multi-channel AI assistant with skills platform - Powered by Clawdbot-inspired architecture</p>
                </header>

                {activeTab === 'overview' && (
                    <div className="bento-grid">
                        {/* Enhanced Main Chart Card */}
                        <motion.div
                            className="bento-card bento-large"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Token Velocity & Performance</h3>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#000', padding: '4px 10px', background: '#F5F5F7', borderRadius: '100px' }}>
                                        {stats.activeSessions} Sessions
                                    </span>
                                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#888', padding: '4px 10px', background: '#F5F5F7', borderRadius: '100px' }}>
                                        $/hr: $0.42
                                    </span>
                                </div>
                            </div>
                            <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data}>
                                        <defs>
                                            <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#000" stopOpacity={0.2} />
                                                <stop offset="95%" stopColor="#000" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="tokens"
                                            stroke="#000"
                                            fillOpacity={1}
                                            fill="url(#colorTokens)"
                                            strokeWidth={2}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="cost"
                                            stroke="#CCC"
                                            fill="none"
                                            strokeWidth={2}
                                            strokeDasharray="4 4"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        {/* Multi-Channel Status Card */}
                        <motion.div
                            className="bento-card"
                            whileHover={{ scale: 1.02 }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ background: '#F0F9FF', padding: '10px', borderRadius: '12px', color: '#007AFF' }}>
                                    <MessageSquare size={24} />
                                </div>
                                <ArrowRight size={20} color="#CCC" />
                            </div>
                            <div style={{ marginTop: 'auto' }}>
                                <p style={{ color: '#888', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase' }}>Channels</p>
                                <h2 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.03em' }}>
                                    {channelStats.connectedChannels}/{channelStats.totalChannels}
                                </h2>
                                <p style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
                                    {channelStats.channelTypes.join(', ')}
                                </p>
                            </div>
                        </motion.div>

                        {/* Skills Platform Card */}
                        <motion.div
                            className="bento-card"
                            whileHover={{ scale: 1.02 }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ background: '#F0FDF4', padding: '10px', borderRadius: '12px', color: '#10B981' }}>
                                    <Bot size={24} />
                                </div>
                                <ArrowRight size={20} color="#CCC" />
                            </div>
                            <div style={{ marginTop: 'auto' }}>
                                <p style={{ color: '#888', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase' }}>Skills</p>
                                <h2 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.03em' }}>
                                    {skillStats.totalSkills}
                                </h2>
                                <p style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
                                    {skillStats.totalExecutions} executions
                                </p>
                            </div>
                        </motion.div>

                        {/* System Status Card */}
                        <motion.div
                            className="bento-card"
                            whileHover={{ scale: 1.02 }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ background: '#FFF0F5', padding: '10px', borderRadius: '12px', color: '#F72585' }}>
                                    <Shield size={24} />
                                </div>
                                <ArrowRight size={20} color="#CCC" />
                            </div>
                            <div style={{ marginTop: 'auto' }}>
                                <p style={{ color: '#888', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase' }}>System</p>
                                <h2 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.03em', color: getStatusColor(stats.status) }}>
                                    {stats.status.toUpperCase()}
                                </h2>
                                <p style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
                                    Uptime: {Math.floor(stats.uptime / 3600)}h {Math.floor((stats.uptime % 3600) / 60)}m
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}

                {activeTab === 'channels' && (
                    <div className="bento-grid">
                        <motion.div
                            className="bento-card bento-large"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Multi-Channel Status</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                                {channelStats.channelTypes.map((channel: string, index: number) => (
                                    <div key={channel} style={{ 
                                        padding: '16px', 
                                        background: '#F8F9FA', 
                                        borderRadius: '12px',
                                        border: '1px solid #E5E7EB'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                            <div style={{ 
                                                width: '8px', 
                                                height: '8px', 
                                                borderRadius: '50%', 
                                                background: index < channelStats.connectedChannels ? '#10B981' : '#EF4444' 
                                            }} />
                                            <span style={{ fontWeight: 600 }}>{channel}</span>
                                        </div>
                                        <p style={{ fontSize: '12px', color: '#666' }}>
                                            {index < channelStats.connectedChannels ? 'Connected' : 'Disconnected'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}

                {activeTab === 'skills' && (
                    <div className="bento-grid">
                        <motion.div
                            className="bento-card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Skills by Category</h3>
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={skillCategoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {skillCategoryData.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </motion.div>

                        <motion.div
                            className="bento-card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Execution Status</h3>
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={executionStatusData}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#3B82F6" />
                                </BarChart>
                            </ResponsiveContainer>
                        </motion.div>
                    </div>
                )}
            </main>

            {/* Enhanced Chat Panel */}
            <aside className="chat-panel">
                <div className="chat-header">
                    <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Live Feed</h3>
                    <div className="status-badge">
                        <span className="status-dot"></span>
                        {connectionStatus === 'connected' ? 'CONNECTED' : connectionStatus.toUpperCase()}
                    </div>
                </div>

                <div className="messages">
                    <AnimatePresence>
                        {messages.map((m: Message, i: number) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                className={`msg-bubble ${m.role === 'user' ? 'msg-user' : 'msg-ai'}`}
                            >
                                {m.text}
                                {m.timestamp && (
                                    <span style={{ fontSize: '10px', opacity: 0.6, marginLeft: '8px' }}>
                                        {m.timestamp.toLocaleTimeString()}
                                    </span>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <div className="input-zone">
                    <input
                        className="chat-input"
                        placeholder="Type command or query..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        disabled={connectionStatus !== 'connected'}
                    />
                    <button 
                        className="send-btn" 
                        onClick={handleSend}
                        disabled={connectionStatus !== 'connected'}
                        style={{ opacity: connectionStatus === 'connected' ? 1 : 0.5 }}
                    >
                        <ArrowRight size={20} />
                    </button>
                </div>
            </aside>
        </div>
    );
}
